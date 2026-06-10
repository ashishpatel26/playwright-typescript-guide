import React from 'react';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { tokens } from '../../theme/tokens';

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: { main: tokens.ember, contrastText: tokens.bg },
    secondary: { main: tokens.violet },
    background: { default: tokens.bg, paper: tokens.panel },
    text: { primary: tokens.ink, secondary: tokens.muted },
    divider: tokens.line,
    error: { main: tokens.emberSoft },
    success: { main: tokens.green },
    warning: { main: tokens.amber },
    info: { main: tokens.blue },
  },
  typography: {
    fontFamily: '"Inter", system-ui, sans-serif',
    h5: { fontFamily: '"Bricolage Grotesque","Inter",system-ui,sans-serif', fontWeight: 700 },
    h6: { fontFamily: '"Bricolage Grotesque","Inter",system-ui,sans-serif', fontWeight: 600 },
  },
  shape: { borderRadius: 14 },
  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          backgroundColor: tokens.panel,
          border: `1px solid ${tokens.line}`,
        },
      },
    },
    MuiButton: {
      defaultProps: { disableElevation: true },
      styleOverrides: {
        containedPrimary: { color: tokens.bg, fontWeight: 700 },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: { fontFamily: '"IBM Plex Mono",monospace', fontSize: 11 },
      },
    },
  },
});

export function MuiProvider({ children }: { children: React.ReactNode }) {
  return <ThemeProvider theme={theme}>{children}</ThemeProvider>;
}
