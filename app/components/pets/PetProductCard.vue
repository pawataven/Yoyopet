<script setup lang="ts">
import type { PetProductRecommendation } from '~/types/product'

defineProps<{
  product: PetProductRecommendation
}>()
</script>

<template>
  <article class="flex flex-col rounded-[1.25rem] border bg-white p-3 xl:p-4">
    <NuxtImg
      v-if="product.imageUrl"
      :src="product.imageUrl"
      :alt="product.name"
      width="648"
      height="432"
      sizes="50vw lg:25vw xl:370px"
      loading="lazy"
      class="aspect-3/2 w-full rounded-xl object-cover"
    />
    <div v-else class="flex aspect-3/2 w-full items-center justify-center rounded-xl bg-cream text-primary">
      <Icon name="lucide:package" class="size-10" />
    </div>

    <div class="flex flex-1 flex-col px-1 pt-3 pb-1 xl:px-2 xl:pt-5 xl:pb-2">
      <p class="text-xs font-semibold text-primary-dark xl:text-sm">
        สำหรับ{{ product.petName }}
      </p>
      <h3 class="mt-1 line-clamp-2 font-sans text-sm font-normal text-ink xl:text-lg">
        {{ product.name }}
      </h3>
      <NuxtLink
        :to="product.shopUrl"
        class="mt-auto pt-2 text-xs font-semibold text-ink hover:text-primary-dark hover:underline xl:text-[0.9375rem]"
      >
        ซื้อที่ร้าน YoYo ›
      </NuxtLink>
    </div>
  </article>
</template>
