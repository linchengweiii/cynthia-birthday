<script setup lang="ts">
import WelcomeScreen from './components/WelcomeScreen.vue'
import WalkingTrack from './components/WalkingTrack.vue'

// Custom letter text based on the original memories card
const letterTitle = '生日快樂🎂'
const letterBody = `不知不覺，我們在一起就要滿三年了。回看這一年，我們一起經歷了好多事情。

一起在美國生活了一個月、一起去了震撼的羚羊谷、一起淋雨看跨年煙火、一起尋訪咖啡廳、一起去摘米其林星星...而現在我們又一起來到歐洲、一起回到了我們一開始接觸的地方。

這些日子真的很開心、很幸運能有你陪在身邊。

祝你新的一歲順順利利、快快樂樂！
我們繼續一起牽手探索這個世界，好嗎？`
const letterFrom = '愛你的男友 ❤️'
</script>

<template>
  <div class="relative min-h-screen bg-slate-50 font-sans antialiased text-slate-800">
    <!-- Welcome Screen to grab interaction first -->
    <WelcomeScreen
      buttonText="開始散步"
    />



    <!-- The Scroll Walking Journey -->
    <WalkingTrack
      :letter-title="letterTitle"
      :letter-body="letterBody"
      :letter-from="letterFrom"
    />
  </div>
</template>

<style>
/* Global resets & scroll smoothing */
html, body {
  margin: 0;
  padding: 0;
  scroll-behavior: smooth;
  scrollbar-gutter: stable;
}

/* Ensure mobile scroll feels smooth */
body {
  overflow-x: hidden;
  -webkit-overflow-scrolling: touch;
}
</style>
