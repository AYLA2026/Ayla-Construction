'use client'

export const dynamic = 'force-dynamic'
import Sidebar from '@/components/sidebar'
import Navbar from '@/components/navbar'
import AuthGuard from '@/components/auth-guard'
import DataTable from '@/components/data-table'
import Modal from '@/components/modal'
import { useToast } from '@/components/toast-provider'
import { useState, useEffect } from 'react'

export default function UsersPage() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [modal, setModal] = useState(false)
  const [editing, setEditing] = useState<any>(null)
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'user' })
  const { addToast } = useToast()

  useEffect(() => { fetchData() }, [])
  const fetchData = async () => { setLoading(true); try { const res = await fetch('/api/users'); setItems(await res.json()) } catch {} setLoading(false) }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await fetch('/api/users', { method: editing ? 'PUT' : 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ...form, id: editing?.id }) })
      addToast(editing ? 'تم التحديث' : 'تم الإضافة', 'success')
      setModal(false); setEditing(null); setForm({ name: '', email: '', password: '', role: 'user' })
      fetchData()
    } catch { addToast('حدث خطأ', 'error') }
  }

  const handleDelete = async (id: string) => { await fetch('/api/users', { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id }) }); fetchData() }

  const columns = [
    { key: 'name', label: 'الاسم' },
    { key: 'email', label: 'البريد' },
    { key: 'role', label: 'الدور', render: (v: string) => <span className={`px-2 py-1 rounded-full text-xs ${v === 'admin' ? 'bg-purple-100 text-purple-700' : v === 'manager' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-600'}`}>{v === 'admin' ? 'مدير' : v === 'manager' ? 'مدير مشروع' : 'مستخدم'}</span> },
  ]

  return (
    <AuthGuard allowedRoles={['admin']}>
      <div className='flex min-h-screen'>
        <Sidebar />
        <div className='flex-1 flex flex-col'>
          <Navbar title='المستخدمين' />
          <main className='flex-1 p-6'>
            <DataTable title='إدارة المستخدمين' columns={columns} data={items} loading={loading}
              onAdd={() => { setEditing(null); setForm({ name: '', email: '', password: '', role: 'user' }); setModal(true) }}
              onEdit={row => { setEditing(row); setForm({ ...row, password: '' }); setModal(true) }}
              onDelete={handleDelete}
            />
          </main>
        </div>
      </div>
      <Modal open={modal} onClose={() => setModal(false)} title={editing ? 'تعديل مستخدم' : 'إضافة مستخدم'}>
        <form onSubmit={handleSubmit} className='space-y-3'>
          <input className='ayla-input' placeholder='الاسم' value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required />
          <input className='ayla-input' placeholder='البريد الإلكتروني' type='email' value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} required />
          {!editing && <input className='ayla-input' placeholder='كلمة المرور' type='password' value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} required />}
          <select className='ayla-input' value={form.role} onChange={e => setForm({ ...form, role: e.target.value })}>
            <option value='user'>مستخدم</option><option value='manager'>مدير مشروع</option><option value='admin'>مدير نظام</option>
          </select>
          <button type='submit' className='ayla-btn w-full'>{editing ? 'تحديث' : 'إضافة'}</button>
        </form>
      </Modal>
    </AuthGuard>
  )
}
