
const mongoose = require('mongoose');

const songSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true
  },
  title: {
    type: String,
    required: true
  },
  artist: {
    type: String,
    required: true
  },
  album: {
    type: String,
    required: true
  },
  albumCover: {
    type: String,
    required: true
  },
  duration: {
    type: Number,
    required: true
  },
  uri: {
    type: String,
    required: true
  }
});

const playlistSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    trim: true,
    default: ''
  },
  coverImage: {
    type: String,
    default: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=300&auto=format&fit=crop'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  songs: [songSchema]
});

module.exports = mongoose.model('Playlist', playlistSchema);
