<script setup lang="ts">
import type { PetBirthdayCoupon } from '~/types/pet'

defineProps<{
  birthdayCoupon: PetBirthdayCoupon
  isClaiming: boolean
}>()

const emit = defineEmits<{
  claim: []
}>()
</script>

<template>
  <section aria-labelledby="pet-birthday-heading" class="flex flex-col rounded-[1.25rem] border-2 border-dashed border-primary/30 bg-white p-6 xl:px-8 xl:pt-8 xl:pb-7">
    <div class="flex items-start justify-between gap-4 xl:min-h-24">
      <span class="flex size-12 items-center justify-center rounded-full bg-primary-soft text-primary-dark xl:size-16">
        <Icon name="lucide:cake" class="size-6 xl:size-7" />
      </span>
      <NuxtImg
        v-if="birthdayCoupon.petPhotoUrl"
        :src="birthdayCoupon.petPhotoUrl"
        :alt="birthdayCoupon.petName"
        width="96"
        height="96"
        loading="lazy"
        class="size-18 rounded-full object-cover xl:size-24"
      />
    </div>

    <h2 id="pet-birthday-heading" class="mt-4 text-lg leading-tight xl:mt-2.5 xl:text-2xl">
      เดือนนี้วันเกิดน้อง{{ birthdayCoupon.petName }}
    </h2>
    <p class="mt-1 text-xs text-muted xl:text-[1.0625rem]">
      รับคูปองส่วนลด {{ birthdayCoupon.discountPercent }}% ใช้ได้ถึง {{ formatThaiShortDate(birthdayCoupon.expiresAt) }}
    </p>

    <div class="mt-auto pt-5 xl:pt-4">
      <p class="flex h-11 items-center justify-center rounded-2xl border-2 border-dashed border-primary/30 bg-cream font-number text-base font-semibold tracking-wide text-primary-dark xl:h-13 xl:text-[1.1875rem]">
        {{ birthdayCoupon.couponCode }}
      </p>
      <NuxtLink
        v-if="birthdayCoupon.isClaimed"
        to="/coupons"
        class="mt-3 flex h-11 items-center justify-center gap-2 rounded-2xl bg-primary-soft text-sm font-medium text-primary-dark transition-colors hover:bg-primary hover:text-white xl:mt-4 xl:h-13 xl:text-xl"
      >
        <Icon name="lucide:check" class="size-5" />
        รับแล้ว · ดูในคูปองของฉัน
      </NuxtLink>
      <button
        v-else
        type="button"
        :disabled="isClaiming"
        class="mt-3 flex h-11 w-full items-center justify-center rounded-2xl bg-primary text-sm font-medium text-white transition-colors hover:bg-primary-dark disabled:opacity-70 xl:mt-4 xl:h-13 xl:text-xl"
        @click="emit('claim')"
      >
        {{ isClaiming ? 'กำลังรับคูปอง…' : 'รับคูปองวันเกิด' }}
      </button>
    </div>
  </section>
</template>
