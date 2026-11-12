<script setup lang="ts">
withDefaults(defineProps<{
  name: string
  imageUrl: string | null
  shopUrl: string
  eyebrow?: string
  badge?: string | null
  imageAspectClass?: string
  linkClass?: string
}>(), {
  eyebrow: undefined,
  badge: null,
  imageAspectClass: 'aspect-3/2',
  linkClass: 'text-ink hover:text-primary-dark'
})
</script>

<template>
  <article class="flex flex-col rounded-[1.25rem] border bg-white p-3 xl:p-4">
    <div class="relative">
      <NuxtImg
        v-if="imageUrl"
        :src="imageUrl"
        :alt="name"
        width="648"
        height="432"
        sizes="50vw lg:25vw xl:370px"
        loading="lazy"
        class="w-full rounded-xl object-cover"
        :class="imageAspectClass"
      />
      <div v-else class="flex w-full items-center justify-center rounded-xl bg-cream text-primary" :class="imageAspectClass">
        <Icon name="lucide:package" class="size-10" />
      </div>
      <span
        v-if="badge"
        class="absolute top-2 left-2 flex h-6 items-center rounded-full bg-primary px-2.5 text-xs font-semibold text-white xl:top-3 xl:left-3 xl:h-7.5 xl:px-3.5 xl:text-sm"
      >
        {{ badge }}
      </span>
    </div>

    <div class="flex flex-1 flex-col px-1 pt-3 pb-1 xl:px-2 xl:pt-5 xl:pb-2">
      <p v-if="eyebrow" class="mb-1 text-xs font-semibold text-primary-dark xl:text-sm">
        {{ eyebrow }}
      </p>
      <h3 class="line-clamp-2 font-sans text-sm font-normal text-ink xl:text-lg">
        {{ name }}
      </h3>
      <NuxtLink
        :to="shopUrl"
        class="mt-auto pt-2 text-xs font-semibold hover:underline xl:text-[0.9375rem]"
        :class="linkClass"
      >
        ซื้อที่ร้าน YoYo ›
      </NuxtLink>
    </div>
  </article>
</template>
