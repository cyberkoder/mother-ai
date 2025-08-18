import { Planet, Alien, WikiEntry } from '../types/wiki';

// In-memory database for sci-fi wiki
export class WikiDatabase {
  private planets: Planet[] = [];
  private aliens: Alien[] = [];
  private entries: WikiEntry[] = [];

  constructor() {
    this.initializeSampleData();
  }

  // Planets
  addPlanet(planet: Planet): void {
    this.planets.push(planet);
    this.addEntry({
      id: planet.id,
      type: 'planet',
      title: planet.name,
      franchise: planet.franchise,
      content: planet,
      tags: [planet.type, planet.classification || '', ...planet.notable_features].filter(Boolean),
      related_entries: [],
      created_at: planet.created_at,
      updated_at: planet.updated_at
    });
  }

  searchPlanets(query: string, franchise?: string): Planet[] {
    const results: Planet[] = [];
    const queryLower = query.toLowerCase();
    
    this.planets.forEach(planet => {
      if (franchise && planet.franchise !== franchise) return;
      
      const searchableText = [
        planet.name,
        planet.description,
        planet.classification,
        planet.location,
        ...planet.notable_features,
        ...planet.notable_locations
      ].join(' ').toLowerCase();
      
      if (searchableText.includes(queryLower)) {
        results.push(planet);
      }
    });
    
    return results.sort((a, b) => a.name.localeCompare(b.name));
  }

  getAllPlanets(): Planet[] {
    return this.planets.slice().sort((a, b) => a.name.localeCompare(b.name));
  }

  // Aliens
  addAlien(alien: Alien): void {
    this.aliens.push(alien);
    this.addEntry({
      id: alien.id,
      type: 'alien',
      title: alien.name,
      franchise: alien.franchise,
      content: alien,
      tags: [alien.classification || '', alien.species, ...alien.notable_abilities].filter(Boolean),
      related_entries: [],
      created_at: alien.created_at,
      updated_at: alien.updated_at
    });
  }

  searchAliens(query: string, franchise?: string): Alien[] {
    const results: Alien[] = [];
    const queryLower = query.toLowerCase();
    
    this.aliens.forEach(alien => {
      if (franchise && alien.franchise !== franchise) return;
      
      const searchableText = [
        alien.name,
        alien.species,
        alien.description,
        alien.classification,
        alien.physiology,
        alien.culture,
        ...alien.notable_abilities,
        ...alien.notable_individuals
      ].join(' ').toLowerCase();
      
      if (searchableText.includes(queryLower)) {
        results.push(alien);
      }
    });
    
    return results.sort((a, b) => a.name.localeCompare(b.name));
  }

  getAllAliens(): Alien[] {
    return this.aliens.slice().sort((a, b) => a.name.localeCompare(b.name));
  }

  // General entries
  private addEntry(entry: WikiEntry): void {
    this.entries.push(entry);
  }

  searchAll(query: string, franchise?: string, type?: 'planet' | 'alien'): WikiEntry[] {
    const results: WikiEntry[] = [];
    const queryLower = query.toLowerCase();
    
    this.entries.forEach(entry => {
      if (franchise && entry.franchise !== franchise) return;
      if (type && entry.type !== type) return;
      
      const content = entry.content as Planet | Alien;
      const searchableText = [
        entry.title,
        content.description,
        ...entry.tags
      ].join(' ').toLowerCase();
      
      if (searchableText.includes(queryLower)) {
        results.push(entry);
      }
    });
    
    return results.sort((a, b) => a.title.localeCompare(b.title));
  }

