<template>
  <div class="home-page">
    <div class="hero">
      <div class="hero-badge">AI-Powered Code Analysis</div>
      <h1>AI Code Analyzer</h1>
      <p class="subtitle">
        {{ t('home.subtitle') }}
      </p>
      <div class="features">
        <el-row :gutter="20">
          <el-col :span="8">
            <el-card shadow="hover" class="feature-card">
              <div class="feature-icon">&#127760;</div>
              <h3>{{ t('home.feature1Title') }}</h3>
              <p>{{ t('home.feature1Desc') }}</p>
            </el-card>
          </el-col>
          <el-col :span="8">
            <el-card shadow="hover" class="feature-card">
              <div class="feature-icon">&#128187;</div>
              <h3>{{ t('home.feature2Title') }}</h3>
              <p>{{ t('home.feature2Desc') }}</p>
            </el-card>
          </el-col>
          <el-col :span="8">
            <el-card shadow="hover" class="feature-card">
              <div class="feature-icon">&#128202;</div>
              <h3>{{ t('home.feature3Title') }}</h3>
              <p>{{ t('home.feature3Desc') }}</p>
            </el-card>
          </el-col>
        </el-row>
      </div>
      <div class="actions">
        <el-button type="primary" size="large" @click="$router.push('/analyze')">
          {{ t('common.startAnalysis') }}
        </el-button>
        <el-button size="large" @click="$router.push('/history')">
          {{ t('home.viewHistory') }}
        </el-button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
</script>

<style scoped>
.home-page {
  max-width: 960px;
  margin: 0 auto;
  padding: 60px 20px;
}

.hero {
  text-align: center;
}

.hero-badge {
  display: inline-block;
  padding: 4px 16px;
  background: var(--accent-light);
  color: var(--accent);
  border-radius: 20px;
  font-size: 13px;
  font-weight: 600;
  margin-bottom: 20px;
}

.hero h1 {
  font-size: 40px;
  color: var(--text-primary);
  margin-bottom: 16px;
  font-weight: 800;
  background: linear-gradient(135deg, var(--accent), var(--accent-hover));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.subtitle {
  font-size: 16px;
  color: var(--text-muted);
  margin-bottom: 48px;
  line-height: 1.6;
}

.features {
  margin-bottom: 48px;
  text-align: left;
}

.feature-card {
  text-align: center;
  padding: 8px;
  min-height: 200px;
}

.feature-icon {
  font-size: 36px;
  margin-bottom: 12px;
}

.feature-card h3 {
  color: var(--accent);
  margin-bottom: 8px;
  font-size: 16px;
}

.feature-card p {
  color: var(--text-secondary);
  line-height: 1.6;
  font-size: 14px;
}

.actions {
  display: flex;
  gap: 16px;
  justify-content: center;
}
</style>
