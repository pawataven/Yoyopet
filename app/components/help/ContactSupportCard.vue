<script setup lang="ts">
const { supportChat } = useAppConfig()
</script>

<template>
  <section aria-labelledby="contact-support-heading" class="mt-8 flex flex-col gap-4 rounded-[1.25rem] border bg-white p-5 sm:flex-row sm:items-center xl:mt-10 xl:min-h-34 xl:gap-7.5 xl:py-4 xl:pr-8 xl:pl-9">
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
</template>
