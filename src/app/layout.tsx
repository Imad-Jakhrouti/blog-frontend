import type { Metadata } from 'next'
import { Geist } from 'next/font/google'
import ThemeRegistry from '@/components/layout/ThemeRegistry'
import AuthProvider from '@/lib/auth/AuthProvider'
import ReactQueryProvider from './providers'
import Navbar from '@/components/layout/Navbar'
import { Box } from '@mui/material'

const geist = Geist({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'BlogApp',
  description: 'Plateforme de blog moderne',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body className={geist.className}>
        <ThemeRegistry>
          <ReactQueryProvider>
            <AuthProvider>
            <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
              <Navbar />
              <Box component="main" sx={{ flexGrow: 1 }}>
                {children}
              </Box>
            </Box>
            </AuthProvider>
          </ReactQueryProvider>
        </ThemeRegistry>
      </body>
    </html>
  )
}