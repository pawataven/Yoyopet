<script setup lang="ts">
import type { MemberNotification, NotificationCategory, NotificationKind } from '~/types/notification'

type NotificationFilter = 'all' | NotificationCategory

const notificationFilters: { value: NotificationFilter, label: string }[] = [
  { value: 'all', label: 'ทั้งหมด' },
  { value: 'points', label: 'แต้ม' },
  { value: 'coupon', label: 'คูปอง' },
  { value: 'shipping', label: 'จัดส่ง' }
]

const appearanceByKind: Record<NotificationKind, { icon: string, iconClass: string }> = {
  points_earned: { icon: 'lucide:star', iconClass: 'bg-success/10 text-success' },
  order_rejected: { icon: 'lucide:circle-alert', iconClass: 'bg-primary-soft text-primary-dark' },
  points_expiring: { icon: 'lucide:clock', iconClass: 'bg-gold/25 text-pending' },
  coupon_ready: { icon: 'lucide:cake', iconClass: 'bg-primary-soft text-primary-dark' },
  reward_shipping: { icon: 'lucide:truck', iconClass: 'bg-gold/25 text-pending' },
  tier_progress: { icon: 'lucide:award', iconClass: 'bg-primary-soft text-primary-dark' }
}

const NuxtLink = resolveComponent('NuxtLink')
const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications()
const activeFilter = ref<NotificationFilter>('all')
const rootElement = useTemplateRef<HTMLElement>('root')
const bellButton = useTemplateRef<HTMLButtonElement>('bellButton')
const popoverId = useId()
const { isOpen, toggle: togglePopover, close: closePopover } = usePopover(rootElement, bellButton)

const visibleNotifications = computed(() =>
  activeFilter.value === 'all'
    ? notifications.value
    : notifications.value.filter(notification => notification.category === activeFilter.value)
)

function openNotification(notification: MemberNotification) {
  if (!notification.isRead) markAsRead(notification.id)
  closePopover()
}
</script>

<template>
  <div ref="root" class="relative">
    <button
      ref="bellButton"
      type="button"
      :aria-label="unreadCount > 0 ? `การแจ้งเตือน (ใหม่ ${unreadCount} รายการ)` : 'การแจ้งเตือน'"
      :aria-expanded="isOpen"
      :aria-controls="popoverId"
      class="relative flex size-(--nav-bell-size) shrink-0 items-center justify-center rounded-full bg-white/15 transition-colors hover:bg-white/25"
      :class="isOpen && 'bg-white/25'"
      @click="togglePopover"
    >
      <Icon name="lucide:bell" class="size-(--nav-icon-size)" />
      <span v-if="unreadCount > 0" class="absolute top-[12%] right-[12%] size-[22%] rounded-full bg-gold" />
    </button>

    <Transition
      enter-active-class="transition duration-150 ease-out"
      enter-from-class="-translate-y-1 opacity-0"
      leave-active-class="transition duration-100 ease-in"
      leave-to-class="-translate-y-1 opacity-0"
    >
      <div
        v-if="isOpen"
        :id="popoverId"
        role="dialog"
        aria-label="การแจ้งเตือน"
        class="fixed inset-x-4 top-[calc(var(--nav-height)+0.5rem)] z-50 flex max-h-[calc(100dvh-var(--nav-height)-1.5rem)] flex-col overflow-hidden rounded-[1.25rem] border bg-white text-ink shadow-xl shadow-ink/10 sm:absolute sm:inset-x-auto sm:top-full sm:-right-18 sm:mt-4 sm:w-120"
      >
        <div class="px-5 pt-5 xl:px-7 xl:pt-6">
          <div class="flex items-center justify-between gap-4">
            <h2 class="text-xl leading-tight xl:text-2xl">
              การแจ้งเตือน
            </h2>
            <button
              type="button"
              class="shrink-0 text-sm font-semibold text-primary-dark hover:underline disabled:text-muted disabled:no-underline xl:text-[0.9375rem]"
              :disabled="unreadCount === 0"
              @click="markAllAsRead"
            >
              อ่านทั้งหมดแล้ว
            </button>
          </div>

          <div role="group" aria-label="กรองการแจ้งเตือน" class="mt-3 flex gap-2 overflow-x-auto scrollbar-none xl:gap-2.5">
            <button
              v-for="filter in notificationFilters"
              :key="filter.value"
              type="button"
              :aria-pressed="activeFilter === filter.value"
              class="h-9 shrink-0 rounded-full border px-4 text-sm transition-colors xl:h-11 xl:px-5 xl:text-base"
              :class="activeFilter === filter.value
                ? 'border-primary bg-primary font-semibold text-white'
                : 'bg-white hover:border-primary hover:text-primary'"
              @click="activeFilter = filter.value"
            >
              {{ filter.label }}
            </button>
          </div>
        </div>

        <ul v-if="visibleNotifications.length" class="mt-4 min-h-0 flex-1 space-y-2 overflow-y-auto overscroll-contain px-2 pb-3 xl:mt-5 xl:px-3 xl:pb-4">
          <li v-for="notification in visibleNotifications" :key="notification.id">
            <component
              :is="notification.linkUrl ? NuxtLink : 'button'"
              :to="notification.linkUrl ?? undefined"
              :type="notification.linkUrl ? undefined : 'button'"
              class="flex min-h-18 w-full items-center gap-3 rounded-2xl px-3 py-3 text-left transition-colors xl:min-h-20 xl:gap-4 xl:px-4"
              :class="notification.isRead ? 'hover:bg-cream' : 'bg-cream hover:bg-primary-soft/60'"
              @click="openNotification(notification)"
            >
              <span
                class="flex size-10 shrink-0 items-center justify-center rounded-full xl:size-12"
                :class="appearanceByKind[notification.kind].iconClass"
              >
                <Icon :name="appearanceByKind[notification.kind].icon" class="size-5 xl:size-6" />
              </span>
              <span class="min-w-0 flex-1">
                <span class="block text-sm font-semibold xl:text-base">{{ notification.title }}</span>
                <span class="mt-0.5 block truncate text-xs text-muted xl:mt-1 xl:text-[0.9375rem]">{{ notification.body }}</span>
              </span>
              <span class="flex shrink-0 flex-col items-end gap-2 self-stretch py-0.5">
                <span class="text-xs whitespace-nowrap text-muted xl:text-[0.8125rem]">{{ formatRelativeTimeThai(notification.createdAt) }}</span>
                <span v-if="!notification.isRead" class="mt-auto mb-1 size-2.5 rounded-full bg-primary">
                  <span class="sr-only">ยังไม่ได้อ่าน</span>
                </span>
              </span>
            </component>
          </li>
        </ul>
        <p v-else class="px-5 py-12 text-center text-sm text-muted">
          ยังไม่มีการแจ้งเตือนในหมวดนี้
        </p>

        <NuxtLink
          to="/notifications"
          class="flex h-12 shrink-0 items-center justify-center border-t text-sm font-semibold text-primary-dark transition-colors hover:bg-cream xl:h-12.5 xl:text-base"
        >
          ดูการแจ้งเตือนทั้งหมด
        </NuxtLink>
      </div>
    </Transition>
  </div>
</template>
