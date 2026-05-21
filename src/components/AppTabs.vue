<script setup lang="ts">
defineProps<{
  tabs: { id: string; label: string }[]
  active: string
}>()

const emit = defineEmits<{ (e: 'change', id: string): void }>()
</script>

<template>
  <nav class="tab-nav">
    <div class="tab-nav-inner">
      <button
        v-for="tab in tabs"
        :key="tab.id"
        class="tab-btn"
        :class="{ active: active === tab.id }"
        @click="emit('change', tab.id)"
      >
        {{ tab.label }}
      </button>
    </div>
  </nav>
</template>

<style scoped>
.tab-nav {
  background: var(--white);
  border-bottom: 1px solid var(--rule);
}

.tab-nav-inner {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 var(--space-32);
  display: flex;
  gap: 0;
}

.tab-btn {
  font-family: var(--font-display);
  font-size: var(--type-button);
  letter-spacing: var(--ls-button);
  color: var(--muted-text);
  background: transparent;
  border: none;
  border-bottom: 2px solid transparent;
  padding: 14px 20px;
  cursor: pointer;
  transition: color 120ms linear, border-color 120ms linear;
  margin-bottom: -1px;
  white-space: nowrap;
}

.tab-btn:hover { color: var(--body-text); }
.tab-btn.active {
  color: var(--nobl-blue);
  border-bottom-color: var(--nobl-blue);
}

@media (max-width: 600px) {
  .tab-nav-inner { padding: 0 var(--space-16); }
  .tab-btn { padding: 12px 14px; font-size: 13px; }
}
</style>
