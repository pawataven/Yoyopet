<script setup lang="ts">
import type { RewardRedemption, ShipmentStageEvent } from '~/types/reward'

type StageProgress = 'done' | 'current' | 'upcoming'

const props = defineProps<{
  redemption: RewardRedemption
}>()

const isOpen = defineModel<boolean>('open', { required: true })

const { tracking, isLoading } = useShipmentTracking(() => props.redemption.id)
const { copiedKey, copy } = useClipboardCopy()
const { supportChat } = useAppConfig()

const currentStageIndex = computed(() =>
  tracking.value ? tracking.value.stages.findIndex(event => event.stage === tracking.value!.currentStage) : -1
)

function stageProgress(index: number): StageProgress {
  const isDelivered = tracking.value?.currentStage === 'delivered'
  if (index < currentStageIndex.value || (index === currentStageIndex.value && isDelivered)) return 'done'
  return index === currentStageIndex.value ? 'current' : 'upcoming'
}

function stageCaption(event: ShipmentStageEvent, index: number) {
  if (stageProgress(index) === 'current' && event.stage === 'in_transit' && tracking.value?.estimatedDeliveryDate) {
    return `คาดว่าถึง ${formatThaiShortDate(tracking.value.estimatedDeliveryDate)}`
  }
  return event.occurredAt && stageProgress(index) !== 'upcoming' ? formatThaiShortDateTime(event.occurredAt) : null
}

const headingId = useId()
</script>

<template>
  <ModalDialog v-model:open="isOpen" :aria-labelledby="headingId" class="max-w-160">
    <div class="relative px-5 pt-6 pb-6 sm:px-10 sm:pt-9 sm:pb-10">
      <button
        type="button"
        aria-label="ปิด"
        class="absolute top-4 right-4 flex size-9 items-center justify-center rounded-full bg-border/60 text-ink transition-colors hover:bg-border sm:top-7 sm:right-7 sm:size-10"
        @click="isOpen = false"
      >
        <Icon name="lucide:x" class="size-5" />
      </button>

      <h2 :id="headingId" class="pr-12 text-xl leading-tight sm:text-[1.75rem]">
        ติดตามการจัดส่ง
      </h2>

      <div class="mt-5 flex items-center gap-4 sm:mt-6 sm:gap-5">
        <NuxtImg
          v-if="redemption.imageUrl"
          :src="redemption.imageUrl"
          alt=""
          width="192"
          height="128"
          class="size-16 shrink-0 rounded-xl object-cover sm:size-20"
        />
        <span v-else class="flex size-16 shrink-0 items-center justify-center rounded-xl bg-cream text-primary sm:size-20" aria-hidden="true">
          <Icon name="lucide:gift" class="size-7" />
        </span>
        <div class="min-w-0 flex-1">
          <p class="font-semibold sm:text-lg">
            {{ redemption.rewardName }}
          </p>
          <p class="mt-0.5 font-semibold text-primary-dark sm:text-lg">
            {{ formatNumber(redemption.pointsSpent) }} แต้ม
          </p>
        </div>
        <p class="shrink-0 self-end text-xs text-muted sm:text-sm">
          {{ redemption.referenceCode }}
        </p>
      </div>

      <template v-if="tracking">
        <div class="mt-5 flex items-center justify-between gap-4 rounded-2xl bg-cream px-4 py-3.5 sm:mt-6 sm:px-5">
          <div class="min-w-0">
            <p class="font-semibold sm:text-lg">
              {{ tracking.carrierName }}
            </p>
            <p class="mt-0.5 truncate text-sm text-muted sm:text-base">
              {{ tracking.trackingNumber ?? 'รอเลขพัสดุจากขนส่ง' }}
            </p>
          </div>
          <button
            v-if="tracking.trackingNumber"
            type="button"
            class="flex h-10 shrink-0 items-center justify-center gap-1.5 rounded-xl border-2 border-primary bg-white px-4 text-sm font-semibold text-primary-dark transition-colors hover:bg-primary-soft sm:h-12 sm:px-6 sm:text-base"
            @click="copy(tracking.trackingNumber)"
          >
            <Icon v-if="copiedKey === tracking.trackingNumber" name="lucide:check" class="size-4" />
            {{ copiedKey === tracking.trackingNumber ? 'คัดลอกแล้ว' : 'คัดลอกเลข' }}
          </button>
          <span class="sr-only" aria-live="polite">{{ copiedKey ? `คัดลอกเลขพัสดุ ${copiedKey} แล้ว` : '' }}</span>
        </div>

        <ol class="mt-6 sm:mt-7" aria-label="สถานะการจัดส่ง">
          <li
            v-for="(event, index) in tracking.stages"
            :key="event.stage"
            class="relative flex gap-3 pb-4 last:pb-0 sm:gap-4 sm:pb-5"
            :aria-current="stageProgress(index) === 'current' ? 'step' : undefined"
          >
            <span
              v-if="index < tracking.stages.length - 1"
              class="absolute top-6 bottom-0 left-2.75 w-0.5 sm:top-7 sm:left-3.25"
              :class="stageProgress(index + 1) === 'upcoming' ? 'bg-primary-soft' : 'bg-success'"
              aria-hidden="true"
            />
            <span
              v-if="stageProgress(index) === 'done'"
              class="relative flex size-6 shrink-0 items-center justify-center rounded-full bg-success text-white sm:size-7"
              aria-hidden="true"
            >
              <Icon name="lucide:check" class="size-3.5 sm:size-4" />
            </span>
            <span
              v-else-if="stageProgress(index) === 'current'"
              class="relative flex size-6 shrink-0 items-center justify-center rounded-full border-2 border-pending bg-white sm:size-7"
              aria-hidden="true"
            >
              <span class="size-2.5 rounded-full bg-pending sm:size-3" />
            </span>
            <span v-else class="relative size-6 shrink-0 rounded-full border-2 border-border bg-white sm:size-7" aria-hidden="true" />

            <div class="min-w-0 pt-0.5">
              <p class="text-sm sm:text-base" :class="stageProgress(index) === 'upcoming' ? 'text-muted' : 'font-semibold'">
                {{ shipmentStageLabels[event.stage] }}
                <span class="sr-only">{{ stageProgress(index) === 'done' ? '(เสร็จแล้ว)' : stageProgress(index) === 'current' ? '(สถานะปัจจุบัน)' : '' }}</span>
              </p>
              <p v-if="stageCaption(event, index)" class="mt-0.5 text-xs text-muted sm:text-sm">
                {{ stageCaption(event, index) }}
              </p>
            </div>
          </li>
        </ol>
      </template>

      <p v-else-if="!isLoading" class="mt-6 rounded-2xl bg-cream px-5 py-6 text-center text-sm text-muted sm:text-base">
        ยังไม่มีข้อมูลการจัดส่ง เราจะแจ้งเลขพัสดุเมื่อส่งมอบให้ขนส่งแล้ว
      </p>

      <a
        :href="supportChat.url"
        target="_blank"
        rel="noopener noreferrer"
        class="mt-7 flex h-12 w-full items-center justify-center rounded-xl border-2 border-primary text-base font-semibold text-primary-dark transition-colors hover:bg-primary-soft sm:mt-10 sm:h-14 sm:text-lg"
      >
        ติดต่อเจ้าหน้าที่
      </a>
    </div>
  </ModalDialog>
</template>
