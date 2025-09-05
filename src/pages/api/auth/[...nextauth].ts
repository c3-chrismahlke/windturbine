import NextAuth, { type NextAuthOptions } from "next-auth";
import GitHubProvider from "next-auth/providers/github";
import type { JWT } from "next-auth/jwt";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const authOptions: NextAuthOptions = {
  session: { strategy: 'jwt' },
  providers: [
    GitHubProvider({
      clientId: process.env.GITHUB_ID!,
      clientSecret: process.env.GITHUB_SECRET!,
      authorization: { params: { scope: 'read:user read:org' } },
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: '/sign-in',
  },
  callbacks: {
    async jwt({ token, user, account }): Promise<JWT> {
      // Persist/fetch roles from Prisma
      // On first sign-in, create user if missing and make first user admin
      if (account && user) {
        const githubId = account.providerAccountId ?? null;
        let dbUser = await prisma.user.findFirst({
          where: { OR: [{ githubId }, { email: user.email ?? undefined }] },
          include: { roles: { include: { role: true } } },
        });

        if (!dbUser) {
          const count = await prisma.user.count();
          const isFirst = count === 0;
          if (isFirst) {
            await prisma.role.upsert({ where: { name: 'admin' as any }, update: {}, create: { name: 'admin' as any } });
          }
          // ensure base roles exist
          const base = ['admin','manager','operator','technician','viewer'] as const;
          await Promise.all(base.map((r) => prisma.role.upsert({ where: { name: r as any }, update: {}, create: { name: r as any } })));

          dbUser = await prisma.user.create({
            data: {
              email: user.email,
              name: user.name,
              image: user.image,
              githubId,
              roles: {
                create: [{ role: { connect: { name: (isFirst ? 'admin' : 'viewer') as any } } }],
              },
            },
            include: { roles: { include: { role: true } } },
          });
        }

        token.userId = dbUser.id;
        token.roles = dbUser.roles.map((r: { role: { name: string } }) => r.role.name);
      }

      // Refresh roles on subsequent runs
      if (token.userId) {
        const dbUser = await prisma.user.findUnique({
          where: { id: token.userId as string },
          include: { roles: { include: { role: true } } },
        });
        token.roles = (dbUser?.roles || []).map((r: { role: { name: string } }) => r.role.name);
      }
      if (!token.roles || !(token.roles as string[]).length) token.roles = ['viewer'];
      return token;
    },
    async session({ session, token }) {
      (session.user as any).roles = (token as any).roles || ['viewer'];
      // Keep a single role for places expecting 'role'
      (session.user as any).role = ((token as any).roles?.[0]) || 'viewer';
      return session;
    },
  },
};

export default NextAuth(authOptions);
