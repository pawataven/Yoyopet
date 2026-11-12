<script setup lang="ts">
import type { NotificationChannel, NotificationPreferences, NotificationTopic } from '~/types/member'

definePageMeta({ middleware: 'auth', hideMobileTabBar: true, hideSiteChromeOnMobile: true })

useSeoMeta({
  title: 'ตั้งค่าการแจ้งเตือน · YoyoPet'
})

interface TopicRow {
  topic: NotificationTopic
  icon: string
  label: string
  description: string
}

const { lineOfficialAccount } = useAppConfig()
const { preferences, savePreferences } = useNotificationPreferences()
const { consents } = useMemberConsents()
const { dashboard } = useMemberDashboard()

const topicRows: TopicRow[] = [
  { topic: 'pointsAndOrders', icon: 'lucide:star', label: 'แต้มและคำสั่งซื้อ', description: 'อนุมัติ · ไม่ผ่าน · แต้มเข้า' },
  { topic: 'redemptionAndShipping', icon: 'lucide:truck', label: 'การแลกและจัดส่ง', description: 'แลกสำเร็จ · เลขพัสดุ · ยกเลิก' },
  { topic: 'expiry', icon: 'lucide:clock', label: 'ใกล้หมดอายุ', description: 'แต้มและคูปองก่อนหมด 30 วัน' },
  { topic: 'tierAndTopSpender', icon: 'lucide:crown', label: 'ระดับสมาชิกและ Top Spender', description: 'เลื่อนระดับ · ประกาศผล' },
  { topic: 'promotions', icon: 'lucide:gift', label: 'โปรโมชันและข่าวสาร', description: 'ส่วนลดและกิจกรรมพิเศษ' }
]

const channelColumns: { channel: NotificationChannel, label: string }[] = [
  { channel: 'line', label: 'LINE' },
  { channel: 'web', label: 'เว็บ' }
]

const draft = ref<NotificationPreferences | null>(null)
watch(preferences, (saved) => {
  draft.value = saved ? structuredClone(toRaw(saved)) : null
}, { immediate: true })

// LINE can only push to members who follow the official account
const isLineAvailable = computed(() => dashboard.value?.isLineOfficialAccountFriend === true)
const hasMarketingConsent = computed(() => consents.value?.marketing.granted === true)

function isChannelAvailable(topic: NotificationTopic, channel: NotificationChannel) {
  if (channel === 'line' && !isLineAvailable.value) return false
  if (topic === 'promotions' && !hasMarketingConsent.value) return false
  return true
}

function topicDescription(row: TopicRow) {
  return row.topic === 'promotions' && !hasMarketingConsent.value ? 'ต้องยินยอมรับข่าวสารก่อน' : row.description
}

type SaveStatus = 'idle' | 'saving' | 'saved' | 'error'
const saveStatus = ref<SaveStatus>('idle')

watch(draft, () => {
  if (saveStatus.value !== 'saving') saveStatus.value = 'idle'
}, { deep: true })

async function handleSave() {
  if (!draft.value) return
  saveStatus.value = 'saving'
  try {
    await savePreferences(structuredClone(toRaw(draft.value)))
    saveStatus.value = 'saved'
  } catch {
    saveStatus.value = 'error'
  }
}

function openAddFriend() {
  window.open(lineOfficialAccount.addFriendUrl, '_blank', 'noopener')
}
</script>

