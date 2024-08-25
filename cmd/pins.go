package cmd

import (
	"encoding/json"
	"log"
	"net/http"

	"github.com/seemywingz/gotoolbox/gtb"
	"github.com/spf13/viper"
	"github.com/stianeikeland/go-rpio/v4"
)

type Pin struct {
	On   bool
	Num  int
	Mode string
	GPIO *rpio.Pin
}

var pins = make(map[string]Pin)

func initPins() {
	// Get the pins from the Viper configuration
	pinConfigs := viper.GetStringMap("pins")

	for name, config := range pinConfigs {
		// Assert the config to the appropriate type (map[string]interface{})
		pinConfig := config.(map[string]interface{})

		// Extract the pin number, on status, and mode
		num := int(pinConfig["num"].(float64)) // Viper may interpret numbers as float64
		on := pinConfig["on"].(bool)
		mode := pinConfig["mode"].(string)

		// Create a new GPIO pin for the switch
		pin, err := NewGPIOPin(num, getMode(mode))
		if err != nil {
			gtb.EoE(err) // Handle error gracefully
			continue
		}

		// Create the Pin object and add it to the pins map
		p := Pin{
			On:   on,
			Num:  num,
			Mode: mode,
			GPIO: pin,
		}

		togglePin(p)

		pins[name] = p
		log.Printf("Initialized pin: %s, on: %v, Pin: %d\n", name, p.On, p.Num)
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

	if r.Method == http.MethodPost {
		// Parse the request body
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

		// Find the pin by name
		p, ok := pins[req.Name]
		if !ok {
			http.Error(w, "Pin not found", http.StatusNotFound)
			log.Printf("Pin not found: %s", req.Name)
			return
		}

		// Update the pin state
		p.On = req.On
		togglePin(p)
		pins[req.Name] = p

		// Update the config file with the modified pin settings
		updatedConfig := make(map[string]interface{})
		for name, pin := range pins {
			updatedConfig[name] = map[string]interface{}{
				"mode": pin.Mode,
				"num":  pin.Num,
				"on":   pin.On,
			}
		}
		viper.Set("pins", updatedConfig)
		viper.WriteConfig()

		// Write a response
		w.WriteHeader(http.StatusOK)
		w.Write([]byte("Pin toggled"))
	}
}
