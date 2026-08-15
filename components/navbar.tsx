'use client'
import { useSession } from 'next-auth/react'
import { Bell, User } from 'lucide-react'

export default function Navbar({ title }: { title: string }) {
  const { data: session } = useSession()
  const user = session?.user as any

  return (
    <header className="h-16 bg-white border-b border-ayla-border flex items-center justify-between px-6 sticky top-0 z-30">
      <h2 className="text-lg font-bold text-gray-800">{title}</h2>
      <div className="flex items-center gap-4">
        <button className="relative p-2 text-gray-400 hover:text-gray-600 transition-colors">
          <Bell size={20} />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" />
        </button>
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-ayla-gold/10 flex items-center justify-center">
            <User size={16} className="text-ayla-gold" />
          </div>
          <div className="hidden sm:block text-right">
            <p className="text-sm font-medium text-gray-700">{user?.name || user?.email || 'مستخدم'}</p>
            <p className="text-xs text-gray-400">{user?.role === 'admin' ? 'مدير نظام' : user?.role === 'manager' ? 'مدير مشروع' : 'مستخدم'}</p>
          </div>
        </div>
      </div>
    </header>
  )
}
