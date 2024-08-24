package cmd

import (
	"log"
	"net/http"

	"github.com/spf13/viper"
)

func startServer() {
	// Define the directory to serve
	dir := http.Dir("./srv")
	port := viper.GetString("port")

	// Create a file server handler
	fileServer := http.FileServer(dir)

	// Strip the prefix and serve the files
	http.Handle("/", http.StripPrefix("/", fileServer))

	// Start the web server and log any errors
	log.Println("Starting server on :" + port)
	if err := http.ListenAndServe(":"+port, nil); err != nil {
		log.Fatalf("Server failed to start: %v", err)
	}
}
