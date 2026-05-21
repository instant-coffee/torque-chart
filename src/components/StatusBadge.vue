<script setup lang="ts">
import type { CompatStatus } from '../data/types'

defineProps<{ status: CompatStatus; size?: 'sm' | 'md' }>()

const LABELS: Record<CompatStatus, string> = {
  ok: 'Compatible',
  marginal: 'Marginal',
  incompatible: 'Incompatible',
  unknown: 'Unknown',
}
</script>

<template>
  <span class="status-badge" :class="[`status-${status}`, size === 'sm' ? 'sm' : '']">
    {{ LABELS[status] }}
  </span>
</template>

<style scoped>
.status-badge {
  display: inline-flex;
  align-items: center;
  padding: 3px 10px;
  font-family: var(--font-body);
  font-size: var(--type-eyebrow-sm);
  letter-spacing: var(--ls-eyebrow);
  text-transform: uppercase;
  border: 1px solid currentColor;
  white-space: nowrap;
}

.status-badge.sm { padding: 2px 8px; font-size: 9px; }

.status-ok          { color: var(--status-ok);   background: var(--status-ok-bg); }
.status-marginal    { color: var(--status-warn);  background: var(--status-warn-bg); }
.status-incompatible { color: var(--status-bad);  background: var(--status-bad-bg); }
.status-unknown     { color: var(--muted-text);   background: var(--off-white); border-color: var(--rule); }
</style>
