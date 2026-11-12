<script setup lang="ts">
import type { NotificationPreferences } from '~/types/member'

const preferences = defineModel<NotificationPreferences>({ required: true })

const labelIdPrefix = useId()

const preferenceRows: { key: keyof NotificationPreferences, label: string }[] = [
  { key: 'orderAndPointsUpdates', label: 'แจ้งเตือนเมื่อแต้มเข้าและสถานะคำสั่งซื้อ' },
  { key: 'pointsExpiry', label: 'แจ้งเตือนแต้มใกล้หมดอายุ' },
  { key: 'promotions', label: 'รับข่าวสารและโปรโมชันจาก YoYo' },
  { key: 'petDataConsent', label: 'ยินยอมให้ใช้ข้อมูลสัตว์เลี้ยงเพื่อแนะนำสินค้า (PDPA)' }
]
</script>

<template>
  <section id="notification-settings" aria-labelledby="notification-consent-heading" class="scroll-mt-24 xl:scroll-mt-32 rounded-[1.25rem] border bg-white p-5 xl:p-10">
    <h2 id="notification-consent-heading" class="text-xl leading-tight xl:text-[1.625rem]">
      การแจ้งเตือนผ่าน LINE และความยินยอม
    </h2>

    <ul class="mt-3 divide-y xl:mt-4">
      <li v-for="row in preferenceRows" :key="row.key" class="flex items-center justify-between gap-4 py-3.5 xl:py-3">
        <span :id="`${labelIdPrefix}-${row.key}`" class="text-sm xl:text-lg">
          {{ row.label }}
        </span>
        <ToggleSwitch v-model="preferences[row.key]" :aria-labelledby="`${labelIdPrefix}-${row.key}`" />
      </li>
    </ul>
  </section>
</template>
