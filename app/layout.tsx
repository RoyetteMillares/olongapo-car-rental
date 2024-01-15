import type { Metadata } from 'next'
import { Outfit } from 'next/font/google'
import './globals.css'
import { ClerkProvider } from "@clerk/nextjs";
import { ToasterProvider } from "@/components/toaster-provider";


const inter = Outfit({ subsets: ['latin'], weight: ["500"] })

export const metadata: Metadata = {
  title: 'Car and Motorcycle For Rent',
  description: 'Best Car and Motorcycle Rental in Olongapo',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={inter.className}>
          {children}
          <ToasterProvider />
        </body>
      </html>
    </ClerkProvider>
  )
}
