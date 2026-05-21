<script setup lang="ts">
import { ref, computed } from 'vue'
import { hubs } from '../data/hubs'
import { motors } from '../data/motors'
import { getCompatStatus, STATUS_LABELS, STATUS_DESCRIPTIONS } from '../data/compat'
import StatusBadge from './StatusBadge.vue'

const selectedHubId   = ref('')
const selectedMotorId = ref('')

const selectedHub   = computed(() => hubs.find(h => h.id === selectedHubId.value) ?? null)
const selectedMotor = computed(() => motors.find(m => m.id === selectedMotorId.value) ?? null)

const compatStatus = computed(() => {
  if (!selectedHub.value || !selectedMotor.value) return null
  return getCompatStatus(selectedHub.value, selectedMotor.value)
})

const compatDescription = computed(() => {
  if (!selectedHub.value || !selectedMotor.value || !compatStatus.value) return ''
  return STATUS_DESCRIPTIONS(selectedHub.value, selectedMotor.value, compatStatus.value)
})
</script>

<template>
  <div class="checker">
    <!-- Select fields -->
    <div class="section-card">
      <div class="card-header">
        <h3>Select hub &amp; motor</h3>
        <p class="sub">Compatibility is determined by comparing hub max torque rating against motor max torque output.</p>
      </div>
      <div class="card-body">
        <div class="select-grid">
          <div class="field">
            <label class="eyebrow field-label">Hub</label>
            <select v-model="selectedHubId" class="select">
              <option value="">Choose a hub...</option>
              <option v-for="h in hubs" :key="h.id" :value="h.id">{{ h.name }}</option>
            </select>
          </div>
          <div class="field">
            <label class="eyebrow field-label">Motor</label>
            <select v-model="selectedMotorId" class="select">
              <option value="">Choose a motor...</option>
              <option v-for="m in motors" :key="m.id" :value="m.id">{{ m.name }}</option>
            </select>
          </div>
        </div>
      </div>
    </div>

    <!-- Stat bar (dark zone) -->
    <div class="stat-bar blueprint-bg">
      <div class="stat-cell">
        <div class="stat-label eyebrow">Hub max torque</div>
        <div class="stat-value" :class="{ 'stat-empty': !selectedHub }">
          {{ selectedHub?.torqueDisplay ?? '—' }}
        </div>
      </div>
      <div class="stat-div"></div>
      <div class="stat-cell">
        <div class="stat-label eyebrow">Motor max torque</div>
        <div class="stat-value" :class="{ 'stat-empty': !selectedMotor }">
          {{ selectedMotor?.torqueDisplay ?? '—' }}
        </div>
      </div>
      <div class="stat-div"></div>
      <div class="stat-cell">
        <div class="stat-label eyebrow">Motor max power</div>
        <div class="stat-value" :class="{ 'stat-empty': !selectedMotor }">
          {{ selectedMotor?.powerDisplay ?? '—' }}
        </div>
      </div>
    </div>

    <!-- Compatibility result -->
    <Transition name="fade">
      <div
        v-if="compatStatus"
        class="compat-result"
        :class="`compat-${compatStatus}`"
      >
        <div class="compat-top">
          <StatusBadge :status="compatStatus" />
          <span class="compat-heading">{{ STATUS_LABELS[compatStatus] }}</span>
        </div>
        <p class="compat-desc">{{ compatDescription }}</p>
      </div>
    </Transition>
  </div>
</template>

<style scoped>
.checker {
  display: flex;
  flex-direction: column;
  gap: 0;
}

/* Section card */
.section-card {
  background: var(--white);
  border: 1px solid var(--rule);
  border-bottom: none;
}

.card-header {
  padding: var(--space-16) var(--space-24);
  border-bottom: 1px solid var(--rule);
  display: flex;
  align-items: baseline;
  gap: var(--space-16);
  flex-wrap: wrap;
}

.card-header h3 {
  font-family: var(--font-display);
  font-size: 22px;
  color: var(--near-black);
}

.sub {
  font-size: var(--type-body-sm);
  color: var(--muted-text);
  margin: 0;
}

.card-body {
  padding: var(--space-24);
}

.select-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--space-24);
}

.field-label {
  margin-bottom: var(--space-8);
}

/* Stat bar */
.stat-bar {
  border-top: 3px solid var(--nobl-blue);
  display: grid;
  grid-template-columns: 1fr auto 1fr auto 1fr;
  align-items: stretch;
}

.stat-cell {
  padding: var(--space-24) var(--space-24);
  display: flex;
  flex-direction: column;
  gap: var(--space-8);
}

.stat-label {
  color: var(--muted-text) !important;
}

.stat-value {
  font-family: var(--font-display);
  font-size: var(--type-stat);
  color: var(--white);
  line-height: 1;
}

.stat-value.stat-empty {
  color: var(--dark-rule);
}

.stat-div {
  width: 1px;
  background: var(--dark-rule);
  margin: var(--space-16) 0;
}

/* Compat result */
.compat-result {
  border: 1px solid var(--rule);
  border-top: none;
  padding: var(--space-20, 20px) var(--space-24);
  border-left-width: 3px;
}

.compat-top {
  display: flex;
  align-items: center;
  gap: var(--space-12);
  margin-bottom: var(--space-8);
}

.compat-heading {
  font-family: var(--font-display);
  font-size: 20px;
  color: inherit;
}

.compat-desc {
  font-size: var(--type-body-sm);
  margin: 0;
  color: inherit;
  opacity: 0.8;
}

.compat-ok          { background: var(--status-ok-bg);   border-color: var(--status-ok-border);   border-left-color: var(--status-ok);   color: var(--status-ok); }
.compat-marginal    { background: var(--status-warn-bg);  border-color: var(--status-warn-border);  border-left-color: var(--status-warn);  color: var(--status-warn); }
.compat-incompatible { background: var(--status-bad-bg); border-color: var(--status-bad-border);  border-left-color: var(--status-bad);   color: var(--status-bad); }
.compat-unknown     { background: var(--off-white);       border-color: var(--rule);               border-left-color: var(--muted-text);   color: var(--muted-text); }

/* Transition */
.fade-enter-active, .fade-leave-active { transition: opacity 120ms linear; }
.fade-enter-from, .fade-leave-to { opacity: 0; }

@media (max-width: 640px) {
  .select-grid { grid-template-columns: 1fr; }
  .stat-bar { grid-template-columns: 1fr; }
  .stat-div { display: none; }
  .stat-cell { padding: var(--space-16); }
  .stat-value { font-size: 28px; }
  .card-header { flex-direction: column; gap: var(--space-8); }
}
</style>
