<script setup lang="ts">
const { isOnboardingRequired } = useMemberOnboarding()
</script>

<template>
  <div class="flex min-h-screen flex-col">
    <AppNavbar />
    <main class="flex-1">
      <slot />
    </main>
    <AppFooter />
    <WelcomeOnboardingDialog v-if="isOnboardingRequired" />
  </div>
</template>
