#include <Arduino.h>

#include "staticConfig.h"
#include "packet.h"
#include "network.h"
#include "screen.h"

unsigned long lastSentMotionDetected = 0;
bool hitMotionSensorHighEdge = false;

void IRAM_ATTR onMotionDetected()
{
  hitMotionSensorHighEdge = true;
}

// Every 100ms, test if the motion sensor is high or hit a rising edge recently
void logMotionDetected(unsigned long ms)
{
  if (!digitalRead(MOTION_SENSOR_PIN))
  {
    return;
  }

  // Send an update packet if we've hit a rising edge or haven't sent one recently
  if (hitMotionSensorHighEdge || (ms - lastSentMotionDetected > 300))
  {
    hitMotionSensorHighEdge = false;

    // Quit early we already sent a packet recently on a duplicated rising edge
    if (ms - lastSentMotionDetected > 500)
    {
      sendMotionDetectedPacket();
      lastSentMotionDetected = ms;
    }
  }
}

void setup()
{
  Serial.begin(9600);
  Serial.println("Roomie v1.0.0");

  pinMode(LED_RED_PIN, OUTPUT);
  pinMode(LED_GREEN_PIN, OUTPUT);
  pinMode(LED_BLUE_PIN, OUTPUT);

  digitalWrite(LED_RED_PIN, LOW);
  digitalWrite(LED_GREEN_PIN, LOW);
  digitalWrite(LED_BLUE_PIN, LOW);

  // pinMode(MOTION_SENSOR_PIN, INPUT);
  attachInterrupt(digitalPinToInterrupt(MOTION_SENSOR_PIN), onMotionDetected, RISING);

  // initScreen();
  // printTest();
}

void loop2()
{
  Serial.print(digitalRead(MOTION_SENSOR_PIN) ? "X" : "O");
  delay(500);
}

void loop()
{
  if (!WiFi.isConnected())
  {
    connectToWifi();
  }

  if (reader.client.status() == CLOSED)
  {
    connectToServer();
  }

  if (reader.client.available())
  {
    reader.run();
  }

  int ms = millis();

  logMotionDetected(ms);

  static int lastLedMotion = 0;
  if (digitalRead(MOTION_SENSOR_PIN))
  {
    lastLedMotion = ms;
    digitalWrite(LED_RED_PIN, HIGH);
    digitalWrite(LED_GREEN_PIN, LOW);
    digitalWrite(LED_BLUE_PIN, LOW);
  }
  if (ms - lastLedMotion > 3)
  {
    digitalWrite(LED_RED_PIN, LOW);
    digitalWrite(LED_GREEN_PIN, HIGH);
    digitalWrite(LED_BLUE_PIN, LOW);
  }

  Serial.print(digitalRead(MOTION_SENSOR_PIN) ? "X" : "O");

  delay(100);
}