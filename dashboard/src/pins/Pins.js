import React, { useState, useEffect } from "react";
import Pin from "./Pin";

export default function Pins({ config }) {
    const [pins, setPins] = useState({}); // Initialize with an empty object

    useEffect(() => {
        if (config && config.pins) {
            setPins(config.pins);
        }
    }, [config]);

    const handleDeletePin = (pinNum) => {
        const updatedPins = { ...pins };
        delete updatedPins[pinNum];
        setPins(updatedPins);
    };

    if (!pins || Object.keys(pins).length === 0) {
        return null; // Return null if pins are not available or empty
    }

    // Map over the keys of the pins object
    const pinElements = Object.keys(pins).map((key) => {
        const pin = pins[key];
        console.log("Pin", pin);
        return <Pin key={key} pinNum={key} props={pin} config={config} onDelete={handleDeletePin} />;
    });

    return (
        <div>
            {pinElements}
        </div>
    );
}
