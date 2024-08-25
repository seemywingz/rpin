import React, { useState, useEffect } from 'react';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Container from '@mui/material/Container';
import Setting from './settings/Setting';
import Pins from './pins/Pins';

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
    secondary: {
      main: "#333",
    },
    error: {
      main: "#ff3838",
    },
  },
});

function App() {
  const [config, setConfig] = useState(null);
  const port = process.env.API_PORT | 8080;

  useEffect(() => {

    fetch(`http://localhost:${port}/api/config`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        setConfig(data);
        console.log("Config:", data);
      })
      .catch((error) => console.error('Error loading configuration:', error));
  }, [port]);

  return (
    <ThemeProvider theme={theme}>
      <Setting
        content={"VMON"}
        sx={{
          backgroundColor: 'secondary.light',
          color: 'primary.main',
          fontSize: '3em',
          height: '9vh',
          zIndex: 1000,
        }}
      />
      <Container>
        <Pins config={config} />
      </Container>
    </ThemeProvider>
  );
}

export default App;
