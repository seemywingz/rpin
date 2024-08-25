package cmd

import (
	"fmt"

	rpio "github.com/stianeikeland/go-rpio/v4"
)

func NewGPIOPin(pinNum int, mode rpio.Mode) (*rpio.Pin, error) {
	// Initialize the rpio library
	err := rpio.Open()
	if err != nil {
		return nil, fmt.Errorf("failed to initialize rpio: %w", err)
	}

	pin := rpio.Pin(pinNum)
	pin.Mode(mode)
	return &pin, nil
}
