"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"
import { poules, teamsPerPoule } from "@/lib/poules"
import { getBesteDerdeCombinatieKey, getDerdePouleVoorDuel } from "@/lib/ThirdPlaceMatrix"


const extraKeys = [
  "geleKaarten",
  "rodeKaarten",
  "totaalDoelpunten",
  "doelpuntenNederland",
  "topscorerNederland",
  "topscorerToernooi",
  "meesteTegengoalsLand",
  "meesteGoalsLand",
]

export default function LeaderboardPage() {
  const [leaderboard, setLeaderboard] = useState<any[]>([])
  const [selectedSpeler, setSelectedSpeler] = useState<any | null>(null)

  useEffect(() => {
    const loadLeaderboard = async () => {
      const { data: predictions } = await supabase.from("predictions").select("*")
      const { data: results } = await supabase.from("results").select("*")
      const { data: profiles } = await supabase.from("profiles").select("*")
      const { data: actuals } = await supabase.from("actuals").select("*")

      const resultMap: any = {}
      const profileMap: any = {}
      const actualMap: any = {}

      results?.forEach((result) => {
        resultMap[result.match_id] = result
      })

      profiles?.forEach((profile) => {
        profileMap[profile.email] = profile.username
      })

      actuals?.forEach((actual) => {
        actualMap[actual.key] = actual.value
      })

const getWedstrijdKey = (pouleKey: string, index: number) => {
  return `${pouleKey}-${index}`
}

const berekenPouleStandVoorScores = (
  pouleKey: string,
  userScores: { [key: string]: { s1?: string; s2?: string } }
) => {
  const wedstrijden = poules[pouleKey as keyof typeof poules]
  const teams = teamsPerPoule[pouleKey as keyof typeof teamsPerPoule]

  const stand = teams.map((land) => ({
    land,
    voor: 0,
    tegen: 0,
    saldo: 0,
    punten: 0,
  }))

  wedstrijden.forEach((w, i) => {
    const key = getWedstrijdKey(pouleKey, i)
    const voorspelling = userScores[key]

    if (!voorspelling) return
    if (voorspelling.s1 == null || voorspelling.s2 == null) return
    if (voorspelling.s1 === "" || voorspelling.s2 === "") return

    const s1 = parseInt(voorspelling.s1 || "0")
    const s2 = parseInt(voorspelling.s2 || "0")

    const team1 = stand.find((t) => t.land === w.team1)
    const team2 = stand.find((t) => t.land === w.team2)

    if (!team1 || !team2) return

    team1.voor += s1
    team1.tegen += s2
    team2.voor += s2
    team2.tegen += s1

    if (s1 > s2) {
      team1.punten += 3
    } else if (s1 < s2) {
      team2.punten += 3
    } else {
      team1.punten += 1
      team2.punten += 1
    }
  })

  stand.forEach((team) => {
    team.saldo = team.voor - team.tegen
  })

  return stand.sort((a, b) => {
    if (b.punten !== a.punten) return b.punten - a.punten
    if (b.saldo !== a.saldo) return b.saldo - a.saldo
    return b.voor - a.voor
  })
}

const berekenPouleStandPunten = (
  userScores: { [key: string]: { s1?: string; s2?: string } }
) => {
  let punten = 0

  Object.keys(poules).forEach((pouleKey) => {
    const voorspeldeStand = berekenPouleStandVoorScores(pouleKey, userScores)

    const echteStandRaw = actualMap[`stand-${pouleKey}`]
    if (!echteStandRaw) return

    let echteStand: string[] = []

    try {
      echteStand = JSON.parse(echteStandRaw)
    } catch {
      echteStand = []
    }

    voorspeldeStand.forEach((team, index) => {
      if (team.land === echteStand[index]) {
        punten += 3
      }
    })
  })

  return punten
}

      
const getTeamsUitDuelRange = (
  winners: Record<number, string>,
  start: number,
  end: number
) => {
  return Object.entries(winners)
    .filter(([duel]) => {
      const nummer = Number(duel)
      return nummer >= start && nummer <= end
    })
    .map(([, team]) => team)
    .filter(Boolean)
}

const telRondePunten = (
  voorspeldeTeams: string[],
  echteTeams: string[],
  puntenPerTeam: number
) => {
  const echteSet = new Set(echteTeams)
  const uniekeVoorspeldeTeams = Array.from(new Set(voorspeldeTeams))

  return uniekeVoorspeldeTeams.reduce((totaal, team) => {
    return totaal + (echteSet.has(team) ? puntenPerTeam : 0)
  }, 0)
}

const berekenPouleStandVoorSpeler = (
  pouleKey: string,
  userScores: { [key: string]: { s1?: string; s2?: string } }
) => {
  const wedstrijden = poules[pouleKey as keyof typeof poules]
  const teams = teamsPerPoule[pouleKey as keyof typeof teamsPerPoule]

  const stand = teams.map((land) => ({
    land,
    gespeeld: 0,
    winst: 0,
    gelijk: 0,
    verlies: 0,
    voor: 0,
    tegen: 0,
    saldo: 0,
    punten: 0,
  }))

  wedstrijden.forEach((w, i) => {
    const key = getWedstrijdKey(pouleKey, i)
    const voorspelling = userScores[key]

    if (!voorspelling) return
    if (voorspelling.s1 == null || voorspelling.s2 == null) return
    if (voorspelling.s1 === "" || voorspelling.s2 === "") return

    const s1 = parseInt(voorspelling.s1 || "0")
    const s2 = parseInt(voorspelling.s2 || "0")

    const team1 = stand.find((t) => t.land === w.team1)
    const team2 = stand.find((t) => t.land === w.team2)

    if (!team1 || !team2) return

    team1.gespeeld += 1
    team2.gespeeld += 1

    team1.voor += s1
    team1.tegen += s2
    team2.voor += s2
    team2.tegen += s1

    if (s1 > s2) {
      team1.winst += 1
      team2.verlies += 1
      team1.punten += 3
    } else if (s1 < s2) {
      team2.winst += 1
      team1.verlies += 1
      team2.punten += 3
    } else {
      team1.gelijk += 1
      team2.gelijk += 1
      team1.punten += 1
      team2.punten += 1
    }
  })

  stand.forEach((team) => {
    team.saldo = team.voor - team.tegen
  })

  return stand.sort((a, b) => {
    if (b.punten !== a.punten) return b.punten - a.punten
    if (b.saldo !== a.saldo) return b.saldo - a.saldo
    return b.voor - a.voor
  })
}

const getBesteDerdesVoorSpeler = (
  userScores: { [key: string]: { s1?: string; s2?: string } }
) => {
  const derdes = Object.keys(poules).map((pouleKey) => {
    const stand = berekenPouleStandVoorSpeler(pouleKey, userScores)

    return {
      poule: pouleKey,
      ...stand[2],
    }
  })

  return derdes
    .sort((a, b) => {
      if (b.punten !== a.punten) return b.punten - a.punten
      if (b.saldo !== a.saldo) return b.saldo - a.saldo
      if (b.voor !== a.voor) return b.voor - a.voor
      return a.land.localeCompare(b.land)
    })
    .slice(0, 8)
}

const getDerdeVoorDuelSpeler = (
  duel: 74 | 77 | 79 | 80 | 81 | 82 | 85 | 87,
  userScores: { [key: string]: { s1?: string; s2?: string } }
) => {
  const besteDerdes = getBesteDerdesVoorSpeler(userScores)

  const combinatieKey = getBesteDerdeCombinatieKey(
    besteDerdes.map((team) => team.poule)
  )

  const pouleKey = getDerdePouleVoorDuel(combinatieKey, duel)
  if (!pouleKey) return null

  return besteDerdes.find((team) => team.poule === pouleKey)?.land || null
}

const getLaatste32VoorSpeler = (
  userScores: { [key: string]: { s1?: string; s2?: string } }
): { home: string | null; away: string | null }[] => {
  const getStand = (pouleKey: string) =>
    berekenPouleStandVoorSpeler(pouleKey, userScores)

  const getTeam = (pouleKey: string, plek: number) =>
    getStand(pouleKey)[plek - 1]?.land || null

  return [
    { home: getTeam("A", 2), away: getTeam("B", 2) },
    { home: getTeam("C", 1), away: getTeam("F", 2) },
    { home: getTeam("E", 1), away: getDerdeVoorDuelSpeler(74, userScores) },
    { home: getTeam("F", 1), away: getTeam("C", 2) },
    { home: getTeam("E", 2), away: getTeam("I", 2) },
    { home: getTeam("I", 1), away: getDerdeVoorDuelSpeler(77, userScores) },
    { home: getTeam("A", 1), away: getDerdeVoorDuelSpeler(79, userScores) },
    { home: getTeam("L", 1), away: getDerdeVoorDuelSpeler(80, userScores) },
    { home: getTeam("G", 1), away: getDerdeVoorDuelSpeler(82, userScores) },
    { home: getTeam("D", 1), away: getDerdeVoorDuelSpeler(81, userScores) },
    { home: getTeam("H", 1), away: getTeam("J", 2) },
    { home: getTeam("K", 2), away: getTeam("L", 2) },
    { home: getTeam("B", 1), away: getDerdeVoorDuelSpeler(85, userScores) },
    { home: getTeam("D", 2), away: getTeam("G", 2) },
    { home: getTeam("J", 1), away: getTeam("H", 2) },
    { home: getTeam("K", 1), away: getDerdeVoorDuelSpeler(87, userScores) },
  ]
}
const berekenKnockoutPuntenVoorSpeler = (
  userKnockoutWinners: Record<number, string>,
  userScores: any = {}
) => {
  let punten = 0

  const getRonde = (key: string) => {
    try {
      return actualMap[key] ? JSON.parse(actualMap[key]) : []
    } catch {
      return []
    }
  }

  const voorspeldeLaatste32 = getLaatste32VoorSpeler(userScores)
    .flatMap((duel) => [duel.home, duel.away])
    .filter(Boolean) as string[]

  punten += telRondePunten(
    voorspeldeLaatste32,
    getRonde("ronde-laatste32"),
    10
  )

  punten += telRondePunten(
    Object.values(userKnockoutWinners || {}),
    getRonde("ronde-laatste16"),
    15
  )

  punten += telRondePunten(
    Object.values(userKnockoutWinners || {}),
    getRonde("ronde-kwartfinale"),
    20
  )

  punten += telRondePunten(
    Object.values(userKnockoutWinners || {}),
    getRonde("ronde-halvefinale"),
    25
  )

  punten += telRondePunten(
    Object.values(userKnockoutWinners || {}),
    getRonde("ronde-finalisten"),
    30
  )

  punten += telRondePunten(
    Object.values(userKnockoutWinners || {}),
    getRonde("ronde-wereldkampioen"),
    30
  )

  punten += telRondePunten(
    Object.values(userKnockoutWinners || {}),
    getRonde("ronde-troostwinnaar"),
    30
  )

  return punten
}
const scores = predictions?.map((prediction) => {
        let punten = 0

        punten += berekenPouleStandPunten(prediction.scores || {})

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

        punten += berekenKnockoutPuntenVoorSpeler(
  prediction.knockout || {},
  prediction.scores || {}
)

        

        extraKeys.forEach((key) => {
          const echteWaarde = actualMap[`extra-${key}`]
          const voorspeldeWaarde = prediction.extra?.[key]

          if (!echteWaarde || !voorspeldeWaarde) return

          if (
            String(echteWaarde).trim().toLowerCase() ===
            String(voorspeldeWaarde).trim().toLowerCase()
          ) {
            punten += 15
          }
        })

        return {
  user_email: prediction.user_email,
  username:
    profileMap[prediction.user_email] ||
    prediction.user_email.split("@")[0] ||
    "Deelnemer",
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
  <button
    key={speler.user_email}
    onClick={() => setSelectedSpeler({ ...speler, positie: index + 1 })}
    className="w-full grid grid-cols-[60px_1fr_80px] items-center px-5 py-4 border-b border-gray-800 last:border-b-0 hover:bg-gray-800/70 transition text-left"
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
            </button>
          ))}
        </div>
      </div>
            {selectedSpeler && (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center px-4">
          <div className="bg-gray-900 border border-gray-700 rounded-3xl p-5 w-[calc(100vw-2rem)] max-w-md max-h-[85vh] overflow-y-auto shadow-2xl">
            <div className="flex items-start justify-between gap-4 mb-4">
              <div>
                <p className="text-sm text-gray-400">
                  Positie #{selectedSpeler.positie}
                </p>

                <h2 className="text-xl sm:text-2xl font-extrabold break-all leading-tight pr-2">
  {selectedSpeler.username}
</h2>
              </div>

              <button
                onClick={() => setSelectedSpeler(null)}
                className="text-gray-400 hover:text-white text-2xl leading-none"
              >
                ×
              </button>
            </div>

            <div className="bg-gray-950 border border-gray-800 rounded-2xl p-4">
              <p className="text-gray-400 text-sm mb-1">
                Totaalscore
              </p>

              <p className="text-3xl font-black text-green-400">
                {selectedSpeler.punten} pt
              </p>
            </div>

            <p className="text-sm text-gray-500 mt-4">
              Detailweergave volgt later.
            </p>
          </div>
        </div>
      )}
    </main>
  )
}