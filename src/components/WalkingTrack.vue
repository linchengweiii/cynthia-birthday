<script setup lang="ts">
import { onMounted, onBeforeUnmount, computed } from 'vue'
import { gameState, updateScrollProgress, setWalking } from '@/store/game'
import PostcardItem from './PostcardItem.vue'
import BirthdayPluck from './BirthdayPluck.vue'
import rockPikminImg from '@/assets/rock_pikmin.png'

// Curves math for the winding road
const getRoadX = (progress: number) => {
  const amplitude = 12 // % width amplitude
  const frequency = 4 * Math.PI // 2 full sine waves
  const angle = (progress / 100) * frequency
  return 50 + amplitude * Math.sin(angle)
}

const roadPathD = computed(() => {
  const points: string[] = []
  for (let i = 0; i <= 99; i++) {
    points.push(`${getRoadX(i)},${i}`)
  }
  return `M ${points.join(' L ')}`
})



const flowers = computed(() => {
  const list = []
  
  // High-entropy deterministic hash function (returns pseudo-random float 0 to 1)
  const rand = (a: number, b: number) => {
    const val = Math.sin(a * 12.9898 + b * 78.233) * 43758.5453123
    return val - Math.floor(val)
  }

  const types = ['🌸', '🌼', '🌷', '🌹', '🌺', '🌻', '💮']
  const sizes = ['text-lg', 'text-xl', 'text-2xl', 'text-3xl', 'text-4xl']

  // Step by 0.3% progress (approx 310 steps)
  // Limit to 98% height so flowers don't sprout underneath the gift box
  for (let y = 3; y <= 98; y += 0.3) {
    // Spawn 4 flowers at each step (yielding ~1,240 flowers total)
    for (let j = 0; j < 4; j++) {
      const r1 = rand(y, j)
      const r2 = rand(y + 17, j + 53)
      const r3 = rand(y + 41, j + 89)

      // Uniformly scatter horizontally between -11% and +11% relative to road center
      const xOffset = (r1 * 2 - 1) * 11
      // Scatter vertically up to +-0.4% to break rows
      const yScatter = (r2 * 2 - 1) * 0.4
      const targetY = y + yScatter

      const emoji = types[Math.floor(r2 * types.length)]
      const sizeClass = sizes[Math.floor(r3 * sizes.length)]

      list.push({
        x: getRoadX(targetY) + xOffset,
        y: targetY,
        emoji: emoji,
        sizeClass: sizeClass,
        isBloomed: gameState.scrollProgress >= targetY
      })
    }
  }
  return list
})

// Calculate avatar position in the viewport (moving from top: 10% to top: 95% to land at 99% page Y)
const avatarY = computed(() => 10 + 0.85 * gameState.scrollProgress)
// Synced X coordinate matching the road curve P_road = 2 + 0.97 * scrollProgress (lands at getRoadX(99)%)
const avatarX = computed(() => getRoadX(2 + 0.97 * gameState.scrollProgress))




defineProps<{
  letterTitle?: string
  letterBody?: string
  letterFrom?: string
}>()

// Refs for scroll handling
let targetProgress = 0
let currentProgress = 0
let rafId: number | null = null

// Handles the raw scroll input
const onScroll = () => {
  const scrollTop = window.scrollY
  const scrollHeight = document.documentElement.scrollHeight - window.innerHeight
  const progress = scrollHeight > 0 ? (scrollTop / scrollHeight) * 100 : 0
  targetProgress = progress
}

// Animation loop to lerp scroll progress
const animate = () => {
  const diff = targetProgress - currentProgress
  
  if (Math.abs(diff) > 0.05) {
    currentProgress += diff * 0.15 // lerp speed
    updateScrollProgress(currentProgress)
    setWalking(true)
  } else {
    currentProgress = targetProgress
    updateScrollProgress(currentProgress)
    setWalking(false)
  }
  
  rafId = requestAnimationFrame(animate)
}

onMounted(() => {
  window.scrollTo(0, 0)
  window.addEventListener('scroll', onScroll, { passive: true })
  rafId = requestAnimationFrame(animate)
})

onBeforeUnmount(() => {
  window.removeEventListener('scroll', onScroll)
  if (rafId) {
    cancelAnimationFrame(rafId)
  }
})
</script>

