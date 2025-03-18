
import React from 'react';
import { createTheme, ThemeProvider as MUIThemeProvider, CssBaseline } from '@mui/material';

// Custom theme with purple primary color
const theme = createTheme({
  palette: {
    primary: {
      main: '#8B5CF6', // Vivid purple
    },
    secondary: {
      main: '#D946EF', // Magenta pink
    },
    error: {
      main: '#F97316', // Bright orange
    },
    info: {
      main: '#0EA5E9', // Ocean blue
    },
    background: {
      default: '#FFFFFF',
      paper: '#F6F6F7',
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontWeight: 700,
      fontSize: '2.5rem',
    },
    h2: {
      fontWeight: 700,
      fontSize: '2rem',
    },
    h3: {
      fontWeight: 600,
      fontSize: '1.75rem',
    },
    h4: {
      fontWeight: 600,
      fontSize: '1.5rem',
    },
    h5: {
      fontWeight: 600,
      fontSize: '1.25rem',
    },
    h6: {
      fontWeight: 600,
      fontSize: '1rem',
    },
    button: {
      textTransform: 'none',
    }
  },
  shape: {
    borderRadius: 8,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          fontWeight: 600,
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        },
      },
    },
  },
});

interface ThemeProviderProps {
  children: React.ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const childrenWithoutProps = React.Children.map(children, child => {
    if (React.isValidElement(child)) {
      const props = {...child.props};
      
      const keysToRemove = [
        'data-lov-id',
        'data-lov-name',
        'data-component-path',
        'data-component-line',
        'data-component-file', 
        'data-component-name',
        'data-component-content'
      ];
      
      keysToRemove.forEach(key => {
        if (key in props) {
          delete props[key];
        }
      });
      
      return React.cloneElement(child, props);
    }
    return child;
  });
  
  return (
    <MUIThemeProvider theme={theme}>
      <CssBaseline />
      {childrenWithoutProps}
    </MUIThemeProvider>
  );
};
