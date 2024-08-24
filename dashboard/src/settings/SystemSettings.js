import React, { useState } from 'react';

function SystemSettings({ config, updateConfig, saveConfig }) {


    return (
        <div class="setting">
            <button id="redButton" onClick={() => { alert("Restarting") }} >Restart</button>
        </div >
    );
}

export default SystemSettings;