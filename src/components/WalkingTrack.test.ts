import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { mount } from '@vue/test-utils'
import WalkingTrack from './WalkingTrack.vue'
import PostcardItem from './PostcardItem.vue'
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

describe('WalkingTrack.vue', () => {
  it('should be hidden if game has not started', () => {
    wrapper = mount(WalkingTrack)
    expect(wrapper.find('div').exists()).toBe(false)
  })

  it('should render when game starts', async () => {
    gameState.hasStarted = true
    wrapper = mount(WalkingTrack)
    await wrapper.vm.$nextTick()

    expect(wrapper.find('.min-h-\\[500vh\\]').exists()).toBe(true)
    
    // Check if progress bar exists
    expect(wrapper.find('.bg-emerald-200').exists()).toBe(true)
    
    // Check if 6 PostcardItem components are rendered
    const postcards = wrapper.findAllComponents(PostcardItem)
    expect(postcards).toHaveLength(6)
    expect(postcards[0].props('index')).toBe(0)
    expect(postcards[1].props('index')).toBe(1)
    expect(postcards[2].props('index')).toBe(2)
    expect(postcards[3].props('index')).toBe(3)
    expect(postcards[4].props('index')).toBe(4)
    expect(postcards[5].props('index')).toBe(5)

    // Check if BirthdayPluck component is rendered
    expect(wrapper.findComponent(BirthdayPluck).exists()).toBe(true)
  })

  it('adjusts progress bar width based on scroll progress state', async () => {
    gameState.hasStarted = true
    wrapper = mount(WalkingTrack)
    
    gameState.scrollProgress = 42
    await wrapper.vm.$nextTick()

    const progressBar = wrapper.find('.bg-emerald-600')
    expect(progressBar.attributes('style')).toContain('width: 42%')
  })
})
