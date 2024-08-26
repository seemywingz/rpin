import React, { useState } from "react";
import Switch from '@mui/material/Switch';
import FormControlLabel from '@mui/material/FormControlLabel';
import { Container, IconButton, Menu, MenuItem } from "@mui/material";
import SettingsIcon from '@mui/icons-material/Settings';
import DeleteIcon from '@mui/icons-material/Delete';

export default function Pin({ pinNum, props, onUpdate }) {
    const [isOn, setIsOn] = useState(props.on);
    const [anchorEl, setAnchorEl] = useState(null);

    const handleChange = (event) => {
        const newIsOn = event.target.checked;
        setIsOn(newIsOn); // Update local state
        const pinState = {
            on: newIsOn,
            name: props.name,
            num: parseInt(pinNum, 10),
            mode: props.mode,
        };
        // Send the entire state to the server with the POST method
        onUpdate(pinState, "POST");
    };

    const handleMenuOpen = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    const handleDelete = () => {
        const pinState = {
            on: isOn,
            name: props.name,
            num: parseInt(pinNum, 10),
            mode: props.mode,
        };
        // Send the DELETE request to the server
        onUpdate(pinState, "DELETE");
        handleMenuClose();
    };

    return (
        <Container sx={{
            padding: '10px',
            margin: '10px',
            border: '1px solid',
            backgroundColor: isOn ? 'secondary.light' : 'secondary.dark',
            borderColor: isOn ? 'primary.main' : 'secondary.main',
            borderRadius: '5px',
            position: 'relative',
            maxWidth: '100px',
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
                    color: isOn ? 'primary.dark' : 'secondary.light',
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
