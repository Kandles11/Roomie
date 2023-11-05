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
  // Send an update packet if we've hit a rising edge or haven't sent one recently
  if (hitMotionSensorHighEdge || (ms - lastSentMotionDetected > 60 * 1000))
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

  //pinMode(MOTION_SENSOR_PIN, INPUT);
  attachInterrupt(digitalPinToInterrupt(MOTION_SENSOR_PIN), onMotionDetected, RISING);

  //initScreen();
  //printTest();
}

void loop2() {
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

  delay(100);
}