'use client'

export const dynamic = 'force-dynamic'
import Sidebar from '@/components/sidebar'
import Navbar from '@/components/navbar'
import AuthGuard from '@/components/auth-guard'
import DataTable from '@/components/data-table'
import Modal from '@/components/modal'
import { useToast } from '@/components/toast-provider'
import { useState, useEffect } from 'react'

export default function InventoryPage() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [modal, setModal] = useState(false)
  const [editing, setEditing] = useState<any>(null)
  const [form, setForm] = useState({ name: '', quantity: '', unit: 'قطعة', location: '', minLevel: '10', status: 'متوفر' })
  const { addToast } = useToast()

  useEffect(() => { fetchData() }, [])
  const fetchData = async () => { setLoading(true); try { const res = await fetch('/api/inventory'); setItems(await res.json()) } catch {} setLoading(false) }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const body = { ...form, quantity: parseInt(form.quantity) || 0, minLevel: parseInt(form.minLevel) || 10, id: editing?.id }
      await fetch('/api/inventory', { method: editing ? 'PUT' : 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })
      addToast(editing ? 'تم التحديث' : 'تم الإضافة', 'success')
      setModal(false); setEditing(null); setForm({ name: '', quantity: '', unit: 'قطعة', location: '', minLevel: '10', status: 'متوفر' })
      fetchData()
    } catch { addToast('حدث خطأ', 'error') }
  }

  const handleDelete = async (id: string) => { await fetch('/api/inventory', { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id }) }); fetchData() }

  const columns = [
    { key: 'name', label: 'المادة' },
    { key: 'quantity', label: 'الكمية' },
    { key: 'unit', label: 'الوحدة' },
    { key: 'location', label: 'الموقع' },
    { key: 'minLevel', label: 'الحد الأدنى' },
    { key: 'status', label: 'الحالة', render: (v: string) => <span className={`px-2 py-1 rounded-full text-xs ${v === 'متوفر' ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>{v}</span> },
  ]

  return (
    <AuthGuard allowedRoles={['admin', 'manager']}>
      <div className='flex min-h-screen'>
        <Sidebar />
        <div className='flex-1 flex flex-col'>
          <Navbar title='المخزون' />
          <main className='flex-1 p-6'>
            <DataTable title='المخزون والمواد' columns={columns} data={items} loading={loading}
              onAdd={() => { setEditing(null); setForm({ name: '', quantity: '', unit: 'قطعة', location: '', minLevel: '10', status: 'متوفر' }); setModal(true) }}
              onEdit={row => { setEditing(row); setForm({ ...row, quantity: String(row.quantity || ''), minLevel: String(row.minLevel || '10') }); setModal(true) }}
              onDelete={handleDelete}
            />
          </main>
        </div>
      </div>
      <Modal open={modal} onClose={() => setModal(false)} title={editing ? 'تعديل مادة' : 'إضافة مادة'}>
        <form onSubmit={handleSubmit} className='space-y-3'>
          <input className='ayla-input' placeholder='اسم المادة' value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required />
          <div className='grid grid-cols-2 gap-3'>
            <input className='ayla-input' placeholder='الكمية' type='number' value={form.quantity} onChange={e => setForm({ ...form, quantity: e.target.value })} />
            <input className='ayla-input' placeholder='الوحدة' value={form.unit} onChange={e => setForm({ ...form, unit: e.target.value })} />
          </div>
          <input className='ayla-input' placeholder='الموقع' value={form.location} onChange={e => setForm({ ...form, location: e.target.value })} />
          <input className='ayla-input' placeholder='الحد الأدنى للتنبيه' type='number' value={form.minLevel} onChange={e => setForm({ ...form, minLevel: e.target.value })} />
          <select className='ayla-input' value={form.status} onChange={e => setForm({ ...form, status: e.target.value })}>
            <option value='متوفر'>متوفر</option><option value='نفذ'>نفذ</option>
          </select>
          <button type='submit' className='ayla-btn w-full'>{editing ? 'تحديث' : 'إضافة'}</button>
        </form>
      </Modal>
    </AuthGuard>
  )
}
