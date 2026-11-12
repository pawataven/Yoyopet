<script setup lang="ts">
import type { ConsentHistoryEntry, ConsentPurpose, ConsentStatus } from '~/types/member'

definePageMeta({ middleware: 'auth', hideMobileTabBar: true, hideSiteChromeOnMobile: true })

useSeoMeta({
  title: 'ความยินยอมและความเป็นส่วนตัว · YoyoPet'
})

// Thai PDPA gives controllers 30 days to answer access and erasure requests
const PRIVACY_REQUEST_DAYS = 30

const { member } = useMember()
const { profile } = useMemberProfile()
const { consents, setConsent } = useMemberConsents()
const { history, isLoading: isHistoryLoading, hasLoaded: hasHistoryLoaded, load: loadHistory } = useConsentHistory()
const { privacyRequests, requestDataExport, requestAccountDeletion } = usePrivacyRequests()

const consentLabels: Record<ConsentPurpose, string> = {
  marketing: 'รับข่าวสารและโปรโมชัน',
  petData: 'ใช้ข้อมูลสัตว์เลี้ยงแนะนำสินค้า'
}

const consentRows: { purpose: ConsentPurpose, icon: string, title: string, ifWithdrawn: string, ifGranted: string }[] = [
  {
    purpose: 'marketing',
    icon: 'lucide:bell',
    title: 'ยินยอมรับข่าวสารและโปรโมชัน',
    ifWithdrawn: 'ถ้าถอน: จะไม่ได้รับโปรโมชันทาง LINE และเว็บ แต่ยังได้แจ้งเตือนแต้มและการแลกตามปกติ',
    ifGranted: 'ถ้ายินยอม: เปิดรับโปรโมชันได้ในหน้าตั้งค่าการแจ้งเตือน'
  },
  {
    purpose: 'petData',
    icon: 'lucide:paw-print',
    title: 'ยินยอมให้ใช้ข้อมูลสัตว์เลี้ยงแนะนำสินค้า',
    ifWithdrawn: 'ถ้าถอน: จะไม่ได้รับสินค้าแนะนำตามข้อมูลน้อง แต่ข้อมูลน้องยังอยู่ครบ',
    ifGranted: 'ถ้ายินยอม: ระบบจะแนะนำสินค้าที่เหมาะกับน้องของคุณ'
  }
]

const consentError = ref('')
const pendingPurpose = ref<ConsentPurpose | null>(null)

function consentStatusLine(status: ConsentStatus) {
  if (!status.updatedAt) return 'ยังไม่ได้ให้ความยินยอม'
  const answeredOn = formatThaiShortDate(status.updatedAt)
  return status.granted ? `ยินยอมเมื่อ ${answeredOn} · ถอนได้ทุกเมื่อ` : `ถอนเมื่อ ${answeredOn} · ยินยอมใหม่ได้ทุกเมื่อ`
}

async function handleConsentChange(purpose: ConsentPurpose, granted: boolean) {
  consentError.value = ''
  pendingPurpose.value = purpose
  try {
    await setConsent(purpose, granted)
  } catch {
    consentError.value = 'บันทึกความยินยอมไม่สำเร็จ กรุณาลองอีกครั้ง'
  } finally {
    pendingPurpose.value = null
  }
}

const isHistoryOpen = ref(false)
const historyListId = useId()

function toggleHistory() {
  isHistoryOpen.value = !isHistoryOpen.value
  if (isHistoryOpen.value && !hasHistoryLoaded.value) loadHistory()
}

function historyEntryLabel(entry: ConsentHistoryEntry) {
  return `${entry.granted ? 'ให้ความยินยอม' : 'ถอนความยินยอม'} · ${consentLabels[entry.purpose]}`
}

function addDays(isoDate: string, days: number) {
  const date = new Date(isoDate)
  date.setDate(date.getDate() + days)
  return date.toISOString()
}

const isRequestingExport = ref(false)
const exportError = ref('')

const dataExportStatusLine = computed(() => {
  const requestedAt = privacyRequests.value?.dataExportRequestedAt
  if (requestedAt) return `ส่งคำขอแล้ว · ส่งไปที่ ${profile.value?.email} ภายใน ${formatThaiShortDate(addDays(requestedAt, PRIVACY_REQUEST_DAYS))}`
  return `ส่งไฟล์ทางอีเมลภายใน ${PRIVACY_REQUEST_DAYS} วัน`
})

async function handleRequestExport() {
  exportError.value = ''
  isRequestingExport.value = true
  try {
    await requestDataExport()
  } catch {
    exportError.value = 'ส่งคำขอไม่สำเร็จ กรุณาลองอีกครั้ง'
  } finally {
    isRequestingExport.value = false
  }
}

const isDeletionDialogOpen = ref(false)
const isRequestingDeletion = ref(false)
const deletionError = ref('')

async function handleConfirmDeletion() {
  deletionError.value = ''
  isRequestingDeletion.value = true
  try {
    await requestAccountDeletion()
    isDeletionDialogOpen.value = false
  } catch {
    deletionError.value = 'ส่งคำขอลบบัญชีไม่สำเร็จ กรุณาลองอีกครั้ง'
    isDeletionDialogOpen.value = false
  } finally {
    isRequestingDeletion.value = false
  }
}

