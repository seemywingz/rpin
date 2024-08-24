import React from 'react';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Setting from '../Setting';

export default function SystemSettings({ config }) {

    const handleRestart = () => {
        alert("Restarting the system...");
    }

    return (
        <Box >
            <Setting content={"Port: " + config.port} />
            <Button variant="contained" color="primary" onClick={handleRestart}>
                Restart
            </Button>
        </Box >
    );
}
