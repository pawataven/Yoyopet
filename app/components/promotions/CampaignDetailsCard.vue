<script setup lang="ts">
const props = defineProps<{
  highlights: string[]
  title: string
}>()

const { copiedKey, copy } = useClipboardCopy()
const isLinkCopied = computed(() => copiedKey.value !== null)

async function shareCampaign() {
  const url = window.location.href
  if (navigator.share) {
    try {
      await navigator.share({ title: props.title, url })
      return
    } catch (error) {
      // AbortError means the member closed the share sheet on purpose; anything else falls back to copying
      if (error instanceof DOMException && error.name === 'AbortError') return
    }
  }
  await copy(url)
}
</script>

<template>
  <section aria-labelledby="campaign-details-heading" class="flex flex-col rounded-[1.25rem] border bg-white p-5 xl:px-9 xl:pt-8 xl:pb-10">
    <h2 id="campaign-details-heading" class="text-xl leading-tight xl:text-[1.625rem]">
      รายละเอียดแคมเปญ
    </h2>
    <ul class="mt-3 space-y-2.5 text-sm xl:mt-4 xl:space-y-0 xl:text-lg">
      <li v-for="highlight in highlights" :key="highlight" class="flex items-start gap-3 xl:min-h-12 xl:items-center">
        <Icon name="lucide:check" class="mt-0.5 size-4.5 shrink-0 text-success xl:mt-0 xl:size-5" />
        {{ highlight }}
      </li>
    </ul>

    <div class="mt-5 grid grid-cols-2 gap-3 xl:mt-auto xl:flex xl:gap-5 xl:pt-8">
      <NuxtLink
        to="/orders/submit"
        class="flex h-12 items-center justify-center rounded-xl bg-primary px-4 text-sm font-semibold text-white transition-colors hover:bg-primary-dark xl:h-13 xl:w-65 xl:text-base"
      >
        กรอกเลขออเดอร์
      </NuxtLink>
      <button
        type="button"
        class="flex h-12 items-center justify-center gap-2 rounded-xl border-2 border-primary bg-white px-4 text-sm font-semibold text-primary-dark transition-colors hover:bg-primary-soft xl:h-13 xl:w-55 xl:text-base"
        @click="shareCampaign"
      >
        <Icon v-if="isLinkCopied" name="lucide:check" class="size-4 shrink-0" />
        {{ isLinkCopied ? 'คัดลอกลิงก์แล้ว' : 'แชร์แคมเปญ' }}
      </button>
      <span class="sr-only" aria-live="polite">{{ isLinkCopied ? 'คัดลอกลิงก์แคมเปญแล้ว' : '' }}</span>
    </div>
  </section>
</template>
