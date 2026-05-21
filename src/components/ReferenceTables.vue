<script setup lang="ts">
import { ref, computed } from 'vue'
import { hubs, HUB_BRAND_LABELS } from '../data/hubs'
import { motors, MOTOR_BRAND_LABELS } from '../data/motors'
import BrandTag from './BrandTag.vue'

const hubQuery   = ref('')
const motorQuery = ref('')

const filteredHubs = computed(() =>
  hubs.filter(h => h.name.toLowerCase().includes(hubQuery.value.toLowerCase()))
)

const filteredMotors = computed(() =>
  motors.filter(m => m.name.toLowerCase().includes(motorQuery.value.toLowerCase()))
)
</script>

<template>
  <div class="reference">
    <!-- Hub table -->
    <section class="ref-section">
      <div class="ref-header">
        <div class="ref-title-row">
          <h3>Hub max torque ratings</h3>
          <span class="count-chip">{{ filteredHubs.length }} hub{{ filteredHubs.length !== 1 ? 's' : '' }}</span>
        </div>
        <div class="search-wrap">
          <svg class="search-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
          <input
            v-model="hubQuery"
            class="search"
            type="text"
            placeholder="Search hubs..."
            aria-label="Search hubs"
          />
        </div>
      </div>
      <div class="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Hub</th>
              <th>Max torque</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="filteredHubs.length === 0">
              <td colspan="2" class="empty">No hubs found</td>
            </tr>
            <tr v-for="h in filteredHubs" :key="h.id">
              <td>
                <BrandTag :label="HUB_BRAND_LABELS[h.brand] ?? ''" />
                {{ h.name }}
              </td>
              <td class="val" :class="{ 'val-na': h.torqueDisplay === 'N/A' || h.torqueDisplay === '?', 'val-high': (h.maxTorqueNm ?? 0) >= 120 }">
                {{ h.torqueDisplay }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>

    <!-- Motor table -->
    <section class="ref-section" style="margin-top: var(--space-32)">
      <div class="ref-header">
        <div class="ref-title-row">
          <h3>Motor reference</h3>
          <span class="count-chip">{{ filteredMotors.length }} motor{{ filteredMotors.length !== 1 ? 's' : '' }}</span>
        </div>
        <div class="search-wrap">
          <svg class="search-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
          <input
            v-model="motorQuery"
            class="search"
            type="text"
            placeholder="Search motors..."
            aria-label="Search motors"
          />
        </div>
      </div>
      <div class="dual-grid">
        <div>
          <div class="dual-label eyebrow">Max torque (Nm)</div>
          <div class="table-wrap">
            <table>
              <thead><tr><th>Motor</th><th>Max torque</th></tr></thead>
              <tbody>
                <tr v-if="filteredMotors.length === 0">
                  <td colspan="2" class="empty">No results</td>
                </tr>
                <tr v-for="m in filteredMotors" :key="m.id">
                  <td>
                    <BrandTag :label="MOTOR_BRAND_LABELS[m.brand] ?? ''" />
                    {{ m.name }}
                  </td>
                  <td class="val" :class="{ 'val-na': m.torqueDisplay === '?', 'val-high': (m.maxTorqueNm ?? 0) >= 120 }">
                    {{ m.torqueDisplay }}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        <div>
          <div class="dual-label eyebrow">Max power (W)</div>
          <div class="table-wrap">
            <table>
              <thead><tr><th>Motor</th><th>Max power</th></tr></thead>
              <tbody>
                <tr v-if="filteredMotors.length === 0">
                  <td colspan="2" class="empty">No results</td>
                </tr>
                <tr v-for="m in filteredMotors" :key="m.id">
                  <td>
                    <BrandTag :label="MOTOR_BRAND_LABELS[m.brand] ?? ''" />
                    {{ m.name }}
                  </td>
                  <td class="val" :class="{ 'val-na': m.powerDisplay === '?' }">
                    {{ m.powerDisplay }}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
.reference {
  padding-bottom: var(--space-48);
}

/* Section */
.ref-section {
  border: 1px solid var(--rule);
  background: var(--white);
}

.ref-header {
  padding: var(--space-16) var(--space-24);
  border-bottom: 1px solid var(--rule);
  display: flex;
  align-items: center;
  gap: var(--space-16);
  flex-wrap: wrap;
}

.ref-title-row {
  display: flex;
  align-items: baseline;
  gap: var(--space-12);
  flex: 1;
}

.ref-title-row h3 {
  font-family: var(--font-display);
  font-size: 20px;
  color: var(--near-black);
}

.count-chip {
  font-family: var(--font-body);
  font-size: var(--type-eyebrow-sm);
  letter-spacing: var(--ls-eyebrow);
  text-transform: uppercase;
  color: var(--muted-text);
  border: 1px solid var(--rule);
  padding: 1px 8px;
}

/* Search */
.search-wrap {
  position: relative;
  width: 260px;
  flex-shrink: 0;
}

.search-icon {
  position: absolute;
  left: 10px;
  top: 50%;
  transform: translateY(-50%);
  color: var(--muted-text);
  pointer-events: none;
}

/* Table */
.table-wrap {
  overflow-x: auto;
}

.val {
  font-family: var(--font-display);
  font-size: 15px;
  color: var(--nobl-blue);
  white-space: nowrap;
}

.val.val-na    { font-family: var(--font-body); font-size: var(--type-body-sm); color: var(--muted-text); }
.val.val-high  { color: var(--nobl-gold); }

.empty {
  padding: var(--space-32);
  text-align: center;
  color: var(--muted-text);
  font-size: var(--type-body-sm);
}

/* Dual grid */
.dual-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
}

.dual-grid > div:first-child {
  border-right: 1px solid var(--rule);
}

.dual-label {
  padding: var(--space-12) var(--space-24);
  background: var(--off-white);
  border-bottom: 1px solid var(--rule);
}

@media (max-width: 700px) {
  .dual-grid { grid-template-columns: 1fr; }
  .dual-grid > div:first-child { border-right: none; border-bottom: 1px solid var(--rule); }
  .search-wrap { width: 100%; }
  .ref-header { flex-direction: column; align-items: stretch; }
}
</style>
