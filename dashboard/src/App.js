import React, { useState, useEffect } from 'react';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import SettingsSelector from './selectors/SettingsSelector';
import Setting from './settings/Setting';
import Switches from './switches/Switches';

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
  "port": 8080,
  "dir": "./srv",
  "switches": [
    {
      "name": "light",
      "pin": 12,
      "on": true
    },
    {
      "name": "fan",
      "pin": 18,
      "on": false
    }
  ]
}

function App() {
  var [config, setConfig] = useState(null);

  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      console.log("Using default configuration");
      setConfig(defaultConfig);
    } else {
      fetch('/api/config')
        .then((response) => response.json())
        .then((data) => {
          setConfig(data);
          console.log("config", data);
        })
        .catch((error) => console.error('Error loading configuration:', error));
    }
  }, []);


  return (
    <ThemeProvider theme={theme}>
      <Setting content={"VMON"} sx={{
        backgroundColor: '#333',
        color: 'primary.main',
        fontSize: '3em',
        height: '9vh',
        zIndex: 1000,
      }} />
      <Switches config={config} />
    </ThemeProvider>
  );
}
export default App;
