import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { mount } from '@vue/test-utils'
import BirthdayPluck from './BirthdayPluck.vue'
import { gameState, resetGame } from '@/store/game'

let wrapper: any = null

beforeEach(() => {
  resetGame()
})

afterEach(() => {
  if (wrapper) {
    wrapper.unmount()
    wrapper = null
  }
})

describe('BirthdayPluck.vue', () => {
  it('should be hidden initially (when scroll progress is low)', () => {
    wrapper = mount(BirthdayPluck)
    expect(wrapper.find('div').exists()).toBe(false)
  })

  it('should be visible when scroll progress reaches 98%', async () => {
    wrapper = mount(BirthdayPluck)
    expect(wrapper.find('div').exists()).toBe(false)

    gameState.scrollProgress = 98
    await wrapper.vm.$nextTick()

    expect(wrapper.find('div').exists()).toBe(true)
    expect(wrapper.find('img[alt="Pikmin Gift Box"]').exists()).toBe(true)
  })

  it('opens letter modal when clicking gift box or open button', async () => {
    gameState.scrollProgress = 100
    wrapper = mount(BirthdayPluck, {
      props: {
        letterTitle: 'Dear Cynthia',
        letterBody: 'Hope you have an amazing day!',
        letterFrom: 'Lin'
      }
    })

    expect(gameState.isLetterOpen).toBe(false)
    
    // Click the gift box
    await wrapper.find('.cursor-pointer').trigger('click')
    expect(gameState.isLetterOpen).toBe(true)

    await wrapper.vm.$nextTick()
    
    // Verify letter content matches custom props inside teleported document.body
    expect(document.body.innerHTML).toContain('Dear Cynthia')
    expect(document.body.innerHTML).toContain('Hope you have an amazing day!')
    expect(document.body.innerHTML).toContain('Lin')

    // Click close '✕' button inside teleported document.body
    const closeBtn = document.body.querySelector('button[aria-label="Close letter"]') as HTMLButtonElement
    expect(closeBtn).toBeDefined()
    closeBtn.click()
    
    await wrapper.vm.$nextTick()
    expect(gameState.isLetterOpen).toBe(false)
  })
})
