import React, { useState, useRef } from "react";
import Switch from '@mui/material/Switch';
import FormControlLabel from '@mui/material/FormControlLabel';
import { Container, IconButton, Menu, MenuItem, TextField, FormControl, InputLabel, Select, Slider, Typography } from "@mui/material";
import SettingsIcon from '@mui/icons-material/Settings';
import DeleteIcon from '@mui/icons-material/Delete';

export default function Pin({ pinNum, props, onUpdate }) {
    const [isOn, setIsOn] = useState(props.on);
    const [name, setName] = useState(props.name);
    const [mode, setMode] = useState(props.mode);
    const [frequency, setFrequency] = useState(props.hz || 4688); // Default frequency to 4688 if undefined
    const [dutyLen, setDutyLen] = useState(props.duty || 0); // Default duty length to 0 if undefined
    const [cycleLen, setCycleLen] = useState(props.cycle || 128); // Default cycle length to 128 if undefined
    const [anchorEl, setAnchorEl] = useState(null);
    const containerRef = useRef(null);

    const updatePinState = (newState) => {
        const pinState = {
            on: isOn,
            name: name,
            num: parseInt(pinNum, 10),
            mode: mode,
            hz: parseInt(frequency, 10),
            duty: dutyLen,
            cycle: cycleLen,
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
        setFrequency(newFrequency);
        updatePinState({ frequency: newFrequency });
    };

    const handleDutyLenChange = (event, newValue) => {
        setDutyLen(newValue);
        updatePinState({ dutyLen: newValue });
    };

    const handleCycleLenChange = (event, newValue) => {
        setCycleLen(newValue);
        updatePinState({ cycleLen: newValue });
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
                <SettingsIcon sx={{
                    color: isOn ? 'primary.dark' : 'secondary.light',
                }} />
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

            {mode === 'pwm' && (
                <Container sx={{ marginTop: '10px' }}>
                    <TextField
                        label="(Hz)"
                        value={frequency}
                        onChange={handleFrequencyChange}
                        inputProps={{ min: 4688, max: 19200000 }}
                        fullWidth
                    />
                    <Typography gutterBottom>Duty (µs)</Typography>
                    <Slider
                        value={dutyLen}
                        onChange={handleDutyLenChange}
                        aria-labelledby="duty-length-slider"
                        min={3}
                        max={cycleLen}
                        valueLabelDisplay="auto"
                    />
                    <Typography gutterBottom>Cycle (µs)</Typography>
                    <Slider
                        value={cycleLen}
                        onChange={handleCycleLenChange}
                        aria-labelledby="cycle-length-slider"
                        min={10000}
                        max={40000} // Example max for a typical PWM range
                        valueLabelDisplay="auto"
                    />
                </Container>
            )}
        </Container>
    );
}