const memberPoints = computed(() => member.value?.points ?? 0)
const sectionHeadingClass = 'px-1 pb-2.5 text-lg xl:text-xl'
const menuRowClass = 'flex min-h-16 w-full items-center gap-3.5 px-4 py-3 text-left transition-colors'
</script>

<template>
  <div class="md:page-container md:pt-5 md:pb-16 xl:pt-9">
    <MobilePageHeader title="ความยินยอมและความเป็นส่วนตัว" fallback-path="/account" />

    <div class="max-md:hidden">
      <PageBreadcrumb current-label="ความยินยอมและความเป็นส่วนตัว" />
      <h1 class="mt-3 text-[1.75rem] leading-tight xl:mt-4 xl:text-[3.5rem]">
        ความยินยอมและความเป็นส่วนตัว
      </h1>
    </div>

    <div class="space-y-6 px-4 pt-4 pb-[calc(2rem+env(safe-area-inset-bottom))] md:mt-6 md:max-w-2xl md:px-0 xl:mt-8">
      <section aria-labelledby="consents-heading">
        <h2 id="consents-heading" :class="sectionHeadingClass">
          ความยินยอม
        </h2>

        <div v-if="!consents" class="flex justify-center rounded-2xl border py-10" role="status">
          <Icon name="lucide:loader-circle" class="size-6 animate-spin text-muted" />
          <span class="sr-only">กำลังโหลดความยินยอม</span>
        </div>

        <div v-else class="divide-y rounded-2xl border bg-white">
          <div class="flex items-start gap-3.5 px-4 py-4">
            <Icon name="lucide:file-text" class="mt-0.5 size-5.5 shrink-0" aria-hidden="true" />
            <div class="min-w-0 flex-1">
              <p class="text-[0.9375rem] font-semibold">
                เงื่อนไขสมาชิก
              </p>
              <p class="mt-0.5 text-xs text-muted">
                <template v-if="consents.terms">
                  ยอมรับเวอร์ชัน {{ consents.terms.version }} · {{ formatThaiDateAndTime(consents.terms.acceptedAt) }}
                </template>
                <template v-else>
                  ยังไม่ได้ยอมรับ
                </template>
              </p>
            </div>
            <NuxtLink to="/terms/membership" class="shrink-0 text-sm font-semibold text-primary hover:underline">
              อ่าน
            </NuxtLink>
          </div>

          <div v-for="row in consentRows" :key="row.purpose" class="flex items-start gap-3.5 px-4 py-4">
            <Icon :name="row.icon" class="mt-0.5 size-5.5 shrink-0" aria-hidden="true" />
            <div class="min-w-0 flex-1">
              <p :id="`consent-${row.purpose}-label`" class="text-[0.9375rem] font-semibold">
                {{ row.title }}
              </p>
              <p class="mt-0.5 text-xs text-muted">
                {{ consentStatusLine(consents[row.purpose]) }}
              </p>
              <p class="mt-2 text-xs leading-relaxed text-muted/80">
                {{ consents[row.purpose].granted ? row.ifWithdrawn : row.ifGranted }}
              </p>
            </div>
            <ToggleSwitch
              :model-value="consents[row.purpose].granted"
              :disabled="pendingPurpose === row.purpose"
              :aria-labelledby="`consent-${row.purpose}-label`"
              @update:model-value="handleConsentChange(row.purpose, $event)"
            />
          </div>

          <div class="px-4 py-3.5">
            <button
              type="button"
              :aria-expanded="isHistoryOpen"
              :aria-controls="historyListId"
              class="flex items-center gap-1 text-sm font-semibold text-primary hover:underline"
              @click="toggleHistory"
            >
              ดูประวัติการให้และถอนความยินยอม
              <Icon name="lucide:chevron-down" class="size-4 transition-transform" :class="isHistoryOpen && 'rotate-180'" aria-hidden="true" />
            </button>
            <div v-if="isHistoryOpen" :id="historyListId" class="mt-3">
              <p v-if="isHistoryLoading" class="text-xs text-muted" role="status">
                กำลังโหลด…
              </p>
              <p v-else-if="history.length === 0" class="text-xs text-muted">
                ยังไม่มีประวัติ
              </p>
              <ol v-else class="space-y-2 border-l-2 border-border pl-3">
                <li v-for="entry in history" :key="entry.id" class="text-xs">
                  <span class="block">{{ historyEntryLabel(entry) }}</span>
                  <span class="text-muted">{{ formatThaiDateAndTime(entry.recordedAt) }}</span>
                </li>
              </ol>
            </div>
          </div>
        </div>
        <p v-if="consentError" role="alert" class="mt-2 px-1 text-sm text-primary-dark">
          {{ consentError }}
        </p>
      </section>

      <section aria-labelledby="my-data-heading">
        <h2 id="my-data-heading" :class="sectionHeadingClass">
          ข้อมูลของฉัน
        </h2>
        <ul class="divide-y overflow-hidden rounded-2xl border bg-white">
          <li>
            <NuxtLink to="/profile#personal-info" :class="menuRowClass" class="hover:bg-cream">
              <Icon name="lucide:user" class="size-5.5 shrink-0" aria-hidden="true" />
              <span class="min-w-0 flex-1 text-[0.9375rem]">แก้ไขข้อมูลส่วนตัว</span>
              <Icon name="lucide:chevron-right" class="size-5 shrink-0 text-muted" aria-hidden="true" />
            </NuxtLink>
          </li>
          <li>
            <!-- The copy is emailed, so members without an email are sent to add one first -->
            <NuxtLink v-if="profile && !profile.email" to="/profile#personal-info" :class="menuRowClass" class="hover:bg-cream">
              <Icon name="lucide:file-text" class="size-5.5 shrink-0" aria-hidden="true" />
              <span class="min-w-0 flex-1">
                <span class="block text-[0.9375rem]">ขอสำเนาข้อมูลของฉัน</span>
                <span class="mt-0.5 block text-xs text-muted">เพิ่มอีเมลในข้อมูลส่วนตัวก่อน</span>
              </span>
              <Icon name="lucide:chevron-right" class="size-5 shrink-0 text-muted" aria-hidden="true" />
            </NuxtLink>
            <button
              v-else
              type="button"
              :disabled="Boolean(privacyRequests?.dataExportRequestedAt) || isRequestingExport"
              :class="menuRowClass"
              class="enabled:hover:bg-cream"
              @click="handleRequestExport"
            >
              <Icon name="lucide:file-text" class="size-5.5 shrink-0" aria-hidden="true" />
              <span class="min-w-0 flex-1">
                <span class="block text-[0.9375rem]">ขอสำเนาข้อมูลของฉัน</span>
                <span class="mt-0.5 block text-xs text-muted">{{ dataExportStatusLine }}</span>
              </span>
              <Icon v-if="isRequestingExport" name="lucide:loader-circle" class="size-5 shrink-0 animate-spin text-muted" aria-hidden="true" />
              <Icon v-else-if="privacyRequests?.dataExportRequestedAt" name="lucide:check" class="size-5 shrink-0 text-success" aria-hidden="true" />
              <Icon v-else name="lucide:chevron-right" class="size-5 shrink-0 text-muted" aria-hidden="true" />
            </button>
            <p v-if="exportError" role="alert" class="px-4 pb-3 text-sm text-primary-dark">
              {{ exportError }}
            </p>
          </li>
          <li>
            <NuxtLink to="/privacy" :class="menuRowClass" class="hover:bg-cream">
              <Icon name="lucide:shield-check" class="size-5.5 shrink-0" aria-hidden="true" />
              <span class="min-w-0 flex-1 text-[0.9375rem]">นโยบายความเป็นส่วนตัว</span>
              <Icon name="lucide:chevron-right" class="size-5 shrink-0 text-muted" aria-hidden="true" />
            </NuxtLink>
          </li>
        </ul>
      </section>

      <section id="delete-account" aria-labelledby="delete-account-heading" class="scroll-mt-24 rounded-2xl bg-primary-soft/60 px-4 py-5">
        <h2 id="delete-account-heading" class="text-lg text-primary-dark">
          ขอลบบัญชี
        </h2>

        <template v-if="privacyRequests?.accountDeletionRequestedAt">
          <p class="mt-2 text-sm">
            ส่งคำขอลบบัญชีแล้วเมื่อ {{ formatThaiShortDate(privacyRequests.accountDeletionRequestedAt) }}
            · จะลบภายใน {{ formatThaiShortDate(addDays(privacyRequests.accountDeletionRequestedAt, PRIVACY_REQUEST_DAYS)) }}
          </p>
          <p class="mt-1 text-xs text-muted">
            เปลี่ยนใจ? ติดต่อทีมงานก่อนถึงวันลบ
          </p>
        </template>

        <template v-else>
          <ul class="mt-2 list-disc space-y-1 pl-5 text-sm marker:text-primary">
            <li>แต้ม {{ formatNumber(memberPoints) }} แต้มและคูปองที่มีจะหายทั้งหมด</li>
            <li>ประวัติการซื้อเก็บไว้แบบไม่ระบุตัวตนตามกฎหมาย</li>
            <li>ดำเนินการภายใน {{ PRIVACY_REQUEST_DAYS }} วันหลังยืนยัน</li>
          </ul>
          <button
            type="button"
            class="mt-4 flex h-12 w-full items-center justify-center rounded-full border-2 border-border bg-white text-[0.9375rem] font-semibold text-primary-dark transition-colors hover:border-primary"
            @click="isDeletionDialogOpen = true"
          >
            ขอลบบัญชี
          </button>
          <p v-if="deletionError" role="alert" class="mt-2 text-center text-sm text-primary-dark">
            {{ deletionError }}
          </p>
        </template>
      </section>
    </div>

    <AccountDeletionDialog
      v-model:open="isDeletionDialogOpen"
      :points="memberPoints"
      :is-submitting="isRequestingDeletion"
      @confirm="handleConfirmDeletion"
    />
  </div>
</template>
