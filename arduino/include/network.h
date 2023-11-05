#ifndef ROOMIE_NETWORK_H
#define ROOMIE_NETWORK_H

#include "staticConfig.h"
#include "packet.h"

PacketReader reader;

char packetConstructBuf[300];

char *start(PacketType type)
{
    char *w = packetConstructBuf;
    (*w++) = ':';

    numToHex(w, (int)type, 2);
    w += 2;
    (*w++) = ',';

    return w;
}

char *finish(char *w)
{
    (*w++) = ';';
    *w = '\0';
    return packetConstructBuf;
}

template <PacketType type>
char *make();

template <>
char *make<PacketType::CLIENT_HELLO>()
{
    char *w = start(PacketType::CLIENT_HELLO);

    uint8_t mac[6];
    WiFi.macAddress(mac);
    for (int i = 0; i < 6; i++)
    {
        numToHex(w, mac[i], 2);
        w += 2;
    }

    return finish(w);
}

template <>
char *make<PacketType::PING_RESPONSE>()
{
    char *w = start(PacketType::PING_RESPONSE);

    return finish(w);
}

template <>
char *make<PacketType::MOTION_DETECTED>()
{
    char *w = packetConstructBuf;
    (*w++) = ':';

    numToHex(w, (int)PacketType::MOTION_DETECTED, 2);
    w += 2;

    return finish(w);
}

void connectToServer()
{
    int loopCount = 0;
    while (!reader.client.connect(SERVER_IP, SERVER_PORT))
    {
        delay(1000);
        Serial.print("*");

        if (loopCount++ > 10)
        {
            ESP.restart();
        }
    }

    Serial.println("Connected to server!");

    reader.client.print(make<PacketType::CLIENT_HELLO>());
}

void connectToWifi()
{
    WiFi.begin(SSID_DEFAULT, PASSWORD_DEFAULT);

    while (WiFi.status() != WL_CONNECTED)
    {
        delay(500);
        Serial.print(".");
    }

    Serial.println("");
    Serial.println("WiFi connected");
    Serial.print("IP address: ");
    Serial.println(WiFi.localIP());
}

void sendMotionDetectedPacket()
{
    if (reader.client.availableForWrite())
    {
        reader.client.write(make<PacketType::MOTION_DETECTED>());
    }
}

#endif // ifndef ROOMIE_NETWORK_H