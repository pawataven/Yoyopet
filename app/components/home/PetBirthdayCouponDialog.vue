<script setup lang="ts">
import type { PetBirthdayCoupon } from '~/types/pet'

defineProps<{
  birthdayCoupon: PetBirthdayCoupon
}>()

const isOpen = defineModel<boolean>('open', { required: true })

const headingId = useId()
const useCouponLink = useTemplateRef<{ $el: HTMLElement }>('useCouponLink')
</script>

<template>
  <ModalDialog
    v-model:open="isOpen"
    :aria-labelledby="headingId"
    class="max-w-157"
    @opened="useCouponLink?.$el.focus()"
  >
    <div class="px-5 pt-7 pb-6 text-center sm:px-12 sm:pt-12 sm:pb-12">
      <div class="relative mx-auto size-24 sm:size-28">
        <PetPhoto
          v-if="birthdayCoupon.petPhotoUrl"
          :src="birthdayCoupon.petPhotoUrl"
          alt=""
          width="224"
          height="224"
          class="size-full rounded-full object-cover"
        />
        <span v-else class="flex size-full items-center justify-center rounded-full bg-primary-soft text-primary">
          <Icon name="lucide:paw-print" class="size-10" />
        </span>
        <span class="absolute -right-1 -bottom-1 flex size-10 items-center justify-center rounded-full border-3 border-white bg-primary text-white sm:size-12" aria-hidden="true">
          <Icon name="lucide:cake" class="size-5 sm:size-5.5" />
        </span>
      </div>

      <h2 :id="headingId" class="mt-5 text-xl leading-tight sm:mt-7 sm:text-[1.625rem]">
        สุขสันต์วันเกิดน้อง{{ birthdayCoupon.petName }}
      </h2>
      <p class="mt-1 text-sm text-muted sm:text-base">
        รับคูปองวันเกิดเรียบร้อยแล้ว
      </p>

      <div class="mt-5 flex overflow-hidden rounded-[1.25rem] border text-left sm:mt-7">
        <p class="flex w-24 shrink-0 items-center justify-center bg-primary font-number text-[1.75rem] font-semibold text-white sm:w-34 sm:text-[2.25rem]">
          {{ birthdayCoupon.discountPercent }}%
        </p>
        <div class="min-w-0 flex-1 px-4 py-4 sm:px-6 sm:py-5">
          <p class="font-semibold sm:text-lg">
            ส่วนลด {{ birthdayCoupon.discountPercent }}%
          </p>
          <p class="mt-0.5 text-xs text-muted sm:mt-1 sm:text-[0.9375rem]">
            ใช้ได้ถึง {{ formatThaiShortDate(birthdayCoupon.expiresAt) }}
          </p>
          <p class="mt-1 truncate font-number text-sm font-semibold tracking-wide text-primary-dark sm:text-[0.9375rem]">
            {{ birthdayCoupon.couponCode }}
          </p>
        </div>
      </div>

      <div class="mt-6 space-y-3 sm:mt-9 sm:space-y-4">
        <NuxtLink
          ref="useCouponLink"
          to="/#shop"
          class="flex h-12 items-center justify-center rounded-xl bg-primary text-base font-semibold text-white transition-colors hover:bg-primary-dark focus-visible:ring-4 focus-visible:ring-primary-soft focus-visible:outline-none sm:h-15 sm:text-lg"
          @click="isOpen = false"
        >
          ใช้คูปองเลย
        </NuxtLink>
        <NuxtLink
          to="/coupons"
          class="flex h-12 items-center justify-center rounded-xl border-2 border-primary bg-white text-base font-semibold text-primary-dark transition-colors hover:bg-primary-soft focus-visible:ring-4 focus-visible:ring-primary-soft focus-visible:outline-none sm:h-15 sm:text-lg"
          @click="isOpen = false"
        >
          ดูคูปองของฉัน
        </NuxtLink>
      </div>
    </div>
  </ModalDialog>
</template>
