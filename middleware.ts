import { withAuth } from 'next-auth/middleware'
import { NextResponse } from 'next/server'

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token as any
    const path = req.nextUrl.pathname

    const adminOnly = ['/users', '/settings', '/audit']
    const managerOnly = ['/inventory', '/handover']

    if (adminOnly.some(p => path.startsWith(p)) && token?.role !== 'admin') {
      return NextResponse.redirect(new URL('/', req.url))
    }
    if (managerOnly.some(p => path.startsWith(p)) && !['admin', 'manager'].includes(token?.role)) {
      return NextResponse.redirect(new URL('/', req.url))
    }

    return NextResponse.next()
  },
  {
    callbacks: {
      authorized({ req, token }) {
        if (!token) return false
        return true
      },
    },
  }
)

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|login|signup|forgot-password|reset-password).*)'],
}
