package cmd

import (
	"encoding/json"
	"log"
	"net/http"

	"github.com/spf13/viper"
)

func startServer() {
	dir := http.Dir(viper.GetString("dir"))
	port := viper.GetString("port")

	log.Println("Serving Files From: " + dir)
	fileServer := http.FileServer(dir)
	http.Handle("/", http.StripPrefix("/", fileServer))

	http.HandleFunc("/api/config", corsMiddleware(handleConfig))
	http.HandleFunc("/api/pin", corsMiddleware(handlePin))

	log.Println("Starting server on Port: " + port)
	if err := http.ListenAndServe(":"+port, nil); err != nil {
		log.Fatalf("Server failed to start: %v", err)
	}
}

// Add a CORS middleware function
func corsMiddleware(next http.HandlerFunc) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		// Set CORS headers
		hostname := viper.GetString("hostname")
		devport := viper.GetString("devport")
		w.Header().Set("Access-Control-Allow-Origin", "http://"+hostname+":"+devport)
		w.Header().Set("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
		w.Header().Set("Access-Control-Allow-Headers", "Content-Type")

		// Handle preflight requests
		if r.Method == http.MethodOptions {
			w.WriteHeader(http.StatusOK)
			return
		}

		// Call the next handler
		next(w, r)
	}
}

func handleConfig(w http.ResponseWriter, r *http.Request) {
	if r.Method == http.MethodGet {
		w.Header().Set("Content-Type", "application/json")

		// Get all settings from Viper
		settings := viper.AllSettings()

		// Marshal the settings into JSON
		jsonData, err := json.Marshal(settings)
		if err != nil {
			http.Error(w, "Failed to marshal JSON", http.StatusInternalServerError)
			log.Printf("Failed to marshal JSON: %v", err)
			return
		}

		// Write the JSON data to the response
		w.WriteHeader(http.StatusOK)
		w.Write(jsonData)
	}
}
