import React from "react";
import Pin from "./Pin";

export default function Pins({ config }) {
    if (!config || !config.pins) {
        return null; // Return null if config or config.switches is not available
    }

    const switches = [];

    for (var key in config.pins) {
        var sw = config.pins[key];
        console.log("Switch", sw,);
        switches.push(
            <Pin key={key} props={sw} config={config} />
        );
    }

    return (
        <div>
            {switches}
        </div>
    );
}