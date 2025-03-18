
import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Play, Music, MoreHorizontal, Edit, Trash } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Playlist } from '@/services/playlistService';

interface PlaylistCardProps {
  playlist: Playlist;
  onEdit?: () => void;
  onDelete?: () => void;
}

const PlaylistCard: React.FC<PlaylistCardProps> = ({ playlist, onEdit, onDelete }) => {
  console.log("playlist<<<",playlist)
  const { _id, name, description, coverImage, songs } = playlist;
  
  const formatSongCount = (count: number) => {
    return `${count} ${count === 1 ? 'song' : 'songs'}`;
  };

  return (
    <Card className="glass-card group h-full overflow-hidden transition-all duration-300 hover:shadow-md">
      <div className="relative overflow-hidden">
        {/* Cover image */}
        <div className="aspect-square w-full overflow-hidden">
          {coverImage ? (
            <img 
              src={coverImage} 
              alt={name} 
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" 
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-gray-100 dark:bg-gray-800">
              <Music className="h-16 w-16 text-gray-400" />
            </div>
          )}
        </div>
        
        {/* Play button overlay */}
        <Link 
          to={`/playlist/${_id}`} 
          className="absolute inset-0 flex items-center justify-center bg-black/0 opacity-0 transition-all duration-300 group-hover:bg-black/20 group-hover:opacity-100"
        >
          <Button 
            size="icon" 
            variant="secondary" 
            className="h-12 w-12 rounded-full bg-white/90 text-black shadow-lg transition-transform duration-300 hover:scale-105 hover:bg-white"
          >
            <Play className="h-6 w-6" />
          </Button>
        </Link>
      </div>

      <CardHeader className="px-4 py-3">
        <div className="flex items-start justify-between">
          <div className="w-full overflow-hidden">
            <CardTitle className="truncate text-lg">{name}</CardTitle>
            <CardDescription className="mt-1 line-clamp-2 text-sm">
              {description || "No description"}
            </CardDescription>
          </div>
          
          {(onEdit || onDelete) && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="-mr-2 h-8 w-8 flex-shrink-0"
                >
                  <MoreHorizontal className="h-4 w-4" />
                  <span className="sr-only">Open menu</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-36">
                {onEdit && (
                  <DropdownMenuItem onClick={onEdit} className="cursor-pointer">
                    <Edit className="mr-2 h-4 w-4" />
                    Edit
                  </DropdownMenuItem>
                )}
                {onDelete && (
                  <DropdownMenuItem 
                    onClick={onDelete}
                    className="cursor-pointer text-destructive focus:text-destructive"
                  >
                    <Trash className="mr-2 h-4 w-4" />
                    Delete
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </CardHeader>

      <CardFooter className="border-t border-border/40 px-4 py-3">
        <p className="text-xs text-muted-foreground">
          {formatSongCount(songs.length)}
        </p>
      </CardFooter>
    </Card>
  );
};

export default PlaylistCard;
