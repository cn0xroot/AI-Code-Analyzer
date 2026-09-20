<template>
  <div class="home-page">
    <section class="hero">
      <span class="hero-badge"><Icon name="zap" :size="14" />{{ t('home.badge') }}</span>
      <h1 class="hero-title">{{ t('home.heroTitle') }}</h1>
      <p class="hero-desc">{{ t('home.heroDesc') }}</p>
      <form class="hero-form" @submit.prevent="goAnalyze">
        <label class="url-field">
          <Icon name="branch" :size="18" />
          <input v-model="repoUrl" type="url" :placeholder="t('home.urlPlaceholder')" />
        </label>
        <el-button type="primary" size="large" native-type="submit">
          <Icon name="play" :size="16" />{{ t('home.analyze') }}
        </el-button>
      </form>
      <div class="hero-meta">
        <span>{{ t('home.or') }}</span>
        <router-link to="/analyze?tab=upload">{{ t('home.uploadZip') }}</router-link>
        <span>·</span>
        <span>{{ t('home.byok') }}</span>
      </div>
    </section>

    <section class="features">
      <div v-for="f in features" :key="f.icon" class="surface feature-card">
        <span class="feature-icon"><Icon :name="f.icon" :size="22" /></span>
        <h3>{{ t(f.title) }}</h3>
        <p>{{ t(f.desc) }}</p>
      </div>
    </section>

    <section class="recent">
      <div class="recent-head">
        <span class="section-label">{{ t('home.recent') }}</span>
        <router-link to="/history" class="text-secondary">{{ t('home.viewAll') }}</router-link>
      </div>
      <div class="surface recent-table">
        <div v-if="recent.length === 0" class="recent-empty">{{ t('home.noRecent') }}</div>
        <div v-for="row in recent" :key="row.id" class="recent-row">
          <span class="recent-name">{{ row.project_name || `Project #${row.project_id}` }}</span>
          <span class="status-chip">{{ typeLabel(row.analysis_type) }}</span>
          <span class="status-chip" :class="statusClass(row.status)">{{ statusLabel(row.status) }}</span>
          <span class="mono">{{ row.ai_provider }} / {{ row.ai_model }}</span>
          <span class="text-secondary recent-time">{{ formatTime(row.created_at) }}</span>
          <router-link :to="`/result/${row.id}`" class="recent-open">{{ t('home.open') }}</router-link>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import Icon from '../components/Icon.vue'
import { listHistory } from '../api/history'
import { statusClass } from '../utils/status'

const { t, te, locale } = useI18n()
const router = useRouter()
const repoUrl = ref('')
const recent = ref([])

const features = [
  { icon: 'globe', title: 'home.feature1Title', desc: 'home.feature1Desc' },
  { icon: 'layers', title: 'home.feature2Title', desc: 'home.feature2Desc' },
  { icon: 'chart', title: 'home.feature3Title', desc: 'home.feature3Desc' },
]

function goAnalyze() {
  if (repoUrl.value.trim()) sessionStorage.setItem('prefill_repo_url', repoUrl.value.trim())
  router.push('/analyze')
}

function typeLabel(type) {
  return type && te(`analysisType.${type}`) ? t(`analysisType.${type}`) : type
}

function statusLabel(s) {
  return s && te(`status.${s}`) ? t(`status.${s}`) : s
}

function formatTime(value) {
  if (!value) return '-'
  return new Date(value).toLocaleString(locale.value, { dateStyle: 'medium', timeStyle: 'short' })
}

onMounted(async () => {
  try {
    const { data } = await listHistory(0, 4)
    recent.value = data.items
  } catch { /* ignore */ }
})
</script>

<style scoped>
.home-page {
  display: flex;
  flex-direction: column;
  gap: 40px;
}

.hero {
  display: flex;
  flex-direction: column;
  gap: 20px;
  max-width: 760px;
}

.hero-badge {
  display: inline-flex;
  align-self: flex-start;
  align-items: center;
  gap: 8px;
  height: 28px;
  padding: 0 12px;
  border-radius: 999px;
  border: 1px solid var(--accent-line);
  color: var(--accent);
  font-family: var(--font-mono);
  font-size: 12px;
}

.hero-title {
  font-size: 48px;
  line-height: 1.08;
  font-weight: 700;
  letter-spacing: -0.025em;
}

.hero-desc {
  font-size: 17px;
  line-height: 1.6;
  color: var(--text-secondary);
  max-width: 620px;
}

.hero-form {
  display: flex;
  gap: 10px;
  align-items: center;
  margin-top: 8px;
}

.url-field {
  flex: 1;
  display: flex;
  align-items: center;
  gap: 12px;
  height: 52px;
  padding: 0 16px;
  background: var(--bg-card);
  border: 1px solid var(--border-strong);
  border-radius: 12px;
  color: var(--text-muted);
  transition: border-color 0.15s;
}

.url-field:focus-within {
  border-color: var(--accent);
}

.url-field input {
  flex: 1;
  background: transparent;
  border: 0;
  outline: none;
  color: var(--text-primary);
  font-family: var(--font-mono);
  font-size: 14px;
}

.url-field input::placeholder {
  color: var(--text-muted);
}

.hero-meta {
  display: flex;
  gap: 12px;
  font-size: 13px;
  color: var(--text-muted);
}

.features {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 20px;
}

.feature-card {
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.feature-icon {
  display: inline-flex;
  width: 40px;
  height: 40px;
  align-items: center;
  justify-content: center;
  border-radius: 10px;
  background: var(--accent-light);
  color: var(--accent);
}

.feature-card h3 {
  font-size: 18px;
  font-weight: 600;
}

.feature-card p {
  font-size: 14px;
  line-height: 1.55;
  color: var(--text-secondary);
}

.recent {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.recent-head {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.recent-table {
  overflow: hidden;
}

.recent-empty {
  padding: 28px 20px;
  color: var(--text-muted);
  font-size: 14px;
}

.recent-row {
  display: grid;
  grid-template-columns: 1.4fr 120px 140px 1.2fr 160px 60px;
  align-items: center;
  gap: 12px;
  height: 60px;
  padding: 0 20px;
  border-top: 1px solid var(--border-color);
  font-size: 14px;
}

.recent-row:first-child {
  border-top: 0;
}

.recent-name {
  font-weight: 500;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.recent-row .status-chip { justify-self: start; }

.recent-open {
  font-size: 13px;
  font-weight: 600;
  text-align: right;
}

@media (max-width: 1100px) {
  .features { grid-template-columns: 1fr; }
  .recent-row { grid-template-columns: 1fr 120px 140px 60px; }
  .recent-row .mono, .recent-time { display: none; }
}
</style>
