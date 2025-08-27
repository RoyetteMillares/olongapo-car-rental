"use client"
import Navbar from "@/components/navbar"

export default function RoutesLayout({ children }: { children: React.ReactNode }) {
  return (
    <main className="w-full h-full overflow-auto bg-white">
      <div className="shadow-md">
        <Navbar />
      </div>
      <div className="mx-auto max-w-screen-xl w-full h-full">
        {children}
      </div>
    </main>
  )
}


