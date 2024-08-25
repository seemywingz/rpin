/*
Copyright © 2023 Kevin Jayne <kevin.jayne@icloud.com>
*/
package cmd

import (
	"fmt"
	"os"

	"github.com/spf13/cobra"
	"github.com/spf13/viper"
)

var verbose bool
var configFile string

var rootCmd = &cobra.Command{
	Use:   "vmon",
	Short: "vmon: RPI Servo Controller",
	Long:  `	`,
	Run: func(cmd *cobra.Command, args []string) {
		initSwitches()
		servoMove()
		startServer()
	},
}

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
	viper.SetConfigName("config")      // name of config file (without extension)
	viper.SetConfigType("json")        // REQUIRED the config file does not have an extension
	viper.AddConfigPath("$HOME/.vmon") // call multiple times to add many search paths
	viper.AddConfigPath(".")           // look for config in the working directory

	if configFile != "" {
		viper.SetConfigFile(configFile)
		if verbose {
			fmt.Println("Using config file:", viper.ConfigFileUsed())
		}
	}

	if err := viper.ReadInConfig(); err != nil {
		fmt.Println("⚠️  Error Opening Config File:", err.Error(), "- Using Defaults")
	} else {
		if verbose {
			fmt.Println("Using config file:", viper.ConfigFileUsed())
		}
	}

}
