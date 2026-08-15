import NextAuth from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import { prisma } from '@/lib/prisma'
import { verifyPassword } from '@/lib/auth'

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          console.log('AUTH: Missing credentials')
          return null
        }
        const user = await prisma.user.findUnique({ where: { email: credentials.email } })
        if (!user) {
          console.log('AUTH: User not found:', credentials.email)
          throw new Error('User not found')
        }
        if (!user.password) {
          console.log('AUTH: No password set for:', credentials.email)
          throw new Error('No password set')
        }
        const valid = await verifyPassword(credentials.password, user.password)
        if (!valid) {
          console.log('AUTH: Invalid password for:', credentials.email)
          throw new Error('Invalid password')
        }
        console.log('AUTH: Success for:', credentials.email, 'role:', user.role)
        return { id: user.id, email: user.email, name: user.name, role: user.role }
      },
    }),
  ],
  session: { strategy: 'jwt', maxAge: 30 * 24 * 60 * 60 },
  callbacks: {
    async jwt({ token, user }) {
      if (user) { token.id = user.id; token.role = (user as any).role }
      return token
    },
    async session({ session, token }) {
      if (token) { (session.user as any).id = token.id; (session.user as any).role = token.role }
      return session
    },
  },
  pages: { signIn: '/login', error: '/login' },
  secret: process.env.NEXTAUTH_SECRET,
})

export { handler as GET, handler as POST }
