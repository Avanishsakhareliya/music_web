
import React, { useState, useEffect } from 'react';
import { spotifyService } from '@/services/spotifyService';
import { toast } from 'sonner';
import { useDebounce } from '@/hooks/use-debounce';
import SongCard from './SongCard';
import { SpotifySearchResult, SpotifySong } from '@/types/spotify';
import { Box, TextField, Typography, LinearProgress, IconButton, InputAdornment } from '@mui/material';
import { Search as SearchIcon, Clear as ClearIcon } from '@mui/icons-material';

interface SongSearchProps {
  onAddToPlaylist: (song: SpotifySearchResult) => void;
  playlistSongs: SpotifySong[];
}

const SongSearch: React.FC<SongSearchProps> = ({ onAddToPlaylist, playlistSongs }) => {
  const [query, setQuery] = useState('');
  const [searchResults, setSearchResults] = useState<SpotifySearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const debouncedQuery = useDebounce(query, 500);

  useEffect(() => {
    const fetchSongs = async () => {
      if (!debouncedQuery.trim()) {
        setSearchResults([]);
        return;
      }

      setIsLoading(true);
      try {
        const results = await spotifyService.searchTracks(debouncedQuery);
        setSearchResults(results);
      } catch (error) {
        console.error('Error fetching songs:', error);
        toast.error('Failed to search songs. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchSongs();
  }, [debouncedQuery]);

  const handleClearSearch = () => {
    setQuery('');
    setSearchResults([]);
  };

  const handleAddToPlaylist = (song: SpotifySearchResult) => {
    const songExists = playlistSongs.some(s => s.id === song.id);
    if (songExists) {
      toast.info(`"${song.name}" is already in this playlist`);
      return;
    }
    onAddToPlaylist(song);
  };

  return (
    <Box>
      <TextField
        fullWidth
        variant="outlined"
        placeholder="Search for songs, artists, or albums..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        sx={{ mb: 3 }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon />
            </InputAdornment>
          ),
          endAdornment: query && (
            <InputAdornment position="end">
              <IconButton onClick={handleClearSearch} edge="end">
                <ClearIcon />
              </IconButton>
            </InputAdornment>
          ),
        }}
      />

      {isLoading && <LinearProgress sx={{ mb: 2 }} />}

      {!isLoading && searchResults.length === 0 && debouncedQuery && (
        <Box sx={{ textAlign: 'center', py: 4 }}>
          <Typography variant="h6">No songs found</Typography>
          <Typography variant="body2" color="text.secondary">
            Try a different search term
          </Typography>
        </Box>
      )}

      {!isLoading && !debouncedQuery && (
        <Box sx={{ textAlign: 'center', py: 4 }}>
          <Typography variant="h6">Search for songs</Typography>
          <Typography variant="body2" color="text.secondary">
            Type in the search box to find songs to add to your playlist
          </Typography>
        </Box>
      )}

      {searchResults.map((song) => (
        <SongCard
          key={song.id}
          song={song}
          onAdd={handleAddToPlaylist}
        />
      ))}
    </Box>
  );
};

export default SongSearch;
