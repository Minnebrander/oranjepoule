"use client"

import { useState } from "react"
import Link from "next/link"
import { supabase } from "@/lib/supabase"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showForgot, setShowForgot] = useState(false)

  const handleLogin = async () => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      alert(error.message)
      return
    }

    window.location.href = "/"
  }

  const handlePasswordReset = async () => {
    if (!email) {
      alert("Vul eerst je emailadres in.")
      return
    }

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    })

    if (error) {
      alert(error.message)
      return
    }

    alert("We hebben een herstelmail gestuurd. Check je inbox 📩")
  }

  return (
    <main className="min-h-screen bg-gray-950 text-white flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-gradient-to-b from-gray-900 to-gray-950 border border-gray-800 rounded-3xl p-8 shadow-[0_0_40px_rgba(0,0,0,0.45)]">

        <div className="text-center mb-8">
          <div className="text-5xl mb-3">⚽</div>

          <h1 className="text-3xl font-extrabold text-white mb-2">
            Oranjepoule
          </h1>

          <p className="text-gray-400 text-sm">
            Log in en voorspel het WK 2026
          </p>
        </div>

        <div className="space-y-4">

          <input
            type="email"
            placeholder="Emailadres"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-3 rounded-xl bg-gray-800 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-orange-500 transition"
          />

          <input
            type="password"
            placeholder="Wachtwoord"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-3 rounded-xl bg-gray-800 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-orange-500 transition"
          />

          <button
            onClick={handleLogin}
            className="w-full bg-orange-500 hover:bg-orange-600 transition-all duration-200 hover:scale-[1.02] p-3 rounded-xl font-bold shadow-lg shadow-orange-500/20"
          >
            Inloggen
          </button>

          <div className="text-center text-sm text-gray-400">
            Nog geen account?{" "}
            <Link
              href="/register"
              className="text-orange-400 hover:text-orange-300 transition"
            >
              Account aanmaken
            </Link>
          </div>

          <button
            onClick={() => setShowForgot(!showForgot)}
            className="w-full text-sm text-gray-400 hover:text-orange-400 transition"
          >
            Wachtwoord vergeten?
          </button>

          {showForgot && (
            <div className="bg-gray-800 border border-gray-700 rounded-xl p-4 text-sm text-gray-300 text-center space-y-3">
              <p>
                Vul hierboven je emailadres in en klik op onderstaande knop.
              </p>

              <button
                onClick={handlePasswordReset}
                className="w-full bg-gray-700 hover:bg-gray-600 transition p-3 rounded-xl font-bold text-white"
              >
                Herstelmail versturen 📩
              </button>
            </div>
          )}

        </div>
      </div>
    </main>
  )
}