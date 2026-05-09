export type PouleKey =
  | "A" | "B" | "C" | "D"
  | "E" | "F" | "G" | "H"
  | "I" | "J" | "K" | "L"

export type Wedstrijd = {
  datum: string
  tijd: string
  stadion: string
  team1: string
  team2: string
  score1?: number
  score2?: number
}

export const poules: Record<PouleKey, Wedstrijd[]> = {
  A: [
    { datum: "11-6", tijd: "21:00", stadion: "Mexico-Stad", team1: "Mexico", team2: "Zuid-Afrika" },
    { datum: "12-6", tijd: "04:00", stadion: "Guadalajara", team1: "Zuid-Korea", team2: "Tsjechië" },
    { datum: "18-6", tijd: "18:00", stadion: "Atlanta", team1: "Tsjechië", team2: "Zuid-Afrika" },
    { datum: "19-6", tijd: "03:00", stadion: "Guadalajara", team1: "Mexico", team2: "Zuid-Korea" },
    { datum: "25-6", tijd: "03:00", stadion: "Mexico-Stad", team1: "Tsjechië", team2: "Mexico" },
    { datum: "25-6", tijd: "03:00", stadion: "Monterrey", team1: "Zuid-Afrika", team2: "Zuid-Korea" },
  ],

  B: [
    { datum: "12-6", tijd: "21:00", stadion: "Toronto", team1: "Canada", team2: "Bosnië & Herz." },
    { datum: "13-6", tijd: "21:00", stadion: "San Francisco", team1: "Qatar", team2: "Zwitserland" },
    { datum: "18-6", tijd: "21:00", stadion: "Los Angeles", team1: "Zwitserland", team2: "Bosnië & Herz." },
    { datum: "19-6", tijd: "00:00", stadion: "Vancouver", team1: "Canada", team2: "Qatar" },
    { datum: "24-6", tijd: "21:00", stadion: "Vancouver", team1: "Zwitserland", team2: "Canada" },
    { datum: "24-6", tijd: "21:00", stadion: "Seattle", team1: "Bosnië & Herz.", team2: "Qatar" },
  ],

  C: [
    { datum: "14-6", tijd: "00:00", stadion: "New York", team1: "Brazilië", team2: "Marokko" },
    { datum: "14-6", tijd: "03:00", stadion: "Boston", team1: "Haïti", team2: "Schotland" },
    { datum: "20-6", tijd: "00:00", stadion: "Boston", team1: "Schotland", team2: "Marokko" },
    { datum: "20-6", tijd: "03:00", stadion: "Philadelphia", team1: "Brazilië", team2: "Haïti" },
    { datum: "25-6", tijd: "00:00", stadion: "Miami", team1: "Schotland", team2: "Brazilië" },
    { datum: "25-6", tijd: "00:00", stadion: "Atlanta", team1: "Marokko", team2: "Haïti" },
  ],

  D: [
    { datum: "13-6", tijd: "03:00", stadion: "Los Angeles", team1: "Verenigde Staten", team2: "Paraguay" },
    { datum: "13-6", tijd: "06:00", stadion: "Vancouver", team1: "Australië", team2: "Turkije" },
    { datum: "19-6", tijd: "06:00", stadion: "San Francisco", team1: "Turkije", team2: "Paraguay" },
    { datum: "19-6", tijd: "21:00", stadion: "Seattle", team1: "Verenigde Staten", team2: "Australië" },
    { datum: "26-6", tijd: "04:00", stadion: "Los Angeles", team1: "Turkije", team2: "Verenigde Staten" },
    { datum: "26-6", tijd: "04:00", stadion: "San Francisco", team1: "Paraguay", team2: "Australië" },
  ],

  E: [
    { datum: "14-6", tijd: "19:00", stadion: "Houston", team1: "Duitsland", team2: "Curaçao" },
    { datum: "15-6", tijd: "01:00", stadion: "Philadelphia", team1: "Ivoorkust", team2: "Ecuador" },
    { datum: "20-6", tijd: "22:00", stadion: "Toronto", team1: "Duitsland", team2: "Ivoorkust" },
    { datum: "21-6", tijd: "02:00", stadion: "Kansas City", team1: "Ecuador", team2: "Curaçao" },
    { datum: "25-6", tijd: "22:00", stadion: "New York", team1: "Ecuador", team2: "Duitsland" },
    { datum: "25-6", tijd: "22:00", stadion: "Philadelphia", team1: "Curaçao", team2: "Ivoorkust" },
  ],

  F: [
    { datum: "14-6", tijd: "22:00", stadion: "Dallas", team1: "Nederland", team2: "Japan" },
    { datum: "15-6", tijd: "04:00", stadion: "Monterrey", team1: "Zweden", team2: "Tunesië" },
    { datum: "20-6", tijd: "06:00", stadion: "Monterrey", team1: "Tunesië", team2: "Japan" },
    { datum: "20-6", tijd: "19:00", stadion: "Houston", team1: "Nederland", team2: "Zweden" },
    { datum: "26-6", tijd: "01:00", stadion: "Dallas", team1: "Japan", team2: "Zweden" },
    { datum: "26-6", tijd: "01:00", stadion: "Kansas City", team1: "Tunesië", team2: "Nederland" },
  ],

  G: [
    { datum: "15-6", tijd: "21:00", stadion: "Seattle", team1: "België", team2: "Egypte" },
    { datum: "16-6", tijd: "03:00", stadion: "Los Angeles", team1: "Iran", team2: "Nieuw-Zeeland" },
    { datum: "21-6", tijd: "21:00", stadion: "Los Angeles", team1: "België", team2: "Iran" },
    { datum: "22-6", tijd: "03:00", stadion: "Vancouver", team1: "Nieuw-Zeeland", team2: "Egypte" },
    { datum: "27-6", tijd: "05:00", stadion: "Seattle", team1: "Egypte", team2: "Iran" },
    { datum: "27-6", tijd: "05:00", stadion: "Vancouver", team1: "Nieuw-Zeeland", team2: "België" },
  ],

  H: [
    { datum: "15-6", tijd: "18:00", stadion: "Atlanta", team1: "Spanje", team2: "Kaapverdië" },
    { datum: "16-6", tijd: "00:00", stadion: "Miami", team1: "Saoedi-Arabië", team2: "Uruguay" },
    { datum: "21-6", tijd: "18:00", stadion: "Atlanta", team1: "Spanje", team2: "Saoedi-Arabië" },
    { datum: "22-6", tijd: "00:00", stadion: "Miami", team1: "Uruguay", team2: "Kaapverdië" },
    { datum: "27-6", tijd: "02:00", stadion: "Houston", team1: "Kaapverdië", team2: "Saoedi-Arabië" },
    { datum: "27-6", tijd: "02:00", stadion: "Guadalajara", team1: "Uruguay", team2: "Spanje" },
  ],

  I: [
    { datum: "16-6", tijd: "21:00", stadion: "New York", team1: "Frankrijk", team2: "Senegal" },
    { datum: "17-6", tijd: "00:00", stadion: "Boston", team1: "Irak", team2: "Noorwegen" },
    { datum: "22-6", tijd: "23:00", stadion: "Philadelphia", team1: "Frankrijk", team2: "Irak" },
    { datum: "23-6", tijd: "02:00", stadion: "New York", team1: "Noorwegen", team2: "Senegal" },
    { datum: "26-6", tijd: "21:00", stadion: "Boston", team1: "Noorwegen", team2: "Frankrijk" },
    { datum: "26-6", tijd: "21:00", stadion: "Toronto", team1: "Senegal", team2: "Irak" },
  ],

  J: [
    { datum: "16-6", tijd: "06:00", stadion: "San Francisco", team1: "Oostenrijk", team2: "Jordanië" },
    { datum: "17-6", tijd: "03:00", stadion: "Kansas City", team1: "Argentinië", team2: "Algerije" },
    { datum: "22-6", tijd: "19:00", stadion: "Dallas", team1: "Argentinië", team2: "Oostenrijk" },
    { datum: "23-6", tijd: "05:00", stadion: "San Francisco", team1: "Jordanië", team2: "Algerije" },
    { datum: "28-6", tijd: "04:00", stadion: "Kansas City", team1: "Algerije", team2: "Oostenrijk" },
    { datum: "28-6", tijd: "04:00", stadion: "Dallas", team1: "Jordanië", team2: "Argentinië" },
  ],

  K: [
    { datum: "17-6", tijd: "19:00", stadion: "Houston", team1: "Portugal", team2: "Congo" },
    { datum: "18-6", tijd: "04:00", stadion: "Mexico-Stad", team1: "Oezbekistan", team2: "Colombia" },
    { datum: "23-6", tijd: "19:00", stadion: "Houston", team1: "Portugal", team2: "Oezbekistan" },
    { datum: "24-6", tijd: "04:00", stadion: "Guadalajara", team1: "Colombia", team2: "Congo" },
    { datum: "28-6", tijd: "01:30", stadion: "Miami", team1: "Colombia", team2: "Portugal" },
    { datum: "28-6", tijd: "01:30", stadion: "Atlanta", team1: "Congo", team2: "Oezbekistan" },
  ],

  L: [
    { datum: "17-6", tijd: "22:00", stadion: "Dallas", team1: "Engeland", team2: "Kroatië" },
    { datum: "18-6", tijd: "01:00", stadion: "Toronto", team1: "Ghana", team2: "Panama" },
    { datum: "23-6", tijd: "22:00", stadion: "Boston", team1: "Engeland", team2: "Ghana" },
    { datum: "24-6", tijd: "01:00", stadion: "Toronto", team1: "Panama", team2: "Kroatië" },
    { datum: "27-6", tijd: "23:00", stadion: "New York", team1: "Panama", team2: "Engeland" },
    { datum: "27-6", tijd: "23:00", stadion: "Philadelphia", team1: "Kroatië", team2: "Ghana" },
  ],
}
export const teamsPerPoule = {
  A: ["Mexico", "Zuid-Afrika", "Zuid-Korea", "Tsjechië"],
  B: ["Canada", "Bosnië & Herz.", "Qatar", "Zwitserland"],
  C: ["Brazilië", "Marokko", "Haïti", "Schotland"],
  D: ["Verenigde Staten", "Paraguay", "Australië", "Turkije"],
  E: ["Duitsland", "Curaçao", "Ivoorkust", "Ecuador"],
  F: ["Nederland", "Japan", "Zweden", "Tunesië"],
  G: ["België", "Egypte", "Iran", "Nieuw-Zeeland"],
  H: ["Spanje", "Kaapverdië", "Saoedi-Arabië", "Uruguay"],
  I: ["Frankrijk", "Senegal", "Irak", "Noorwegen"],
  J: ["Argentinië", "Algerije", "Oostenrijk", "Jordanië"],
  K: ["Portugal", "Congo", "Oezbekistan", "Colombia"],
  L: ["Engeland", "Kroatië", "Ghana", "Panama"],
}
