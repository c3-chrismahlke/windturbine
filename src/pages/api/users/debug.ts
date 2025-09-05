import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    // Check if user is authenticated
    const session = await getServerSession(req, res, authOptions);
    if (!session) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    // Check if user has admin role (only admins can see debug info)
    const userRoles = (session.user as any)?.roles || [];
    if (!userRoles.includes('admin')) {
      return res.status(403).json({ message: 'Forbidden - Admin access required' });
    }

    // Fetch all users with detailed information
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

    // Also get all roles
    const allRoles = await prisma.role.findMany();

    // Get all user roles
    const allUserRoles = await prisma.userRole.findMany({
      include: {
        user: true,
        role: true,
      },
    });

    return res.status(200).json({
      users: users.map(user => ({
        id: user.id,
        email: user.email,
        name: user.name,
        image: user.image,
        githubId: user.githubId,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
        roles: user.roles.map(userRole => ({
          id: userRole.role.id,
          name: userRole.role.name
        })),
        rolesCount: user.roles.length,
      })),
      allRoles: allRoles.map(role => ({
        id: role.id,
        name: role.name
      })),
      allUserRoles: allUserRoles.map(userRole => ({
        userId: userRole.userId,
        roleId: userRole.roleId,
        userName: userRole.user.name || userRole.user.email,
        roleName: userRole.role.name,
      })),
      totalUsers: users.length,
      totalRoles: allRoles.length,
      totalUserRoles: allUserRoles.length,
      usersWithoutRoles: users.filter(user => user.roles.length === 0).map(user => ({
        id: user.id,
        name: user.name,
        email: user.email,
      })),
    });
  } catch (error) {
    console.error('Error in debug API:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}
