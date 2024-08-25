package cmd

import (
	"encoding/json"
	"log"
	"net/http"
	"strconv"

	"github.com/seemywingz/gotoolbox/gtb"
	"github.com/spf13/viper"
	"github.com/stianeikeland/go-rpio/v4"
)

type Pin struct {
	On   bool
	Num  int
	Name string
	Mode string
	GPIO *rpio.Pin
}

var pins = make(map[int]Pin)

func initPins() {
	// Get the pins from the Viper configuration
	pinConfigs := viper.GetStringMap("pins")

	for numStr, config := range pinConfigs {
		// Convert the string key to an integer pin number
		num, err := strconv.Atoi(numStr)
		if err != nil {
			log.Printf("Invalid GPIO number: %s", numStr)
			continue
		}

		// Assert the config to the appropriate type (map[string]interface{})
		pinConfig := config.(map[string]interface{})

		// Extract the on status, mode, and name
		on := pinConfig["on"].(bool)
		mode := pinConfig["mode"].(string)
		name := ""
		if nameValue, ok := pinConfig["name"]; ok {
			name = nameValue.(string)
		}

		// Create a new GPIO pin for the switch
		gpioPin, err := NewGPIOPin(num, getMode(mode))
		if err != nil {
			gtb.EoE(err) // Handle error gracefully
			continue
		}

		// Create the Pin object and add it to the pins map indexed by the GPIO number
		p := Pin{
			On:   on,
			Num:  num,
			Name: name,
			Mode: mode,
			GPIO: gpioPin,
		}

		togglePin(p)

		// Store the Pin object in the map using the GPIO number as the key
		pins[num] = p
		log.Printf("Initialized Pin: %s, on: %v, gpio: %d\n", name, p.On, p.Num)
	}
}

func togglePin(pin Pin) {
	if pin.Mode == "out" {
		if pin.On {
			pin.GPIO.High()
		} else {
			pin.GPIO.Low()
		}
	}
}

func getMode(mode string) rpio.Mode {
	switch mode {
	case "input", "in":
		return rpio.Input
	case "output", "out":
		return rpio.Output
	case "pwm":
		return rpio.Pwm
	case "spi":
		return rpio.Spi
	case "clock":
		return rpio.Clock
	}
	return rpio.Output
}

func handlePin(w http.ResponseWriter, r *http.Request) {
	var req struct {
		Name string `json:"name"`
		On   bool   `json:"on"`
		Num  int    `json:"num"`
		Mode string `json:"mode"`
	}

	err := json.NewDecoder(r.Body).Decode(&req)
	if err != nil {
		http.Error(w, "Failed to parse JSON", http.StatusBadRequest)
		log.Printf("Failed to parse JSON: %v", err)
		return
	}

	// Find the pin by its GPIO number
	p, ok := pins[req.Num]
	if !ok {
		http.Error(w, "Pin not found", http.StatusNotFound)
		log.Printf("Pin not found: %d", req.Num)
		return
	}

	if r.Method == http.MethodPost {
		// Update the pin state
		p.On = req.On
		p.Name = req.Name
		p.Mode = req.Mode
		togglePin(p)
		pins[req.Num] = p
	}

	if r.Method == http.MethodDelete {
		// reset pin to default state
		p.GPIO.Low()
		delete(pins, req.Num)
	}

	// Update the config file with the modified pin settings
	updatedConfig := make(map[string]interface{})
	for num, pin := range pins {
		updatedConfig[strconv.Itoa(num)] = map[string]interface{}{
			"mode": pin.Mode,
			"name": pin.Name,
			"on":   pin.On,
		}
	}
	viper.Set("pins", updatedConfig)
	viper.WriteConfig()

	// Write a response
	w.WriteHeader(http.StatusOK)
	w.Write([]byte("Pin Updated"))
}
