'use client'

export const dynamic = 'force-dynamic'
import Sidebar from '@/components/sidebar'
import Navbar from '@/components/navbar'
import AuthGuard from '@/components/auth-guard'
import DataTable from '@/components/data-table'
import Modal from '@/components/modal'
import { useToast } from '@/components/toast-provider'
import { useState, useEffect } from 'react'

export default function PermitsPage() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [modal, setModal] = useState(false)
  const [editing, setEditing] = useState<any>(null)
  const [form, setForm] = useState({ title: '', type: 'بناء', issueDate: '', expiryDate: '', status: 'ساري', fileUrl: '' })
  const { addToast } = useToast()

  useEffect(() => { fetchData() }, [])
  const fetchData = async () => { setLoading(true); try { const res = await fetch('/api/permits'); setItems(await res.json()) } catch {} setLoading(false) }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const body = { ...form, issueDate: form.issueDate ? new Date(form.issueDate).toISOString() : null, expiryDate: form.expiryDate ? new Date(form.expiryDate).toISOString() : null, id: editing?.id }
      await fetch('/api/permits', { method: editing ? 'PUT' : 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })
      addToast(editing ? 'تم التحديث' : 'تم الإضافة', 'success')
      setModal(false); setEditing(null); setForm({ title: '', type: 'بناء', issueDate: '', expiryDate: '', status: 'ساري', fileUrl: '' })
      fetchData()
    } catch { addToast('حدث خطأ', 'error') }
  }

  const handleDelete = async (id: string) => { await fetch('/api/permits', { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id }) }); fetchData() }

  const columns = [
    { key: 'title', label: 'التصريح' },
    { key: 'type', label: 'النوع' },
    { key: 'issueDate', label: 'تاريخ الإصدار', render: (v: string) => v ? new Date(v).toLocaleDateString('ar-SA') : '—' },
    { key: 'expiryDate', label: 'تاريخ الانتهاء', render: (v: string) => v ? new Date(v).toLocaleDateString('ar-SA') : '—' },
    { key: 'status', label: 'الحالة', render: (v: string) => <span className={`px-2 py-1 rounded-full text-xs ${v === 'ساري' ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>{v}</span> },
  ]

  return (
    <AuthGuard>
      <div className='flex min-h-screen'>
        <Sidebar />
        <div className='flex-1 flex flex-col'>
          <Navbar title='التصاريح' />
          <main className='flex-1 p-6'>
            <DataTable title='التصاريح والتراخيص' columns={columns} data={items} loading={loading}
              onAdd={() => { setEditing(null); setForm({ title: '', type: 'بناء', issueDate: '', expiryDate: '', status: 'ساري', fileUrl: '' }); setModal(true) }}
              onEdit={row => { setEditing(row); setForm({ ...row, issueDate: row.issueDate ? row.issueDate.split('T')[0] : '', expiryDate: row.expiryDate ? row.expiryDate.split('T')[0] : '' }); setModal(true) }}
              onDelete={handleDelete}
            />
          </main>
        </div>
      </div>
      <Modal open={modal} onClose={() => setModal(false)} title={editing ? 'تعديل تصريح' : 'إضافة تصريح'}>
        <form onSubmit={handleSubmit} className='space-y-3'>
          <input className='ayla-input' placeholder='اسم التصريح' value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} required />
          <select className='ayla-input' value={form.type} onChange={e => setForm({ ...form, type: e.target.value })}>
            <option value='بناء'>بناء</option><option value='كهرباء'>كهرباء</option><option value='سباكة'>سباكة</option><option value='تشطيب'>تشطيب</option>
          </select>
          <div className='grid grid-cols-2 gap-3'>
            <input className='ayla-input' type='date' value={form.issueDate} onChange={e => setForm({ ...form, issueDate: e.target.value })} />
            <input className='ayla-input' type='date' value={form.expiryDate} onChange={e => setForm({ ...form, expiryDate: e.target.value })} />
          </div>
          <select className='ayla-input' value={form.status} onChange={e => setForm({ ...form, status: e.target.value })}>
            <option value='ساري'>ساري</option><option value='منتهي'>منتهي</option>
          </select>
          <input className='ayla-input' placeholder='رابط الملف' value={form.fileUrl} onChange={e => setForm({ ...form, fileUrl: e.target.value })} />
          <button type='submit' className='ayla-btn w-full'>{editing ? 'تحديث' : 'إضافة'}</button>
        </form>
      </Modal>
    </AuthGuard>
  )
}
