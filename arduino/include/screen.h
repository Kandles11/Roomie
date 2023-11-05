#ifndef ROOMIE_SCREEN_H
#define ROOMIE_SCREEN_H

#include <LiquidCrystal.h>

//todo: backlight control
//LiquidCrystal lcd(D1, D2, D5, D6, D7, MISO); // rs, enable, d0, d1, d2, d3

const int rs = D7, en = D6, d4 = D5, d5 = D1, d6 = D2, d7 = 10;
LiquidCrystal* lcd;

void initScreen() {

}

void printTest() {

}

#endif // ifndef ROOMIE_SCREEN_H