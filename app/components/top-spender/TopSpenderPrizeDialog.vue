<script setup lang="ts">
import type { TopSpenderPrize } from '~/types/leaderboard'

const WINNER_ADDRESS_CONFIRMATION_DAYS = 7

defineProps<{
  prize: TopSpenderPrize
  month: string
  resultAnnouncedOn: string
  isFinal: boolean
}>()

const emit = defineEmits<{
  shop: []
}>()

const isOpen = defineModel<boolean>('open', { required: true })

const headingId = useId()
const closeButton = useTemplateRef('closeButton')
</script>

<template>
  <ModalDialog
    v-model:open="isOpen"
    :aria-labelledby="headingId"
    class="max-w-200 overflow-x-hidden"
    @opened="closeButton?.focus()"
  >
    <div class="relative">
      <NuxtImg
        :src="prize.imageUrl"
        alt=""
        width="800"
        height="280"
        class="h-44 w-full object-cover sm:h-70"
      />
      <button
        ref="closeButton"
        type="button"
        aria-label="ปิด"
        class="absolute top-4 right-4 flex size-9 items-center justify-center rounded-full bg-ink/45 text-white transition-colors hover:bg-ink/60 sm:top-6 sm:right-6 sm:size-10"
        @click="isOpen = false"
      >
        <Icon name="lucide:x" class="size-5" />
      </button>
    </div>

    <div class="px-5 pt-5 pb-6 sm:px-10 sm:pt-8 sm:pb-8">
      <p class="text-xs font-semibold text-primary-dark sm:text-sm">
        รางวัลอันดับ {{ prize.rank }} · {{ formatThaiLongMonthYear(month) }}
      </p>
      <h2 :id="headingId" class="mt-1 font-sans text-xl leading-tight font-semibold sm:mt-2 sm:text-[1.875rem]">
        {{ prize.name }}
      </h2>

      <h3 class="mt-5 font-sans text-base font-semibold sm:mt-7 sm:text-lg">
        ในชุดประกอบด้วย
      </h3>
      <ul class="mt-2 space-y-1.5 text-sm sm:mt-3 sm:space-y-2 sm:text-[0.9375rem]">
        <li v-for="item in prize.includedItems" :key="item" class="flex items-start gap-3">
          <Icon name="lucide:check" class="mt-0.5 size-4 shrink-0 text-success sm:size-4.5" />
          {{ item }}
        </li>
      </ul>

      <div class="mt-5 flex gap-3 rounded-2xl bg-cream px-4 py-4 sm:mt-7 sm:px-6 sm:py-5">
        <Icon name="lucide:info" class="mt-0.5 size-4 shrink-0 text-muted sm:size-4.5" />
        <div>
          <h3 class="font-sans text-sm font-semibold sm:text-base">
            วิธีรับรางวัล
          </h3>
          <p class="mt-1 text-xs text-muted sm:text-sm">
            ประกาศผล {{ formatThaiDayMonth(resultAnnouncedOn) }} ผู้ชนะยืนยันที่อยู่ภายใน {{ WINNER_ADDRESS_CONFIRMATION_DAYS }} วัน จัดส่งฟรีทั่วประเทศ
          </p>
        </div>
      </div>

      <button
        v-if="!isFinal"
        type="button"
        class="mt-5 flex h-12 items-center justify-center rounded-xl bg-primary text-sm font-semibold text-white transition-colors hover:bg-primary-dark focus-visible:ring-4 focus-visible:ring-primary-soft focus-visible:outline-none sm:mt-6 sm:h-14 sm:text-lg w-full"
        @click="emit('shop')"
      >
        ช้อปเพิ่ม ลุ้นอันดับ {{ prize.rank }}
      </button>
    </div>
  </ModalDialog>
</template>
