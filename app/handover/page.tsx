'use client'

export const dynamic = 'force-dynamic'
import Sidebar from '@/components/sidebar'
import Navbar from '@/components/navbar'
import AuthGuard from '@/components/auth-guard'
import DataTable from '@/components/data-table'
import Modal from '@/components/modal'
import { useToast } from '@/components/toast-provider'
import { useState, useEffect } from 'react'

export default function HandoverPage() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [modal, setModal] = useState(false)
  const [editing, setEditing] = useState<any>(null)
  const [form, setForm] = useState({ villaName: '', clientName: '', handoverDate: '', status: 'قيد التحضير', notes: '' })
  const { addToast } = useToast()

  useEffect(() => { fetchData() }, [])
  const fetchData = async () => { setLoading(true); try { const res = await fetch('/api/handover'); setItems(await res.json()) } catch {} setLoading(false) }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const body = { ...form, handoverDate: form.handoverDate ? new Date(form.handoverDate).toISOString() : null, id: editing?.id }
      await fetch('/api/handover', { method: editing ? 'PUT' : 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })
      addToast(editing ? 'تم التحديث' : 'تم الإضافة', 'success')
      setModal(false); setEditing(null); setForm({ villaName: '', clientName: '', handoverDate: '', status: 'قيد التحضير', notes: '' })
      fetchData()
    } catch { addToast('حدث خطأ', 'error') }
  }

  const handleDelete = async (id: string) => { await fetch('/api/handover', { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id }) }); fetchData() }

  const columns = [
    { key: 'villaName', label: 'الفيلا' },
    { key: 'clientName', label: 'العميل' },
    { key: 'handoverDate', label: 'تاريخ التسليم', render: (v: string) => v ? new Date(v).toLocaleDateString('ar-SA') : '—' },
    { key: 'status', label: 'الحالة', render: (v: string) => <span className={`px-2 py-1 rounded-full text-xs ${v === 'تم التسليم' ? 'bg-emerald-100 text-emerald-700' : v === 'قيد التحضير' ? 'bg-amber-100 text-amber-700' : 'bg-blue-100 text-blue-700'}`}>{v}</span> },
  ]

  return (
    <AuthGuard allowedRoles={['admin', 'manager']}>
      <div className='flex min-h-screen'>
        <Sidebar />
        <div className='flex-1 flex flex-col'>
          <Navbar title='التسليم' />
          <main className='flex-1 p-6'>
            <DataTable title='سجل التسليم' columns={columns} data={items} loading={loading}
              onAdd={() => { setEditing(null); setForm({ villaName: '', clientName: '', handoverDate: '', status: 'قيد التحضير', notes: '' }); setModal(true) }}
              onEdit={row => { setEditing(row); setForm({ ...row, handoverDate: row.handoverDate ? row.handoverDate.split('T')[0] : '' }); setModal(true) }}
              onDelete={handleDelete}
            />
          </main>
        </div>
      </div>
      <Modal open={modal} onClose={() => setModal(false)} title={editing ? 'تعديل تسليم' : 'إضافة تسليم'}>
        <form onSubmit={handleSubmit} className='space-y-3'>
          <input className='ayla-input' placeholder='اسم الفيلا' value={form.villaName} onChange={e => setForm({ ...form, villaName: e.target.value })} required />
          <input className='ayla-input' placeholder='اسم العميل' value={form.clientName} onChange={e => setForm({ ...form, clientName: e.target.value })} />
          <input className='ayla-input' type='date' value={form.handoverDate} onChange={e => setForm({ ...form, handoverDate: e.target.value })} />
          <select className='ayla-input' value={form.status} onChange={e => setForm({ ...form, status: e.target.value })}>
            <option value='قيد التحضير'>قيد التحضير</option><option value='جاهز'>جاهز</option><option value='تم التسليم'>تم التسليم</option>
          </select>
          <textarea className='ayla-input' placeholder='ملاحظات' rows={2} value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} />
          <button type='submit' className='ayla-btn w-full'>{editing ? 'تحديث' : 'إضافة'}</button>
        </form>
      </Modal>
    </AuthGuard>
  )
}
