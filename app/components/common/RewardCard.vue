<script setup lang="ts">
import type { Reward } from '~/types/reward'

const props = defineProps<{
  reward: Reward
  memberPoints: number
}>()

const pointsShort = computed(() => Math.max(0, props.reward.pointsCost - props.memberPoints))
const canRedeem = computed(() => pointsShort.value === 0)
</script>

<template>
  <article class="flex flex-col rounded-[1.25rem] border bg-white p-3 xl:p-4">
    <div class="relative">
      <CouponArtwork
        v-if="reward.category === 'coupon' && reward.couponValueBaht !== null"
        :value-baht="reward.couponValueBaht"
        class="aspect-3/2 w-full"
      />
      <NuxtImg
        v-else-if="reward.imageUrl"
        :src="reward.imageUrl"
        :alt="reward.name"
        width="648"
        height="432"
        sizes="50vw lg:25vw xl:370px"
        loading="lazy"
        class="aspect-3/2 w-full rounded-xl object-cover"
      />
      <div v-else class="flex aspect-3/2 w-full items-center justify-center rounded-xl bg-cream text-primary">
        <Icon name="lucide:gift" class="size-10" />
      </div>

      <div v-if="!canRedeem" class="absolute inset-0 flex items-center justify-center rounded-xl bg-white/40">
        <span class="flex size-11 items-center justify-center rounded-full bg-ink/80 text-white xl:size-14">
          <Icon name="lucide:lock" class="size-5 xl:size-6" />
        </span>
      </div>
    </div>

    <div class="flex flex-1 flex-col px-1 pb-1 xl:px-2 xl:pb-2">
      <h3 class="mt-3 line-clamp-2 font-sans text-sm font-normal text-ink xl:mt-5 xl:text-xl">
        {{ reward.name }}
      </h3>

      <div class="mt-auto flex flex-wrap items-center justify-between gap-2 pt-2">
        <p class="text-base font-semibold xl:text-[1.625rem]" :class="canRedeem ? 'text-primary-dark' : 'text-muted'">
          {{ formatNumber(reward.pointsCost) }} แต้ม
        </p>
        <span
          class="flex h-6 items-center rounded-full px-2.5 text-xs font-medium xl:h-8.5 xl:px-4 xl:text-sm"
          :class="canRedeem ? 'bg-line-green/10 text-success' : 'bg-border/70 text-muted'"
        >
          {{ canRedeem ? 'แลกได้' : `ขาดอีก ${formatNumber(pointsShort)}` }}
        </span>
      </div>

      <NuxtLink
        v-if="canRedeem"
        :to="`/rewards/${reward.id}`"
        class="mt-3 flex h-10 items-center justify-center rounded-xl bg-primary text-sm font-semibold text-white transition-colors hover:bg-primary-dark xl:h-13 xl:text-lg"
      >
        แลกเลย
      </NuxtLink>
      <button
        v-else
        type="button"
        disabled
        class="mt-3 flex h-10 cursor-not-allowed items-center justify-center rounded-xl bg-border/70 text-sm font-semibold text-muted xl:h-13 xl:text-lg"
      >
        แต้มยังไม่พอ
      </button>
    </div>
  </article>
</template>
