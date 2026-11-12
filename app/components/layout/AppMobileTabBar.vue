<script setup lang="ts">
import type { MobileTabItem } from '~/types/navigation'

const route = useRoute()

function isTabActive(tab: MobileTabItem) {
  return isNavPathActive(route.path, tab.activePrefix ?? tab.to)
}
</script>

<template>
  <!-- Own compositing layer: iOS Safari otherwise drops fixed bars from view during momentum scrolling -->
  <nav
    aria-label="เมนูหลัก"
    class="fixed inset-x-0 bottom-0 z-40 transform-gpu border-t bg-white pb-[env(safe-area-inset-bottom)] shadow-[0_-4px_16px] shadow-ink/5 backface-hidden xl:hidden"
  >
    <ul class="mx-auto grid h-16 max-w-xl grid-cols-5">
      <li v-for="tab in mobileTabItems" :key="tab.to" class="flex min-w-0">
        <NuxtLink
          :to="tab.to"
          :aria-current="isTabActive(tab) ? 'page' : undefined"
          class="group flex min-w-0 flex-1 flex-col items-center justify-end gap-0.5 pb-2 text-[0.6875rem] leading-tight focus-visible:outline-none sm:text-xs"
          :class="isTabActive(tab) && !tab.isPrimaryAction ? 'font-semibold text-primary' : tab.isPrimaryAction ? 'font-semibold text-ink' : 'text-muted'"
        >
          <span
            v-if="tab.isPrimaryAction"
            class="relative -mt-7 mb-0.5 flex size-14 items-center justify-center rounded-full bg-primary text-white ring-4 ring-white transition-colors group-hover:bg-primary-dark group-focus-visible:ring-primary-soft"
            aria-hidden="true"
          >
            <Icon :name="tab.icon" class="size-6" />
            <span class="absolute -top-0.5 -right-0.5 flex size-5 items-center justify-center rounded-full bg-gold text-ink ring-2 ring-white">
              <Icon name="lucide:plus" class="size-3.5" />
            </span>
          </span>
          <span
            v-else
            class="flex h-8 w-14 items-center justify-center rounded-full transition-colors group-focus-visible:ring-4 group-focus-visible:ring-primary-soft"
            :class="isTabActive(tab) ? 'bg-primary-soft' : 'group-hover:bg-cream'"
            aria-hidden="true"
          >
            <Icon :name="tab.icon" class="size-5.5" />
          </span>
          <span class="max-w-full truncate px-0.5">{{ tab.label }}</span>
        </NuxtLink>
      </li>
    </ul>
  </nav>
</template>
