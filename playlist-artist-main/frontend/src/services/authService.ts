
import axios from 'axios';

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

export interface LoginResponse {
  token: string;
  user: {
    id: string;
    username: string;
    email: string;
  };
}

// For development - mock authentication
const MOCK_USER = {
  id: '1',
  username: 'testuser',
  email: 'test@example.com',
};

const MOCK_TOKEN = 'mock-jwt-token';

// Auth service methods
export const authService = {
  // Login user
  async login(email: string, password: string): Promise<LoginResponse> {
    try {
      // In development with mock data
      // if (process.env.NODE_ENV === 'development' && !import.meta.env.VITE_USE_BACKEND) {
      //   return new Promise((resolve) => {
      //     setTimeout(() => {
      //       resolve({
      //         token: MOCK_TOKEN,
      //         user: MOCK_USER,
      //       });
      //     }, 500);
      //   });
      // }

      const response = await axiosAuth.post('/auth/login', { email, password });
      return response.data;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  },

  // Register user
  async register(username: string, email: string, password: string): Promise<LoginResponse> {
    try {
      // In development with mock data
      // if (process.env.NODE_ENV === 'development' && !import.meta.env.VITE_USE_BACKEND) {
      //   return new Promise((resolve) => {
      //     setTimeout(() => {
      //       resolve({
      //         token: MOCK_TOKEN,
      //         user: { ...MOCK_USER, username, email },
      //       });
      //     }, 500);
      //   });
      // }

      const response = await axiosAuth.post('/auth/register', {
        username,
        email,
        password,
      });
      return response.data;
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  },

  // Get current user info
  async getCurrentUser() {
    try {
      // In development with mock data
      if (process.env.NODE_ENV === 'development' && !import.meta.env.VITE_USE_BACKEND) {
        return new Promise((resolve) => {
          setTimeout(() => {
            resolve(MOCK_USER);
          }, 500);
        });
      }

      const response = await axiosAuth.get('/auth/me');
      return response.data;
    } catch (error) {
      console.error('Get current user error:', error);
      throw error;
    }
  },
};
