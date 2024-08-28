package cmd

import (
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"os"
	"strconv"
	"sync"

	"github.com/spf13/viper"
	"github.com/stianeikeland/go-rpio/v4"
)

type Pin struct {
	On    bool
	Name  string
	Mode  string
	Hz    int
	Duty  uint32
	Cycle uint32
	GPIO  *rpio.Pin
}

var pins = make(map[int]Pin)
var configMutex sync.RWMutex

func initPins() {
	// Get the pins from the Viper configuration
	pinConfigs := viper.GetStringMap("pins")
	pins = make(map[int]Pin)

	err := rpio.Open()
	if err != nil {
		log.Println("💔 Failed to open GPIO")
		os.Exit(1)
	}

	for numStr, config := range pinConfigs {
		num, err := strconv.Atoi(numStr)
		if err != nil {
			log.Printf("Invalid GPIO number: %s", numStr)
			continue
		}

		pinConfig := config.(map[string]any)
		on := pinConfig["on"].(bool)
		mode := pinConfig["mode"].(string)
		hz := int(pinConfig["hz"].(float64))
		duty := uint32(pinConfig["duty"].(float64))
		cycle := uint32(pinConfig["cycle"].(float64))
		name := pinConfig["name"].(string)

		gpioPin := rpio.Pin(num)

		p := Pin{
			On:    on,
			Name:  name,
			Mode:  mode,
			Hz:    hz,
			Duty:  duty,
			Cycle: cycle,
			GPIO:  &gpioPin,
		}

		configMutex.Lock()
		pins[num] = p
		configMutex.Unlock()

		updataGPIOState(p)
		log.Printf("Initialized Pin: %s, On: %v, Mode: %s\n", numStr, on, p.Mode)
	}
}

func handlePin(w http.ResponseWriter, r *http.Request) {
	var req struct {
		Name  string `json:"name"`
		On    bool   `json:"on"`
		Num   int    `json:"num"`
		Mode  string `json:"mode"`
		Hz    int    `json:"hz"`
		Duty  uint32 `json:"duty"`
		Cycle uint32 `json:"cycle"`
	}

	err := json.NewDecoder(r.Body).Decode(&req)
	if err != nil {
		http.Error(w, "Failed to parse JSON", http.StatusBadRequest)
		log.Printf("Failed to parse JSON: %v", err)
		return
	}

	configMutex.RLock()
	p, pinExists := pins[req.Num]
	configMutex.RUnlock()

	msg := ""

	switch r.Method {
	case http.MethodPost:
		if !pinExists {
			msg = fmt.Sprintf("⛔️  Pin not found: %d", req.Num)
			http.Error(w, msg, http.StatusNotFound)
			log.Printf(msg)
			return
		}

		p.On = req.On
		p.Name = req.Name
		p.Mode = req.Mode
		p.Hz = req.Hz
		p.Duty = req.Duty
		p.Cycle = req.Cycle

		updataGPIOState(p)

		configMutex.Lock()
		pins[req.Num] = p
		configMutex.Unlock()

		msg = fmt.Sprintf("⚙️ Updated Pin: %d, Name: %s, On: %v, Mode: %s, Hz: %d, Duty: %d, Cycle: %d",
			req.Num, p.Name, p.On, p.Mode, p.Hz, p.Duty, p.Cycle)

	case http.MethodDelete:
		if pinExists {
			p.GPIO.Low()

			configMutex.Lock()
			delete(pins, req.Num)
			configMutex.Unlock()

			msg = fmt.Sprintf("🗑  Deleted Pin: %d", req.Num)
		} else {
			msg = fmt.Sprintf("Attempted to delete a non-existing pin: %d", req.Num)
		}

	case http.MethodPut:
		if pinExists {
			http.Error(w, "Pin Already Exists", http.StatusConflict)
			msg = fmt.Sprintf("Pin already exists: %d", req.Num)
			return
		}
		gpioPin := rpio.Pin(req.Num)
		newPin := Pin{
			On:   req.On,
			Name: req.Name,
			Mode: req.Mode,
			GPIO: &gpioPin,
		}

		updataGPIOState(newPin)

		configMutex.Lock()
		pins[req.Num] = newPin
		configMutex.Unlock()

		msg = fmt.Sprintf("➕ Added Pin: %d, Name: %s, On: %v, Mode: %s", req.Num, newPin.Name, newPin.On, newPin.Mode)

	default:
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	updatePinConf()

	log.Println(msg)
	w.WriteHeader(http.StatusOK)
	w.Write([]byte(msg))
}

func updatePinConf() {
	configMutex.RLock()
	defer configMutex.RUnlock()

	updatedPinConfig := make(map[string]any)
	for num, pin := range pins {
		updatedPinConfig[strconv.Itoa(num)] = map[string]any{
			"mode":  pin.Mode,
			"name":  pin.Name,
			"on":    pin.On,
			"hz":    pin.Hz,
			"duty":  pin.Duty,
			"cycle": pin.Cycle,
		}
	}

	conf := viper.AllSettings()
	conf["pins"] = updatedPinConfig

	confData, err := json.MarshalIndent(conf, "", "  ")
	if err != nil {
		panic(err)
	}

	confFile := viper.ConfigFileUsed()
	err = os.WriteFile(confFile, confData, 0644)
	if err != nil {
		panic(err)
	}
	viper.ReadInConfig()
}

func updataGPIOState(pin Pin) {
	switch pin.Mode {
	case "pwm", "servo":
		pin.GPIO.Pwm()
		pin.GPIO.Freq(pin.Hz * int(pin.Cycle))
		if pin.On {
			pin.GPIO.DutyCycle(pin.Duty, pin.Cycle)
		} else {
			pin.GPIO.DutyCycle(0, 128)
		}
	case "output", "out":
		pin.GPIO.Output()
		if pin.On {
			pin.GPIO.High()
		} else {
			pin.GPIO.Low()
		}
	case "input", "in":
		pin.GPIO.Input()
	case "spi":
		pin.GPIO.Mode(rpio.Spi)
	case "clock":
		pin.GPIO.Clock()
	case "alt0":
		pin.GPIO.Mode(rpio.Alt0)
	case "alt1":
		pin.GPIO.Mode(rpio.Alt1)
	case "alt2":
		pin.GPIO.Mode(rpio.Alt2)
	case "alt3":
		pin.GPIO.Mode(rpio.Alt3)
	case "alt4":
		pin.GPIO.Mode(rpio.Alt4)
	case "alt5":
		pin.GPIO.Mode(rpio.Alt5)
	}
}
