export const theme = {
  spacing: {
    xxs: 2,
    xs: 4,
    sm: 8,
    md: 12,
    lg: 20,
    xl: 24,
    xxl: 32,
  },

  cornerRadius: {
    sm: 8,
    md: 12,
    lg: 16,
    xl: 20,
  },

  iconSize: {
    sm: 16,
    md: 20,
    lg: 24,
    xl: 30,
    xxl: 40,
    xxxl: 50,
    huge: 60,
  },

  colors: {
    primaryAction: '#007AFF',
    destructive: '#FF3B30',
    warning: '#FF9500',
    success: '#34C759',

    // Category colors
    categoryColors: [
      '#007AFF', // blue
      '#AF52DE', // purple
      '#FF2D55', // pink
      '#5856D6', // indigo
      '#5AC8FA', // teal
      '#32ADE6', // cyan
      '#34C759', // green
      '#00C7BE', // mint
      '#FF9500', // orange
      '#FFCC00', // yellow
      '#FF3B30', // red
      '#A2845E', // brown
    ],
  },

  fontWeight: {
    light: '300' as const,
    regular: '400' as const,
    medium: '500' as const,
    semibold: '600' as const,
    bold: '700' as const,
  },

  animation: {
    fast: 200,
    standard: 300,
    slow: 500,
  },
} as const;
