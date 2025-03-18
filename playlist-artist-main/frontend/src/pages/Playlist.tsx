
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { playlistService, Playlist as PlaylistType } from '@/services/playlistService';
import { useAuthContext } from '@/context/AuthContext';
import SongSearch from '@/components/song/SongSearch';
import { toast } from 'sonner';
import { motion } from 'framer-motion';
import { SpotifySearchResult, SpotifySong } from '@/types/spotify';
import { Box, Typography, Button, Card, CardContent, CardMedia, IconButton, CircularProgress } from '@mui/material';
import { Delete as DeleteIcon, Edit as EditIcon } from '@mui/icons-material';

interface PlaylistData extends PlaylistType {
  createdAt: string;
  updatedAt: string;
  createdBy: string;
}

const Playlist: React.FC = () => {
  const { id: playlistId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuthContext();
  const [playlistData, setPlaylistData] = useState<PlaylistData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isOwner, setIsOwner] = useState(false);

  useEffect(() => {
    if (!playlistId) {
      console.error('Playlist ID is missing');
      navigate('/dashboard');
      return;
    }

    const fetchPlaylist = async () => {
      setIsLoading(true);
      try {
        const data = await playlistService.getPlaylist(playlistId);
        setPlaylistData(data as PlaylistData);
        if (user) {
          setIsOwner(data.createdBy === user.id);
        }
      } catch (error) {
        console.error('Error fetching playlist:', error);
        toast.error('Failed to load playlist');
        navigate('/dashboard');
      } finally {
        setIsLoading(false);
      }
    };

    fetchPlaylist();
  }, [playlistId, navigate, user]);

  const deletePlaylist = async (): Promise<void> => {
    if (!playlistId) return;
    try {
      await playlistService.deletePlaylist(playlistId);
      toast.success('Playlist deleted successfully');
      navigate('/dashboard');
    } catch (error) {
      console.error('Error deleting playlist:', error);
      toast.error('Failed to delete playlist');
    }
  };

  const removeSongFromPlaylist = async (songId: string): Promise<void> => {
    if (!playlistId) return;

    try {
      const updatedPlaylist = await playlistService.removeFromPlaylist(playlistId, songId);
      setPlaylistData(updatedPlaylist as PlaylistData);
      toast.success('Song removed from playlist');
    } catch (error) {
      console.error('Error removing song from playlist:', error);
      toast.error('Failed to remove song from playlist');
    }
  };

  const addToPlaylist = async (song: SpotifySearchResult): Promise<void> => {
    if (!playlistData) return;
  
    try {
      const songToAdd: SpotifySong = {
        id: song.id,
        name: song.name,
        artist: song.artists[0].name,
        album: song.album.name,
        duration: song.duration_ms,
        imageUrl: song.album.images[0]?.url || '/placeholder.svg',
      };
      
      const updatedPlaylist = await playlistService.addSongToPlaylist(playlistId as string, songToAdd);
      
      // Update local state with the returned playlist
      setPlaylistData(updatedPlaylist as PlaylistData);
      toast.success(`Added "${song.name}" to playlist`);
    } catch (error) {
      console.error('Error adding song to playlist:', error);
      toast.error('Failed to add song to playlist');
    }
  };

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!playlistData) {
    return (
      <Box sx={{ textAlign: 'center', mt: 4 }}>
        <Typography variant="h5">Playlist not found</Typography>
      </Box>
    );
  }
console.log("playlistData",playlistData)
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <Box sx={{ maxWidth: 1200, mx: 'auto', p: 3 }}>
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold' }}>
            {playlistData.name}
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mt: 1 }}>
            {playlistData.description}
          </Typography>

            <Box sx={{ mt: 2 }}>
              <Button
                variant="contained"
                color="error"
                startIcon={<DeleteIcon />}
                onClick={deletePlaylist}
              >
                Delete Playlist
              </Button>
            </Box>
        </Box>

        <Typography variant="h5" sx={{ mb: 2, fontWeight: 600 }}>
          Songs
        </Typography>
        
        {playlistData.songs.length === 0 ? (
          <Card sx={{ p: 4, textAlign: 'center', bgcolor: 'background.paper' }}>
            <Typography color="text.secondary">No songs in this playlist yet.</Typography>
          </Card>
        ) : (
          <Box sx={{ mb: 4 }}>
            {playlistData.songs.map((song) => (
              <Card key={song.id} sx={{ display: 'flex', mb: 2, overflow: 'hidden' }}>
                <CardMedia
                  component="img"
                  sx={{ width: 80, height: 80 }}
                  image={song.albumCover}
                  alt={song.name}
                />
                <CardContent sx={{ flex: '1 0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Box>
                    <Typography component="div" variant="h6">
                      {song.album}
                    </Typography>
                    <Typography variant="subtitle1" color="text.secondary" component="div">
                      {song.artist}
                    </Typography>
                  </Box>
                 
                    <IconButton
                      aria-label="remove from playlist"
                      onClick={() => removeSongFromPlaylist(song.id)}
                      color="error"
                    >
                      <DeleteIcon />
                    </IconButton>
                </CardContent>
              </Card>
            ))}
          </Box>
        )}

      
      </Box>
    </motion.div>
  );
};

export default Playlist;
