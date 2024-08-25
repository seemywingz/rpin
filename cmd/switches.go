package cmd

import (
	"encoding/json"
	"log"
	"net/http"

	"github.com/seemywingz/gotoolbox/gtb"
	"github.com/spf13/viper"
	"github.com/stianeikeland/go-rpio/v4"
)

type Switch struct {
	Name   string
	On     bool
	PinNum int
	Pin    *rpio.Pin
}

var switches = make(map[string]Switch)

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
		pin, err := NewGPIOPin(pinNum, rpio.Output)
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
			sw.Pin.High()
		} else {
			sw.Pin.Low()
		}

		switches[name] = sw
	}

	// Optionally, print out the initialized switches for debugging purposes
	for _, sw := range switches {
		log.Printf("Initialized switch: %s, on: %v, Pin: %d\n", sw.Name, sw.On, sw.PinNum)
	}
}

func handleSwitch(w http.ResponseWriter, r *http.Request) {
	if r.Method == http.MethodGet {
	}

	if r.Method == http.MethodPost {
		// Parse the request body
		var req struct {
			Name string `json:"name"`
			On   bool   `json:"on"`
		}

		err := json.NewDecoder(r.Body).Decode(&req)
		if err != nil {
			http.Error(w, "Failed to parse JSON", http.StatusBadRequest)
			log.Printf("Failed to parse JSON: %v", err)
			return
		}

		// Find the switch by name
		sw, ok := switches[req.Name]
		if !ok {
			http.Error(w, "Switch not found", http.StatusNotFound)
			log.Printf("Switch not found: %s", req.Name)
			return
		}

		// Toggle the switch
		if req.On {
			sw.Pin.High()
		} else {
			sw.Pin.Low()
		}

		// Update the switch state
		sw.On = req.On
		switches[req.Name] = sw

		// format the config to save to the config file
		var switchConfigs []interface{}
		for _, sw := range switches {
			switchConfigs = append(switchConfigs, map[string]interface{}{
				"name": sw.Name,
				"on":   sw.On,
				"pin":  sw.PinNum,
			})
		}

		// Update the config file
		viper.Set("switches", switchConfigs)
		viper.WriteConfig()

		// Write a response
		w.WriteHeader(http.StatusOK)
		w.Write([]byte("Switch toggled"))

	}
}
