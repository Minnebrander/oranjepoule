"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"

export default function LeaderboardPage() {
  const [leaderboard, setLeaderboard] = useState<any[]>([])

  useEffect(() => {
    const loadLeaderboard = async () => {
      const { data: predictions } = await supabase
        .from("predictions")
        .select("*")

      const { data: results } = await supabase
        .from("results")
        .select("*")

      const { data: profiles } = await supabase
        .from("profiles")
        .select("*")

      const resultMap: any = {}
      const profileMap: any = {}

      results?.forEach((result) => {
        resultMap[result.match_id] = result
      })

      profiles?.forEach((profile) => {
        profileMap[profile.email] = profile.username
      })

      const scores = predictions?.map((prediction) => {
        let punten = 0

        Object.entries(prediction.scores || {}).forEach(([matchId, voorspelling]: any) => {
          const result = resultMap[matchId]
          if (!result) return

          const voorspeldeS1 = Number(voorspelling.s1)
          const voorspeldeS2 = Number(voorspelling.s2)
          const echteS1 = Number(result.score1)
          const echteS2 = Number(result.score2)

          const voorspeldeUitkomst =
            voorspeldeS1 > voorspeldeS2 ? "1" :
            voorspeldeS1 < voorspeldeS2 ? "2" : "X"

          const echteUitkomst =
            echteS1 > echteS2 ? "1" :
            echteS1 < echteS2 ? "2" : "X"

          if (voorspeldeUitkomst === echteUitkomst) punten += 4
          if (voorspeldeS1 === echteS1) punten += 2
          if (voorspeldeS2 === echteS2) punten += 2
          if (voorspeldeS1 === echteS1 && voorspeldeS2 === echteS2) punten += 2
        })

        return {
          user_email: prediction.user_email,
          username: profileMap[prediction.user_email] || prediction.user_email,
          punten,
        }
      }) || []

      setLeaderboard(scores.sort((a, b) => b.punten - a.punten))
    }

    loadLeaderboard()
  }, [])

  return (
    <main className="min-h-screen bg-gray-950 text-white px-4 py-10">
      <div className="max-w-3xl mx-auto">
  <Link href="/voorspellen">
    <button className="mb-6 bg-gray-800 hover:bg-gray-700 transition px-4 py-2 rounded-xl font-semibold">
      ← Terug naar voorspellen
    </button>
  </Link>

  <h1 className="text-4xl font-extrabold text-center mb-8">
    Leaderboard 🏆
  </h1>

        <div className="bg-gradient-to-b from-gray-900 to-gray-950 border border-gray-800 rounded-3xl overflow-hidden shadow-[0_0_30px_rgba(0,0,0,0.35)]">
          {leaderboard.map((speler, index) => (
            <div
              key={speler.user_email}
              className="grid grid-cols-[60px_1fr_80px] items-center px-5 py-4 border-b border-gray-800 last:border-b-0"
            >
              <div className="font-bold text-orange-400">
                {index === 0 ? "🥇" : index === 1 ? "🥈" : index === 2 ? "🥉" : `#${index + 1}`}
              </div>

              <div className="truncate font-semibold">
                {speler.username}
              </div>

              <div className="text-right font-bold text-green-400">
                {speler.punten} pt
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  )
}