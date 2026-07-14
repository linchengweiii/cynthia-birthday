# Design Document: Pikmin-themed Virtual Walking Birthday Card

**Status:** Validated  
**Author:** Jetski & linchengwei  
**Date:** July 13, 2026  

---

## 1. Overview
The goal is to create a simple, charming Pikmin-themed birthday website/card for the user's girlfriend. The website is optimized for mobile views. 
The core interaction simulates a "virtual walk": as the user scrolls down the page, an avatar walks across a path, and Pikmin appear to deliver pre-made "Pikmin postcards" (containing photos). 
At the end of the walk, the user will find a birthday seedling to "pluck" or click to reveal the final birthday message.

---

## 2. User Experience & Features

### 2.1 The Walk (Scroll-Driven Adventure)
* **Background**: A vertical scrolling path representing a garden trail.
* **The Avatar**: Representing the girlfriend, fixed at the lower-middle section of the viewport (e.g., `bottom: 20%`).
* **Scroll Linkage**:
  * As the user scrolls vertically, the background scrolls upwards, creating the illusion of moving forward.
  * The avatar plays a walking animation (sprite animation) while scrolling is active, and transitions back to an idle pose when scrolling stops.
  * We will use a linear interpolation (lerp) loop in JavaScript to smooth out scroll inputs, ensuring the avatar's animation and the background transition are silky smooth on mobile screens.

### 2.2 Postcard Deliveries (Interactive Triggers)
* At predetermined scroll checkpoints (e.g., 20%, 40%, 60%, 80%), Pikmin will carry a postcard onto the screen from off-screen (left or right).
* Each postcard is a pre-made image containing a photo with Pikmin styling.
* A subtle pop-up sound will play when a postcard is delivered.
* Clicking on a postcard will zoom/expand it to full screen (lightbox modal) for easy reading.

### 2.3 The Birthday Surprise (The Ending)
* When the user reaches the bottom of the page (100% scroll):
  * A "Pikmin Seedling" (with a glowing effect) appears.
  * The user is prompted to "Pluck it!".
  * Plucking triggers a classic Pikmin plucking animation and sound effect.
  * A Red/Yellow/Blue Pikmin is pulled out, holding a birthday letter.
  * Clicking the letter opens a stylized birthday card with a personal message from the user.

### 2.4 Audio & Polish
* Cozy background music (from Pikmin games/Pikmin Bloom) with a persistent **Mute/Play button** floating in the corner.
* Sound effects:
  * Pikmin squeaks when postcards appear.
  * Plucking sound when pulling the seedling.
  * Joyful sound when the birthday card opens.
* Mobile-first responsive layout (since the target device is a smartphone).

---

## 3. Technical Plan

### 3.1 Tech Stack
* **Framework**: Vue 3 (Composition API, `<script setup>`).
* **Styling**: Tailwind CSS for rapid and responsive UI layout.
* **Build Tool**: Vite.
* **Language**: TypeScript.
* **Testing**: Vitest + Vue Test Utils.

### 3.2 State Management
To coordinate actions across components (e.g., tracking scroll percentage, triggering cards, managing audio state), we will create a simple shared reactive state module (`src/store/game.ts`):
```typescript
import { reactive } from 'vue';

export const gameState = reactive({
  hasStarted: false,
  scrollProgress: 0, // 0 to 100
  isWalking: false,
  isAudioMuted: false,
  activePostcard: null as number | null, // Currently expanded postcard index
  unlockedPostcards: [] as number[], // Indices of postcards that have been delivered
  isPlucked: false,
});
```

### 3.3 Scroll & Animation Interpolation
To prevent scroll stuttering, we will decouple the raw scroll event from the rendering loop:
1. Capture scroll event and update target scroll value.
2. Run a `requestAnimationFrame` loop.
3. Lerp the current display scroll progress toward the target progress:
   `current = current + (target - current) * 0.1`
4. Use `current` to position elements and determine if the avatar is walking (i.e., if `Math.abs(target - current) > 0.01`).

### 3.4 Component Architecture
We will organize the code into modular Vue components:
* `WelcomeScreen.vue`: Simple overlay to greet the user and prompt them to "Start". This is required to capture the first user interaction to unlock browser audio.
* `AudioController.vue`: Wraps the HTML5 Audio API for bgm and sound effects. Reacts to `gameState.isAudioMuted` and playback triggers.
* `WalkingTrack.vue`: Manages the background landscape, avatar container, and scroll progress tracking.
* `PostcardItem.vue`: Individual postcard layout, slide-in animation trigger (when unlocked), and modal/lightbox overlay when clicked.
* `BirthdayPluck.vue`: The final interaction zone containing the seedling, plucking trigger, and the birthday message modal.

### 3.5 Asset Management & Placeholders
* **Postcards**: Placed under `public/assets/postcards/`. We will use generic placeholder images (`postcard1.jpg`, `postcard2.jpg`, etc.) during development.
* **Sprites**:
  * Walking avatar: SVG/PNG sequences animated using CSS `@keyframes`.
  * Pikmin: Cute SVG graphics.
* **Audio**:
  * We will use royalty-free looping background track (`bgm.mp3`) and generic beep/pop sounds (`pop.mp3`, `pluck.mp3`) as placeholders. The user can overwrite these files in the `public/` directory before building.

---

## 4. Verification & Test Plan

### 4.1 Automated Unit Tests (Vitest)
We will write the following tests under `src/tests/`:
* `gameStore.test.ts`: Verify that updating scroll progress unlocks the correct postcards at checkpoints (e.g., 20%, 40%, etc.).
* `scrollLerp.test.ts`: Test that the lerp math correctly interpolates progress and stops walking when target is reached.
* `audioState.test.ts`: Verify audio muting toggling matches the reactive store state.

### 4.2 Local Development Testing
* Verify scroll-snapping or scroll-mapping correctness on different simulated screen sizes in Chrome DevTools (focusing on iPhone/Android mobile aspect ratios).
* Test audio autoplay restrictions bypass (ensure audio only starts after the user performs their first click/interaction on the Welcome screen).
* Verify performance: Ensure smooth scrolling (60fps) on mobile without lag during animation triggers.

### 4.3 User Journey Validation
* **Step 1**: Load site -> Welcome screen with "Start Journey" button.
* **Step 2**: Click "Start" -> Welcome screen fades, audio starts.
* **Step 3**: Scroll down -> Avatar walks, background shifts, Pikmin pop up with postcards.
* **Step 4**: Click postcard -> Zoomed modal view. Close modal -> Continue walk.
* **Step 5**: Reach end -> Seedling pops up. Click "Pluck" -> Animation plays -> Card opens with message.

---

## 5. Alternatives Considered

* **GPS/Accelerometer-based walking (Pikmin Bloom clone)**: Rejecting this due to friction for the user (having to go outside, grant location permissions on iOS/Android, hard to debug, and poor UX if she wants to open the card indoors). Virtual walking is a more reliable and friendly experience.
* **React Implementation**: User specifically requested Vue to match their existing workspace configuration.
* **Horizontal Scrolling**: Rejected horizontal path in favor of a vertical path to match standard mobile scrolling direction.
