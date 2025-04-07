import type React from "react"
import { HomeownerSidebar } from "@/components/homeowner-sidebar"

export default function HomeownerLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen flex-col">
      <div className="flex flex-1">
        <HomeownerSidebar />
        <main className="flex-1 p-6 md:p-8 w-full overflow-auto">{children}</main>
      </div>
    </div>
  )
}

