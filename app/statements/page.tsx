'use client'

export const dynamic = 'force-dynamic'
import Sidebar from '@/components/sidebar'
import Navbar from '@/components/navbar'
import AuthGuard from '@/components/auth-guard'
import DataTable from '@/components/data-table'
import Modal from '@/components/modal'
import { useToast } from '@/components/toast-provider'
import { useState, useEffect } from 'react'

export default function StatementsPage() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [modal, setModal] = useState(false)
  const [editing, setEditing] = useState<any>(null)
  const [form, setForm] = useState({ title: '', type: 'صرف', amount: '', date: '', description: '' })
  const { addToast } = useToast()

  useEffect(() => { fetchData() }, [])
  const fetchData = async () => { setLoading(true); try { const res = await fetch('/api/statements'); setItems(await res.json()) } catch {} setLoading(false) }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const body = { ...form, amount: parseFloat(form.amount) || 0, date: form.date ? new Date(form.date).toISOString() : null, id: editing?.id }
      await fetch('/api/statements', { method: editing ? 'PUT' : 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })
      addToast(editing ? 'تم التحديث' : 'تم الإضافة', 'success')
      setModal(false); setEditing(null); setForm({ title: '', type: 'صرف', amount: '', date: '', description: '' })
      fetchData()
    } catch { addToast('حدث خطأ', 'error') }
  }

  const handleDelete = async (id: string) => { await fetch('/api/statements', { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id }) }); fetchData() }

  const columns = [
    { key: 'title', label: 'البيان' },
    { key: 'type', label: 'النوع', render: (v: string) => <span className={`px-2 py-1 rounded-full text-xs ${v === 'صرف' ? 'bg-red-100 text-red-700' : 'bg-emerald-100 text-emerald-700'}`}>{v}</span> },
    { key: 'amount', label: 'المبلغ', render: (v: number) => v?.toLocaleString('ar-SA') + ' ر.س' },
    { key: 'date', label: 'التاريخ', render: (v: string) => v ? new Date(v).toLocaleDateString('ar-SA') : '—' },
  ]

  return (
    <AuthGuard>
      <div className='flex min-h-screen'>
        <Sidebar />
        <div className='flex-1 flex flex-col'>
          <Navbar title='البيانات المالية' />
          <main className='flex-1 p-6'>
            <DataTable title='البيانات المالية' columns={columns} data={items} loading={loading}
              onAdd={() => { setEditing(null); setForm({ title: '', type: 'صرف', amount: '', date: '', description: '' }); setModal(true) }}
              onEdit={row => { setEditing(row); setForm({ ...row, amount: String(row.amount || ''), date: row.date ? row.date.split('T')[0] : '' }); setModal(true) }}
              onDelete={handleDelete}
            />
          </main>
        </div>
      </div>
      <Modal open={modal} onClose={() => setModal(false)} title={editing ? 'تعديل بيان' : 'إضافة بيان'}>
        <form onSubmit={handleSubmit} className='space-y-3'>
          <input className='ayla-input' placeholder='البيان' value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} required />
          <select className='ayla-input' value={form.type} onChange={e => setForm({ ...form, type: e.target.value })}>
            <option value='صرف'>صرف</option><option value='قبض'>قبض</option>
          </select>
          <input className='ayla-input' placeholder='المبلغ' type='number' value={form.amount} onChange={e => setForm({ ...form, amount: e.target.value })} />
          <input className='ayla-input' type='date' value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} />
          <textarea className='ayla-input' placeholder='وصف' rows={2} value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} />
          <button type='submit' className='ayla-btn w-full'>{editing ? 'تحديث' : 'إضافة'}</button>
        </form>
      </Modal>
    </AuthGuard>
  )
}
