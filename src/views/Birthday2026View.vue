<script setup lang="ts">
import WelcomeScreen from '../components/WelcomeScreen.vue'
import WalkingTrack from '../components/WalkingTrack.vue'

const letterTitle = '生日快樂🎂'
const letterBody = `不知不覺，我們在一起就要滿三年了。回看這一年，我們一起經歷了好多事情。

一起在美國生活了一個月、一起去了震撼的羚羊谷、一起淋雨看跨年煙火、一起尋訪咖啡廳、一起去摘米其林星星...而現在我們又一起來到歐洲、一起回到了我們一開始接觸的地方。

這些日子真的很開心、很幸運能有你陪在身邊。

祝你新的一歲順順利利、快快樂樂！
我們繼續一起牽手探索這個世界，好嗎？`
const letterFrom = '愛你的男友 ❤️'
</script>

<template>
  <main class="relative min-h-screen bg-slate-50 font-sans antialiased text-slate-800">
    <a
      href="#/"
      aria-label="回到首頁"
      class="fixed left-4 top-4 z-[100] rounded-full bg-white/90 px-4 py-2 text-sm font-semibold text-slate-700 shadow-md backdrop-blur transition hover:bg-white"
    >
      ← 首頁
    </a>
    <WelcomeScreen buttonText="開始散步" />
    <WalkingTrack :letter-title="letterTitle" :letter-body="letterBody" :letter-from="letterFrom" />
  </main>
</template>
