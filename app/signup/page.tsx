'use client'

export const dynamic = 'force-dynamic'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Loader2, Eye, EyeOff } from 'lucide-react'
import { useToast } from '@/components/toast-provider'

export default function SignupPage() {
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' })
  const [show, setShow] = useState(false)
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const { addToast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (form.password !== form.confirm) { addToast('كلمتا المرور غير متطابقتين', 'error'); return }
    setLoading(true)
    try {
      const res = await fetch('/api/users', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: form.name, email: form.email, password: form.password })
      })
      if (res.ok) { addToast('تم إنشاء الحساب بنجاح', 'success'); router.push('/login') }
      else { const data = await res.json(); addToast(data.error || 'حدث خطأ', 'error') }
    } catch { addToast('حدث خطأ', 'error') }
    setLoading(false)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-ayla-dark to-gray-900 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-ayla-dark">منصة <span className="text-ayla-gold">آيلا</span></h1>
          <p className="text-gray-400 mt-1">إنشاء حساب جديد</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input className="ayla-input" placeholder="الاسم الكامل" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required />
          <input className="ayla-input" type="email" placeholder="البريد الإلكتروني" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} required />
          <div className="relative">
            <input className="ayla-input pl-10" type={show ? 'text' : 'password'} placeholder="كلمة المرور" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} required />
            <button type="button" onClick={() => setShow(!show)} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">{show ? <EyeOff size={18} /> : <Eye size={18} />}</button>
          </div>
          <input className="ayla-input" type="password" placeholder="تأكيد كلمة المرور" value={form.confirm} onChange={e => setForm({ ...form, confirm: e.target.value })} required />
          <button type="submit" disabled={loading} className="ayla-btn w-full flex items-center justify-center gap-2">
            {loading ? <Loader2 size={18} className="animate-spin" /> : 'إنشاء الحساب'}
          </button>
        </form>
        <p className="mt-6 text-center text-sm text-gray-500">لديك حساب؟ <Link href="/login" className="text-ayla-gold hover:underline">تسجيل الدخول</Link></p>
      </div>
    </div>
  )
}
