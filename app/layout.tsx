import type { Metadata } from 'next'
import './globals.css'
import { Providers } from './providers'

export const metadata: Metadata = {
  title: 'منصة آيلا لإدارة المشاريع',
  description: 'نظام إدارة مشاريع البناء والفلل',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ar" dir="rtl">
      <body className="bg-gray-50 text-gray-800 font-sans">
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
