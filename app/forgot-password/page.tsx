'use client'

export const dynamic = 'force-dynamic'
import { useState } from 'react'
import Link from 'next/link'
import { Loader2, ArrowRight } from 'lucide-react'
import { useToast } from '@/components/toast-provider'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)
  const { addToast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    await new Promise(r => setTimeout(r, 1000))
    setSent(true)
    addToast('تم إرسال رابط إعادة التعيين', 'success')
    setLoading(false)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-ayla-dark to-gray-900 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-ayla-dark">منصة <span className="text-ayla-gold">آيلا</span></h1>
          <p className="text-gray-400 mt-1">نسيت كلمة المرور</p>
        </div>
        {sent ? (
          <div className="text-center space-y-4">
            <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto">
              <ArrowRight size={28} className="text-emerald-600" />
            </div>
            <p className="text-gray-600">تم إرسال رابط إعادة التعيين إلى بريدك الإلكتروني</p>
            <Link href="/login" className="text-ayla-gold hover:underline text-sm">العودة لتسجيل الدخول</Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <input className="ayla-input" type="email" placeholder="البريد الإلكتروني" value={email} onChange={e => setEmail(e.target.value)} required />
            <button type="submit" disabled={loading} className="ayla-btn w-full flex items-center justify-center gap-2">
              {loading ? <Loader2 size={18} className="animate-spin" /> : 'إرسال الرابط'}
            </button>
          </form>
        )}
        <p className="mt-6 text-center text-sm text-gray-500"><Link href="/login" className="text-ayla-gold hover:underline">العودة لتسجيل الدخول</Link></p>
      </div>
    </div>
  )
}
