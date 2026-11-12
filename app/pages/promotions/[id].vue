<script setup lang="ts">
const route = useRoute()
const campaignId = computed(() => String(route.params.id))

const { campaign, isLoading } = useCampaign(campaignId)

useSeoMeta({
  title: () => (campaign.value ? `${campaign.value.title} · YoyoPet` : 'โปรโมชั่น · YoyoPet'),
  description: () => campaign.value?.highlights.join(' · ') ?? ''
})
</script>

<template>
  <div class="page-container pt-5 pb-12 xl:pt-9 xl:pb-16">
    <PageBreadcrumb current-label="โปรโมชั่น" />

    <template v-if="campaign">
      <header class="mt-3 xl:mt-4">
        <h1 class="text-[1.75rem] leading-tight xl:text-[3.5rem]">
          {{ campaign.title }}
        </h1>
        <p class="mt-1 text-base text-muted xl:text-[1.375rem]">
          {{ campaign.tagline }} · {{ formatThaiDateSpan(campaign.startsOn, campaign.endsOn) }}
        </p>
      </header>

      <NuxtImg
        :src="campaign.bannerImageUrl"
        :alt="campaign.title"
        width="1680"
        height="945"
        sizes="xs:100vw xl:1680px"
        preload
        class="mt-5 aspect-2/1 w-full rounded-[1.25rem] object-cover object-top xl:mt-13 xl:aspect-1680/544 xl:rounded-[1.75rem]"
      />

      <div class="mt-6 grid gap-4 xl:mt-16 xl:grid-cols-[969fr_687fr] xl:gap-6">
        <CampaignDetailsCard :highlights="campaign.highlights" :title="campaign.title" />
        <CampaignCountdownCard :starts-on="campaign.startsOn" :ends-on="campaign.endsOn" />
      </div>

      <section v-if="campaign.products.length" aria-labelledby="campaign-products-heading" class="mt-12 xl:mt-16">
        <h2 id="campaign-products-heading" class="text-2xl leading-tight xl:text-[2.25rem]">
          สินค้าในแคมเปญ
        </h2>
        <ul class="mt-4 grid grid-cols-2 gap-3 lg:grid-cols-4 xl:mt-5 xl:gap-6">
          <li v-for="product in campaign.products" :key="product.id" class="flex">
            <ProductCard
              :name="product.name"
              :image-url="product.imageUrl"
              :shop-url="product.shopUrl"
              :badge="product.badge"
              image-aspect-class="aspect-[17/12]"
              link-class="text-primary-dark"
              class="w-full"
            />
          </li>
        </ul>
      </section>
    </template>
    <div v-else-if="!isLoading" class="mt-6 rounded-[1.25rem] border bg-cream px-6 py-16 text-center xl:mt-10">
      <p class="text-lg font-semibold xl:text-2xl">
        ไม่พบแคมเปญนี้
      </p>
      <p class="mt-1 text-sm text-muted xl:text-lg">
        แคมเปญอาจสิ้นสุดแล้วหรือลิงก์ไม่ถูกต้อง
      </p>
      <NuxtLink to="/" class="mt-6 inline-flex h-12 items-center rounded-xl bg-primary px-8 font-semibold text-white transition-colors hover:bg-primary-dark">
        กลับหน้าแรก
      </NuxtLink>
    </div>
  </div>
</template>
