import { reactive } from 'vue'

export const POSTCARD_COUNT = 14
export const TRACK_HEIGHT_VH = 1080

const FIRST_POSTCARD_VH = 75
const POSTCARD_GAP_VH = 70
const SCROLLABLE_TRACK_VH = TRACK_HEIGHT_VH - 100

export const POSTCARD_POSITIONS = Array.from(
  { length: POSTCARD_COUNT },
  (_, index) => ((FIRST_POSTCARD_VH + index * POSTCARD_GAP_VH) / TRACK_HEIGHT_VH) * 100
)

// Unlock each postcard when it reaches the middle of the viewport.
export const CHECKPOINTS = Array.from(
  { length: POSTCARD_COUNT },
  (_, index) => ((FIRST_POSTCARD_VH + index * POSTCARD_GAP_VH - 50) / SCROLLABLE_TRACK_VH) * 100
)

export const gameState = reactive({
  hasStarted: false,
  scrollProgress: 0, // 0 to 100
  isWalking: false,
  activePostcard: null as number | null,
  unlockedPostcards: [] as number[],
  isLetterOpen: false,
})

export function startGame() {
  gameState.hasStarted = true
}

export function updateScrollProgress(progress: number) {
  // Clamp progress between 0 and 100
  const clampedProgress = Math.max(0, Math.min(100, progress))
  gameState.scrollProgress = clampedProgress

  // Check if we passed any checkpoints to unlock new postcards
  CHECKPOINTS.forEach((checkpoint, index) => {
    if (clampedProgress >= checkpoint && !gameState.unlockedPostcards.includes(index)) {
      gameState.unlockedPostcards.push(index)
    }
  })
}

export function setWalking(walking: boolean) {
  gameState.isWalking = walking
}

export function setActivePostcard(index: number | null) {
  gameState.activePostcard = index
}

export function setLetterOpen(open: boolean) {
  gameState.isLetterOpen = open
}

export function resetGame() {
  gameState.hasStarted = false
  gameState.scrollProgress = 0
  gameState.isWalking = false
  gameState.activePostcard = null
  gameState.unlockedPostcards = []
  gameState.isLetterOpen = false
}
