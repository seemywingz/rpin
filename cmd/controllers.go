package cmd

import (
	"context"
	"os"
	"os/signal"
	"syscall"
	"time"

	"github.com/seemywingz/gotoolbox/gtb"
)

func blink() {
	light, err := NewGPIOPin(12)
	gtb.EoE(err)
	sleepTime := 1 * time.Second
	count := 0

	// Create a context that is canceled when the command is interrupted or completed
	ctx, cancel := context.WithCancel(context.Background())
	defer cancel()

	// Handle interrupt signals for graceful shutdown
	sigChan := make(chan os.Signal, 1)
	signal.Notify(sigChan, syscall.SIGINT, syscall.SIGTERM)
	go func() {
		<-sigChan
		light.Off()
		cancel()
	}()

	go func() {
		defer light.Off()
		for {
			select {
			case <-ctx.Done():
				return
			default:
				light.On()
				time.Sleep(sleepTime)
				light.Off()
				time.Sleep(sleepTime)
				count++
				// change the sleep time so it gets faster as it goes then back to 1 second
				if count%1 == 0 {
					if sleepTime > 10*time.Millisecond {
						sleepTime -= 100 * time.Millisecond
					} else {
						sleepTime = 1 * time.Second
					}
				}
			}
		}
	}()
	// Block until the context is canceled
	<-ctx.Done()

}
