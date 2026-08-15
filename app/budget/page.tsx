'use client'

export const dynamic = 'force-dynamic'
import Sidebar from '@/components/sidebar'
import Navbar from '@/components/navbar'
import AuthGuard from '@/components/auth-guard'
import DataTable from '@/components/data-table'
import Modal from '@/components/modal'
import { useToast } from '@/components/toast-provider'
import { useState, useEffect } from 'react'
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

const COLORS = ['#C9A227', '#10B981', '#3B82F6', '#F59E0B', '#EF4444', '#8B5CF6']

export default function BudgetPage() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [modal, setModal] = useState(false)
  const [editing, setEditing] = useState<any>(null)
  const [form, setForm] = useState({ category: '', allocated: '', spent: '', remaining: '', project: '' })
  const { addToast } = useToast()

  useEffect(() => { fetchData() }, [])
  const fetchData = async () => { setLoading(true); try { const res = await fetch('/api/budget'); setItems(await res.json()) } catch {} setLoading(false) }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const body = { ...form, allocated: parseFloat(form.allocated) || 0, spent: parseFloat(form.spent) || 0, remaining: parseFloat(form.remaining) || 0, id: editing?.id }
      await fetch('/api/budget', { method: editing ? 'PUT' : 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })
      addToast(editing ? 'تم التحديث' : 'تم الإضافة', 'success')
      setModal(false); setEditing(null); setForm({ category: '', allocated: '', spent: '', remaining: '', project: '' })
      fetchData()
    } catch { addToast('حدث خطأ', 'error') }
  }

  const handleDelete = async (id: string) => { await fetch('/api/budget', { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id }) }); fetchData() }

  const totalAllocated = items.reduce((a: number, b: any) => a + (b.allocated || 0), 0)
  const totalSpent = items.reduce((a: number, b: any) => a + (b.spent || 0), 0)
  const pieData = items.map((b: any) => ({ name: b.category, value: b.spent || 0 }))
  const barData = items.map((b: any) => ({ name: b.category, allocated: b.allocated || 0, spent: b.spent || 0 }))

  const columns = [
    { key: 'category', label: 'الفئة' },
    { key: 'allocated', label: 'المخصص', render: (v: number) => v?.toLocaleString('ar-SA') + ' ر.س' },
    { key: 'spent', label: 'المنفق', render: (v: number) => v?.toLocaleString('ar-SA') + ' ر.س' },
    { key: 'remaining', label: 'المتبقي', render: (v: number) => v?.toLocaleString('ar-SA') + ' ر.س' },
  ]

  return (
    <AuthGuard>
      <div className='flex min-h-screen'>
        <Sidebar />
        <div className='flex-1 flex flex-col'>
          <Navbar title='الميزانية' />
          <main className='flex-1 p-6 space-y-6'>
            <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
              <div className='ayla-card text-center'><p className='text-2xl font-bold text-ayla-gold'>{totalAllocated.toLocaleString('ar-SA')} ر.س</p><p className='text-xs text-gray-400'>إجمالي المخصص</p></div>
              <div className='ayla-card text-center'><p className='text-2xl font-bold text-red-500'>{totalSpent.toLocaleString('ar-SA')} ر.س</p><p className='text-xs text-gray-400'>إجمالي المنفق</p></div>
              <div className='ayla-card text-center'><p className='text-2xl font-bold text-emerald-500'>{(totalAllocated - totalSpent).toLocaleString('ar-SA')} ر.س</p><p className='text-xs text-gray-400'>المتبقي</p></div>
            </div>
            <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
              <div className='ayla-card'><h3 className='text-sm font-bold text-gray-700 mb-4'>توزيع المنصرفات</h3><ResponsiveContainer width="100%" height={220}><PieChart><Pie data={pieData} cx="50%" cy="50%" outerRadius={80} dataKey="value" label>{pieData.map((_:any, i:number) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}</Pie><Tooltip /></PieChart></ResponsiveContainer></div>
              <div className='ayla-card'><h3 className='text-sm font-bold text-gray-700 mb-4'>مقارنة المخصص والمنفق</h3><ResponsiveContainer width="100%" height={220}><BarChart data={barData}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="name" /><YAxis /><Tooltip /><Bar dataKey="allocated" fill="#C9A227" radius={[4,4,0,0]} /><Bar dataKey="spent" fill="#EF4444" radius={[4,4,0,0]} /></BarChart></ResponsiveContainer></div>
            </div>
            <DataTable title='تفاصيل الميزانية' columns={columns} data={items} loading={loading}
              onAdd={() => { setEditing(null); setForm({ category: '', allocated: '', spent: '', remaining: '', project: '' }); setModal(true) }}
              onEdit={row => { setEditing(row); setForm({ ...row, allocated: String(row.allocated || ''), spent: String(row.spent || ''), remaining: String(row.remaining || '') }); setModal(true) }}
              onDelete={handleDelete}
            />
          </main>
        </div>
      </div>
      <Modal open={modal} onClose={() => setModal(false)} title={editing ? 'تعديل بند' : 'إضافة بند'}>
        <form onSubmit={handleSubmit} className='space-y-3'>
          <input className='ayla-input' placeholder='الفئة' value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} required />
          <div className='grid grid-cols-3 gap-3'>
            <input className='ayla-input' placeholder='المخصص' type='number' value={form.allocated} onChange={e => setForm({ ...form, allocated: e.target.value })} />
            <input className='ayla-input' placeholder='المنفق' type='number' value={form.spent} onChange={e => setForm({ ...form, spent: e.target.value })} />
            <input className='ayla-input' placeholder='المتبقي' type='number' value={form.remaining} onChange={e => setForm({ ...form, remaining: e.target.value })} />
          </div>
          <input className='ayla-input' placeholder='المشروع' value={form.project} onChange={e => setForm({ ...form, project: e.target.value })} />
          <button type='submit' className='ayla-btn w-full'>{editing ? 'تحديث' : 'إضافة'}</button>
        </form>
      </Modal>
    </AuthGuard>
  )
}
