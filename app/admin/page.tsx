"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"
import { poules, teamsPerPoule } from "@/lib/poules"

const ADMIN_EMAIL = "minne.brander@gmail.com"

const extraVelden = [
  ["extra-geleKaarten", "Totaal gele kaarten toernooi"],
  ["extra-rodeKaarten", "Totaal rode kaarten toernooi"],
  ["extra-totaalDoelpunten", "Totaal doelpunten toernooi"],
  ["extra-doelpuntenNederland", "Totaal doelpunten Nederland"],
  ["extra-topscorerNederland", "Topscorer Nederland"],
  ["extra-topscorerToernooi", "Topscorer toernooi"],
  ["extra-meesteTegengoalsLand", "Land met meeste tegengoals"],
  ["extra-meesteGoalsLand", "Land met meeste goals"],
]

const knockoutRondes = [
  ["ronde-laatste32", "Teams in laatste 32", 32],
  ["ronde-laatste16", "Teams in laatste 16", 16],
  ["ronde-kwartfinale", "Teams in kwartfinale", 8],
  ["ronde-halvefinale", "Teams in halve finale", 4],
  ["ronde-finalisten", "Finalisten", 2],
  ["ronde-wereldkampioen", "Wereldkampioen", 1],
  ["ronde-troostwinnaar", "Winnaar troostfinale", 1],
] as const

const alleLanden = Object.values(teamsPerPoule)
  .flat()
  .sort((a, b) => a.localeCompare(b, "nl"))

