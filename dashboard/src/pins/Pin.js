import React, { useState } from "react";
import Switch from '@mui/material/Switch';
import FormControlLabel from '@mui/material/FormControlLabel';
import { Container, IconButton, Menu, MenuItem, TextField, FormControl, InputLabel, Select } from "@mui/material";
import SettingsIcon from '@mui/icons-material/Settings';
import DeleteIcon from '@mui/icons-material/Delete';

export default function Pin({ pinNum, props, onUpdate }) {
    const [isOn, setIsOn] = useState(props.on);
    const [name, setName] = useState(props.name);
    const [anchorEl, setAnchorEl] = useState(null);

    const handleChange = (event) => {
        const newIsOn = event.target.checked;
        setIsOn(newIsOn);
        const pinState = {
            on: newIsOn,
            name: name,
            num: parseInt(pinNum, 10),
            mode: props.mode,
        };
        onUpdate(pinState, "POST");
    };

    const handleNameChange = (event) => {
        const newName = event.target.value;
        setName(newName);
    };

    const handleNameSubmit = () => {
        const pinState = {
            on: isOn,
            name: name,
            num: parseInt(pinNum, 10),
            mode: props.mode,
        };
        onUpdate(pinState, "POST");
        handleMenuClose();
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
            name: name,
            num: parseInt(pinNum, 10),
            mode: props.mode,
        };
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
            maxWidth: '150px',
        }}>
            <IconButton
                aria-controls="pin-settings-menu"
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
                id="pin-settings-menu"
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
            >
                <MenuItem>
                    <TextField
                        id="standard-basic"
                        label="Pin"
                        variant="outlined"
                        value={pinNum}
                        disabled
                    />
                </MenuItem>
                <MenuItem>
                    <TextField
                        id="standard-basic"
                        label="Name"
                        variant="outlined"
                        value={name}
                        onChange={handleNameChange}
                        onBlur={handleNameSubmit}
                    />
                </MenuItem>
                <MenuItem>
                    <FormControl fullWidth variant="outlined">
                        <InputLabel id="mode-select-label">Mode</InputLabel>
                        <Select
                            labelId="mode-select-label"
                            value={props.mode}
                            label="Mode"
                            onChange={(event) => {
                                const pinState = {
                                    on: isOn,
                                    name: name,
                                    num: parseInt(pinNum, 10),
                                    mode: event.target.value,
                                };
                                onUpdate(pinState, "POST");
                            }}
                        >
                            <MenuItem value="in">Input</MenuItem>
                            <MenuItem value="out">Output</MenuItem>
                            <MenuItem value="pwm">PWM</MenuItem>
                        </Select>
                    </FormControl>
                </MenuItem>
                <MenuItem onClick={handleDelete}>
                    <DeleteIcon color="error" />
                </MenuItem>
            </Menu>
            <FormControlLabel
                labelPlacement="top"
                label={name || pinNum}
                control={<Switch checked={isOn} onChange={handleChange} />}
                value={isOn}
            />
        </Container>
    );
}
