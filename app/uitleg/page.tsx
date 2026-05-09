"use client"

export default function UitlegPage() {
  return (
    <main className="min-h-screen bg-gray-950 text-white px-4 py-10">
      <div className="max-w-4xl mx-auto">

        <div className="text-center mb-10">
          <div className="text-6xl mb-4">⚽</div>
          <h1 className="text-4xl font-extrabold mb-3 tracking-tight">
            Hoe werkt Oranjepoule?
          </h1>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Voorspel het WK 2026, verdien punten en strijd met je vrienden om de winst 🏆
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-4 mb-10">
          {[
            ["⚽", "Voorspel wedstrijden", "Vul alle uitslagen van de groepsfase en knockoutfase in."],
            ["🏆", "Verdien punten", "Correcte uitslagen, perfecte scores en goede knockout picks leveren punten op."],
            ["📊", "Volg het leaderboard", "Bekijk live hoeveel punten iedereen heeft en vergelijk voorspellingen."],
            ["💰", "Win prijzengeld", "De inleg is €15. Van de totale inleg wordt 90% uitgekeerd als prijzengeld."],
          ].map(([icon, title, text]) => (
            <div
              key={title}
              className="bg-gradient-to-b from-gray-800 to-gray-900 border border-gray-700 rounded-2xl p-5 shadow-[0_0_20px_rgba(0,0,0,0.25)]"
            >
              <div className="text-3xl mb-3">{icon}</div>
              <h2 className="text-xl font-bold mb-2">{title}</h2>
              <p className="text-gray-300 text-sm leading-relaxed">{text}</p>
            </div>
          ))}
        </div>

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

            <div className="border-t border-gray-800 pt-6 mt-6">
              <h3 className="text-xl font-bold mb-4 text-white">Knockoutfase 🏆</h3>

              <div className="space-y-3 mb-6">
                {[
                  ["Laatste 32 correct", "10 pt"],
                  ["Laatste 16 correct", "15 pt"],
                  ["Kwartfinale correct", "20 pt"],
                  ["Halve finale correct", "25 pt"],
                  ["Troostfinale correct", "30 pt"],
                  ["Finale correct", "30 pt"],
                  ["Wereldkampioen correct", "60 pt 👑"],
                ].map(([label, points]) => (
                  <div key={label} className="flex justify-between">
                    <span>{label}</span>
                    <span className="text-orange-400 font-bold">{points}</span>
                  </div>
                ))}
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

        <div className="bg-gradient-to-b from-gray-900 to-gray-950 border border-orange-500/30 rounded-3xl p-8 shadow-[0_0_30px_rgba(249,115,22,0.12)] mb-10">
          <h2 className="text-3xl font-bold mb-6 text-center">
            Prijzengeld 💰
          </h2>

          <p className="text-gray-300 text-center mb-6">
            Deelname kost <span className="text-orange-400 font-bold">€15</span>. 
            Van de totale inleg wordt <span className="text-green-400 font-bold">90%</span> uitgekeerd als prijzengeld.
            De overige 10% is voor organisatiekosten.
          </p>

          <div className="space-y-5 text-gray-300">
            <div className="bg-gray-800/70 border border-gray-700 rounded-2xl p-5">
              <h3 className="font-bold text-white mb-3">Tot 100 deelnemers</h3>
              <div className="grid sm:grid-cols-5 gap-2 text-sm">
                <span>1e prijs: 30%</span>
                <span>2e prijs: 20%</span>
                <span>3e prijs: 15%</span>
                <span>4e prijs: 7%</span>
                <span>5e t/m 10e: 3%</span>
              </div>
            </div>

            <div className="bg-gray-800/70 border border-gray-700 rounded-2xl p-5">
              <h3 className="font-bold text-white mb-3">101 t/m 200 deelnemers</h3>
              <div className="grid sm:grid-cols-5 gap-2 text-sm">
                <span>1e prijs: 16%</span>
                <span>2e prijs: 13%</span>
                <span>3e prijs: 11%</span>
                <span>4e prijs: 8%</span>
                <span>5e t/m 10e: 7%</span>
              </div>
            </div>

            <div className="bg-gray-800/70 border border-gray-700 rounded-2xl p-5">
              <h3 className="font-bold text-white mb-3">Vanaf 201 deelnemers</h3>
              <p className="text-sm leading-relaxed text-gray-300">
                Vanaf 201 deelnemers wordt 90% van de totale inleg uitgekeerd als prijzengeld.
                De prijzen worden verdeeld over zoveel winnaars als nodig is, waarbij geen individuele prijs hoger is dan
                <span className="text-orange-400 font-bold"> €448</span>.
              </p>
              <p className="text-sm leading-relaxed text-gray-400 mt-3">
                Voorbeeld: als er na meerdere prijzen nog een resterend bedrag overblijft dat lager is dan €448,
                wordt dit als laatste prijs uitgekeerd.
              </p>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-b from-gray-800 to-gray-900 border border-gray-700 rounded-2xl p-6 shadow-[0_0_20px_rgba(0,0,0,0.25)]">
          <h2 className="text-2xl font-bold mb-4">Belangrijk 📌</h2>

          <ul className="space-y-3 text-gray-300 leading-relaxed">
            <li>⏰ Voorspellingen sluiten zodra het WK begint.</li>
            <li>🔒 Daarna kunnen voorspellingen niet meer aangepast worden.</li>
            <li>🥇 Het leaderboard wordt automatisch bijgewerkt.</li>
            <li>⚽ Knockoutwedstrijden worden automatisch opgebouwd op basis van jouw voorspellingen.</li>
            <li>🎯 Extra voorspellingen kunnen veel bonuspunten opleveren.</li>
            <li>💰 De definitieve prijzenpot hangt af van het totaal aantal deelnemers.</li>
          </ul>
        </div>

      </div>
    </main>
  )
}