'use client'

export const dynamic = 'force-dynamic'
import Sidebar from '@/components/sidebar'
import Navbar from '@/components/navbar'
import AuthGuard from '@/components/auth-guard'
import DataTable from '@/components/data-table'
import Modal from '@/components/modal'
import { useToast } from '@/components/toast-provider'
import { useState, useEffect } from 'react'

export default function GalleryPage() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [modal, setModal] = useState(false)
  const [editing, setEditing] = useState<any>(null)
  const [form, setForm] = useState({ title: '', category: 'عام', imageUrl: '', date: '' })
  const { addToast } = useToast()

  useEffect(() => { fetchData() }, [])
  const fetchData = async () => { setLoading(true); try { const res = await fetch('/api/gallery'); setItems(await res.json()) } catch {} setLoading(false) }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const body = { ...form, date: form.date ? new Date(form.date).toISOString() : new Date().toISOString(), id: editing?.id }
      await fetch('/api/gallery', { method: editing ? 'PUT' : 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })
      addToast(editing ? 'تم التحديث' : 'تم الإضافة', 'success')
      setModal(false); setEditing(null); setForm({ title: '', category: 'عام', imageUrl: '', date: '' })
      fetchData()
    } catch { addToast('حدث خطأ', 'error') }
  }

  const handleDelete = async (id: string) => { await fetch('/api/gallery', { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id }) }); fetchData() }

  const columns = [
    { key: 'title', label: 'العنوان' },
    { key: 'category', label: 'التصنيف' },
    { key: 'imageUrl', label: 'الصورة', render: (v: string) => v ? <img src={v} className="w-16 h-12 object-cover rounded-lg" alt="" /> : '—' },
    { key: 'date', label: 'التاريخ', render: (v: string) => v ? new Date(v).toLocaleDateString('ar-SA') : '—' },
  ]

  return (
    <AuthGuard>
      <div className='flex min-h-screen'>
        <Sidebar />
        <div className='flex-1 flex flex-col'>
          <Navbar title='معرض الصور' />
          <main className='flex-1 p-6'>
            <DataTable title='معرض الصور' columns={columns} data={items} loading={loading}
              onAdd={() => { setEditing(null); setForm({ title: '', category: 'عام', imageUrl: '', date: '' }); setModal(true) }}
              onEdit={row => { setEditing(row); setForm({ ...row, date: row.date ? row.date.split('T')[0] : '' }); setModal(true) }}
              onDelete={handleDelete}
            />
          </main>
        </div>
      </div>
      <Modal open={modal} onClose={() => setModal(false)} title={editing ? 'تعديل صورة' : 'إضافة صورة'}>
        <form onSubmit={handleSubmit} className='space-y-3'>
          <input className='ayla-input' placeholder='العنوان' value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} required />
          <input className='ayla-input' placeholder='التصنيف' value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} />
          <input className='ayla-input' type='date' value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} />
          <input className='ayla-input' placeholder='رابط الصورة' value={form.imageUrl} onChange={e => setForm({ ...form, imageUrl: e.target.value })} />
          <button type='submit' className='ayla-btn w-full'>{editing ? 'تحديث' : 'إضافة'}</button>
        </form>
      </Modal>
    </AuthGuard>
  )
}
