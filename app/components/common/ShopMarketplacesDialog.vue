<script setup lang="ts">
const isOpen = defineModel<boolean>('open', { required: true })

const { marketplaceStores } = useAppConfig()

const headingId = useId()
const storeList = useTemplateRef('storeList')
</script>

<template>
  <ModalDialog
    v-model:open="isOpen"
    :aria-labelledby="headingId"
    class="max-w-lg"
    @opened="storeList?.querySelector('a')?.focus()"
  >
    <div class="relative px-5 pt-6 pb-6 sm:px-8 sm:pt-8 sm:pb-8">
      <button
        type="button"
        aria-label="ปิด"
        class="absolute top-4 right-4 flex size-9 items-center justify-center rounded-full bg-border/60 text-ink transition-colors hover:bg-border sm:top-5 sm:right-5"
        @click="isOpen = false"
      >
        <Icon name="lucide:x" class="size-5" />
      </button>

      <h2 :id="headingId" class="pr-12 text-xl leading-tight sm:text-2xl">
        ช้อปที่ร้าน YoYo
      </h2>
      <p class="mt-1 text-sm text-muted sm:text-base">
        ซื้อช่องทางไหนก็สะสมแต้มได้
      </p>

      <ul ref="storeList" class="mt-5 space-y-3 sm:mt-6">
        <li v-for="store in marketplaceStores" :key="store.id">
          <a
            :href="store.storeUrl"
            target="_blank"
            rel="noopener noreferrer"
            class="group flex items-center gap-4 rounded-2xl border px-4 py-3 transition-colors hover:border-primary/40 hover:bg-cream focus-visible:ring-4 focus-visible:ring-primary-soft focus-visible:outline-none sm:py-3.5"
            @click="isOpen = false"
          >
            <img :src="store.logoUrl" alt="" width="48" height="48" class="size-11 shrink-0 rounded-xl sm:size-12">
            <span class="min-w-0 flex-1">
              <span class="block font-heading text-base font-medium sm:text-lg">{{ store.name }}</span>
              <span class="block text-xs text-muted sm:text-sm">{{ store.storeName }}</span>
            </span>
            <Icon name="lucide:arrow-right" class="size-5 shrink-0 text-primary-dark transition-transform group-hover:translate-x-1" />
          </a>
        </li>
      </ul>

      <p class="mt-5 text-center text-xs text-muted sm:mt-6 sm:text-sm">
        เก็บเลขคำสั่งซื้อไว้กรอกรับแต้มนะ
      </p>
    </div>
  </ModalDialog>
</template>
