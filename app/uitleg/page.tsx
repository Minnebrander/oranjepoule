"use client"

export default function UitlegPage() {
  return (
    <main className="min-h-screen bg-gray-950 text-white px-4 py-10">

      <div className="max-w-4xl mx-auto">

        {/* HEADER */}
        <div className="text-center mb-10">
          <div className="text-6xl mb-4">⚽</div>

          <h1 className="text-4xl font-extrabold mb-3 tracking-tight">
            Hoe werkt Oranjepoule?
          </h1>

          <p className="text-gray-400 max-w-2xl mx-auto">
            Voorspel het WK 2026, verdien punten en strijd met je vrienden
            om de winst 🏆
          </p>
        </div>

        {/* SNEL OVERZICHT */}
        <div className="grid md:grid-cols-2 gap-4 mb-10">

          <div className="bg-gradient-to-b from-gray-800 to-gray-900 border border-gray-700 rounded-2xl p-5 shadow-[0_0_20px_rgba(0,0,0,0.25)]">
            <div className="text-3xl mb-3">⚽</div>

            <h2 className="text-xl font-bold mb-2">
              Voorspel wedstrijden
            </h2>

            <p className="text-gray-300 text-sm leading-relaxed">
              Vul alle uitslagen van de groepsfase en knockoutfase in.
              Hoe beter je voorspelt, hoe meer punten je verdient.
            </p>
          </div>

          <div className="bg-gradient-to-b from-gray-800 to-gray-900 border border-gray-700 rounded-2xl p-5 shadow-[0_0_20px_rgba(0,0,0,0.25)]">
            <div className="text-3xl mb-3">🏆</div>

            <h2 className="text-xl font-bold mb-2">
              Verdien punten
            </h2>

            <p className="text-gray-300 text-sm leading-relaxed">
              Correcte uitslagen, perfecte scores en goede knockout picks
              leveren punten op voor het leaderboard.
            </p>
          </div>

          <div className="bg-gradient-to-b from-gray-800 to-gray-900 border border-gray-700 rounded-2xl p-5 shadow-[0_0_20px_rgba(0,0,0,0.25)]">
            <div className="text-3xl mb-3">📊</div>

            <h2 className="text-xl font-bold mb-2">
              Volg het leaderboard
            </h2>

            <p className="text-gray-300 text-sm leading-relaxed">
              Bekijk live hoeveel punten iedereen heeft en vergelijk
              voorspellingen met andere spelers.
            </p>
          </div>

          <div className="bg-gradient-to-b from-gray-800 to-gray-900 border border-gray-700 rounded-2xl p-5 shadow-[0_0_20px_rgba(0,0,0,0.25)]">
            <div className="text-3xl mb-3">🔥</div>

            <h2 className="text-xl font-bold mb-2">
              Perfecte voorspellingen
            </h2>

            <p className="text-gray-300 text-sm leading-relaxed">
              Een volledig correcte uitslag levert bonuspunten op.
              Perfect voorspeld? Dan krijg je de maximale score.
            </p>
          </div>

        </div>

        {/* PUNTENSYSTEEM */}
        <div className="bg-gradient-to-b from-gray-900 to-gray-950 border border-gray-800 rounded-3xl p-8 shadow-[0_0_30px_rgba(0,0,0,0.35)] mb-10">

          <h2 className="text-3xl font-bold mb-6 text-center">
            Puntensysteem 📈
          </h2>

          <div className="space-y-4 text-gray-300">

            <div className="flex justify-between border-b border-gray-800 pb-3">
              <span>Juiste winnaar / gelijkspel</span>
              <span className="text-orange-400 font-bold">4 pt</span>
            </div>

            <div className="flex justify-between border-b border-gray-800 pb-3">
              <span>Correct aantal goals team 1</span>
              <span className="text-orange-400 font-bold">2 pt</span>
            </div>

            <div className="flex justify-between border-b border-gray-800 pb-3">
              <span>Correct aantal goals team 2</span>
              <span className="text-orange-400 font-bold">2 pt</span>
            </div>

            <div className="flex justify-between border-b border-gray-800 pb-3">
              <span>Perfecte uitslag bonus</span>
              <span className="text-green-400 font-bold">+2 pt 🔥</span>
            </div>

            <div className="border-t border-gray-800 pt-4 mt-4">

  <h3 className="text-xl font-bold mb-4 text-white">
    Knockoutfase 🏆
  </h3>

  <div className="space-y-3 mb-6">

    <div className="flex justify-between">
      <span>Laatste 32 correct</span>
      <span className="text-orange-400 font-bold">10 pt</span>
    </div>

    <div className="flex justify-between">
      <span>Laatste 16 correct</span>
      <span className="text-orange-400 font-bold">15 pt</span>
    </div>

    <div className="flex justify-between">
      <span>Kwartfinale correct</span>
      <span className="text-orange-400 font-bold">20 pt</span>
    </div>

    <div className="flex justify-between">
      <span>Halve finale correct</span>
      <span className="text-orange-400 font-bold">25 pt</span>
    </div>
<div className="flex justify-between">
  <span>Troostfinale correct</span>
  <span className="text-orange-400 font-bold">30 pt</span>
</div>
    <div className="flex justify-between">
      <span>Finale correct</span>
      <span className="text-orange-400 font-bold">30 pt</span>
    </div>

    <div className="flex justify-between">
      <span>Wereldkampioen correct</span>
      <span className="text-green-400 font-bold">60 pt 👑</span>
    </div>

  </div>

  <h3 className="text-xl font-bold mb-4 text-white">
    Extra voorspellingen 🎯
  </h3>

  <div className="space-y-3">

    <div className="flex justify-between">
      <span>Correcte extra voorspelling</span>
      <span className="text-yellow-400 font-bold">15 pt</span>
    </div>

    <p className="text-sm text-gray-400 pt-2 leading-relaxed">
      Voor elke correcte extra voorspelling ontvang je 15 punten.
      Denk aan topscorers, totaal aantal goals en kaarten.
    </p>

  </div>

</div>

          </div>

        </div>

        {/* EXTRA INFO */}
        <div className="bg-gradient-to-b from-gray-800 to-gray-900 border border-gray-700 rounded-2xl p-6 shadow-[0_0_20px_rgba(0,0,0,0.25)]">

          <h2 className="text-2xl font-bold mb-4">
            Belangrijk 📌
          </h2>

          <ul className="space-y-3 text-gray-300 leading-relaxed">
            <li>
              ⏰ Voorspellingen sluiten zodra het WK begint.
            </li>

            <li>
              🔒 Daarna kunnen voorspellingen niet meer aangepast worden.
            </li>

            <li>
              🥇 Het leaderboard wordt automatisch bijgewerkt.
            </li>

            <li>
              ⚽ Knockoutwedstrijden worden automatisch opgebouwd op basis van jouw voorspellingen.
            </li>

            <li>
              🎯 Extra voorspellingen kunnen veel bonuspunten opleveren.
            </li>
          </ul>

        </div>

      </div>

    </main>
  )
}