'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useSession, signOut } from 'next-auth/react'
import {
  LayoutDashboard, Home, Users, FileText, Wallet, BarChart3,
  Calendar, Shield, Mail, FolderOpen, Image, Package, Key,
  FileBarChart, Settings, UserCog, ScrollText, LogOut, ChevronRight
} from 'lucide-react'

const navItems = [
  { href: '/', label: 'الرئيسية', icon: LayoutDashboard },
  { href: '/villas', label: 'الفلل', icon: Home },
  { href: '/contractors', label: 'المقاولين', icon: Users },
  { href: '/contracts', label: 'العقود', icon: FileText },
  { href: '/budget', label: 'الميزانية', icon: Wallet },
  { href: '/statements', label: 'البيانات المالية', icon: BarChart3 },
  { href: '/timeline', label: 'الجدول الزمني', icon: Calendar },
  { href: '/permits', label: 'التصاريح', icon: Shield },
  { href: '/correspondence', label: 'المراسلات', icon: Mail },
  { href: '/documents', label: 'المستندات', icon: FolderOpen },
  { href: '/gallery', label: 'معرض الصور', icon: Image },
  { href: '/inventory', label: 'المخزون', icon: Package },
  { href: '/handover', label: 'التسليم', icon: Key },
  { href: '/reports', label: 'التقارير', icon: FileBarChart },
  { href: '/users', label: 'المستخدمين', icon: UserCog, admin: true },
  { href: '/settings', label: 'الإعدادات', icon: Settings, admin: true },
  { href: '/audit', label: 'سجل الأحداث', icon: ScrollText, admin: true },
]

export default function Sidebar() {
  const pathname = usePathname()
  const { data: session } = useSession()
  const role = (session?.user as any)?.role || 'user'

  return (
    <aside className="w-64 bg-white border-l border-ayla-border min-h-screen flex flex-col sticky top-0">
      <div className="p-6 border-b border-ayla-border">
        <h1 className="text-xl font-bold text-ayla-dark">منصة <span className="text-ayla-gold">آيلا</span></h1>
        <p className="text-xs text-gray-400 mt-1">إدارة مشاريع البناء</p>
      </div>
      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        {navItems.filter(item => !item.admin || role === 'admin').map(item => {
          const active = pathname === item.href
          const Icon = item.icon
          return (
            <Link key={item.href} href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${active ? 'bg-ayla-gold/10 text-ayla-gold' : 'text-gray-600 hover:bg-gray-50'}`}>
              <Icon size={18} />
              <span className="flex-1">{item.label}</span>
              {active && <ChevronRight size={14} />}
            </Link>
          )
        })}
      </nav>
      <div className="p-4 border-t border-ayla-border">
        <button onClick={() => signOut({ callbackUrl: '/login' })}
          className="flex items-center gap-2 w-full px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors">
          <LogOut size={16} />
          <span>تسجيل الخروج</span>
        </button>
      </div>
    </aside>
  )
}
