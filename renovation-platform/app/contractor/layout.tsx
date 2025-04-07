import type React from "react"
import { ContractorSidebar } from "@/components/contractor-sidebar"

export default function ContractorLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      <div className="flex flex-1">
        <ContractorSidebar />
        <main className="flex-1 p-6 md:p-8 w-full overflow-auto">{children}</main>
      </div>
    </div>
  )
}

