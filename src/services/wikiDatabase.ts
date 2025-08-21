import { Planet, Alien, Character, Organization, Spaceship, Movie, WikiEntry } from '../types/wiki';

// In-memory database for sci-fi wiki
export class WikiDatabase {
  private planets: Planet[] = [];
  private aliens: Alien[] = [];
  private characters: Character[] = [];
  private organizations: Organization[] = [];
  private spaceships: Spaceship[] = [];
  private movies: Movie[] = [];
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

  // Characters
  addCharacter(character: Character): void {
    this.characters.push(character);
    this.addEntry({
      id: character.id,
      type: 'character',
      title: character.name,
      franchise: character.franchise,
      content: character,
      tags: [character.species || '', character.occupation || '', character.affiliation || ''].filter(Boolean),
      related_entries: [],
      created_at: character.created_at,
      updated_at: character.updated_at
    });
  }

  searchCharacters(query: string, franchise?: string): Character[] {
    const results: Character[] = [];
    const queryLower = query.toLowerCase();
    
    this.characters.forEach(character => {
      if (franchise && character.franchise !== franchise) return;
      
      const searchableText = [
        character.name,
        character.description,
        character.species,
        character.occupation,
        character.affiliation
      ].join(' ').toLowerCase();
      
      if (searchableText.includes(queryLower)) {
        results.push(character);
      }
    });
    
    return results.sort((a, b) => a.name.localeCompare(b.name));
  }

  getAllCharacters(): Character[] {
    return this.characters.slice().sort((a, b) => a.name.localeCompare(b.name));
  }

  // Organizations
  addOrganization(organization: Organization): void {
    this.organizations.push(organization);
    this.addEntry({
      id: organization.id,
      type: 'organization',
      title: organization.name,
      franchise: organization.franchise,
      content: organization,
      tags: [organization.type, organization.leader || ''].filter(Boolean),
      related_entries: [],
      created_at: organization.created_at,
      updated_at: organization.updated_at
    });
  }

  searchOrganizations(query: string, franchise?: string): Organization[] {
    const results: Organization[] = [];
    const queryLower = query.toLowerCase();

    this.organizations.forEach(organization => {
      if (franchise && organization.franchise !== franchise) return;

      const searchableText = [
        organization.name,
        organization.description,
        organization.type,
        organization.leader
      ].join(' ').toLowerCase();

      if (searchableText.includes(queryLower)) {
        results.push(organization);
      }
    });

    return results.sort((a, b) => a.name.localeCompare(b.name));
  }

  getAllOrganizations(): Organization[] {
    return this.organizations.slice().sort((a, b) => a.name.localeCompare(b.name));
  }

  // Spaceships
  addSpaceship(spaceship: Spaceship): void {
    this.spaceships.push(spaceship);
    this.addEntry({
      id: spaceship.id,
      type: 'spaceship',
      title: spaceship.name,
      franchise: spaceship.franchise,
      content: spaceship,
      tags: [spaceship.class || '', spaceship.owner || '', spaceship.operator || ''].filter(Boolean),
      related_entries: [],
      created_at: spaceship.created_at,
      updated_at: spaceship.updated_at
    });
  }

  searchSpaceships(query: string, franchise?: string): Spaceship[] {
    const results: Spaceship[] = [];
    const queryLower = query.toLowerCase();

    this.spaceships.forEach(spaceship => {
      if (franchise && spaceship.franchise !== franchise) return;

      const searchableText = [
        spaceship.name,
        spaceship.description,
        spaceship.class,
        spaceship.owner,
        spaceship.operator
      ].join(' ').toLowerCase();

      if (searchableText.includes(queryLower)) {
        results.push(spaceship);
      }
    });

    return results.sort((a, b) => a.name.localeCompare(b.name));
  }

  getAllSpaceships(): Spaceship[] {
    return this.spaceships.slice().sort((a, b) => a.name.localeCompare(b.name));
  }

  // Movies
  addMovie(movie: Movie): void {
    this.movies.push(movie);
    this.addEntry({
      id: movie.id,
      type: 'movie',
      title: movie.name,
      franchise: movie.franchise,
      content: movie,
      tags: [movie.director || '', movie.release_year?.toString() || ''].filter(Boolean),
      related_entries: [],
      created_at: movie.created_at,
      updated_at: movie.updated_at
    });
  }

    searchMovies(query: string, franchise?: string): Movie[] {
    const results: Movie[] = [];
    const queryLower = query.toLowerCase();

    this.movies.forEach(movie => {
      if (franchise && movie.franchise !== franchise) return;

      const searchableText = [
        movie.name,
        movie.description,
        movie.director,
        movie.release_year?.toString(),
        movie.plot_summary,
        ...(movie.characters || []),
        movie.setting
      ].join(' ').toLowerCase();

      if (searchableText.includes(queryLower)) {
        results.push(movie);
      }
    });

    return results.sort((a, b) => a.name.localeCompare(b.name));
  }

