<script setup lang="ts">
import type { MemberNotification } from '~/types/notification'

definePageMeta({ middleware: 'auth', hideMobileTabBar: true, hideSiteChromeOnMobile: true })

useSeoMeta({
  title: 'การแจ้งเตือน · YoyoPet'
})

const NuxtLink = resolveComponent('NuxtLink')
const router = useRouter()
const { notifications, unreadCount, isLoading, error, refresh, markAsRead, markAllAsRead } = useNotifications()

const activeFilter = ref<NotificationFilter>('all')
const now = new Date()

const visibleNotifications = computed(() =>
  activeFilter.value === 'all'
    ? notifications.value
    : notifications.value.filter(notification => notification.category === activeFilter.value)
)

const notificationGroups = computed(() => {
  const isFromToday = (notification: MemberNotification) => isSameLocalDay(new Date(notification.createdAt), now)
  return [
    { label: 'วันนี้', items: visibleNotifications.value.filter(isFromToday) },
    { label: 'ก่อนหน้านี้', items: visibleNotifications.value.filter(notification => !isFromToday(notification)) }
  ].filter(group => group.items.length > 0)
})

function openNotification(notification: MemberNotification) {
  if (!notification.isRead) markAsRead(notification.id)
}

// Opened straight from a push or shared link there is no in-app page to return to
function goBack() {
  if (window.history.state?.back) router.back()
  else navigateTo('/')
}
</script>

<template>
  <div class="pb-10 md:page-container md:pt-5 md:pb-16 xl:pt-9">
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
          แจ้งเตือน
        </h1>
        <button
          type="button"
          :disabled="unreadCount === 0"
          class="absolute right-0 text-sm font-semibold text-primary disabled:text-muted/60"
          @click="markAllAsRead"
        >
          อ่านทั้งหมด
        </button>
      </div>
    </header>

    <div class="max-md:hidden">
      <PageBreadcrumb current-label="การแจ้งเตือน" />
      <div class="mt-3 flex max-w-3xl items-end justify-between gap-4 xl:mt-4">
        <h1 class="text-[1.75rem] leading-tight xl:text-[3.5rem]">
          การแจ้งเตือน
        </h1>
        <button
          type="button"
          :disabled="unreadCount === 0"
          class="mb-1 shrink-0 text-base font-semibold text-primary-dark hover:underline disabled:text-muted/60 disabled:no-underline xl:text-lg"
          @click="markAllAsRead"
        >
          อ่านทั้งหมด
        </button>
      </div>
    </div>

    <div class="md:mt-6 md:max-w-3xl xl:mt-8">
      <div role="group" aria-label="กรองการแจ้งเตือน" class="flex gap-2 overflow-x-auto px-4 py-3 scrollbar-none md:px-0 md:py-0">
        <button
          v-for="filter in notificationFilters"
          :key="filter.value"
          type="button"
          :aria-pressed="activeFilter === filter.value"
          class="flex h-9 shrink-0 items-center gap-1.5 rounded-full border px-4 text-sm transition-colors xl:h-11 xl:px-5 xl:text-base"
          :class="activeFilter === filter.value
            ? 'border-primary bg-primary font-semibold text-white'
            : 'bg-white hover:border-primary hover:text-primary'"
          @click="activeFilter = filter.value"
        >
          {{ filter.label }}
          <span
            v-if="filter.value === 'all' && unreadCount > 0"
            class="flex h-5 min-w-5 items-center justify-center rounded-full px-1.5 font-number text-xs"
            :class="activeFilter === filter.value ? 'bg-white/25' : 'bg-primary text-white'"
          >
            {{ unreadCount }}
            <span class="sr-only">รายการที่ยังไม่ได้อ่าน</span>
          </span>
        </button>
      </div>

      <div v-if="isLoading && notifications.length === 0" class="flex justify-center py-16" role="status">
        <Icon name="lucide:loader-circle" class="size-6 animate-spin text-muted" />
        <span class="sr-only">กำลังโหลดการแจ้งเตือน</span>
      </div>

      <div v-else-if="error" class="px-4 py-16 text-center md:px-0">
        <p class="text-sm text-muted">
          โหลดการแจ้งเตือนไม่สำเร็จ
        </p>
        <button type="button" class="mt-3 text-sm font-semibold text-primary-dark hover:underline" @click="refresh()">
          ลองอีกครั้ง
        </button>
      </div>

      <div v-else-if="notificationGroups.length === 0" class="flex flex-col items-center px-4 py-16 text-center md:px-0">
        <span class="flex size-14 items-center justify-center rounded-full bg-cream text-muted" aria-hidden="true">
          <Icon name="lucide:bell-off" class="size-6" />
        </span>
        <p class="mt-3 text-sm text-muted">
          ยังไม่มีการแจ้งเตือนในหมวดนี้
        </p>
      </div>

      <template v-else>
        <section
        v-for="group in notificationGroups"
        :key="group.label"
        :aria-label="group.label"
        class="mt-1 md:mt-6"
      >
        <h2 class="px-4 pt-2 pb-2 font-sans text-sm font-semibold md:px-0 xl:text-base">
          {{ group.label }}
        </h2>
        <ul class="md:space-y-1">
          <li v-for="notification in group.items" :key="notification.id" class="group">
            <component
              :is="notification.linkUrl ? NuxtLink : 'button'"
              :to="notification.linkUrl ?? undefined"
              :type="notification.linkUrl ? undefined : 'button'"
              class="flex w-full items-center gap-3 px-4 text-left transition-colors md:rounded-2xl xl:gap-4 xl:px-5"
              :class="notification.isRead ? 'hover:bg-cream' : 'bg-primary-soft/40 hover:bg-primary-soft/70'"
              @click="openNotification(notification)"
            >
              <span
                class="flex size-10 shrink-0 items-center justify-center rounded-full xl:size-12"
                :class="notificationAppearanceByKind[notification.kind].iconClass"
                aria-hidden="true"
              >
                <Icon :name="notificationAppearanceByKind[notification.kind].icon" class="size-5 xl:size-6" />
              </span>
              <span
                class="flex min-h-16 min-w-0 flex-1 items-center gap-3 py-3 xl:min-h-19"
                :class="notification.isRead && 'border-b group-last:border-b-0 md:border-b-0'"
              >
                <span class="min-w-0 flex-1">
                  <span class="block text-[0.9375rem] leading-snug xl:text-base">{{ notification.title }}</span>
                  <span class="mt-0.5 block truncate text-xs text-muted xl:text-sm">
                    {{ notification.body }} · {{ formatNotificationTime(notification.createdAt, now) }}
                  </span>
                </span>
                <span v-if="!notification.isRead" class="size-2.5 shrink-0 rounded-full bg-primary">
                  <span class="sr-only">ยังไม่ได้อ่าน</span>
                </span>
              </span>
            </component>
          </li>
        </ul>
      </section>
      </template>
    </div>
  </div>
</template>
