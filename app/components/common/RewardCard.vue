<script setup lang="ts">
import type { Reward } from '~/types/reward'

const props = withDefaults(defineProps<{
  reward: Reward
  memberPoints: number
  variant?: 'featured' | 'catalog'
}>(), {
  variant: 'featured'
})

const pointsShort = computed(() => Math.max(0, props.reward.pointsCost - props.memberPoints))
const canRedeem = computed(() => pointsShort.value === 0)
const isCatalog = computed(() => props.variant === 'catalog')

// Mounted on first open so a catalog of cards doesn't render one dialog each up front
const hasOpenedInsufficientPointsDialog = ref(false)
const isInsufficientPointsDialogOpen = ref(false)

function openInsufficientPointsDialog() {
  hasOpenedInsufficientPointsDialog.value = true
  isInsufficientPointsDialogOpen.value = true
}
</script>

<template>
  <article class="flex flex-col rounded-[1.25rem] border bg-white p-3" :class="isCatalog ? 'xl:p-3.5' : 'xl:p-4'">
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

      <span
        v-if="isCatalog && reward.badge"
        class="absolute top-2 left-2 flex h-6 items-center rounded-full px-3 text-xs font-semibold xl:top-3 xl:left-3 xl:h-7 xl:text-sm"
        :class="rewardBadgeAppearance[reward.badge].class"
      >
        {{ rewardBadgeAppearance[reward.badge].label }}
      </span>

      <div v-if="!canRedeem" class="absolute inset-0 flex items-center justify-center rounded-xl bg-white/40">
        <span class="flex size-11 items-center justify-center rounded-full bg-ink/80 text-white xl:size-14">
          <Icon name="lucide:lock" class="size-5 xl:size-6" />
        </span>
      </div>
    </div>

    <div class="flex flex-1 flex-col px-1 pb-1 xl:px-2" :class="isCatalog ? 'xl:pb-1' : 'xl:pb-2'">
      <p v-if="isCatalog" class="mt-3 text-xs text-muted xl:mt-5 xl:text-sm">
        {{ rewardGroupLabels[reward.group] }}
      </p>
      <h3
        class="line-clamp-2 font-sans text-sm font-normal text-ink"
        :class="isCatalog ? 'mt-0.5 xl:mt-1 xl:text-[1.0625rem]' : 'mt-3 xl:mt-5 xl:text-xl'"
      >
        <NuxtLink :to="`/rewards/${reward.id}`" class="hover:text-primary-dark hover:underline">
          {{ reward.name }}
        </NuxtLink>
      </h3>

      <div class="mt-auto flex flex-wrap items-center justify-between gap-2 pt-2">
        <p
          class="text-base font-semibold"
          :class="[canRedeem ? 'text-primary-dark' : 'text-muted', isCatalog ? 'xl:text-[1.375rem]' : 'xl:text-[1.625rem]']"
        >
          {{ formatNumber(reward.pointsCost) }} แต้ม
        </p>
        <span
          class="flex h-6 items-center rounded-full px-2.5 text-xs font-medium xl:px-4 xl:text-sm"
          :class="[canRedeem ? 'bg-line-green/10 text-success' : 'bg-border/70 text-muted', isCatalog ? 'xl:h-7.5' : 'xl:h-8.5']"
        >
          {{ canRedeem ? 'แลกได้' : `ขาดอีก ${formatNumber(pointsShort)}` }}
        </span>
      </div>

      <NuxtLink
        v-if="canRedeem"
        :to="`/rewards/${reward.id}`"
        class="mt-3 flex h-10 items-center justify-center rounded-xl bg-primary text-sm font-semibold text-white transition-colors hover:bg-primary-dark"
        :class="isCatalog ? 'xl:h-12.5 xl:text-base' : 'xl:h-13 xl:text-lg'"
      >
        แลกเลย
      </NuxtLink>
      <button
        v-else
        type="button"
        class="mt-3 flex h-10 items-center justify-center rounded-xl bg-border/70 text-sm font-semibold text-muted transition-colors hover:bg-border"
        :class="isCatalog ? 'xl:h-12.5 xl:text-base' : 'xl:h-13 xl:text-lg'"
        @click="openInsufficientPointsDialog"
      >
        แต้มยังไม่พอ
      </button>
    </div>

    <InsufficientPointsDialog
      v-if="hasOpenedInsufficientPointsDialog"
      v-model:open="isInsufficientPointsDialogOpen"
      :reward="reward"
    />
  </article>
</template>
