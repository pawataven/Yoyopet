<script setup lang="ts">
const settingLinks = [
  { label: 'ความยินยอมและความเป็นส่วนตัว', icon: 'lucide:shield-check', to: '/settings/privacy' },
  { label: 'ตั้งค่าการแจ้งเตือน LINE และเว็บ', icon: 'lucide:bell', to: '/settings/notifications' }
]
</script>

<template>
  <section id="privacy-consents" aria-labelledby="privacy-consents-heading" class="scroll-mt-24 rounded-[1.25rem] border bg-white p-5 xl:scroll-mt-32 xl:p-10">
    <h2 id="privacy-consents-heading" class="text-xl leading-tight xl:text-[1.625rem]">
      ความยินยอมและการแจ้งเตือน
    </h2>

    <ul class="mt-3 space-y-2 xl:mt-4">
      <li v-for="link in settingLinks" :key="link.to">
        <NuxtLink
          :to="link.to"
          class="flex items-center justify-between gap-3 rounded-2xl bg-cream px-4 py-3.5 text-sm font-semibold transition-colors hover:bg-primary-soft/60 xl:text-base"
        >
          <span class="flex items-center gap-3">
            <Icon :name="link.icon" class="size-5 shrink-0" aria-hidden="true" />
            {{ link.label }}
          </span>
          <Icon name="lucide:chevron-right" class="size-5 shrink-0 text-muted" aria-hidden="true" />
        </NuxtLink>
      </li>
    </ul>
  </section>
</template>
