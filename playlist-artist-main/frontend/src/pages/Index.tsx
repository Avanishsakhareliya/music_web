
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuthContext } from '@/context/AuthContext';
import PageTransition from '@/components/layout/PageTransition';
import { Music, ListMusic, Search } from 'lucide-react';
import Header from '@/components/layout/Header';

const Index = () => {
  const { isAuthenticated } = useAuthContext();

  return (
    <PageTransition>
      <Header />
      <main className="min-h-screen">
        {/* Hero Section */}
        <section className="relative">
          {/* Background gradient */}
          <div className="absolute inset-0 bg-gradient-to-b from-primary/10 to-background pointer-events-none" />
          
          <div className="container-custom relative z-10 flex min-h-screen items-center justify-center py-20">
            <div className="max-w-3xl text-center">
              <div className="mb-6 inline-flex items-center justify-center rounded-full bg-primary/10 px-4 py-2">
                <Music className="mr-2 h-5 w-5 text-primary" />
                <span className="text-sm font-medium">Your personal music curator</span>
              </div>
              
              <h1 className="mb-6 animate-slide-up text-5xl font-bold tracking-tight md:text-6xl">
                Create perfect playlists for every moment
              </h1>
              
              <p className="mb-8 animate-slide-up animation-delay-200 text-xl text-muted-foreground">
                Discover, organize, and enjoy your favorite music with our intuitive playlist manager. Search millions of songs and create the perfect soundtrack for any occasion.
              </p>
              
              <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
                {isAuthenticated ? (
                  <>
                    <Button 
                      asChild 
                      size="lg" 
                      className="animate-slide-up animation-delay-300 min-w-36"
                    >
                      <Link to="/dashboard">
                        <ListMusic className="mr-2 h-5 w-5" />
                        My Playlists
                      </Link>
                    </Button>
                    <Button 
                      asChild 
                      variant="outline" 
                      size="lg" 
                      className="animate-slide-up animation-delay-400 min-w-36"
                    >
                      <Link to="/search">
                        <Search className="mr-2 h-5 w-5" />
                        Discover Music
                      </Link>
                    </Button>
                  </>
                ) : (
                  <>
                    <Button 
                      asChild 
                      size="lg" 
                      className="animate-slide-up animation-delay-300 min-w-36"
                    >
                      <Link to="/login">Get Started</Link>
                    </Button>
                    <Button 
                      asChild 
                      variant="outline" 
                      size="lg" 
                      className="animate-slide-up animation-delay-400 min-w-36"
                    >
                      <Link to="/register">Create Account</Link>
                    </Button>
                  </>
                )}
              </div>
            </div>
          </div>
        </section>
        {/* Footer */}
        <footer className="border-t py-12">
          <div className="container-custom">
            <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
              <div className="flex items-center gap-2">
                <Music className="h-6 w-6 text-primary" />
                <span className="text-xl font-semibold">Melodify</span>
              </div>
              
              <p className="text-sm text-muted-foreground">
                &copy; {new Date().getFullYear()} Melodify. All rights reserved.
              </p>
            </div>
          </div>
        </footer>
      </main>
    </PageTransition>
  );
};

export default Index;
