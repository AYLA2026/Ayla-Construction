import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { hashPassword } from '@/lib/auth'

export async function GET() {
  try {
    // Always delete existing default users to ensure fresh bcrypt passwords
    const deleted = await prisma.user.deleteMany({
      where: { email: { in: ['admin@ayla.com', 'manager@ayla.com', 'user@ayla.com'] } }
    })

    const users = [
      { name: 'مدير النظام', email: 'admin@ayla.com', password: 'admin123', role: 'admin' },
      { name: 'مدير المشروع', email: 'manager@ayla.com', password: 'manager123', role: 'manager' },
      { name: 'مستخدم', email: 'user@ayla.com', password: 'user123', role: 'user' },
    ]

    for (const u of users) {
      await prisma.user.create({
        data: { name: u.name, email: u.email, password: await hashPassword(u.password), role: u.role }
      })
    }

    return NextResponse.json({ message: 'Setup complete', created: users.length, deleted: deleted.count })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
