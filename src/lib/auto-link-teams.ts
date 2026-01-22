// Auto-link team names in news content for SEO internal linking
// Maps team names to their page URLs

// Team name to URL mapping
// Format: { teamName: { league: 'league-slug', slug: 'team-slug' } }
const TEAM_MAPPINGS: Record<string, { league: string; slug: string }> = {
  // Premier League
  'Arsenal': { league: 'premier-league', slug: 'arsenal' },
  'Aston Villa': { league: 'premier-league', slug: 'aston-villa' },
  'Bournemouth': { league: 'premier-league', slug: 'bournemouth' },
  'Brentford': { league: 'premier-league', slug: 'brentford' },
  'Brighton': { league: 'premier-league', slug: 'brighton' },
  'Brighton & Hove Albion': { league: 'premier-league', slug: 'brighton' },
  'Chelsea': { league: 'premier-league', slug: 'chelsea' },
  'Crystal Palace': { league: 'premier-league', slug: 'crystal-palace' },
  'Everton': { league: 'premier-league', slug: 'everton' },
  'Fulham': { league: 'premier-league', slug: 'fulham' },
  'Ipswich': { league: 'premier-league', slug: 'ipswich' },
  'Ipswich Town': { league: 'premier-league', slug: 'ipswich' },
  'Leicester': { league: 'premier-league', slug: 'leicester' },
  'Leicester City': { league: 'premier-league', slug: 'leicester' },
  'Liverpool': { league: 'premier-league', slug: 'liverpool' },
  'Manchester City': { league: 'premier-league', slug: 'manchester-city' },
  'Man City': { league: 'premier-league', slug: 'manchester-city' },
  'Manchester United': { league: 'premier-league', slug: 'manchester-united' },
  'Man United': { league: 'premier-league', slug: 'manchester-united' },
  'Man Utd': { league: 'premier-league', slug: 'manchester-united' },
  'Newcastle': { league: 'premier-league', slug: 'newcastle' },
  'Newcastle United': { league: 'premier-league', slug: 'newcastle' },
  'Nottingham Forest': { league: 'premier-league', slug: 'nottingham-forest' },
  "Nott'm Forest": { league: 'premier-league', slug: 'nottingham-forest' },
  'Southampton': { league: 'premier-league', slug: 'southampton' },
  'Tottenham': { league: 'premier-league', slug: 'tottenham' },
  'Tottenham Hotspur': { league: 'premier-league', slug: 'tottenham' },
  'Spurs': { league: 'premier-league', slug: 'tottenham' },
  'West Ham': { league: 'premier-league', slug: 'west-ham' },
  'West Ham United': { league: 'premier-league', slug: 'west-ham' },
  'Wolves': { league: 'premier-league', slug: 'wolves' },
  'Wolverhampton': { league: 'premier-league', slug: 'wolves' },
  'Wolverhampton Wanderers': { league: 'premier-league', slug: 'wolves' },

  // La Liga
  'Real Madrid': { league: 'la-liga', slug: 'real-madrid' },
  'Barcelona': { league: 'la-liga', slug: 'barcelona' },
  'FC Barcelona': { league: 'la-liga', slug: 'barcelona' },
  'Atletico Madrid': { league: 'la-liga', slug: 'atletico-madrid' },
  'Atletico de Madrid': { league: 'la-liga', slug: 'atletico-madrid' },
  'Sevilla': { league: 'la-liga', slug: 'sevilla' },
  'Real Betis': { league: 'la-liga', slug: 'real-betis' },
  'Villarreal': { league: 'la-liga', slug: 'villarreal' },
  'Athletic Bilbao': { league: 'la-liga', slug: 'athletic-bilbao' },
  'Athletic Club': { league: 'la-liga', slug: 'athletic-bilbao' },
  'Real Sociedad': { league: 'la-liga', slug: 'real-sociedad' },
  'Valencia': { league: 'la-liga', slug: 'valencia' },
  'Celta Vigo': { league: 'la-liga', slug: 'celta-vigo' },
  'Getafe': { league: 'la-liga', slug: 'getafe' },
  'Osasuna': { league: 'la-liga', slug: 'osasuna' },
  'Mallorca': { league: 'la-liga', slug: 'mallorca' },
  'RCD Mallorca': { league: 'la-liga', slug: 'mallorca' },
  'Girona': { league: 'la-liga', slug: 'girona' },
  'Rayo Vallecano': { league: 'la-liga', slug: 'rayo-vallecano' },
  'Las Palmas': { league: 'la-liga', slug: 'las-palmas' },
  'Alaves': { league: 'la-liga', slug: 'alaves' },
  'Deportivo Alaves': { league: 'la-liga', slug: 'alaves' },
  'Leganes': { league: 'la-liga', slug: 'leganes' },
  'Espanyol': { league: 'la-liga', slug: 'espanyol' },
  'Real Valladolid': { league: 'la-liga', slug: 'real-valladolid' },

  // Bundesliga
  'Bayern Munich': { league: 'bundesliga', slug: 'bayern-munich' },
  'Bayern': { league: 'bundesliga', slug: 'bayern-munich' },
  'FC Bayern': { league: 'bundesliga', slug: 'bayern-munich' },
  'Bayern Munchen': { league: 'bundesliga', slug: 'bayern-munich' },
  'Borussia Dortmund': { league: 'bundesliga', slug: 'borussia-dortmund' },
  'Dortmund': { league: 'bundesliga', slug: 'borussia-dortmund' },
  'BVB': { league: 'bundesliga', slug: 'borussia-dortmund' },
  'RB Leipzig': { league: 'bundesliga', slug: 'rb-leipzig' },
  'Leipzig': { league: 'bundesliga', slug: 'rb-leipzig' },
  'Bayer Leverkusen': { league: 'bundesliga', slug: 'bayer-leverkusen' },
  'Leverkusen': { league: 'bundesliga', slug: 'bayer-leverkusen' },
  'Eintracht Frankfurt': { league: 'bundesliga', slug: 'eintracht-frankfurt' },
  'Frankfurt': { league: 'bundesliga', slug: 'eintracht-frankfurt' },
  'VfB Stuttgart': { league: 'bundesliga', slug: 'vfb-stuttgart' },
  'Stuttgart': { league: 'bundesliga', slug: 'vfb-stuttgart' },
  'Freiburg': { league: 'bundesliga', slug: 'freiburg' },
  'SC Freiburg': { league: 'bundesliga', slug: 'freiburg' },
  'Union Berlin': { league: 'bundesliga', slug: 'union-berlin' },
  'Wolfsburg': { league: 'bundesliga', slug: 'wolfsburg' },
  'VfL Wolfsburg': { league: 'bundesliga', slug: 'wolfsburg' },
  'Mainz': { league: 'bundesliga', slug: 'mainz' },
  'Mainz 05': { league: 'bundesliga', slug: 'mainz' },
  'Borussia Monchengladbach': { league: 'bundesliga', slug: 'borussia-monchengladbach' },
  'Gladbach': { league: 'bundesliga', slug: 'borussia-monchengladbach' },
  'Monchengladbach': { league: 'bundesliga', slug: 'borussia-monchengladbach' },
  'Werder Bremen': { league: 'bundesliga', slug: 'werder-bremen' },
  'Bremen': { league: 'bundesliga', slug: 'werder-bremen' },
  'Hoffenheim': { league: 'bundesliga', slug: 'hoffenheim' },
  'TSG Hoffenheim': { league: 'bundesliga', slug: 'hoffenheim' },
  'Augsburg': { league: 'bundesliga', slug: 'augsburg' },
  'FC Augsburg': { league: 'bundesliga', slug: 'augsburg' },
  'Heidenheim': { league: 'bundesliga', slug: 'heidenheim' },
  'Bochum': { league: 'bundesliga', slug: 'bochum' },
  'VfL Bochum': { league: 'bundesliga', slug: 'bochum' },
  'Holstein Kiel': { league: 'bundesliga', slug: 'holstein-kiel' },
  'Kiel': { league: 'bundesliga', slug: 'holstein-kiel' },
  'St. Pauli': { league: 'bundesliga', slug: 'st-pauli' },
  'FC St. Pauli': { league: 'bundesliga', slug: 'st-pauli' },

  // Serie A
  'Inter Milan': { league: 'serie-a', slug: 'inter-milan' },
  'Inter': { league: 'serie-a', slug: 'inter-milan' },
  'Internazionale': { league: 'serie-a', slug: 'inter-milan' },
  'AC Milan': { league: 'serie-a', slug: 'ac-milan' },
  'Milan': { league: 'serie-a', slug: 'ac-milan' },
  'Juventus': { league: 'serie-a', slug: 'juventus' },
  'Juve': { league: 'serie-a', slug: 'juventus' },
  'Napoli': { league: 'serie-a', slug: 'napoli' },
  'SSC Napoli': { league: 'serie-a', slug: 'napoli' },
  'Roma': { league: 'serie-a', slug: 'roma' },
  'AS Roma': { league: 'serie-a', slug: 'roma' },
  'Lazio': { league: 'serie-a', slug: 'lazio' },
  'SS Lazio': { league: 'serie-a', slug: 'lazio' },
  'Atalanta': { league: 'serie-a', slug: 'atalanta' },
  'Fiorentina': { league: 'serie-a', slug: 'fiorentina' },
  'ACF Fiorentina': { league: 'serie-a', slug: 'fiorentina' },
  'Bologna': { league: 'serie-a', slug: 'bologna' },
  'Torino': { league: 'serie-a', slug: 'torino' },
  'Udinese': { league: 'serie-a', slug: 'udinese' },
  'Genoa': { league: 'serie-a', slug: 'genoa' },
  'Monza': { league: 'serie-a', slug: 'monza' },
  'Empoli': { league: 'serie-a', slug: 'empoli' },
  'Cagliari': { league: 'serie-a', slug: 'cagliari' },
  'Parma': { league: 'serie-a', slug: 'parma' },
  'Lecce': { league: 'serie-a', slug: 'lecce' },
  'Como': { league: 'serie-a', slug: 'como' },
  'Verona': { league: 'serie-a', slug: 'verona' },
  'Hellas Verona': { league: 'serie-a', slug: 'verona' },
  'Venezia': { league: 'serie-a', slug: 'venezia' },

  // Ligue 1
  'Paris Saint-Germain': { league: 'ligue-1', slug: 'paris-saint-germain' },
  'PSG': { league: 'ligue-1', slug: 'paris-saint-germain' },
  'Marseille': { league: 'ligue-1', slug: 'marseille' },
  'Olympique Marseille': { league: 'ligue-1', slug: 'marseille' },
  'OM': { league: 'ligue-1', slug: 'marseille' },
  'Monaco': { league: 'ligue-1', slug: 'monaco' },
  'AS Monaco': { league: 'ligue-1', slug: 'monaco' },
  'Lyon': { league: 'ligue-1', slug: 'lyon' },
  'Olympique Lyon': { league: 'ligue-1', slug: 'lyon' },
  'Olympique Lyonnais': { league: 'ligue-1', slug: 'lyon' },
  'Lille': { league: 'ligue-1', slug: 'lille' },
  'LOSC Lille': { league: 'ligue-1', slug: 'lille' },
  'Nice': { league: 'ligue-1', slug: 'nice' },
  'OGC Nice': { league: 'ligue-1', slug: 'nice' },
  'Lens': { league: 'ligue-1', slug: 'lens' },
  'RC Lens': { league: 'ligue-1', slug: 'lens' },
  'Rennes': { league: 'ligue-1', slug: 'rennes' },
  'Stade Rennais': { league: 'ligue-1', slug: 'rennes' },
  'Strasbourg': { league: 'ligue-1', slug: 'strasbourg' },
  'RC Strasbourg': { league: 'ligue-1', slug: 'strasbourg' },
  'Toulouse': { league: 'ligue-1', slug: 'toulouse' },
  'Brest': { league: 'ligue-1', slug: 'brest' },
  'Stade Brestois': { league: 'ligue-1', slug: 'brest' },
  'Reims': { league: 'ligue-1', slug: 'reims' },
  'Stade de Reims': { league: 'ligue-1', slug: 'reims' },
  'Nantes': { league: 'ligue-1', slug: 'nantes' },
  'FC Nantes': { league: 'ligue-1', slug: 'nantes' },
  'Montpellier': { league: 'ligue-1', slug: 'montpellier' },
  'Le Havre': { league: 'ligue-1', slug: 'le-havre' },
  'Auxerre': { league: 'ligue-1', slug: 'auxerre' },
  'AJ Auxerre': { league: 'ligue-1', slug: 'auxerre' },
  'Angers': { league: 'ligue-1', slug: 'angers' },
  'Saint-Etienne': { league: 'ligue-1', slug: 'saint-etienne' },
  'St Etienne': { league: 'ligue-1', slug: 'saint-etienne' },
};

