import Navbar from '@/components/layout/navbar/Navbar'
import '../styles/globals.css'
import type { Metadata } from 'next'
import Footer from '@/components/layout/footer/Footer'
import JumpButton from '@/components/ui/JumpButton'

export const metadata: Metadata = {
  title: 'Splendor',
  description: 'Splendor Website',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <Navbar/>
        {children}
        <div className="footersection relative">
          <Footer/>
          <JumpButton/>
        </div>
      </body>
    </html>
  )
}
