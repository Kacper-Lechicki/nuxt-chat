<template>
  <div class="layout-container">
    <main class="main-content">
      <slot />
    </main>
  </div>
</template>

<style lang="css" scoped>
.layout-container {
  height: calc(100vh - 4rem);
  background: var(--ui-bg);
}

.main-content {
  margin-top: 4rem;
  height: 100%;
}
</style>
