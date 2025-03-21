// #include <EncoderStepCounter.h>
// unsigned int ADCValue;

// // Pin assignments
// const int rot1PinA = 2; // Rotary encoder 1
// const int rot1PinB = 3;
// const int rot1ButtonPin = 4; // Rotary encoder 1 button

// const int rot2PinA = 5; // Rotary encoder 2
// const int rot2PinB = 6;

// const int slider1Pin = A0;
// const int slider2Pin = A1;
// const int slider3Pin = A2;
// const int slider4Pin = A3;

// const int pot1Pin = A4;
// const int pot2Pin = A5;
// const int pot3Pin = A6;

// const int button1Pin = 7;
// const int button2Pin = 8;
// const int button3Pin = 9;
// const int button4Pin = 10;
// const int button5Pin = 11;
// const int button6Pin = 12;

// // Rotary encoder instances
// EncoderStepCounter encoder1(rot1PinA, rot1PinB);
// EncoderStepCounter encoder2(rot2PinA, rot2PinB);

// // Encoder previous positions
// int oldRot1 = 0;
// int oldRot2 = 0;

// // Button state variables for rotary encoder button
// int rot1_button = 0; // Current state of the rot1 button toggle
// int lastRot1ButtonState = LOW; // Previous button state

// unsigned long lastDebounceTime = 0; // For debouncing
// const unsigned long debounceDelay = 50; // Debounce delay in ms

// // Button toggle states and last read states
// int buttonStates[6] = {0, 0, 0, 0, 0, 0}; // Toggle states for buttons 1-6
// int lastButtonStates[6] = {LOW, LOW, LOW, LOW, LOW, LOW}; // Previous button states
// unsigned long lastDebounceTimes[6] = {0, 0, 0, 0, 0, 0}; // Last debounce times

// void setup() {
// Serial.begin(9600);

// // Initialize encoders
// encoder1.begin();
// encoder2.begin();

// attachInterrupt(digitalPinToInterrupt(rot1PinA), interruptRot1, CHANGE);
// attachInterrupt(digitalPinToInterrupt(rot1PinB), interruptRot1, CHANGE);
// attachInterrupt(digitalPinToInterrupt(rot2PinA), interruptRot2, CHANGE);
// attachInterrupt(digitalPinToInterrupt(rot2PinB), interruptRot2, CHANGE);

// // Configure button pins
// pinMode(rot1ButtonPin, INPUT_PULLUP);
// pinMode(button1Pin, INPUT_PULLDOWN);
// pinMode(button2Pin, INPUT_PULLDOWN);
// pinMode(button3Pin, INPUT_PULLDOWN);
// pinMode(button4Pin, INPUT_PULLDOWN);
// pinMode(button5Pin, INPUT_PULLDOWN);
// pinMode(button6Pin, INPUT_PULLDOWN);
// }

// void loop() {
// // Update encoders
// encoder1.tick();
// encoder2.tick();

// // Read rotary encoder positions and map to 0-23
// int rot1 = encoder1.getPosition() % 24;
// int rot2 = encoder2.getPosition() % 24;

// // Reset encoders if they exceed the range
// if (rot1 < 0) rot1 += 24;
// if (rot2 < 0) rot2 += 24;

// // Handle rotary encoder button toggle with debounce
// int currentRot1ButtonState = digitalRead(rot1ButtonPin);
// if (currentRot1ButtonState != lastRot1ButtonState) {
// if (millis() - lastDebounceTime > debounceDelay) {
// lastDebounceTime = millis();
// if (currentRot1ButtonState == LOW) { // Button pressed
// rot1_button = !rot1_button; // Toggle between 0 and 1
// }
// }
// }
// lastRot1ButtonState = currentRot1ButtonState;

// // Read sliders and map to 0-100
// int slider1 = map(analogRead(slider1Pin), 0, 1023, 0, 100);
// int slider2 = map(analogRead(slider2Pin), 0, 1023, 0, 100);
// int slider3 = map(analogRead(slider3Pin), 0, 1023, 0, 100);
// int slider4 = map(analogRead(slider4Pin), 0, 1023, 0, 100);

// // Read potentiometers and map to specific ranges
// int pot1 = map(analogRead(pot1Pin), 0, 1023, 10, 60);
// int pot2 = map(analogRead(pot2Pin), 0, 1023, 0, 10);
// int pot3 = map(analogRead(pot3Pin), 0, 1023, 0, 6);

// // Handle button toggles with debounce
// int buttonPins[6] = {button1Pin, button2Pin, button3Pin, button4Pin, button5Pin, button6Pin};
// for (int i = 0; i < 6; i++) {
// int currentButtonState = digitalRead(buttonPins[i]);
// if (currentButtonState != lastButtonStates[i]) {
// if (millis() - lastDebounceTimes[i] > debounceDelay) {
// lastDebounceTimes[i] = millis();
// if (currentButtonState == HIGH) { // Button pressed
// buttonStates[i] = !buttonStates[i]; // Toggle state
// }
// }
// }
// lastButtonStates[i] = currentButtonState;
// }

// // Print all values in the specified order
// Serial.print(rot1); Serial.print(',');
// Serial.print(rot1_button); Serial.print(',');
// Serial.print(slider1); Serial.print(',');
// Serial.print(slider2); Serial.print(',');
// Serial.print(rot2); Serial.print(',');
// Serial.print(slider3); Serial.print(',');
// Serial.print(slider4); Serial.print(',');
// Serial.print(pot1); Serial.print(',');
// Serial.print(pot2); Serial.print(',');
// Serial.print(pot3); Serial.print(',');
// for (int i = 0; i < 6; i++) {
// Serial.print(buttonStates[i]);
// if (i < 5) Serial.print(',');
// }
// Serial.println();

// delay(100); // Stabilization delay
// }

// // Interrupt service routines for rotary encoders
// void interruptRot1() {
// encoder1.tick();
// }

// void interruptRot2() {
// encoder2.tick();
// }
