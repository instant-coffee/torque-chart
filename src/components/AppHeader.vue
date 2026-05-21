<template>
  <header class="app-header">
    <div class="header-inner">
      <div class="logo-group">
        <img src="/logo-nobl-white.svg" alt="NOBL Wheels" class="logo" />
        <div class="logo-divider"></div>
        <span class="logo-sub">eBike Torque Reference</span>
      </div>
      <div class="header-meta">
        <span class="eyebrow" style="color: var(--muted-text)">Hub &amp; Motor Compatibility</span>
      </div>
    </div>
  </header>
</template>

<style scoped>
.app-header {
  background: var(--near-black);
  border-bottom: 3px solid var(--nobl-blue);
  position: sticky;
  top: 0;
  z-index: 200;
}

.header-inner {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 var(--space-32);
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.logo-group {
  display: flex;
  align-items: center;
  gap: var(--space-16);
}

.logo {
  height: 22px;
  width: auto;
  display: block;
}

.logo-divider {
  width: 1px;
  height: 20px;
  background: var(--dark-rule);
}

.logo-sub {
  font-family: var(--font-body);
  font-size: var(--type-eyebrow);
  letter-spacing: var(--ls-eyebrow);
  text-transform: uppercase;
  color: var(--muted-text);
}

.header-meta {
  display: flex;
  align-items: center;
}

@media (max-width: 600px) {
  .header-inner { padding: 0 var(--space-16); }
  .header-meta { display: none; }
}
</style>
