<script setup lang="ts">
const props = defineProps<{
  orderId: string | null
}>()

const isOpen = defineModel<boolean>('open', { required: true })

const { orderDetail, isLoading } = useSubmittedOrderDetail(() => props.orderId)
const { marketplaceStores, supportChat } = useAppConfig()

const headingId = useId()
const closeButton = useTemplateRef<HTMLButtonElement>('closeButton')

const marketplaceStore = computed(() => marketplaceStores.find(store => store.id === orderDetail.value?.marketplaceId))
const statusBadge = computed(() => orderDetail.value && getSubmittedOrderStatusBadge(orderDetail.value))
const timelineSteps = computed(() => orderDetail.value ? buildOrderTimeline(orderDetail.value, marketplaceStore.value?.name ?? '') : [])

const pointsLabel = computed(() => {
  const order = orderDetail.value
  if (!order) return ''
  const label = order.status === 'approved' ? 'แต้มที่ได้' : 'แต้มที่จะได้'
  return order.pointsMultiplier && order.pointsMultiplier !== 1 ? `${label} (x${formatNumber(order.pointsMultiplier)})` : label
})

const timelineMarkerClass: Record<OrderTimelineStepState, string> = {
  done: 'bg-success text-white',
  current: 'border-2 border-pending bg-white',
  upcoming: 'border-2 border-border bg-white',
  failed: 'bg-primary text-white'
}

const summaryRowClass = 'flex items-center justify-between gap-4'
</script>

