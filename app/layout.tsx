import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import { Poppins } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { Navbar } from "../components/navbar"
import { Footer } from "../components/footer"
import { ModalProvider } from "../components/modal-provider"
import { Suspense } from "react"
import Image from "next/image"
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
          <Footer />
          <ModalProvider />
        </Suspense>
        {/* Floating WhatsApp Icon */}
        <a
          href="https://wa.me/"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="WhatsApp"
          className="fixed bottom-6 right-6 z-50"
        >
          <div className="relative" style={{ width: 62, height: 62 }}>
            <Image src="/08.whatsapp.png" alt="WhatsApp" fill className="object-contain drop-shadow-lg" />
          </div>
        </a>
        <Analytics />
      </body>
    </html>
  )
}
