<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'

import HomeView from './views/HomeView.vue'
import Birthday2024View from './views/Birthday2024View.vue'
import Birthday2026View from './views/Birthday2026View.vue'

type Route = 'home' | '2024' | '2026'

const hash = ref(window.location.hash)

const route = computed<Route>(() => {
  const path = hash.value.replace(/^#\/?/, '').replace(/\/$/, '')
  return path === '2024' || path === '2026' ? path : 'home'
})

function updateRoute() {
  hash.value = window.location.hash
  window.scrollTo({ top: 0 })
}

onMounted(() => window.addEventListener('hashchange', updateRoute))
onBeforeUnmount(() => window.removeEventListener('hashchange', updateRoute))
</script>

<template>
  <HomeView v-if="route === 'home'" />
  <Birthday2024View v-else-if="route === '2024'" />
  <Birthday2026View v-else />
</template>

<style>
html,
body,
#app {
  margin: 0;
  min-height: 100%;
  padding: 0;
}

html {
  scroll-behavior: smooth;
  scrollbar-gutter: stable;
}

body {
  overflow-x: hidden;
  -webkit-overflow-scrolling: touch;
}
</style>
