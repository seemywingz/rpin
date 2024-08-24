import * as React from 'react';
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import SystemSettings from '../settings/SystemSettings';

export default function SettingsSelector({ config }) {
    const [setting, setSetting] = React.useState('');

    const handleChange = (event) => {
        setSetting(event.target.value);
    };

    const displaySettings = () => {
        if (setting === "system") {
            return <SystemSettings config={config} />;
        } else if (setting === "wifi") {
            return <div>WiFi Settings</div>;
        } else {
            return null;
        }
    };

    return (
        <Box >
            <FormControl variant='filled' sx={{ m: 1, minWidth: 120 }} >
                <InputLabel id="settings-select-label" color='primary'>Settings</InputLabel>
                <Select
                    labelId="settings-select-label"
                    onChange={handleChange}
                    id="settings-select"
                    label="Settings"
                    value={setting}
                >
                    <MenuItem value={"none"}>Hide</MenuItem>
                    <MenuItem value={"system"}>System</MenuItem>
                    <MenuItem value={"wifi"}>WiFi</MenuItem>
                </Select>
            </FormControl>
            {displaySettings()}
        </Box>
    );
}