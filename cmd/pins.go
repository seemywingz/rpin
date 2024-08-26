package cmd

import (
	"encoding/json"
	"log"
	"net/http"
	"os"
	"strconv"
	"sync"

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
var configMutex sync.Mutex

func initPins() {
	// Get the pins from the Viper configuration
	pinConfigs := viper.GetStringMap("pins")
	pins = make(map[int]Pin)

	for numStr, config := range pinConfigs {
		// Convert the string key to an integer pin number
		num, err := strconv.Atoi(numStr)
		if err != nil {
			log.Printf("Invalid GPIO number: %s", numStr)
			continue
		}

		// Assert the config to the appropriate type (map[string]interface{})
		pinConfig := config.(map[string]any)

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

	switch r.Method {
	case http.MethodPost:
		// Update the pin state
		if !ok {
			http.Error(w, "Pin not found", http.StatusNotFound)
			log.Printf("Pin not found: %d", req.Num)
			return
		}
		p.On = req.On
		p.Name = req.Name
		p.Mode = req.Mode
		togglePin(p)
		pins[req.Num] = p
		log.Printf("📄 Updated Pin: %v", p)
	case http.MethodDelete:
		// Reset pin to default state and delete it
		if ok { // Ensure the pin exists before trying to delete it
			p.GPIO.Low()
			delete(pins, req.Num)
			conf := viper.AllSettings()
			delete(conf, "pins")
			log.Printf("🔥 Deleted Pin: %d: %v", req.Num, pins)
		} else {
			log.Printf("Attempted to delete a non-existing pin: %d", req.Num)
		}
	default:
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	updatePinConf()

	// Write a response
	w.WriteHeader(http.StatusOK)
	w.Write([]byte("Pin Updated"))
}

func updatePinConf() {
	updatedPinConfig := make(map[string]any)
	for num, pin := range pins {
		updatedPinConfig[strconv.Itoa(num)] = map[string]any{
			"mode": pin.Mode,
			"name": pin.Name,
			"on":   pin.On,
		}
	}

	conf := viper.AllSettings()
	conf["pins"] = updatedPinConfig

	// Marshal the settings to JSON
	confData, err := json.MarshalIndent(conf, "", "  ")
	if err != nil {
		panic(err)
	}

	confFile := viper.ConfigFileUsed()
	// Write the JSON data to the config file
	err = os.WriteFile(confFile, confData, 0644)
	if err != nil {
		panic(err)
	}
	viper.ReadInConfig()
}
