<script setup lang="ts">
import type { FaqItem } from '~/types/help'

defineProps<{
  faqs: FaqItem[]
}>()
</script>

<template>
  <section aria-labelledby="faq-heading" class="mt-7 md:mt-10 xl:mt-18">
    <h2 id="faq-heading" class="font-sans text-lg leading-tight font-semibold md:text-xl xl:text-[2rem]">
      คำถามที่พบบ่อย
    </h2>

    <ul class="mt-3 grid grid-cols-1 items-start gap-2.5 md:mt-4 md:grid-cols-2 md:gap-3 xl:gap-6">
      <li v-for="faq in faqs" :key="faq.id">
        <details class="group rounded-2xl border bg-white transition-colors open:border-primary/30 md:rounded-[1.25rem]">
          <summary class="flex cursor-pointer list-none items-start gap-4 rounded-2xl p-4 focus-visible:ring-4 focus-visible:ring-primary-soft focus-visible:outline-none md:rounded-[1.25rem] md:p-5 xl:min-h-30 xl:px-8 xl:pt-8 xl:pb-7 [&::-webkit-details-marker]:hidden">
            <span class="min-w-0 flex-1">
              <span class="block text-[0.9375rem] font-semibold md:text-base xl:text-xl">{{ faq.question }}</span>
              <span class="mt-1 block text-sm text-muted max-md:hidden xl:text-[0.9375rem]">{{ faq.summary }}</span>
            </span>
            <Icon name="lucide:chevron-down" class="size-5 shrink-0 text-primary transition-transform group-open:rotate-180 md:hidden" />
            <Icon name="lucide:plus" class="mt-0.5 size-5 shrink-0 text-primary transition-transform group-open:rotate-45 max-md:hidden xl:mt-1 xl:mr-1.5" />
          </summary>
          <p class="-mt-1 px-4 pb-4 text-xs leading-relaxed text-muted md:px-5 md:pb-5 md:text-sm md:text-ink xl:px-8 xl:pb-6 xl:text-base">
            {{ faq.answer }}
          </p>
        </details>
      </li>
    </ul>
  </section>
</template>
