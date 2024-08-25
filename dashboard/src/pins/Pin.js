import React, { useState } from "react";
import Switch from '@mui/material/Switch';
import FormControlLabel from '@mui/material/FormControlLabel';
import { Container, IconButton, Menu, MenuItem } from "@mui/material";
import SettingsIcon from '@mui/icons-material/Settings';
import DeleteIcon from '@mui/icons-material/Delete';

export default function Pin({ pinNum, props, config }) {
    const [isOn, setIsOn] = useState(props.on);
    const [anchorEl, setAnchorEl] = useState(null);

    const handleChange = (event) => {
        setIsOn(event.target.checked);
        fetch(`http://${config.hostname}:${config.port}/api/pin`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                name: props.name,
                on: event.target.checked,
                num: parseInt(pinNum, 10),
                mode: props.mode,
            }),
        });
    };

    const handleMenuOpen = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    const handleDelete = () => {
        // Handle the delete action here
        console.log(`Deleting pin ${pinNum}`);
        handleMenuClose();
    };

    return (
        <Container sx={{
            display: 'inline-block',
            padding: '10px',
            margin: '10px',
            border: '1px solid',
            backgroundColor: isOn ? 'secondary.light' : 'secondary.dark',
            borderColor: isOn ? 'primary.main' : 'secondary.main',
            borderRadius: '5px',
            maxWidth: '150px',
            position: 'relative',
        }}>
            <IconButton
                aria-controls="settings-menu"
                aria-haspopup="true"
                onClick={handleMenuOpen}
                sx={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    margin: '5px',
                    maxHeight: '9px',
                }}
            >
                <SettingsIcon sx={{
                    color: isOn ? 'primary.main' : 'secondary.light',
                }} />
            </IconButton>
            <Menu
                id="settings-menu"
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
            >
                <MenuItem onClick={handleDelete}><DeleteIcon color="error" /></MenuItem>
            </Menu>
            <FormControlLabel
                labelPlacement="top"
                label={props.name || pinNum}
                control={<Switch checked={isOn} onChange={handleChange} />}
                value={isOn}
            />
        </Container>
    );
}
