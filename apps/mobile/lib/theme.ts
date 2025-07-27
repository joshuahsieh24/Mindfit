export const theme = {
  colors: {
    // Dark mode colors
    background: '#1C1C1E',
    surface: '#2C2C2E',
    surfaceVariant: '#3A3A3C',
    primary: '#007AFF',
    secondary: '#5856D6',
    accent: '#FF9500',
    error: '#FF453A',
    success: '#34C759',
    warning: '#FFCC02',
    
    // Text colors
    text: {
      primary: '#FFFFFF',
      secondary: '#EBEBF5',
      muted: '#8E8E93',
      accent: '#007AFF',
    },
    
    // Border colors
    border: {
      primary: '#48484A',
      secondary: '#636366',
    },
  },
  
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 48,
  },
  
  borderRadius: {
    sm: 8,
    md: 12,
    lg: 16,
    xl: 24,
  },
  
  typography: {
    h1: {
      fontSize: 32,
      fontWeight: 'bold',
      lineHeight: 40,
    },
    h2: {
      fontSize: 24,
      fontWeight: '600',
      lineHeight: 32,
    },
    h3: {
      fontSize: 20,
      fontWeight: '600',
      lineHeight: 28,
    },
    body: {
      fontSize: 16,
      lineHeight: 24,
    },
    caption: {
      fontSize: 14,
      lineHeight: 20,
    },
    label: {
      fontSize: 14,
      fontWeight: '500',
      lineHeight: 20,
    },
  },
  
  shadows: {
    small: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.2,
      shadowRadius: 2,
      elevation: 2,
    },
    medium: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
      elevation: 5,
    },
    large: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 6.27,
      elevation: 8,
    },
  },
} as const;

export type Theme = typeof theme; 