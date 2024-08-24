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

// rootCmd represents the base command when called without any subcommands
var rootCmd = &cobra.Command{
	Use:   "vmon",
	Short: "vmon: RPI Servo Controller",
	Long:  `	`,
	Run: func(cmd *cobra.Command, args []string) {
		startServer()
	},
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
