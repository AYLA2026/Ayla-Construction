'use client'

export const dynamic = 'force-dynamic'
import Sidebar from '@/components/sidebar'
import Navbar from '@/components/navbar'
import AuthGuard from '@/components/auth-guard'
import DataTable from '@/components/data-table'
import Modal from '@/components/modal'
import { useToast } from '@/components/toast-provider'
import { useState, useEffect } from 'react'

export default function DocumentsPage() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [modal, setModal] = useState(false)
  const [editing, setEditing] = useState<any>(null)
  const [form, setForm] = useState({ title: '', category: 'عام', fileUrl: '', date: '' })
  const { addToast } = useToast()

  useEffect(() => { fetchData() }, [])
  const fetchData = async () => { setLoading(true); try { const res = await fetch('/api/documents'); setItems(await res.json()) } catch {} setLoading(false) }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const body = { ...form, date: form.date ? new Date(form.date).toISOString() : new Date().toISOString(), id: editing?.id }
      await fetch('/api/documents', { method: editing ? 'PUT' : 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })
      addToast(editing ? 'تم التحديث' : 'تم الإضافة', 'success')
      setModal(false); setEditing(null); setForm({ title: '', category: 'عام', fileUrl: '', date: '' })
      fetchData()
    } catch { addToast('حدث خطأ', 'error') }
  }

  const handleDelete = async (id: string) => { await fetch('/api/documents', { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id }) }); fetchData() }

  const columns = [
    { key: 'title', label: 'العنوان' },
    { key: 'category', label: 'التصنيف' },
    { key: 'date', label: 'التاريخ', render: (v: string) => v ? new Date(v).toLocaleDateString('ar-SA') : '—' },
    { key: 'fileUrl', label: 'الملف', render: (v: string) => v ? <a href={v} target="_blank" className="text-ayla-gold hover:underline">عرض</a> : '—' },
  ]

  return (
    <AuthGuard>
      <div className='flex min-h-screen'>
        <Sidebar />
        <div className='flex-1 flex flex-col'>
          <Navbar title='المستندات' />
          <main className='flex-1 p-6'>
            <DataTable title='المستندات' columns={columns} data={items} loading={loading}
              onAdd={() => { setEditing(null); setForm({ title: '', category: 'عام', fileUrl: '', date: '' }); setModal(true) }}
              onEdit={row => { setEditing(row); setForm({ ...row, date: row.date ? row.date.split('T')[0] : '' }); setModal(true) }}
              onDelete={handleDelete}
            />
          </main>
        </div>
      </div>
      <Modal open={modal} onClose={() => setModal(false)} title={editing ? 'تعديل مستند' : 'إضافة مستند'}>
        <form onSubmit={handleSubmit} className='space-y-3'>
          <input className='ayla-input' placeholder='عنوان المستند' value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} required />
          <input className='ayla-input' placeholder='التصنيف' value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} />
          <input className='ayla-input' type='date' value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} />
          <input className='ayla-input' placeholder='رابط الملف' value={form.fileUrl} onChange={e => setForm({ ...form, fileUrl: e.target.value })} />
          <button type='submit' className='ayla-btn w-full'>{editing ? 'تحديث' : 'إضافة'}</button>
        </form>
      </Modal>
    </AuthGuard>
  )
}
