<script setup lang="ts">
const navItems = mainNavItems

const { member, isLoggedIn, isLoading } = useMember()
const route = useRoute()
const isMobileMenuOpen = ref(false)

const formattedPoints = computed(() => (member.value?.points ?? 0).toLocaleString('th-TH'))

function isActive(to: string) {
  return to === '/' ? route.path === '/' : route.path.startsWith(to)
}

const isOrderEntryActive = computed(() => isActive('/orders/'))

watch(() => route.path, () => {
  isMobileMenuOpen.value = false
})
</script>

<template>
  <header class="app-navbar sticky top-0 z-50 bg-primary text-white">
    <div class="page-container flex h-(--nav-height) items-center">
      <AppLogo />

      <nav aria-label="เมนูหลัก" class="ml-(--nav-logo-gap) hidden items-center gap-(--nav-item-gap) xl:flex">
        <NuxtLink
          v-for="item in navItems"
          :key="item.to"
          :to="item.to"
          :aria-current="isActive(item.to) ? 'page' : undefined"
          class="nav-link relative text-(length:--nav-font-size) font-medium whitespace-nowrap transition-opacity hover:opacity-80"
          :class="{ 'is-active': isActive(item.to) }"
        >
          {{ item.label }}
        </NuxtLink>
      </nav>

      <div class="ml-auto flex items-center gap-(--nav-control-gap)">
        <NuxtLink
          v-if="isLoggedIn"
          to="/orders/submit"
          :aria-current="isOrderEntryActive ? 'page' : undefined"
          class="hidden h-(--nav-control-height) items-center gap-2.5 rounded-full px-(--nav-button-px) text-(length:--nav-control-font-size) font-medium whitespace-nowrap transition-colors md:flex"
          :class="isOrderEntryActive ? 'bg-cocoa text-white' : 'bg-white text-ink hover:bg-primary-soft'"
        >
          <OrderEntryIcon class="size-(--nav-icon-size) shrink-0" :class="isOrderEntryActive ? 'text-white' : 'text-primary-dark'" />
          กรอกเลขออเดอร์
        </NuxtLink>

        <template v-if="member">
          <NuxtLink
            to="/points/history"
            class="flex h-(--nav-control-height) items-center gap-2 rounded-full bg-white/15 px-(--nav-pill-px) text-(length:--nav-control-font-size) font-medium whitespace-nowrap transition-colors hover:bg-white/25"
          >
            <Icon name="lucide:star" class="size-(--nav-icon-size) text-gold" />
            <span>
              <span class="font-number font-semibold">{{ formattedPoints }}</span><span class="hidden sm:inline"> แต้ม</span>
            </span>
          </NuxtLink>

          <div class="flex items-center gap-(--nav-avatar-gap)">
            <NotificationBell />

            <ProfileMenu :member="member" />
          </div>
        </template>

        <div
          v-else-if="isLoggedIn && isLoading"
          aria-hidden="true"
          class="flex items-center gap-(--nav-control-gap)"
        >
          <span class="h-(--nav-control-height) w-[clamp(80px,8.4375vw,162px)] animate-pulse rounded-full bg-white/15" />
          <span class="size-(--nav-avatar-size) animate-pulse rounded-full bg-white/15" />
        </div>

        <NuxtLink
          v-else-if="!isLoggedIn"
          to="/login"
          class="flex h-(--nav-control-height) items-center rounded-full bg-white px-(--nav-button-px) text-(length:--nav-control-font-size) font-medium whitespace-nowrap text-primary-dark transition-colors hover:bg-primary-soft"
        >
          <span class="sm:hidden">เข้าสู่ระบบ</span>
          <span class="hidden sm:inline">เข้าสู่ระบบ / สมัครสมาชิก</span>
        </NuxtLink>

        <button
          type="button"
          class="flex size-(--nav-bell-size) shrink-0 items-center justify-center rounded-full transition-colors hover:bg-white/15 xl:hidden"
          :aria-expanded="isMobileMenuOpen"
          aria-controls="mobile-menu"
          :aria-label="isMobileMenuOpen ? 'ปิดเมนู' : 'เปิดเมนู'"
          @click="isMobileMenuOpen = !isMobileMenuOpen"
        >
          <Icon :name="isMobileMenuOpen ? 'lucide:x' : 'lucide:menu'" class="size-5" />
        </button>
      </div>
    </div>

    <Transition
      enter-active-class="transition duration-150 ease-out"
      enter-from-class="-translate-y-2 opacity-0"
      leave-active-class="transition duration-100 ease-in"
      leave-to-class="-translate-y-2 opacity-0"
    >
      <nav
        v-if="isMobileMenuOpen"
        id="mobile-menu"
        aria-label="เมนูหลัก (มือถือ)"
        class="page-container border-t border-white/15 bg-primary pb-4 xl:hidden"
      >
        <ul class="flex flex-col py-2">
          <li v-for="item in navItems" :key="item.to">
            <NuxtLink
              :to="item.to"
              :aria-current="isActive(item.to) ? 'page' : undefined"
              class="block rounded-lg px-3 py-3 text-base font-medium transition-colors hover:bg-white/15"
              :class="{ 'bg-white/15': isActive(item.to) }"
            >
              {{ item.label }}
            </NuxtLink>
          </li>
        </ul>
        <NuxtLink
          v-if="isLoggedIn"
          to="/orders/submit"
          :aria-current="isOrderEntryActive ? 'page' : undefined"
          class="flex h-11 items-center justify-center gap-2 rounded-full text-sm font-medium md:hidden"
          :class="isOrderEntryActive ? 'bg-cocoa text-white' : 'bg-white text-ink'"
        >
          <OrderEntryIcon class="size-4 shrink-0" :class="isOrderEntryActive ? 'text-white' : 'text-primary-dark'" />
          กรอกเลขออเดอร์
        </NuxtLink>
      </nav>
    </Transition>
  </header>
</template>

<style scoped>
/*
 * Sizes are taken from the 1920px design and scale with the viewport (value / 19.2 = vw),
 * clamped so small screens stay usable and large screens never exceed the design.
 */
.app-navbar {
  --nav-height: clamp(64px, 6.667vw, 128px);
  --nav-logo-size: clamp(48px, 4.583vw, 88px);
  --nav-logo-gap: clamp(32px, 5.833vw, 112px);
  --nav-item-gap: clamp(24px, 3.333vw, 64px);
  --nav-font-size: clamp(15px, 1.042vw, 20px);
  --nav-control-height: clamp(36px, 2.604vw, 50px);
  --nav-control-font-size: clamp(13px, 0.833vw, 16px);
  --nav-control-gap: clamp(8px, 1.458vw, 28px);
  --nav-button-px: clamp(14px, 1.667vw, 32px);
  --nav-pill-px: clamp(12px, 1.25vw, 24px);
  --nav-icon-size: clamp(16px, 1.042vw, 20px);
  --nav-bell-size: clamp(36px, 2.396vw, 46px);
  --nav-avatar-size: clamp(40px, 3.229vw, 62px);
  --nav-avatar-gap: clamp(8px, 0.833vw, 16px);
}

.nav-link.is-active::after {
  content: '';
  position: absolute;
  inset-inline: 0;
  top: calc(100% + clamp(6px, 0.625vw, 12px));
  height: clamp(3px, 0.208vw, 4px);
  border-radius: 9999px;
  background-color: currentColor;
}
</style>
