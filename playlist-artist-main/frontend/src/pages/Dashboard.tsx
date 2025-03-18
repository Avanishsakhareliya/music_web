
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuthContext } from '@/context/AuthContext';
import { Navigate } from 'react-router-dom';
import PageTransition from '@/components/layout/PageTransition';
import Header from '@/components/layout/Header';
import { Button } from '@/components/ui/button';
import { PlusCircle, Loader2, Search } from 'lucide-react';
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { toast } from 'sonner';
import { Playlist, playlistService } from '@/services/playlistService';
import PlaylistCard from '@/components/playlist/PlaylistCard';
import PlaylistForm from '@/components/playlist/PlaylistForm';

const Dashboard = () => {
  const { isAuthenticated, isLoading: authLoading, user } = useAuthContext();
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [currentPlaylist, setCurrentPlaylist] = useState<Playlist | null>(null);
  const [submitLoading, setSubmitLoading] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      fetchPlaylists();
    }
  }, [isAuthenticated]);

  const fetchPlaylists = async () => {
    setIsLoading(true);
    try {
      const data = await playlistService.getPlaylists();
      setPlaylists(data);
    } catch (error) {
      console.error('Error fetching playlists:', error);
      toast.error('Failed to load playlists. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreatePlaylist = async (data: { name: string; description: string }) => {
    setSubmitLoading(true);
    try {
      const newPlaylist = await playlistService.createPlaylist(data);
      setPlaylists(prev => [...prev, newPlaylist]);
      toast.success('Playlist created successfully!');
    } catch (error) {
      console.error('Error creating playlist:', error);
      toast.error('Failed to create playlist. Please try again.');
      throw error;
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleEditPlaylist = async (data: { name: string; description: string }) => {
    console.log('data:', currentPlaylist);
    if (!currentPlaylist) return;
    
    setSubmitLoading(true);
    try {
      const updatedPlaylist = await playlistService.updatePlaylist(currentPlaylist._id, data);
      setPlaylists(prev => 
        prev.map(p => p.id === updatedPlaylist.id ? updatedPlaylist : p)
      );
      toast.success('Playlist updated successfully!');
    } catch (error) {
      console.error('Error updating playlist:', error);
      toast.error('Failed to update playlist. Please try again.');
      throw error;
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleDeletePlaylist = async () => {
    if (!currentPlaylist) return;
    
    setSubmitLoading(true);
    try {
      await playlistService.deletePlaylist(currentPlaylist._id);
      setPlaylists(prev => prev.filter(p => p.id !== currentPlaylist.id));
      toast.success('Playlist deleted successfully!');
      setIsDeleteDialogOpen(false);
    } catch (error) {
      console.error('Error deleting playlist:', error);
      toast.error('Failed to delete playlist. Please try again.');
    } finally {
      setSubmitLoading(false);
    }
  };

  const openEditModal = (playlist: Playlist) => {
    setCurrentPlaylist(playlist);
    setIsEditModalOpen(true);
  };

  const openDeleteDialog = (playlist: Playlist) => {
    setCurrentPlaylist(playlist);
    setIsDeleteDialogOpen(true);
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
          {/* Dashboard Header */}
          <div className="mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold">My Playlists</h1>
              <p className="text-muted-foreground mt-1">
                Create and manage your music collections
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Button 
                variant="outline" 
                asChild
              >
                <Link to="/search">
                  <Search className="mr-2 h-4 w-4" />
                  Find Music
                </Link>
              </Button>
              <Button 
                onClick={() => setIsCreateModalOpen(true)}
              >
                <PlusCircle className="mr-2 h-4 w-4" />
                Create Playlist
              </Button>
            </div>
          </div>

          {/* Playlists Grid */}
          {isLoading ? (
            <div className="flex items-center justify-center h-64">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : playlists.length === 0 ? (
            <div className="rounded-lg border border-dashed p-16 text-center">
              <h3 className="text-xl font-medium mb-2">No playlists yet</h3>
              <p className="text-muted-foreground mb-6">
                Create your first playlist to get started
              </p>
              <Button 
                onClick={() => setIsCreateModalOpen(true)}
              >
                <PlusCircle className="mr-2 h-4 w-4" />
                Create Playlist
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {playlists.map((playlist) => (
                <PlaylistCard
                  key={playlist._id}
                  playlist={playlist}
                  onEdit={() => openEditModal(playlist)}
                  onDelete={() => openDeleteDialog(playlist)}
                />
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Create Playlist Modal */}
      <PlaylistForm
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={handleCreatePlaylist}
        mode="create"
        isLoading={submitLoading}
      />

      {/* Edit Playlist Modal */}
      {currentPlaylist && (
        <PlaylistForm
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          onSubmit={handleEditPlaylist}
          defaultValues={{
            name: currentPlaylist.name,
            description: currentPlaylist.description,
          }}
          mode="edit"
          isLoading={submitLoading}
        />
      )}

      {/* Delete Confirmation Dialog */}
      <AlertDialog 
        open={isDeleteDialogOpen} 
        onOpenChange={setIsDeleteDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the playlist
              {currentPlaylist ? ` "${currentPlaylist.name}"` : ''} and all its songs.
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={submitLoading}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeletePlaylist}
              disabled={submitLoading}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {submitLoading ? (
                <span className="flex items-center gap-2">
                  <Loader2 size={16} className="animate-spin" />
                  Deleting...
                </span>
              ) : (
                'Delete'
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </PageTransition>
  );
};

export default Dashboard;
