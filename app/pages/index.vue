<template>
  <UContainer class="page-container">
    <h1 class="title">Nuxt Chat</h1>
    <UButton to="/chat">Start Chat</UButton>
  </UContainer>
</template>

<style lang="css" scoped>
.page-container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 1rem;
  height: 100vh;
}

.title {
  font-size: 2.25rem;
  font-weight: bold;
}
</style>
