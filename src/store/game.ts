import { reactive } from 'vue'

// The trail is 500vh tall with 400vh of scrollable distance. These progress
// values correspond to each postcard reaching the middle of the viewport.
export const CHECKPOINTS = [6.25, 23.75, 41.25, 58.75, 76.25, 93.75]

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
