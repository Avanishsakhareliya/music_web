
# Music Playlist Management Backend

This is the backend for the Music Playlist Management System, built with Node.js, Express, and MongoDB.

## Features

- User authentication with JWT
- Playlist CRUD operations
- Integration with Spotify API for song search and details
- MongoDB database for storing user data and playlists

## Getting Started

### Prerequisites

- Node.js (v14+ recommended)
- MongoDB (local or Atlas)
- Spotify Developer Account (for API credentials)

### Installation

1. Clone the repository
2. Install dependencies:
   ```
   npm install
   ```
3. Create a `.env` file based on `.env.example` and fill in your details:
   ```
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/music-playlist-management
   JWT_SECRET=your_jwt_secret
   SPOTIFY_CLIENT_ID=your_spotify_client_id
   SPOTIFY_CLIENT_SECRET=your_spotify_client_secret
   NODE_ENV=development
   ```
4. Start the server:
   ```
   npm run dev
   ```

### API Endpoints

#### Authentication

- POST `/api/auth/register` - Register a new user
- POST `/api/auth/login` - Login a user
- GET `/api/auth/me` - Get current user info

#### Playlists

- GET `/api/playlists` - Get all playlists for the current user
- GET `/api/playlists/:id` - Get a playlist by id
- POST `/api/playlists` - Create a new playlist
- PUT `/api/playlists/:id` - Update a playlist
- DELETE `/api/playlists/:id` - Delete a playlist
- POST `/api/playlists/:id/songs` - Add a song to a playlist
- DELETE `/api/playlists/:id/songs/:songId` - Remove a song from a playlist

#### Spotify

- GET `/api/spotify/token` - Get a Spotify API token
- GET `/api/spotify/search?query=your_search_query` - Search for tracks on Spotify
- GET `/api/spotify/track/:id` - Get track details from Spotify

## Connecting Frontend

In your frontend React app, set the environment variable `VITE_API_BASE_URL` to point to this backend server (e.g., `http://localhost:5000/api`).

## Production Deployment

For production deployment, remember to:

1. Set `NODE_ENV=production` in your environment
2. Use a production MongoDB database
3. Set a strong JWT secret
4. Configure CORS settings appropriately
5. Deploy to a hosting service like Heroku, Render, or AWS

## License

This project is licensed under the MIT License.
