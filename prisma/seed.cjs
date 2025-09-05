// CommonJS seed runner to avoid ESM loader issues
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const roles = ['admin','manager','operator','technician','viewer'];
  for (const r of roles) {
    await prisma.role.upsert({ where: { name: r }, update: {}, create: { name: r } });
  }
  if (process.env.SEED_ADMIN_EMAIL) {
    const admin = await prisma.user.upsert({
      where: { email: process.env.SEED_ADMIN_EMAIL },
      update: {},
      create: {
        email: process.env.SEED_ADMIN_EMAIL,
        roles: { create: [{ role: { connect: { name: 'admin' } } }] },
      },
    });
    console.log('Seeded admin:', admin.email);
  }
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });


