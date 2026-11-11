<script setup lang="ts">
const { marketplaceStores } = useAppConfig()
</script>

<template>
  <section id="shop" aria-labelledby="shop-marketplaces-heading" class="page-container mt-12 xl:mt-17">
    <h2 id="shop-marketplaces-heading" class="text-2xl leading-tight xl:text-[2.25rem]">
      ช้อปสินค้า YoYo
    </h2>
    <p class="mt-1 text-sm text-muted xl:text-lg">
      ซื้อช่องทางไหนก็สะสมแต้มได้ เก็บเลขคำสั่งซื้อไว้กรอกนะ
    </p>

    <ul class="mt-4 grid gap-3 md:grid-cols-3 xl:mt-5 xl:gap-6">
      <li v-for="store in marketplaceStores" :key="store.id">
        <a
          :href="store.storeUrl"
          target="_blank"
          rel="noopener noreferrer"
          class="group flex items-center gap-4 rounded-[1.25rem] border bg-white px-4 py-3.5 transition-colors hover:border-primary/40 hover:bg-cream xl:gap-5 xl:px-5 xl:py-5"
        >
          <img :src="store.logoUrl" :alt="`โลโก้ ${store.name}`" width="56" height="56" loading="lazy" class="size-11 shrink-0 rounded-xl xl:size-14">
          <span class="min-w-0 flex-1">
            <span class="block font-heading text-base font-medium xl:text-[1.375rem]">{{ store.name }}</span>
            <span class="block text-xs text-muted xl:text-[0.9375rem]">ไปที่ร้าน YoYo Pet</span>
          </span>
          <Icon name="lucide:arrow-right" class="size-5 shrink-0 text-primary-dark transition-transform group-hover:translate-x-1 xl:mr-1" />
        </a>
      </li>
    </ul>
  </section>
</template>
