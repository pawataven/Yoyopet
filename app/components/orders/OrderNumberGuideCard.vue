<script setup lang="ts">
import type { MarketplaceId } from '~/types/order'

const selectedMarketplaceId = defineModel<MarketplaceId>('marketplaceId', { required: true })

const { marketplaceStores } = useAppConfig()
const { copiedKey, copy } = useClipboardCopy()

const guidePanelId = useId()
const guide = computed(() => orderNumberGuides[selectedMarketplaceId.value])
const selectedStoreName = computed(() => marketplaceStores.find(store => store.id === selectedMarketplaceId.value)?.name ?? '')

const rowClass = 'flex items-center justify-between gap-4 text-sm xl:text-[1.0625rem]'
</script>

<template>
  <section aria-labelledby="order-number-guide-heading" class="rounded-[1.5rem] border bg-white p-5 xl:p-8">
    <h2 id="order-number-guide-heading" class="text-base xl:text-[1.375rem]">
      หาเลขคำสั่งซื้อได้ที่ไหน
    </h2>

    <div role="tablist" aria-label="ช่องทางที่ซื้อ" class="mt-3 flex flex-wrap gap-2 xl:mt-4">
      <button
        v-for="store in marketplaceStores"
        :key="store.id"
        type="button"
        role="tab"
        :aria-selected="store.id === selectedMarketplaceId"
        :aria-controls="guidePanelId"
        class="h-9 rounded-full border px-4 text-xs font-semibold transition-colors xl:h-10 xl:min-w-32 xl:px-6 xl:text-[0.9375rem]"
        :class="store.id === selectedMarketplaceId ? 'border-ink bg-ink text-white' : 'bg-white hover:border-primary/40 hover:bg-cream'"
        @click="selectedMarketplaceId = store.id as MarketplaceId"
      >
        {{ store.name }}
      </button>
    </div>

    <div
      :id="guidePanelId"
      role="tabpanel"
      :aria-label="'ตัวอย่างหน้าคำสั่งซื้อ ' + selectedStoreName"
      class="mt-4 xl:mt-5"
    >
      <div class="px-1 xl:px-2">
        <div :class="rowClass">
          <span class="font-semibold xl:text-lg">หมายเลขคำสั่งซื้อ</span>
          <span class="flex min-w-0 items-center gap-2">
            <span class="truncate font-number font-semibold">{{ guide.sampleOrderNumber }}</span>
            <button
              type="button"
              class="shrink-0 rounded-md border border-muted/40 px-2 py-0.5 text-xs transition-colors hover:bg-cream xl:text-[0.9375rem]"
              @click="copy(guide.sampleOrderNumber)"
            >
              {{ copiedKey === guide.sampleOrderNumber ? 'คัดลอกแล้ว' : 'คัดลอก' }}
            </button>
          </span>
        </div>
        <dl class="mt-3 space-y-2 text-muted xl:mt-5">
          <div v-for="field in guide.sampleDetails" :key="field.label" :class="rowClass">
            <dt>{{ field.label }}</dt>
            <dd>{{ field.value }}</dd>
          </div>
        </dl>
        <dl class="mt-3 space-y-2 border-t pt-3 text-muted xl:mt-4 xl:space-y-3 xl:pt-4">
          <div v-for="field in guide.sampleTimeline" :key="field.label" :class="rowClass">
            <dt>{{ field.label }}</dt>
            <dd class="tabular-nums">
              {{ field.value }}
            </dd>
          </div>
        </dl>
      </div>

      <ol class="mt-4 space-y-2 xl:mt-6 xl:space-y-3">
        <li v-for="(step, index) in guide.steps" :key="step" class="flex items-center gap-2.5 text-xs xl:gap-3 xl:text-[0.9375rem]">
          <span class="flex size-5 shrink-0 items-center justify-center rounded-full bg-primary-soft font-number text-[0.6875rem] font-semibold text-primary-dark xl:size-6.5 xl:text-xs" aria-hidden="true">
            {{ index + 1 }}
          </span>
          {{ step }}
        </li>
      </ol>
    </div>
  </section>
</template>
