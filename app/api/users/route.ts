import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { hashPassword } from '@/lib/auth'
import { getServerSession } from 'next-auth/next'

export async function GET() {
  const session = await getServerSession() as any
  if (!session || session.user?.role !== 'admin') return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
  const users = await prisma.user.findMany({ select: { id: true, name: true, email: true, role: true, createdAt: true } })
  return NextResponse.json(users)
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { name, email, password, role } = body
    if (!name || !email || !password) return NextResponse.json({ error: 'Missing fields' }, { status: 400 })
    const existing = await prisma.user.findUnique({ where: { email } })
    if (existing) return NextResponse.json({ error: 'Email exists' }, { status: 400 })
    const user = await prisma.user.create({
      data: { name, email, password: await hashPassword(password), role: role || 'user' }
    })
    return NextResponse.json(user)
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function PUT(req: Request) {
  try {
    const body = await req.json()
    const { id, name, email, role } = body
    const user = await prisma.user.update({ where: { id }, data: { name, email, role } })
    return NextResponse.json(user)
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function DELETE(req: Request) {
  try {
    const { id } = await req.json()
    await prisma.user.delete({ where: { id } })
    return NextResponse.json({ success: true })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
