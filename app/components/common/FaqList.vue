<script setup lang="ts">
import type { FaqItem } from '~/types/help'

defineProps<{
  faqs: FaqItem[]
}>()
</script>

<template>
  <section aria-labelledby="faq-heading" class="mt-10 xl:mt-18">
    <h2 id="faq-heading" class="font-sans text-xl leading-tight font-semibold xl:text-[2rem]">
      คำถามที่พบบ่อย
    </h2>

    <ul class="mt-4 grid grid-cols-1 items-start gap-3 md:grid-cols-2 xl:gap-6">
      <li v-for="faq in faqs" :key="faq.id">
        <details class="group rounded-[1.25rem] border bg-white transition-colors open:border-primary/30">
          <summary class="flex cursor-pointer list-none items-start gap-4 rounded-[1.25rem] p-5 focus-visible:ring-4 focus-visible:ring-primary-soft focus-visible:outline-none xl:min-h-30 xl:px-8 xl:pt-8 xl:pb-7 [&::-webkit-details-marker]:hidden">
            <span class="min-w-0 flex-1">
              <span class="block text-base font-semibold xl:text-xl">{{ faq.question }}</span>
              <span class="mt-1 block text-sm text-muted xl:text-[0.9375rem]">{{ faq.summary }}</span>
            </span>
            <Icon name="lucide:plus" class="mt-0.5 size-5 shrink-0 text-primary transition-transform group-open:rotate-45 xl:mt-1 xl:mr-1.5" />
          </summary>
          <p class="-mt-1 px-5 pb-5 text-sm leading-relaxed xl:px-8 xl:pb-6 xl:text-base">
            {{ faq.answer }}
          </p>
        </details>
      </li>
    </ul>
  </section>
</template>
