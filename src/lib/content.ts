/**
 * Innehållsdata: tjänster, USP:er, siffror, projekt, FAQ, certifieringar och team.
 *
 * Texterna är färdigskriven, säljande svensk copy i linje med positioneringen
 * (energieffektivisering + ROT, långsiktigt värde framför "billigast").
 *
 * 👉 Siffror i nyttoargument är BRANSCHTYPISKA SPANN, inte garantier. Justera dem
 *    så att de matchar era egna referensvärden. Sök efter "[" för platshållare
 *    (t.ex. teammedlemmar och certifieringar) som ska fyllas i.
 */

/* ───────────────────────────────────── Tjänster ─────────────────────────── */

export type ServiceBenefit = {
  /** Kort, gärna siffersatt nyttoargument, t.ex. "Upp till 20 %". */
  stat: string;
  label: string;
  description: string;
};

export type Service = {
  /** Slug = sista delen av URL:en, t.ex. /tjanster/<slug>/ */
  slug: string;
  /** Full titel (H1 på tjänstesidan). */
  title: string;
  /** Kort titel för navigering/kort. */
  shortTitle: string;
  /** Säljande underrubrik på kort och i hero. */
  tagline: string;
  /** Emoji-/ikonmarkör (dekorativ, aria-hidden). */
  icon: string;
  /** SEO: <title> (≈50–60 tecken). */
  metaTitle: string;
  /** SEO: meta description (≈150–160 tecken). */
  metaDescription: string;
  /** Inledande stycke(n) – översikt av tjänsten. */
  intro: string;
  /** Problemet/utmaningen tjänsten löser. */
  problem: string;
  /** Så jobbar vi – punktlista. */
  approach: string[];
  /** Konkreta nyttor, gärna i siffror. */
  benefits: ServiceBenefit[];
  /** Vad som ingår / kännetecknar leveransen. */
  includes: string[];
  /** Tjänstespecifik mini-FAQ. */
  faqs: { question: string; answer: string }[];
  /** Slugs till relaterade tjänster (intern länkning). */
  related: string[];
};

