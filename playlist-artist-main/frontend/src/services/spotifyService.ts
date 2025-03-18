
import axios from 'axios';
import { SpotifySearchResult, SpotifySearchResponse } from '@/types/spotify';

// Define base URL for API
const API_URL = import.meta.env.VITE_API_BASE_URL || 'https://music-web-x4uy.onrender.com/api';

// Axios instance with auth headers
const axiosAuth = axios.create({
  baseURL: API_URL,
});

// Add token to requests if available
axiosAuth.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Mock data for development
const MOCK_SEARCH_RESULTS: SpotifySearchResult[] = [
  {
    id: '1',
    name: 'Bohemian Rhapsody',
    type: 'track',
    uri: 'spotify:track:1',
    href: 'https://api.spotify.com/v1/tracks/1',
    popularity: 95,
    duration_ms: 354947,
    explicit: false,
    album: {
      id: '1',
      name: 'A Night at the Opera',
      images: [
        { url: 'https://i.scdn.co/image/ab67616d0000b273e8b066f70c206551210d902b', height: 640, width: 640 }
      ],
      release_date: '1975-11-21'
    },
    artists: [
      { id: '1', name: 'Queen', href: 'https://api.spotify.com/v1/artists/1' }
    ]
  },
  {
    id: '2',
    name: 'Stairway to Heaven',
    type: 'track',
    uri: 'spotify:track:2',
    href: 'https://api.spotify.com/v1/tracks/2',
    popularity: 90,
    duration_ms: 482830,
    explicit: false,
    album: {
      id: '2',
      name: 'Led Zeppelin IV',
      images: [
        { url: 'https://i.scdn.co/image/ab67616d0000b27351c02a77d09dfcd53c8676d0', height: 640, width: 640 }
      ],
      release_date: '1971-11-08'
    },
    artists: [
      { id: '2', name: 'Led Zeppelin', href: 'https://api.spotify.com/v1/artists/2' }
    ]
  },
  {
    id: '3',
    name: 'Imagine',
    type: 'track',
    uri: 'spotify:track:3',
    href: 'https://api.spotify.com/v1/tracks/3',
    popularity: 88,
    duration_ms: 183000,
    explicit: false,
    album: {
      id: '3',
      name: 'Imagine',
      images: [
        { url: 'https://i.scdn.co/image/ab67616d0000b2732c33f23a300c1c6c62e36fd5', height: 640, width: 640 }
      ],
      release_date: '1971-09-09'
    },
    artists: [
      { id: '3', name: 'John Lennon', href: 'https://api.spotify.com/v1/artists/3' }
    ]
  }
];

const transformSpotifySearchResponse = (response: any[]): any[] => {
  return response.map(track => {
    // Example of how to map the fields
    const transformedTrack: any = {
      id: track.id,
      name: track.title,
      type: 'track', // Always 'track' for search results from Spotify search
      uri: track.uri,
      href: `https://api.spotify.com/v1/tracks/${track.id}`,
      popularity: 0, // Spotify API doesn't provide this in search results, can be added later if necessary
      duration_ms: track.duration * 1000, // Convert seconds to milliseconds
      explicit: false, // As this data is not available in the search results, set as false by default
      album: {
        id: track.id, // You can use track.id here, but ideally use the actual album ID if available
        name: track.album ?? "Unknown Album",
        images: track.albumCover
          ? [{ url: track.albumCover, height: 640, width: 640 }] // Just assuming one image size
          : [{ url: "", height: 640, width: 640 }], // Fallback if no album cover
        release_date: "Unknown", // Release date is not available in the search response
      },
      artists: [
        {
          id: "unknown", // If artist ID is not available, set to "unknown"
          name: track.artist,
          href: `https://api.spotify.com/v1/artists/unknown`,
        },
      ],
    };

    return transformedTrack;
  });
};
export const spotifyService = {
  // Search for tracks
  async searchTracks(query: string): Promise<SpotifySearchResult[]> {
    try {
      // if (process.env.NODE_ENV === 'development' && !import.meta.env.VITE_USE_BACKEND) {
      //   return new Promise((resolve) => {
      //     setTimeout(() => {
      //       const filteredResults = MOCK_SEARCH_RESULTS.filter(
      //         track => 
      //           track.name.toLowerCase().includes(query.toLowerCase()) || 
      //           track.artists.some(artist => 
      //             artist.name.toLowerCase().includes(query.toLowerCase())
      //           ) ||
      //           track.album.name.toLowerCase().includes(query.toLowerCase())
      //       );
      //       console.log("filteredResults:",filteredResults)
      //       resolve(filteredResults);
      //     }, 800);
      //   });
      // }

      const response = await axiosAuth.get<SpotifySearchResponse>('/spotify/search', {
        params: { query: query, type: 'track', limit: 20 }
      });
      
        console.log("Transformed Response:",response?.data)
        const transformedData = transformSpotifySearchResponse(response?.data);

      return transformedData;
    } catch (error) {
      console.error('Search tracks error:', error);
      throw error;
    }
  },

  // Get track by ID
  async getTrack(trackId: string): Promise<SpotifySearchResult> {
    try {
      // In development with mock data
      if (process.env.NODE_ENV === 'development' && !import.meta.env.VITE_USE_BACKEND) {
        return new Promise((resolve, reject) => {
          setTimeout(() => {
            const track = MOCK_SEARCH_RESULTS.find(t => t.id === trackId);
            if (track) {
              resolve(track);
            } else {
              reject(new Error('Track not found'));
            }
          }, 500);
        });
      }

      const response = await axiosAuth.get(`/spotify/tracks/${trackId}`);
      return response.data;
    } catch (error) {
      console.error('Get track error:', error);
      throw error;
    }
  }
};
