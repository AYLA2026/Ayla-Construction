'use client'
import { createContext, useContext, useState, useCallback } from 'react'
import { X, CheckCircle, AlertCircle } from 'lucide-react'

type ToastType = 'success' | 'error'
interface Toast { id: string; message: string; type: ToastType }
interface ToastContextType { addToast: (message: string, type?: ToastType) => void }

const ToastContext = createContext<ToastContextType>({ addToast: () => {} })

export function useToast() { return useContext(ToastContext) }

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([])

  const addToast = useCallback((message: string, type: ToastType = 'success') => {
    const id = Math.random().toString(36).slice(2)
    setToasts(prev => [...prev, { id, message, type }])
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 3000)
  }, [])

  return (
    <ToastContext.Provider value={{ addToast }}>
      {children}
      <div className="fixed top-4 left-4 z-50 space-y-2">
        {toasts.map(t => (
          <div key={t.id} className={`flex items-center gap-2 px-4 py-3 rounded-lg shadow-lg text-white text-sm animate-in slide-in-from-left ${t.type === 'success' ? 'bg-emerald-600' : 'bg-red-600'}`}>
            {t.type === 'success' ? <CheckCircle size={16} /> : <AlertCircle size={16} />}
            <span>{t.message}</span>
            <button onClick={() => setToasts(prev => prev.filter(x => x.id !== t.id))} className="mr-2"><X size={14} /></button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  )
}
