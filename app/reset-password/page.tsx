"use client"

import { useState } from "react"
import { supabase } from "@/lib/supabase"

export default function ResetPasswordPage() {
  const [password, setPassword] = useState("")
  const [repeatPassword, setRepeatPassword] = useState("")

  const handleResetPassword = async () => {
    if (!password || !repeatPassword) {
      alert("Vul beide wachtwoordvelden in.")
      return
    }

    if (password !== repeatPassword) {
      alert("Wachtwoorden komen niet overeen.")
      return
    }

    const { error } = await supabase.auth.updateUser({
      password,
    })

    if (error) {
      alert(error.message)
      return
    }

    alert("Wachtwoord aangepast! Je kunt nu opnieuw inloggen.")
    window.location.href = "/login"
  }

  return (
    <main className="min-h-screen bg-gray-950 text-white flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-gradient-to-b from-gray-900 to-gray-950 border border-gray-800 rounded-3xl p-8 shadow-[0_0_40px_rgba(0,0,0,0.45)]">
        <div className="text-center mb-8">
          <div className="text-5xl mb-3">🔐</div>

          <h1 className="text-3xl font-extrabold text-white mb-2">
            Nieuw wachtwoord
          </h1>

          <p className="text-gray-400 text-sm">
            Kies een nieuw wachtwoord voor je account.
          </p>
        </div>

        <div className="space-y-4">
          <input
            type="password"
            placeholder="Nieuw wachtwoord"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-3 rounded-xl bg-gray-800 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-orange-500 transition"
          />

          <input
            type="password"
            placeholder="Herhaal nieuw wachtwoord"
            value={repeatPassword}
            onChange={(e) => setRepeatPassword(e.target.value)}
            className="w-full p-3 rounded-xl bg-gray-800 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-orange-500 transition"
          />

          <button
            onClick={handleResetPassword}
            className="w-full bg-orange-500 hover:bg-orange-600 transition-all duration-200 hover:scale-[1.02] p-3 rounded-xl font-bold shadow-lg shadow-orange-500/20"
          >
            Wachtwoord opslaan
          </button>
        </div>
      </div>
    </main>
  )
}