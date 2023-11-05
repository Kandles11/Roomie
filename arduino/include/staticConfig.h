#ifndef ROOMIE_STATIC_CONFIG_H
#define ROOMIE_STATIC_CONFIG_H

#include <stdint.h>

#include <ESP8266WiFi.h>

const int MOTION_SENSOR_PIN = D8;
//const int LCD_D4_PIN = D4;

#include "../.env"

const IPAddress SERVER_IP(192, 168, 135, 248);
const uint16_t SERVER_PORT = 3001;

#endif // ifndef ROOMIE_STATIC_CONFIG_H