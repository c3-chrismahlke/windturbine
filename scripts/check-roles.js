const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function checkRoles() {
  try {
    console.log('🔍 Checking all roles in database...');

    // Get all roles
    const allRoles = await prisma.role.findMany({
      include: {
        users: {
          include: {
            user: true
          }
        }
      }
    });

    console.log(`📝 Found ${allRoles.length} roles:`);
    for (const role of allRoles) {
      console.log(`  - "${role.name}" (${role.users.length} users)`);
      for (const userRole of role.users) {
        const user = userRole.user;
        console.log(`    └─ ${user.name || user.email || user.id}`);
      }
    }

    // Check for invalid roles
    const validRoles = ['admin', 'manager', 'operator', 'technician', 'viewer'];
    const invalidRoles = allRoles.filter(role => !validRoles.includes(role.name));
    
    if (invalidRoles.length > 0) {
      console.log(`\n⚠️  Found ${invalidRoles.length} invalid roles:`);
      for (const role of invalidRoles) {
        console.log(`  - "${role.name}" (${role.users.length} users)`);
      }
      
      console.log('\n🔧 Would you like to fix these roles? (This will rename "user" to "viewer")');
      
      // Auto-fix "user" role to "viewer"
      const userRole = invalidRoles.find(role => role.name === 'user');
      if (userRole) {
        console.log('🔧 Fixing "user" role to "viewer"...');
        
        // Get or create viewer role
        const viewerRole = await prisma.role.upsert({
          where: { name: 'viewer' },
          update: {},
          create: { name: 'viewer' }
        });
        
        // Move all users from "user" role to "viewer" role
        for (const userRoleRelation of userRole.users) {
          await prisma.userRole.create({
            data: {
              userId: userRoleRelation.userId,
              roleId: viewerRole.id
            }
          });
        }
        
        // Delete the old "user" role
        await prisma.role.delete({
          where: { id: userRole.id }
        });
        
        console.log('✅ Fixed "user" role to "viewer"');
      }
    } else {
      console.log('\n✅ All roles are valid!');
    }

    // Final summary
    const finalRoles = await prisma.role.findMany({
      include: {
        users: {
          include: {
            user: true
          }
        }
      }
    });

    console.log('\n📊 Final Role Summary:');
    for (const role of finalRoles) {
      console.log(`  "${role.name}": ${role.users.length} users`);
    }

  } catch (error) {
    console.error('❌ Error checking roles:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkRoles();
