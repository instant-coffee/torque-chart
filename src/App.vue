<script setup lang="ts">
import { ref } from 'vue'
import AppHeader from './components/AppHeader.vue'
import AppTabs from './components/AppTabs.vue'
import CompatibilityChecker from './components/CompatibilityChecker.vue'
import HubFinder from './components/HubFinder.vue'
import ReferenceTables from './components/ReferenceTables.vue'

const TABS = [
  { id: 'checker',   label: 'Compatibility Checker' },
  { id: 'finder',    label: 'Hub Finder' },
  { id: 'reference', label: 'Reference Tables' },
]

const activeTab = ref('checker')
</script>

<template>
  <div class="app-layout">
    <AppHeader />
    <AppTabs :tabs="TABS" :active="activeTab" @change="activeTab = $event" />
    <main class="main-content">
      <div class="content-inner">
        <Transition name="tab" mode="out-in">
          <CompatibilityChecker v-if="activeTab === 'checker'" key="checker" />
          <HubFinder            v-else-if="activeTab === 'finder'"    key="finder" />
          <ReferenceTables      v-else-if="activeTab === 'reference'" key="reference" />
        </Transition>
      </div>
    </main>
  </div>
</template>

<style scoped>
.app-layout {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.main-content {
  flex: 1;
  padding: var(--space-32) var(--space-32) var(--space-64);
}

.content-inner {
  max-width: 1100px;
  margin: 0 auto;
}

/* Tab transition */
.tab-enter-active, .tab-leave-active {
  transition: opacity 120ms linear;
}
.tab-enter-from, .tab-leave-to {
  opacity: 0;
}

@media (max-width: 600px) {
  .main-content { padding: var(--space-16); }
}
</style>
