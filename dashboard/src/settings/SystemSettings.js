import React, { useState } from 'react';
import Button from '@mui/material/Button';

function SystemSettings({ config, updateConfig, saveConfig }) {
    const [localConfig, setLocalConfig] = useState(config);

    const handleRestart = () => {
        // Perform restart system action
        alert("Restarting the system...");
    }

    return (
        <div className="container">
            <div className='setting'>
                <Button variant="contained" color="primary" onClick={handleRestart}>
                    Restart
                </Button>
            </div>
        </div >
    );
}

export default SystemSettings;