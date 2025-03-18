
// Spotify API response types
export interface SpotifySearchResult {
  id: string;
  name: string;
  title?: string; // Some components might expect this field
  type: string;
  uri: string;
  href: string;
  popularity: number;
  duration_ms: number;
  explicit: boolean;
  album: {
    id: string;
    name: string;
    images: { url: string; height: number; width: number }[];
    release_date: string;
  };
  artists: {
    id: string;
    name: string;
    href: string;
  }[];
}

export interface SpotifySearchResponse {
  map(arg0: (val: any, id: any) => any): unknown;
  tracks: {
    items: SpotifySearchResult[];
    total: number;
    limit: number;
    offset: number;
    href: string;
    next: string | null;
    previous: string | null;
  };
}

export interface SpotifySong {
  id: string;
  name: string;
  artist: string;
  album: string;
  duration: number;
  imageUrl: string;
}