export const services: Service[] = [
  {
    slug: "energieffektivisering",
    title: "Energieffektivisering av fastigheter",
    shortTitle: "Energieffektivisering",
    tagline: "Sänk driftkostnaden och höj fastighetens värde – med åtgärder som lönar sig.",
    icon: "⚡",
    metaTitle: "Energieffektivisering i Stockholm | Gröna Byggnader",
    metaDescription:
      "Energieffektivisering som sänker driftkostnaden och höjer fastighetens värde. Vi kartlägger, prioriterar och genomför rätt åtgärder – med ROT-avdrag.",
    intro:
      "Energieffektivisering handlar om att få ut mer av varje kilowattimme. Vi börjar alltid med helheten: var försvinner energin idag, vilka åtgärder ger störst effekt per krona, och i vilken ordning bör de göras? Resultatet är en konkret plan där varje insats motiveras av lägre driftkostnad, bättre inomhusklimat och ett högre fastighetsvärde.",
    problem:
      "Många fastigheter läcker energi på flera ställen samtidigt – otillräcklig isolering, gamla fönster, en ineffektiv värmekälla och dålig styrning. Att åtgärda en sak i taget utan plan ger sällan full effekt. Det är därför vi tar ett samlat grepp.",
    approach: [
      "Energikartläggning av klimatskal, värmesystem och ventilation",
      "Åtgärdsförslag rangordnade efter besparing, kostnad och återbetalningstid",
      "Tydlig kalkyl med uppskattad energibesparing och payback per åtgärd",
      "Samordnat genomförande av en och samma partner – mindre krångel för dig",
      "Uppföljning och mätning så att besparingen blir verklig, inte bara teoretisk",
    ],
    benefits: [
      {
        stat: "Upp till 30 %",
        label: "lägre energianvändning",
        description:
          "Ett genomtänkt åtgärdspaket kan sänka fastighetens energianvändning rejält jämfört med utgångsläget.",
      },
      {
        stat: "Flera energiklasser",
        label: "höjd energiprestanda",
        description:
          "Rätt insatser kan lyfta byggnaden flera steg i energideklarationen – ett tydligt värdelyft.",
      },
      {
        stat: "Bättre",
        label: "inomhusklimat",
        description:
          "Jämnare temperatur, mindre drag och bättre luftkvalitet året om.",
      },
    ],
    includes: [
      "Energikartläggning och nulägesanalys",
      "Prioriterad åtgärdsplan med kalkyl",
      "Samordnat genomförande av valda åtgärder",
      "Hjälp med ROT-avdrag och eventuella bidrag",
      "Mätning och uppföljning av resultatet",
    ],
    faqs: [
      {
        question: "Var lönar det sig att börja?",
        answer:
          "Det beror på fastigheten, men ofta ger tätning, tilläggsisolering och styrning av värmen mest effekt per krona. Vi börjar med en kartläggning så att ni investerar i rätt ordning.",
      },
      {
        question: "Hur lång är återbetalningstiden?",
        answer:
          "Den varierar mellan åtgärder – allt från några få år för enklare insatser till längre för större ombyggnationer. I vår kalkyl ser ni payback per åtgärd innan ni bestämmer er.",
      },
    ],
    related: ["tillaggsisolering", "varmesystem-och-varmepump", "fonsterbyte"],
  },
  {
    slug: "tillaggsisolering",
    title: "Tilläggsisolering",
    shortTitle: "Tilläggsisolering",
    tagline: "En av de mest lönsamma energiåtgärderna – mindre värme ut, lägre kostnad.",
    icon: "🧱",
    metaTitle: "Tilläggsisolering i Stockholm | Gröna Byggnader",
    metaDescription:
      "Tilläggsisolering av vind, fasad och grund som sänker uppvärmningskostnaden och ger ett jämnare inomhusklimat. Lönsamt och med ROT-avdrag.",
    intro:
      "En stor del av en byggnads värme försvinner rakt ut genom tak, väggar och grund. Tilläggsisolering är ofta den åtgärd som ger mest besparing för pengarna, särskilt vinden där varm luft stiger och läcker ut. Vi väljer rätt material och metod för just din konstruktion så att du slipper fukt- och köldbryggsproblem.",
    problem:
      "Äldre fastigheter är ofta underisolerade efter dagens mått. Det märks som kalla golv, drag, ojämn värme och höga uppvärmningsräkningar – samtidigt som värmekällan får jobba hårdare än nödvändigt.",
    approach: [
      "Inventering av var isoleringen är otillräcklig och var värmen läcker",
      "Materialval anpassat efter konstruktion, fukt och utrymme",
      "Korrekt hantering av ångspärr och ventilation för att undvika fuktskador",
      "Vindsbjälklag, fasad eller grund – vi prioriterar där effekten är störst",
    ],
    benefits: [
      {
        stat: "Upp till 20 %",
        label: "lägre uppvärmningskostnad",
        description:
          "Vindsisolering är ofta den enskilt mest lönsamma åtgärden och kan ge tydlig effekt på värmeräkningen.",
      },
      {
        stat: "Kort",
        label: "återbetalningstid",
        description:
          "Vindsisolering hör till de åtgärder som ofta betalar sig snabbast av alla energiinsatser.",
      },
      {
        stat: "Varmare",
        label: "golv och väggar",
        description:
          "Mindre drag och kalla ytor ger ett behagligare klimat i hela byggnaden.",
      },
    ],
    includes: [
      "Inventering och fuktbedömning",
      "Materialval och dimensionering",
      "Isolering av vind, fasad eller grund",
      "Korrekt tätning och ventilationshänsyn",
      "Städning och bortforsling efter avslutat arbete",
    ],
    faqs: [
      {
        question: "Vilken isolering ger mest?",
        answer:
          "Vindsbjälklaget är oftast mest lönsamt eftersom varm luft stiger. Därefter kommer fasad och grund. Vi bedömer din byggnad och föreslår den mest lönsamma ordningen.",
      },
      {
        question: "Finns det risk för fuktproblem?",
        answer:
          "Felaktigt utförd isolering kan ge fukt. Därför arbetar vi alltid med rätt ångspärr och ventilation, så att konstruktionen håller sig torr efteråt.",
      },
    ],
    related: ["energieffektivisering", "takrenovering", "fasadrenovering"],
  },
  {
    slug: "fonsterbyte",
    title: "Fönsterbyte och energiglas",
    shortTitle: "Fönsterbyte",
    tagline: "Nya energifönster stoppar drag, sänker ljudet och kapar värmeförlusten.",
    icon: "🪟",
    metaTitle: "Fönsterbyte i Stockholm – energifönster | Gröna Byggnader",
    metaDescription:
      "Fönsterbyte med moderna energifönster som minskar värmeförlust och drag. Lägre uppvärmningskostnad, bättre ljudisolering och högre komfort – med ROT.",
    intro:
      "Gamla fönster är en av de vanligaste källorna till drag och värmeförlust. Moderna energifönster med två- eller treglas och lågemissionsglas släpper ut betydligt mindre värme, dämpar buller och tar bort den kalla draghud man känner intill äldre fönster. Vi hjälper dig välja rätt nivå – ibland räcker det att byta glas eller komplettera, ibland lönar sig ett helt byte.",
    problem:
      "Enkel- och äldre tvåglasfönster har ett högt U-värde, vilket betyder att mycket värme passerar rakt igenom. Det leder till drag, kallras, kondens och onödigt höga uppvärmningskostnader.",
    approach: [
      "Genomgång av befintliga fönster och deras skick",
      "Rådgivning om byte, glasbyte eller komplettering – det som lönar sig bäst",
      "Val av energiglas med lågt U-värde och bra ljuddämpning",
      "Fackmässig montering med korrekt tätning och drevning",
    ],
    benefits: [
      {
        stat: "Lägre",
        label: "U-värde",
        description:
          "Moderna energifönster har ett betydligt lägre U-värde än gamla fönster – mindre värme passerar ut.",
      },
      {
        stat: "Mindre",
        label: "drag och kallras",
        description:
          "Du kan sitta nära fönstret utan att känna den kalla luften som äldre fönster ger.",
      },
      {
        stat: "Bättre",
        label: "ljudisolering",
        description:
          "Energiglas dämpar trafikbuller och gör inomhusmiljön lugnare.",
      },
    ],
    includes: [
      "Besiktning av befintliga fönster",
      "Rådgivning kring byte vs. renovering",
      "Leverans av energifönster",
      "Demontering och fackmässig montering",
      "Tätning, drevning och efterlagning",
    ],
    faqs: [
      {
        question: "Måste jag byta alla fönster samtidigt?",
        answer:
          "Nej. Vi prioriterar de fönster som läcker mest – ofta mot norr och i de mest använda rummen – och kan göra bytet etappvis om det passar bättre ekonomiskt.",
      },
      {
        question: "Lönar sig fönsterbyte rent ekonomiskt?",
        answer:
          "Fönsterbyte har längre återbetalningstid än t.ex. vindsisolering, men ger samtidigt komfort, ljuddämpning och ett lyft för fasaden. Vi är ärliga med kalkylen så att du kan väga nyttan mot kostnaden.",
      },
    ],
    related: ["energieffektivisering", "fasadrenovering", "tillaggsisolering"],
  },
  {
    slug: "fasadrenovering",
    title: "Fasadrenovering",
    shortTitle: "Fasadrenovering",
    tagline: "Skydda, försköna och energieffektivisera – allt i ett grepp.",
    icon: "🏢",
    metaTitle: "Fasadrenovering i Stockholm | Gröna Byggnader",
    metaDescription:
      "Fasadrenovering som skyddar mot fukt, lyfter utseendet och kan kombineras med tilläggsisolering för lägre energiförbrukning. Vi hjälper hela vägen.",
    intro:
      "Fasaden är fastighetens skydd mot väder och vind – och dess ansikte utåt. En sliten fasad med sprickor, frostskador eller flagnande puts släpper in fukt och drar ner både värde och energiprestanda. När vi ändå arbetar med fasaden är det ofta läge att kombinera renoveringen med tilläggsisolering, så att du får både ett tätare klimatskal och en fasad som håller i decennier.",
    problem:
      "Sprickor, fukt och frostskador i fasaden leder till köldbryggor, fuktinträngning och på sikt dyra följdskador i konstruktionen. En fasad som inte underhålls åldras snabbt.",
    approach: [
      "Besiktning av fasadens skick och fuktstatus",
      "Förslag på puts, skivor eller beklädnad utifrån byggnadens stil och behov",
      "Möjlighet att kombinera med utvändig tilläggsisolering",
      "Hantering av ställning, väderskydd och kringarbeten",
    ],
    benefits: [
      {
        stat: "Tätare",
        label: "klimatskal",
        description:
          "Kombinerar du fasadrenovering med isolering minskar värmeförlusten genom väggarna märkbart.",
      },
      {
        stat: "Längre",
        label: "livslängd",
        description:
          "En korrekt renoverad fasad skyddar konstruktionen och skjuter upp nästa stora underhåll med många år.",
      },
      {
        stat: "Högre",
        label: "fastighetsvärde",
        description:
          "En fräsch, välunderhållen fasad höjer både intryck och marknadsvärde.",
      },
    ],
    includes: [
      "Fasadbesiktning och fuktanalys",
      "Materialförslag och färgsättning",
      "Ev. utvändig tilläggsisolering",
      "Putslagning, omputsning eller ny beklädnad",
      "Ställning, väderskydd och slutstädning",
    ],
    faqs: [
      {
        question: "Kan ni isolera fasaden samtidigt?",
        answer:
          "Ja, och det är ofta klokt. När ställningen ändå är på plats kan utvändig tilläggsisolering läggas till en lägre marginalkostnad och ge stor energieffekt.",
      },
      {
        question: "Hur vet jag om fasaden behöver renoveras?",
        answer:
          "Sprickor, bommande puts, fuktfläckar, frostskador och flagnande färg är tydliga tecken. Vi gör en besiktning och ger en rak bedömning av vad som behöver göras nu och vad som kan vänta.",
      },
    ],
    related: ["tillaggsisolering", "fonsterbyte", "takrenovering"],
  },
  {
    slug: "takrenovering",
    title: "Takrenovering",
    shortTitle: "Takrenovering",
    tagline: "Ett tätt tak skyddar hela investeringen – och din vindsisolering.",
    icon: "🏠",
    metaTitle: "Takrenovering i Stockholm | Gröna Byggnader",
    metaDescription:
      "Takrenovering och takbyte som skyddar fastigheten mot fukt och läckage. Kombineras gärna med vindsisolering för lägre energiförbrukning.",
    intro:
      "Taket är fastighetens första försvar mot väder. Ett uttjänt tak med trasiga pannor, rostande plåt eller dålig tätning släpper in fukt som snabbt skadar konstruktion och isolering. Vi renoverar och byter tak med rätt material för byggnaden och passar gärna på att se över vindsisolering och ventilation samtidigt – två åtgärder som hör ihop.",
    problem:
      "Ett läckande eller uttjänt tak leder till fuktskador, mögel och förstörd isolering. Skadorna syns ofta sent, och då har följdkostnaderna redan hunnit växa.",
    approach: [
      "Takbesiktning av ytskikt, underlagstäckning och tätningar",
      "Materialval – tegel, betongpannor eller plåt efter behov och stil",
      "Översyn av vindsisolering och ventilation i samma veva",
      "Säkert genomförande med ställning och fallskydd",
    ],
    benefits: [
      {
        stat: "Tätt",
        label: "mot fukt",
        description:
          "Ett nytt, korrekt lagt tak stoppar läckage och skyddar konstruktion och isolering.",
      },
      {
        stat: "Smart",
        label: "att kombinera",
        description:
          "När taket ändå öppnas är det rätt läge att förbättra vindsisolering och ventilation.",
      },
      {
        stat: "Decennier",
        label: "av trygghet",
        description:
          "Ett fackmässigt utfört tak håller i många år och ger ett lägre underhållsbehov.",
      },
    ],
    includes: [
      "Takbesiktning och statusbedömning",
      "Materialförslag och kalkyl",
      "Rivning och bortforsling av gammalt taktäckningsmaterial",
      "Ny underlagstäckning och taktäckning",
      "Ev. förbättrad vindsisolering och ventilation",
    ],
    faqs: [
      {
        question: "Hur länge håller ett nytt tak?",
        answer:
          "Det beror på material och underhåll, men ett fackmässigt utfört tak håller normalt i decennier. Vi går igenom förväntad livslängd för de alternativ vi föreslår.",
      },
      {
        question: "Bör jag isolera vinden samtidigt?",
        answer:
          "Ofta ja. Tilläggsisolering av vinden är en av de mest lönsamma energiåtgärderna, och det är enklast och billigast att göra när taket ändå renoveras.",
      },
    ],
    related: ["tillaggsisolering", "fasadrenovering", "energieffektivisering"],
  },
  {
    slug: "varmesystem-och-varmepump",
    title: "Värmesystem och värmepump",
    shortTitle: "Värmesystem & värmepump",
    tagline: "Byt ut den dyra uppvärmningen mot en modern, energieffektiv värmekälla.",
    icon: "♨️",
    metaTitle: "Värmepump & värmesystem i Stockholm | Gröna Byggnader",
    metaDescription:
      "Modern värmepump och optimerat värmesystem som sänker uppvärmningskostnaden kraftigt. Vi dimensionerar rätt och installerar fackmässigt – med ROT.",
    intro:
      "Hur du värmer din fastighet är ofta den enskilt största posten på energiräkningen. Att byta från direktverkande el eller en gammal panna till en rätt dimensionerad värmepump kan sänka uppvärmningskostnaden dramatiskt. Vi hjälper dig välja rätt teknik – berg-, frånlufts- eller luft/vattenvärmepump – och ser till att hela systemet, inklusive styrning och radiatorer, samspelar.",
    problem:
      "Direktverkande el och äldre pannor är dyra och energikrävande. Ett feldimensionerat system kostar onödigt mycket även med ny utrustning – tekniken måste matcha byggnadens faktiska behov.",
    approach: [
      "Analys av nuvarande uppvärmning och energibehov",
      "Val av värmepumpstyp och dimensionering efter byggnaden",
      "Optimering av radiatorer, golvvärme och styrning",
      "Fackmässig installation och injustering av hela systemet",
    ],
    benefits: [
      {
        stat: "Upp till 50–75 %",
        label: "lägre uppvärmningskostnad",
        description:
          "Byte från direktel till en rätt dimensionerad värmepump kan sänka uppvärmningskostnaden kraftigt.",
      },
      {
        stat: "Jämnare",
        label: "värme",
        description:
          "Modern styrning ger en behaglig, stabil temperatur utan kalla perioder.",
      },
      {
        stat: "Lägre",
        label: "klimatavtryck",
        description:
          "Mindre köpt energi innebär ett mindre klimatavtryck för fastigheten.",
      },
    ],
    includes: [
      "Behovsanalys och dimensionering",
      "Val av värmepumpstyp (berg/frånluft/luft-vatten)",
      "Installation och inkoppling",
      "Injustering av värmesystem och styrning",
      "Hjälp med ROT-avdrag och eventuella bidrag",
    ],
    faqs: [
      {
        question: "Vilken värmepump passar min fastighet?",
        answer:
          "Det beror på byggnadens storlek, energibehov, befintligt system och förutsättningar för borrhål. Vi gör en analys och rekommenderar den lösning som ger bäst ekonomi och komfort.",
      },
      {
        question: "Räcker en värmepump ensam?",
        answer:
          "För bästa resultat samverkar värmepumpen med ett tätt klimatskal. Vi tittar gärna på helheten – ibland ger isolering plus rätt värmepump mer än någon enskild åtgärd.",
      },
    ],
    related: ["energieffektivisering", "tillaggsisolering", "rot-renovering"],
  },
  {
    slug: "rot-renovering",
    title: "ROT-renovering",
    shortTitle: "ROT-renovering",
    tagline: "Kvalitetsrenovering med ROT-avdrag – från enskild åtgärd till totalrenovering.",
    icon: "🔨",
    metaTitle: "ROT-renovering i Stockholm | Gröna Byggnader",
    metaDescription:
      "ROT-renovering i Stockholm med tydlig kalkyl och hantverk i fokus. Vi sköter ROT-avdraget åt dig och bygger med fokus på kvalitet och energi.",
    intro:
      "Vi utför kvalitetsrenoveringar med ROT-avdrag – från enskilda åtgärder till större ombyggnationer. Som energiinriktat byggföretag tänker vi alltid ett steg längre: när vi ändå river, bygger och bygger om passar vi på att förbättra isolering, täthet och installationer, så att renoveringen både blir snygg och sänker dina driftkostnader. Vi sköter ROT-avdraget åt dig och håller en tydlig, transparent kalkyl genom hela projektet.",
    problem:
      "Renoveringsprojekt spårar lätt ur i kostnad och tid när ansvaret är uppdelat på många aktörer. Och en renovering som bara byter ytskikt missar chansen att förbättra fastighetens energi och täthet.",
    approach: [
      "Genomgång av önskemål, budget och fastighetens skick",
      "Tydlig offert och tidsplan med ROT-avdraget inräknat",
      "En ansvarig kontakt genom hela projektet",
      "Energi- och täthetsförbättringar inbyggda där det är möjligt",
    ],
    benefits: [
      {
        stat: "30 %",
        label: "ROT-avdrag på arbetskostnaden",
        description:
          "Du betalar bara 70 % av arbetskostnaden – vi drar av ROT direkt på fakturan.",
      },
      {
        stat: "En",
        label: "ansvarig partner",
        description:
          "Du slipper samordna flera hantverkare – vi håller ihop hela projektet.",
      },
      {
        stat: "Smartare",
        label: "renovering",
        description:
          "Vi bygger in energiförbättringar så att renoveringen ger värde långt efter att den är klar.",
      },
    ],
    includes: [
      "Behovsgenomgång och rådgivning",
      "Offert och tidsplan med ROT inräknat",
      "Hantverk inom bygg, ytskikt och installationer",
      "Energi- och täthetsförbättringar där det passar",
      "Vi hanterar ROT-avdraget mot Skatteverket",
    ],
    faqs: [
      {
        question: "Hur fungerar ROT-avdraget hos er?",
        answer:
          "Vi drar av ROT direkt på fakturan, så att du bara betalar nettobeloppet. Sedan begär vi ersättningen från Skatteverket. Läs mer på vår ROT-avdragssida.",
      },
      {
        question: "Tar ni både små och stora projekt?",
        answer:
          "Ja. Vi gör allt från enskilda åtgärder, som ett fönsterbyte, till större ombyggnationer och totalrenoveringar. Hör av dig så hittar vi rätt upplägg.",
      },
    ],
    related: ["energieffektivisering", "varmesystem-och-varmepump", "fasadrenovering"],
  },
];

