import { describe, it, expect, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import WelcomeScreen from './WelcomeScreen.vue'
import { gameState, resetGame } from '@/store/game'

describe('WelcomeScreen.vue', () => {
  beforeEach(() => {
    resetGame()
  })

  it('renders default button text when props are not provided', () => {
    const wrapper = mount(WelcomeScreen)
    expect(wrapper.text()).toContain('Start Walk')
  })

  it('renders custom button text when props are provided', () => {
    const wrapper = mount(WelcomeScreen, {
      props: {
        buttonText: 'Let\'s Go!'
      }
    })
    expect(wrapper.text()).toContain("Let's Go!")
  })

  it('triggers startGame on button click and disappears', async () => {
    const wrapper = mount(WelcomeScreen)
    expect(gameState.hasStarted).toBe(false)
    expect(wrapper.find('div').exists()).toBe(true)

    // Click the button
    await wrapper.find('button').trigger('click')

    expect(gameState.hasStarted).toBe(true)
    
    await wrapper.vm.$nextTick()
    expect(wrapper.find('div').exists()).toBe(false)
  })
})
