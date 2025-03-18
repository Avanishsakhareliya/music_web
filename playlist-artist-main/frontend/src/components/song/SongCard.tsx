
import React from 'react';
import { Box, Card, CardContent, CardMedia, Typography, Button, IconButton } from '@mui/material';
import { Add as AddIcon, PlayArrow as PlayArrowIcon } from '@mui/icons-material';
import { SpotifySearchResult } from '@/types/spotify';

interface SongCardProps {
  song: SpotifySearchResult;
  onAdd: (song: SpotifySearchResult) => void;
}

const SongCard: React.FC<SongCardProps> = ({ song, onAdd }) => {
  const formatDuration = (ms: number) => {
    const minutes = Math.floor(ms / 60000);
    const seconds = ((ms % 60000) / 1000).toFixed(0);
    return `${minutes}:${Number(seconds) < 10 ? '0' : ''}${seconds}`;
  };

  return (
    <Card 
      sx={{ 
        display: 'flex', 
        mb: 2, 
        borderRadius: 2,
        overflow: 'hidden',
        transition: 'transform 0.2s',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: 3
        }
      }}
    >
      <CardMedia
        component="img"
        sx={{ width: 80, height: 80 }}
        image={song.album.images[0]?.url || '/placeholder.svg'}
        alt={song.name}
      />
      <Box sx={{ display: 'flex', flexDirection: 'column', flex: '1 0 auto' }}>
        <CardContent sx={{ flex: '1 0 auto', pb: 1 }}>
          <Typography component="div" variant="h6" sx={{ fontWeight: 500 }}>
            {song.name}
          </Typography>
          <Typography variant="body2" color="text.secondary" component="div">
            {song.artists.map(artist => artist.name).join(', ')}
          </Typography>
          <Typography variant="body2" color="text.secondary" component="div">
            {song.album.name} • {formatDuration(song.duration_ms)}
          </Typography>
        </CardContent>
      </Box>
      <Box sx={{ display: 'flex', alignItems: 'center', pl: 1, pb: 1, pr: 2 }}>
        <IconButton aria-label="play song" sx={{ mr: 1 }}>
          <PlayArrowIcon />
        </IconButton>
        <Button 
          variant="contained" 
          size="small" 
          startIcon={<AddIcon />}
          onClick={() => onAdd(song)}
        >
          Add
        </Button>
      </Box>
    </Card>
  );
};

export default SongCard;
