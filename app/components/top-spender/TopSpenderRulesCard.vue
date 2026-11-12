<script setup lang="ts">
// TODO: confirm the final Top Spender rules with the business team
const topSpenderRules = [
  'นับจากยอดซื้อที่อนุมัติแล้วในเดือนนั้น',
  'ไม่นับออเดอร์ที่ยกเลิกหรือคืนสินค้า',
  'ประกาศผลภายในวันที่ 5 ของเดือนถัดไป',
  'แสดงชื่อแบบปิดบังเพื่อความเป็นส่วนตัว'
]
</script>

<template>
  <section aria-labelledby="top-spender-rules-heading" class="rounded-[1.25rem] border bg-white p-5 xl:px-8 xl:py-7">
    <h2 id="top-spender-rules-heading" class="font-sans text-lg leading-tight font-semibold xl:text-2xl">
      กติกา
    </h2>
    <ul class="mt-3 space-y-2.5 xl:mt-5 xl:space-y-4">
      <li v-for="rule in topSpenderRules" :key="rule" class="flex items-start gap-3 text-sm xl:text-base">
        <Icon name="lucide:check" class="mt-0.5 size-4 shrink-0 text-success xl:size-5" />
        {{ rule }}
      </li>
    </ul>
  </section>
</template>
