"use client"

import { supabase } from "@/lib/supabase"
import { getBesteDerdeCombinatieKey, getDerdePouleVoorDuel } from "@/lib/ThirdPlaceMatrix"
import { useState, useEffect, useMemo } from "react"
import { poules, teamsPerPoule } from "@/lib/poules"

const voorspelDeadline = new Date("2026-06-11T21:00:00")

const alleLanden = Object.values(teamsPerPoule)
  .flat()
  .sort((a, b) => a.localeCompare(b, "nl"))

const SectionDivider = () => (
  <div className="w-full max-w-4xl mx-auto my-8">
    <div className="h-px bg-white/5" />
  </div>
)

const echtePouleStanden: Record<string, string[]> = {
  A: [],
  B: [],
  C: [],
  D: [],
  E: [],
  F: [],
  G: [],
  H: [],
  I: [],
  J: [],
  K: [],
  L: [],
}

const echteKnockoutWinners: Record<number, string> = {
  73: "",
  74: "",
  75: "",
  76: "",
  77: "",
  78: "",
  79: "",
  80: "",
  81: "",
  82: "",
  83: "",
  84: "",
  85: "",
  86: "",
  87: "",
  88: "",

  89: "",
  90: "",
  91: "",
  92: "",
  93: "",
  94: "",
  95: "",
  96: "",

  97: "",
  98: "",
  99: "",
  100: "",

  101: "",
  102: "",

  103: "",
  104: "",
}

const echteExtraVoorspellingen = {
  geleKaarten: "",
  rodeKaarten: "",
  totaalDoelpunten: "",
  doelpuntenNederland: "",
  topscorerNederland: "",
  topscorerToernooi: "",
  meesteTegengoalsLand: "",
  meesteGoalsLand: "",
}


const countryCodes: Record<string, string> = {
  // GROEP A
  "Mexico": "MX",
  "Zuid-Afrika": "ZA",
  "Zuid-Korea": "KR",
  "Tsjechië": "CZ",

  // GROEP B
  "Canada": "CA",
  "Bosnië & Herz.": "BA",
  "Qatar": "QA",
  "Zwitserland": "CH",

  // GROEP C
  "Brazilië": "BR",
  "Marokko": "MA",
  "Haïti": "HT",
  "Schotland": "GB", // 🇬🇧 (geen aparte Scotland vlag via lib)

  // GROEP D
  "Verenigde Staten": "US",
  "Paraguay": "PY",
  "Australië": "AU",
  "Turkije": "TR",

  // GROEP E
  "Duitsland": "DE",
  "Curaçao": "CW",
  "Ivoorkust": "CI",
  "Ecuador": "EC",

  // GROEP F
  "Nederland": "NL",
  "Japan": "JP",
  "Zweden": "SE",
  "Tunesië": "TN",

  // GROEP G
  "België": "BE",
  "Egypte": "EG",
  "Iran": "IR",
  "Nieuw-Zeeland": "NZ",

  // GROEP H
  "Spanje": "ES",
  "Kaapverdië": "CV",
  "Saoedi-Arabië": "SA",
  "Uruguay": "UY",

  // GROEP I
  "Frankrijk": "FR",
  "Senegal": "SN",
  "Irak": "IQ",
  "Noorwegen": "NO",

  // GROEP J
  "Argentinië": "AR",
  "Algerije": "DZ",
  "Oostenrijk": "AT",
  "Jordanië": "JO",

  // GROEP K
  "Portugal": "PT",
  "Congo": "CG", // 🇨🇬 (Republiek Congo, niet DRC)
  "Oezbekistan": "UZ",
  "Colombia": "CO",

  // GROEP L
  "Engeland": "GB",
  "Kroatië": "HR",
  "Ghana": "GH",
  "Panama": "PA",
}

const Flag = ({ land }: { land: string }) => {
  const code = countryCodes[land]?.toLowerCase()

  if (!code) return null

  return (
    <img
      src={`https://flagcdn.com/24x18/${code}.png`}
      alt={land}
      title={land}
      className="inline-block h-[14px] w-[18px] rounded-[2px] object-cover"
    />
  )
}

const getWedstrijdKey = (pouleKey: string, index: number) => {
  return `${pouleKey}-${index}`
}

export default function VoorspellenPage() {
const [scores, setScores] = useState<{ [key: string]: { s1?: string; s2?: string } }>({})
const [user, setUser] = useState("Jij")
const [geselecteerdeSpeler, setGeselecteerdeSpeler] = useState<string | null>(null)
const voorspellingenGesloten = new Date() > voorspelDeadline
const [extraVoorspellingen, setExtraVoorspellingen] = useState<{
  geleKaarten?: string
  rodeKaarten?: string
  totaalDoelpunten?: string
  doelpuntenNederland?: string
  topscorerNederland?: string
  topscorerToernooi?: string
  meesteTegengoalsLand?: string
  meesteGoalsLand?: string
}>({})

const [alleVoorspellingen, setAlleVoorspellingen] = useState<
  Record<
    string,
    {
      scores: { [key: string]: { s1?: string; s2?: string } }
      knockoutWinners: Record<number, string>
      extraVoorspellingen?: {
        geleKaarten?: string
        rodeKaarten?: string
        totaalDoelpunten?: string
        doelpuntenNederland?: string
        topscorerNederland?: string
        topscorerToernooi?: string
        meesteTegengoalsLand?: string
        meesteGoalsLand?: string
      }
    }
  >
>({})

const [saving, setSaving] = useState(false)

const geselecteerdeVoorspelling = geselecteerdeSpeler
  ? alleVoorspellingen[geselecteerdeSpeler]
  : null

  const mijnVoorspelling = alleVoorspellingen[user]

 useEffect(() => {
  const loadPredictions = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user?.email) {
  window.location.href = "/login"
  return
}

    setUser(user.email)

    const { data } = await supabase
      .from("predictions")
      .select("*")
      .eq("user_email", user.email)
      .single()

    if (!data) return

    setScores(data.scores || {})
    setKnockoutWinners(data.knockout || {})
    setExtraVoorspellingen(data.extra || {})

    const { data: alleData } = await supabase
  .from("predictions")
  .select("*")

const voorspellingenUitDatabase: any = {}

alleData?.forEach((rij) => {
  voorspellingenUitDatabase[rij.user_email] = {
    scores: rij.scores || {},
    knockoutWinners: rij.knockout || {},
    extraVoorspellingen: rij.extra || {},
  }
})

setAlleVoorspellingen(voorspellingenUitDatabase)
  }

  loadPredictions()
}, [])
const [knockoutWinners, setKnockoutWinners] = useState<Record<number, string>>({})
const getKnockoutPuntenVoorDuel = (duelNummer: number) => {
  if (duelNummer >= 73 && duelNummer <= 88) return 10
  if (duelNummer >= 89 && duelNummer <= 96) return 15
  if (duelNummer >= 97 && duelNummer <= 100) return 20
  if (duelNummer >= 101 && duelNummer <= 102) return 25
  if (duelNummer === 103) return 30
  if (duelNummer === 104) return 30
  return 0
}
  const berekenPunten = () => {
  let punten = 0

  Object.entries(poules).forEach(([pouleKey, wedstrijden]) => {
  wedstrijden.forEach((w, i) => {
    const key = getWedstrijdKey(pouleKey, i)
    const voorspelling = scores[key]
    if (!voorspelling) return

    if (w.score1 == null || w.score2 == null) return

    const s1 = parseInt(voorspelling.s1 || "0")
    const s2 = parseInt(voorspelling.s2 || "0")

    const echte =
      w.score1 > w.score2 ? "1" :
      w.score1 < w.score2 ? "2" : "X"

    const voorspeld =
      s1 > s2 ? "1" :
      s1 < s2 ? "2" : "X"

    if (echte === voorspeld) {
      punten += 4
    }

    if (s1 === w.score1) {
      punten += 2
    }

    if (s2 === w.score2) {
      punten += 2
    }

    if (s1 === w.score1 && s2 === w.score2) {
      punten += 2
    }
  })
})

const pouleStandPunten = Object.keys(poules).reduce((totaal, pouleKey) => {
  return totaal + berekenPoulePunten(pouleKey)
}, 0)

return (
  punten +
  pouleStandPunten +
  berekenKnockoutPunten() +
  berekenWereldkampioenBonus() +
  berekenExtraVoorspellingPunten(extraVoorspellingen)
)
}  

const getTijdTotDeadline = () => {
  const nu = new Date()
  const verschil = voorspelDeadline.getTime() - nu.getTime()

  if (verschil <= 0) return "Deadline verstreken"

  const dagen = Math.floor(verschil / (1000 * 60 * 60 * 24))
  const uren = Math.floor((verschil / (1000 * 60 * 60)) % 24)
  const minuten = Math.floor((verschil / (1000 * 60)) % 60)

  return `${dagen} dagen, ${uren} uur en ${minuten} min`
}

const updateScore = (
  key: string,
  veld: "s1" | "s2",
  waarde: string
) => {
if (voorspellingenGesloten) return
setSaving(true)
  setScores((prev) => {
    const updatedScores = {
      ...prev,
      [key]: {
        ...prev[key],
        [veld]: waarde,
      },
    }

    const updatedVoorspellingen = {
  ...alleVoorspellingen,
  [user]: {
    scores: updatedScores,
    knockoutWinners,
    extraVoorspellingen,
  },
}

    setAlleVoorspellingen(updatedVoorspellingen)

    localStorage.setItem(
      "alleVoorspellingen",
      JSON.stringify(updatedVoorspellingen)
    )

    savePredictionToSupabase(
  updatedScores,
  knockoutWinners,
  extraVoorspellingen
)
setTimeout(() => {
  setSaving(false)
}, 500)

    return updatedScores
  })
}

const savePredictionToSupabase = async (
  updatedScores: any,
  updatedKnockout: any,
  updatedExtra: any
) => {
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user?.email) return

  const { error } = await supabase
    .from("predictions")
    .upsert(
      {
        user_email: user.email,
        scores: updatedScores,
        knockout: updatedKnockout,
        extra: updatedExtra,
      },
      {
        onConflict: "user_email",
      }
    )

  if (error) {
    console.error("Supabase save error:", error.message)
  }
}

