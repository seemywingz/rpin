import React, { useState, useRef } from "react";
import Switch from '@mui/material/Switch';
import FormControlLabel from '@mui/material/FormControlLabel';
import { Container, IconButton, Menu, MenuItem, TextField, FormControl, InputLabel, Select, Slider, Typography } from "@mui/material";
import {
    SettingsIcon,
    DeleteIcon,
    InputIcon,
    OutputIcon
} from '@mui/icons-material';

export default function Pin({ pinNum, props, onUpdate, config }) {
    const [isOn, setIsOn] = useState(props.on);
    const [name, setName] = useState(props.name);
    const [mode, setMode] = useState(props.mode);
    const [hz, setHz] = useState(props.hz || 4688); // Default frequency to 4688 if undefined
    const [duty, setDuty] = useState(props.duty || 0); // Default duty length to 0 if undefined
    const [cycle, setCycle] = useState(props.cycle || 128); // Default cycle length to 128 if undefined
    const [anchorEl, setAnchorEl] = useState(null);
    const [dutyMax, setDutyMax] = useState(2500);
    const [dutyMin, setDutyMin] = useState(550);
    const containerRef = useRef(null);

    const updatePinState = (newState) => {
        const pinState = {
            on: isOn,
            name: name,
            num: parseInt(pinNum, 10),
            mode: mode,
            hz: parseInt(hz, 10),
            duty: duty,
            cycle: cycle,
            ...newState, // Override with any new state values passed
        };
        onUpdate(pinState, "POST");
    };

    const handleChange = (event) => {
        const newIsOn = event.target.checked;
        setIsOn(newIsOn);
        updatePinState({ on: newIsOn });
    };

    const handleNameChange = (event) => {
        const newName = event.target.value;
        setName(newName);
    };

    const handleNameSubmit = () => {
        updatePinState({ name });
        handleMenuClose();
    };

    const handleMenuOpen = () => {
        setAnchorEl(containerRef.current);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    const handleDelete = () => {
        const pinState = {
            num: parseInt(pinNum, 10),
        };
        onUpdate(pinState, "DELETE");
        handleMenuClose();
    };

    const handleModeChange = (event) => {
        const newMode = event.target.value;
        setMode(newMode);
        updatePinState({ mode: newMode });
    };

    const handleFrequencyChange = (event) => {
        const newFrequency = event.target.value;
        setHz(newFrequency);
        updatePinState({ hz: newFrequency });
    };

    const handleDutyChange = (event, newValue) => {
        setDuty(newValue);
        if (mode === "servo") {
            setCycle(cycle);
            setHz(hz);
            updatePinState({ duty: newValue });
        } else {
            updatePinState({ duty: newValue });
        }
    };

    const handleCycleLenChange = (event, newValue) => {
        setCycle(newValue);
        updatePinState({ cycle: newValue });
    };

    return (
        <Container
            ref={containerRef}
            sx={{
                padding: '10px',
                margin: '10px',
                border: '1px solid',
                backgroundColor: anchorEl ? 'primary.dark' : (isOn ? 'secondary.light' : 'secondary.dark'),
                borderColor: isOn ? 'primary.main' : 'secondary.main',
                borderRadius: '5px',
                position: 'relative',
                maxWidth: '200px',
            }}
        >
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

                (<SettingsIcon sx={{
                    color: isOn ? 'primary.dark' : 'secondary.light',
                }} />)

                <Typography sx={{ textAlign: 'left', fontSize: "1e" }}>
                    {mode.toUpperCase()}
                </Typography>
            </IconButton>
            <Menu
                id="pin-settings-menu"
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'center',
                }}
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'center',
                }}
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
                            value={mode}
                            label="Mode"
                            onChange={handleModeChange}
                        >
                            <MenuItem value="in">Input</MenuItem>
                            <MenuItem value="out">Output</MenuItem>
                            <MenuItem value="pwm">PWM</MenuItem>
                            <MenuItem value="spi">SPI</MenuItem>
                            <MenuItem value="clock">Clock</MenuItem>
                            <MenuItem value="alt0">Alt0</MenuItem>
                            <MenuItem value="alt1">Alt1</MenuItem>
                            <MenuItem value="alt2">Alt2</MenuItem>
                            <MenuItem value="alt3">Alt3</MenuItem>
                            <MenuItem value="alt4">Alt4</MenuItem>
                            <MenuItem value="alt5">Alt5</MenuItem>
                        </Select>
                    </FormControl>
                </MenuItem>

                {mode === 'pwm' && (
                    <Container>
                        <MenuItem>
                            <TextField
                                id="standard-basic"
                                label="Frequency (Hz)"
                                variant="outlined"
                                value={hz}
                                onChange={handleFrequencyChange}
                            />
                        </MenuItem>
                        <MenuItem>
                            <TextField
                                id="standard-basic"
                                label="Min Duty (µs)"
                                variant="outlined"
                                value={dutyMin}
                                onChange={(e) => setDutyMin(e.target.value)}
                            />
                        </MenuItem>
                        <MenuItem>
                            <TextField
                                id="standard-basic"
                                label="Max Duty (µs)"
                                variant="outlined"
                                value={dutyMax}
                                onChange={(e) => setDutyMax(e.target.value)}
                            />
                        </MenuItem>
                        <MenuItem>
                            <TextField
                                id="standard-basic"
                                label="Cycle (µs)"
                                variant="outlined"
                                value={cycle}
                                onChange={handleCycleLenChange}
                            />
                        </MenuItem>
                    </Container>
                )}

                <MenuItem onClick={handleDelete}>
                    <DeleteIcon color="error" />
                </MenuItem>
            </Menu>
            <FormControlLabel
                labelPlacement="top"
                label={name || pinNum}
                control={<Switch checked={isOn} onChange={handleChange} disabled={props.mode === "in"} />}
                value={isOn}
            />

            {mode === 'pwm' && (
                <Container sx={{ marginTop: '10px' }}>
                    <Slider
                        value={duty}
                        onChange={handleDutyChange}
                        aria-labelledby="duty-length-slider"
                        min={parseInt(dutyMin, 10)}
                        max={parseInt(dutyMax, 10)}
                        valueLabelDisplay="auto"
                    />
                </Container>
            )}
        </Container>
    );
}
