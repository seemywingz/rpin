import React from "react";
import { useState } from "react";
import Switch from '@mui/material/Switch';
import FormControlLabel from '@mui/material/FormControlLabel';

export default function Pin({ props, config }) {
    const [isOn, setIsOn] = useState(props.on);

    const handleChange = (event) => {
        setIsOn(event.target.checked);
        fetch("http://" + config.hostname + ":" + config.port + "/api/pin", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                name: props.name,
                on: event.target.checked,
                num: props.pin,
                mode: props.mode,
            }),
        });
    };

    return (
        <FormControlLabel
            labelPlacement="top"
            label={props.name}
            control={<Switch checked={isOn} onChange={handleChange} />}
            value={isOn}
        />
    );
}

