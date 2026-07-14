import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { mount } from '@vue/test-utils'
import PostcardItem from './PostcardItem.vue'
import { gameState, resetGame } from '@/store/game'

let wrapper: any = null

beforeEach(() => {
  resetGame()
  // Clean JSDOM body between tests
  document.body.innerHTML = ''
})

afterEach(() => {
  if (wrapper) {
    wrapper.unmount()
    wrapper = null
  }
})

describe('PostcardItem.vue', () => {
  it('renders a locked placeholder (question mark) initially', () => {
    wrapper = mount(PostcardItem, {
      props: {
        index: 0,
        side: 'left'
      }
    })
    
    // Unlocked array is empty, so it's locked
    expect(wrapper.text()).toContain('❓')
    expect(wrapper.find('img').exists()).toBe(false)
  })

  it('renders postcard image once unlocked', async () => {
    wrapper = mount(PostcardItem, {
      props: {
        index: 1,
        side: 'right'
      }
    })

    // Unlock index 1
    gameState.unlockedPostcards.push(1)
    await wrapper.vm.$nextTick()

    expect(wrapper.text()).not.toContain('❓')
    const img = wrapper.find('img')
    expect(img.exists()).toBe(true)
    expect(img.attributes('src')).toContain('postcard_1.png')
  })

  it('sets active postcard when clicked (if unlocked)', async () => {
    wrapper = mount(PostcardItem, {
      props: {
        index: 2,
        side: 'left'
      }
    })

    // Click while locked -> shouldn't trigger
    await wrapper.find('.cursor-pointer').trigger('click')
    expect(gameState.activePostcard).toBe(null)

    // Unlock and click again
    gameState.unlockedPostcards.push(2)
    await wrapper.vm.$nextTick()
    
    await wrapper.find('.cursor-pointer').trigger('click')
    expect(gameState.activePostcard).toBe(2)
  })

  it('opens lightbox zoom modal if activePostcard matches index', async () => {
    wrapper = mount(PostcardItem, {
      props: {
        index: 3,
        side: 'right'
      }
    })

    // Unlock it first so it is zoomable
    gameState.unlockedPostcards.push(3)
    // Make it active
    gameState.activePostcard = 3
    await wrapper.vm.$nextTick()

    // Lightbox modal containing img should exist in document.body (teleported)
    const modalImg = document.body.querySelector('img[alt="Expanded Postcard"]') as HTMLImageElement
    expect(modalImg).toBeTruthy()
    expect(modalImg.src).toContain('postcard_3.png')

    // Click modal background (represented by the fixed overlay wrapper) to dismiss
    const modalBg = document.body.querySelector('.fixed') as HTMLDivElement
    expect(modalBg).toBeTruthy()
    modalBg.click()
    
    await wrapper.vm.$nextTick()
    expect(gameState.activePostcard).toBe(null)
  })
})
