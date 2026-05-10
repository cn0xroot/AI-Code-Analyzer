<template>
  <el-header class="app-header">
    <div class="header-left">
      <router-link to="/" class="logo">
        <span class="logo-mark">&#60;/&#62;</span>
        AI Code Analyzer
      </router-link>
    </div>
    <el-menu
      :default-active="activeIndex"
      mode="horizontal"
      router
      class="header-menu"
    >
      <el-menu-item index="/">首页</el-menu-item>
      <el-menu-item index="/analyze">代码分析</el-menu-item>
      <el-menu-item index="/history">历史记录</el-menu-item>
      <el-menu-item index="/settings">模型配置</el-menu-item>
    </el-menu>
    <div class="header-right">
      <el-popover placement="bottom-end" :width="220" trigger="click">
        <template #reference>
          <el-button text class="theme-btn">
            <span class="swatch-preview" :class="`sw-${theme}`"></span>
            主题
          </el-button>
        </template>
        <div class="theme-picker">
          <div class="theme-title">选择主题</div>
          <div class="theme-grid">
            <div
              v-for="t in themes"
              :key="t.id"
              class="theme-item"
              :class="{ selected: theme === t.id }"
              @click="handleTheme(t.id)"
            >
              <span class="swatch" :class="`sw-${t.id}`"></span>
              <span class="theme-label">{{ t.label }}</span>
            </div>
          </div>
        </div>
      </el-popover>
    </div>
  </el-header>
</template>

<script setup>
import { computed, watch } from 'vue'
import { useRoute } from 'vue-router'

const themes = [
  { id: 'midnight', label: '暗夜' },
  { id: 'ocean', label: '海洋' },
  { id: 'forest', label: '森林' },
  { id: 'sunset', label: '暮色' },
  { id: 'rose', label: '玫瑰' },
  { id: 'nord', label: 'Nord' },
  { id: 'light', label: '浅色' },
]

const props = defineProps({
  theme: { type: String, default: 'midnight' },
})
const emit = defineEmits(['update:theme'])

const route = useRoute()
const activeIndex = computed(() => route.path)

function handleTheme(t) {
  emit('update:theme', t)
  document.documentElement.setAttribute('data-theme', t)
}

watch(() => props.theme, (t) => {
  document.documentElement.setAttribute('data-theme', t)
}, { immediate: true })
</script>

<style scoped>
.app-header {
  display: flex;
  align-items: center;
  background: var(--bg-header);
  border-bottom: 1px solid var(--border-color);
  padding: 0 24px;
  height: 56px;
  backdrop-filter: blur(12px);
  transition: background 0.3s;
}

.header-left {
  margin-right: 40px;
}

.logo {
  font-size: 17px;
  font-weight: 700;
  color: var(--text-primary);
  text-decoration: none;
  display: flex;
  align-items: center;
  gap: 10px;
}

.logo-mark {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: 8px;
  background: linear-gradient(135deg, var(--accent), var(--accent-secondary, var(--accent-hover)));
  color: #fff;
  font-family: monospace;
  font-size: 13px;
  font-weight: 800;
  box-shadow: 0 0 20px rgba(99,102,241,0.25);
}

.header-menu {
  border-bottom: none;
  background: transparent;
  flex: 1;
  --el-menu-bg-color: transparent;
  --el-menu-text-color: var(--text-secondary);
  --el-menu-active-color: var(--accent);
  --el-menu-hover-bg-color: var(--accent-light);
}

.header-menu :deep(.el-menu-item) {
  border-bottom: 2px solid transparent;
  color: var(--text-secondary);
}

.header-menu :deep(.el-menu-item.is-active) {
  color: var(--accent) !important;
  border-bottom-color: var(--accent);
}

.header-menu :deep(.el-menu-item:hover) {
  color: var(--text-primary);
  background: var(--accent-light);
}

.header-right {
  margin-left: auto;
}

.theme-btn {
  color: var(--text-secondary) !important;
  display: flex;
  align-items: center;
  gap: 6px;
}

/* Theme picker popover */
.theme-picker {
  padding: 4px;
}

.theme-title {
  font-size: 12px;
  color: var(--text-muted);
  margin-bottom: 10px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.theme-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 6px;
}

.theme-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 10px;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.15s;
  border: 1px solid transparent;
}

.theme-item:hover {
  background: var(--accent-light);
}

.theme-item.selected {
  border-color: var(--accent);
  background: var(--accent-light);
}

.theme-label {
  font-size: 13px;
  color: var(--text-primary);
}

/* Swatches - gradient circles matching AI_Web_Search */
.swatch, .swatch-preview {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  flex-shrink: 0;
  border: 2px solid rgba(255,255,255,0.1);
}

.swatch-preview {
  width: 16px;
  height: 16px;
}

.sw-midnight { background: linear-gradient(135deg, #07080f 50%, #6366f1); }
.sw-ocean    { background: linear-gradient(135deg, #060d14 50%, #0ea5e9); }
.sw-forest   { background: linear-gradient(135deg, #030b05 50%, #22c55e); }
.sw-sunset   { background: linear-gradient(135deg, #0d0804 50%, #f97316); }
.sw-rose     { background: linear-gradient(135deg, #0d0610 50%, #ec4899); }
.sw-nord     { background: linear-gradient(135deg, #0e1117 50%, #88c0d0); }
.sw-light    { background: linear-gradient(135deg, #f1f5f9 50%, #6366f1); }
</style>
