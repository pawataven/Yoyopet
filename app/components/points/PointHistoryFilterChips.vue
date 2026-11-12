<script setup lang="ts">
import type { PointHistoryFilter } from '~/types/points'

const selectedFilter = defineModel<PointHistoryFilter>({ required: true })

const filterOptions: { value: PointHistoryFilter, label: string }[] = [
  { value: 'all', label: 'ทั้งหมด' },
  { value: 'earned', label: 'ได้รับ' },
  { value: 'spent', label: 'ใช้ไป' },
  { value: 'expired', label: 'หมดอายุ' }
]
</script>

<template>
  <fieldset>
    <legend class="sr-only">
      กรองประเภทรายการ
    </legend>
    <div class="flex flex-wrap gap-2 xl:gap-3">
      <label
        v-for="option in filterOptions"
        :key="option.value"
        class="flex h-10 cursor-pointer items-center rounded-full border bg-white px-4 text-sm transition-colors hover:border-primary/40 has-checked:border-primary has-checked:bg-primary has-checked:font-semibold has-checked:text-white has-focus-visible:ring-4 has-focus-visible:ring-primary-soft xl:h-11 xl:px-5 xl:text-[0.9375rem]"
      >
        <input
          v-model="selectedFilter"
          type="radio"
          name="point-history-filter"
          :value="option.value"
          class="sr-only"
        >
        {{ option.label }}
      </label>
    </div>
  </fieldset>
</template>
