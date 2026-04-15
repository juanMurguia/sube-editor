import type { Metadata } from 'next'
import {
  Archivo,
  IBM_Plex_Mono,
  Inter,
  JetBrains_Mono,
  Roboto_Mono,
  Sora,
  Space_Grotesk,
} from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { Toaster } from '@/components/ui/toaster'
import './globals.css'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter', display: 'swap' })
const spaceGrotesk = Space_Grotesk({ subsets: ['latin'], variable: '--font-space-grotesk', display: 'swap' })
const sora = Sora({ subsets: ['latin'], variable: '--font-sora', display: 'swap' })
const archivo = Archivo({ subsets: ['latin'], variable: '--font-archivo', display: 'swap' })
const robotoMono = Roboto_Mono({
  subsets: ['latin'],
  variable: '--font-roboto-mono',
  display: 'swap',
  weight: ['400', '500', '700'],
})
const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-jetbrains-mono',
  display: 'swap',
  weight: ['400', '500', '700'],
})
const ibmPlexMono = IBM_Plex_Mono({
  subsets: ['latin'],
  variable: '--font-ibm-plex-mono',
  display: 'swap',
  weight: ['400', '500', '700'],
})

export const metadata: Metadata = {
  title: 'Tu SUBE Personalizada',
  description: 'Personalizá tu SUBE con fotos y colores propios. Generá el diseño en PDF listo para imprimir.',
  generator: 'v0.app',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es">
      <body
        className={`${inter.variable} ${spaceGrotesk.variable} ${sora.variable} ${archivo.variable} ${robotoMono.variable} ${jetbrainsMono.variable} ${ibmPlexMono.variable} font-sans antialiased`}
      >
        {children}
        <Toaster />
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
