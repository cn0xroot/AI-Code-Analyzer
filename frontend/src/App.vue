<template>
  <div id="app-container" :data-theme="theme">
    <AppHeader :theme="theme" @update:theme="setTheme" />
    <main class="main-content">
      <router-view />
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import AppHeader from './components/AppHeader.vue'

const theme = ref(localStorage.getItem('app-theme') || 'midnight')

function setTheme(t) {
  theme.value = t
  localStorage.setItem('app-theme', t)
}

onMounted(() => {
  document.documentElement.setAttribute('data-theme', theme.value)
})
</script>
