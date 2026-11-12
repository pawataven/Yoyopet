<script setup lang="ts">
const benefits = [
  'รับคูปองวันเกิดน้องทุกปี',
  'ได้คำแนะนำสินค้าที่เหมาะกับน้อง',
  'ข้อมูลใช้ตามความยินยอมของคุณ แก้ไขหรือลบได้ตลอด'
]
</script>

<template>
  <aside aria-labelledby="pet-data-benefits-heading" class="mt-8 rounded-[1.25rem] border bg-white px-5 py-5 xl:mt-16 xl:px-8 xl:py-7">
    <h2 id="pet-data-benefits-heading" class="flex items-center gap-2.5 font-sans text-base font-semibold xl:text-lg">
      <Icon name="lucide:info" class="size-5 shrink-0 text-muted" />
      ทำไมต้องใส่ข้อมูลน้อง
    </h2>
    <ul class="mt-2 flex flex-col gap-1 text-sm text-muted sm:flex-row sm:flex-wrap sm:gap-x-2 xl:mt-3 xl:pl-7.5 xl:text-[0.9375rem]">
      <li v-for="benefit in benefits" :key="benefit" class="flex gap-2">
        <span aria-hidden="true">•</span>
        {{ benefit }}
      </li>
    </ul>
  </aside>
</template>
