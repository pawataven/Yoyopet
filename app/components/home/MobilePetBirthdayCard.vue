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
  <section aria-labelledby="pet-birthday-mobile-heading" class="flex flex-col rounded-[1.25rem] border-2 border-dashed border-primary/25 bg-cream p-3.5">
    <div class="flex items-start justify-between gap-2">
      <PetPhoto
        v-if="birthdayCoupon.petPhotoUrl"
        :src="birthdayCoupon.petPhotoUrl"
        :alt="birthdayCoupon.petName"
        width="88"
        height="88"
        loading="lazy"
        class="size-11 rounded-full object-cover"
      />
      <span class="ml-auto flex size-8 items-center justify-center rounded-full bg-primary-soft text-primary">
        <Icon name="lucide:cake" class="size-4.5" />
      </span>
    </div>

    <h2 id="pet-birthday-mobile-heading" class="mt-3.5 font-sans text-sm leading-snug font-semibold">
      เดือนนี้วันเกิดน้อง{{ birthdayCoupon.petName }}
    </h2>
    <p class="mt-0.5 text-xs text-muted">
      รับคูปองลด {{ birthdayCoupon.discountPercent }}%
    </p>

    <div class="mt-auto pt-3">
      <NuxtLink
        v-if="birthdayCoupon.isClaimed"
        to="/coupons"
        class="flex h-8.5 items-center justify-center gap-1.5 rounded-full bg-primary-soft font-heading text-sm font-medium text-primary-dark transition-colors hover:bg-primary hover:text-white"
      >
        <Icon name="lucide:check" class="size-4" />
        ดูคูปอง
      </NuxtLink>
      <button
        v-else
        type="button"
        :disabled="isClaiming"
        class="flex h-8.5 w-full items-center justify-center rounded-full bg-primary font-heading text-sm font-medium text-white transition-colors hover:bg-primary-dark disabled:opacity-70"
        @click="emit('claim')"
      >
        {{ isClaiming ? 'กำลังรับ…' : 'รับคูปอง' }}
      </button>
    </div>
  </section>
</template>
