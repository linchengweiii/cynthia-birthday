<script setup lang="ts">
import { computed } from 'vue'
import { gameState, startGame } from '@/store/game'
import redPikminLayImg from '@/assets/red_pikmin_lay.png'

defineProps<{
  buttonText?: string
}>()

const isVisible = computed(() => !gameState.hasStarted)
</script>

<template>
  <Transition name="fade">
    <div
      v-if="isVisible"
      class="absolute inset-0 z-50 flex flex-col items-center justify-center bg-gradient-to-b from-green-50 to-emerald-100 p-6 text-center"
    >

      <!-- Decorative Pikmin Graphic -->
      <div class="relative w-40 h-40 mb-10 flex items-center justify-center">
        <!-- Slow spinning dotted ring -->
        <svg class="absolute w-36 h-36 text-emerald-600/15 animate-spin-slow pointer-events-none" viewBox="0 0 100 100">
          <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" stroke-width="1.5" stroke-dasharray="5,6" />
        </svg>
        <!-- Soft breathing glow -->
        <div class="absolute w-28 h-28 bg-emerald-600/10 rounded-full animate-glow-pulse pointer-events-none"></div>
        
        <!-- Laying Red Pikmin image -->
        <img
          :src="redPikminLayImg"
          alt="Laying Red Pikmin"
          class="w-32 h-20 object-contain relative z-10 animate-bounce-slow"
        />
      </div>

      <!-- Start Button -->
      <button
        @click="startGame"
        class="px-8 py-4 bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white font-bold text-lg rounded-full shadow-lg transition duration-200 transform hover:-translate-y-0.5"
      >
        {{ buttonText || 'Start Walk' }}
      </button>
    </div>
  </Transition>
</template>

<style scoped>
.fade-leave-active {
  transition: opacity 0.8s ease;
}
.fade-leave-to {
  opacity: 0;
}

@keyframes bounce-slow {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-8px);
  }
}
.animate-bounce-slow {
  animation: bounce-slow 3s infinite ease-in-out;
}

@keyframes spin-slow {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
.animate-spin-slow {
  animation: spin-slow 20s linear infinite;
}

@keyframes glow-pulse {
  0%, 100% {
    transform: scale(0.95);
    opacity: 0.5;
  }
  50% {
    transform: scale(1.05);
    opacity: 0.9;
  }
}
.animate-glow-pulse {
  animation: glow-pulse 4s infinite ease-in-out;
}
</style>
