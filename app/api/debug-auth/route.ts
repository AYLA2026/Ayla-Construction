import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyPassword } from '@/lib/auth'

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const email = searchParams.get('email') || 'admin@ayla.com'

    const user = await prisma.user.findUnique({ where: { email } })
    if (!user) {
      return NextResponse.json({ 
        found: false, 
        email,
        allUsers: await prisma.user.findMany({ select: { email: true, role: true } })
      })
    }

    const tests = ['admin123', 'manager123', 'user123']
    const results = []
    for (const test of tests) {
      const valid = await verifyPassword(test, user.password || '')
      results.push({ password: test, valid })
    }

    return NextResponse.json({
      found: true,
      email: user.email,
      name: user.name,
      role: user.role,
      hasPassword: !!user.password,
      passwordLength: user.password?.length || 0,
      looksLikeBcrypt: user.password?.startsWith('$2') || false,
      tests,
      allUsers: await prisma.user.findMany({ select: { email: true, role: true } })
    })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
