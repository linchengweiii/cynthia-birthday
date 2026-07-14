<script setup lang="ts">
import { computed } from 'vue'
import { gameState, setActivePostcard } from '@/store/game'

const props = defineProps<{
  index: number
  side: 'left' | 'right'
}>()

// Check if this postcard has been unlocked
const isUnlocked = computed(() => gameState.unlockedPostcards.includes(props.index))

// Map index to the local import path of postcard image
const imagePath = computed(() => {
  return new URL(`../assets/postcards/postcard_${props.index}.png`, import.meta.url).href
})

// Check if this postcard is currently clicked open in zoom mode
const isActive = computed(() => gameState.activePostcard === props.index)

// Random-like soft rotation class for a playful, game-like look
const rotationClass = computed(() => {
  const angles = ['-rotate-2', 'rotate-2', '-rotate-1', 'rotate-1']
  return angles[props.index % angles.length]
})
</script>

<template>
  <div class="relative">
    <!-- The Postcard Dialog Bubble Frame (Always visible, simple scale transition on active) -->
    <div
      @click="isUnlocked ? setActivePostcard(index) : null"
      class="transition-transform duration-300 transform cursor-pointer select-none relative"
      style="will-change: transform;"
      :class="[rotationClass]"
    >
      <!-- Dialog Speech Bubble Box -->
      <div 
        class="relative bg-amber-50/75 border-4 border-amber-100/75 rounded-full p-1 shadow-lg hover:shadow-2xl hover:scale-105 transition duration-300 ease-out flex items-center justify-center w-14 h-14 md:w-20 md:h-20 mx-auto"
      >
        <!-- Tiny Postcard Thumbnail or Locked state -->
        <div class="w-full h-full overflow-hidden rounded-full bg-amber-100/20 flex items-center justify-center">
          <Transition name="fade-inner" mode="out-in">
            <img
              v-if="isUnlocked"
              :key="'unlocked-' + index"
              :src="imagePath"
              alt="Tiny Postcard"
              class="w-full h-full object-cover rounded-full select-none"
              @error="($event.target as HTMLImageElement).src = 'https://placehold.co/100x100/e2e8f0/065f46?text=Postcard+' + (index + 1)"
            />
            <div 
              v-else
              :key="'locked-' + index"
              class="text-xl md:text-2xl select-none font-bold text-emerald-800/35"
            >
              ❓
            </div>
          </Transition>
        </div>

        <!-- Speech bubble pointer (triangle) pointing downwards -->
        <div class="absolute -bottom-3 left-1/2 -translate-x-1/2 w-0 h-0 border-l-8 border-l-transparent border-r-8 border-r-transparent border-t-[12px] border-t-amber-100/75 pointer-events-none"></div>
        <div class="absolute -bottom-2 left-1/2 -translate-x-1/2 w-0 h-0 border-l-6 border-l-transparent border-r-6 border-r-transparent border-t-[10px] border-t-amber-50/75 pointer-events-none"></div>
      </div>
    </div>

    <!-- Zoomed Lightbox Modal Overlay (Teleported for full viewport coverage) -->
    <Teleport to="body">
      <Transition name="zoom">
        <div
          v-if="isActive && isUnlocked"
          @click="setActivePostcard(null)"
          class="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4 md:p-8 backdrop-blur-sm cursor-zoom-out"
        >
          <div class="relative max-w-4xl max-h-[85vh] w-full flex items-center justify-center" @click.stop>
            <!-- Raw Uncropped Postcard Image -->
            <img
              :src="imagePath"
              alt="Expanded Postcard"
              class="max-w-full max-h-[80vh] object-contain rounded-lg shadow-2xl animate-scale-up"
            />
            <!-- Top Right Dismiss Button -->
            <button
              @click="setActivePostcard(null)"
              class="absolute -top-10 right-0 md:-right-8 text-white/70 hover:text-white font-sans text-3xl focus:outline-none"
              aria-label="Close image"
            >
              ✕
            </button>
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<style scoped>
/* Image scale up keyframes for modal reveal */
@keyframes scale-up {
  from {
    transform: scale(0.95);
    opacity: 0;
  }
  to {
    transform: scale(1);
    opacity: 1;
  }
}
.animate-scale-up {
  animation: scale-up 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}

/* Lightbox Fade Transition */
.zoom-enter-active,
.zoom-leave-active {
  transition: opacity 0.35s ease;
}
.zoom-enter-from,
.zoom-leave-to {
  opacity: 0;
}

/* Inner Unlock Transition (Pop and twist) */
.fade-inner-enter-active,
.fade-inner-leave-active {
  transition: opacity 0.4s ease, transform 0.4s ease;
}
.fade-inner-enter-from {
  opacity: 0;
  transform: scale(0.8) rotate(-12deg);
}
.fade-inner-leave-to {
  opacity: 0;
  transform: scale(0.8) rotate(12deg);
}
</style>
