<script setup lang="ts">
const { recommendations } = usePetProductRecommendations()
</script>

<template>
  <section v-if="recommendations.length" aria-labelledby="pet-products-heading" class="mt-12 xl:mt-16">
    <div class="flex items-center justify-between gap-4">
      <h2 id="pet-products-heading" class="text-2xl leading-tight xl:text-[2.25rem]">
        สินค้าแนะนำสำหรับน้อง ๆ
      </h2>
      <NuxtLink to="/#shop" class="shrink-0 text-sm font-semibold text-primary-dark hover:underline xl:text-base">
        ดูทั้งหมด ›
      </NuxtLink>
    </div>

    <ul class="mt-5 grid grid-cols-2 gap-3 lg:grid-cols-4 xl:mt-5 xl:gap-6">
      <li v-for="product in recommendations" :key="product.id" class="flex">
        <ProductCard
          :name="product.name"
          :image-url="product.imageUrl"
          :shop-url="product.shopUrl"
          :eyebrow="`สำหรับ${product.petName}`"
          class="w-full"
        />
      </li>
    </ul>
  </section>
</template>