  private initializeSampleData(): void {
    const now = new Date().toISOString();

    // Sample planets
    this.addPlanet({
      id: 'tatooine',
      name: 'Tatooine',
      franchise: 'Star Wars',
      type: 'planet',
      classification: 'Desert world',
      location: 'Outer Rim Territories',
      atmosphere: 'Breathable, arid',
      gravity: '1.0 standard',
      climate: 'Arid desert',
      population: 'Sparse settlements',
      government: 'Hutt crime syndicate control',
      technology_level: 'Low to moderate',
      notable_features: ['Twin suns', 'Moisture farming', 'Podracing', 'Sarlacc pits'],
      notable_locations: ['Mos Eisley Cantina', 'Jabba\'s Palace', 'Lars homestead', 'Beggar\'s Canyon'],
      history: 'Remote desert world that served as hideout for Luke Skywalker and later Obi-Wan Kenobi.',
      first_appearance: 'A New Hope (1977)',
      description: 'A harsh desert world orbiting twin suns in the galaxy\'s Outer Rim. Despite its remote location, Tatooine has played a crucial role in galactic history.',
      inhabitants: ['Jawas', 'Tusken Raiders', 'Human settlers'],
      created_at: now,
      updated_at: now
    });

    this.addPlanet({
      id: 'vulcan',
      name: 'Vulcan',
      franchise: 'Star Trek',
      type: 'planet',
      classification: 'M-class',
      location: '40 Eridani system',
      atmosphere: 'Oxygen-nitrogen, thin',
      gravity: '1.4 Earth standard',
      climate: 'Hot, arid',
      population: '6 billion Vulcans',
      government: 'Vulcan High Command',
      technology_level: 'Highly advanced',
      notable_features: ['Forge of Surak', 'Mount Seleya', 'Vulcan Academy of Sciences'],
      notable_locations: ['ShiKahr', 'T\'Paal', 'Vulcana Regar'],
      history: 'Home world of the Vulcan species, founding member of the United Federation of Planets.',
      first_appearance: 'Star Trek: The Original Series',
      description: 'The desert home world of the logical Vulcan species, known for its harsh climate and ancient philosophy of emotional suppression.',
      inhabitants: ['Vulcans'],
      created_at: now,
      updated_at: now
    });

    // Sample aliens
    this.addAlien({
      id: 'xenomorph',
      name: 'Xenomorph',
      species: 'Xenomorph XX121',
      franchise: 'Alien',
      home_planet: 'LV-426 (Acheron)',
      classification: 'Endoparasitoid',
      physiology: 'Biomechanical appearance, inner pharyngeal jaw, acid blood, chitinous exoskeleton',
      lifespan: 'Unknown, potentially decades',
      intelligence_level: 'Cunning predator intelligence',
      technology_level: 'None (biological weapons)',
      culture: 'Hive-minded, reproduction-focused',
      government: 'Queen-dominated hierarchy',
      language: 'None known',
      notable_abilities: ['Perfect organism', 'Acid blood', 'Face-hugger reproduction', 'Rapid adaptation'],
      weaknesses: ['Fire', 'Explosive decompression', 'Extreme cold'],
      history: 'Engineered by Engineers as biological weapon, encountered by Nostromo crew.',
      first_appearance: 'Alien (1979)',
      description: 'The perfect organism - a highly aggressive endoparasitoid with no known conscience, remorse or delusions of morality.',
      notable_individuals: ['Big Chap', 'Queen', 'Drone', 'Warrior'],
      created_at: now,
      updated_at: now
    });

    this.addAlien({
      id: 'klingon',
      name: 'Klingon',
      species: 'Klingon',
      franchise: 'Star Trek',
      home_planet: 'Qo\'noS (Kronos)',
      classification: 'Humanoid',
      physiology: 'Ridged forehead, redundant organs, enhanced strength',
      lifespan: '150+ years',
      intelligence_level: 'High intelligence, warrior culture',
      technology_level: 'Advanced starfaring civilization',
      culture: 'Honor-based warrior society',
      government: 'Klingon Empire',
      language: 'Klingon (tlhIngan Hol)',
      notable_abilities: ['Enhanced strength', 'Redundant organs', 'Superior combat skills'],
      weaknesses: ['Pride', 'Ritualistic behavior'],
      history: 'Ancient warrior race, alternately allies and enemies of the Federation.',
      first_appearance: 'Star Trek: The Original Series',
      description: 'A proud warrior race known throughout the galaxy for their aggressive nature and strict honor code.',
      notable_individuals: ['Worf', 'Kahless', 'Gowron', 'Martok'],
      created_at: now,
      updated_at: now
    });
  }
}

// Singleton instance
export const wikiDB = new WikiDatabase();