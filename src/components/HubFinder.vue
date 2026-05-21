<script setup lang="ts">
import { ref, computed } from 'vue'
import { hubs, HUB_BRAND_LABELS } from '../data/hubs'
import { motors } from '../data/motors'
import { rankHubsForMotor } from '../data/compat'
import type { CompatStatus } from '../data/types'
import StatusBadge from './StatusBadge.vue'
import BrandTag from './BrandTag.vue'

const selectedMotorId = ref('')

const selectedMotor = computed(() => motors.find(m => m.id === selectedMotorId.value) ?? null)

const rankedHubs = computed(() => {
  if (!selectedMotor.value) return []
  return rankHubsForMotor(hubs, selectedMotor.value)
})

const counts = computed(() => {
  const c = { ok: 0, marginal: 0, incompatible: 0, unknown: 0 }
  rankedHubs.value.forEach(h => c[h.status]++)
  return c
})

function headroomBarWidth(pct: number | null): number {
  if (pct === null) return 0
  return Math.min(Math.round((pct / 150) * 100), 100)
}

const STATUS_ORDER: CompatStatus[] = ['ok', 'marginal', 'incompatible', 'unknown']
</script>

<template>
  <div class="finder">
    <!-- Motor select -->
    <div class="select-section">
      <label class="eyebrow field-label">Select motor</label>
      <select v-model="selectedMotorId" class="select motor-select">
        <option value="">Choose a motor...</option>
        <option v-for="m in motors" :key="m.id" :value="m.id">{{ m.name }}</option>
      </select>
    </div>

    <!-- Prompt state -->
    <div v-if="!selectedMotor" class="prompt">
      <p>Select a motor above to see all compatible hubs, ranked by headroom.</p>
    </div>

    <!-- Results -->
    <template v-else>
      <!-- Motor summary strip (dark zone) -->
      <div class="motor-strip blueprint-bg">
        <div class="strip-cell">
          <div class="strip-label eyebrow">Motor</div>
          <div class="strip-value text">{{ selectedMotor.name }}</div>
        </div>
        <div class="strip-div"></div>
        <div class="strip-cell">
          <div class="strip-label eyebrow">Max torque</div>
          <div class="strip-value">{{ selectedMotor.torqueDisplay }}</div>
        </div>
        <div class="strip-div"></div>
        <div class="strip-cell">
          <div class="strip-label eyebrow">Max power</div>
          <div class="strip-value">{{ selectedMotor.powerDisplay }}</div>
        </div>
      </div>

      <!-- Count pills -->
      <div class="counts-row">
        <div v-for="s in STATUS_ORDER" :key="s" class="count-pill" :class="`pill-${s}`">
          <span class="count-num">{{ counts[s] }}</span>
          <span class="count-label">{{ s === 'ok' ? 'Compatible' : s === 'marginal' ? 'Marginal' : s === 'incompatible' ? 'Incompatible' : 'Unknown' }}</span>
        </div>
      </div>

      <!-- Results table -->
      <div class="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Hub</th>
              <th>Hub torque rating</th>
              <th>Status</th>
              <th>Headroom</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="hub in rankedHubs" :key="hub.id" :class="`row-${hub.status}`">
              <td>
                <BrandTag :label="HUB_BRAND_LABELS[hub.brand] ?? ''" />
                {{ hub.name }}
              </td>
              <td class="val">{{ hub.torqueDisplay }}</td>
              <td><StatusBadge :status="hub.status" size="sm" /></td>
              <td>
                <template v-if="hub.status === 'ok'">
                  <div class="headroom-row">
                    <span class="headroom-num ok">+{{ hub.headroomNm }} Nm</span>
                    <div class="headroom-bar">
                      <div class="headroom-fill fill-ok" :style="{ width: headroomBarWidth(hub.headroomPct) + '%' }"></div>
                    </div>
                  </div>
                </template>
                <template v-else-if="hub.status === 'marginal'">
                  <span class="headroom-num warn">{{ hub.headroomNm }} Nm</span>
                </template>
                <template v-else-if="hub.status === 'incompatible'">
                  <span class="headroom-num bad">{{ hub.headroomNm }} Nm</span>
                </template>
                <template v-else>
                  <span class="headroom-unk">—</span>
                </template>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </template>
  </div>
