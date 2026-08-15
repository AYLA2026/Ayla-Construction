import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { hashPassword } from '@/lib/auth'

export async function GET() {
  try {
    await prisma.user.deleteMany({ where: { email: 'admin@ayla.com' } })
    const user = await prisma.user.create({
      data: {
        name: 'مدير النظام',
        email: 'admin@ayla.com',
        password: await hashPassword('admin123'),
        role: 'admin'
      }
    })
    return NextResponse.json({ 
      message: 'Admin user reset successfully',
      email: user.email,
      role: user.role,
      testPassword: 'admin123'
    })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
