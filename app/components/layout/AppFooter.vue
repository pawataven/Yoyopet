<script setup lang="ts">
const { socialLinks } = useAppConfig()

const footerMenuItems = [...mainNavItems, { label: 'กรอกเลขออเดอร์', to: '/orders/submit' }]
const copyrightYear = new Date().getFullYear()
</script>

<template>
  <footer class="bg-cocoa text-white">
    <div class="page-container pt-10 pb-5 xl:pt-12">
      <div class="grid grid-cols-2 gap-x-6 gap-y-8 md:grid-cols-[1fr_auto_auto_auto] md:gap-12 xl:grid-cols-[1fr_17.75rem_17.75rem_16.25rem] xl:gap-0">
        <div class="col-span-2 md:col-span-1">
          <img src="/logo/logo.png" alt="" width="80" height="80" class="size-16 xl:size-20">
          <p class="mt-4 font-heading text-xl font-medium xl:mt-5 xl:text-2xl">
            YoYo Pet Shop
          </p>
          <p class="mt-1 text-sm text-white/70 xl:mt-0 xl:text-base">
            ศูนย์รวมสินค้าสำหรับสัตว์เลี้ยง
          </p>
        </div>

        <nav aria-labelledby="footer-menu-heading">
          <h2 id="footer-menu-heading" class="font-sans text-base font-semibold xl:mt-2 xl:text-lg">
            เมนู
          </h2>
          <ul class="mt-3 space-y-2 xl:mt-2 xl:space-y-1.5">
            <li v-for="item in footerMenuItems" :key="item.to">
              <NuxtLink :to="item.to" class="text-sm text-white/75 transition-colors hover:text-white xl:text-base">
                {{ item.label }}
              </NuxtLink>
            </li>
          </ul>
        </nav>

        <nav aria-labelledby="footer-help-heading">
          <h2 id="footer-help-heading" class="font-sans text-base font-semibold xl:mt-2 xl:text-lg">
            ช่วยเหลือ
          </h2>
          <ul class="mt-3 space-y-2 xl:mt-2 xl:space-y-1.5">
            <li v-for="item in helpNavItems" :key="item.to">
              <NuxtLink :to="item.to" class="text-sm text-white/75 transition-colors hover:text-white xl:text-base">
                {{ item.label }}
              </NuxtLink>
            </li>
          </ul>
        </nav>

        <div class="col-span-2 md:col-span-1">
          <h2 class="font-sans text-base font-semibold xl:mt-2 xl:text-lg">
            ติดตามเรา
          </h2>
          <ul class="mt-3 space-y-2 xl:mt-2 xl:space-y-1.5">
            <li v-for="link in socialLinks" :key="link.url">
              <a :href="link.url" target="_blank" rel="noopener noreferrer" class="text-sm text-white/75 transition-colors hover:text-white xl:text-base">
                {{ link.label }}
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div class="mt-8 flex flex-col-reverse gap-3 border-t border-white/15 pt-5 sm:flex-row sm:items-center sm:justify-between xl:mt-4 xl:pt-5">
        <p class="text-xs text-white/60 xl:text-sm">
          © {{ copyrightYear }} YoYo Pet Shop สงวนลิขสิทธิ์
        </p>
        <div class="flex items-center gap-3 text-sm text-white/75 xl:gap-10">
          <Icon name="lucide:globe" class="size-5 shrink-0" aria-hidden="true" />
          <p aria-label="ภาษา">
            <span aria-current="true" class="text-white">ไทย</span>
            <span class="mx-1 text-white/40" aria-hidden="true">|</span>
            <span title="เร็วๆ นี้">English</span>
          </p>
        </div>
      </div>
    </div>
  </footer>
</template>