</template>

<style scoped>
.finder {
  display: flex;
  flex-direction: column;
  gap: 0;
}

/* Select section */
.select-section {
  background: var(--white);
  border: 1px solid var(--rule);
  border-bottom: none;
  padding: var(--space-24);
}

.field-label { margin-bottom: var(--space-8); }
.motor-select { max-width: 480px; }

/* Prompt */
.prompt {
  background: var(--white);
  border: 1px solid var(--rule);
  padding: var(--space-48) var(--space-24);
  text-align: center;
  color: var(--muted-text);
  font-size: var(--type-body-sm);
}

/* Motor strip (dark zone) */
.motor-strip {
  border-top: 3px solid var(--nobl-blue);
  display: flex;
  flex-wrap: wrap;
  gap: 0;
}

.strip-cell {
  padding: var(--space-16) var(--space-24);
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
}

.strip-label { color: var(--muted-text) !important; }

.strip-value {
  font-family: var(--font-display);
  font-size: 22px;
  color: var(--white);
  line-height: 1;
}

.strip-value.text {
  font-family: var(--font-body);
  font-size: var(--type-body);
  font-weight: 400;
  color: var(--white);
  line-height: var(--lh-body);
  max-width: 320px;
}

.strip-div {
  width: 1px;
  background: var(--dark-rule);
  margin: var(--space-12) 0;
}

/* Counts row */
.counts-row {
  display: flex;
  gap: 0;
  border: 1px solid var(--rule);
  border-top: none;
}

.count-pill {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: var(--space-16);
  gap: var(--space-4);
  border-right: 1px solid var(--rule);
  background: var(--white);
}
.count-pill:last-child { border-right: none; }

.count-num {
  font-family: var(--font-display);
  font-size: 32px;
  line-height: 1;
}

.count-label {
  font-size: var(--type-eyebrow-sm);
  letter-spacing: var(--ls-eyebrow);
  text-transform: uppercase;
  color: var(--muted-text);
}

.pill-ok          .count-num { color: var(--status-ok); }
.pill-marginal    .count-num { color: var(--status-warn); }
.pill-incompatible .count-num { color: var(--status-bad); }
.pill-unknown     .count-num { color: var(--muted-text); }

/* Table */
.table-wrap {
  border: 1px solid var(--rule);
  border-top: none;
  overflow-x: auto;
}

.val {
  font-family: var(--font-display);
  font-size: 16px;
  color: var(--nobl-blue);
}

/* Headroom */
.headroom-row {
  display: flex;
  align-items: center;
  gap: var(--space-8);
}

.headroom-num {
  font-family: var(--font-display);
  font-size: 14px;
  white-space: nowrap;
}

.headroom-num.ok   { color: var(--status-ok); }
.headroom-num.warn { color: var(--status-warn); }
.headroom-num.bad  { color: var(--status-bad); }
.headroom-unk      { color: var(--muted-text); }

.headroom-bar {
  flex: 0 0 60px;
  height: 3px;
  background: var(--rule);
  overflow: hidden;
}

.headroom-fill {
  height: 100%;
  transition: width 200ms ease;
}

.fill-ok { background: var(--nobl-blue); }

/* Row tints */
.row-incompatible td { color: var(--muted-text); }

@media (max-width: 640px) {
  .motor-strip { flex-direction: column; gap: 0; }
  .strip-div { display: none; }
  .counts-row { flex-wrap: wrap; }
  .count-pill { flex: 0 0 50%; border-bottom: 1px solid var(--rule); }
}
</style>
