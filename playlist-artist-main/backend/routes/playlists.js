
const express = require('express');
const { check, validationResult } = require('express-validator');
const auth = require('../middleware/auth');
const Playlist = require('../models/Playlist');

const router = express.Router();

// @route   GET api/playlists
// @desc    Get all playlists for the current user
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const playlists = await Playlist.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.json(playlists);
  } catch (error) {
    console.error('Get playlists error:', error);
    res.status(500).send('Server error');
  }
});

// @route   GET api/playlists/:id
// @desc    Get a playlist by id
// @access  Private
router.get('/:id', auth, async (req, res) => {
  try {
    const playlist = await Playlist.findById(req.params.id);
    
    if (!playlist) {
      return res.status(404).json({ message: 'Playlist not found' });
    }

    // Check if playlist belongs to user
    if (playlist.user.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to access this playlist' });
    }

    res.json(playlist);
  } catch (error) {
    console.error('Get playlist error:', error);
    
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Playlist not found' });
    }
    
    res.status(500).send('Server error');
  }
});

// @route   POST api/playlists
// @desc    Create a new playlist
// @access  Private
router.post(
  '/',
  [
    auth,
    [
      check('name', 'Name is required').not().isEmpty()
    ]
  ],
  async (req, res) => {
    // Validate request
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, description } = req.body;

    try {
      // Create new playlist
      const newPlaylist = new Playlist({
        name,
        description,
        user: req.user.id
      });

      // Save playlist to database
      const playlist = await newPlaylist.save();
      res.json(playlist);
    } catch (error) {
      console.error('Create playlist error:', error);
      res.status(500).send('Server error');
    }
  }
);

// @route   PUT api/playlists/:id
// @desc    Update a playlist
// @access  Private
router.put('/:id', auth, async (req, res) => {
  const { name, description } = req.body;

  try {
    let playlist = await Playlist.findById(req.params.id);
    
    if (!playlist) {
      return res.status(404).json({ message: 'Playlist not found' });
    }

    // Check if playlist belongs to user
    if (playlist.user.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to update this playlist' });
    }

    // Update playlist
    if (name) playlist.name = name;
    if (description !== undefined) playlist.description = description;

    // Save updated playlist
    await playlist.save();
    res.json(playlist);
  } catch (error) {
    console.error('Update playlist error:', error);
    
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Playlist not found' });
    }
    
    res.status(500).send('Server error');
  }
});

// @route   DELETE api/playlists/:id
// @desc    Delete a playlist
// @access  Private
router.delete('/:id', auth, async (req, res) => {
  try {
    const playlist = await Playlist.findById(req.params.id);
    
    if (!playlist) {
      return res.status(404).json({ message: 'Playlist not found' });
    }

    // Check if playlist belongs to user
    if (playlist.user.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to delete this playlist' });
    }

    // Remove playlist
    await playlist.deleteOne();
    res.json({ message: 'Playlist deleted' });
  } catch (error) {
    console.error('Delete playlist error:', error);
    
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Playlist not found' });
    }
    
    res.status(500).send('Server error');
  }
});

// @route   POST api/playlists/:id/songs
// @desc    Add a song to a playlist
// @access  Private
router.post('/:id/songs', auth, async (req, res) => {
  try {
    const playlist = await Playlist.findById(req.params.id);
    
    if (!playlist) {
      return res.status(404).json({ message: 'Playlist not found' });
    }

    // Check if playlist belongs to user
    if (playlist.user.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to update this playlist' });
    }

    // const song = req.body;
    const { id, name, uri, duration_ms, album, artists } = req.body;

    // Validate required fields
    if (!id || !name || !uri || !duration_ms || !album || !artists || !artists[0]?.name) {
      return res.status(400).json({ message: 'Invalid song data' });
    }

    const song = {
      id,
      title: name,
      artist: artists[0].name,
      album: album.name,
      albumCover: album.images[0]?.url || '',
      duration: duration_ms,
      uri
    };
    console.log("playlist---->>>",song)
    // Check if song already exists in playlist
    const songExists = playlist.songs.some(s => s.id === song.id);
    if (songExists) {
      return res.status(400).json({ message: 'Song already exists in playlist' });
    }

    // Add song to playlist
    playlist.songs.push(song);

    // Save updated playlist
    await playlist.save();
    res.json(playlist);
  } catch (error) {
    console.error('Add song to playlist error:', error);
    
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Playlist not found' });
    }
    
    res.status(500).send('Server error');
  }
});

// @route   DELETE api/playlists/:id/songs/:songId
// @desc    Remove a song from a playlist
// @access  Private
router.delete('/:id/songs/:songId', auth, async (req, res) => {
  try {
    const playlist = await Playlist.findById(req.params.id);
    
    if (!playlist) {
      return res.status(404).json({ message: 'Playlist not found' });
    }

    // Check if playlist belongs to user
    if (playlist.user.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to update this playlist' });
    }

    // Remove song from playlist
    playlist.songs = playlist.songs.filter(song => song.id !== req.params.songId);

    // Save updated playlist
    await playlist.save();
    res.json(playlist);
  } catch (error) {
    console.error('Remove song from playlist error:', error);
    
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Playlist not found' });
    }
    
    res.status(500).send('Server error');
  }
});

module.exports = router;
