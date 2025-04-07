import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { SidebarProvider } from "@/components/ui/sidebar"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/toaster"
// Import the LiquidEffect component
import { LiquidEffect } from "@/components/liquid-effect"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Arcanium",
  description: "Smart renovation platform connecting homeowners with contractors",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
          <SidebarProvider>{children}</SidebarProvider>
          <LiquidEffect />
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  )
}



import './globals.css'