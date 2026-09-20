<template>
  <el-config-provider :locale="elLocale">
    <div id="app-container" :data-theme="theme">
      <AppSidebar :theme="theme" @update:theme="setTheme" />
      <main class="main-content">
        <router-view />
      </main>
    </div>
  </el-config-provider>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import zhCn from 'element-plus/es/locale/lang/zh-cn'
import en from 'element-plus/es/locale/lang/en'
import AppSidebar from './components/AppSidebar.vue'

const { locale } = useI18n()
const elLocale = computed(() => (locale.value.startsWith('zh') ? zhCn : en))

const theme = ref(localStorage.getItem('app-theme') || 'midnight')

function setTheme(t) {
  theme.value = t
  localStorage.setItem('app-theme', t)
}

onMounted(() => {
  document.documentElement.setAttribute('data-theme', theme.value)
  document.documentElement.setAttribute('lang', locale.value)
})
</script>
