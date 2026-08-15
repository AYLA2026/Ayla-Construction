'use client'

export const dynamic = 'force-dynamic'
import Sidebar from '@/components/sidebar'
import Navbar from '@/components/navbar'
import AuthGuard from '@/components/auth-guard'
import DataTable from '@/components/data-table'
import Modal from '@/components/modal'
import { useToast } from '@/components/toast-provider'
import { useState, useEffect } from 'react'

export default function VillasPage() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [modal, setModal] = useState(false)
  const [editing, setEditing] = useState<any>(null)
  const [form, setForm] = useState({ name: '', location: '', status: 'متوفر', price: '', area: '', rooms: '', description: '' })
  const { addToast } = useToast()

  useEffect(() => { fetchData() }, [])
  const fetchData = async () => { setLoading(true); try { const res = await fetch('/api/villas'); setItems(await res.json()) } catch {} setLoading(false) }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const body = { ...form, price: parseFloat(form.price) || 0, area: parseFloat(form.area) || 0, rooms: parseInt(form.rooms) || 0, id: editing?.id }
      await fetch('/api/villas', { method: editing ? 'PUT' : 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })
      addToast(editing ? 'تم التحديث' : 'تم الإضافة', 'success')
      setModal(false); setEditing(null); setForm({ name: '', location: '', status: 'متوفر', price: '', area: '', rooms: '', description: '' })
      fetchData()
    } catch { addToast('حدث خطأ', 'error') }
  }

  const handleDelete = async (id: string) => { await fetch('/api/villas', { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id }) }); fetchData() }

  const columns = [
    { key: 'name', label: 'الاسم' },
    { key: 'location', label: 'الموقع' },
    { key: 'status', label: 'الحالة', render: (v: string) => <span className={`px-2 py-1 rounded-full text-xs ${v === 'متوفر' ? 'bg-emerald-100 text-emerald-700' : v === 'مباع' ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'}`}>{v}</span> },
    { key: 'price', label: 'السعر', render: (v: number) => v ? v.toLocaleString('ar-SA') + ' ر.س' : '—' },
    { key: 'area', label: 'المساحة', render: (v: number) => v ? v + ' م²' : '—' },
    { key: 'rooms', label: 'الغرف' },
  ]

  return (
    <AuthGuard>
      <div className='flex min-h-screen'>
        <Sidebar />
        <div className='flex-1 flex flex-col'>
          <Navbar title='الفلل' />
          <main className='flex-1 p-6'>
            <DataTable title='قائمة الفلل' columns={columns} data={items} loading={loading}
              onAdd={() => { setEditing(null); setForm({ name: '', location: '', status: 'متوفر', price: '', area: '', rooms: '', description: '' }); setModal(true) }}
              onEdit={row => { setEditing(row); setForm({ ...row, price: String(row.price || ''), area: String(row.area || ''), rooms: String(row.rooms || '') }); setModal(true) }}
              onDelete={handleDelete}
            />
          </main>
        </div>
      </div>
      <Modal open={modal} onClose={() => setModal(false)} title={editing ? 'تعديل فيلا' : 'إضافة فيلا'}>
        <form onSubmit={handleSubmit} className='space-y-3'>
          <input className='ayla-input' placeholder='اسم الفيلا' value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required />
          <input className='ayla-input' placeholder='الموقع' value={form.location} onChange={e => setForm({ ...form, location: e.target.value })} />
          <div className='grid grid-cols-3 gap-3'>
            <input className='ayla-input' placeholder='السعر' type='number' value={form.price} onChange={e => setForm({ ...form, price: e.target.value })} />
            <input className='ayla-input' placeholder='المساحة' type='number' value={form.area} onChange={e => setForm({ ...form, area: e.target.value })} />
            <input className='ayla-input' placeholder='الغرف' type='number' value={form.rooms} onChange={e => setForm({ ...form, rooms: e.target.value })} />
          </div>
          <select className='ayla-input' value={form.status} onChange={e => setForm({ ...form, status: e.target.value })}>
            <option value='متوفر'>متوفر</option><option value='مباع'>مباع</option><option value='محجوز'>محجوز</option>
          </select>
          <textarea className='ayla-input' placeholder='وصف' rows={2} value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} />
          <button type='submit' className='ayla-btn w-full'>{editing ? 'تحديث' : 'إضافة'}</button>
        </form>
      </Modal>
    </AuthGuard>
  )
}
