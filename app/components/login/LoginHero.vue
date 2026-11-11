<script setup lang="ts">
const memberBenefits = [
  'สะสมแต้มจาก Shopee, TikTok Shop, Lazada',
  'คูปองวันเกิดทั้งคุณและน้อง',
  'สิทธิพิเศษตามระดับสมาชิก'
]
</script>

<template>
  <section aria-labelledby="member-benefits-heading" class="relative isolate flex min-h-80 items-end overflow-hidden rounded-[1.75rem] p-4 sm:min-h-104 xl:min-h-0 xl:p-8">
    <NuxtImg
      src="/banners/yoyo-for-your-pet.jpg"
      alt="YoYo for your pet"
      width="960"
      height="540"
      preload
      class="absolute inset-0 -z-10 size-full object-cover object-center"
    />

    <div class="w-full rounded-2xl bg-white/90 px-5 py-4 backdrop-blur-sm sm:w-auto sm:min-w-96 xl:min-w-130 xl:rounded-[1.25rem] xl:px-8 xl:py-6">
      <h2 id="member-benefits-heading" class="text-base xl:text-[1.375rem]">
        สมาชิกได้อะไรบ้าง
      </h2>
      <ul class="mt-2 space-y-1.5 xl:mt-3 xl:space-y-2">
        <li v-for="benefit in memberBenefits" :key="benefit" class="flex items-center gap-2.5 text-sm xl:gap-3 xl:text-base">
          <Icon name="lucide:check" class="size-4 shrink-0 text-success xl:size-5" />
          {{ benefit }}
        </li>
      </ul>
    </div>
  </section>
</template>
