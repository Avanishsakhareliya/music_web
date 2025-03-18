
import React from 'react';
import { Link } from 'react-router-dom';
import AuthForm from '@/components/auth/AuthForm';
import { useAuthContext } from '@/context/AuthContext';
import { Navigate } from 'react-router-dom';
import PageTransition from '@/components/layout/PageTransition';
import { Music } from 'lucide-react';
import Header from '@/components/layout/Header';

const Login = () => {
  const { isAuthenticated, isLoading } = useAuthContext();

  // If user is already authenticated, redirect to dashboard
  if (isAuthenticated && !isLoading) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <PageTransition>
      <Header />
      <main className="min-h-screen flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center mb-4">
              <Music className="h-10 w-10 text-primary" />
            </div>
            <h1 className="text-3xl font-bold">Welcome back</h1>
            <p className="text-muted-foreground mt-2">
              Sign in to continue to your account
            </p>
          </div>

          <div className="bg-card rounded-xl shadow-sm p-6 sm:p-8">
            <AuthForm mode="login" />
            <div className="mt-6 text-center text-sm">
              <p className="text-muted-foreground">
                Don't have an account?{' '}
                <Link 
                  to="/register" 
                  className="text-primary font-medium hover:underline"
                >
                  Sign up
                </Link>
              </p>
            </div>
          </div>
        </div>
      </main>
    </PageTransition>
  );
};

export default Login;