/** Hjälp: hämta en tjänst på slug. */
export function getService(slug: string): Service | undefined {
  return services.find((s) => s.slug === slug);
}

/* ─────────────────────────────── USP-kort (start) ───────────────────────── */

export type Usp = {
  title: string;
  description: string;
  icon: string;
};

export const usps: Usp[] = [
  {
    title: "Energi i fokus – inte bara bygge",
    description:
      "Vi är inte ännu en ROT-firma. Varje projekt utgår från hur vi kan sänka din energiförbrukning och förlänga fastighetens livslängd.",
    icon: "🌱",
  },
  {
    title: "Långsiktigt värde",
    description:
      "Lägre driftkostnad, högre fastighetsvärde och bättre inomhusklimat – vi bygger för åren som kommer, inte bara för stunden.",
    icon: "📈",
  },
  {
    title: "Tydlig kalkyl med ROT",
    description:
      "Transparent offert där ROT-avdraget är inräknat från start. Inga överraskningar – du vet vad du betalar och vad du får.",
    icon: "🧾",
  },
  {
    title: "En ansvarig partner",
    description:
      "Du slipper jonglera flera hantverkare. Vi håller ihop helheten med en kontaktperson genom hela projektet.",
    icon: "🤝",
  },
  {
    title: "Hantverk med garanti",
    description:
      "Fackmässigt utfört arbete, försäkringar och garantier som ger dig trygghet långt efter att vi lämnat platsen.",
    icon: "🛡️",
  },
  {
    title: "Mätbara resultat",
    description:
      "Vi följer upp och mäter, så att den utlovade besparingen blir verklig och inte bara en siffra i en offert.",
    icon: "🎯",
  },
];

