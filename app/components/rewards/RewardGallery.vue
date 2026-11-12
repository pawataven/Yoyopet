<script setup lang="ts">
import type { RewardDetail } from '~/types/reward'

const props = defineProps<{
  reward: RewardDetail
}>()

const selectedImageIndex = ref(0)
const selectedImageUrl = computed(() => props.reward.imageUrls[selectedImageIndex.value] ?? props.reward.imageUrls[0])

watch(() => props.reward.id, () => {
  selectedImageIndex.value = 0
})
</script>

<template>
  <div>
    <CouponArtwork
      v-if="reward.category === 'coupon' && reward.couponValueBaht !== null"
      :value-baht="reward.couponValueBaht"
      class="aspect-3/2 w-full"
    />
    <NuxtImg
      v-else-if="selectedImageUrl"
      :src="selectedImageUrl"
      :alt="reward.name"
      width="648"
      height="432"
      sizes="100vw xl:830px"
      class="aspect-3/2 w-full rounded-2xl object-cover"
    />
    <div v-else class="flex aspect-3/2 w-full items-center justify-center rounded-2xl bg-cream text-primary">
      <Icon name="lucide:gift" class="size-16" />
    </div>

    <ul v-if="reward.imageUrls.length > 1" class="mt-3 flex snap-x gap-2 overflow-x-auto scrollbar-none xl:mt-4 xl:gap-4">
      <li
        v-for="(imageUrl, index) in reward.imageUrls"
        :key="`${index}-${imageUrl}`"
        class="shrink-0 basis-[calc((100%-1.5rem)/4)] snap-start xl:basis-[calc((100%-3rem)/4)]"
      >
        <button
          type="button"
          :aria-label="`ดูรูปที่ ${index + 1}`"
          :aria-pressed="index === selectedImageIndex"
          class="block w-full overflow-hidden rounded-xl border-2 transition-colors"
          :class="index === selectedImageIndex ? 'border-primary' : 'border-transparent hover:border-primary/40'"
          @click="selectedImageIndex = index"
        >
          <NuxtImg :src="imageUrl" alt="" width="216" height="144" class="aspect-3/2 w-full object-cover" />
        </button>
      </li>
    </ul>
  </div>
</template>
