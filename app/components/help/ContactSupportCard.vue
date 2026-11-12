<script setup lang="ts">
const { supportChat } = useAppConfig()
</script>

<template>
  <div id="contact-support" class="mt-6 scroll-mt-24 md:mt-8 xl:mt-10 xl:scroll-mt-32">
    <a
      :href="supportChat.url"
      target="_blank"
      rel="noopener noreferrer"
      class="flex items-center gap-3 rounded-2xl border bg-cream px-4 py-3.5 transition-colors hover:bg-primary-soft/60 md:hidden"
    >
      <span class="flex size-11 shrink-0 items-center justify-center rounded-xl bg-line-green font-number text-xs font-semibold text-white" aria-hidden="true">LINE</span>
      <span class="min-w-0 flex-1">
        <span class="block text-[0.9375rem] font-semibold">ยังมีคำถาม? ทักแชทได้เลย</span>
        <span class="mt-0.5 block text-xs text-muted">LINE {{ supportChat.lineId }} · {{ supportChat.hours }}</span>
      </span>
      <Icon name="lucide:chevron-right" class="size-5 shrink-0 text-muted" aria-hidden="true" />
    </a>

    <section aria-labelledby="contact-support-heading" class="flex flex-col gap-4 rounded-[1.25rem] border bg-white p-5 max-md:hidden sm:flex-row sm:items-center xl:min-h-34 xl:gap-7.5 xl:py-4 xl:pr-8 xl:pl-9">
      <span class="flex size-14 shrink-0 items-center justify-center rounded-full bg-primary-soft text-primary-dark xl:size-18" aria-hidden="true">
        <Icon name="lucide:users" class="size-6 xl:size-7" />
      </span>

      <div class="min-w-0 flex-1">
        <h2 id="contact-support-heading" class="font-sans text-lg leading-tight font-semibold xl:text-[1.375rem]">
          ยังมีคำถาม? ทักแชทหาเราได้เลย
        </h2>
        <p class="mt-1 text-sm text-muted xl:text-[0.9375rem]">
          LINE: {{ supportChat.lineId }} · {{ supportChat.hours }}
        </p>
      </div>

      <a
        :href="supportChat.url"
        target="_blank"
        rel="noopener noreferrer"
        class="flex h-11 shrink-0 items-center justify-center rounded-xl bg-line-green px-8 text-sm font-semibold text-white transition-opacity hover:opacity-90 xl:h-14 xl:w-51.5 xl:text-base"
      >
        แชทกับเรา
      </a>
    </section>
  </div>
</template>