/* ─────────────────────────────── Trust-siffror ──────────────────────────── */

export type Stat = {
  value: string;
  label: string;
};

// PLATSHÅLLARE — byt till era egna, ärliga siffror.
export const stats: Stat[] = [
  { value: "[XX]+", label: "genomförda projekt" },
  { value: "30 %", label: "ROT-avdrag på arbetskostnaden" },
  { value: "Upp till 30 %", label: "lägre energianvändning*" },
  { value: "[XX] år", label: "samlad branscherfarenhet" },
];

/* ───────────────────────────────── Projekt ──────────────────────────────── */

export type Project = {
  slug: string;
  title: string;
  /** Typ av fastighet, t.ex. "Flerbostadshus, Stockholm". */
  meta: string;
  /** Kategori-tagg. */
  category: string;
  /** Bild i /public/projekt/ (platshållare ok). */
  image: string;
  imageAlt: string;
  problem: string;
  action: string;
  result: string;
};

// PLATSHÅLLARE – byt ut mot riktiga referensprojekt och bilder när de finns.
export const projects: Project[] = [
  {
    slug: "flerbostadshus-vindsisolering",
    title: "Vindsisolering sänkte värmekostnaden i flerbostadshus",
    meta: "Flerbostadshus, [STADSDEL]",
    category: "Tilläggsisolering",
    image: "/projekt/projekt-1.svg",
    imageAlt: "Flerbostadshus i tegel där vinden tilläggsisolerats",
    problem:
      "Höga uppvärmningskostnader och kalla lägenheter på översta planet i ett äldre flerbostadshus.",
    action:
      "Tilläggsisolering av vindsbjälklaget med korrekt hantering av ventilation och ångspärr.",
    result:
      "Märkbart lägre uppvärmningskostnad och ett jämnare inomhusklimat redan första vintern.",
  },
  {
    slug: "villa-bergvarme",
    title: "Från direktel till bergvärme i 70-talsvilla",
    meta: "Villa, [ORT]",
    category: "Värmepump",
    image: "/projekt/projekt-2.svg",
    imageAlt: "Villa från 1970-talet där bergvärme installerats",
    problem:
      "Dyr, direktverkande eluppvärmning och ojämn värme i en villa från 1970-talet.",
    action:
      "Installation av rätt dimensionerad bergvärmepump samt injustering av radiatorsystemet.",
    result:
      "Kraftigt sänkt uppvärmningskostnad och en stabil, behaglig inomhustemperatur året runt.",
  },
  {
    slug: "fonsterbyte-radhus",
    title: "Energifönster tog bort draget i radhuslänga",
    meta: "Radhus, [STADSDEL]",
    category: "Fönsterbyte",
    image: "/projekt/projekt-3.svg",
    imageAlt: "Radhus med nyinstallerade energifönster",
    problem:
      "Drag, kallras och kondens från uttjänta tvåglasfönster i en radhuslänga.",
    action:
      "Byte till moderna energifönster med lågt U-värde och förbättrad ljudisolering.",
    result:
      "Borta var draget och kallraset – varmare rum, lugnare ljudmiljö och lägre värmeförlust.",
  },
  {
    slug: "fasad-och-isolering",
    title: "Fasadrenovering med utvändig isolering",
    meta: "Bostadsrättsförening, [STADSDEL]",
    category: "Fasadrenovering",
    image: "/projekt/projekt-4.svg",
    imageAlt: "Putsad fasad som renoverats och tilläggsisolerats utvändigt",
    problem:
      "Sprucken, fuktskadad puts och köldbryggor i väggarna hos en bostadsrättsförening.",
    action:
      "Fasadrenovering kombinerad med utvändig tilläggsisolering när ställningen ändå var på plats.",
    result:
      "Tätare klimatskal, fräsch fasad och en investering som både höjde värdet och sänkte energiförbrukningen.",
  },
  {
    slug: "energirenovering-kontor",
    title: "Energirenovering lyfte kontorsfastighetens energiklass",
    meta: "Kommersiell fastighet, [ORT]",
    category: "Energieffektivisering",
    image: "/projekt/projekt-5.svg",
    imageAlt: "Kontorsfastighet som genomgått energirenovering",
    problem:
      "Hög energianvändning och låg energiklass i en äldre kontorsfastighet.",
    action:
      "Paket av åtgärder: tätning, tilläggsisolering, ny styrning och uppdaterad värmekälla.",
    result:
      "Lägre driftkostnad och en höjd energiklass i energideklarationen – ett tydligt värdelyft.",
  },
  {
    slug: "takrenovering-villa",
    title: "Takbyte med förbättrad vindsisolering",
    meta: "Villa, [ORT]",
    category: "Takrenovering",
    image: "/projekt/projekt-6.svg",
    imageAlt: "Villa med nytt tak och förbättrad vindsisolering",
    problem:
      "Uttjänt tak med begynnande läckage och otillräcklig vindsisolering.",
    action:
      "Komplett takbyte med ny underlagstäckning, kombinerat med tilläggsisolering av vinden.",
    result:
      "Tätt tak utan läckagerisk och en betydligt bättre isolerad, varmare byggnad.",
  },
];

