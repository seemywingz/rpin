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
		// Allowed origins
		hostname := viper.GetString("hostname")
		devport := viper.GetString("devport")
		port := viper.GetString("port")
		allowedOrigins := []string{
			"http://" + hostname + ":" + devport,
			"http://localhost:" + devport,
			"http://127.0.0.1:" + devport,
			"http://" + hostname + ":" + port,
			"http://localhost:" + port,
			"http://127.0.0.1:" + port,
		}

		// Get the origin of the current request
		origin := r.Header.Get("Origin")

		// Check if the origin is allowed
		allowOrigin := false
		for _, o := range allowedOrigins {
			if origin == o {
				allowOrigin = true
				break
			}
		}

		// Set CORS headers if the origin is allowed
		if allowOrigin {
			w.Header().Set("Access-Control-Allow-Origin", origin)
			w.Header().Set("Access-Control-Allow-Methods", "GET, POST, DELETE, PUT")
			w.Header().Set("Access-Control-Allow-Headers", "Content-Type")
		} else {
			log.Printf("🚫 Origin not allowed: %s", origin)
		}

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

		// Read the configuration file then get all settings
		viper.ReadInConfig()
		initPins()
		settings := viper.AllSettings()

		// Marshal the settings into JSON
		jsonData, err := json.Marshal(settings)
		if err != nil {
			http.Error(w, "Failed to marshal JSON", http.StatusInternalServerError)
			log.Printf("Failed to marshal settings to JSON: %v", err)
			return
		}

		// Write the JSON data to the response
		w.WriteHeader(http.StatusOK)
		w.Write(jsonData)
	}
}
