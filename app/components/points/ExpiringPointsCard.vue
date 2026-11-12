<script setup lang="ts">
import type { PointExpiryBatch } from '~/types/points'

defineProps<{
  expiryBatches: PointExpiryBatch[]
}>()
</script>

<template>
  <section aria-labelledby="expiring-points-heading" class="rounded-[1.25rem] border bg-white p-5 xl:p-7">
    <h2 id="expiring-points-heading" class="text-lg leading-tight xl:text-2xl">
      แต้มที่จะหมดอายุ
    </h2>

    <ul v-if="expiryBatches.length" class="mt-2 xl:mt-3">
      <li
        v-for="(batch, index) in expiryBatches"
        :key="batch.expiresAt"
        class="flex min-h-14 items-center gap-3 border-b last:border-b-0 xl:min-h-18"
      >
        <Icon name="lucide:clock" class="size-4 shrink-0 xl:size-5" :class="index === 0 ? 'text-pending' : 'text-muted'" />
        <p class="flex-1 text-sm xl:text-lg" :class="index === 0 && 'font-semibold'">
          {{ formatThaiShortDate(batch.expiresAt) }}
        </p>
        <p class="shrink-0 text-sm font-semibold xl:text-lg" :class="index === 0 && 'text-pending'">
          <span class="font-number">{{ formatNumber(batch.amount) }}</span> แต้ม
        </p>
      </li>
    </ul>
    <p v-else class="py-8 text-center text-sm text-muted">
      ไม่มีแต้มที่จะหมดอายุ
    </p>

    <NuxtLink
      to="/rewards"
      class="mt-3 flex h-12 w-full items-center justify-center rounded-xl bg-primary text-base font-semibold text-white transition-colors hover:bg-primary-dark xl:mt-2 xl:h-13 xl:text-lg"
    >
      ใช้แต้มแลกของรางวัล
    </NuxtLink>
  </section>
</template>
