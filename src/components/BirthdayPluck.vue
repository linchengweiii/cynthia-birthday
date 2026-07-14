<script setup lang="ts">
import { computed } from 'vue'
import { gameState, setLetterOpen } from '@/store/game'
import giftBoxImg from '@/assets/gift_box.png'

defineProps<{
  letterTitle?: string
  letterBody?: string
  letterFrom?: string
}>()

const isVisible = computed(() => gameState.scrollProgress >= 98)
const isLetterOpen = computed(() => gameState.isLetterOpen)
</script>

<template>
  <div v-if="isVisible" class="flex flex-col items-center justify-center p-6 text-center select-none animate-pop-up">
    
    <!-- Closed Box Phase -->
    <div v-if="!isLetterOpen" class="flex flex-col items-center">
      <!-- Glowing Gift Box -->
      <div 
        @click="setLetterOpen(true)"
        class="w-36 h-36 relative cursor-pointer hover:scale-105 active:scale-95 transition-all duration-300 flex items-center justify-center"
      >
        <!-- Soft golden pulse glow behind the box -->
        <div class="absolute inset-0 bg-yellow-300/40 rounded-full blur-xl animate-ping"></div>
        
        <!-- Gift Box Image -->
        <img
          :src="giftBoxImg"
          alt="Pikmin Gift Box"
          class="w-28 h-28 object-contain relative z-10"
        />
      </div>
    </div>

    <!-- Opened Letter Modal -->
    <Teleport to="body">
      <Transition name="letter-fade">
        <div
          v-if="isLetterOpen"
          class="fixed inset-0 z-50 flex items-center justify-center bg-emerald-950/70 p-6 backdrop-blur-sm"
        >
          <div 
            class="bg-white border-8 border-amber-100/30 rounded-2xl p-5 md:p-6 shadow-2xl max-w-2xl w-full relative flex flex-col font-serif"
            @click.stop
          >
            <!-- Cute letter seal/stamp at top -->
            <div class="mx-auto w-12 h-12 bg-amber-100 rounded-full shadow-md flex items-center justify-center text-lg -mt-10 border-2 border-amber-50">
              🎂
            </div>
  
            <!-- Close button -->
            <button 
              @click="setLetterOpen(false)"
              class="absolute top-2 right-4 text-emerald-800/60 hover:text-emerald-800 font-sans text-xl"
              aria-label="Close letter"
            >
              ✕
            </button>
  
            <!-- Letter content -->
            <div class="mt-6 text-emerald-950 text-left overflow-y-auto max-h-[60vh] px-2 leading-relaxed">
              <h2 class="text-2xl font-bold text-emerald-900 border-b border-emerald-800/10 pb-3 text-center">
                {{ letterTitle || 'Happy Birthday!' }}
              </h2>
              <p class="mt-4 whitespace-pre-line text-base italic">
                {{ letterBody || 'Wishing you the happiest birthday filled with love, laughter, and beautiful adventures.\n\nThank you for being in my life!' }}
              </p>
              <p class="mt-8 text-right font-semibold text-emerald-800">
                {{ letterFrom || 'Your Pikmin Partner' }}
              </p>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>

  </div>
</template>

<style scoped>
@keyframes pop-up {
  0% {
    transform: scale(0.7);
    opacity: 0;
  }
  70% {
    transform: scale(1.05);
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
}
.animate-pop-up {
  animation: pop-up 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
}

/* Letter Modal Transition */
.letter-fade-enter-active,
.letter-fade-leave-active {
  transition: opacity 0.4s ease;
}
.letter-fade-enter-active > div,
.letter-fade-leave-active > div {
  transition: transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

.letter-fade-enter-from,
.letter-fade-leave-to {
  opacity: 0;
}
.letter-fade-enter-from > div {
  transform: scale(0.9) translateY(20px);
}
.letter-fade-leave-to > div {
  transform: scale(0.95) translateY(10px);
}
</style>
