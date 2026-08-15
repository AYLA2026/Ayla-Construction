'use client'

export const dynamic = 'force-dynamic'
import Sidebar from '@/components/sidebar'
import Navbar from '@/components/navbar'
import AuthGuard from '@/components/auth-guard'
import { useState, useEffect } from 'react'
import { Loader2, Home, Users, FileText, Wallet, Package, Calendar, Shield } from 'lucide-react'
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts'

const COLORS = ['#C9A227', '#10B981', '#3B82F6', '#F59E0B', '#EF4444', '#8B5CF6']

export default function DashboardPage() {
  const [stats, setStats] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => { fetchStats() }, [])
  const fetchStats = async () => {
    setLoading(true)
    try {
      const [villas, contractors, contracts, budget, inventory, timeline, permits] = await Promise.all([
        fetch('/api/villas').then(r => r.json()),
        fetch('/api/contractors').then(r => r.json()),
        fetch('/api/contracts').then(r => r.json()),
        fetch('/api/budget').then(r => r.json()),
        fetch('/api/inventory').then(r => r.json()),
        fetch('/api/timeline').then(r => r.json()),
        fetch('/api/permits').then(r => r.json()),
      ])
      setStats({ villas, contractors, contracts, budget, inventory, timeline, permits })
    } catch {}
    setLoading(false)
  }

  const statCards = [
    { label: 'الفلل', value: stats?.villas?.length || 0, icon: Home, color: 'bg-blue-50 text-blue-600' },
    { label: 'المقاولين', value: stats?.contractors?.length || 0, icon: Users, color: 'bg-emerald-50 text-emerald-600' },
    { label: 'العقود', value: stats?.contracts?.length || 0, icon: FileText, color: 'bg-amber-50 text-amber-600' },
    { label: 'الميزانية', value: stats?.budget?.reduce((a: number, b: any) => a + (b.allocated || 0), 0).toLocaleString('ar-SA') + ' ر.س', icon: Wallet, color: 'bg-purple-50 text-purple-600' },
    { label: 'المخزون', value: stats?.inventory?.length || 0, icon: Package, color: 'bg-rose-50 text-rose-600' },
    { label: 'المشاريع', value: stats?.timeline?.length || 0, icon: Calendar, color: 'bg-cyan-50 text-cyan-600' },
    { label: 'التصاريح', value: stats?.permits?.length || 0, icon: Shield, color: 'bg-orange-50 text-orange-600' },
    { label: 'العقود النشطة', value: stats?.contracts?.filter((c: any) => c.status === 'نشط').length || 0, icon: FileText, color: 'bg-indigo-50 text-indigo-600' },
  ]

  const villaStatus = stats?.villas ? [
    { name: 'متوفر', value: stats.villas.filter((v: any) => v.status === 'متوفر').length },
    { name: 'مباع', value: stats.villas.filter((v: any) => v.status === 'مباع').length },
    { name: 'محجوز', value: stats.villas.filter((v: any) => v.status === 'محجوز').length },
  ] : []

  const budgetData = stats?.budget?.map((b: any) => ({ name: b.category, allocated: b.allocated || 0, spent: b.spent || 0 })) || []

  const timelineProgress = stats?.timeline?.map((t: any) => ({ name: t.title.slice(0, 15), progress: t.progress || 0 })) || []

  return (
    <AuthGuard>
      <div className='flex min-h-screen'>
        <Sidebar />
        <div className='flex-1 flex flex-col'>
          <Navbar title='لوحة التحكم' />
          <main className='flex-1 p-6'>
            {loading ? (
              <div className="flex justify-center py-20"><Loader2 size={32} className="text-ayla-gold animate-spin" /></div>
            ) : (
              <div className="space-y-6">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {statCards.map((s, i) => {
                    const Icon = s.icon
                    return (
                      <div key={i} className="ayla-card flex items-center gap-4">
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${s.color}`}><Icon size={22} /></div>
                        <div>
                          <p className="text-2xl font-bold text-gray-800">{s.value}</p>
                          <p className="text-xs text-gray-400">{s.label}</p>
                        </div>
                      </div>
                    )
                  })}
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <div className="ayla-card">
                    <h3 className="text-sm font-bold text-gray-700 mb-4">حالة الفلل</h3>
                    <ResponsiveContainer width="100%" height={220}>
                      <PieChart><Pie data={villaStatus} cx="50%" cy="50%" innerRadius={50} outerRadius={80} dataKey="value" label>{villaStatus.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}</Pie></PieChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="ayla-card lg:col-span-2">
                    <h3 className="text-sm font-bold text-gray-700 mb-4">الميزانية حسب الفئة</h3>
                    <ResponsiveContainer width="100%" height={220}>
                      <BarChart data={budgetData}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="name" /><YAxis /><Tooltip /><Bar dataKey="allocated" fill="#C9A227" radius={[4,4,0,0]} /><Bar dataKey="spent" fill="#EF4444" radius={[4,4,0,0]} /></BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
                <div className="ayla-card">
                  <h3 className="text-sm font-bold text-gray-700 mb-4">تقدم المشاريع</h3>
                  <ResponsiveContainer width="100%" height={220}>
                    <AreaChart data={timelineProgress}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="name" /><YAxis /><Tooltip /><Area type="monotone" dataKey="progress" stroke="#C9A227" fill="#C9A227" fillOpacity={0.2} /></AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>
            )}
          </main>
        </div>
      </div>
    </AuthGuard>
  )
}
