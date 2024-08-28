package cmd

// import (
// 	"math"

// 	rpio "github.com/stianeikeland/go-rpio/v4"
// )

// type Servo struct {
// 	pin          rpio.Pin
// 	maxDutyCycle uint32
// }

// // NewServo creates a new servo instance on the specified GPIO pin.
// func NewServo(pinNum int) (*Servo, error) {
// 	pin, err := NewPinWithMode(pinNum, rpio.Pwm)
// 	if err != nil {
// 		return nil, err
// 	}

// 	// Initialize the servo
// 	pin.Freq(50) // 50Hz for servos

// 	return &Servo{
// 		pin:          *pin,
// 		maxDutyCycle: 1024,
// 	}, nil
// }

// // Move to a specific angle (0 to 180 degrees)
// func (s *Servo) Move(angle float64) {
// 	duty := (2.5 + (angle/180.0)*10.0) * float64(s.maxDutyCycle) / 100.0
// 	s.pin.DutyCycle(uint32(math.Round(duty)), s.maxDutyCycle)
// }
