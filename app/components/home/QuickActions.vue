<script setup lang="ts">
interface QuickAction {
  label: string
  icon: string
  to: string
}

const quickActions: QuickAction[] = [
  { label: 'แลกของรางวัล', icon: 'lucide:gift', to: '/rewards' },
  { label: 'ประวัติแต้ม', icon: 'lucide:history', to: '/points/history' },
  { label: 'คูปองของฉัน', icon: 'lucide:ticket', to: '/coupons' },
  { label: 'สัตว์เลี้ยง', icon: 'lucide:paw-print', to: '/pets' },
  { label: 'ชวนเพื่อน', icon: 'lucide:users', to: '/referral' },
  { label: 'สิทธิ์ระดับ', icon: 'lucide:award', to: '/tiers' }
]
</script>

<template>
  <nav aria-label="เมนูลัด" class="rounded-[1.75rem] border bg-white px-2 py-5 xl:flex-1 xl:content-center xl:py-4">
    <ul class="grid grid-cols-3 gap-y-5 sm:grid-cols-6">
      <li v-for="action in quickActions" :key="action.to">
        <NuxtLink :to="action.to" class="group flex flex-col items-center gap-2.5 xl:gap-3">
          <span class="flex size-12 items-center justify-center rounded-2xl bg-primary-soft text-primary transition-colors group-hover:bg-primary group-hover:text-white xl:size-13.5">
            <Icon :name="action.icon" class="size-6" />
          </span>
          <span class="text-center text-xs text-ink xl:text-base xl:leading-snug">{{ action.label }}</span>
        </NuxtLink>
      </li>
    </ul>
  </nav>
</template>