// League name mappings for linking league names
const LEAGUE_MAPPINGS: Record<string, string> = {
  'Premier League': '/leagues/premier-league',
  'English Premier League': '/leagues/premier-league',
  'EPL': '/leagues/premier-league',
  'La Liga': '/leagues/la-liga',
  'Spanish La Liga': '/leagues/la-liga',
  'Bundesliga': '/leagues/bundesliga',
  'German Bundesliga': '/leagues/bundesliga',
  'Serie A': '/leagues/serie-a',
  'Italian Serie A': '/leagues/serie-a',
  'Ligue 1': '/leagues/ligue-1',
  'French Ligue 1': '/leagues/ligue-1',
  'Champions League': '/leagues/champions-league',
  'UEFA Champions League': '/leagues/champions-league',
  'UCL': '/leagues/champions-league',
};

/**
 * Processes HTML content and adds internal links to team and league names
 * @param content - The HTML content to process
 * @param locale - The current locale for generating correct URLs
 * @returns Processed HTML with team/league names linked
 */
export function addTeamLinks(content: string, locale: string = 'en'): string {
  if (!content) return '';

  let processedContent = content;
  const linkedTerms = new Set<string>(); // Track what we've already linked to avoid duplicates

  // Helper to create locale-aware path
  const localePath = (path: string): string => {
    if (locale === 'en') return path;
    return `/${locale}${path}`;
  };

  // Sort team names by length (longest first) to avoid partial matches
  // e.g., "Manchester United" should be matched before "Manchester"
  const sortedTeams = Object.entries(TEAM_MAPPINGS)
    .sort((a, b) => b[0].length - a[0].length);

  // Process teams
  for (const [teamName, { league, slug }] of sortedTeams) {
    // Skip if we've already linked this team (even under a different name)
    const teamKey = `${league}/${slug}`;
    if (linkedTerms.has(teamKey)) continue;

    // Create regex that matches whole words only, case insensitive
    // Avoid matching inside existing HTML tags or links
    const regex = new RegExp(
      `(?<![\\w/"-])${escapeRegex(teamName)}(?![\\w/"-])(?![^<]*>)(?![^<]*</a>)`,
      'gi'
    );

    if (regex.test(processedContent)) {
      const url = localePath(`/leagues/${league}/${slug}`);
      // Only replace the first occurrence to avoid over-linking
      processedContent = processedContent.replace(
        regex,
        (match) => `<a href="${url}" class="team-link text-emerald-400 hover:text-emerald-300 hover:underline">${match}</a>`
      );
      linkedTerms.add(teamKey);
    }
  }

  // Process leagues (sorted by length)
  const sortedLeagues = Object.entries(LEAGUE_MAPPINGS)
    .sort((a, b) => b[0].length - a[0].length);

  for (const [leagueName, path] of sortedLeagues) {
    // Skip if already linked
    if (linkedTerms.has(path)) continue;

    const regex = new RegExp(
      `(?<![\\w/"-])${escapeRegex(leagueName)}(?![\\w/"-])(?![^<]*>)(?![^<]*</a>)`,
      'gi'
    );

    if (regex.test(processedContent)) {
      const url = localePath(path);
      // Only replace the first occurrence
      processedContent = processedContent.replace(
        regex,
        (match) => `<a href="${url}" class="league-link text-cyan-400 hover:text-cyan-300 hover:underline">${match}</a>`
      );
      linkedTerms.add(path);
    }
  }

  return processedContent;
}

/**
 * Escapes special regex characters in a string
 */
function escapeRegex(string: string): string {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

export { TEAM_MAPPINGS, LEAGUE_MAPPINGS };