<template>
  <ModalDialog
    v-model:open="isOpen"
    :aria-labelledby="headingId"
    class="max-w-228"
    @opened="closeButton?.focus()"
  >
    <template #close>
      <button
        ref="closeButton"
        type="button"
        aria-label="ปิด"
        class="absolute top-4 right-4 flex size-9 items-center justify-center rounded-full bg-border text-ink transition-colors hover:bg-primary-soft focus-visible:ring-4 focus-visible:ring-primary-soft focus-visible:outline-none sm:top-6 sm:right-6 sm:size-10"
        @click="isOpen = false"
      >
        <Icon name="lucide:x" class="size-4.5 sm:size-5" />
      </button>
    </template>
    <div class="relative px-5 pt-6 pb-6 sm:px-11 sm:pt-11 sm:pb-9">
      <template v-if="orderDetail">
        <header class="flex items-center gap-3 pr-12 sm:gap-4">
          <img
            v-if="marketplaceStore"
            :src="marketplaceStore.logoUrl"
            alt=""
            width="64"
            height="64"
            class="size-12 shrink-0 rounded-xl sm:size-16"
          >
          <div class="min-w-0">
            <h2 :id="headingId" class="text-lg leading-tight sm:text-[1.75rem]">
              {{ marketplaceStore?.name }}
            </h2>
            <p class="truncate text-sm text-muted sm:text-base">
              <span class="sr-only">เลขคำสั่งซื้อ </span>#{{ orderDetail.orderNumber }}
            </p>
          </div>
          <span
            v-if="statusBadge"
            class="inline-flex h-6 shrink-0 items-center self-end rounded-full px-3 text-xs font-semibold whitespace-nowrap sm:h-8 sm:px-4 sm:text-sm"
            :class="statusBadge.class"
          >
            {{ statusBadge.label }}
          </span>
        </header>

        <dl class="mt-5 grid gap-x-10 gap-y-3 border-t pt-5 text-sm sm:mt-6 sm:grid-cols-2 sm:gap-y-4 sm:pt-6 sm:text-base">
          <div :class="summaryRowClass">
            <dt class="text-muted">
              วันที่สั่งซื้อ
            </dt>
            <dd class="font-semibold">
              {{ orderDetail.orderedAt ? formatThaiShortDate(orderDetail.orderedAt) : '–' }}
            </dd>
          </div>
          <div :class="summaryRowClass">
            <dt class="text-muted">
              วันที่ส่งเลข
            </dt>
            <dd class="font-semibold">
              {{ formatThaiShortDate(orderDetail.submittedAt) }}
            </dd>
          </div>
          <div :class="summaryRowClass">
            <dt class="text-muted">
              ยอดซื้อ
            </dt>
            <dd class="font-semibold">
              {{ orderDetail.spendBaht !== null ? `${formatNumber(orderDetail.spendBaht)} บาท` : '–' }}
            </dd>
          </div>
          <div :class="summaryRowClass">
            <dt class="text-muted">
              {{ pointsLabel }}
            </dt>
            <dd v-if="orderDetail.points" class="font-semibold text-success">
              +<span class="font-number">{{ formatNumber(orderDetail.points) }}</span> แต้ม
            </dd>
            <dd v-else class="font-semibold">
              –
            </dd>
          </div>
        </dl>

        <section v-if="orderDetail.items.length" aria-labelledby="order-detail-items-heading" class="mt-6 border-b pb-5 sm:mt-9 sm:pb-6">
          <h3 id="order-detail-items-heading" class="text-base sm:text-xl">
            สินค้าในคำสั่งซื้อ
          </h3>
          <ul class="mt-3 space-y-3 sm:mt-4 sm:space-y-4">
            <li v-for="item in orderDetail.items" :key="item.id" class="flex items-center gap-3 text-sm sm:gap-5 sm:text-base">
              <NuxtImg
                v-if="item.imageUrl"
                :src="item.imageUrl"
                alt=""
                width="648"
                height="432"
                sizes="96px"
                loading="lazy"
                class="size-14 shrink-0 rounded-lg object-cover sm:size-20"
              />
              <span v-else class="flex size-14 shrink-0 items-center justify-center rounded-lg bg-cream text-muted sm:size-20" aria-hidden="true">
                <Icon name="lucide:package" class="size-6" />
              </span>
              <span class="min-w-0 flex-1">{{ item.name }} × {{ formatNumber(item.quantity) }}</span>
              <span class="shrink-0 font-semibold">{{ formatNumber(item.totalBaht) }} บาท</span>
            </li>
          </ul>
        </section>

        <section aria-labelledby="order-detail-status-heading" :class="orderDetail.items.length ? 'mt-5 sm:mt-6' : 'mt-6 border-t pt-5 sm:mt-9 sm:pt-6'">
          <h3 id="order-detail-status-heading" class="text-base sm:text-xl">
            สถานะ
          </h3>
          <ol class="mt-3 sm:mt-4">
            <li
              v-for="(step, index) in timelineSteps"
              :key="step.title"
              class="relative flex gap-3 pb-4 last:pb-0 sm:gap-4 sm:pb-5"
              :aria-current="step.state === 'current' ? 'step' : undefined"
            >
              <span
                v-if="index < timelineSteps.length - 1"
                class="absolute top-6 bottom-0 left-2.75 w-0.5 sm:top-7 sm:left-3.25"
                :class="step.state === 'done' ? 'bg-success' : 'bg-border'"
                aria-hidden="true"
              />
              <span
                class="relative flex size-6 shrink-0 items-center justify-center rounded-full sm:size-7"
                :class="timelineMarkerClass[step.state]"
                aria-hidden="true"
              >
                <Icon v-if="step.state === 'done'" name="lucide:check" class="size-3.5 sm:size-4" />
                <Icon v-else-if="step.state === 'failed'" name="lucide:x" class="size-3.5 sm:size-4" />
                <span v-else-if="step.state === 'current'" class="size-2.5 rounded-full bg-pending sm:size-3" />
              </span>
              <div class="min-w-0 pt-0.5">
                <p class="text-sm sm:text-base" :class="step.state === 'upcoming' ? 'text-muted' : 'font-semibold'">
                  {{ step.title }}
                </p>
                <p v-if="step.caption" class="mt-0.5 text-xs text-muted sm:text-sm">
                  {{ step.caption }}
                </p>
              </div>
            </li>
          </ol>
        </section>

        <a
          :href="supportChat.url"
          target="_blank"
          rel="noopener noreferrer"
          class="mt-6 flex h-12 items-center justify-center rounded-xl border-2 border-primary bg-white text-base font-semibold text-primary-dark transition-colors hover:bg-primary-soft sm:mt-8 sm:h-14 sm:text-lg"
        >
          แจ้งปัญหาเกี่ยวกับรายการนี้
        </a>
      </template>

      <div v-else class="flex min-h-60 flex-col items-center justify-center gap-3 text-muted">
        <h2 :id="headingId" class="sr-only">
          รายละเอียดคำสั่งซื้อ
        </h2>
        <Icon v-if="isLoading" name="lucide:loader-circle" class="size-8 animate-spin" />
        <p v-else>
          ไม่พบรายการนี้
        </p>
      </div>
    </div>
  </ModalDialog>
</template>
