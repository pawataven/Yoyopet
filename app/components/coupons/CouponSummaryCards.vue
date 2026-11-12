<script setup lang="ts">
const props = defineProps<{
  activeCount: number
  expiringSoonCount: number
  totalSavedBaht: number
}>()

const summaryItems = computed(() => [
  { label: 'คูปองที่ใช้ได้', value: props.activeCount, unit: 'ใบ', icon: 'lucide:ticket', tileClass: 'bg-primary-soft text-primary' },
  { label: `ใกล้หมดอายุ (${COUPON_EXPIRING_SOON_DAYS} วัน)`, value: props.expiringSoonCount, unit: 'ใบ', icon: 'lucide:clock', tileClass: 'bg-gold/25 text-pending' },
  { label: 'ประหยัดไปแล้วทั้งหมด', value: props.totalSavedBaht, unit: 'บาท', icon: 'lucide:gift', tileClass: 'bg-success/10 text-success' }
])
</script>

<template>
  <section aria-label="สรุปคูปอง" class="mt-6 xl:mt-10">
    <dl class="grid grid-cols-1 gap-3 sm:grid-cols-3 xl:gap-6">
      <div
        v-for="item in summaryItems"
        :key="item.label"
        class="flex items-center gap-4 rounded-[1.25rem] border bg-white px-5 py-4 xl:gap-6 xl:px-7 xl:py-7"
      >
        <span class="flex size-11 shrink-0 items-center justify-center rounded-full xl:size-16" :class="item.tileClass" aria-hidden="true">
          <Icon :name="item.icon" class="size-5 xl:size-7" />
        </span>
        <div class="min-w-0">
          <dt class="text-sm text-muted xl:text-base">
            {{ item.label }}
          </dt>
          <dd class="mt-0.5 flex items-baseline gap-1.5 xl:gap-2.5">
            <span class="font-number text-2xl leading-tight font-semibold xl:text-[2.25rem]">{{ formatNumber(item.value) }}</span>
            <span class="text-sm text-muted xl:text-base">{{ item.unit }}</span>
          </dd>
        </div>
      </div>
    </dl>
  </section>
</template>
