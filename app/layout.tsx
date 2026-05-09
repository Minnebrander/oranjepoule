"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { supabase } from "@/lib/supabase"
import "./globals.css"

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [user, setUser] = useState<string | null>(null)

  useEffect(() => {
    const getUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      setUser(user?.email || null)
    }

    getUser()

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user?.email || null)
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    setUser(null)
    window.location.href = "/"
  }

  return (
    <html lang="nl">
      <body className="bg-gray-950 text-white">
        {/* NAVBAR */}
        <nav className="flex items-center justify-between px-4 py-4 bg-gray-900 border-b border-gray-800">
          <Link href="/" className="min-w-0">
            <h1 className="text-lg sm:text-xl font-bold text-orange-500 truncate">
              ⚽ Oranjepoule
            </h1>
          </Link>

          <div className="flex items-center gap-2 shrink-0">
            <Link
              href="/uitleg"
              className="px-3 py-2 rounded-lg bg-gray-700 text-white text-sm font-semibold hover:bg-gray-600 transition"
            >
              Uitleg
            </Link>

            {user ? (
              <div className="flex items-center gap-2">
                <span className="hidden sm:inline text-gray-300 text-sm max-w-[220px] truncate">
                  👋 {user}
                </span>

                <button
                  onClick={handleLogout}
                  className="px-3 py-2 rounded-lg bg-red-600 hover:bg-red-500 text-white text-sm font-bold transition"
                >
                  Logout
                </button>
              </div>
            ) : (
              <Link
                href="/login"
                className="bg-orange-500 px-4 py-2 rounded-lg hover:bg-orange-600 transition font-semibold"
              >
                Login
              </Link>
            )}
          </div>
        </nav>

        <main>{children}</main>
      </body>
    </html>
  )
}