<template>
  <div class="md:page-container md:pt-5 md:pb-16 xl:pt-9">
    <MobilePageHeader title="ตั้งค่าการแจ้งเตือน" fallback-path="/account" />

    <div class="max-md:hidden">
      <PageBreadcrumb current-label="ตั้งค่าการแจ้งเตือน" />
      <h1 class="mt-3 text-[1.75rem] leading-tight xl:mt-4 xl:text-[3.5rem]">
        ตั้งค่าการแจ้งเตือน
      </h1>
    </div>

    <div class="px-4 pt-4 pb-[calc(2rem+env(safe-area-inset-bottom))] md:mt-6 md:max-w-2xl md:px-0 xl:mt-8">
      <div
        v-if="isLineAvailable"
        class="flex items-center gap-3 rounded-2xl bg-success/10 px-4 py-3.5"
      >
        <span class="flex size-11 shrink-0 items-center justify-center rounded-xl bg-line-green font-number text-xs font-semibold text-white" aria-hidden="true">LINE</span>
        <div class="min-w-0 flex-1">
          <p class="text-[0.9375rem] font-semibold text-success">
            เชื่อม LINE แล้ว
          </p>
          <p class="text-xs text-muted">
            เป็นเพื่อน {{ lineOfficialAccount.name }} ({{ lineOfficialAccount.lineId }}) แล้ว
          </p>
        </div>
        <Icon name="lucide:check" class="size-5 shrink-0 text-success" aria-hidden="true" />
      </div>
      <div v-else class="flex items-center gap-3 rounded-2xl border bg-white px-4 py-3.5">
        <span class="flex size-11 shrink-0 items-center justify-center rounded-xl bg-line-green font-number text-xs font-semibold text-white" aria-hidden="true">LINE</span>
        <div class="min-w-0 flex-1">
          <p class="text-[0.9375rem] font-semibold">
            ยังไม่ได้เพิ่มเพื่อนใน LINE
          </p>
          <p class="text-xs text-muted">
            เพิ่ม {{ lineOfficialAccount.name }} ({{ lineOfficialAccount.lineId }}) เพื่อรับแจ้งเตือนทาง LINE
          </p>
        </div>
        <button
          type="button"
          class="h-9 shrink-0 rounded-full bg-line-green px-4 text-sm font-semibold text-white transition-opacity hover:opacity-90"
          @click="openAddFriend"
        >
          เพิ่มเพื่อน
        </button>
      </div>

      <div v-if="!draft" class="flex justify-center py-16" role="status">
        <Icon name="lucide:loader-circle" class="size-6 animate-spin text-muted" />
        <span class="sr-only">กำลังโหลดการตั้งค่า</span>
      </div>

      <form v-else novalidate class="mt-5" @submit.prevent="handleSave">
        <div class="grid grid-cols-[minmax(0,1fr)_3.5rem_3.5rem] items-end pr-2.5 pl-1 pb-2 text-sm font-semibold" aria-hidden="true">
          <span>เรื่องที่แจ้ง</span>
          <span v-for="column in channelColumns" :key="column.channel" class="text-center text-xs">{{ column.label }}</span>
        </div>

        <ul class="divide-y rounded-2xl border bg-white">
          <li
            v-for="row in topicRows"
            :key="row.topic"
            class="grid min-h-17 grid-cols-[minmax(0,1fr)_3.5rem_3.5rem] items-center py-3 pr-1.5 pl-3"
          >
            <div class="flex min-w-0 items-center gap-3">
              <span class="flex size-9 shrink-0 items-center justify-center rounded-full bg-primary-soft text-primary" aria-hidden="true">
                <Icon :name="row.icon" class="size-4.5" />
              </span>
              <div class="min-w-0">
                <p class="text-[0.9375rem] leading-snug">
                  {{ row.label }}
                </p>
                <p class="mt-0.5 text-xs text-muted">
                  {{ topicDescription(row) }}
                </p>
              </div>
            </div>
            <div v-for="column in channelColumns" :key="column.channel" class="flex justify-center">
              <ToggleSwitch
                :model-value="isChannelAvailable(row.topic, column.channel) && draft.topics[row.topic][column.channel]"
                :disabled="!isChannelAvailable(row.topic, column.channel)"
                :aria-label="`${row.label} ทาง${column.label}`"
                @update:model-value="draft.topics[row.topic][column.channel] = $event"
              />
            </div>
          </li>
        </ul>

        <aside class="mt-5 flex gap-3 rounded-2xl bg-cream px-4 py-3.5 text-xs leading-relaxed text-muted">
          <Icon name="lucide:info" class="mt-0.5 size-4.5 shrink-0" aria-hidden="true" />
          <p>
            แจ้งเตือนเรื่องบัญชีและความปลอดภัยปิดไม่ได้<br>
            โปรโมชันจะส่งเมื่อเปิดสวิตช์และยินยอมรับข่าวสาร
            <NuxtLink to="/settings/privacy" class="font-semibold text-primary hover:underline">ในหน้า ความยินยอมและความเป็นส่วนตัว</NuxtLink>
          </p>
        </aside>

        <p v-if="saveStatus === 'saved' || saveStatus === 'error'" role="status" class="mt-4 text-center text-sm" :class="saveStatus === 'error' ? 'text-primary-dark' : 'text-success'">
          {{ saveStatus === 'error' ? 'บันทึกไม่สำเร็จ กรุณาลองอีกครั้ง' : 'บันทึกการตั้งค่าแล้ว' }}
        </p>

        <button
          type="submit"
          :disabled="saveStatus === 'saving'"
          class="mt-5 flex h-12 w-full items-center justify-center gap-2 rounded-full bg-primary text-[0.9375rem] font-semibold text-white transition-colors hover:bg-primary-dark disabled:opacity-60"
        >
          <Icon v-if="saveStatus === 'saving'" name="lucide:loader-circle" class="size-5 animate-spin" />
          บันทึก
        </button>
      </form>
    </div>
  </div>
</template>
