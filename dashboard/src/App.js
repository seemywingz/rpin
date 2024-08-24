import React, { useState, useEffect } from 'react';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import SettingsSelector from './selectors/SettingsSelector';
import { Box } from '@mui/material';
import Setting from './Setting';

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

var defaultConfig = {
  "port": 80,
  "dir": "./srv",
  "switches": {
    "light": {
      "pin": 12,
      "enabled": true
    },
    "fan": {
      "pin": 18,
      "enabled": false
    }
  }
}

function App() {
  var [config, setConfig] = useState(null);

  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      console.log("Using default configuration");
      setConfig(defaultConfig);
    } else {
      fetch('/config')
        .then((response) => response.json())
        .then((data) => {
          setConfig(data);
        })
        .catch((error) => console.error('Error loading configuration:', error));
      console.log("config", config);
    }
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <Setting content={"VMON"} sx={{
        backgroundColor: '#333',
        fontSize: '3em',
        height: '9vh',
        zIndex: 1000,
      }} />
      <SettingsSelector config={config} />
    </ThemeProvider>
  );
}
export default App;
