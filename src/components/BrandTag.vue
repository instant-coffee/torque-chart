<script setup lang="ts">
defineProps<{ label: string }>()
</script>

<template>
  <span v-if="label" class="brand-tag">{{ label }}</span>
</template>

<style scoped>
.brand-tag {
  display: inline-flex;
  align-items: center;
  padding: 1px 6px;
  margin-right: 6px;
  font-family: var(--font-body);
  font-size: 9px;
  letter-spacing: var(--ls-eyebrow);
  text-transform: uppercase;
  color: var(--muted-text);
  border: 1px solid var(--rule);
  white-space: nowrap;
  vertical-align: middle;
}
</style>
