package cmd

import (
	"math"
	"time"

	"github.com/seemywingz/gotoolbox/gtb"
	rpio "github.com/stianeikeland/go-rpio/v4"
)

func servoMove() {
	pin, err := NewGPIOPin(19, rpio.Pwm)
	gtb.EoE(err)

	// Set the PWM frequency to 50Hz (20ms period)
	// 50Hz -> period = 20ms
	pin.Freq(50)

	// Duty cycle settings for servo control
	const maxDutyCycle = 1024

	// Convert duty cycle to integer with rounding
	middleDuty := uint32(math.Round(7.5 * float64(maxDutyCycle) / 100))
	maxDuty := uint32(math.Round(12.5 * float64(maxDutyCycle) / 100))
	minDuty := uint32(math.Round(2.5 * float64(maxDutyCycle) / 100))

	// Move servo to different positions
	for i := 0; i < 5; i++ {
		// Middle position (~7.5% duty cycle)
		pin.DutyCycle(middleDuty, maxDutyCycle)
		time.Sleep(2 * time.Second)

		// Maximum position (~12.5% duty cycle)
		pin.DutyCycle(maxDuty, maxDutyCycle)
		time.Sleep(2 * time.Second)

		// Minimum position (~2.5% duty cycle)
		pin.DutyCycle(minDuty, maxDutyCycle)
		time.Sleep(2 * time.Second)
	}
}
