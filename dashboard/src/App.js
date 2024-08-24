import React, { useState, useEffect } from 'react';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import SettingsSelector from './selectors/SettingsSelector';
import Setting from './settings/Setting';
import Switch from './Switch';

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
  "switches": [
    {
      "name": "light",
      "pin": 12,
      "on": false
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
      fetch('/config')
        .then((response) => response.json())
        .then((data) => {
          setConfig(data);
        })
        .catch((error) => console.error('Error loading configuration:', error));
      console.log("config", config);
    }
  }, []);

  function switches() {
    if (config) {
      const switches = [];
      for (var key in config.switches) {
        var sw = config.switches[key];
        console.log("Switch", sw);
        switches.push(
          <Switch key={key} config={sw} />
        );
      }
      return switches;
    } else {
      return [];
    }
  }

  return (
    <ThemeProvider theme={theme}>
      <Setting content={"VMON"} sx={{
        backgroundColor: '#333',
        fontSize: '3em',
        height: '9vh',
        zIndex: 1000,
      }} />
      <SettingsSelector config={config} />
      {switches()}
    </ThemeProvider>
  );
}
export default App;
