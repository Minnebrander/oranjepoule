"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"
import { poules } from "@/lib/poules"

const ADMIN_EMAIL = "minne.brander@gmail.com"

export default function AdminPage() {
  const [isAdmin, setIsAdmin] = useState(false)
  const [loading, setLoading] = useState(true)
  const [results, setResults] = useState<Record<string, { score1: string; score2: string }>>({})

  useEffect(() => {
    const loadAdmin = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (user?.email === ADMIN_EMAIL) {
        setIsAdmin(true)
      }

      const { data } = await supabase.from("results").select("*")

      const mapped: Record<string, { score1: string; score2: string }> = {}

      data?.forEach((row) => {
        mapped[row.match_id] = {
          score1: row.score1?.toString() || "",
          score2: row.score2?.toString() || "",
        }
      })

      setResults(mapped)
      setLoading(false)
    }

    loadAdmin()
  }, [])

  const saveResult = async (matchId: string) => {
    const result = results[matchId]

    if (!result?.score1 || !result?.score2) {
      alert("Vul beide scores in")
      return
    }

    const { error } = await supabase.from("results").upsert(
      {
        match_id: matchId,
        score1: Number(result.score1),
        score2: Number(result.score2),
      },
      {
        onConflict: "match_id",
      }
    )

    if (error) {
      alert(error.message)
      return
    }

    alert("Uitslag opgeslagen ✅")
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-gray-950 text-white flex items-center justify-center">
        Laden...
      </main>
    )
  }

  if (!isAdmin) {
    return (
      <main className="min-h-screen bg-gray-950 text-white flex items-center justify-center px-4">
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8 text-center max-w-md">
          <h1 className="text-2xl font-bold mb-3">Geen toegang 🔒</h1>
          <p className="text-gray-400">
            Alleen de beheerder kan uitslagen invoeren.
          </p>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-gray-950 text-white px-4 py-10">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-4xl font-extrabold text-center mb-8">
          Admin uitslagen 🛠️
        </h1>

        <div className="grid gap-8">
          {Object.entries(poules).map(([pouleKey, wedstrijden]) => (
            <div
              key={pouleKey}
              className="bg-gradient-to-b from-gray-900 to-gray-950 border border-gray-800 rounded-3xl p-6 shadow-[0_0_30px_rgba(0,0,0,0.35)]"
            >
              <h2 className="text-2xl font-bold mb-4">Poule {pouleKey}</h2>

              <div className="grid gap-3">
                {wedstrijden.map((wedstrijd, index) => {
                  const matchId = `${pouleKey}-${index}`
                  const result = results[matchId] || { score1: "", score2: "" }

                  return (
                    <div
                      key={matchId}
                      className="grid md:grid-cols-[80px_1fr_120px_110px] gap-3 items-center bg-gray-800 rounded-xl p-3"
                    >
                      <div className="text-sm text-gray-400">{matchId}</div>

                      <div className="text-sm md:text-base">
                        {wedstrijd.team1} - {wedstrijd.team2}
                      </div>

                      <div className="flex items-center gap-2 justify-start md:justify-center">
                        <input
                          type="number"
                          value={result.score1}
                          onChange={(e) =>
                            setResults((prev) => ({
                              ...prev,
                              [matchId]: {
                                ...result,
                                score1: e.target.value,
                              },
                            }))
                          }
                          className="w-12 rounded bg-gray-700 border border-gray-600 text-center p-2"
                        />

                        <span>-</span>

                        <input
                          type="number"
                          value={result.score2}
                          onChange={(e) =>
                            setResults((prev) => ({
                              ...prev,
                              [matchId]: {
                                ...result,
                                score2: e.target.value,
                              },
                            }))
                          }
                          className="w-12 rounded bg-gray-700 border border-gray-600 text-center p-2"
                        />
                      </div>

                      <button
                        onClick={() => saveResult(matchId)}
                        className="bg-orange-500 hover:bg-orange-600 transition rounded-xl px-4 py-2 font-bold"
                      >
                        Opslaan
                      </button>
                    </div>
                  )
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  )
}