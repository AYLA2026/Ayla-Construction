import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth/next'

export async function GET() {
  const items = await prisma.setting.findMany({ orderBy: { key: 'asc' } })
  return NextResponse.json(items)
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession() as any
    if (!session || session.user?.role !== 'admin') return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
    const body = await req.json()
    const item = await prisma.setting.create({ data: body })
    return NextResponse.json(item)
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function PUT(req: Request) {
  try {
    const { id, ...data } = await req.json()
    const item = await prisma.setting.update({ where: { id }, data })
    return NextResponse.json(item)
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function DELETE(req: Request) {
  try {
    const { id } = await req.json()
    await prisma.setting.delete({ where: { id } })
    return NextResponse.json({ success: true })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