/* ─────────────────────────────── Vanliga frågor ─────────────────────────── */

export type Faq = {
  question: string;
  answer: string;
};

export const faqs: Faq[] = [
  {
    question: "Vad är ROT-avdraget och hur mycket kan jag få?",
    answer:
      "ROT-avdraget är en skattereduktion på arbetskostnaden vid renovering, ombyggnad och tillbyggnad. Avdraget är 30 % av arbetskostnaden, upp till 50 000 kr per person och år. Du behöver äga bostaden och ha tillräckligt med skatt att dra avdraget mot. Vi drar av ROT direkt på fakturan – läs mer på vår ROT-avdragssida.",
  },
  {
    question: "Vilka tjänster erbjuder ni?",
    answer:
      "Vi arbetar med energieffektivisering, tilläggsisolering, fönsterbyte, fasadrenovering, takrenovering, värmesystem och värmepumpar samt ROT-renovering. Ofta kombinerar vi flera åtgärder för bästa energi- och kostnadseffekt.",
  },
  {
    question: "Hur mycket kan jag spara på energiåtgärder?",
    answer:
      "Det beror helt på fastighetens utgångsläge och vilka åtgärder som görs. Ett genomtänkt åtgärdspaket kan sänka energianvändningen avsevärt. Vi börjar med en kartläggning och visar uppskattad besparing och återbetalningstid per åtgärd, så att du kan fatta beslut på riktiga siffror.",
  },
  {
    question: "Vilken energiåtgärd lönar sig bäst att börja med?",
    answer:
      "Ofta ger tätning och tilläggsisolering av vinden mest effekt per investerad krona, följt av styrning av värmen. Men det varierar mellan fastigheter. Därför inleder vi alltid med en kartläggning innan vi rekommenderar åtgärder i rätt ordning.",
  },
  {
    question: "Hur får jag en offert?",
    answer:
      "Fyll i kontaktformuläret eller ring oss. Vi bokar in ett besök, går igenom fastigheten och dina mål, och tar fram en tydlig offert där ROT-avdraget är inräknat. Offerten är kostnadsfri och utan förpliktelser.",
  },
  {
    question: "Är ni försäkrade och har ni garantier?",
    answer:
      "Ja. Vi har de försäkringar som krävs och lämnar garanti på vårt arbete. Vad som gäller i ditt specifika projekt framgår av offerten och avtalet. [Specificera era garantier och försäkringar här.]",
  },
  {
    question: "Vilka områden arbetar ni i?",
    answer:
      "Vi är verksamma i Stockholm med omnejd. Är du osäker på om vi tar oss an ditt projekt? Hör av dig så ger vi besked direkt.",
  },
  {
    question: "Vad är en energideklaration och behöver jag en?",
    answer:
      "En energideklaration visar hur mycket energi en byggnad använder och ger förslag på förbättringar. Den krävs bl.a. vid försäljning och för många flerbostadshus. En energirenovering kan höja byggnadens energiklass i deklarationen – läs mer i vår blogg.",
  },
];

