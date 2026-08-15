'use client'

export const dynamic = 'force-dynamic'
import Sidebar from '@/components/sidebar'
import Navbar from '@/components/navbar'
import AuthGuard from '@/components/auth-guard'
import DataTable from '@/components/data-table'
import Modal from '@/components/modal'
import { useToast } from '@/components/toast-provider'
import { useState, useEffect } from 'react'

export default function TimelinePage() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [modal, setModal] = useState(false)
  const [editing, setEditing] = useState<any>(null)
  const [form, setForm] = useState({ title: '', startDate: '', endDate: '', progress: '0', status: 'قيد التنفيذ', project: '' })
  const { addToast } = useToast()

  useEffect(() => { fetchData() }, [])
  const fetchData = async () => { setLoading(true); try { const res = await fetch('/api/timeline'); setItems(await res.json()) } catch {} setLoading(false) }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const body = { ...form, progress: parseInt(form.progress) || 0, startDate: form.startDate ? new Date(form.startDate).toISOString() : null, endDate: form.endDate ? new Date(form.endDate).toISOString() : null, id: editing?.id }
      await fetch('/api/timeline', { method: editing ? 'PUT' : 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })
      addToast(editing ? 'تم التحديث' : 'تم الإضافة', 'success')
      setModal(false); setEditing(null); setForm({ title: '', startDate: '', endDate: '', progress: '0', status: 'قيد التنفيذ', project: '' })
      fetchData()
    } catch { addToast('حدث خطأ', 'error') }
  }

  const handleDelete = async (id: string) => { await fetch('/api/timeline', { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id }) }); fetchData() }

  const columns = [
    { key: 'title', label: 'المهمة' },
    { key: 'project', label: 'المشروع' },
    { key: 'progress', label: 'التقدم %', render: (v: number) => (
      <div className='w-24 bg-gray-200 rounded-full h-2 overflow-hidden'>
        <div className='bg-ayla-gold h-full rounded-full' style={{ width: `${v || 0}%` }} />
      </div>
    )},
    { key: 'status', label: 'الحالة', render: (v: string) => <span className={`px-2 py-1 rounded-full text-xs ${v === 'مكتمل' ? 'bg-emerald-100 text-emerald-700' : v === 'قيد التنفيذ' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-600'}`}>{v}</span> },
    { key: 'startDate', label: 'البداية', render: (v: string) => v ? new Date(v).toLocaleDateString('ar-SA') : '—' },
  ]

  return (
    <AuthGuard>
      <div className='flex min-h-screen'>
        <Sidebar />
        <div className='flex-1 flex flex-col'>
          <Navbar title='الجدول الزمني' />
          <main className='flex-1 p-6'>
            <DataTable title='الجدول الزمني للمشاريع' columns={columns} data={items} loading={loading}
              onAdd={() => { setEditing(null); setForm({ title: '', startDate: '', endDate: '', progress: '0', status: 'قيد التنفيذ', project: '' }); setModal(true) }}
              onEdit={row => { setEditing(row); setForm({ ...row, progress: String(row.progress || '0'), startDate: row.startDate ? row.startDate.split('T')[0] : '', endDate: row.endDate ? row.endDate.split('T')[0] : '' }); setModal(true) }}
              onDelete={handleDelete}
            />
          </main>
        </div>
      </div>
      <Modal open={modal} onClose={() => setModal(false)} title={editing ? 'تعديل مهمة' : 'إضافة مهمة'}>
        <form onSubmit={handleSubmit} className='space-y-3'>
          <input className='ayla-input' placeholder='عنوان المهمة' value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} required />
          <input className='ayla-input' placeholder='المشروع' value={form.project} onChange={e => setForm({ ...form, project: e.target.value })} />
          <div className='grid grid-cols-2 gap-3'>
            <input className='ayla-input' type='date' value={form.startDate} onChange={e => setForm({ ...form, startDate: e.target.value })} />
            <input className='ayla-input' type='date' value={form.endDate} onChange={e => setForm({ ...form, endDate: e.target.value })} />
          </div>
          <input className='ayla-input' placeholder='نسبة التقدم %' type='number' min='0' max='100' value={form.progress} onChange={e => setForm({ ...form, progress: e.target.value })} />
          <select className='ayla-input' value={form.status} onChange={e => setForm({ ...form, status: e.target.value })}>
            <option value='قيد التنفيذ'>قيد التنفيذ</option><option value='مكتمل'>مكتمل</option><option value='متوقف'>متوقف</option>
          </select>
          <button type='submit' className='ayla-btn w-full'>{editing ? 'تحديث' : 'إضافة'}</button>
        </form>
      </Modal>
    </AuthGuard>
  )
}
