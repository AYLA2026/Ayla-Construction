'use client'

export const dynamic = 'force-dynamic'
import Sidebar from '@/components/sidebar'
import Navbar from '@/components/navbar'
import AuthGuard from '@/components/auth-guard'
import { useToast } from '@/components/toast-provider'
import { useState, useEffect } from 'react'
import { Loader2, Search } from 'lucide-react'

export default function AuditPage() {
  const [logs, setLogs] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const { addToast } = useToast()

  useEffect(() => { fetchData() }, [])
  const fetchData = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/audit')
      if (!res.ok) throw new Error('Unauthorized')
      setLogs(await res.json())
    } catch { addToast('فشل التحميل', 'error') }
    setLoading(false)
  }

  const filtered = logs.filter((l: any) =>
    (l.action || '').includes(search) ||
    (l.entity || '').includes(search) ||
    (l.userEmail || '').includes(search)
  )

  const actionColors: any = { CREATE: 'bg-emerald-100 text-emerald-700', UPDATE: 'bg-blue-100 text-blue-700', DELETE: 'bg-red-100 text-red-700', LOGIN: 'bg-purple-100 text-purple-700' }

  return (
    <AuthGuard allowedRoles={['admin']}>
      <div className='flex min-h-screen'>
        <Sidebar />
        <div className='flex-1 flex flex-col'>
          <Navbar title='سجل الأحداث' />
          <main className='flex-1 p-6'>
            <div className='mb-4'>
              <div className='relative'>
                <Search size={18} className='absolute right-3 top-1/2 -translate-y-1/2 text-gray-400' />
                <input type='text' value={search} onChange={e => setSearch(e.target.value)} placeholder='بحث في السجل...' className='ayla-input pr-10' />
              </div>
            </div>
            <div className='bg-white rounded-xl border border-ayla-border overflow-hidden'>
              {loading ? (
                <div className='flex justify-center py-12'><Loader2 size={32} className='text-ayla-gold animate-spin' /></div>
              ) : (
                <table className='w-full text-sm'>
                  <thead className='bg-gray-50 border-b border-ayla-border'>
                    <tr>
                      <th className='px-4 py-3 text-right'>الإجراء</th>
                      <th className='px-4 py-3 text-right'>الكيان</th>
                      <th className='px-4 py-3 text-right'>التفاصيل</th>
                      <th className='px-4 py-3 text-right'>المستخدم</th>
                      <th className='px-4 py-3 text-right'>التاريخ</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map((log: any) => (
                      <tr key={log.id} className='border-b border-ayla-border last:border-0 hover:bg-gray-50/50'>
                        <td className='px-4 py-3'><span className={`px-2 py-1 rounded-full text-xs ${actionColors[log.action] || 'bg-gray-100 text-gray-600'}`}>{log.action}</span></td>
                        <td className='px-4 py-3 text-gray-700'>{log.entity}</td>
                        <td className='px-4 py-3 text-gray-500 text-xs'>{log.details || '—'}</td>
                        <td className='px-4 py-3 text-gray-700'>{log.userName || log.userEmail || '—'}</td>
                        <td className='px-4 py-3 text-gray-400 text-xs'>{new Date(log.createdAt).toLocaleString('ar-SA')}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </main>
        </div>
      </div>
    </AuthGuard>
  )
}
