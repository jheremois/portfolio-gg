// This is the root layout component for your Next.js app.
// Learn more: https://nextjs.org/docs/app/building-your-application/routing/pages-and-layouts#root-layout-required
import { Archivo } from 'next/font/google'
import { Roboto } from 'next/font/google'
import { cn } from '@/lib/utils'
import './globals.css'

const fontHeading = Archivo({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-heading',
})

const fontBody = Roboto({
  subsets: ['latin'],
  display: 'swap',
  weight: ['100', '300', '400', '500', '700', '900'],
  variable: '--font-body',
})

export default function Layout({ children }: any) {
  return (
    <html lang="en">
      <body 
        className={cn(
          'antialiased',
          fontHeading.variable,
          fontBody.variable
        )}
      >
        {children}
      </body>
    </html>
  )
}