const updateExtraVoorspelling = (
  veld: keyof typeof extraVoorspellingen,
  waarde: string
) => {
if (voorspellingenGesloten) return
  setExtraVoorspellingen((prev) => {
    const updatedExtraVoorspellingen = {
      ...prev,
      [veld]: waarde,
    }

    const updatedVoorspellingen = {
      ...alleVoorspellingen,
      [user]: {
        scores,
        knockoutWinners,
        extraVoorspellingen: updatedExtraVoorspellingen,
      },
    }

    setAlleVoorspellingen(updatedVoorspellingen)

    localStorage.setItem(
      "alleVoorspellingen",
      JSON.stringify(updatedVoorspellingen)
    )
savePredictionToSupabase(
  scores,
  knockoutWinners,
  updatedExtraVoorspellingen
)
    return updatedExtraVoorspellingen
  })
}

const berekenPuntenVoorWedstrijd = (
  w: (typeof poules)[keyof typeof poules][number],
  pouleKey: string,
  i: number
) => {

  const key = getWedstrijdKey(pouleKey, i)
const voorspelling = scores[key]
  if (!voorspelling) return 0

if (w.score1 == null || w.score2 == null) return 0

  const s1 = parseInt(voorspelling.s1 || "0")
  const s2 = parseInt(voorspelling.s2 || "0")

  let punten = 0

  const echte =
    w.score1 > w.score2 ? "1" :
    w.score1 < w.score2 ? "2" : "X"

  const voorspeld =
    s1 > s2 ? "1" :
    s1 < s2 ? "2" : "X"

  if (echte === voorspeld) {
    punten += 4
  }

  if (s1 === w.score1) {
    punten += 2
  }

  if (s2 === w.score2) {
    punten += 2
  }

  if (s1 === w.score1 && s2 === w.score2) {
    punten += 2
  }

  return punten
}

const berekenKnockoutPunten = () => {
  let punten = 0

  Object.entries(echteKnockoutWinners).forEach(([duelKey, echteWinnaar]) => {
    if (!echteWinnaar) return

    const duelNummer = Number(duelKey)
    const voorspeldeWinnaar = knockoutWinners[duelNummer]

    if (voorspeldeWinnaar && voorspeldeWinnaar === echteWinnaar) {
      punten += getKnockoutPuntenVoorDuel(duelNummer)
    }
  })

  return punten
}

const berekenWereldkampioenBonus = () => {
  const echteWereldkampioen = echteKnockoutWinners[104]
  const voorspeldeWereldkampioen = knockoutWinners[104]

  if (!echteWereldkampioen || !voorspeldeWereldkampioen) return 0

  return voorspeldeWereldkampioen === echteWereldkampioen ? 60 : 0
}

const berekenExtraVoorspellingPunten = (
  userExtraVoorspellingen: {
    geleKaarten?: string
    rodeKaarten?: string
    totaalDoelpunten?: string
    doelpuntenNederland?: string
    topscorerNederland?: string
    topscorerToernooi?: string
    meesteTegengoalsLand?: string
    meesteGoalsLand?: string
  } = {}
) => {
  let punten = 0

  if (
    echteExtraVoorspellingen.geleKaarten &&
    userExtraVoorspellingen.geleKaarten === echteExtraVoorspellingen.geleKaarten
  ) {
    punten += 15
  }

  if (
    echteExtraVoorspellingen.rodeKaarten &&
    userExtraVoorspellingen.rodeKaarten === echteExtraVoorspellingen.rodeKaarten
  ) {
    punten += 15
  }

  if (
    echteExtraVoorspellingen.totaalDoelpunten &&
    userExtraVoorspellingen.totaalDoelpunten === echteExtraVoorspellingen.totaalDoelpunten
  ) {
    punten += 15
  }

  if (
    echteExtraVoorspellingen.doelpuntenNederland &&
    userExtraVoorspellingen.doelpuntenNederland === echteExtraVoorspellingen.doelpuntenNederland
  ) {
    punten += 15
  }

  if (
    echteExtraVoorspellingen.topscorerNederland &&
    userExtraVoorspellingen.topscorerNederland?.trim().toLowerCase() ===
      echteExtraVoorspellingen.topscorerNederland.trim().toLowerCase()
  ) {
    punten += 15
  }

  if (
    echteExtraVoorspellingen.topscorerToernooi &&
    userExtraVoorspellingen.topscorerToernooi?.trim().toLowerCase() ===
      echteExtraVoorspellingen.topscorerToernooi.trim().toLowerCase()
  ) {
    punten += 15
  }

  if (
    echteExtraVoorspellingen.meesteTegengoalsLand &&
    userExtraVoorspellingen.meesteTegengoalsLand?.trim().toLowerCase() ===
      echteExtraVoorspellingen.meesteTegengoalsLand.trim().toLowerCase()
  ) {
    punten += 15
  }

  if (
    echteExtraVoorspellingen.meesteGoalsLand &&
    userExtraVoorspellingen.meesteGoalsLand?.trim().toLowerCase() ===
      echteExtraVoorspellingen.meesteGoalsLand.trim().toLowerCase()
  ) {
    punten += 15
  }

  return punten
}

const isPerfecteScore = (
  w: (typeof poules)[keyof typeof poules][number],
  pouleKey: string,
  i: number
) => {

  const key = getWedstrijdKey(pouleKey, i)
  const voorspelling = scores[key]
  if (!voorspelling) return false

  if (w.score1 == null || w.score2 == null) return false

  const s1 = parseInt(voorspelling.s1 || "0")
  const s2 = parseInt(voorspelling.s2 || "0")

  return s1 === w.score1 && s2 === w.score2
}
const getLeaderboard = () => {
 const spelers = Object.entries(alleVoorspellingen).map(([naam, voorspelling]) => ({
  naam,
  punten: berekenPuntenVoorScores(
    voorspelling.scores || {},
    voorspelling.knockoutWinners || {},
    voorspelling.extraVoorspellingen || {}
  ),
}))

  if (user && !spelers.find((speler) => speler.naam === user)) {
    spelers.push({
  naam: user,
  punten: berekenPuntenVoorScores(scores, knockoutWinners, extraVoorspellingen),
})
  }

  return spelers.sort((a, b) => b.punten - a.punten)
}
const getRankIcon = (index: number) => {
  if (index === 0) return "🥇"
  if (index === 1) return "🥈"
  if (index === 2) return "🥉"
  return `#${index + 1}`
}
const berekenKnockoutPuntenVoorSpeler = (
  userKnockoutWinners: Record<number, string>
) => {
  let punten = 0

  Object.entries(echteKnockoutWinners).forEach(([duelKey, echteWinnaar]) => {
    if (!echteWinnaar) return

    const duelNummer = Number(duelKey)
    const voorspeldeWinnaar = userKnockoutWinners[duelNummer]

    if (voorspeldeWinnaar && voorspeldeWinnaar === echteWinnaar) {
      punten += getKnockoutPuntenVoorDuel(duelNummer)
    }
  })

  const echteWereldkampioen = echteKnockoutWinners[104]
  const voorspeldeWereldkampioen = userKnockoutWinners[104]

  if (
    echteWereldkampioen &&
    voorspeldeWereldkampioen &&
    echteWereldkampioen === voorspeldeWereldkampioen
  ) {
    punten += 60
  }

  return punten
}

