import type React from "react"
import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import { SidebarNav } from "@/components/sidebar-nav"
import "./globals.css"

const _geist = Geist({ subsets: ["latin"] })
const _geistMono = Geist_Mono({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Sistema de Gestión de CVs",
  description: "Plataforma para fundaciones de inclusión social",
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es">
      <body className={`font-sans antialiased`}>
        <div className="flex min-h-screen">
          <SidebarNav />
          <main className="flex-1 bg-background">{children}</main>
        </div>
      </body>
    </html>
  )
}
