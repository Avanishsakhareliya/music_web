
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import { useAuthContext } from '@/context/AuthContext';
import { Eye, EyeOff, Loader2 } from 'lucide-react';

// MUI components
import { 
  TextField, 
  Button, 
  Box, 
  Typography, 
  InputAdornment, 
  IconButton 
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';

// Login schema
const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

// Register schema
const registerSchema = z.object({
  username: z.string().min(3, 'Username must be at least 3 characters'),
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string(),
}).refine(data => data.password === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
});

type LoginFormValues = z.infer<typeof loginSchema>;
type RegisterFormValues = z.infer<typeof registerSchema>;

interface AuthFormProps {
  mode: 'login' | 'register';
}

const AuthForm: React.FC<AuthFormProps> = ({ mode }) => {
  const { login, register: registerUser, isLoading } = useAuthContext();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Use appropriate schema based on mode
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<LoginFormValues | RegisterFormValues>({
    resolver: zodResolver(mode === 'login' ? loginSchema : registerSchema),
    defaultValues: mode === 'login' 
      ? { email: '', password: '' }
      : { username: '', email: '', password: '', confirmPassword: '' }
  });
  
  const toggleShowPassword = () => setShowPassword(!showPassword);
  const toggleShowConfirmPassword = () => setShowConfirmPassword(!showConfirmPassword);

  const onSubmit = async (data: LoginFormValues | RegisterFormValues) => {
    try {
      if (mode === 'login') {
        const { email, password } = data as LoginFormValues;
        await login(email, password);
      } else {
        const { username, email, password } = data as RegisterFormValues;
        await registerUser(username, email, password);
      }
      reset();
    } catch (error) {
      // Error is already handled in AuthContext
      console.error(`${mode} error:`, error);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ width: '100%', maxWidth: '400px' }}>
      {mode === 'register' && (
        <Box sx={{ mb: 2 }}>
          <Typography variant="subtitle1" sx={{ mb: 1 }}>Username</Typography>
          <TextField
            fullWidth
            id="username"
            placeholder="Enter your username"
            {...register('username')}
            error={mode === 'register' && Boolean(errors.username)}
            helperText={mode === 'register' && errors.username?.message}
            variant="outlined"
            size="small"
          />
        </Box>
      )}

      <Box sx={{ mb: 2 }}>
        <Typography variant="subtitle1" sx={{ mb: 1 }}>Email</Typography>
        <TextField
          fullWidth
          id="email"
          type="email"
          placeholder="Enter your email"
          {...register('email')}
          error={Boolean(errors.email)}
          helperText={errors.email?.message}
          variant="outlined"
          size="small"
        />
      </Box>

      <Box sx={{ mb: 2 }}>
        <Typography variant="subtitle1" sx={{ mb: 1 }}>Password</Typography>
        <TextField
          fullWidth
          id="password"
          type={showPassword ? 'text' : 'password'}
          placeholder="Enter your password"
          {...register('password')}
          error={Boolean(errors.password)}
          helperText={errors.password?.message}
          variant="outlined"
          size="small"
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  onClick={toggleShowPassword}
                  edge="end"
                >
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
      </Box>

      {mode === 'register' && (
        <Box sx={{ mb: 2 }}>
          <Typography variant="subtitle1" sx={{ mb: 1 }}>Confirm Password</Typography>
          <TextField
            fullWidth
            id="confirmPassword"
            type={showConfirmPassword ? 'text' : 'password'}
            placeholder="Confirm your password"
            {...register('confirmPassword')}
            error={mode === 'register' && Boolean((errors as any).confirmPassword)}
            helperText={mode === 'register' && (errors as any).confirmPassword?.message}
            variant="outlined"
            size="small"
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label={showConfirmPassword ? 'Hide confirm password' : 'Show confirm password'}
                    onClick={toggleShowConfirmPassword}
                    edge="end"
                  >
                    {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        </Box>
      )}

      <Button 
        type="submit" 
        variant="contained"
        color="primary"
        fullWidth
        disabled={isLoading}
        sx={{ mt: 1 }}
      >
        {isLoading ? (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Loader2 size={16} className="animate-spin" />
            {mode === 'login' ? 'Logging in...' : 'Creating account...'}
          </Box>
        ) : (
          <span>{mode === 'login' ? 'Log in' : 'Create account'}</span>
        )}
      </Button>
    </Box>
  );
};

export default AuthForm;
