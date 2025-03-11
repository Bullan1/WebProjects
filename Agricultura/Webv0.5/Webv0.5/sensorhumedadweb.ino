#include <ESP8266WiFi.h>
#include <ESP8266HTTPClient.h>

const char* ssid = "Xiaomi 11t";
const char* password = "santotomas";
const char* serverUrl = "http://localhost:3000/Datos"; // URL del servidor Node.js

void setup() {
  Serial.begin(115200);
  WiFi.begin(ssid, password);

  while (WiFi.status() != WL_CONNECTED) {
    delay(1000);
    Serial.println("Conectando a WiFi...");
  }
  Serial.println("Conectado a WiFi");
}

void loop() {
  if (WiFi.status() == WL_CONNECTED) {
    HTTPClient http;

    http.begin(serverUrl);
    http.addHeader("Content-Type", "application/json");

    // Simular datos de ejemplo
    String datos = "{\"temperatura\": 24.5, \"humedad\": 60}";
    int httpResponseCode = http.POST(datos);

    if (httpResponseCode > 0) {
      Serial.println("Datos enviados: " + String(httpResponseCode));
    } else {
      Serial.println("Error al enviar datos");
    }

    http.end();
  }
  delay(5000); // Enviar datos cada 5 segundos
}
