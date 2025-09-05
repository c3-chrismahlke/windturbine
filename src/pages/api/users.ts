import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth/next';
import { authOptions } from './auth/[...nextauth]';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    // Check if user is authenticated
    const session = await getServerSession(req, res, authOptions);
    if (!session) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    // Check if user has admin or manager role
    const userRoles = (session.user as any)?.roles || [];
    if (!userRoles.includes('admin') && !userRoles.includes('manager')) {
      return res.status(403).json({ message: 'Forbidden - Admin or Manager access required' });
    }

    if (req.method === 'GET') {
      // Fetch all users with their roles
      const users = await prisma.user.findMany({
        include: {
          roles: {
            include: {
              role: true,
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
      });

      // Ensure all base roles exist
      const baseRoles = ['admin', 'manager', 'operator', 'technician', 'viewer'];
      await Promise.all(baseRoles.map((roleName) => 
        prisma.role.upsert({ 
          where: { name: roleName as any }, 
          update: {}, 
          create: { name: roleName as any } 
        })
      ));

      // Get the viewer role for users without roles
      const viewerRole = await prisma.role.findUnique({
        where: { name: 'viewer' }
      });

      // Transform the data to include role names directly
      const transformedUsers = users.map(user => {
        const userRoles = user.roles.map(userRole => userRole.role.name);
        
        // If user has no roles, assign viewer role
        if (userRoles.length === 0 && viewerRole) {
          // Create the user-role relationship
          prisma.userRole.create({
            data: {
              userId: user.id,
              roleId: viewerRole.id
            }
          }).catch(console.error); // Don't block the response if this fails
          
          userRoles.push('viewer');
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          image: user.image,
          githubId: user.githubId,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt,
          roles: userRoles,
        };
      });

      return res.status(200).json(transformedUsers);
    }

    if (req.method === 'PATCH') {
      // Only admins can modify user roles
      if (!userRoles.includes('admin')) {
        return res.status(403).json({ message: 'Forbidden - Admin access required for role modifications' });
      }

      const { userId, roles } = req.body;

      if (!userId || !Array.isArray(roles)) {
        return res.status(400).json({ message: 'userId and roles array are required' });
      }

      // Validate roles
      const validRoles = ['admin', 'manager', 'operator', 'technician', 'viewer'];
      const invalidRoles = roles.filter(role => !validRoles.includes(role));
      if (invalidRoles.length > 0) {
        return res.status(400).json({ message: `Invalid roles: ${invalidRoles.join(', ')}` });
      }

      // Check if user exists
      const user = await prisma.user.findUnique({
        where: { id: userId },
        include: { roles: { include: { role: true } } }
      });

      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      // Prevent users from removing their own admin role
      if (user.id === session.user?.id && !roles.includes('admin')) {
        return res.status(400).json({ message: 'Cannot remove your own admin role' });
      }

      // Get role IDs for the new roles
      const roleRecords = await prisma.role.findMany({
        where: { name: { in: roles } }
      });

      if (roleRecords.length !== roles.length) {
        return res.status(400).json({ message: 'Some roles do not exist' });
      }

      // Update user roles
      await prisma.$transaction(async (tx) => {
        // Remove all existing roles
        await tx.userRole.deleteMany({
          where: { userId }
        });

        // Add new roles
        await tx.userRole.createMany({
          data: roleRecords.map(role => ({
            userId,
            roleId: role.id
          }))
        });
      });

      // Fetch updated user data
      const updatedUser = await prisma.user.findUnique({
        where: { id: userId },
        include: {
          roles: {
            include: {
              role: true,
            },
          },
        },
      });

      const transformedUser = {
        id: updatedUser!.id,
        email: updatedUser!.email,
        name: updatedUser!.name,
        image: updatedUser!.image,
        githubId: updatedUser!.githubId,
        createdAt: updatedUser!.createdAt,
        updatedAt: updatedUser!.updatedAt,
        roles: updatedUser!.roles.map(userRole => userRole.role.name),
      };

      return res.status(200).json(transformedUser);
    }

    if (req.method === 'DELETE') {
      // Only admins can delete users
      if (!userRoles.includes('admin')) {
        return res.status(403).json({ message: 'Forbidden - Admin access required for user deletion' });
      }

      const { userId } = req.body;

      if (!userId) {
        return res.status(400).json({ message: 'userId is required' });
      }

      // Check if user exists
      const user = await prisma.user.findUnique({
        where: { id: userId },
        include: { roles: { include: { role: true } } }
      });

      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      // Prevent users from deleting themselves
      if (user.id === session.user?.id) {
        return res.status(400).json({ message: 'Cannot delete your own account' });
      }

      // Check if this is the last admin user
      const adminUsers = await prisma.user.findMany({
        where: {
          roles: {
            some: {
              role: {
                name: 'admin'
              }
            }
          }
        }
      });

      const isLastAdmin = adminUsers.length === 1 && adminUsers[0].id === userId;
      if (isLastAdmin) {
        return res.status(400).json({ message: 'Cannot delete the last admin user' });
      }

      // Delete the user (this will cascade delete user roles due to the schema)
      await prisma.user.delete({
        where: { id: userId }
      });

      return res.status(200).json({ message: 'User deleted successfully' });
    }

    return res.status(405).json({ message: 'Method not allowed' });
  } catch (error) {
    console.error('Error in users API:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}
