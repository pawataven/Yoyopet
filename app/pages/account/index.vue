<script setup lang="ts">
definePageMeta({ middleware: 'auth', hideSiteChromeOnMobile: true })

useSeoMeta({
  title: 'บัญชีของฉัน · YoyoPet'
})

interface AccountMenuItem {
  label: string
  icon: string
  to: string
  value?: string
}

const { appVersion } = useAppConfig()
const { member } = useMember()
const { profile } = useMemberProfile()
const { addresses } = useShippingAddresses()
const { pets } = usePets()
const { referral } = useReferral()
const { preferences: notificationPreferences } = useNotificationPreferences()

const languageSelectId = useId()
const selectedLanguage = ref('th')
const isSignOutDialogOpen = ref(false)

const memberContactLine = computed(() =>
  [member.value?.memberCode, profile.value?.phone && maskThaiMobile(profile.value.phone)].filter(Boolean).join(' · ')
)

const notificationChannelsLabel = computed(() => {
  if (!notificationPreferences.value) return undefined
  const topicSettings = Object.values(notificationPreferences.value.topics)
  const enabledChannels = [
    topicSettings.some(settings => settings.line) && 'LINE',
    topicSettings.some(settings => settings.web) && 'เว็บ'
  ].filter(Boolean)
  return enabledChannels.length ? enabledChannels.join(' · ') : 'ปิดอยู่'
})

const accountItems = computed<AccountMenuItem[]>(() => [
  { label: 'ข้อมูลส่วนตัว', icon: 'lucide:user', to: '/account/personal-info' },
  { label: 'ที่อยู่จัดส่ง', icon: 'lucide:map-pin', to: '/account/addresses', value: `${addresses.value.length} ที่อยู่` },
  { label: 'สัตว์เลี้ยงของฉัน', icon: 'lucide:paw-print', to: '/pets', value: `${pets.value.length} ตัว` },
  {
    label: 'ชวนเพื่อน',
    icon: 'lucide:users',
    to: '/referral',
    value: referral.value ? `รับ ${formatNumber(referral.value.rewardPointsPerReferral)} แต้ม` : undefined
  }
])

const settingItems = computed<AccountMenuItem[]>(() => [
  { label: 'การแจ้งเตือน', icon: 'lucide:bell', to: '/settings/notifications', value: notificationChannelsLabel.value },
  { label: 'ความยินยอมและความเป็นส่วนตัว', icon: 'lucide:shield-check', to: '/settings/privacy' }
])

const helpItems: AccountMenuItem[] = [
  { label: 'วิธีสะสมแต้มและคำถามที่พบบ่อย', icon: 'lucide:circle-help', to: '/help/how-to-earn' },
  { label: 'เงื่อนไขการใช้งาน', icon: 'lucide:file-text', to: '/terms/membership' }
]

const sectionHeadingClass = 'px-1 pb-2 font-sans text-sm font-semibold xl:text-base'
const menuCardClass = 'overflow-hidden rounded-2xl border bg-white'
const menuRowClass = 'flex min-h-14 w-full items-center gap-3.5 px-4 text-[0.9375rem] transition-colors hover:bg-cream xl:min-h-16 xl:text-base'
</script>

