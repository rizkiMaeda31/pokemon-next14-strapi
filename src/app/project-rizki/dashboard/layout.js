import { Inter } from 'next/font/google'
// import { Providers } from '@/app/providers'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Dashboard',
  description: 'Generated by create next app',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" className='dark'>
      {/* <body className={inter.className}><Providers>{children}</Providers></body> */}
      <body className={inter.className}>{children}</body>
    </html>
  )
}
