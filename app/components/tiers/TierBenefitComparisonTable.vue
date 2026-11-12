<script setup lang="ts">
import type { TierBenefitComparisonRow, TierLevel } from '~/types/member'

defineProps<{
  tierLevels: TierLevel[]
  rows: TierBenefitComparisonRow[]
  currentTier: string
}>()
</script>

<template>
  <section aria-labelledby="tier-comparison-heading" class="mt-10 xl:mt-18">
    <h2 id="tier-comparison-heading" class="text-xl leading-tight xl:text-[2.25rem]">
      เปรียบเทียบสิทธิ์
    </h2>

    <div class="relative mt-4 overflow-x-auto rounded-[1.25rem] border bg-white px-4 py-2 xl:mt-6 xl:px-8 xl:py-1.5">
      <table class="w-full min-w-[36rem] border-separate border-spacing-0 text-sm xl:text-[1.0625rem]">
        <thead>
          <tr>
            <th scope="col" class="border-b py-4 pr-4 text-left font-semibold xl:w-[36%] xl:pt-6 xl:pb-4">
              สิทธิ์
            </th>
            <th
              v-for="level in tierLevels"
              :key="level.name"
              scope="col"
              class="border-b px-2 py-4 text-center font-semibold xl:pt-6 xl:pb-4"
              :class="level.name === currentTier && 'rounded-t-xl bg-primary-soft/60 text-primary'"
            >
              {{ level.name }}
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(row, rowIndex) in rows" :key="row.label">
            <th
              scope="row"
              class="py-4 pr-4 text-left font-normal xl:py-5"
              :class="rowIndex < rows.length - 1 && 'border-b'"
            >
              {{ row.label }}
            </th>
            <td
              v-for="level in tierLevels"
              :key="level.name"
              class="px-2 py-4 text-center xl:py-5"
              :class="[
                rowIndex < rows.length - 1 && 'border-b',
                level.name === currentTier && 'bg-primary-soft/60 font-semibold',
                level.name === currentTier && rowIndex === rows.length - 1 && 'rounded-b-xl'
              ]"
            >
              <template v-if="row.valueByTier[level.name] === true">
                <Icon name="lucide:check" class="size-4 align-middle" />
                <span class="sr-only">มี</span>
              </template>
              <template v-else-if="!row.valueByTier[level.name]">
                <span class="text-muted" aria-hidden="true">–</span>
                <span class="sr-only">ไม่มี</span>
              </template>
              <template v-else>
                {{ row.valueByTier[level.name] }}
              </template>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </section>
</template>
