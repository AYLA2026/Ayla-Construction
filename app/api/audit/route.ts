import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth/next'

export async function GET() {
  const session = await getServerSession() as any
  if (!session || session.user?.role !== 'admin') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
  }
  const logs = await prisma.auditLog.findMany({ orderBy: { createdAt: 'desc' }, take: 200 })
  return NextResponse.json(logs)
}
