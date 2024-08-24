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

	http.HandleFunc("/config", getConfig)

	log.Println("Starting server on Port: " + port)
	if err := http.ListenAndServe(":"+port, nil); err != nil {
		log.Fatalf("Server failed to start: %v", err)
	}
}

func getConfig(w http.ResponseWriter, r *http.Request) {
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
