<script setup lang="ts">
import type { PointsSummary } from '~/types/points'

const props = defineProps<{
  summary: PointsSummary
}>()

const summaryItems = computed(() => [
  { label: 'ได้รับทั้งหมด', value: `+${formatNumber(props.summary.earned)}`, valueClass: 'text-success' },
  { label: 'ใช้ไป', value: `−${formatNumber(props.summary.spent)}`, valueClass: 'text-primary-dark' },
  { label: 'หมดอายุ', value: `−${formatNumber(props.summary.expired)}`, valueClass: 'text-muted' },
  { label: 'คงเหลือ', value: formatNumber(props.summary.balance), valueClass: 'text-ink' }
])
</script>

<template>
  <section aria-label="สรุปแต้ม" class="mt-6 xl:mt-10">
    <dl class="grid grid-cols-2 gap-3 xl:grid-cols-4 xl:gap-6">
      <div
        v-for="item in summaryItems"
        :key="item.label"
        class="rounded-[1.25rem] border bg-white px-5 py-4 xl:px-7 xl:py-6"
      >
        <dt class="text-sm text-muted xl:text-[0.9375rem]">
          {{ item.label }}
        </dt>
        <dd class="mt-1 font-number text-2xl leading-tight font-semibold xl:mt-1.5 xl:text-[1.875rem]" :class="item.valueClass">
          {{ item.value }}
        </dd>
      </div>
    </dl>
  </section>
</template>
