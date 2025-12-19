import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import { Poppins } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { Navbar } from "../components/navbar"
import { ConditionalFooter } from "../components/conditional-footer"
import { ModalProvider } from "../components/modal-provider"
import { Suspense } from "react"
import "./globals.css"

const poppins = Poppins({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
  variable: "--font-poppins",
})

export const metadata: Metadata = {
  title: "Tangram.ai - AI Agent Store",
  description: "Explore AI-powered agents built to automate workflows",
  generator: "v0.app",
  icons: {
    icon: [
      { url: '/img/Crayon Logo.png', type: 'image/png' },
    ],
    shortcut: '/img/Crayon Logo.png',
    apple: '/img/Crayon Logo.png',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable} ${poppins.variable}`}>
        <Suspense fallback={<div>Loading...</div>}>
          <Navbar />
          <main className="min-h-screen">{children}</main>
          <ConditionalFooter />
          <ModalProvider />
        </Suspense>
        <Analytics />
      </body>
    </html>
  )
}
