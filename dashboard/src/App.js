import * as React from 'react';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import SettingsSelector from './selectors/SettingsSelector';
import { Box } from '@mui/material';

// Define the theme
const theme = createTheme({

  typography: {
    fontFamily: [
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
      '"Apple Color Emoji"',
      '"Segoe UI Emoji"',
      '"Segoe UI Symbol"',
    ].join(','),
  },

  palette: {
    mode: 'dark',
    primary: {
      main: "#38ffb9",
    },
  },

});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <Box // Header
        sx={{
          height: '9vh',
          // color: 'primary.main',
          backgroundColor: '#333',
          textAlign: 'center',
          zIndex: 1000,
          fontSize: '3em',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        VMON
      </Box>
      <SettingsSelector />
    </ThemeProvider>
  );
}
export default App;
