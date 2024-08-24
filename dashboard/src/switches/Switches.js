import React from "react";
import IOSwitch from "./IOSwitch";

export default function Switches({ config }) {
    if (!config || !config.switches) {
        return null; // Return null if config or config.switches is not available
    }

    const switches = [];

    for (var key in config.switches) {
        var sw = config.switches[key];
        console.log("Switch", sw);
        switches.push(
            <IOSwitch key={key} config={sw} />
        );
    }

    return (
        <div>
            {switches}
        </div>
    );
}