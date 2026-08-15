'use client'

export const dynamic = 'force-dynamic'
import Sidebar from '@/components/sidebar'
import Navbar from '@/components/navbar'
import AuthGuard from '@/components/auth-guard'
import DataTable from '@/components/data-table'
import Modal from '@/components/modal'
import { useToast } from '@/components/toast-provider'
import { useState, useEffect } from 'react'

export default function CorrespondencePage() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [modal, setModal] = useState(false)
  const [editing, setEditing] = useState<any>(null)
  const [form, setForm] = useState({ title: '', type: 'وارد', fromTo: '', date: '', description: '' })
  const { addToast } = useToast()

  useEffect(() => { fetchData() }, [])
  const fetchData = async () => { setLoading(true); try { const res = await fetch('/api/correspondence'); setItems(await res.json()) } catch {} setLoading(false) }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const body = { ...form, date: form.date ? new Date(form.date).toISOString() : null, id: editing?.id }
      await fetch('/api/correspondence', { method: editing ? 'PUT' : 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })
      addToast(editing ? 'تم التحديث' : 'تم الإضافة', 'success')
      setModal(false); setEditing(null); setForm({ title: '', type: 'وارد', fromTo: '', date: '', description: '' })
      fetchData()
    } catch { addToast('حدث خطأ', 'error') }
  }

  const handleDelete = async (id: string) => { await fetch('/api/correspondence', { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id }) }); fetchData() }

  const columns = [
    { key: 'title', label: 'الموضوع' },
    { key: 'type', label: 'النوع', render: (v: string) => <span className={`px-2 py-1 rounded-full text-xs ${v === 'وارد' ? 'bg-blue-100 text-blue-700' : 'bg-amber-100 text-amber-700'}`}>{v}</span> },
    { key: 'fromTo', label: 'من/إلى' },
    { key: 'date', label: 'التاريخ', render: (v: string) => v ? new Date(v).toLocaleDateString('ar-SA') : '—' },
  ]

  return (
    <AuthGuard>
      <div className='flex min-h-screen'>
        <Sidebar />
        <div className='flex-1 flex flex-col'>
          <Navbar title='المراسلات' />
          <main className='flex-1 p-6'>
            <DataTable title='سجل المراسلات' columns={columns} data={items} loading={loading}
              onAdd={() => { setEditing(null); setForm({ title: '', type: 'وارد', fromTo: '', date: '', description: '' }); setModal(true) }}
              onEdit={row => { setEditing(row); setForm({ ...row, date: row.date ? row.date.split('T')[0] : '' }); setModal(true) }}
              onDelete={handleDelete}
            />
          </main>
        </div>
      </div>
      <Modal open={modal} onClose={() => setModal(false)} title={editing ? 'تعديل مراسلة' : 'إضافة مراسلة'}>
        <form onSubmit={handleSubmit} className='space-y-3'>
          <input className='ayla-input' placeholder='الموضوع' value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} required />
          <select className='ayla-input' value={form.type} onChange={e => setForm({ ...form, type: e.target.value })}>
            <option value='وارد'>وارد</option><option value='صادر'>صادر</option>
          </select>
          <input className='ayla-input' placeholder='من / إلى' value={form.fromTo} onChange={e => setForm({ ...form, fromTo: e.target.value })} />
          <input className='ayla-input' type='date' value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} />
          <textarea className='ayla-input' placeholder='الوصف' rows={3} value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} />
          <button type='submit' className='ayla-btn w-full'>{editing ? 'تحديث' : 'إضافة'}</button>
        </form>
      </Modal>
    </AuthGuard>
  )
}
