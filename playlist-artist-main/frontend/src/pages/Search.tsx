
import React, { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuthContext } from '@/context/AuthContext';
import PageTransition from '@/components/layout/PageTransition';
import Header from '@/components/layout/Header';
import { toast } from 'sonner';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { SpotifySearchResult, spotifyService } from '@/services/spotifyService';
import { Loader2, Music, Search as SearchIcon, Plus } from 'lucide-react';
import { useDebounce } from '@/hooks/use-debounce';
import SongCard from '@/components/song/SongCard';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Playlist, playlistService } from '@/services/playlistService';
import { ScrollArea } from '@/components/ui/scroll-area';

const Search = () => {
  const { isAuthenticated, isLoading: authLoading } = useAuthContext();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SpotifySearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedSong, setSelectedSong] = useState<SpotifySearchResult | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [isLoadingPlaylists, setIsLoadingPlaylists] = useState(false);
  const [isAddingSong, setIsAddingSong] = useState<Record<string, boolean>>({});
  const debouncedQuery = useDebounce(query, 500);

  const handleSearch = async () => {
    if (!debouncedQuery.trim()) {
      setResults([]);
      return;
    }

    setIsLoading(true);
    try {
      const searchResults = await spotifyService.searchTracks(debouncedQuery);
      setResults(searchResults);
    } catch (error) {
      console.error('Search error:', error);
      toast.error('Failed to search songs. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  React.useEffect(() => {
    handleSearch();
  }, [debouncedQuery]);

  const openAddToPlaylistDialog = async (song: SpotifySearchResult) => {
    setSelectedSong(song);
    setIsLoadingPlaylists(true);
    try {
      const userPlaylists = await playlistService.getPlaylists();
      setPlaylists(userPlaylists);
      setIsDialogOpen(true);
    } catch (error) {
      console.error('Error fetching playlists:', error);
      toast.error('Failed to load your playlists. Please try again.');
    } finally {
      setIsLoadingPlaylists(false);
    }
  };

  const handleAddToPlaylist = async (playlistId: string) => {
    if (!selectedSong) return;
    
    setIsAddingSong(prev => ({ ...prev, [playlistId]: true }));
    try {
      const playlist = await playlistService.getPlaylist(playlistId);
      console.log("playlist",playlist,selectedSong)
      
      // Check if song already exists in playlist
      const songExists = playlist.songs.some(s => s.id === selectedSong.id);
      
      if (songExists) {
        toast.info(`"${selectedSong.name}" is already in this playlist`);
      } else {
        await playlistService.addSongToPlaylist(playlistId, selectedSong);
        toast.success(`Added "${selectedSong.name}" to playlist`);
        const userPlaylists = await playlistService.getPlaylists();
      setPlaylists(userPlaylists);
      }
    } catch (error) {
      console.error('Error adding song to playlist:', error);
      toast.error('Failed to add song to playlist. Please try again.');
    } finally {
      setIsAddingSong(prev => ({ ...prev, [playlistId]: false }));
    }
  };

  // If user is not authenticated, redirect to login
  if (!isAuthenticated && !authLoading) {
    return <Navigate to="/login" replace />;
  }
console.log("playlists",playlists)
  return (
    <PageTransition>
      <Header />
      <main className="min-h-screen pt-20 pb-12">
        <div className="container-custom">
          {/* Search Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold">Discover Music</h1>
            <p className="text-muted-foreground mt-1">
              Search for your favorite songs and add them to your playlists
            </p>
          </div>

          {/* Search Input */}
          <div className="mb-8 relative max-w-2xl mx-auto">
            <div className="relative">
              <SearchIcon className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search for songs, artists, or albums..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="pl-10 py-6 text-lg"
              />
            </div>
          </div>

          {/* Search Results */}
          <div className="max-w-3xl mx-auto">
            {isLoading ? (
              <div className="flex items-center justify-center h-64">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              </div>
            ) : results.length > 0 ? (
              <div className="space-y-2">
                {results.map((song) => (
                  <SongCard
                    key={song.id}
                    song={song}
                    onAdd={() => openAddToPlaylistDialog(song)}
                  />
                ))}
              </div>
            ) : debouncedQuery ? (
              <div className="text-center py-16">
                <SearchIcon className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-xl font-medium">No songs found</h3>
                <p className="text-muted-foreground">
                  Try searching for a different song, artist, or album
                </p>
              </div>
            ) : (
              <div className="text-center py-16">
                <Music className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-xl font-medium">Search for music</h3>
                <p className="text-muted-foreground">
                  Type in the search box to find your favorite songs
                </p>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Add to Playlist Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Add to Playlist</DialogTitle>
          </DialogHeader>
          
          {isLoadingPlaylists ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          ) : playlists.length === 0 ? (
            <div className="text-center py-6">
              <p className="text-muted-foreground mb-4">
                You don't have any playlists yet.
              </p>
              <Button 
                asChild
                onClick={() => setIsDialogOpen(false)}
              >
                <a href="/dashboard">Create a Playlist</a>
              </Button>
            </div>
          ) : (
            <ScrollArea className="max-h-[60vh]">
              <div className="space-y-2 pr-4">
                {playlists.map((playlist) => (
                  <div 
                    key={playlist.id}
                    className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 flex-shrink-0 overflow-hidden rounded-md">
                        {playlist.coverImage ? (
                          <img 
                            src={playlist.coverImage} 
                            alt={playlist.name} 
                            className="h-full w-full object-cover" 
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center bg-gray-100 dark:bg-gray-800">
                            <Music className="h-5 w-5 text-gray-400" />
                          </div>
                        )}
                      </div>
                      <div>
                        <p className="font-medium">{playlist.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {playlist.songs.length} {playlist.songs.length === 1 ? 'song' : 'songs'}
                        </p>
                      </div>
                    </div>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => handleAddToPlaylist(playlist._id)}
                      disabled={isAddingSong[playlist._id]}
                    >
                      {isAddingSong[playlist.id] ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Plus className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                ))}
              </div>
            </ScrollArea>
          )}
          
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setIsDialogOpen(false)}
            >
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </PageTransition>
  );
};

export default Search;
