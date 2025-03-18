
import axios from 'axios';
import { SpotifySong } from '@/types/spotify';

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
const MOCK_PLAYLISTS = [
  {
    id: '1',
    name: 'My Favorite Songs',
    description: 'A collection of my all-time favorite songs',
    songs: [],
    coverImage: '',
    createdBy: '1',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '2',
    name: 'Workout Mix',
    description: 'High energy songs for workout sessions',
    songs: [],
    coverImage: '',
    createdBy: '1',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

export interface Song {
  id: string;
  name: string;
  artist: string;
  album: string;
  duration: number;
  imageUrl: string;
}

export interface Playlist {
  id: string;
  name: string;
  description: string;
  songs: Song[];
  coverImage?: string;
  createdBy?: string;
  _id?: string;
}

export const playlistService = {
  // Get all playlists for current user
  async getPlaylists(): Promise<Playlist[]> {
    try {
      // In development with mock data
      // if (process.env.NODE_ENV === 'development' && !import.meta.env.VITE_USE_BACKEND) {
      //   return new Promise((resolve) => {
      //     setTimeout(() => {
      //       resolve(MOCK_PLAYLISTS);
      //     }, 500);
      //   });
      // }

      const response = await axiosAuth.get('/playlists');
      return response.data;
    } catch (error) {
      console.error('Get playlists error:', error);
      throw error;
    }
  },

  // Get a specific playlist by ID
  async getPlaylist(id: string): Promise<Playlist> {
    try {
      // In development with mock data
      // if (process.env.NODE_ENV === 'development' && !import.meta.env.VITE_USE_BACKEND) {
      //   return new Promise((resolve, reject) => {
      //     setTimeout(() => {
      //       const playlist = MOCK_PLAYLISTS.find(p => p.id === id);
      //       if (playlist) {
      //         resolve(playlist);
      //       } else {
      //         reject(new Error('Playlist not found'));
      //       }
      //     }, 500);
      //   });
      // }

      const response = await axiosAuth.get(`/playlists/${id}`);
      return response.data;
    } catch (error) {
      console.error('Get playlist error:', error);
      throw error;
    }
  },

  // Create a new playlist
  async createPlaylist(playlistData: { name: string; description: string }): Promise<Playlist> {
    try {
      // In development with mock data
      // if (process.env.NODE_ENV === 'development' && !import.meta.env.VITE_USE_BACKEND) {
      //   return new Promise((resolve) => {
      //     setTimeout(() => {
      //       const newPlaylist = {
      //         id: Math.random().toString(36).substr(2, 9),
      //         name: playlistData.name,
      //         description: playlistData.description,
      //         songs: [],
      //         coverImage: '',
      //         createdBy: '1',
      //         createdAt: new Date().toISOString(),
      //         updatedAt: new Date().toISOString(),
      //       };
      //       MOCK_PLAYLISTS.push(newPlaylist);
      //       resolve(newPlaylist);
      //     }, 500);
      //   });
      // }

      const response = await axiosAuth.post('/playlists', playlistData);
      return response.data;
    } catch (error) {
      console.error('Create playlist error:', error);
      throw error;
    }
  },

  // Update an existing playlist
  async updatePlaylist(id: string, playlistData: { name: string; description: string }): Promise<Playlist> {
    try {
      // In development with mock data
      // if (process.env.NODE_ENV === 'development' && !import.meta.env.VITE_USE_BACKEND) {
      //   return new Promise((resolve, reject) => {
      //     setTimeout(() => {
      //       const index = MOCK_PLAYLISTS.findIndex(p => p.id === id);
      //       if (index !== -1) {
      //         MOCK_PLAYLISTS[index] = {
      //           ...MOCK_PLAYLISTS[index],
      //           ...playlistData,
      //           updatedAt: new Date().toISOString(),
      //         };
      //         resolve(MOCK_PLAYLISTS[index]);
      //       } else {
      //         reject(new Error('Playlist not found'));
      //       }
      //     }, 500);
      //   });
      // }

      const response = await axiosAuth.put(`/playlists/${id}`, playlistData);
      return response.data;
    } catch (error) {
      console.error('Update playlist error:', error);
      throw error;
    }
  },

  // Delete a playlist
  async deletePlaylist(id: string): Promise<void> {
    try {
      // In development with mock data
      // if (process.env.NODE_ENV === 'development' && !import.meta.env.VITE_USE_BACKEND) {
      //   return new Promise((resolve, reject) => {
      //     setTimeout(() => {
      //       const index = MOCK_PLAYLISTS.findIndex(p => p.id === id);
      //       if (index !== -1) {
      //         MOCK_PLAYLISTS.splice(index, 1);
      //         resolve();
      //       } else {
      //         reject(new Error('Playlist not found'));
      //       }
      //     }, 500);
      //   });
      // }

      await axiosAuth.delete(`/playlists/${id}`);
    } catch (error) {
      console.error('Delete playlist error:', error);
      throw error;
    }
  },

  // Add a song to a playlist
  async addSongToPlaylist(playlistId: string, song: SpotifySong): Promise<Playlist> {
    try {
      // In development with mock data
      // if (process.env.NODE_ENV === 'development' && !import.meta.env.VITE_USE_BACKEND) {
      //   return new Promise((resolve, reject) => {
      //     setTimeout(() => {
      //       const index = MOCK_PLAYLISTS.findIndex(p => p.id === playlistId);
      //       if (index !== -1) {
      //         // Check if song already exists in playlist
      //         const songExists = MOCK_PLAYLISTS[index].songs.some(s => s.id === song.id);
      //         if (!songExists) {
      //           MOCK_PLAYLISTS[index].songs.push(song);
      //           MOCK_PLAYLISTS[index].updatedAt = new Date().toISOString();
      //         }
      //         resolve(MOCK_PLAYLISTS[index]);
      //       } else {
      //         reject(new Error('Playlist not found'));
      //       }
      //     }, 500);
      //   });
      // }

      const response = await axiosAuth.post(`/playlists/${playlistId}/songs`, song);
      console.log("response",response)
      return response.data;
    } catch (error) {
      console.error('Add song to playlist error:', error);
      throw error;
    }
  },

  // Remove a song from a playlist
  async removeFromPlaylist(playlistId: string, songId: string): Promise<Playlist> {
    try {
      // In development with mock data
      // if (process.env.NODE_ENV === 'development' && !import.meta.env.VITE_USE_BACKEND) {
      //   return new Promise((resolve, reject) => {
      //     setTimeout(() => {
      //       const index = MOCK_PLAYLISTS.findIndex(p => p.id === playlistId);
      //       if (index !== -1) {
      //         const songIndex = MOCK_PLAYLISTS[index].songs.findIndex(s => s.id === songId);
      //         if (songIndex !== -1) {
      //           MOCK_PLAYLISTS[index].songs.splice(songIndex, 1);
      //           MOCK_PLAYLISTS[index].updatedAt = new Date().toISOString();
      //         }
      //         resolve(MOCK_PLAYLISTS[index]);
      //       } else {
      //         reject(new Error('Playlist not found'));
      //       }
      //     }, 500);
      //   });
      // }

      const response = await axiosAuth.delete(`/playlists/${playlistId}/songs/${songId}`);
      return response.data;
    } catch (error) {
      console.error('Remove song from playlist error:', error);
      throw error;
    }
  }
};
