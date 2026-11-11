<script setup lang="ts">
definePageMeta({ middleware: 'guest' })

useSeoMeta({
  title: 'เข้าสู่ระบบ / สมัครสมาชิก · YoyoPet'
})
</script>

<template>
  <div class="page-container pt-5 pb-12 xl:pt-9 xl:pb-16">
    <PageBreadcrumb current-label="เข้าสู่ระบบ" />

    <header class="mt-3 xl:mt-4">
      <h1 class="text-[1.75rem] leading-tight xl:text-[3.5rem]">
        YoYo Member
      </h1>
      <p class="mt-1 text-base text-muted xl:text-[1.375rem]">
        สะสมแต้มทุกการซื้อ แลกของรางวัล และรับสิทธิพิเศษสำหรับคนรักสัตว์
      </p>
    </header>

    <div class="mt-6 grid gap-6 xl:mt-9 xl:grid-cols-[970fr_686fr]">
      <LoginHero class="order-last xl:order-none" />
      <LoginCard />
    </div>
  </div>
</template>
