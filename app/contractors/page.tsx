'use client'

export const dynamic = 'force-dynamic'
import Sidebar from '@/components/sidebar'
import Navbar from '@/components/navbar'
import AuthGuard from '@/components/auth-guard'
import DataTable from '@/components/data-table'
import Modal from '@/components/modal'
import { useToast } from '@/components/toast-provider'
import { useState, useEffect } from 'react'

export default function ContractorsPage() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [modal, setModal] = useState(false)
  const [editing, setEditing] = useState<any>(null)
  const [form, setForm] = useState({ name: '', type: 'مقاول', phone: '', email: '', address: '', specialty: '' })
  const { addToast } = useToast()

  useEffect(() => { fetchData() }, [])
  const fetchData = async () => { setLoading(true); try { const res = await fetch('/api/contractors'); setItems(await res.json()) } catch {} setLoading(false) }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await fetch('/api/contractors', { method: editing ? 'PUT' : 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ...form, id: editing?.id }) })
      addToast(editing ? 'تم التحديث' : 'تم الإضافة', 'success')
      setModal(false); setEditing(null); setForm({ name: '', type: 'مقاول', phone: '', email: '', address: '', specialty: '' })
      fetchData()
    } catch { addToast('حدث خطأ', 'error') }
  }

  const handleDelete = async (id: string) => { await fetch('/api/contractors', { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id }) }); fetchData() }

  const columns = [
    { key: 'name', label: 'الاسم' },
    { key: 'type', label: 'النوع', render: (v: string) => <span className={`px-2 py-1 rounded-full text-xs ${v === 'مقاول' ? 'bg-blue-100 text-blue-700' : 'bg-emerald-100 text-emerald-700'}`}>{v}</span> },
    { key: 'phone', label: 'الهاتف' },
    { key: 'email', label: 'البريد' },
    { key: 'specialty', label: 'التخصص' },
  ]

  return (
    <AuthGuard>
      <div className='flex min-h-screen'>
        <Sidebar />
        <div className='flex-1 flex flex-col'>
          <Navbar title='المقاولين والموردين' />
          <main className='flex-1 p-6'>
            <DataTable title='قائمة المقاولين' columns={columns} data={items} loading={loading}
              onAdd={() => { setEditing(null); setForm({ name: '', type: 'مقاول', phone: '', email: '', address: '', specialty: '' }); setModal(true) }}
              onEdit={row => { setEditing(row); setForm(row); setModal(true) }}
              onDelete={handleDelete}
            />
          </main>
        </div>
      </div>
      <Modal open={modal} onClose={() => setModal(false)} title={editing ? 'تعديل مقاول' : 'إضافة مقاول'}>
        <form onSubmit={handleSubmit} className='space-y-3'>
          <input className='ayla-input' placeholder='الاسم' value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required />
          <select className='ayla-input' value={form.type} onChange={e => setForm({ ...form, type: e.target.value })}>
            <option value='مقاول'>مقاول</option><option value='مورد'>مورد</option>
          </select>
          <input className='ayla-input' placeholder='الهاتف' value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} />
          <input className='ayla-input' placeholder='البريد الإلكتروني' type='email' value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
          <input className='ayla-input' placeholder='العنوان' value={form.address} onChange={e => setForm({ ...form, address: e.target.value })} />
          <input className='ayla-input' placeholder='التخصص' value={form.specialty} onChange={e => setForm({ ...form, specialty: e.target.value })} />
          <button type='submit' className='ayla-btn w-full'>{editing ? 'تحديث' : 'إضافة'}</button>
        </form>
      </Modal>
    </AuthGuard>
  )
}
