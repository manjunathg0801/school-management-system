# School Management App (React Native, Expo)

A starter project that recreates the provided reference screens exactly in React Native using Expo.

## How to run

1. Install prerequisites: Node.js LTS and Expo CLI
   ```bash
   npm i -g expo
   ```

2. Install dependencies
   ```bash
   npm install
   ```

3. Start the app
   ```bash
   npm run start
   ```

4. Press `i` for iOS simulator or `a` for Android emulator, or scan the QR code with Expo Go.

## Notes

- Images from your references are included under `assets/` as `buzz1.jpg` and `buzz2.jpg`.
- The header shows the student avatar, name, ID, grade, confetti dots, and a notification bell with a badge.
- The "Buzz @ Brigade" section includes a horizontally paged carousel with page dots and the "Show More" action.
- A custom floating bottom tab mimics the reference icons and active home state.
- Structure is intentionally simple (no navigation yet) to match the exact look; you can wire actual screens into the bottom bar later.
