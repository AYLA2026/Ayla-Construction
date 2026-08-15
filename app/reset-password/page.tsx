'use client'

export const dynamic = 'force-dynamic'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Loader2 } from 'lucide-react'
import { useToast } from '@/components/toast-provider'

export default function ResetPasswordPage() {
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const { addToast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (password !== confirm) { addToast('كلمتا المرور غير متطابقتين', 'error'); return }
    setLoading(true)
    await new Promise(r => setTimeout(r, 1000))
    addToast('تم إعادة تعيين كلمة المرور', 'success')
    router.push('/login')
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-ayla-dark to-gray-900 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-ayla-dark">منصة <span className="text-ayla-gold">آيلا</span></h1>
          <p className="text-gray-400 mt-1">إعادة تعيين كلمة المرور</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input className="ayla-input" type="password" placeholder="كلمة المرور الجديدة" value={password} onChange={e => setPassword(e.target.value)} required />
          <input className="ayla-input" type="password" placeholder="تأكيد كلمة المرور" value={confirm} onChange={e => setConfirm(e.target.value)} required />
          <button type="submit" disabled={loading} className="ayla-btn w-full flex items-center justify-center gap-2">
            {loading ? <Loader2 size={18} className="animate-spin" /> : 'حفظ'}
          </button>
        </form>
      </div>
    </div>
  )
}
