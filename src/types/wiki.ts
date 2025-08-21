export interface Planet {
    id: string;
    name: string;
    franchise: string;
    type: "planet" | "moon" | "asteroid" | "space_station" | "artificial";
    classification?: string;
    location?: string;
    atmosphere?: string;
    gravity?: string;
    climate?: string;
    population?: string;
    government?: string;
    technology_level?: string;
    notable_features: string[];
    notable_locations: string[];
    history?: string;
    first_appearance?: string;
    description: string;
    inhabitants: string[];
    created_at: string;
    updated_at: string;
}

export interface Alien {
    id: string;
    name: string;
    species: string;
    franchise: string;
    home_planet?: string;
    classification?: string;
    physiology?: string;
    lifespan?: string;
    intelligence_level?: string;
    technology_level?: string;
    culture?: string;
    government?: string;
    language?: string;
    notable_abilities: string[];
    weaknesses?: string[];
    history?: string;
    first_appearance?: string;
    description: string;
    notable_individuals: string[];
    created_at: string;
    updated_at: string;
}

export interface Character {
    id: string;
    name: string;
    franchise: string;
    species?: string;
    occupation?: string;
    affiliation?: string;
    status?: string;
    history?: string;
    first_appearance?: string;
    description: string;
    created_at: string;
    updated_at: string;
}

export interface Organization {
    id: string;
    name: string;
    franchise: string;
    type: string;
    headquarters?: string;
    leader?: string;
    history?: string;
    first_appearance?: string;
    description: string;
    created_at: string;
    updated_at: string;
}

export interface Spaceship {
    id: string;
    name: string;
    franchise: string;
    class?: string;
    registry?: string;
    owner?: string;
    operator?: string;
    status?: string;
    history?: string;
    first_appearance?: string;
    description: string;
    created_at: string;
    updated_at: string;
}

export interface Movie {
    id: string;
    name: string;
    franchise: string;
    director?: string;
    release_year?: number;
    plot_summary?: string;
    characters?: string[];
    setting?: string;
    description: string;
    created_at: string;
    updated_at: string;
}

export interface WikiEntry {
    id: string;
    type:
        | "planet"
        | "alien"
        | "character"
        | "organization"
        | "spaceship"
        | "movie"
        | "book";
    title: string;
    franchise: string;
    content: Planet | Alien | Character | Organization | Spaceship | Movie;
    tags: string[];
    related_entries: string[];
    created_at: string;
    updated_at: string;
}

export interface GenerationRequest {
    type:
        | "planet"
        | "alien"
        | "character"
        | "organization"
        | "spaceship"
        | "movie";
    name: string;
    franchise?: string;
    context?: string;
    detailed?: boolean;
}