/* ─────────────────────────── Certifieringar & garantier ─────────────────── */

// PLATSHÅLLARE — byt till era riktiga certifieringar, medlemskap och försäkringar.
export const certifications: { title: string; description: string; icon: string }[] = [
  {
    title: "[Certifiering / behörighet]",
    description: "[T.ex. behörig installatör, branschcertifiering eller liknande.]",
    icon: "📜",
  },
  {
    title: "[Branschmedlemskap]",
    description: "[T.ex. medlem i relevant bransch- eller kvalitetsorganisation.]",
    icon: "🏅",
  },
  {
    title: "Ansvarsförsäkring",
    description: "Vi har de försäkringar som krävs för trygga byggprojekt. [Specificera.]",
    icon: "🛡️",
  },
  {
    title: "Garanti på arbetet",
    description: "Vi lämnar garanti på utfört arbete. [Specificera villkor och längd.]",
    icon: "✅",
  },
];

/* ─────────────────────────────────── Team ───────────────────────────────── */

export type TeamMember = {
  name: string;
  role: string;
  bio: string;
};

// PLATSHÅLLARE – fyll i namn, roller och presentationer.
export const team: TeamMember[] = [
  {
    name: "[NAMN]",
    role: "Grundare & projektledare",
    bio: "[Kort, personlig presentation – antal år i branschen, vad personen brinner för och hur hen hjälper kunder att fatta rätt beslut för sin fastighet.]",
  },
  {
    name: "[NAMN]",
    role: "Energi- & byggrådgivare",
    bio: "[Kort presentation – kompetensområde och hur personen jobbar med kunderna.]",
  },
  {
    name: "[NAMN]",
    role: "Arbetsledare",
    bio: "[Kort presentation – ansvar på plats och fokus på kvalitet och säkerhet.]",
  },
];