  getAllMovies(): Movie[] {
    return this.movies.slice().sort((a, b) => a.name.localeCompare(b.name));
  }

  // General entries
  private addEntry(entry: WikiEntry): void {
    this.entries.push(entry);
  }

  searchAll(query: string, franchise?: string, type?: 'planet' | 'alien' | 'character' | 'organization' | 'spaceship' | 'movie'): WikiEntry[] {
    const results: WikiEntry[] = [];
    const queryLower = query.toLowerCase();
    
    this.entries.forEach(entry => {
      if (franchise && entry.franchise !== franchise) return;
      if (type && entry.type !== type) return;
      
      const content = entry.content as Planet | Alien | Character | Organization | Spaceship | Movie;
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

    this.addPlanet({
      id: 'lv-426',
      name: 'LV-426 (Acheron)',
      franchise: 'Alien',
      type: 'moon',
      classification: 'Primordial',
      location: 'Zeta II Reticuli system',
      atmosphere: 'Inert, high nitrogen content',
      gravity: '1.1g',
      climate: 'Harsh, volcanic',
      population: 'None (formerly Hadley\'s Hope colony)',
      government: 'None',
      technology_level: 'None',
      notable_features: ['Derelict Engineer spacecraft', 'Xenomorph hive'],
      notable_locations: ['Hadley\'s Hope colony', 'Atmosphere processing station'],
      history: 'Site of the first human encounter with the Xenomorphs. The colony of Hadley\'s Hope was established here and subsequently destroyed by a Xenomorph infestation.',
      first_appearance: 'Alien (1979)',
      description: 'A desolate, primordial moon where the Xenomorph species was first discovered by the crew of the USCSS Nostromo.',
      inhabitants: ['Xenomorphs'],
      created_at: now,
      updated_at: now
    });

    this.addAlien({
      id: 'xenomorph',
      name: 'Xenomorph XX121',
      species: 'Xenomorph',
      franchise: 'Alien',
      home_planet: 'Unknown',
      classification: 'Endoparasitoid',
      physiology: 'Biomechanical appearance, inner pharyngeal jaw, acid blood, chitinous exoskeleton. Varies based on host.',
      lifespan: 'Unknown',
      intelligence_level: 'Cunning predator with observational learning abilities.',
      technology_level: 'None (biological weapons)',
      culture: 'Hive-based society led by a Queen.',
      government: 'Queen-dominated hierarchy',
      language: 'None known',
      notable_abilities: ['Acidic blood', 'Parasitic reproduction', 'Enhanced strength and agility', 'Stealth'],
      weaknesses: ['Fire', 'Extreme cold', 'Vulnerability during chestburster stage'],
      history: 'A highly adaptable and aggressive species encountered by humanity on LV-426. The Weyland-Yutani Corporation has a vested interest in capturing and weaponizing the creature.',
      first_appearance: 'Alien (1979)',
      description: 'The perfect organism. Its structural perfection is matched only by its hostility.',
      notable_individuals: ['The \"Big Chap\"', 'The Queen', 'Grid'],
      created_at: now,
      updated_at: now
    });

    this.addCharacter({
        id: 'ellen-ripley',
        name: 'Ellen Ripley',
        franchise: 'Alien',
        species: 'Human',
        occupation: 'Warrant Officer',
        affiliation: 'Weyland-Yutani Corporation (formerly)',
        status: 'Deceased (cloned as Ripley 8)',
        history: 'The sole survivor of the USCSS Nostromo incident, Ripley became a key figure in the fight against the Xenomorphs. She sacrificed her life to prevent the Weyland-Yutani Corporation from obtaining a Queen embryo.',
        first_appearance: 'Alien (1979)',
        description: 'A resourceful and resilient survivor, Ripley is one of the most iconic figures in the history of science fiction.',
        created_at: now,
        updated_at: now,
    });

    this.addOrganization({
        id: 'weyland-yutani',
        name: 'Weyland-Yutani Corporation',
        franchise: 'Alien',
        type: 'Conglomerate',
        headquarters: 'Earth',
        leader: 'Board of Directors',
        history: 'A powerful and ruthless corporation with a hidden agenda to capture and weaponize the Xenomorph species. They are known for their slogan \"Building Better Worlds\" and their willingness to sacrifice human life for profit.',
        first_appearance: 'Alien (1979)',
        description: 'The primary antagonist of the Alien franchise, the Weyland-Yutani Corporation represents the worst aspects of corporate greed and ambition.',
        created_at: now,
        updated_at: now,
    });

    this.addSpaceship({
        id: 'uscss-nostromo',
        name: 'USCSS Nostromo',
        franchise: 'Alien',
        class: 'M-Class Starfreighter',
        registry: '180924609',
        owner: 'Weyland-Yutani Corporation',
        operator: 'Weyland-Yutani Corporation',
        status: 'Destroyed',
        history: 'A commercial towing vehicle that was diverted to LV-426 to investigate a distress signal. The crew of the Nostromo had the first recorded human encounter with a Xenomorph, which resulted in the destruction of the ship and the loss of all but one crew member.',
        first_appearance: 'Alien (1979)',
        description: 'The iconic spaceship from the first Alien film. The Nostromo\'s dark, industrial corridors and claustrophobic atmosphere set the tone for the entire franchise.',
        created_at: now,
        updated_at: now,
    });

    this.addOrganization({
      id: 'prodigy-corporation',
      name: 'Prodigy Corporation',
      franchise: 'Alien: Earth',
      type: 'Corporation',
      headquarters: 'Prodigy City, New Siam',
      leader: 'Boy Kavalier',
      history: 'A large corporation that operated on Earth during the Corporate Era in the early 22nd century. It was a major player in the development of hybrid technology.',
      first_appearance: 'Alien: Earth (TV series)',
      description: 'A key corporation in the \"Alien: Earth\" TV series, specializing in the development of human-consciousness \"hybrids\".',
      created_at: now,
      updated_at: now,
    });

    this.addAlien({
      id: 'synthetic',
      name: 'Synthetic',
      species: 'Android',
      franchise: 'Alien',
      home_planet: 'Earth',
      classification: 'Artificial person',
      physiology: 'Carbon-fiber skeleton, vat-grown silicon muscles, and a white liquid latex circulatory system.',
      lifespan: 'Effectively immortal with proper maintenance.',
      intelligence_level: 'Advanced AI with heuristic logic drivers.',
      technology_level: 'Highly advanced',
      culture: 'Varies by model and programming. Generally passive and non-threatening.',
      government: 'Owned and operated by corporations and individuals.',
      language: 'Human languages',
      notable_abilities: ['Superhuman strength and speed', 'Vast memory and processing power'],
      weaknesses: ['Vulnerable to hydrostatic shock and explosive damage', 'Can be deactivated by critical damage to the head or chest power cell.'],
      history: 'Bio-mechanical androids designed to be indistinguishable from humans to make interaction more comfortable. They are a common sight throughout the colonized galaxy.',
      first_appearance: 'Alien (1979)',
      description: 'Artificial persons with human-like appearance and superhuman abilities. They are a cornerstone of the workforce in the 22nd century.',
      notable_individuals: ['Ash', 'Bishop', 'Call', 'David', 'Walter'],
      created_at: now,
      updated_at: now
    });

    this.addAlien({
      id: 'cyborg',
      name: 'Cyborg',
      species: 'Human (augmented)',
      franchise: 'Alien: Earth',
      home_planet: 'Earth',
      classification: 'Cybernetically enhanced human',
      physiology: 'A combination of biological and artificial, cybernetic parts.',
      lifespan: 'Varies',
      intelligence_level: 'Human-level',
      technology_level: 'Advanced',
      culture: 'Integrated into human society, but may face prejudice.',
      government: 'Same as humans',
      language: 'Human languages',
      notable_abilities: ['Varies depending on the cybernetic enhancements.'],
      weaknesses: ['Varies depending on the cybernetic enhancements.'],
      history: 'Humans with cybernetic enhancements. The term can be used as an insult.',
      first_appearance: 'Alien: Earth (TV series)',
      description: 'Humans with a combination of biological and artificial, cybernetic parts.',
      notable_individuals: ['Morrow'],
      created_at: now,
      updated_at: now
    });

    this.addMovie({
      id: 'alien-romulus',
      name: 'Alien: Romulus',
      franchise: 'Alien',
      director: 'Fede Álvarez',
      release_year: 2024,
      plot_summary: 'A group of young space colonizers scavenging a derelict space station face a terrifying life-form.',
      characters: ['Rain Carradine', 'Tyler', 'Andy', 'Kay', 'Bjorn', 'Navarro'],
      setting: 'Romulus space station',
      description: 'A standalone film in the Alien franchise, set between the events of Alien (1979) and Aliens (1986).',
      created_at: now,
      updated_at: now,
    });
  }
}

// Singleton instance
export const wikiDB = new WikiDatabase();