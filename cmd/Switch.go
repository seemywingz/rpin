package cmd

import (
	"net/http"
)

type Switch struct {
	Name    string
	Enabled bool
	PinNum  int
	Pin     GPIOPin
}

var switches = []Switch{}

fun initSwitches() {
	// Create a new GPIO pin for each switch
	for _, switchConfig := range viper.GetStringMap("switches") {
		  pin, err := NewGPIOPin(switchConfig["pin"].(int))
		  gtb.EoE(err)
          switch := Switch{
			Name: switchConfig["name"].(string),
			Enabled: switchConfig["enabled"].(bool),
			PinNum: switchConfig["pin"].(int),
			Pin: NewGPIOPin(switchConfig["pin"].(int)),
		  }

	}
}

func handleSwitch(w http.ResponseWriter, r *http.Request) {
	if r.Method == http.MethodGet {
	}

	if r.Method == http.MethodPost {
	}
}
