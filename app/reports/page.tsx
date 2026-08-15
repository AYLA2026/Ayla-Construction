'use client'

export const dynamic = 'force-dynamic'
import Sidebar from '@/components/sidebar'
import Navbar from '@/components/navbar'
import AuthGuard from '@/components/auth-guard'
import DataTable from '@/components/data-table'
import Modal from '@/components/modal'
import { useToast } from '@/components/toast-provider'
import { useState, useEffect } from 'react'

export default function ReportsPage() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [modal, setModal] = useState(false)
  const [editing, setEditing] = useState<any>(null)
  const [form, setForm] = useState({ title: '', type: 'شهري', period: '', fileUrl: '' })
  const { addToast } = useToast()

  useEffect(() => { fetchData() }, [])
  const fetchData = async () => { setLoading(true); try { const res = await fetch('/api/reports'); setItems(await res.json()) } catch {} setLoading(false) }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await fetch('/api/reports', { method: editing ? 'PUT' : 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ...form, id: editing?.id }) })
      addToast(editing ? 'تم التحديث' : 'تم الإضافة', 'success')
      setModal(false); setEditing(null); setForm({ title: '', type: 'شهري', period: '', fileUrl: '' })
      fetchData()
    } catch { addToast('حدث خطأ', 'error') }
  }

  const handleDelete = async (id: string) => { await fetch('/api/reports', { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id }) }); fetchData() }

  const columns = [
    { key: 'title', label: 'العنوان' },
    { key: 'type', label: 'النوع' },
    { key: 'period', label: 'الفترة' },
    { key: 'fileUrl', label: 'الملف', render: (v: string) => v ? <a href={v} target="_blank" className="text-ayla-gold hover:underline">تحميل</a> : '—' },
  ]

  return (
    <AuthGuard>
      <div className='flex min-h-screen'>
        <Sidebar />
        <div className='flex-1 flex flex-col'>
          <Navbar title='التقارير' />
          <main className='flex-1 p-6'>
            <DataTable title='التقارير' columns={columns} data={items} loading={loading}
              onAdd={() => { setEditing(null); setForm({ title: '', type: 'شهري', period: '', fileUrl: '' }); setModal(true) }}
              onEdit={row => { setEditing(row); setForm(row); setModal(true) }}
              onDelete={handleDelete}
            />
          </main>
        </div>
      </div>
      <Modal open={modal} onClose={() => setModal(false)} title={editing ? 'تعديل تقرير' : 'إضافة تقرير'}>
        <form onSubmit={handleSubmit} className='space-y-3'>
          <input className='ayla-input' placeholder='عنوان التقرير' value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} required />
          <select className='ayla-input' value={form.type} onChange={e => setForm({ ...form, type: e.target.value })}>
            <option value='شهري'>شهري</option><option value='أسبوعي'>أسبوعي</option><option value='يومي'>يومي</option><option value='نهائي'>نهائي</option>
          </select>
          <input className='ayla-input' placeholder='الفترة (مثال: يناير 2026)' value={form.period} onChange={e => setForm({ ...form, period: e.target.value })} />
          <input className='ayla-input' placeholder='رابط الملف' value={form.fileUrl} onChange={e => setForm({ ...form, fileUrl: e.target.value })} />
          <button type='submit' className='ayla-btn w-full'>{editing ? 'تحديث' : 'إضافة'}</button>
        </form>
      </Modal>
    </AuthGuard>
  )
}
