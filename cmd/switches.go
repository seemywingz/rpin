package cmd

import (
	"fmt"
	"net/http"

	"github.com/seemywingz/gotoolbox/gtb"
	"github.com/spf13/viper"
)

type Switch struct {
	Name   string
	On     bool
	PinNum int
	Pin    *GPIOPin
}

var switches = []Switch{}

func initSwitches() {
	switchConfigs := viper.Get("switches").([]interface{})

	for _, config := range switchConfigs {
		// Assert the config to the appropriate type (map[string]interface{})
		switchConfig := config.(map[string]interface{})

		// Extract the pin number, name, and on status
		pinNum := int(switchConfig["pin"].(float64)) // Viper may interpret numbers as float64
		name := switchConfig["name"].(string)
		on := switchConfig["on"].(bool)

		// Create a new GPIO pin for the switch
		pin, err := NewGPIOPin(pinNum)
		if err != nil {
			gtb.EoE(err) // Handle error gracefully
			continue
		}

		// Create the Switch object and append it to the switches slice
		sw := Switch{
			Name:   name,
			On:     on,
			PinNum: pinNum,
			Pin:    pin,
		}

		if sw.On {
			sw.Pin.On()
		} else {
			sw.Pin.Off()
		}

		switches = append(switches, sw)
	}

	// Optionally, print out the initialized switches for debugging purposes
	for _, sw := range switches {
		fmt.Printf("Initialized switch: %s, on: %v, Pin: %d\n", sw.Name, sw.On, sw.PinNum)
	}
}

func handleSwitch(w http.ResponseWriter, r *http.Request) {
	if r.Method == http.MethodGet {
	}

	if r.Method == http.MethodPost {
	}
}
