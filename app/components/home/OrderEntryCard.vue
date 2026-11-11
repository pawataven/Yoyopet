<template>
  <NuxtLink
    to="/orders/submit"
    class="group flex items-center gap-4 rounded-[1.75rem] bg-cocoa px-5 py-5 text-white xl:gap-6 xl:px-8 xl:py-7"
  >
    <span class="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-primary xl:size-16">
      <OrderEntryIcon class="size-6 xl:size-8" />
    </span>

    <span class="min-w-0 flex-1">
      <span class="block font-heading text-lg font-medium xl:text-[1.875rem] xl:leading-tight">
        กรอกเลขคำสั่งซื้อ รับแต้ม
      </span>
      <span class="mt-1 block text-sm text-white/70 xl:text-lg">
        ซื้อจาก Shopee · TikTok Shop · Lazada สะสมแต้มได้ทุกช่องทาง
      </span>
    </span>

    <span class="flex size-10 shrink-0 items-center justify-center rounded-full bg-white/10 transition-colors group-hover:bg-white/20 xl:size-14">
      <Icon name="lucide:chevron-right" class="size-5 xl:size-6" />
    </span>
  </NuxtLink>
</template>
