"use client"

import { useState } from "react"
import { supabase } from "@/lib/supabase"
import Link from "next/link"

export default function RegisterPage() {
  const [username, setUsername] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [repeatPassword, setRepeatPassword] = useState("")

  const handleSignup = async () => {
    if (password !== repeatPassword) {
      alert("Wachtwoorden komen niet overeen")
      return
    }

    if (username.length < 3) {
      alert("Gebruikersnaam moet minimaal 3 tekens zijn")
      return
    }

    const { error } = await supabase.auth.signUp({
      email,
      password,
    })

    if (error) {
      alert(error.message)
      return
    }

    const { error: profileError } = await supabase
      .from("profiles")
      .insert([
        {
          email,
          username,
        },
      ])

    if (profileError) {
      alert(profileError.message)
      return
    }

    alert("Account aangemaakt! 🎉")
    window.location.href = "/login"
  }

  return (
    <main className="min-h-screen bg-gray-950 text-white flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-gradient-to-b from-gray-900 to-gray-950 border border-gray-800 rounded-3xl p-8 shadow-[0_0_40px_rgba(0,0,0,0.45)]">

        <div className="text-center mb-8">
          <div className="text-5xl mb-3">⚽</div>

          <h1 className="text-3xl font-extrabold text-white mb-2">
            Account aanmaken
          </h1>

          <p className="text-gray-400 text-sm">
            Maak jouw WK 2026 account aan
          </p>
        </div>

        <div className="space-y-4">

          <input
            type="text"
            placeholder="Gebruikersnaam"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full p-3 rounded-xl bg-gray-800 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-orange-500"
          />

          <input
            type="email"
            placeholder="Emailadres"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-3 rounded-xl bg-gray-800 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-orange-500"
          />

          <input
            type="password"
            placeholder="Wachtwoord"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-3 rounded-xl bg-gray-800 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-orange-500"
          />

          <input
            type="password"
            placeholder="Herhaal wachtwoord"
            value={repeatPassword}
            onChange={(e) => setRepeatPassword(e.target.value)}
            className="w-full p-3 rounded-xl bg-gray-800 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-orange-500"
          />

          <button
            onClick={handleSignup}
            className="w-full bg-orange-500 hover:bg-orange-600 transition p-3 rounded-xl font-bold"
          >
            Account aanmaken
          </button>

          <div className="text-center text-sm text-gray-400">
            Heb je al een account?{" "}
            <Link
              href="/login"
              className="text-orange-400 hover:text-orange-300"
            >
              Inloggen
            </Link>
          </div>

        </div>
      </div>
    </main>
  )
}