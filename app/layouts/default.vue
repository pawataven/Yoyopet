<script setup lang="ts">
const { isOnboardingRequired } = useMemberOnboarding()
const route = useRoute()

const isMobileTabBarVisible = computed(() => !route.meta.hideMobileTabBar)
const siteChromeClass = computed(() => route.meta.hideSiteChromeOnMobile ? 'max-md:hidden' : undefined)
</script>

<template>
  <div
    class="flex min-h-screen flex-col"
    :class="isMobileTabBarVisible && 'pb-[calc(4rem+env(safe-area-inset-bottom))] xl:pb-0'"
  >
    <AppNavbar :class="siteChromeClass" />
    <main class="flex-1">
      <slot />
    </main>
    <AppFooter :class="siteChromeClass" />
    <AppMobileTabBar v-if="isMobileTabBarVisible" />
    <WelcomeOnboardingDialog v-if="isOnboardingRequired" />
  </div>
</template>
