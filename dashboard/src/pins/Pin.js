import React, { useState } from "react";
import Switch from '@mui/material/Switch';
import FormControlLabel from '@mui/material/FormControlLabel';

export default function Pin({ name, props, config }) {
    const [isOn, setIsOn] = useState(props.on);

    const handleChange = (event) => {
        setIsOn(event.target.checked);
        fetch(`http://${config.hostname}:${config.port}/api/pin`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                name: name,  // use the key name here
                on: event.target.checked,
                num: props.num,
                mode: props.mode,
            }),
        });
    };

    return (
        <FormControlLabel
            labelPlacement="top"
            label={name}  // Display the key name as the label
            control={<Switch checked={isOn} onChange={handleChange} />}
            value={isOn}
        />
    );
}
