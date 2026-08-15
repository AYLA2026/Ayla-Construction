'use client'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { Loader2 } from 'lucide-react'

export default function AuthGuard({ children, allowedRoles }: { children: React.ReactNode; allowedRoles?: string[] }) {
  const { data: session, status } = useSession()
  const router = useRouter()
  const user = session?.user as any

  useEffect(() => {
    if (status === 'unauthenticated') router.push('/login')
  }, [status, router])

  if (status === 'loading' || status === 'unauthenticated') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 size={32} className="text-ayla-gold animate-spin" />
      </div>
    )
  }

  if (allowedRoles && user && !allowedRoles.includes(user.role)) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-bold text-red-600 mb-2">غير مصرح</h2>
          <p className="text-gray-500">ليس لديك صلاحية الوصول لهذه الصفحة</p>
        </div>
      </div>
    )
  }

  if (!session) return null

  return <>{children}</>
}