const berekenPuntenVoorScores = (
  userScores: { [key: string]: { s1?: string; s2?: string } },
  userKnockoutWinners: Record<number, string> = {},
  userExtraVoorspellingen: {
    geleKaarten?: string
    rodeKaarten?: string
    totaalDoelpunten?: string
    doelpuntenNederland?: string
    topscorerNederland?: string
    topscorerToernooi?: string
    meesteTegengoalsLand?: string
    meesteGoalsLand?: string
  } = {}
) => {
  let punten = 0

  Object.entries(poules).forEach(([pouleKey, wedstrijden]) => {
    wedstrijden.forEach((w, i) => {
      const key = getWedstrijdKey(pouleKey, i)
      const voorspelling = userScores[key]

      if (!voorspelling) return
      if (w.score1 == null || w.score2 == null) return

      const s1 = parseInt(voorspelling.s1 || "0")
      const s2 = parseInt(voorspelling.s2 || "0")

      const echte =
        w.score1 > w.score2 ? "1" :
        w.score1 < w.score2 ? "2" : "X"

      const voorspeld =
        s1 > s2 ? "1" :
        s1 < s2 ? "2" : "X"

      if (echte === voorspeld) {
        punten += 4
      }

      if (s1 === w.score1) {
        punten += 2
      }

      if (s2 === w.score2) {
        punten += 2
      }

      if (s1 === w.score1 && s2 === w.score2) {
        punten += 2
      }
    })
  })

  const berekenPouleStandVoorScores = (pouleKey: string) => {
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

  const berekenPoulePuntenVoorScores = (pouleKey: string) => {
    const voorspeldeStand = berekenPouleStandVoorScores(pouleKey)
    const echteStand = echtePouleStanden[pouleKey] || []

  let poulePunten = 0

voorspeldeStand.forEach((team, index) => {
  if (team.land === echteStand[index]) {
    poulePunten += 3
  }
})

return poulePunten  
}
  const pouleStandPunten = Object.keys(poules).reduce((totaal, pouleKey) => {
    return totaal + berekenPoulePuntenVoorScores(pouleKey)
  }, 0)

  punten += pouleStandPunten
punten += berekenKnockoutPuntenVoorSpeler(userKnockoutWinners)
punten += berekenExtraVoorspellingPunten(userExtraVoorspellingen)

return punten
}
const berekenPouleStand = (pouleKey: string) => {
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
    const voorspelling = scores[key]

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
const berekenPuntenUitsplitsingVoorSpeler = (
  userScores: { [key: string]: { s1?: string; s2?: string } },
  userKnockoutWinners: Record<number, string> = {},
  userExtraVoorspellingen: {
    geleKaarten?: string
    rodeKaarten?: string
    totaalDoelpunten?: string
    doelpuntenNederland?: string
    topscorerNederland?: string
    topscorerToernooi?: string
    meesteTegengoalsLand?: string
    meesteGoalsLand?: string
  } = {}
) => {
  let groepsfasePunten = 0
  let poulestandPunten = 0

  Object.entries(poules).forEach(([pouleKey, wedstrijden]) => {
    wedstrijden.forEach((w, i) => {
      const key = getWedstrijdKey(pouleKey, i)
      const voorspelling = userScores[key]

      if (!voorspelling) return
      if (w.score1 == null || w.score2 == null) return

      const s1 = parseInt(voorspelling.s1 || "0")
      const s2 = parseInt(voorspelling.s2 || "0")

      const echte =
        w.score1 > w.score2 ? "1" :
        w.score1 < w.score2 ? "2" : "X"

      const voorspeld =
        s1 > s2 ? "1" :
        s1 < s2 ? "2" : "X"

      if (echte === voorspeld) groepsfasePunten += 4
      if (s1 === w.score1) groepsfasePunten += 2
      if (s2 === w.score2) groepsfasePunten += 2
      if (s1 === w.score1 && s2 === w.score2) groepsfasePunten += 2
    })

    const voorspeldeStand = berekenPouleStandVoorSpeler(pouleKey, userScores)
    const echteStand = echtePouleStanden[pouleKey] || []

    voorspeldeStand.forEach((team, index) => {
      if (team.land === echteStand[index]) {
        poulestandPunten += 3
      }
    })
  })

  const knockoutPunten = berekenKnockoutPuntenVoorSpeler(userKnockoutWinners)
  const extraPunten = berekenExtraVoorspellingPunten(userExtraVoorspellingen)

  return {
    groepsfasePunten,
    poulestandPunten,
    knockoutPunten,
    extraPunten,
    totaal:
      groepsfasePunten +
      poulestandPunten +
      knockoutPunten +
      extraPunten,
  }
}
const renderSpelerKnockoutRonde = (
  titel: string,
  duels: {
    duel: number
    datum: string
    tijd: string
    stadion: string
    home: string | null
    away: string | null
  }[],
  userKnockoutWinners: Record<number, string> = {}
) => {
  const mijnWinnaarsTotDezeRonde = new Set(
    duels
      .map((duel) => mijnVoorspelling?.knockoutWinners?.[duel.duel])
      .filter(Boolean)
  )

  return (
    <div className="mt-8 w-full max-w-3xl mx-auto">
      <h4 className="font-semibold mb-2 text-center">{titel}</h4>

      <div className="bg-gray-800 rounded-xl overflow-hidden w-full">
        {duels.map((duel) => {
          const winnaar = userKnockoutWinners[duel.duel]

          const getTeamClass = (team: string | null) => {
            if (!team || team !== winnaar) {
              return "text-gray-400"
            }

            if (mijnWinnaarsTotDezeRonde.has(team)) {
              return "text-green-400 font-semibold bg-green-500/10 rounded px-1"
            }

            return "text-red-400 font-semibold bg-red-500/10 rounded px-1"
          }

          return (
            <div
              key={duel.duel}
              className="grid w-full items-center gap-3 px-3 py-2 border-b border-gray-700 last:border-b-0 text-sm"
              style={{ gridTemplateColumns: "1fr 1fr" }}
            >
              <span className={`truncate min-w-0 ${getTeamClass(duel.home)}`}>
                <span className="mr-2 text-gray-500 text-xs">
                  #{duel.duel}
                </span>

                {duel.home || "?"}
              </span>

              <span className={`truncate min-w-0 ${getTeamClass(duel.away)}`}>
                {duel.away || "?"}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}


const berekenPoulePunten = (pouleKey: string) => {
  const voorspeldeStand = berekenPouleStand(pouleKey)

  let punten = 0

  voorspeldeStand.forEach((team, index) => {
   const echteStand = echtePouleStanden[pouleKey] || []

if (team.land === echteStand[index]) {
      punten += 3
    }
  })

  return punten
}
const getBesteDerdes = () => {
  const derdes = Object.keys(poules).map((pouleKey) => {
    const stand = berekenPouleStand(pouleKey)

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
const getExtraPuntenVoorVeld = (veld: keyof typeof extraVoorspellingen) => {
  const userValue = extraVoorspellingen[veld]
  const echteValue = echteExtraVoorspellingen[veld]

  if (!echteValue || !userValue) return 0

  if (typeof userValue === "string") {
    return userValue.trim().toLowerCase() === echteValue.trim().toLowerCase() ? 15 : 0
  }

  return userValue === echteValue ? 15 : 0
}

const getVergelijkKleur = (
  veld: keyof typeof extraVoorspellingen,
  waarde: string | undefined
) => {
  const mijnWaarde = mijnVoorspelling?.extraVoorspellingen?.[veld]

  if (!waarde || !mijnWaarde) return "text-gray-400"

  return waarde === mijnWaarde
    ? "text-green-400 font-semibold"
    : "text-red-400"
}

const getMijnExtraWaarde = (
  veld: keyof typeof extraVoorspellingen
) => {
  return mijnVoorspelling?.extraVoorspellingen?.[veld]
}
const getVergelijkKleurWedstrijd = (
  key: string,
  waarde1?: string,
  waarde2?: string
) => {
  const mijnWedstrijd = mijnVoorspelling?.scores?.[key]

  if (!mijnWedstrijd?.s1 || !mijnWedstrijd?.s2 || !waarde1 || !waarde2) {
    return "text-gray-400"
  }

  const mijnS1 = parseInt(mijnWedstrijd.s1)
  const mijnS2 = parseInt(mijnWedstrijd.s2)
  const anderS1 = parseInt(waarde1)
  const anderS2 = parseInt(waarde2)

  const mijnResultaat =
    mijnS1 > mijnS2 ? "1" : mijnS1 < mijnS2 ? "2" : "X"

  const anderResultaat =
    anderS1 > anderS2 ? "1" : anderS1 < anderS2 ? "2" : "X"

  if (mijnS1 === anderS1 && mijnS2 === anderS2) {
    return "text-green-400 font-semibold"
  }

  if (mijnResultaat === anderResultaat) {
    return "text-yellow-400 font-semibold"
  }

  return "text-red-400"
}

const getVergelijkKleurPoule = (
  pouleKey: string,
  team: string,
  positie: number
) => {
  if (!mijnVoorspelling?.scores) {
    return {
      text: "text-gray-300",
      bg: "",
    }
  }

  const mijnStand = berekenPouleStandVoorSpeler(
    pouleKey,
    mijnVoorspelling.scores
  )

  const mijnPositie = mijnStand.findIndex((t) => t.land === team)

  if (mijnPositie === -1) {
    return {
      text: "text-gray-300",
      bg: "",
    }
  }

  // exact dezelfde plek
  if (mijnPositie === positie) {
    return {
      text: "text-green-400 font-semibold",
      bg: "bg-green-500/10",
    }
  }

  const ikDoor = mijnPositie < 2
  const anderDoor = positie < 2

  // beide door / beide eruit
  if (ikDoor === anderDoor) {
    return {
      text: "text-yellow-300 font-semibold",
      bg: "bg-yellow-500/10",
    }
  }

  // groot verschil
  return {
    text: "text-red-400 font-bold",
    bg: "bg-red-500/10",
  }
}
const getVergelijkKleurKnockout = (
  duelNummer: number,
  winnaar?: string
) => {
  const mijnWinnaar = mijnVoorspelling?.knockoutWinners?.[duelNummer]

  if (!winnaar || !mijnWinnaar) return "text-gray-400"

  return winnaar === mijnWinnaar
    ? "text-green-400 font-semibold"
    : "text-red-400 font-semibold"
}

const getPouleVergelijkKleur = (
  pouleKey: string,
  land: string,
  index: number
) => {
  const echteStand = echtePouleStanden[pouleKey] || []
  const echteIndex = echteStand.findIndex(l => l === land)

  if (echteIndex === -1) return "text-gray-400"

  if (echteIndex === index) {
    return "text-green-400 font-semibold"
  }

  return "text-yellow-400"
}

const getMijnKnockoutWinnaar = (duelNummer: number) => {
  return mijnVoorspelling?.knockoutWinners?.[duelNummer]
}
const getTeamOpPlek = (pouleKey: string, plek: number) => {
  const stand = berekenPouleStand(pouleKey)
  return stand[plek - 1] || null
}
const getBesteDerdeUit = (toegestanePoules: string[]) => {
  return getBesteDerdes().find((team) =>
    toegestanePoules.includes(team.poule)
  ) || null
}
const getLaatste32 = () => {
  return [
    { duel: 73, datum: "28-6", tijd: "21:00", stadion: "Los Angeles", home: getTeamOpPlek("A", 2)?.land || null, away: getTeamOpPlek("B", 2)?.land || null },
    { duel: 76, datum: "29-6", tijd: "19:00", stadion: "Houston", home: getTeamOpPlek("C", 1)?.land || null, away: getTeamOpPlek("F", 2)?.land || null },
    { duel: 74, datum: "29-6", tijd: "22:30", stadion: "Boston", home: getTeamOpPlek("E", 1)?.land || null, away: getDerdeVoorDuel(74)?.land || null },
    { duel: 75, datum: "30-6", tijd: "03:00", stadion: "Monterrey", home: getTeamOpPlek("F", 1)?.land || null, away: getTeamOpPlek("C", 2)?.land || null },
    { duel: 78, datum: "30-6", tijd: "19:00", stadion: "Dallas", home: getTeamOpPlek("E", 2)?.land || null, away: getTeamOpPlek("I", 2)?.land || null },
    { duel: 77, datum: "30-6", tijd: "23:00", stadion: "New York", home: getTeamOpPlek("I", 1)?.land || null, away: getDerdeVoorDuel(77)?.land || null },
    { duel: 79, datum: "1-7", tijd: "03:00", stadion: "Mexico-Stad", home: getTeamOpPlek("A", 1)?.land || null, away: getDerdeVoorDuel(79)?.land || null },
    { duel: 80, datum: "1-7", tijd: "18:00", stadion: "Atlanta", home: getTeamOpPlek("L", 1)?.land || null, away: getDerdeVoorDuel(80)?.land || null },
    { duel: 82, datum: "1-7", tijd: "22:00", stadion: "San Francisco", home: getTeamOpPlek("G", 1)?.land || null, away: getDerdeVoorDuel(82)?.land || null },
    { duel: 81, datum: "2-7", tijd: "02:00", stadion: "Seattle", home: getTeamOpPlek("D", 1)?.land || null, away: getDerdeVoorDuel(81)?.land || null },
    { duel: 84, datum: "2-7", tijd: "21:00", stadion: "Los Angeles", home: getTeamOpPlek("H", 1)?.land || null, away: getTeamOpPlek("J", 2)?.land || null },
    { duel: 83, datum: "3-7", tijd: "01:00", stadion: "Toronto", home: getTeamOpPlek("K", 2)?.land || null, away: getTeamOpPlek("L", 2)?.land || null },
    { duel: 85, datum: "3-7", tijd: "05:00", stadion: "Vancouver", home: getTeamOpPlek("B", 1)?.land || null, away: getDerdeVoorDuel(85)?.land || null },
    { duel: 88, datum: "3-7", tijd: "20:00", stadion: "Dallas", home: getTeamOpPlek("D", 2)?.land || null, away: getTeamOpPlek("G", 2)?.land || null },
    { duel: 86, datum: "4-7", tijd: "00:00", stadion: "Miami", home: getTeamOpPlek("J", 1)?.land || null, away: getTeamOpPlek("H", 2)?.land || null },
    { duel: 87, datum: "4-7", tijd: "03:30", stadion: "Kansas City", home: getTeamOpPlek("K", 1)?.land || null, away: getDerdeVoorDuel(87)?.land || null },
  ]
}

const getDerdeVoorDuel = (duel: 74 | 77 | 79 | 80 | 81 | 82 | 85 | 87) => {
  const besteDerdes = getBesteDerdes()

  const combinatieKey = getBesteDerdeCombinatieKey(
    besteDerdes.map((team) => team.poule)
  )

  const pouleKey = getDerdePouleVoorDuel(combinatieKey, duel)
  if (!pouleKey) return null

  return besteDerdes.find((team) => team.poule === pouleKey) || null
}

const getWinnaarVanDuel = (duelNummer: number) => {
  return knockoutWinners[duelNummer] || null
}
const getWinnaarVanDuelVoorSpeler = (
  duelNummer: number,
  userKnockoutWinners: Record<number, string>
) => {
  return userKnockoutWinners[duelNummer] || null
}
const knockoutDependencies: Record<number, number[]> = {
  73: [89, 97, 101, 103, 104],
  74: [89, 97, 101, 103, 104],
  75: [90, 97, 101, 103, 104],
  76: [90, 97, 101, 103, 104],

  77: [91, 98, 101, 103, 104],
  78: [91, 98, 101, 103, 104],
  79: [92, 98, 101, 103, 104],
  80: [92, 98, 101, 103, 104],

  81: [93, 99, 102, 103, 104],
  82: [93, 99, 102, 103, 104],
  83: [94, 99, 102, 103, 104],
  84: [94, 99, 102, 103, 104],

  85: [95, 100, 102, 103, 104],
  86: [95, 100, 102, 103, 104],
  87: [96, 100, 102, 103, 104],
  88: [96, 100, 102, 103, 104],

  89: [97, 101, 103, 104],
  90: [97, 101, 103, 104],
  91: [98, 101, 103, 104],
  92: [98, 101, 103, 104],

  93: [99, 102, 103, 104],
  94: [99, 102, 103, 104],
  95: [100, 102, 103, 104],
  96: [100, 102, 103, 104],

  97: [101, 103, 104],
  98: [101, 103, 104],
  99: [102, 103, 104],
  100: [102, 103, 104],

  101: [103, 104],
  102: [103, 104],
}
const kiesWinnaar = (duelNummer: number, teamNaam: string | undefined) => {
 if (voorspellingenGesloten) return 
  if (!teamNaam) return

  setKnockoutWinners((prev) => {
    const updated = {
      ...prev,
      [duelNummer]: teamNaam,
    }

    const dependentDuels = knockoutDependencies[duelNummer] || []

    dependentDuels.forEach((dependentDuel) => {
      delete updated[dependentDuel]
    })

    // 👉 BELANGRIJK: update ook alleVoorspellingen
    const updatedVoorspellingen = {
  ...alleVoorspellingen,
  [user]: {
    scores,
    knockoutWinners: updated,
    extraVoorspellingen,
  },
}

    setAlleVoorspellingen(updatedVoorspellingen)

    localStorage.setItem(
      "alleVoorspellingen",
      JSON.stringify(updatedVoorspellingen)
    )
savePredictionToSupabase(
  scores,
  updated,
  extraVoorspellingen
)
    return updated
  })
}
const getLaatste16 = () => {
  return [
    {
      duel: 89,
      datum: "5-7",
      tijd: "18:00",
      stadion: "Philadelphia",
      home: getWinnaarVanDuel(73),
      away: getWinnaarVanDuel(74),
    },
    {
      duel: 90,
      datum: "5-7",
      tijd: "22:00",
      stadion: "Houston",
      home: getWinnaarVanDuel(75),
      away: getWinnaarVanDuel(76),
    },
    {
      duel: 91,
      datum: "6-7",
      tijd: "18:00",
      stadion: "Atlanta",
      home: getWinnaarVanDuel(77),
      away: getWinnaarVanDuel(78),
    },
    {
      duel: 92,
      datum: "6-7",
      tijd: "22:00",
      stadion: "Seattle",
      home: getWinnaarVanDuel(79),
      away: getWinnaarVanDuel(80),
    },
    {
      duel: 93,
      datum: "7-7",
      tijd: "18:00",
      stadion: "Boston",
      home: getWinnaarVanDuel(81),
      away: getWinnaarVanDuel(82),
    },
    {
      duel: 94,
      datum: "7-7",
      tijd: "22:00",
      stadion: "Dallas",
      home: getWinnaarVanDuel(83),
      away: getWinnaarVanDuel(84),
    },
    {
      duel: 95,
      datum: "8-7",
      tijd: "18:00",
      stadion: "Los Angeles",
      home: getWinnaarVanDuel(85),
      away: getWinnaarVanDuel(86),
    },
    {
      duel: 96,
      datum: "8-7",
      tijd: "22:00",
      stadion: "Mexico-Stad",
      home: getWinnaarVanDuel(87),
      away: getWinnaarVanDuel(88),
    },
  ]
}
const getLaatste16VoorSpeler = (
  userKnockoutWinners: Record<number, string>
) => {
  return [
    { duel: 89, datum: "5-7", tijd: "18:00", stadion: "Philadelphia", home: getWinnaarVanDuelVoorSpeler(73, userKnockoutWinners), away: getWinnaarVanDuelVoorSpeler(74, userKnockoutWinners) },
    { duel: 90, datum: "5-7", tijd: "22:00", stadion: "Houston", home: getWinnaarVanDuelVoorSpeler(75, userKnockoutWinners), away: getWinnaarVanDuelVoorSpeler(76, userKnockoutWinners) },
    { duel: 91, datum: "6-7", tijd: "18:00", stadion: "Atlanta", home: getWinnaarVanDuelVoorSpeler(77, userKnockoutWinners), away: getWinnaarVanDuelVoorSpeler(78, userKnockoutWinners) },
    { duel: 92, datum: "6-7", tijd: "22:00", stadion: "Seattle", home: getWinnaarVanDuelVoorSpeler(79, userKnockoutWinners), away: getWinnaarVanDuelVoorSpeler(80, userKnockoutWinners) },
    { duel: 93, datum: "7-7", tijd: "18:00", stadion: "Boston", home: getWinnaarVanDuelVoorSpeler(81, userKnockoutWinners), away: getWinnaarVanDuelVoorSpeler(82, userKnockoutWinners) },
    { duel: 94, datum: "7-7", tijd: "22:00", stadion: "Dallas", home: getWinnaarVanDuelVoorSpeler(83, userKnockoutWinners), away: getWinnaarVanDuelVoorSpeler(84, userKnockoutWinners) },
    { duel: 95, datum: "8-7", tijd: "18:00", stadion: "Los Angeles", home: getWinnaarVanDuelVoorSpeler(85, userKnockoutWinners), away: getWinnaarVanDuelVoorSpeler(86, userKnockoutWinners) },
    { duel: 96, datum: "8-7", tijd: "22:00", stadion: "Mexico-Stad", home: getWinnaarVanDuelVoorSpeler(87, userKnockoutWinners), away: getWinnaarVanDuelVoorSpeler(88, userKnockoutWinners) },
  ]
}
const getLaatste32VoorSpeler = (
  userScores: { [key: string]: { s1?: string; s2?: string } }
) => {
  const getStand = (pouleKey: string) =>
    berekenPouleStandVoorSpeler(pouleKey, userScores)

  const getTeam = (pouleKey: string, plek: number) =>
    getStand(pouleKey)[plek - 1]?.land || null

  const getBesteDerdesVoorSpeler = () => {
    const derdes = Object.keys(poules).map((pouleKey) => {
      const stand = getStand(pouleKey)

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
  duel: 74 | 77 | 79 | 80 | 81 | 82 | 85 | 87
) => {
    const besteDerdes = getBesteDerdesVoorSpeler()

    const combinatieKey = getBesteDerdeCombinatieKey(
      besteDerdes.map((team) => team.poule)
    )

    const pouleKey = getDerdePouleVoorDuel(combinatieKey, duel)
    if (!pouleKey) return null

    return besteDerdes.find((team) => team.poule === pouleKey)?.land || null
  }

  return [
    { duel: 73, datum: "28-6", tijd: "21:00", stadion: "Los Angeles", home: getTeam("A", 2), away: getTeam("B", 2) },
    { duel: 76, datum: "29-6", tijd: "19:00", stadion: "Houston", home: getTeam("C", 1), away: getTeam("F", 2) },
    { duel: 74, datum: "29-6", tijd: "22:30", stadion: "Boston", home: getTeam("E", 1), away: getDerdeVoorDuelSpeler(74) },
    { duel: 75, datum: "30-6", tijd: "03:00", stadion: "Monterrey", home: getTeam("F", 1), away: getTeam("C", 2) },
    { duel: 78, datum: "30-6", tijd: "19:00", stadion: "Dallas", home: getTeam("E", 2), away: getTeam("I", 2) },
    { duel: 77, datum: "30-6", tijd: "23:00", stadion: "New York", home: getTeam("I", 1), away: getDerdeVoorDuelSpeler(77) },
    { duel: 79, datum: "1-7", tijd: "03:00", stadion: "Mexico-Stad", home: getTeam("A", 1), away: getDerdeVoorDuelSpeler(79) },
    { duel: 80, datum: "1-7", tijd: "18:00", stadion: "Atlanta", home: getTeam("L", 1), away: getDerdeVoorDuelSpeler(80) },
    { duel: 82, datum: "1-7", tijd: "22:00", stadion: "San Francisco", home: getTeam("G", 1), away: getDerdeVoorDuelSpeler(82) },
    { duel: 81, datum: "2-7", tijd: "02:00", stadion: "Seattle", home: getTeam("D", 1), away: getDerdeVoorDuelSpeler(81) },
    { duel: 84, datum: "2-7", tijd: "21:00", stadion: "Los Angeles", home: getTeam("H", 1), away: getTeam("J", 2) },
    { duel: 83, datum: "3-7", tijd: "01:00", stadion: "Toronto", home: getTeam("K", 2), away: getTeam("L", 2) },
    { duel: 85, datum: "3-7", tijd: "05:00", stadion: "Vancouver", home: getTeam("B", 1), away: getDerdeVoorDuelSpeler(85) },
    { duel: 88, datum: "3-7", tijd: "20:00", stadion: "Dallas", home: getTeam("D", 2), away: getTeam("G", 2) },
    { duel: 86, datum: "4-7", tijd: "00:00", stadion: "Miami", home: getTeam("J", 1), away: getTeam("H", 2) },
    { duel: 87, datum: "4-7", tijd: "03:30", stadion: "Kansas City", home: getTeam("K", 1), away: getDerdeVoorDuelSpeler(87) },
  ]
}
const getKwartfinale = () => {
  return [
    {
      duel: 97,
      datum: "11-7",
      tijd: "18:00",
      stadion: "Miami",
      home: getWinnaarVanDuel(89),
      away: getWinnaarVanDuel(90),
    },
    {
      duel: 98,
      datum: "11-7",
      tijd: "22:00",
      stadion: "Kansas City",
      home: getWinnaarVanDuel(91),
      away: getWinnaarVanDuel(92),
    },
    {
      duel: 99,
      datum: "12-7",
      tijd: "18:00",
      stadion: "Vancouver",
      home: getWinnaarVanDuel(93),
      away: getWinnaarVanDuel(94),
    },
    {
      duel: 100,
      datum: "12-7",
      tijd: "22:00",
      stadion: "New York",
      home: getWinnaarVanDuel(95),
      away: getWinnaarVanDuel(96),
    },
  ]
}

const getKwartfinaleVoorSpeler = (
  userKnockoutWinners: Record<number, string>
) => {
  return [
    { duel: 97, datum: "11-7", tijd: "18:00", stadion: "Miami", home: getWinnaarVanDuelVoorSpeler(89, userKnockoutWinners), away: getWinnaarVanDuelVoorSpeler(90, userKnockoutWinners) },
    { duel: 98, datum: "11-7", tijd: "22:00", stadion: "Kansas City", home: getWinnaarVanDuelVoorSpeler(91, userKnockoutWinners), away: getWinnaarVanDuelVoorSpeler(92, userKnockoutWinners) },
    { duel: 99, datum: "12-7", tijd: "18:00", stadion: "Vancouver", home: getWinnaarVanDuelVoorSpeler(93, userKnockoutWinners), away: getWinnaarVanDuelVoorSpeler(94, userKnockoutWinners) },
    { duel: 100, datum: "12-7", tijd: "22:00", stadion: "New York", home: getWinnaarVanDuelVoorSpeler(95, userKnockoutWinners), away: getWinnaarVanDuelVoorSpeler(96, userKnockoutWinners) },
  ]
}

const getHalveFinale = () => {
  return [
    {
      duel: 101,
      datum: "15-7",
      tijd: "21:00",
      stadion: "Dallas",
      home: getWinnaarVanDuel(97),
      away: getWinnaarVanDuel(98),
    },
    {
      duel: 102,
      datum: "16-7",
      tijd: "21:00",
      stadion: "Atlanta",
      home: getWinnaarVanDuel(99),
      away: getWinnaarVanDuel(100),
    },
  ]
}

const getHalveFinaleVoorSpeler = (
  userKnockoutWinners: Record<number, string>
) => {
  return [
    { duel: 101, datum: "15-7", tijd: "21:00", stadion: "Dallas", home: getWinnaarVanDuelVoorSpeler(97, userKnockoutWinners), away: getWinnaarVanDuelVoorSpeler(98, userKnockoutWinners) },
    { duel: 102, datum: "16-7", tijd: "21:00", stadion: "Atlanta", home: getWinnaarVanDuelVoorSpeler(99, userKnockoutWinners), away: getWinnaarVanDuelVoorSpeler(100, userKnockoutWinners) },
  ]
}

const getVerliezerVanHalveFinale = (duelNummer: 101 | 102) => {
  const halveFinales = getHalveFinale()
  const duel = halveFinales.find((d) => d.duel === duelNummer)

  if (!duel) return null

  const winnaar = getWinnaarVanDuel(duelNummer)

  if (!winnaar) return null
  if (duel.home === winnaar) return duel.away
  if (duel.away === winnaar) return duel.home

  return null
}


const getTroostfinale = () => {
  return [
    {
      duel: 103,
      datum: "18-7",
      tijd: "20:00",
      stadion: "Miami",
      home: getVerliezerVanHalveFinale(101),
      away: getVerliezerVanHalveFinale(102),
    },
  ]
}
const getFinale = () => {
  return [
    {
      duel: 104,
      datum: "19-7",
      tijd: "21:00",
      stadion: "New York New Jersey",
      home: getWinnaarVanDuel(101),
      away: getWinnaarVanDuel(102),
    },
  ]
}

const getTroostfinaleVoorSpeler = (
  userKnockoutWinners: Record<number, string>
) => {
  const halveFinalesSpeler = getHalveFinaleVoorSpeler(userKnockoutWinners)

  const verliezer101 =
    userKnockoutWinners[101] === halveFinalesSpeler[0].home
      ? halveFinalesSpeler[0].away
      : halveFinalesSpeler[0].home

  const verliezer102 =
    userKnockoutWinners[102] === halveFinalesSpeler[1].home
      ? halveFinalesSpeler[1].away
      : halveFinalesSpeler[1].home

  return [
    { duel: 103, datum: "18-7", tijd: "20:00", stadion: "Miami", home: verliezer101 || null, away: verliezer102 || null },
  ]
}

const getFinaleVoorSpeler = (
  userKnockoutWinners: Record<number, string>
) => {
  return [
    { duel: 104, datum: "19-7", tijd: "21:00", stadion: "New York New Jersey", home: getWinnaarVanDuelVoorSpeler(101, userKnockoutWinners), away: getWinnaarVanDuelVoorSpeler(102, userKnockoutWinners) },
  ]
}

const renderKnockoutRonde = (
  titel: string,
  duels: {
    duel: number
    datum: string
    tijd: string
    stadion: string
    home: string | null
    away: string | null
  }[]
) => {
  return (
    <div className="mt-8 w-full max-w-3xl mx-auto">
      <h3 className="text-xl font-bold mb-4 text-center">{titel}</h3>

      <div className="bg-gray-800 rounded-xl overflow-hidden w-full">
        {duels.map((duel) => (
          <div
            key={duel.duel}
            className="p-3 border-b border-gray-700 last:border-b-0 transition-all duration-200 hover:bg-gray-700/40"
          >
            <div className="hidden md:grid items-center gap-2 grid-cols-[42px_52px_95px_minmax(175px,1fr)_20px_minmax(175px,1fr)]">
              <span className="text-sm text-gray-400 whitespace-nowrap">
                {duel.datum}
              </span>

              <span className="text-sm text-gray-400 whitespace-nowrap">
                {duel.tijd}
              </span>

              <span className="text-sm text-gray-500 truncate">
                {duel.stadion}
              </span>

              <button
                onClick={() => kiesWinnaar(duel.duel, duel.home || undefined)}
                disabled={!duel.home || voorspellingenGesloten}
               className={`px-4 py-2 rounded-lg transition-all duration-300 ${
                  knockoutWinners[duel.duel] === duel.home
                    ? "bg-orange-500 text-white shadow-[0_0_15px_rgba(249,115,22,0.45)] ring-1 ring-orange-300"
                    : "bg-gray-700 hover:bg-gray-600"
                } ${
                  !duel.home || voorspellingenGesloten
                    ? "opacity-50 cursor-not-allowed"
                    : ""
                }`}
              >
                <span className="flex items-center gap-2 whitespace-nowrap overflow-hidden">
                  <span className="truncate">{duel.home || "Nog onbekend"}</span>
                  {duel.home && <Flag land={duel.home} />}
                </span>
              </button>

              <span className="text-center text-gray-400 font-semibold">-</span>

              <button
                onClick={() => kiesWinnaar(duel.duel, duel.away || undefined)}
                disabled={!duel.away || voorspellingenGesloten}
               className={`px-4 py-2 rounded-lg transition-all duration-300 ${
                  knockoutWinners[duel.duel] === duel.away
                    ? "bg-orange-500 text-white shadow-[0_0_15px_rgba(249,115,22,0.45)] ring-1 ring-orange-300"
                    : "bg-gray-700 hover:bg-gray-600"
                } ${
                  !duel.away || voorspellingenGesloten
                    ? "opacity-50 cursor-not-allowed"
                    : ""
                }`}
              >
                <span className="flex items-center gap-2 whitespace-nowrap overflow-hidden">
                  <span className="truncate">{duel.away || "Nog onbekend"}</span>
                  {duel.away && <Flag land={duel.away} />}
                </span>
              </button>
            </div>

            <div className="md:hidden">
              <div className="mb-2 flex items-center justify-between text-xs text-gray-400">
                <span>
                  {duel.datum} · {duel.tijd}
                </span>
                <span className="truncate max-w-[150px]">{duel.stadion}</span>
              </div>

              <div className="grid grid-cols-[1fr_28px_1fr] items-center gap-2">
                <button
                  onClick={() => kiesWinnaar(duel.duel, duel.home || undefined)}
                  disabled={!duel.home || voorspellingenGesloten}
                  className={`min-h-[44px] w-full text-left px-3 py-2 rounded transition ${
                    knockoutWinners[duel.duel] === duel.home
                      ? "bg-orange-500 text-white"
                      : "bg-gray-700 hover:bg-gray-600"
                  } ${
                    !duel.home || voorspellingenGesloten
                      ? "opacity-50 cursor-not-allowed"
                      : ""
                  }`}
                >
                  <span className="flex items-center gap-2 overflow-hidden">
                    <span className="truncate text-sm">{duel.home || "Nog onbekend"}</span>
                    {duel.home && <Flag land={duel.home} />}
                  </span>
                </button>

                <span className="text-center text-gray-400 font-semibold">-</span>

                <button
                  onClick={() => kiesWinnaar(duel.duel, duel.away || undefined)}
                  disabled={!duel.away || voorspellingenGesloten}
                  className={`min-h-[44px] w-full text-left px-3 py-2 rounded transition ${
                    knockoutWinners[duel.duel] === duel.away
                      ? "bg-orange-500 text-white"
                      : "bg-gray-700 hover:bg-gray-600"
                  } ${
                    !duel.away || voorspellingenGesloten
                      ? "opacity-50 cursor-not-allowed"
                      : ""
                  }`}
                >
                  <span className="flex items-center gap-2 overflow-hidden">
                    <span className="truncate text-sm">{duel.away || "Nog onbekend"}
                    </span>
                    {duel.away && <Flag land={duel.away} />}
                  </span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
const besteDerdes = useMemo(() => getBesteDerdes(), [scores])

const laatste32 = useMemo(() => getLaatste32(), [scores])

const laatste16 = useMemo(() => getLaatste16(), [knockoutWinners])

const kwartfinale = useMemo(() => getKwartfinale(), [knockoutWinners])

const halveFinale = useMemo(() => getHalveFinale(), [knockoutWinners])

const finale = useMemo(() => getFinale(), [knockoutWinners])
const troostfinale = useMemo(() => getTroostfinale(), [knockoutWinners])

const leaderboard = useMemo(() => getLeaderboard(), [
  alleVoorspellingen,
  user,
  scores,
  knockoutWinners,
])
  return (
    <main className="min-h-screen bg-gray-950 text-white flex flex-col items-center justify-start pt-24 px-6">
      
      
      <h1 className="text-3xl font-bold mb-6">Voorspellen ⚽</h1>
      
      <button
  onClick={() => {
    const data = localStorage.getItem("alleVoorspellingen") || "{}"
    navigator.clipboard.writeText(data)
    alert("Backup gekopieerd ✅ Plak dit ergens veilig, bijvoorbeeld in Notes of WhatsApp.")
  }}
  className="mb-4 rounded-lg bg-gray-800 px-4 py-2 text-sm font-semibold text-gray-200 hover:bg-gray-700 border border-gray-700 transition-all duration-200 hover:scale-[1.03] active:scale-[0.98]"
>
  Backup kopiëren 📋
</button>
      <div
  className={`w-full max-w-4xl rounded-xl px-4 py-3 text-center font-medium ${
    voorspellingenGesloten
      ? "bg-red-900/30 border border-red-700 text-red-300"
      : "bg-green-900/30 border border-green-700 text-green-300"
  }`}
>
  {voorspellingenGesloten
  ? "Voorspellingen zijn gesloten 🔒"
  : `Voorspellingen zijn nog open ✅ Nog ${getTijdTotDeadline()}`}
</div>

  <div className="w-full max-w-4xl mt-6">
  <h2 className="text-3xl font-extrabold text-center mb-6 tracking-tight text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.08)]">
  Groepsfase
</h2>

  <div className="bg-gradient-to-b from-gray-900 to-gray-950 border border-gray-800 shadow-[0_0_25px_rgba(0,0,0,0.35)] p-6 rounded-2xl flex flex-col gap-6">

    {Object.entries(poules).map(([pouleKey, wedstrijden]) => {
      const stand = berekenPouleStand(pouleKey)
      const poulePunten = berekenPoulePunten(pouleKey)

      return (
        <div key={pouleKey} className="mb-8 last:mb-0">
          <h2 className="text-xl font-bold mb-2">
            Poule {pouleKey}
          </h2>

          {wedstrijden.map((w, i) => {
            const key = getWedstrijdKey(pouleKey, i)
            const voorspelling = scores[key]

            return (
              <div
  key={key}
  className={`p-3 rounded mb-3 transition-all duration-200 hover:-translate-y-[2px] ${
    isPerfecteScore(w, pouleKey, i)
      ? "bg-green-900/40 ring-1 ring-green-500 hover:bg-green-900/50"
      : "bg-gray-800 hover:bg-gray-700"
  }`}
>
  {/* DESKTOP */}
  <div
    className="hidden md:grid items-center gap-3"
    style={{
      gridTemplateColumns:
        "55px 60px 120px 1fr 90px 1fr 55px",
    }}
  >
    <span className="text-sm text-gray-400 w-14">{w.datum}</span>

    <span className="text-sm text-gray-400 w-14">{w.tijd}</span>

    <span className="text-sm text-gray-500 truncate">
      {w.stadion}
    </span>

    <span className="text-right pr-4 whitespace-nowrap w-36 flex items-center justify-end gap-2">
      <span>{w.team1}</span>
      <Flag land={w.team1} />
    </span>

    <div className="flex items-center justify-center gap-1 w-24">
      <input
        value={voorspelling?.s1 || ""}
        onChange={(e) =>
          updateScore(key, "s1", e.target.value)
        }
        disabled={voorspellingenGesloten}
        className="w-10 text-center bg-gray-700 rounded border border-gray-600 focus:outline-none focus:ring-2 focus:ring-orange-500 transition disabled:opacity-60 disabled:cursor-not-allowed"
      />

      <span>-</span>

      <input
        value={voorspelling?.s2 || ""}
        onChange={(e) =>
          updateScore(key, "s2", e.target.value)
        }
        disabled={voorspellingenGesloten}
        className="w-10 text-center bg-gray-700 rounded border border-gray-600 focus:outline-none focus:ring-2 focus:ring-orange-500 transition disabled:opacity-60 disabled:cursor-not-allowed"
      />
    </div>

    <span className="text-left pl-6 whitespace-nowrap w-36 flex items-center gap-2">
      <span>{w.team2}</span>
      <Flag land={w.team2} />
    </span>

    <div
      className={`mt-2 text-right text-xs flex items-center justify-end gap-1 ${
        berekenPuntenVoorWedstrijd(w, pouleKey, i) === 10
          ? "text-green-400 font-semibold"
          : "text-orange-400"
      }`}
    >
      {berekenPuntenVoorWedstrijd(w, pouleKey, i)} pt
      {berekenPuntenVoorWedstrijd(w, pouleKey, i) === 10 &&
        "🔥"}
    </div>
  </div>

  {/* MOBILE */}
  <div className="md:hidden">
    <div className="flex items-center justify-between text-xs text-gray-400 mb-2">
      <span>
        {w.datum} · {w.tijd}
      </span>

      <span className="truncate max-w-[120px]">
        {w.stadion}
      </span>
    </div>

    <div className="grid grid-cols-[1fr_72px_1fr] items-center gap-2">
      <div className="flex items-center gap-2 overflow-hidden">
        <Flag land={w.team1} />
        <span className="truncate text-sm">
          {w.team1}
        </span>
      </div>

      <div className="flex items-center justify-center gap-1">
        <input
          value={voorspelling?.s1 || ""}
          onChange={(e) =>
            updateScore(key, "s1", e.target.value)
          }
          disabled={voorspellingenGesloten}
          className="w-8 text-center bg-gray-700 rounded text-sm border border-gray-600 focus:outline-none focus:ring-2 focus:ring-orange-500 transition"
        />

        <span>-</span>

        <input
          value={voorspelling?.s2 || ""}
          onChange={(e) =>
            updateScore(key, "s2", e.target.value)
          }
          disabled={voorspellingenGesloten}
          className="w-8 text-center bg-gray-700 rounded text-sm border border-gray-600 focus:outline-none focus:ring-2 focus:ring-orange-500 transition"
        />
      </div>

      <div className="flex items-center justify-end gap-2 overflow-hidden">
        <span className="truncate text-sm text-right">
          {w.team2}
        </span>

        <Flag land={w.team2} />
      </div>
    </div>

    <div className="mt-2 text-right text-xs text-orange-400">
      {berekenPuntenVoorWedstrijd(w, pouleKey, i)} pt
    </div>
  </div>
</div>
            )
          })}

          <div className="mt-8">
            <h3 className="text-lg font-bold mb-3">Stand Poule {pouleKey}</h3>

            <div className="bg-gray-800 rounded-xl overflow-hidden">
  {/* DESKTOP */}
  <div className="hidden md:grid grid-cols-[40px_1fr_40px_40px_40px_40px_50px_50px_50px] px-4 py-3 text-xs text-gray-400 border-b border-gray-700">
    <span>#</span>
    <span>Land</span>
    <span>G</span>
    <span>W</span>
    <span>GL</span>
    <span>V</span>
    <span>+</span>
    <span>-</span>
    <span>Pt</span>
  </div>

  {/* MOBILE */}
  <div className="grid md:hidden grid-cols-[36px_minmax(0,1fr)_50px] px-4 py-3 text-xs text-gray-400 border-b border-gray-700">
    <span>#</span>
    <span>Land</span>
    <span className="text-right">Pt</span>
  </div>

  {stand.map((team, index) => (
    <div key={team.land}>
      {/* DESKTOP */}
      <div className="hidden md:grid grid-cols-[40px_1fr_40px_40px_40px_40px_50px_50px_50px] px-4 py-3 border-b border-gray-700 last:border-b-0">
        <span className="font-semibold text-gray-300">{index + 1}</span>
        <span>{team.land}</span>
        <span>{team.gespeeld}</span>
        <span>{team.winst}</span>
        <span>{team.gelijk}</span>
        <span>{team.verlies}</span>
        <span>{team.voor}</span>
        <span>{team.tegen}</span>
        <span className="font-semibold text-orange-400">{team.punten}</span>
      </div>

      {/* MOBILE */}
      <div className="grid md:hidden grid-cols-[36px_minmax(0,1fr)_50px] px-4 py-3 border-b border-gray-700 last:border-b-0">
        <span className="font-semibold text-gray-300">{index + 1}</span>

        <span className="truncate">
          {team.land}
        </span>

        <span className="text-right font-semibold text-orange-400">
          {team.punten}
        </span>
      </div>
    </div>
  ))}
</div>

          <p className="mt-3 text-sm text-center text-green-400 font-semibold">
            Punten eindstand poule: {poulePunten}
          </p>
        </div>
        </div>
          
      )
    })}

    <div
  className={`w-full mt-2 py-3 rounded-lg border text-center font-medium transition-all duration-300 ${
    saving
      ? "bg-orange-900/30 border-orange-700 text-orange-300"
      : "bg-green-900/30 border-green-700 text-green-300"
  }`}
>
      {saving ? "Opslaan..." : "Alles opgeslagen ✅"}
    </div>
    </div>
  </div>

      <div className="mt-8 w-full max-w-4xl mx-auto">
  <h3 className="text-3xl font-extrabold text-center mb-6 tracking-tight text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.08)]">
  Beste nummers 3
</h3>

  <div className="bg-gradient-to-b from-gray-800 to-gray-900 border border-gray-700 rounded-2xl overflow-hidden shadow-[0_0_20px_rgba(0,0,0,0.25)]">
    {besteDerdes.map((team, index) => (
      <div
        key={`${team.poule}-${team.land}`}
        className="px-4 py-3 border-b border-gray-700 last:border-b-0"
      >
        <div className="flex items-center justify-center gap-2">
          <span className="font-medium">
            #{index + 1} - Poule {team.poule} - {team.land}
          </span>
          <Flag land={team.land} />
          <span className="text-orange-400 font-semibold">
            ({team.punten} pt)
          </span>
        </div>
      </div>
    ))}
  </div>
</div>

  <div className="mt-8 w-full max-w-4xl mx-auto">
  <h2 className="text-3xl font-extrabold text-center mb-6 tracking-tight text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.08)]">
  Knockoutfase
</h2>

  <div className="bg-gradient-to-b from-gray-900 to-gray-950 border border-gray-800 shadow-[0_0_25px_rgba(0,0,0,0.35)] p-6 rounded-2xl">
    <div className="w-full max-w-2xl mx-auto">
      {renderKnockoutRonde("Laatste 32", laatste32)}
      {renderKnockoutRonde("Laatste 16", laatste16)}
      {renderKnockoutRonde("Kwartfinale", kwartfinale)}
      {renderKnockoutRonde("Halve finale", halveFinale)}
      {renderKnockoutRonde("Troostfinale", troostfinale)}
      {renderKnockoutRonde("Finale", finale)}
    </div>
  </div>
</div>

<div className="mt-8 w-full max-w-4xl mx-auto mb-16">
  <h3 className="text-xl font-bold mb-4 text-center">Wereldkampioen</h3>

  <div className="bg-gradient-to-br from-yellow-500/10 via-orange-500/10 to-amber-500/10 border border-yellow-500/20 rounded-2xl p-6 text-center shadow-[0_0_35px_rgba(234,179,8,0.15)]">
    <span className="text-3xl font-extrabold text-yellow-300 drop-shadow-[0_0_12px_rgba(253,224,71,0.45)] tracking-tight">
  {knockoutWinners[104] ? (
  knockoutWinners[104]
) : (
  <span className="text-yellow-100/70 italic tracking-wide">
    Nog niet gekozen 👀
  </span>
)}
</span>
  </div>
</div>

<div className="mt-8 w-full max-w-4xl mx-auto">
  <h2 className="text-3xl font-extrabold text-center mb-6 tracking-tight text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.08)]">
  Extra voorspellingen 🎯
</h2>

  <div className="bg-gradient-to-b from-gray-800 to-gray-900 border border-gray-700 rounded-2xl p-6 grid gap-4 md:grid-cols-2 shadow-[0_0_20px_rgba(0,0,0,0.25)]">
    <div>
      <label className="block text-sm text-gray-300 mb-1 flex justify-between">
        <span>
          Totaal gele kaarten toernooi <span className="text-orange-400">(15 pt)</span>
        </span>
        <span className="text-orange-400 text-xs">
          {getExtraPuntenVoorVeld("geleKaarten")} pt
        </span>
      </label>
      <input
        type="number"
        value={extraVoorspellingen.geleKaarten || ""}
        onChange={(e) => updateExtraVoorspelling("geleKaarten", e.target.value)}
        disabled={voorspellingenGesloten}
        className="w-full rounded bg-gray-700 px-3 py-2 text-white"
      />
    </div>

    <div>
      <label className="block text-sm text-gray-300 mb-1 flex justify-between">
        <span>
          Totaal rode kaarten toernooi <span className="text-orange-400">(15 pt)</span>
        </span>
        <span className="text-orange-400 text-xs">
          {getExtraPuntenVoorVeld("rodeKaarten")} pt
        </span>
      </label>
      <input
        type="number"
        value={extraVoorspellingen.rodeKaarten || ""}
        onChange={(e) => updateExtraVoorspelling("rodeKaarten", e.target.value)}
        disabled={voorspellingenGesloten}
        className="w-full rounded bg-gray-700 px-3 py-2 text-white"
      />
    </div>

    <div>
      <label className="block text-sm text-gray-300 mb-1 flex justify-between">
        <span>
          Totaal doelpunten toernooi <span className="text-orange-400">(15 pt)</span>
        </span>
        <span className="text-orange-400 text-xs">
          {getExtraPuntenVoorVeld("totaalDoelpunten")} pt
        </span>
      </label>
      <input
        type="number"
        value={extraVoorspellingen.totaalDoelpunten || ""}
        onChange={(e) => updateExtraVoorspelling("totaalDoelpunten", e.target.value)}
        disabled={voorspellingenGesloten}
        className="w-full rounded bg-gray-700 px-3 py-2 text-white"
      />
    </div>

    <div>
      <label className="block text-sm text-gray-300 mb-1 flex justify-between">
        <span>
          Totaal doelpunten Nederland <span className="text-orange-400">(15 pt)</span>
        </span>
        <span className="text-orange-400 text-xs">
          {getExtraPuntenVoorVeld("doelpuntenNederland")} pt
        </span>
      </label>
      <input
        type="number"
        value={extraVoorspellingen.doelpuntenNederland || ""}
        onChange={(e) => updateExtraVoorspelling("doelpuntenNederland", e.target.value)}
        disabled={voorspellingenGesloten}
        className="w-full rounded bg-gray-700 px-3 py-2 text-white"
      />
    </div>

    <div>
      <label className="block text-sm text-gray-300 mb-1 flex justify-between">
        <span>
          Topscorer Nederland <span className="text-orange-400">(15 pt)</span>
        </span>
        <span className="text-orange-400 text-xs">
          {getExtraPuntenVoorVeld("topscorerNederland")} pt
        </span>
      </label>
      <input
        type="text"
        placeholder="Achternaam"
        value={extraVoorspellingen.topscorerNederland || ""}
        onChange={(e) => updateExtraVoorspelling("topscorerNederland", e.target.value)}
        disabled={voorspellingenGesloten}
        className="w-full rounded bg-gray-700 px-3 py-2 text-white placeholder:text-gray-400"
      />
    </div>

    <div>
      <label className="block text-sm text-gray-300 mb-1 flex justify-between">
        <span>
          Topscorer toernooi <span className="text-orange-400">(15 pt)</span>
        </span>
        <span className="text-orange-400 text-xs">
          {getExtraPuntenVoorVeld("topscorerToernooi")} pt
        </span>
      </label>
      <input
        type="text"
        placeholder="Achternaam"
        value={extraVoorspellingen.topscorerToernooi || ""}
        onChange={(e) => updateExtraVoorspelling("topscorerToernooi", e.target.value)}
        disabled={voorspellingenGesloten}
        className="w-full rounded bg-gray-700 px-3 py-2 text-white placeholder:text-gray-400"
      />
    </div>

    <div>
      <label className="block text-sm text-gray-300 mb-1 flex justify-between">
        <span>
          Land met meeste tegengoals <span className="text-orange-400">(15 pt)</span>
        </span>
        <span className="text-orange-400 text-xs">
          {getExtraPuntenVoorVeld("meesteTegengoalsLand")} pt
        </span>
      </label>
      <select
        value={extraVoorspellingen.meesteTegengoalsLand || ""}
        onChange={(e) => updateExtraVoorspelling("meesteTegengoalsLand", e.target.value)}
        disabled={voorspellingenGesloten}
        className="w-full rounded bg-gray-700 px-3 py-2 text-white"
      >
        <option value="">Kies een land</option>
        {alleLanden.map((land) => (
          <option key={land} value={land}>
            {land}
          </option>
        ))}
      </select>
    </div>

    <div>
      <label className="block text-sm text-gray-300 mb-1 flex justify-between">
        <span>
          Land met meeste goals <span className="text-orange-400">(15 pt)</span>
        </span>
        <span className="text-orange-400 text-xs">
          {getExtraPuntenVoorVeld("meesteGoalsLand")} pt
        </span>
      </label>
      <select
        value={extraVoorspellingen.meesteGoalsLand || ""}
        onChange={(e) => updateExtraVoorspelling("meesteGoalsLand", e.target.value)}
        disabled={voorspellingenGesloten}
        className="w-full rounded bg-gray-700 px-3 py-2 text-white"
      >
        <option value="">Kies een land</option>
        {alleLanden.map((land) => (
          <option key={land} value={land}>
            {land}
          </option>
        ))}
      </select>
    </div>
  </div>
</div>

<div className="mt-8 w-full max-w-4xl mx-auto mb-16">
  <h3 className="text-3xl font-extrabold text-center mb-6 tracking-tight text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.08)]">
  Leaderboard 🏆
</h3>

  <div className="bg-gradient-to-b from-gray-800 to-gray-900 border border-gray-700 rounded-2xl overflow-hidden shadow-[0_0_20px_rgba(0,0,0,0.25)]">
    {leaderboard.map((speler, index) => (
      <button
  key={speler.naam}
  onClick={() => setGeselecteerdeSpeler(speler.naam)}
  className={`w-full grid grid-cols-[40px_minmax(0,1fr)_60px] items-center px-4 py-3 border-b border-gray-700 last:border-b-0 transition-all duration-200 text-left hover:scale-[1.01] ${
  index === 0
    ? "bg-yellow-500/10 ring-1 ring-yellow-500/30 shadow-[0_0_14px_rgba(234,179,8,0.25)]"
    : index === 1
    ? "bg-gray-300/10 ring-1 ring-gray-400/20 shadow-[0_0_12px_rgba(200,200,200,0.18)]"
    : index === 2
    ? "bg-orange-500/10 ring-1 ring-orange-500/30 shadow-[0_0_12px_rgba(249,115,22,0.22)]"
    : "hover:bg-gray-700/40"
} ${
  speler.naam === user ? "ring-1 ring-green-500" : ""
}`}
      >
        <span
          className={`font-semibold text-lg ${
            index === 0
              ? "text-yellow-400"
              : index === 1
              ? "text-gray-300"
              : index === 2
              ? "text-orange-300"
              : "text-gray-400"
          }`}
        >
          {getRankIcon(index)}
        </span>

        <span
  className={`font-medium truncate ${
            speler.naam === user ? "text-white" : "text-gray-100"
          }`}
        >
          {speler.naam}
        </span>

        <span
          className={`text-right font-semibold ${
            index === 0
              ? "text-yellow-400"
              : index === 1
              ? "text-gray-200"
              : index === 2
              ? "text-orange-300"
              : speler.naam === user
              ? "text-green-400"
              : "text-orange-400"
          }`}
        >
          {speler.punten} pt
        </span>
      </button>
    ))}
  </div>
</div>
{geselecteerdeSpeler && geselecteerdeVoorspelling && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4">
    <div className="w-full max-w-5xl rounded-2xl bg-gray-900 border border-gray-700 p-6 max-h-[85vh] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-gray-900">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">
          Voorspellingen van {geselecteerdeSpeler}
        </h2>

        <button
          onClick={() => setGeselecteerdeSpeler(null)}
          className="rounded bg-gray-700 px-3 py-1 text-sm hover:bg-gray-600"
        >
          Sluiten
        </button>
      </div>

      <div className="grid gap-6">
  {(() => {
    const punten = berekenPuntenUitsplitsingVoorSpeler(
      geselecteerdeVoorspelling.scores || {},
      geselecteerdeVoorspelling.knockoutWinners || {},
      geselecteerdeVoorspelling.extraVoorspellingen || {}
    )

    return (
      <div>
        <h3 className="text-lg font-bold mb-3">Puntenoverzicht 📊</h3>

        <div className="bg-gray-800 rounded-xl overflow-hidden">
          <div className="grid grid-cols-[1fr_80px] px-4 py-3 border-b border-gray-700">
            <span className="text-gray-400">Groepsfase</span>
            <span className="text-right text-orange-400 font-semibold">
              {punten.groepsfasePunten} pt
            </span>
          </div>

          <div className="grid grid-cols-[1fr_80px] px-4 py-3 border-b border-gray-700">
  <span className="text-gray-400">Poulestanden</span>
  <span className="text-right text-orange-400 font-semibold">
    {punten.poulestandPunten} pt
  </span>
</div>

          <div className="grid grid-cols-[1fr_80px] px-4 py-3 border-b border-gray-700">
            <span className="text-gray-400">Knockout</span>
            <span className="text-right text-orange-400 font-semibold">
              {punten.knockoutPunten} pt
            </span>
          </div>

          <div className="grid grid-cols-[1fr_80px] px-4 py-3 border-b border-gray-700">
            <span className="text-gray-400">Extra voorspellingen</span>
            <span className="text-right text-orange-400 font-semibold">
              {punten.extraPunten} pt
            </span>
          </div>

          <div className="grid grid-cols-[1fr_80px] px-4 py-3 bg-gray-700/60">
            <span className="font-bold">Totaal</span>
            <span className="text-right text-green-400 font-bold">
              {punten.totaal} pt
            </span>
          </div>
        </div>
      </div>
    )
  })()}
        <div>
          <h3 className="text-lg font-bold mb-3">Extra voorspellingen 🎯</h3>

          <div className="bg-gray-800 rounded-xl overflow-hidden">
            {[
  ["Totaal gele kaarten toernooi", "geleKaarten", geselecteerdeVoorspelling.extraVoorspellingen?.geleKaarten],
  ["Totaal rode kaarten toernooi", "rodeKaarten", geselecteerdeVoorspelling.extraVoorspellingen?.rodeKaarten],
  ["Totaal doelpunten toernooi", "totaalDoelpunten", geselecteerdeVoorspelling.extraVoorspellingen?.totaalDoelpunten],
  ["Totaal doelpunten Nederland", "doelpuntenNederland", geselecteerdeVoorspelling.extraVoorspellingen?.doelpuntenNederland],
  ["Topscorer Nederland", "topscorerNederland", geselecteerdeVoorspelling.extraVoorspellingen?.topscorerNederland],
  ["Topscorer toernooi", "topscorerToernooi", geselecteerdeVoorspelling.extraVoorspellingen?.topscorerToernooi],
  ["Land meeste tegengoals", "meesteTegengoalsLand", geselecteerdeVoorspelling.extraVoorspellingen?.meesteTegengoalsLand],
  ["Land meeste goals", "meesteGoalsLand", geselecteerdeVoorspelling.extraVoorspellingen?.meesteGoalsLand],
].map(([label, veld, waarde]) => (
              <div
                key={label}
                className="grid grid-cols-[1fr_1fr] px-4 py-3 border-b border-gray-700 last:border-b-0"
              >
                <span className="text-gray-400">{label}</span>
                <span
  className={`font-medium text-right ${getVergelijkKleur(
    veld as keyof typeof extraVoorspellingen,
    waarde
  )}`}
>
  {waarde || "Niet ingevuld"}

  {getMijnExtraWaarde(veld as keyof typeof extraVoorspellingen) &&
    getMijnExtraWaarde(veld as keyof typeof extraVoorspellingen) !== waarde && (
      <span className="ml-2 text-xs text-gray-400">
        (jij: {getMijnExtraWaarde(veld as keyof typeof extraVoorspellingen)})
      </span>
    )}
</span>
              </div>
            ))}
          </div>
        </div>
<div>
  <h3 className="text-lg font-bold mb-3">Poule standen 📊</h3>

  <div className="grid md:grid-cols-2 gap-4">
    {Object.keys(poules).map((pouleKey) => {
      const stand = berekenPouleStandVoorSpeler(
        pouleKey,
        geselecteerdeVoorspelling.scores || {}
      )

      
      return (
        <div key={pouleKey} className="bg-gray-800 rounded-xl p-3">
          <h4 className="font-semibold mb-2">Poule {pouleKey}</h4>

          {stand.map((team, index) => (
            <div
  key={team.land}
  className={`flex justify-between text-sm py-1 px-2 rounded border-b border-gray-700 last:border-0 transition-all duration-200 hover:scale-[1.01]
${
  index === 0
    ? "ring-1 ring-yellow-500/40 shadow-[0_0_12px_rgba(234,179,8,0.25)]"
    : index === 1
    ? "ring-1 ring-gray-300/30 shadow-[0_0_10px_rgba(200,200,200,0.18)]"
    : index === 2
    ? "ring-1 ring-orange-500/40 shadow-[0_0_10px_rgba(249,115,22,0.22)]"
    : ""
}
${getVergelijkKleurPoule(pouleKey, team.land, index).bg}`}
>
              <span
  className={getVergelijkKleurPoule(
  pouleKey,
  team.land,
  index
).text}
>
  {index + 1}. {team.land}

  {(() => {
    const mijnStand = berekenPouleStandVoorSpeler(
      pouleKey,
      mijnVoorspelling?.scores || {}
    )

    const mijnPositie = mijnStand.findIndex(
      (t) => t.land === team.land
    )

    if (mijnPositie !== -1 && mijnPositie !== index) {
      return (
        <span className="ml-2 text-xs text-gray-400">
          (jij: {mijnPositie + 1})
        </span>
      )
    }

    return null
  })()}
</span>
              <span className="text-orange-400">{team.punten} pt</span>
            </div>
          ))}
        </div>

      )
    })}
  </div>
<div>
  <h3 className="text-lg font-bold mb-3">Wedstrijd voorspellingen ⚽</h3>

  <div className="grid gap-4">
    {Object.entries(poules).map(([pouleKey, wedstrijden]) => (
      <div key={pouleKey} className="bg-gray-800 rounded-xl p-3">
        <h4 className="font-semibold mb-2">Poule {pouleKey}</h4>

        {wedstrijden.map((w, i) => {
          const key = `${pouleKey}-${i}`
          const voorspelling =
            geselecteerdeVoorspelling.scores?.[key]

          return (
            <div
  key={key}
  className="grid grid-cols-[1fr_160px_160px] items-center gap-3 text-sm py-2 border-b border-gray-700 last:border-0"
>
  <span className="text-gray-200 truncate">
    {w.team1} - {w.team2}
  </span>

  <div
    className={`text-center rounded px-2 py-1 font-semibold ${
      getVergelijkKleurWedstrijd(
        key,
        voorspelling?.s1,
        voorspelling?.s2
      ).includes("green")
        ? "bg-green-500/15 text-green-400"
        : getVergelijkKleurWedstrijd(
            key,
            voorspelling?.s1,
            voorspelling?.s2
          ).includes("yellow")
        ? "bg-yellow-500/15 text-yellow-300"
        : getVergelijkKleurWedstrijd(
            key,
            voorspelling?.s1,
            voorspelling?.s2
          ).includes("red")
        ? "bg-red-500/15 text-red-400"
        : "bg-gray-700/40 text-gray-400"
    }`}
  >
    {voorspelling?.s1 ?? "-"} - {voorspelling?.s2 ?? "-"}
  </div>

  <div className="text-right text-gray-400 text-sm">
    jij: {mijnVoorspelling?.scores?.[key]?.s1 ?? "-"} -{" "}
    {mijnVoorspelling?.scores?.[key]?.s2 ?? "-"}
  </div>
</div>
          )
        })}
      </div>
    ))}
  </div>
</div>

</div>
        <div>
          <div>
  <h3 className="text-lg font-bold mb-3">Visual bracket 🏆</h3>

{renderSpelerKnockoutRonde(
  "Laatste 32",
  getLaatste32VoorSpeler(geselecteerdeVoorspelling.scores || {}),
  geselecteerdeVoorspelling.knockoutWinners || {}
)}

{renderSpelerKnockoutRonde(
  "Laatste 16",
  getLaatste16VoorSpeler(geselecteerdeVoorspelling.knockoutWinners || {}),
  geselecteerdeVoorspelling.knockoutWinners || {}
)}

{renderSpelerKnockoutRonde(
  "Kwartfinale",
  getKwartfinaleVoorSpeler(geselecteerdeVoorspelling.knockoutWinners || {}),
  geselecteerdeVoorspelling.knockoutWinners || {}
)}

{renderSpelerKnockoutRonde(
  "Halve finale",
  getHalveFinaleVoorSpeler(geselecteerdeVoorspelling.knockoutWinners || {}),
  geselecteerdeVoorspelling.knockoutWinners || {}
)}

{renderSpelerKnockoutRonde(
  "Troostfinale",
  getTroostfinaleVoorSpeler(geselecteerdeVoorspelling.knockoutWinners || {}),
  geselecteerdeVoorspelling.knockoutWinners || {}
)}

{renderSpelerKnockoutRonde(
  "Finale",
  getFinaleVoorSpeler(geselecteerdeVoorspelling.knockoutWinners || {}),
  geselecteerdeVoorspelling.knockoutWinners || {}
)}
</div>
        </div>
      </div>
    </div>
  </div>
)}
    </main>
  )
}