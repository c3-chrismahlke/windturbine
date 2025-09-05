import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  const roles = ['admin','manager','operator','technician','viewer'] as const;
  for (const r of roles) {
    await prisma.role.upsert({ where: { name: r as any }, update: {}, create: { name: r as any } });
  }
  if (process.env.SEED_ADMIN_EMAIL) {
    const admin = await prisma.user.upsert({
      where: { email: process.env.SEED_ADMIN_EMAIL },
      update: {},
      create: {
        email: process.env.SEED_ADMIN_EMAIL,
        roles: { create: [{ role: { connect: { name: 'admin' as any } } }] },
      },
    });
    console.log('Seeded admin:', admin.email);
  }
}

main().finally(() => prisma.$disconnect());


