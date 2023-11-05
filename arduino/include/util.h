#ifndef ROOMIE_UTIL_H
#define ROOMIE_UTIL_H

#include <stdint.h>

uint64_t hexToNum(char *hex, int bytes)
{
    uint64_t val = 0;
    int base = 1;

    for (int i = bytes - 1; i >= 0; i--)
    {
        char c = hex[i];

        if (c >= '0' && c <= '9')
        {
            val += (c - '0') * base;
        }
        else if (c >= 'a' && c <= 'z')
        {
            val += (c - 'a' + 10) * base;
        }
        else if (c >= 'A' && c <= 'Z')
        {
            val += (c - 'A' + 10) * base;
        }

        base *= 16;
    }

    return val;
}

void numToHex(char *out, uint64_t num, int len)
{
    const char hex[16] = {'0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'A', 'B', 'C', 'D', 'E', 'F'};

    for (int i = len - 1; i >= 0; i--)
    {
        out[len - i - 1] = hex[(num >> (i * 4)) & 0xF];
    }
}

#endif // ifndef ROOMIE_UTIL_H