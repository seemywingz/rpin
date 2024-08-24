import React, { useState } from "react";
import Setting from "./settings/Setting";



export default function Switch({ config }) {
    // const [name, setName] = useState(config.name);

    return (
        <Setting content={"Switch: " + config.name} />
    );
}

