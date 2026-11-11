<script setup lang="ts">
const calculationRules = [
  'ปรับระดับทุกวันที่ 1 ของเดือน',
  'คิดจากยอดซื้อที่อนุมัติแล้วย้อนหลัง 12 เดือน',
  'หากยอดไม่ถึงเกณฑ์ ระดับจะปรับลงในรอบถัดไป'
]
</script>

<template>
  <section aria-labelledby="tier-calculation-heading" class="mt-10 rounded-[1.25rem] border bg-white p-5 xl:mt-14 xl:px-8 xl:py-6">
    <h2 id="tier-calculation-heading" class="flex items-center gap-2.5 font-sans text-base font-semibold xl:text-lg">
      <Icon name="lucide:info" class="size-4.5 shrink-0 xl:size-5" />
      การคำนวณระดับ
    </h2>
    <ul class="mt-2 flex flex-col gap-1 text-xs text-muted sm:flex-row sm:flex-wrap sm:gap-x-2 xl:mt-2.5 xl:pl-7.5 xl:text-sm">
      <li v-for="rule in calculationRules" :key="rule">
        • {{ rule }}
      </li>
    </ul>
  </section>
</template>
