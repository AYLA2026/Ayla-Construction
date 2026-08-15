import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    await prisma.villa.createMany({
      data: [
        { name: 'فيلا الرياض 1', location: 'الرياض', status: 'متوفر', price: 2500000, area: 450, rooms: 5 },
        { name: 'فيلا جدة 2', location: 'جدة', status: 'مباع', price: 3200000, area: 520, rooms: 6 },
        { name: 'فيلا الدمام 3', location: 'الدمام', status: 'محجوز', price: 1800000, area: 380, rooms: 4 },
      ]
    })
    await prisma.contractor.createMany({
      data: [
        { name: 'مؤسسة البناء الذهبي', type: 'مقاول', phone: '0500000001', specialty: 'إنشاءات' },
        { name: 'شركة الكهرباء الحديثة', type: 'مورد', phone: '0500000002', specialty: 'كهرباء' },
      ]
    })
    await prisma.budget.createMany({
      data: [
        { category: 'إنشاءات', allocated: 5000000, spent: 1200000, remaining: 3800000 },
        { category: 'تشطيبات', allocated: 2000000, spent: 500000, remaining: 1500000 },
        { category: 'كهرباء', allocated: 800000, spent: 200000, remaining: 600000 },
        { category: 'سباكة', allocated: 600000, spent: 150000, remaining: 450000 },
      ]
    })
    return NextResponse.json({ message: 'Seed complete' })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
