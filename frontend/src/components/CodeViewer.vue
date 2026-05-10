<template>
  <div class="code-viewer">
    <div class="code-header">{{ filePath }}</div>
    <pre><code ref="codeRef" :class="`language-${language}`">{{ code }}</code></pre>
  </div>
</template>

<script setup>
import { ref, onMounted, watch, nextTick } from 'vue'
import hljs from 'highlight.js'
import 'highlight.js/styles/github.css'

const props = defineProps({
  code: { type: String, default: '' },
  language: { type: String, default: 'plaintext' },
  filePath: { type: String, default: '' },
})

const codeRef = ref(null)

function highlight() {
  if (codeRef.value) {
    codeRef.value.removeAttribute('data-highlighted')
    hljs.highlightElement(codeRef.value)
  }
}

onMounted(highlight)
watch(() => props.code, () => nextTick(highlight))
</script>

<style scoped>
.code-viewer {
  border: 1px solid #e4e7ed;
  border-radius: 8px;
  overflow: hidden;
  margin: 12px 0;
}

.code-header {
  background: #f5f7fa;
  padding: 8px 16px;
  font-size: 13px;
  color: #606266;
  border-bottom: 1px solid #e4e7ed;
  font-family: monospace;
}

pre {
  margin: 0;
  padding: 16px;
  overflow-x: auto;
  max-height: 500px;
  font-size: 13px;
  line-height: 1.5;
}
</style>
