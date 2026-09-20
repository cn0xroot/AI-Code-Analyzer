<template>
  <aside class="app-sidebar">
    <router-link to="/" class="brand">
      <span class="brand-mark"><Icon name="code" :size="20" :stroke-width="2.25" /></span>
      <span class="brand-name">AI Code Analyzer</span>
    </router-link>

    <nav class="nav">
      <router-link
        v-for="item in navItems"
        :key="item.to"
        :to="item.to"
        class="nav-item"
        :class="{ active: isActive(item) }"
      >
        <Icon :name="item.icon" />
        <span>{{ t(item.label) }}</span>
      </router-link>
    </nav>

    <div class="sidebar-footer">
      <el-dropdown trigger="click" placement="top-start" @command="setLocale">
        <button type="button" class="footer-btn">
          <Icon name="lang" />
          <span class="footer-label">{{ locale.startsWith('zh') ? t('lang.zh') : t('lang.en') }}</span>
          <Icon name="chev" :size="16" />
        </button>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item command="zh-CN" :class="{ 'is-active': locale === 'zh-CN' }">{{ t('lang.zh') }}</el-dropdown-item>
            <el-dropdown-item command="en" :class="{ 'is-active': locale === 'en' }">{{ t('lang.en') }}</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>

      <el-popover placement="top-start" :width="236" trigger="click">
        <template #reference>
          <button type="button" class="footer-btn">
            <span class="swatch" :class="`sw-${theme}`"></span>
            <span class="footer-label">{{ t(`theme.${theme}`) }}</span>
            <Icon name="chev" :size="16" />
          </button>
        </template>
        <div class="theme-picker">
          <div class="section-label">{{ t('nav.selectTheme') }}</div>
          <div class="theme-grid">
            <button
              v-for="th in themes"
              :key="th"
              type="button"
              class="theme-item"
              :class="{ selected: theme === th }"
              @click="emit('update:theme', th)"
            >
              <span class="swatch" :class="`sw-${th}`"></span>
              <span>{{ t(`theme.${th}`) }}</span>
            </button>
          </div>
        </div>
      </el-popover>

      <div class="version mono">v1.0.0</div>
    </div>
  </aside>
</template>

<script setup>
import { useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import Icon from './Icon.vue'
import { setLocale } from '../i18n'

defineProps({
  theme: { type: String, default: 'midnight' },
})
const emit = defineEmits(['update:theme'])

const { t, locale } = useI18n()
const route = useRoute()

const navItems = [
  { to: '/', icon: 'home', label: 'nav.home' },
  { to: '/analyze', icon: 'scan', label: 'nav.analyze', match: ['/analyze', '/result'] },
  { to: '/history', icon: 'clock', label: 'nav.history' },
  { to: '/settings', icon: 'cpu', label: 'nav.settings' },
]

const themes = ['midnight', 'ocean', 'forest', 'sunset', 'rose', 'nord', 'light']

function isActive(item) {
  if (item.to === '/') return route.path === '/'
  const prefixes = item.match || [item.to]
  return prefixes.some((p) => route.path.startsWith(p))
}
</script>

<style scoped>
.app-sidebar {
  width: 240px;
  flex-shrink: 0;
  position: sticky;
  top: 0;
  height: 100vh;
  background: var(--bg-sidebar);
  border-right: 1px solid var(--border-color);
  padding: 20px 16px;
  display: flex;
  flex-direction: column;
  gap: 28px;
}

.brand {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 4px 6px;
  color: var(--text-primary);
}

.brand-mark {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border-radius: 10px;
  background: var(--accent);
  color: var(--accent-ink);
  flex-shrink: 0;
}

.brand-name {
  font-family: var(--font-display);
  font-size: 16px;
  font-weight: 700;
  letter-spacing: -0.01em;
}

.nav {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 12px;
  height: 44px;
  padding: 0 14px;
  border-radius: 10px;
  color: var(--text-secondary);
  font-size: 14px;
  font-weight: 500;
  transition: background 0.15s, color 0.15s;
}

.nav-item:hover {
  background: var(--bg-secondary);
  color: var(--text-primary);
}

.nav-item.active {
  background: var(--accent-light);
  color: var(--accent);
}

.sidebar-footer {
  margin-top: auto;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.footer-btn {
  display: flex;
  align-items: center;
  gap: 12px;
  width: 100%;
  height: 44px;
  padding: 0 14px;
  border-radius: 10px;
  border: 0;
  background: transparent;
  color: var(--text-secondary);
  font-size: 13px;
  cursor: pointer;
  text-align: left;
}

.footer-btn:hover {
  background: var(--bg-secondary);
  color: var(--text-primary);
}

.footer-label {
  flex: 1;
}

.version {
  padding: 10px 14px 0;
  font-size: 11px;
  color: var(--text-muted);
}

.theme-picker {
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 4px;
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
  border: 1px solid transparent;
  background: transparent;
  color: var(--text-primary);
  font-size: 13px;
  cursor: pointer;
  text-align: left;
}

.theme-item:hover { background: var(--accent-light); }
.theme-item.selected { border-color: var(--accent-line); background: var(--accent-light); }

.swatch {
  width: 18px;
  height: 18px;
  border-radius: 50%;
  flex-shrink: 0;
  border: 2px solid rgba(255, 255, 255, 0.12);
}

.sw-midnight { background: linear-gradient(135deg, #0b0d12 50%, #35d0a0); }
.sw-ocean    { background: linear-gradient(135deg, #060d14 50%, #0ea5e9); }
.sw-forest   { background: linear-gradient(135deg, #030b05 50%, #22c55e); }
.sw-sunset   { background: linear-gradient(135deg, #0d0804 50%, #f97316); }
.sw-rose     { background: linear-gradient(135deg, #0d0610 50%, #ec4899); }
.sw-nord     { background: linear-gradient(135deg, #0e1117 50%, #88c0d0); }
.sw-light    { background: linear-gradient(135deg, #f4f5f7 50%, #0f9f78); }

:deep(.el-dropdown) { width: 100%; }
:deep(.el-dropdown-menu__item.is-active) { color: var(--accent); font-weight: 600; }
</style>
