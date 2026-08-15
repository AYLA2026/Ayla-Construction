'use client'

export const dynamic = 'force-dynamic'
import Sidebar from '@/components/sidebar'
import Navbar from '@/components/navbar'
import AuthGuard from '@/components/auth-guard'
import DataTable from '@/components/data-table'
import Modal from '@/components/modal'
import { useToast } from '@/components/toast-provider'
import { useState, useEffect } from 'react'

export default function ContractsPage() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [modal, setModal] = useState(false)
  const [editing, setEditing] = useState<any>(null)
  const [form, setForm] = useState({ title: '', contractor: '', value: '', startDate: '', endDate: '', status: 'نشط', description: '' })
  const { addToast } = useToast()

  useEffect(() => { fetchData() }, [])
  const fetchData = async () => { setLoading(true); try { const res = await fetch('/api/contracts'); setItems(await res.json()) } catch {} setLoading(false) }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const body = { ...form, value: parseFloat(form.value) || 0, startDate: form.startDate ? new Date(form.startDate).toISOString() : null, endDate: form.endDate ? new Date(form.endDate).toISOString() : null, id: editing?.id }
      await fetch('/api/contracts', { method: editing ? 'PUT' : 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })
      addToast(editing ? 'تم التحديث' : 'تم الإضافة', 'success')
      setModal(false); setEditing(null); setForm({ title: '', contractor: '', value: '', startDate: '', endDate: '', status: 'نشط', description: '' })
      fetchData()
    } catch { addToast('حدث خطأ', 'error') }
  }

  const handleDelete = async (id: string) => { await fetch('/api/contracts', { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id }) }); fetchData() }

  const columns = [
    { key: 'title', label: 'العنوان' },
    { key: 'contractor', label: 'المقاول' },
    { key: 'value', label: 'القيمة', render: (v: number) => v ? v.toLocaleString('ar-SA') + ' ر.س' : '—' },
    { key: 'status', label: 'الحالة', render: (v: string) => <span className={`px-2 py-1 rounded-full text-xs ${v === 'نشط' ? 'bg-emerald-100 text-emerald-700' : v === 'منتهي' ? 'bg-gray-100 text-gray-600' : 'bg-red-100 text-red-700'}`}>{v}</span> },
    { key: 'startDate', label: 'البداية', render: (v: string) => v ? new Date(v).toLocaleDateString('ar-SA') : '—' },
  ]

  return (
    <AuthGuard>
      <div className='flex min-h-screen'>
        <Sidebar />
        <div className='flex-1 flex flex-col'>
          <Navbar title='العقود' />
          <main className='flex-1 p-6'>
            <DataTable title='قائمة العقود' columns={columns} data={items} loading={loading}
              onAdd={() => { setEditing(null); setForm({ title: '', contractor: '', value: '', startDate: '', endDate: '', status: 'نشط', description: '' }); setModal(true) }}
              onEdit={row => { setEditing(row); setForm({ ...row, startDate: row.startDate ? row.startDate.split('T')[0] : '', endDate: row.endDate ? row.endDate.split('T')[0] : '', value: String(row.value || '') }); setModal(true) }}
              onDelete={handleDelete}
            />
          </main>
        </div>
      </div>
      <Modal open={modal} onClose={() => setModal(false)} title={editing ? 'تعديل عقد' : 'إضافة عقد'}>
        <form onSubmit={handleSubmit} className='space-y-3'>
          <input className='ayla-input' placeholder='عنوان العقد' value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} required />
          <input className='ayla-input' placeholder='المقاول' value={form.contractor} onChange={e => setForm({ ...form, contractor: e.target.value })} />
          <input className='ayla-input' placeholder='القيمة' type='number' value={form.value} onChange={e => setForm({ ...form, value: e.target.value })} />
          <div className='grid grid-cols-2 gap-3'>
            <input className='ayla-input' type='date' value={form.startDate} onChange={e => setForm({ ...form, startDate: e.target.value })} />
            <input className='ayla-input' type='date' value={form.endDate} onChange={e => setForm({ ...form, endDate: e.target.value })} />
          </div>
          <select className='ayla-input' value={form.status} onChange={e => setForm({ ...form, status: e.target.value })}>
            <option value='نشط'>نشط</option><option value='منتهي'>منتهي</option><option value='ملغي'>ملغي</option>
          </select>
          <textarea className='ayla-input' placeholder='وصف' rows={2} value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} />
          <button type='submit' className='ayla-btn w-full'>{editing ? 'تحديث' : 'إضافة'}</button>
        </form>
      </Modal>
    </AuthGuard>
  )
}
