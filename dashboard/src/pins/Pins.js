import React from "react";
import Pin from "./Pin";

export default function Pins({ config }) {
    if (!config || !config.pins) {
        return null; // Return null if config or config.pins is not available
    }

    // Map over the keys of the pins object
    const pins = Object.keys(config.pins).map((key) => {
        const pin = config.pins[key];
        console.log("Pin", pin);
        return <Pin key={key} name={key} props={pin} config={config} />;
    });

    return (
        <div>
            {pins}
        </div>
    );
}
