import { describe, it, expect, beforeEach } from 'vitest'
import {
  CHECKPOINTS,
  gameState,
  startGame,
  updateScrollProgress,
  setWalking,
  setActivePostcard,
  setLetterOpen,
  resetGame
} from './game'

describe('Game State Store', () => {
  beforeEach(() => {
    resetGame()
  })

  it('should initialize with default values', () => {
    expect(gameState.hasStarted).toBe(false)
    expect(gameState.scrollProgress).toBe(0)
    expect(gameState.isWalking).toBe(false)
    expect(gameState.activePostcard).toBe(null)
    expect(gameState.unlockedPostcards).toEqual([])
    expect(gameState.isLetterOpen).toBe(false)
  })

  it('should start the game', () => {
    startGame()
    expect(gameState.hasStarted).toBe(true)
  })

  it('should clamp scroll progress between 0 and 100', () => {
    updateScrollProgress(-10)
    expect(gameState.scrollProgress).toBe(0)

    updateScrollProgress(150)
    expect(gameState.scrollProgress).toBe(100)
  })

  it('should unlock postcards when checkpoints are crossed', () => {
    // Before postcard 0 reaches the middle of the viewport
    updateScrollProgress(CHECKPOINTS[0] - 0.01)
    expect(gameState.unlockedPostcards).toEqual([])

    // Postcard 0 reaches the middle of the viewport
    updateScrollProgress(CHECKPOINTS[0])
    expect(gameState.unlockedPostcards).toEqual([0])

    // Re-verify that crossing it again does not duplicate the unlock
    updateScrollProgress(CHECKPOINTS[0] + 1)
    expect(gameState.unlockedPostcards).toEqual([0])

    // Postcard 1 reaches the middle of the viewport
    updateScrollProgress(CHECKPOINTS[1])
    expect(gameState.unlockedPostcards).toEqual([0, 1])

    // Cross all checkpoints
    updateScrollProgress(100)
    expect(gameState.unlockedPostcards).toEqual(Array.from({ length: 14 }, (_, index) => index))
  })

  it('should manage walking state', () => {
    setWalking(true)
    expect(gameState.isWalking).toBe(true)
    setWalking(false)
    expect(gameState.isWalking).toBe(false)
  })

  it('should set active postcard index', () => {
    setActivePostcard(2)
    expect(gameState.activePostcard).toBe(2)
    setActivePostcard(null)
    expect(gameState.activePostcard).toBe(null)
  })

  it('should manage letter open state', () => {
    setLetterOpen(true)
    expect(gameState.isLetterOpen).toBe(true)
    setLetterOpen(false)
    expect(gameState.isLetterOpen).toBe(false)
  })

  it('should reset state completely', () => {
    startGame()
    updateScrollProgress(50)
    setWalking(true)
    setActivePostcard(1)
    setLetterOpen(true)

    resetGame()

    expect(gameState.hasStarted).toBe(false)
    expect(gameState.scrollProgress).toBe(0)
    expect(gameState.isWalking).toBe(false)
    expect(gameState.activePostcard).toBe(null)
    expect(gameState.unlockedPostcards).toEqual([])
    expect(gameState.isLetterOpen).toBe(false)
  })
})