<template>
  <div v-if="gameState.hasStarted" class="relative min-h-[500vh] bg-gradient-to-b from-emerald-100 via-green-100 to-yellow-50">
    
    <!-- Floating Progress Bar -->
    <div class="fixed top-0 left-0 right-0 z-30 h-1.5 bg-emerald-200">
      <div
        class="h-full bg-emerald-600 transition-all duration-75"
        :style="{ width: `${gameState.scrollProgress}%` }"
      ></div>
    </div>

    <!-- The Winding Garden Path (Solid Light Orange Stripe) -->
    <svg class="absolute inset-y-0 left-0 w-full h-full pointer-events-none" viewBox="0 0 100 100" preserveAspectRatio="none">
      <path :d="roadPathD" fill="none" stroke="#fed7aa" stroke-width="16" stroke-linecap="round" class="opacity-40" style="vector-effect: non-scaling-stroke;" />
    </svg>

    <!-- Blooming Flowers along the road side -->
    <div class="absolute inset-y-0 left-0 right-0 pointer-events-none">
      <div
        v-for="(flower, index) in flowers"
        :key="index"
        class="absolute transition-[transform,opacity] duration-500 ease-out transform -translate-x-1/2 -translate-y-1/2 select-none"
        :style="{ left: `${flower.x}%`, top: `${flower.y}%` }"
        :class="[
          flower.sizeClass,
          flower.isBloomed 
            ? 'opacity-100 scale-100 rotate-0' 
            : 'opacity-0 scale-0 rotate-12'
        ]"
      >
        {{ flower.emoji }}
      </div>
    </div>

    <!-- Postcards Placed along the trail -->
    <div class="absolute inset-x-0 top-0 h-full pointer-events-none">
      
      <!-- Postcard 1 (Left) - Positioned at 15% -->
      <div class="absolute top-[15%] left-4 right-4 md:left-24 md:right-auto md:w-96 pointer-events-auto">
        <PostcardItem :index="0" side="left" />
      </div>

      <!-- Postcard 2 (Right) - Positioned at 29% -->
      <div class="absolute top-[29%] left-4 right-4 md:right-24 md:left-auto md:w-96 pointer-events-auto">
        <PostcardItem :index="1" side="right" />
      </div>

      <!-- Postcard 3 (Left) - Positioned at 43% -->
      <div class="absolute top-[43%] left-4 right-4 md:left-24 md:right-auto md:w-96 pointer-events-auto">
        <PostcardItem :index="2" side="left" />
      </div>

      <!-- Postcard 4 (Right) - Positioned at 57% -->
      <div class="absolute top-[57%] left-4 right-4 md:right-24 md:left-auto md:w-96 pointer-events-auto">
        <PostcardItem :index="3" side="right" />
      </div>

      <!-- Postcard 5 (Left) - Positioned at 71% -->
      <div class="absolute top-[71%] left-4 right-4 md:left-24 md:right-auto md:w-96 pointer-events-auto">
        <PostcardItem :index="4" side="left" />
      </div>

      <!-- Postcard 6 (Right) - Positioned at 85% -->
      <div class="absolute top-[85%] left-4 right-4 md:right-24 md:left-auto md:w-96 pointer-events-auto">
        <PostcardItem :index="5" side="right" />
      </div>

    </div>

    <!-- Fixed Viewport Elements (Avatar container) -->
    <div class="fixed inset-0 pointer-events-none z-10">
      <!-- Winding Waddle Avatar -->
      <div 
        class="absolute pointer-events-auto transition-all duration-150 ease-out"
        :style="{ left: `${avatarX}%`, top: `${avatarY}%` }"
        style="transform: translate(-50%, -50%);"
        :class="{ 'animate-wobble-walk': gameState.isWalking }"
      >
        <!-- The Rock Pikmin Character Image -->
        <img
          :src="rockPikminImg"
          alt="Rock Pikmin"
          class="w-32 h-32 object-contain drop-shadow-md select-none"
        />
      </div>
    </div>

    <!-- The Final Destination: Gift Box Zone (Positioned relative to winding road end) -->
    <div 
      class="absolute bottom-0 h-screen flex flex-col justify-end pb-[5vh] items-center pointer-events-none"
      :style="{ left: `${getRoadX(99)}%`, transform: 'translateX(-50%)' }"
    >
      <div class="pointer-events-auto">
        <BirthdayPluck
          :letter-title="letterTitle"
          :letter-body="letterBody"
          :letter-from="letterFrom"
        />
      </div>
    </div>

  </div>
</template>

<style scoped>
/* Keyframe animations for the walk cycle */
@keyframes wobble-walk {
  0%, 100% {
    transform: translate(-50%, -50%) rotate(-3deg);
  }
  50% {
    transform: translate(-50%, calc(-50% - 6px)) rotate(3deg);
  }
}
.animate-wobble-walk {
  animation: wobble-walk 0.55s infinite ease-in-out;
}

</style>
