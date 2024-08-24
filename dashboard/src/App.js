import React, { useState, useEffect } from 'react';
import SystemSettings from './settings/SystemSettings';

var defaultConfig = {
  "version": "1.0.0",
  "mode": "client",
  "mdns": "litbox",
  "client": {
    "ssid": "connectedness",
    "password": "ReallyLongPassword123!@#"
  },
  "ap": {
    "ssid": "LitBox",
    "password": "abcd1234"
  },
  "brightness": 9,
  "sensitivity": 9,
  "visualization": "bars",
  "frameRate": 30,
  "temperatureUnit": "C",
  "colorPallet": ['#0000FF', '#00FFFF', '#FF00D5', '#FFFFFF'],
  pixelBgColor: "#000000",
  pixelColor: "#f5f0f0",
  "text": {
    "content": "*.*. Lit Box .*.*",
    "animation": "scroll",
    "speed": "75",
    "size": "1"
  }
};

function App() {
  var [config, setConfig] = useState(null);
  const [selectedSetting, setSelectedSetting] = useState('bars');  // Default to 'about'

  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      setConfig(defaultConfig);
      setSelectedSetting(defaultConfig.visualization);
    } else {
      fetch('/config')
        .then((response) => response.json())
        .then((data) => {
          setConfig(data);
          setSelectedSetting(data.visualization);
        })
        .catch((error) => console.error('Error loading configuration:', error));
    }
  }, []);

  const saveConfig = (newConfig) => {
    fetch('/saveConfig')
      .then(response => {
        if (!response.ok) throw new Error('Failed to save configuration');
        return response.json();
      }).then(data => {
        setConfig(newConfig);
        console.log('Configuration updated:', data);
        alert('Configuration Saved');
      }).catch(error => console.error('Error updating configuration:', error));
  };

  const updateConfig = (newConfig) => {
    fetch('/config', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newConfig),
    }).then(response => {
      if (!response.ok) throw new Error('Failed to update configuration');
      return response.json();
    }).then(data => {
      setConfig(newConfig);
      console.log('Configuration Returned:', data);
      // alert('Configuration updated');
    }).catch(error => console.error('Error updating configuration:', error));
  };

  if (!config) {
    return (
      <div className="container">
        <label className="header">Lit Box</label>
        <div>Loading configuration... ⚙️</div>
      </div>
    );
  }

  const renderSetting = () => {
    switch (selectedSetting) {
      case 'system':
        return <SystemSettings config={config} updateConfig={updateConfig} saveConfig={saveConfig} />;
      case 'about':
        return <div class="setting" id="about-settings">

          <div class="setting">
            <label>Version</label>
            <label id="version">{config.version}</label>
          </div>

          <div class="setting">
            <label>Designed and Developed by:</label>
            <a href="https://github.com/seemywingz/vmon"
              target="_blank" id="SeeMyWingZ" rel="noreferrer">SeeMyWingZ</a>
          </div>

        </div>;
      default:
        return <div>🛠️ Under Construction 🛠️</div>;
    }
  };

  return (
    <div className="container">
      <label className="header">VMON</label>
      <div className="setting">
        <select
          id="settingSelect"
          className="clickable"
          value={selectedSetting}
          onChange={(e) => setSelectedSetting(e.target.value)}
        >
          <option value="system">System</option>
          <option value="about">About</option>
        </select>
      </div>
      {renderSetting()}
    </div>
  );
}

export default App;