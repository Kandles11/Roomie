#ifndef ROOMIE_PACKET_H
#define ROOMIE_PACKET_H

#include <ESP8266WiFi.h>

#include "util.h"

enum class PacketType
{
    NOTHING,
    PING,
    PING_RESPONSE,
    CLIENT_HELLO,
    RESTART,
    MOTION_DETECTED,
    SCREEN_SET,
    BATTERY_LEVEL,
};

struct PacketReader
{
    char packetReadBuf[300];
    // read cursor
    char *r = packetReadBuf;
    // write cursor
    char *w = packetReadBuf;

    WiFiClient client;

    void run()
    {
        w += client.read((uint8_t *)r, spaceLeftInBuf());

        if (w == packetReadBuf + sizeof(packetReadBuf))
        {
            shiftBufBack();
        }

        w += client.read((uint8_t *)r, spaceLeftInBuf());

        Serial.print("buf state");
        Serial.println(r);

        if (r[0] != ':' || std::find(r, w, ';') == w)
        {
            // Invalid state, reset and try again
            // todo: make this more tolerant
            Serial.print(r[0] != ':');
            Serial.print(std::find(r, w, ';'));
            Serial.println("invalid packet state");
        }

        while (r <= w)
        {
            actOnPacket(r + 1, std::find(r, w, ';') - 1);
            r = w + 1;
        }

        if (r > w)
        {
            r = w;
            shiftBufBack();
        }
    }

    int spaceLeftInBuf()
    {
        return (packetReadBuf + sizeof(packetReadBuf)) - r;
    }

    // Shift r back to the start of the buffer, keeping w at the same offset
    void shiftBufBack()
    {
        Serial.println("shift buf back");
        std::copy(r, w, packetReadBuf);
        w = packetReadBuf + (w - r);
        r = packetReadBuf;
    }

    void actOnPacket(char *start, char *end)
    {
        char *r = start;
        auto type = (PacketType)hexToNum(r, 2);
        r += 2;

        Serial.print("see packet type ");
        Serial.println((char)type);

#define EXPECT_CHAR(c) \
    if (*(r++) != c)   \
    {                  \
        return;        \
    }

        if (type == PacketType::RESTART)
        {
            Serial.println("RESTART");
            ESP.restart();
        }
        else if (type == PacketType::PING) {
            client.write(":02;");
        }
        else if (type == PacketType::SCREEN_SET)
        {
            // ,TEXT
            EXPECT_CHAR(',');
            
            // [r, end) is now a string to put onscreen
            Serial.print("Set screen to ");

            while (r < end) {
                Serial.print(*r);
                r++;
            }
            Serial.println();
        }
    }
};

#endif // ifndef ROOMIE_PACKET_H