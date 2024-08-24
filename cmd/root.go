/*
Copyright © 2023 Kevin Jayne <kevin.jayne@icloud.com>
*/
package cmd

import (
	"context"
	"fmt"
	"os"
	"os/signal"
	"syscall"
	"time"

	"github.com/seemywingz/gotoolbox/gtb"
	"github.com/spf13/cobra"
	"github.com/spf13/viper"
)

var verbose bool
var configFile string

// rootCmd represents the base command when called without any subcommands
var rootCmd = &cobra.Command{
	Use:   "vmon",
	Short: "vmon: RPI Servo Controller",
	Long:  `	`,
	Run: func(cmd *cobra.Command, args []string) {
		blink()
	},
}

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

// Execute adds all child commands to the root command and sets flags appropriately.
// This is called by main.main(). It only needs to happen once to the rootCmd.
func Execute() {
	err := rootCmd.Execute()
	if err != nil {
		os.Exit(1)
	}
}

func init() {

	cobra.OnInitialize(viperConfig)

}

func viperConfig() {
	// use spf13/viper to read config file

	viper.SetConfigName("config")      // name of config file (without extension)
	viper.SetConfigType("yaml")        // REQUIRED the config file does not have an extension
	viper.AddConfigPath("$HOME/.vmon") // call multiple times to add many search paths
	viper.AddConfigPath("./files")     // look for config in the working directory /files
	viper.AddConfigPath(".")           // look for config in the working directory

	if configFile != "" {
		viper.SetConfigFile(configFile)
		if verbose {
			fmt.Println("Using config file:", viper.ConfigFileUsed())
		}
	}

	if err := viper.ReadInConfig(); err != nil {
		// Config file not found; ignore error if desired
		fmt.Println("⚠️  Error Opening Config File:", err.Error(), "- Using Defaults")
	} else {
		if verbose {
			fmt.Println("Using config file:", viper.ConfigFileUsed())
		}
	}

}
