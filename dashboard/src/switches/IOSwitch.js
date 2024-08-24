import React from "react";
import { useState } from "react";
import Switch from '@mui/material/Switch';
import FormControlLabel from '@mui/material/FormControlLabel';

export default function IOSwitch({ config }) {
    const [isOn, setIsOn] = useState(config.on);

    const handleChange = (event) => {
        setIsOn(event.target.checked);
    };

    return (
        <FormControlLabel
            labelPlacement="start"
            label={config.name}
            control={<Switch checked={isOn} onChange={handleChange} />}
            value={isOn}
        />
    );
}

