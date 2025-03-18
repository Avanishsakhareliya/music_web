
const express = require('express');
const axios = require('axios');
const auth = require('../middleware/auth');

const router = express.Router();

// Spotify API credentials
const CLIENT_ID = process.env.SPOTIFY_CLIENT_ID;
const CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET;

// Spotify token management
let spotifyToken = null;
let tokenExpiryTime = null;

// Helper function to get a Spotify API token
const getSpotifyToken = async () => {
  try {
    // Check if we have a valid token already
    if (spotifyToken && tokenExpiryTime && Date.now() < tokenExpiryTime) {
      return spotifyToken;
    }

    // Request a new token
    const response = await axios.post(
      'https://accounts.spotify.com/api/token',
      new URLSearchParams({
        grant_type: 'client_credentials',
      }),
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          Authorization: `Basic ${Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString('base64')}`,
        },
      }
    );

    spotifyToken = response.data.access_token;
    tokenExpiryTime = Date.now() + response.data.expires_in * 1000;
    return spotifyToken;
  } catch (error) {
    console.error('Error getting Spotify token:', error);
    throw error;
  }
};

// @route   GET api/spotify/token
// @desc    Get a Spotify API token (for client use)
// @access  Private
router.get('/token', auth, async (req, res) => {
  try {
    const token = await getSpotifyToken();
    const expiresIn = tokenExpiryTime ? Math.floor((tokenExpiryTime - Date.now()) / 1000) : 3600;
    
    res.json({
      access_token: token,
      expires_in: expiresIn
    });
  } catch (error) {
    console.error('Get Spotify token error:', error);
    res.status(500).send('Server error');
  }
});

// @route   GET api/spotify/search
// @desc    Search for tracks on Spotify
// @access  Private
router.get('/search', auth, async (req, res) => {
  try {
    const { query } = req.query;
    
    if (!query) {
      return res.status(400).json({ message: 'Query parameter is required' });
    }

    const token = await getSpotifyToken();
    
    const response = await axios.get('https://api.spotify.com/v1/search', {
      params: {
        q: query,
        type: 'track',
        limit: 20,
      },
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    // Transform the Spotify API response
    const tracks = response.data.tracks.items.map((item) => ({
      id: item.id,
      title: item.name,
      artist: item.artists.map((artist) => artist.name).join(', '),
      album: item.album.name,
      albumCover: item.album.images[0]?.url || '',
      duration: Math.round(item.duration_ms / 1000),
      uri: item.uri,
    }));

    res.json(tracks);
  } catch (error) {
    console.error('Spotify search error:', error);
    res.status(500).send('Server error');
  }
});

// @route   GET api/spotify/track/:id
// @desc    Get track details from Spotify
// @access  Private
router.get('/track/:id', auth, async (req, res) => {
  try {
    const token = await getSpotifyToken();
    
    const response = await axios.get(`https://api.spotify.com/v1/tracks/${req.params.id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const track = response.data;
    
    res.json({
      id: track.id,
      title: track.name,
      artist: track.artists.map((artist) => artist.name).join(', '),
      album: track.album.name,
      albumCover: track.album.images[0]?.url || '',
      duration: Math.round(track.duration_ms / 1000),
      uri: track.uri,
    });
  } catch (error) {
    console.error('Get Spotify track error:', error);
    res.status(500).send('Server error');
  }
});

module.exports = router;
