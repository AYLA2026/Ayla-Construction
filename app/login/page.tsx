'use client'
export const dynamic = 'force-dynamic'
import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Loader2, Eye, EyeOff } from 'lucide-react'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [show, setShow] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    const res = await signIn('credentials', { email, password, redirect: false })
    if (res?.error) {
      setError('بيانات الدخول غير صحيحة — تأكد من البريد وكلمة المرور')
      setLoading(false)
    } else {
      router.push('/')
      router.refresh()
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-ayla-dark to-gray-900 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-ayla-dark">منصة <span className="text-ayla-gold">آيلا</span></h1>
          <p className="text-gray-400 mt-1">تسجيل الدخول إلى حسابك</p>
        </div>
        {error && (
          <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-lg text-sm text-center">
            {error}
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">البريد الإلكتروني</label>
            <input type="email" className="ayla-input" value={email} onChange={e => setEmail(e.target.value)} required placeholder="admin@ayla.com" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">كلمة المرور</label>
            <div className="relative">
              <input type={show ? 'text' : 'password'} className="ayla-input pl-10" value={password} onChange={e => setPassword(e.target.value)} required placeholder="••••••••" />
              <button type="button" onClick={() => setShow(!show)} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                {show ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>
          <button type="submit" disabled={loading} className="ayla-btn w-full flex items-center justify-center gap-2">
            {loading ? <Loader2 size={18} className="animate-spin" /> : 'دخول'}
          </button>
        </form>
        <div className="mt-6 text-center text-sm text-gray-500 space-y-2">
          <p><Link href="/signup" className="text-ayla-gold hover:underline">إنشاء حساب جديد</Link></p>
          <p><Link href="/forgot-password" className="text-gray-400 hover:text-gray-600">نسيت كلمة المرور؟</Link></p>
        </div>
      </div>
    </div>
  )
}
