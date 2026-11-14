<script setup lang="ts">
const quickActions = [
  { label: 'ประวัติแต้ม', icon: 'lucide:history', to: '/points/history' },
  { label: 'สัตว์เลี้ยง', icon: 'lucide:paw-print', to: '/pets' },
  { label: 'ชวนเพื่อน', icon: 'lucide:users', to: '/referral' },
  { label: 'ระดับสมาชิก', icon: 'lucide:crown', to: '/tiers' }
]
</script>

<template>
  <nav aria-label="เมนูลัด">
    <ul class="grid grid-cols-4 gap-2">
      <li v-for="action in quickActions" :key="action.to">
        <NuxtLink :to="action.to" class="group flex flex-col items-center gap-2">
          <span class="flex size-14 items-center justify-center rounded-[1.125rem] border bg-cream text-primary transition-colors group-hover:bg-primary-soft">
            <Icon :name="action.icon" class="size-6" />
          </span>
          <span class="text-center text-sm">{{ action.label }}</span>
        </NuxtLink>
      </li>
    </ul>
  </nav>
</template>
