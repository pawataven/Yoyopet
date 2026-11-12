<script setup lang="ts">
const MAX_VISIBLE_PAGE_BUTTONS = 7

const props = defineProps<{
  totalPages: number
}>()

const currentPage = defineModel<number>({ required: true })

// Long page lists collapse to: first, …, neighbours of the current page, …, last
const pageItems = computed<(number | 'gap')[]>(() => {
  const total = props.totalPages
  if (total <= MAX_VISIBLE_PAGE_BUTTONS) return Array.from({ length: total }, (_, index) => index + 1)
  const windowStart = Math.max(2, Math.min(currentPage.value - 1, total - 4))
  const windowEnd = Math.min(total - 1, Math.max(currentPage.value + 1, 5))
  const middlePages = Array.from({ length: windowEnd - windowStart + 1 }, (_, index) => windowStart + index)
  return [
    1,
    ...(windowStart > 2 ? ['gap' as const] : []),
    ...middlePages,
    ...(windowEnd < total - 1 ? ['gap' as const] : []),
    total
  ]
})

function goToPage(page: number) {
  currentPage.value = Math.min(Math.max(page, 1), props.totalPages)
}

const pageButtonClass = 'flex size-8 items-center justify-center rounded-full border bg-white font-number text-xs font-semibold transition-colors hover:border-primary/40 hover:bg-cream disabled:pointer-events-none disabled:opacity-40 focus-visible:ring-4 focus-visible:ring-primary-soft focus-visible:outline-none xl:size-11 xl:text-base'
</script>

<template>
  <nav v-if="totalPages > 1" aria-label="เลือกหน้า" class="flex items-center justify-center gap-1.5 xl:gap-2">
    <button
      type="button"
      aria-label="หน้าก่อนหน้า"
      :disabled="currentPage <= 1"
      :class="pageButtonClass"
      @click="goToPage(currentPage - 1)"
    >
      <Icon name="lucide:chevron-left" class="size-4" />
    </button>
    <template v-for="(pageItem, index) in pageItems" :key="pageItem === 'gap' ? `gap-${index}` : pageItem">
      <span v-if="pageItem === 'gap'" class="px-1 text-muted" aria-hidden="true">…</span>
      <button
        v-else
        type="button"
        :aria-label="`หน้า ${pageItem}`"
        :aria-current="pageItem === currentPage ? 'page' : undefined"
        :class="[pageButtonClass, pageItem === currentPage && 'border-primary bg-primary text-white hover:border-primary hover:bg-primary-dark']"
        @click="goToPage(pageItem)"
      >
        {{ pageItem }}
      </button>
    </template>
    <button
      type="button"
      aria-label="หน้าถัดไป"
      :disabled="currentPage >= totalPages"
      :class="pageButtonClass"
      @click="goToPage(currentPage + 1)"
    >
      <Icon name="lucide:chevron-right" class="size-4" />
    </button>
  </nav>
</template>