<template>
  <div class="md:page-container md:pt-5 md:pb-16 xl:pt-9">
    <MobilePageHeader title="บัญชีของฉัน" />

    <div class="max-md:hidden">
      <PageBreadcrumb current-label="บัญชีของฉัน" />
      <h1 class="mt-3 text-[1.75rem] leading-tight xl:mt-4 xl:text-[3.5rem]">
        บัญชีของฉัน
      </h1>
    </div>

    <div class="space-y-5 px-4 pt-4 pb-8 md:mt-6 md:max-w-2xl md:px-0 xl:mt-8">
      <NuxtLink
        to="/profile"
        class="flex items-center gap-4 rounded-2xl border border-primary-soft bg-primary-soft/40 p-4 transition-colors hover:bg-primary-soft/70"
      >
        <span class="flex size-16 shrink-0 items-center justify-center overflow-hidden rounded-full bg-white ring-1 ring-primary-soft">
          <NuxtImg
            v-if="member?.avatarUrl"
            :src="member.avatarUrl"
            alt=""
            width="64"
            height="64"
            class="size-full object-cover"
          />
          <CatAvatarIcon v-else class="aspect-35/40 h-[62%] translate-y-[8%]" />
        </span>
        <span class="min-w-0 flex-1">
          <span class="block truncate font-heading text-lg">คุณ{{ profile ? `${profile.firstName} ${profile.lastName}` : member?.displayName }}</span>
          <span class="mt-0.5 block truncate text-xs text-muted tabular-nums">{{ memberContactLine }}</span>
          <span v-if="member" class="mt-1.5 inline-flex h-5.5 items-center rounded-full bg-primary-soft px-2.5 text-xs font-semibold text-primary-dark">
            {{ member.tier }} · {{ formatNumber(member.points) }} แต้ม
          </span>
        </span>
        <Icon name="lucide:chevron-right" class="size-5 shrink-0 text-muted" aria-hidden="true" />
      </NuxtLink>

      <section aria-labelledby="account-section-heading">
        <h2 id="account-section-heading" :class="sectionHeadingClass">
          บัญชี
        </h2>
        <ul :class="menuCardClass" class="divide-y">
          <li v-for="item in accountItems" :key="item.label">
            <NuxtLink :to="item.to" :class="menuRowClass">
              <Icon :name="item.icon" class="size-5.5 shrink-0" aria-hidden="true" />
              <span class="min-w-0 flex-1 truncate">{{ item.label }}</span>
              <span v-if="item.value" class="shrink-0 text-xs text-muted xl:text-sm">{{ item.value }}</span>
              <Icon name="lucide:chevron-right" class="size-5 shrink-0 text-muted" aria-hidden="true" />
            </NuxtLink>
          </li>
        </ul>
      </section>

      <section aria-labelledby="settings-section-heading">
        <h2 id="settings-section-heading" :class="sectionHeadingClass">
          ตั้งค่า
        </h2>
        <ul :class="menuCardClass" class="divide-y">
          <li v-for="item in settingItems" :key="item.label">
            <NuxtLink :to="item.to" :class="menuRowClass">
              <Icon :name="item.icon" class="size-5.5 shrink-0" aria-hidden="true" />
              <span class="min-w-0 flex-1 truncate">{{ item.label }}</span>
              <span v-if="item.value" class="shrink-0 text-xs text-muted xl:text-sm">{{ item.value }}</span>
              <Icon name="lucide:chevron-right" class="size-5 shrink-0 text-muted" aria-hidden="true" />
            </NuxtLink>
          </li>
          <li>
            <!-- Thai is the only language for now; a real select keeps the row honest until more locales ship -->
            <div :class="menuRowClass" class="relative">
              <Icon name="lucide:globe" class="size-5.5 shrink-0" aria-hidden="true" />
              <label :for="languageSelectId" class="min-w-0 flex-1 truncate">ภาษา</label>
              <span class="shrink-0 text-xs text-muted xl:text-sm" aria-hidden="true">ไทย</span>
              <Icon name="lucide:chevron-right" class="size-5 shrink-0 text-muted" aria-hidden="true" />
              <select
                :id="languageSelectId"
                v-model="selectedLanguage"
                class="absolute inset-0 cursor-pointer appearance-none opacity-0"
              >
                <option value="th">
                  ไทย
                </option>
              </select>
            </div>
          </li>
        </ul>
      </section>

      <section aria-labelledby="help-section-heading">
        <h2 id="help-section-heading" :class="sectionHeadingClass">
          ช่วยเหลือ
        </h2>
        <ul :class="menuCardClass" class="divide-y">
          <li v-for="item in helpItems" :key="item.label">
            <NuxtLink :to="item.to" :class="menuRowClass">
              <Icon :name="item.icon" class="size-5.5 shrink-0" aria-hidden="true" />
              <span class="min-w-0 flex-1 truncate">{{ item.label }}</span>
              <Icon name="lucide:chevron-right" class="size-5 shrink-0 text-muted" aria-hidden="true" />
            </NuxtLink>
          </li>
        </ul>
      </section>

      <button
        type="button"
        class="flex h-12 w-full items-center justify-center gap-2 rounded-full border-2 border-border bg-white text-[0.9375rem] font-semibold transition-colors hover:border-primary hover:text-primary-dark"
        @click="isSignOutDialogOpen = true"
      >
        <Icon name="lucide:log-out" class="size-5 -scale-x-100" aria-hidden="true" />
        ออกจากระบบ
      </button>

      <p class="text-center text-xs text-muted">
        YoYo Member v{{ appVersion }} ·
        <NuxtLink to="/settings/privacy#delete-account" class="underline-offset-2 hover:text-primary-dark hover:underline">ขอลบบัญชี</NuxtLink>
      </p>
    </div>

    <SignOutConfirmDialog v-model:open="isSignOutDialogOpen" />
  </div>
</template>
