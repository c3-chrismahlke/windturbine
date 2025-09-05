const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function fixUserRoles() {
  try {
    console.log('🔍 Checking for users without roles...');

    // Ensure all base roles exist
    const baseRoles = ['admin', 'manager', 'operator', 'technician', 'viewer'];
    console.log('📝 Ensuring base roles exist...');
    
    for (const roleName of baseRoles) {
      await prisma.role.upsert({
        where: { name: roleName },
        update: {},
        create: { name: roleName }
      });
      console.log(`✅ Role '${roleName}' ensured`);
    }

    // Get all users with their roles
    const users = await prisma.user.findMany({
      include: {
        roles: {
          include: {
            role: true
          }
        }
      }
    });

    console.log(`👥 Found ${users.length} users`);

    // Get the viewer role
    const viewerRole = await prisma.role.findUnique({
      where: { name: 'viewer' }
    });

    if (!viewerRole) {
      throw new Error('Viewer role not found');
    }

    // Find users without roles
    const usersWithoutRoles = users.filter(user => user.roles.length === 0);
    
    console.log(`⚠️  Found ${usersWithoutRoles.length} users without roles`);

    if (usersWithoutRoles.length > 0) {
      console.log('🔧 Assigning viewer role to users without roles...');
      
      for (const user of usersWithoutRoles) {
        await prisma.userRole.create({
          data: {
            userId: user.id,
            roleId: viewerRole.id
          }
        });
        console.log(`✅ Assigned viewer role to user: ${user.name || user.email || user.id}`);
      }
    }

    // Final check
    const finalUsers = await prisma.user.findMany({
      include: {
        roles: {
          include: {
            role: true
          }
        }
      }
    });

    const finalUsersWithoutRoles = finalUsers.filter(user => user.roles.length === 0);
    
    if (finalUsersWithoutRoles.length === 0) {
      console.log('�� All users now have at least one role!');
    } else {
      console.log(`❌ ${finalUsersWithoutRoles.length} users still without roles`);
    }

    // Show summary
    console.log('\n📊 User Role Summary:');
    for (const user of finalUsers) {
      const roleNames = user.roles.map(ur => ur.role.name).join(', ');
      console.log(`  ${user.name || user.email || user.id}: [${roleNames}]`);
    }

  } catch (error) {
    console.error('❌ Error fixing user roles:', error);
  } finally {
    await prisma.$disconnect();
  }
}

fixUserRoles();
