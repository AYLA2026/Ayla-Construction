import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  const villas = await prisma.villa.findMany({ orderBy: { createdAt: 'desc' } })
  return NextResponse.json(villas)
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const villa = await prisma.villa.create({ data: body })
    return NextResponse.json(villa)
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function PUT(req: Request) {
  try {
    const { id, ...data } = await req.json()
    const villa = await prisma.villa.update({ where: { id }, data })
    return NextResponse.json(villa)
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function DELETE(req: Request) {
  try {
    const { id } = await req.json()
    await prisma.villa.delete({ where: { id } })
    return NextResponse.json({ success: true })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
