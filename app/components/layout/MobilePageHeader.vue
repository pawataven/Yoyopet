<script setup lang="ts">
const { title, fallbackPath = '/' } = defineProps<{
  title: string
  fallbackPath?: string
}>()

const router = useRouter()

// Opened straight from a push or shared link there is no in-app page to return to
function goBack() {
  if (window.history.state?.back) router.back()
  else navigateTo(fallbackPath)
}
</script>

<template>
  <header class="sticky top-0 z-20 border-b bg-white px-4 pt-[calc(0.75rem+env(safe-area-inset-top))] pb-3 md:hidden">
    <div class="relative flex h-11 items-center justify-center">
      <button
        type="button"
        aria-label="ย้อนกลับ"
        class="absolute left-0 flex size-10 items-center justify-center rounded-full bg-cream transition-colors hover:bg-primary-soft"
        @click="goBack"
      >
        <Icon name="lucide:chevron-left" class="size-5.5" />
      </button>
      <h1 class="text-lg">
        {{ title }}
      </h1>
      <div v-if="$slots.action" class="absolute right-0">
        <slot name="action" />
      </div>
    </div>
  </header>
</template>
