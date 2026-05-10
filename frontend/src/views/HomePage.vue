<template>
  <div class="home-page">
    <div class="hero">
      <div class="hero-badge">AI-Powered Code Analysis</div>
      <h1>AI Code Analyzer</h1>
      <p class="subtitle">
        基于 AI 大模型的代码分析工具，自动生成项目架构图、类图、流程图
      </p>
      <div class="features">
        <el-row :gutter="20">
          <el-col :span="8">
            <el-card shadow="hover" class="feature-card">
              <div class="feature-icon">&#127760;</div>
              <h3>多平台支持</h3>
              <p>支持 GitHub、GitLab、Gitee 在线仓库分析，也支持本地代码上传</p>
            </el-card>
          </el-col>
          <el-col :span="8">
            <el-card shadow="hover" class="feature-card">
              <div class="feature-icon">&#128187;</div>
              <h3>多语言解析</h3>
              <p>支持 Python、Java、JavaScript、Go、C/C++、Swift、Kotlin 等主流语言</p>
            </el-card>
          </el-col>
          <el-col :span="8">
            <el-card shadow="hover" class="feature-card">
              <div class="feature-icon">&#128202;</div>
              <h3>可视化图表</h3>
              <p>自动生成 Mermaid 架构图、类图、流程图、时序图，支持导出 SVG</p>
            </el-card>
          </el-col>
        </el-row>
      </div>
      <div class="actions">
        <el-button type="primary" size="large" @click="$router.push('/analyze')">
          开始分析
        </el-button>
        <el-button size="large" @click="$router.push('/history')">
          查看历史
        </el-button>
      </div>
    </div>
  </div>
</template>

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
