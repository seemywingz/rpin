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
  },
});

const defaultConfig = {
  devport: 3000,
  dir: "./srv",
  hostname: "10.0.0.59",
  pins: [
    {
      name: "Light 1",
      on: false,
      pin: 16,
    },
    {
      name: "Light 2",
      on: false,
      pin: 12,
    },
  ],
  port: 8080,
};

function App() {
  const [config, setConfig] = useState(null); // Initialize state with null
  const hostname = process.env.API_HOST || "10.0.0.59"; // Fix typo and add fallback
  const port = process.env.API_PORT || 8080;

  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      console.log("Using default configuration");
      setConfig(defaultConfig);
    } else {
      fetch(`http://${hostname}:${port}/api/config`)
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
    }
  }, [hostname, port]);

  return (
    <ThemeProvider theme={theme}>
      <Setting
        content={"VMON"}
        sx={{
          backgroundColor: '#333',
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
