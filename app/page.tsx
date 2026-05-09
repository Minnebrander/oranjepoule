"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { supabase } from "@/lib/supabase"

export default function Home() {
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    const checkUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      setUser(user)
    }

    checkUser()
  }, [])

  return (
    <main className="min-h-screen bg-gray-950 text-white flex flex-col items-center justify-center px-6">

      <h1 className="text-5xl font-bold mb-4">
        ⚽ Oranjepoule 2026
      </h1>

      {user && (
        <p className="text-green-400 mt-2">
          Welkom terug, {user.email} 👋
        </p>
      )}

      <p className="text-gray-400 text-center max-w-xl mb-8">
        Voorspel alle wedstrijden, bouw jouw perfecte bracket en win de prijzenpot 💰
      </p>

      <div className="flex gap-4">

        <Link href={user ? "/voorspellen" : "/login"}>
  <button className="bg-orange-500 px-6 py-3 rounded-xl font-semibold hover:bg-orange-600 transition">
    Meedoen (€15)
  </button>
</Link>

        <Link href="/uitleg">
          <button className="bg-gray-800 px-6 py-3 rounded-xl hover:bg-gray-700 transition">
            Hoe werkt het?
          </button>
        </Link>

      </div>

    </main>
  )
}