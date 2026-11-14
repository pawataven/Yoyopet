<script setup lang="ts">
import type { Reward } from '~/types/reward'

const props = defineProps<{
  reward: Reward
  memberPoints: number
}>()

const canRedeem = computed(() => props.reward.pointsCost <= props.memberPoints)

// Mounted on first open so the carousel doesn't render one dialog per card up front
const hasOpenedInsufficientPointsDialog = ref(false)
const isInsufficientPointsDialogOpen = ref(false)

function openInsufficientPointsDialog() {
  hasOpenedInsufficientPointsDialog.value = true
  isInsufficientPointsDialogOpen.value = true
}
</script>

<template>
  <article class="flex flex-col rounded-[1.25rem] border bg-white p-1.5">
    <div class="relative">
      <CouponArtwork
        v-if="reward.category === 'coupon' && reward.couponValueBaht !== null"
        :value-baht="reward.couponValueBaht"
        class="aspect-square w-full"
      />
      <NuxtImg
        v-else-if="reward.imageUrl"
        :src="reward.imageUrl"
        :alt="reward.name"
        width="648"
        height="432"
        sizes="300px"
        loading="lazy"
        class="aspect-square w-full rounded-xl object-cover"
      />
      <div v-else class="flex aspect-square w-full items-center justify-center rounded-xl bg-cream text-primary">
        <Icon name="lucide:gift" class="size-10" />
      </div>

      <span
        v-if="reward.badge"
        class="absolute top-2 left-2 flex h-6 items-center rounded-full px-2.5 text-xs font-semibold"
        :class="rewardBadgeAppearance[reward.badge].class"
      >
        {{ rewardBadgeAppearance[reward.badge].label }}
      </span>

      <div v-if="!canRedeem" class="absolute inset-0 flex items-center justify-center rounded-xl bg-white/40">
        <span class="flex size-10 items-center justify-center rounded-full bg-ink/80 text-white">
          <Icon name="lucide:lock" class="size-5" />
        </span>
      </div>
    </div>

    <div class="flex flex-1 flex-col px-1.5 pt-2.5 pb-1.5">
      <p class="text-xs text-muted">
        {{ rewardGroupLabels[reward.group] }}
      </p>
      <h3 class="mt-0.5 truncate font-sans text-sm font-normal">
        <NuxtLink :to="`/rewards/${reward.id}`" class="hover:text-primary-dark hover:underline">
          {{ reward.name }}
        </NuxtLink>
      </h3>
      <p class="mt-1 mb-2.5" :class="canRedeem ? 'text-primary' : 'text-muted'">
        <span class="font-number text-xl font-semibold">{{ formatNumber(reward.pointsCost) }}</span>
        <span class="text-xs">แต้ม</span>
      </p>

      <NuxtLink
        v-if="canRedeem"
        :to="`/rewards/${reward.id}`"
        class="mt-auto flex h-8.5 items-center justify-center rounded-full bg-primary font-heading text-sm font-medium text-white transition-colors hover:bg-primary-dark"
      >
        แลกเลย
      </NuxtLink>
      <button
        v-else
        type="button"
        class="mt-auto flex h-8.5 items-center justify-center rounded-full bg-border/70 font-heading text-sm font-medium text-muted transition-colors hover:bg-border"
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
