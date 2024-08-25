import React, { useState } from "react";
import Switch from '@mui/material/Switch';
import FormControlLabel from '@mui/material/FormControlLabel';

export default function Pin({ pinNum, props, config }) {
    const [isOn, setIsOn] = useState(props.on);

    const handleChange = (event) => {
        setIsOn(event.target.checked);
        fetch(`http://${config.hostname}:${config.port}/api/pin`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                name: props.name,  // use the name property
                on: event.target.checked,
                num: parseInt(pinNum, 10),  // ensure the num is sent as an integer
                mode: props.mode,
            }),
        });
    };

    return (
        <FormControlLabel
            labelPlacement="top"
            label={props.name || pinNum}  // Display the name as the label
            control={<Switch checked={isOn} onChange={handleChange} />}
            value={isOn}
        />
    );
}