export default function AdminPage() {
  const [isAdmin, setIsAdmin] = useState(false)
  const [loading, setLoading] = useState(true)
  const [results, setResults] = useState<Record<string, { score1: string; score2: string }>>({})
  const [actuals, setActuals] = useState<Record<string, string>>({})
  const [profiles, setProfiles] = useState<any[]>([])
  useEffect(() => {
    const loadAdmin = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (user?.email === ADMIN_EMAIL) {
        setIsAdmin(true)
      }

      const { data: resultsData } = await supabase.from("results").select("*")
      const { data: actualsData } = await supabase.from("actuals").select("*")

      const { data: profilesData } = await supabase
  .from("profiles")
  .select("email, username, paid")
  .order("username", { ascending: true })
      const mappedResults: Record<string, { score1: string; score2: string }> = {}
      const mappedActuals: Record<string, string> = {}

      resultsData?.forEach((row) => {
        mappedResults[row.match_id] = {
          score1: row.score1?.toString() || "",
          score2: row.score2?.toString() || "",
        }
      })

      actualsData?.forEach((row) => {
        mappedActuals[row.key] = row.value
      })

      setResults(mappedResults)
      setActuals(mappedActuals)
      setProfiles(profilesData || [])
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
      { onConflict: "match_id" }
    )

    if (error) {
      alert(error.message)
      return
    }

    alert("Uitslag opgeslagen ✅")
  }

  const saveActual = async (key: string) => {
    const value = actuals[key]

    if (!value) {
      const { error } = await supabase.from("actuals").delete().eq("key", key)

      if (error) {
        alert(error.message)
        return
      }

      setActuals((prev) => {
        const updated = { ...prev }
        delete updated[key]
        return updated
      })

      alert("Waarde gewist ✅")
      return
    }

    const { error } = await supabase.from("actuals").upsert(
      { key, value },
      { onConflict: "key" }
    )

    if (error) {
      alert(error.message)
      return
    }

    alert("Opgeslagen ✅")
  }
const saveArrayActual = async (key: string) => {
  const value = actuals[key]

  let cleaned: string[] = []

  try {
    cleaned = value ? JSON.parse(value).filter(Boolean) : []
  } catch {
    cleaned = []
  }

  if (cleaned.length === 0) {
    const { error } = await supabase
      .from("actuals")
      .delete()
      .eq("key", key)

    if (error) {
      alert(error.message)
      return
    }

    setActuals((prev) => {
      const updated = { ...prev }
      delete updated[key]
      return updated
    })

    alert("Ronde gewist ✅")
    return
  }

  const { error } = await supabase.from("actuals").upsert(
    {
      key,
      value: JSON.stringify(cleaned),
    },
    {
      onConflict: "key",
    }
  )

  if (error) {
    alert(error.message)
    return
  }

  setActuals((prev) => ({
    ...prev,
    [key]: JSON.stringify(cleaned),
  }))

  alert("Ronde opgeslagen ✅")
}

const clearArrayActual = async (key: string) => {
  const { error } = await supabase.from("actuals").upsert(
    {
      key,
      value: "[]",
    },
    {
      onConflict: "key",
    }
  )

  if (error) {
    alert(error.message)
    return
  }

  setActuals((prev) => ({
    ...prev,
    [key]: "[]",
  }))

  alert("Ronde leeggemaakt ✅")
}
const clearActual = async (key: string) => {
  const { error } = await supabase.from("actuals").upsert(
    {
      key,
      value: "",
    },
    {
      onConflict: "key",
    }
  )

  if (error) {
    alert(error.message)
    return
  }

  setActuals((prev) => ({
    ...prev,
    [key]: "",
  }))

  alert("Waarde gewist ✅")
}
const markeerAlsBetaald = async (email: string) => {
  const { error } = await supabase
    .from("profiles")
    .update({
      paid: true,
      paid_at: new Date().toISOString(),
    })
    .eq("email", email)

  if (error) {
    alert(error.message)
    return
  }

  setProfiles((prev) =>
    prev.map((profile) =>
      profile.email === email
        ? { ...profile, paid: true, paid_at: new Date().toISOString() }
        : profile
    )
  )

  alert("Gebruiker gemarkeerd als betaald ✅")
}

  const getJsonArray = (key: string) => {
    try {
      return actuals[key] ? JSON.parse(actuals[key]) : []
    } catch {
      return []
    }
  }

 const updateArrayActual = (key: string, index: number, value: string) => {
  const current = getJsonArray(key)
  const updated = [...current]

  updated[index] = value

  const cleaned = updated.filter(Boolean)

  setActuals((prev) => ({
    ...prev,
    [key]: cleaned.length ? JSON.stringify(cleaned) : "",
  }))
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
          <p className="text-gray-400">Alleen de beheerder kan uitslagen invoeren.</p>
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
          <section className="bg-gradient-to-b from-gray-900 to-gray-950 border border-gray-800 rounded-3xl p-6 shadow-[0_0_30px_rgba(0,0,0,0.35)]">
            <h2 className="text-2xl font-bold mb-4">Knockout rondes 🏆</h2>

            <div className="grid gap-6">
              {knockoutRondes.map(([key, label, aantal]) => {
                const huidigeWaarden = getJsonArray(key)

                return (
                  <div key={key} className="bg-gray-800 rounded-2xl p-4">
                    <div className="flex items-center justify-between gap-4 mb-3">
                      <h3 className="font-bold">{label}</h3>

                      <button
                        onClick={() => saveArrayActual(key)}
                        className="bg-orange-500 hover:bg-orange-600 transition rounded-xl px-4 py-2 font-bold"
                      >
                        Opslaan
                      </button>
                      <button
  onClick={() => clearArrayActual(key)}
  className="bg-red-600 hover:bg-red-700 transition rounded-xl px-4 py-2 font-bold"
>
  Wissen
</button>
                    </div>

                    <div className="grid gap-2 md:grid-cols-2">
                      {Array.from({ length: aantal }, (_, index) => (
                        <select
                          key={index}
                          value={huidigeWaarden[index] || ""}
                          onChange={(e) => updateArrayActual(key, index, e.target.value)}
                          className="rounded bg-gray-700 border border-gray-600 p-2 text-white"
                        >
                          <option value="">Team {index + 1}</option>
                          {alleLanden.map((land) => (
                            <option key={land} value={land}>
                              {land}
                            </option>
                          ))}
                        </select>
                      ))}
                    </div>
                  </div>
                )
              })}
            </div>
          </section>

          <section className="bg-gradient-to-b from-gray-900 to-gray-950 border border-gray-800 rounded-3xl p-6 shadow-[0_0_30px_rgba(0,0,0,0.35)]">
            <h2 className="text-2xl font-bold mb-4">Extra voorspellingen 🎯</h2>

            <div className="grid gap-3 md:grid-cols-2">
              {extraVelden.map(([key, label]) => (
                <div key={key} className="grid grid-cols-[1fr_110px] gap-3 items-center bg-gray-800 rounded-xl p-3">
                  <div>
                    <label className="block text-sm text-gray-300 mb-2">{label}</label>

                    {key.includes("Land") ? (
                      <select
                        value={actuals[key] || ""}
                        onChange={(e) =>
                          setActuals((prev) => ({ ...prev, [key]: e.target.value }))
                        }
                        className="w-full rounded bg-gray-700 border border-gray-600 p-2 text-white"
                      >
                        <option value="">Kies land</option>
                        {alleLanden.map((land) => (
                          <option key={land} value={land}>
                            {land}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <input
                        value={actuals[key] || ""}
                        onChange={(e) =>
                          setActuals((prev) => ({ ...prev, [key]: e.target.value }))
                        }
                        className="w-full rounded bg-gray-700 border border-gray-600 p-2 text-white"
                      />
                    )}
                  </div>

                  <button
                    onClick={() => saveActual(key)}
                    className="bg-orange-500 hover:bg-orange-600 transition rounded-xl px-4 py-2 font-bold self-end"
                  >
                    Opslaan
                  </button>
                  <button
  onClick={() => clearActual(key)}
  className="bg-red-600 hover:bg-red-700 transition rounded-xl px-4 py-2 font-bold self-end"
>
  Wissen
</button>
                </div>
              ))}
            </div>
          </section>

          <section className="bg-gradient-to-b from-gray-900 to-gray-950 border border-gray-800 rounded-3xl p-6 shadow-[0_0_30px_rgba(0,0,0,0.35)]">
            <h2 className="text-2xl font-bold mb-4">Poulestanden 📊</h2>

            <div className="grid gap-6 md:grid-cols-2">
              {Object.keys(teamsPerPoule).map((poule) => {
                const key = `stand-${poule}`
                const huidigeStand = getJsonArray(key)

                return (
                  <div key={poule} className="bg-gray-800 rounded-2xl p-4">
                    <h3 className="font-bold mb-3">Poule {poule}</h3>

                    <div className="grid gap-2">
                      {[0, 1, 2, 3].map((positie) => (
                        <select
                          key={positie}
                          value={huidigeStand[positie] || ""}
                          onChange={(e) => updateArrayActual(key, positie, e.target.value)}
                          className="rounded bg-gray-700 border border-gray-600 p-2 text-white"
                        >
                          <option value="">Positie {positie + 1}</option>

                          {teamsPerPoule[poule as keyof typeof teamsPerPoule].map((land) => (
                            <option key={land} value={land}>
                              {land}
                            </option>
                          ))}
                        </select>
                      ))}
                    </div>

                    <div className="flex gap-3 mt-4">
  <button
    onClick={() => saveArrayActual(key)}
    className="bg-orange-500 hover:bg-orange-600 transition rounded-xl px-4 py-2 font-bold"
  >
    Opslaan
  </button>

  <button
    onClick={() => clearArrayActual(key)}
    className="bg-red-600 hover:bg-red-700 transition rounded-xl px-4 py-2 font-bold"
  >
    Wissen
  </button>
</div>
                  </div>
                )
              })}
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">Groepsfase uitslagen ⚽</h2>

            <div className="grid gap-8">
              <section className="bg-gradient-to-b from-gray-900 to-gray-950 border border-gray-800 rounded-3xl p-6 shadow-[0_0_30px_rgba(0,0,0,0.35)]">
  <h2 className="text-2xl font-bold mb-4">Betaalbeheer 💰</h2>

  <div className="grid gap-3">
    {profiles.map((profile) => (
      <div
        key={profile.email}
        className="grid md:grid-cols-[1fr_1fr_120px_180px] gap-3 items-center bg-gray-800 rounded-xl p-3"
      >
        <div className="font-semibold truncate">
          {profile.username || "Geen username"}
        </div>

        <div className="text-sm text-gray-400 truncate">
          {profile.email}
        </div>

        <div
          className={`text-sm font-bold ${
            profile.paid ? "text-green-400" : "text-red-400"
          }`}
        >
          {profile.paid ? "Betaald ✅" : "Niet betaald ❌"}
        </div>

        <button
          onClick={() => markeerAlsBetaald(profile.email)}
          disabled={profile.paid}
          className={`rounded-xl px-4 py-2 font-bold transition ${
            profile.paid
              ? "bg-gray-700 text-gray-400 cursor-not-allowed"
              : "bg-green-600 hover:bg-green-700 text-white"
          }`}
        >
          {profile.paid ? "Al betaald" : "Markeer betaald"}
        </button>
      </div>
    ))}
  </div>
</section>
              {Object.entries(poules).map(([pouleKey, wedstrijden]) => (
                <div
                  key={pouleKey}
                  className="bg-gradient-to-b from-gray-900 to-gray-950 border border-gray-800 rounded-3xl p-6 shadow-[0_0_30px_rgba(0,0,0,0.35)]"
                >
                  <h3 className="text-2xl font-bold mb-4">Poule {pouleKey}</h3>

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
                                  [matchId]: { ...result, score1: e.target.value },
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
                                  [matchId]: { ...result, score2: e.target.value },
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
          </section>
        </div>
      </div>
    </main>
  )
}