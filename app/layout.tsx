import './globals.css'
import type { Metadata } from 'next'
import { Urbanist } from 'next/font/google'
import ModalProvider from '@/providers/modal-provider'
import ToastProvider from '@/providers/toast-provider'
import { ClerkProvider } from '@clerk/nextjs'
import Category from '@/components/catergory'
import Navbar from '@/components/navbar'
import Footer from '@/components/footer'
import Providers from './providers'

const urban = Urbanist({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Stack Market Store',
  description: 'Store',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={urban.className}>
          <ModalProvider />
          <ToastProvider />
          <Navbar />
          <Category />
          <Providers>
            {children}
          </Providers>
          <Footer />
        </body>
      </html>
    </ClerkProvider>

  )
}
