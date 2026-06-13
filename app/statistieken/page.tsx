"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
} from "recharts"

export default function StatistiekenPage() {
  const [wereldkampioenen, setWereldkampioenen] = useState<
    { land: string; aantal: number }[]
  >([])
const [nederlandData, setNederlandData] = useState<
  { fase: string; aantal: number }[]
>([])

const [finales, setFinales] = useState<
  { finale: string; aantal: number }[]
>([])
  useEffect(() => {
    const load = async () => {
      const { data } = await supabase
        .from("predictions")
        .select("*")

      const verdeling: Record<string, number> = {}
const nederlandVerdeling: Record<string, number> = {
  Wereldkampioen: 0,
  Finale: 0,
  "Halve finale": 0,
  Kwartfinale: 0,
  "Laatste 16": 0,
}

const finaleVerdeling: Record<string, number> = {}

data?.forEach((speler: any) => {
  // Wereldkampioen
  const kampioen = speler.knockout?.[104]

  if (kampioen) {
    verdeling[kampioen] =
      (verdeling[kampioen] || 0) + 1
  }

  // Nederland
  const knockout = speler.knockout || {}

  if (knockout[104] === "Nederland") {
    nederlandVerdeling["Wereldkampioen"]++
  } else if (
    knockout[101] === "Nederland" ||
    knockout[102] === "Nederland"
  ) {
    nederlandVerdeling["Finale"]++
  } else if (
    knockout[97] === "Nederland" ||
    knockout[98] === "Nederland" ||
    knockout[99] === "Nederland" ||
    knockout[100] === "Nederland"
  ) {
    nederlandVerdeling["Halve finale"]++
  } else if (
    Object.values(knockout)
      .slice(16, 24)
      .includes("Nederland")
  ) {
    nederlandVerdeling["Kwartfinale"]++
  } else {
    nederlandVerdeling["Laatste 16"]++
  }

  // Finale voorspelling
  const finalist1 = knockout[101]
  const finalist2 = knockout[102]

  if (finalist1 && finalist2) {
    const finale = [finalist1, finalist2]
      .sort()
      .join(" - ")

    finaleVerdeling[finale] =
      (finaleVerdeling[finale] || 0) + 1
  }
})

const ranking = Object.entries(verdeling)
  .map(([land, aantal]) => ({
    land,
    aantal,
  }))
  .sort((a, b) => b.aantal - a.aantal)
const nederlandRanking = Object.entries(
  nederlandVerdeling
)
.map(([fase, aantal]) => ({
  fase,
  aantal,
}))

const finaleRanking = Object.entries(
  finaleVerdeling
)
  .map(([finale, aantal]) => ({
    finale,
    aantal,
  }))
  .sort((a, b) => b.aantal - a.aantal)

console.log("WK", ranking)


setWereldkampioenen(ranking)
setNederlandData(nederlandRanking)
setFinales(finaleRanking)
    }

    load()
  }, [])

const COLORS = [
  "#f97316", // oranje
  "#fb923c", // licht oranje
  "#fdba74", // zand
  "#60a5fa", // blauw
  "#34d399", // groen
  "#a78bfa", // paars
  "#f472b6", // roze
  "#ef4444", // rood
  "#eab308", // geel
  "#06b6d4", // cyaan
  "#84cc16", // lime
  "#8b5cf6", // violet
  "#ec4899", // pink
  "#14b8a6", // teal
  "#f43f5e", // rose
  "#22c55e", // emerald
  "#3b82f6", // helder blauw
  "#d946ef", // magenta
]

 return (
  <main className="min-h-screen bg-gray-950 text-white px-6 py-8">
    <div className="max-w-4xl mx-auto">

      <h1 className="text-4xl font-bold mb-8 text-center">
        📊 Statistieken
      </h1>

      <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
        <h2 className="text-xl font-bold mb-4">
          🌍 Wereldkampioen voorspelling
        </h2>

        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={wereldkampioenen}
                dataKey="aantal"
                nameKey="land"
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
              >
                {wereldkampioenen.map((entry, index) => (
                  <Cell
                    key={index}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>

              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="grid grid-cols-2 gap-2 mt-6">
          {wereldkampioenen.map((land, index) => (
            <div
              key={land.land}
              className="flex justify-between items-center text-sm bg-gray-800 rounded-lg px-3 py-2"
            >
              <div className="flex items-center gap-2">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{
                    backgroundColor:
                      COLORS[index % COLORS.length],
                  }}
                />

                <span>{land.land}</span>
              </div>

              <span className="font-bold text-orange-400">
                {land.aantal}
              </span>
            </div>
          ))}
        </div>

      </div>
<div className="bg-gray-900 border border-gray-800 rounded-xl p-6 mt-6">
  <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
  🇳🇱 <span>Hoe ver komt Nederland?</span>
</h2>

  <div className="h-80">
    <ResponsiveContainer width="100%" height="100%">
      <PieChart>
        <Pie
          data={nederlandData}
          dataKey="aantal"
          nameKey="fase"
          cx="50%"
          cy="50%"
          innerRadius={60}
          outerRadius={100}
        >
          {nederlandData.map((entry, index) => (
            <Cell
              key={index}
              fill={COLORS[index % COLORS.length]}
            />
          ))}
        </Pie>

        <Tooltip />
      </PieChart>
    </ResponsiveContainer>
  </div>

  <div className="mt-6 space-y-2">
    {nederlandData.map((fase, index) => (
      <div
        key={fase.fase}
        className="flex justify-between items-center text-sm"
      >
        <div className="flex items-center gap-2">
          <div
            className="w-3 h-3 rounded-full"
            style={{
              backgroundColor:
                COLORS[index % COLORS.length],
            }}
          />

          <span>{fase.fase}</span>
        </div>

        <span className="font-bold text-orange-400">
          {fase.aantal}
        </span>
      </div>
    ))}
  </div>
  
</div>

<div className="bg-gray-900 border border-gray-800 rounded-xl p-6 mt-6">
  <h2 className="text-xl font-bold mb-4">
    🏟️ Voorspelde finales
  </h2>

  <div className="h-80">
    <ResponsiveContainer width="100%" height="100%">
      <PieChart>
        <Pie
          data={finales}
          dataKey="aantal"
          nameKey="finale"
          cx="50%"
          cy="50%"
          innerRadius={60}
          outerRadius={100}
        >
          {finales.map((entry, index) => (
            <Cell
              key={index}
              fill={COLORS[index % COLORS.length]}
            />
          ))}
        </Pie>

        <Tooltip />
      </PieChart>
    </ResponsiveContainer>
  </div>

  <div className="mt-6 space-y-2">
    {finales.map((item, index) => (
      <div
        key={item.finale}
        className="flex justify-between items-center text-sm"
      >
        <div className="flex items-center gap-2">
          <div
            className="w-3 h-3 rounded-full"
            style={{
              backgroundColor:
                COLORS[index % COLORS.length],
            }}
          />

          <span>{item.finale}</span>
        </div>

        <span className="font-bold text-orange-400">
          {item.aantal}
        </span>
      </div>
    ))}
  </div>
</div>

      </div>

</main>
)
}
 