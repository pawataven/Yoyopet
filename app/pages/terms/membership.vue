<script setup lang="ts">
import type { MembershipTermsTopic } from '~/types/terms'

definePageMeta({ hideMobileTabBar: true, hideSiteChromeOnMobile: true })

useSeoMeta({
  title: 'เงื่อนไขการใช้งาน · YoyoPet',
  description: 'เงื่อนไขการใช้งาน YoYo Member: การสะสมแต้ม การแลกของรางวัล คูปอง และระดับสมาชิก'
})

const route = useRoute()
const requestedVersion = computed(() => (typeof route.query.version === 'string' ? route.query.version : null))
const { terms, currentVersion, previousVersion, isCurrent, isLoading } = useMembershipTerms(requestedVersion)

const topicLabels: Record<MembershipTermsTopic, string> = {
  points: 'การสะสมแต้ม',
  redemption: 'การแลก',
  coupons: 'คูปอง',
  tiers: 'ระดับ'
}

const topicTabs = computed(() =>
  (terms.value?.sections ?? []).flatMap(section =>
    section.topic ? [{ topic: section.topic, sectionId: section.id, label: topicLabels[section.topic] }] : []
  )
)

const activeTopic = ref<MembershipTermsTopic | null>(null)
watch(topicTabs, (tabs) => {
  activeTopic.value = tabs[0]?.topic ?? null
}, { immediate: true })

function sectionElementId(sectionId: string) {
  return `terms-${sectionId}`
}

// Sections near the end can't scroll up to the top, so scroll-spy would pull the tapped tab back to an earlier one;
// it stays paused until the jump's scrolling settles
const JUMP_SETTLE_MS = 200
let isFollowingTabJump = false
let jumpSettleTimer: ReturnType<typeof setTimeout> | undefined

function waitForJumpToSettle() {
  clearTimeout(jumpSettleTimer)
  jumpSettleTimer = setTimeout(() => {
    isFollowingTabJump = false
  }, JUMP_SETTLE_MS)
}

function jumpToTopic(tab: { topic: MembershipTermsTopic, sectionId: string }) {
  activeTopic.value = tab.topic
  isFollowingTabJump = true
  waitForJumpToSettle()
  document.getElementById(sectionElementId(tab.sectionId))?.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

// Highlights the tab of the last topic section scrolled past, so the tabs follow the reader
const SCROLL_SPY_OFFSET_PX = 120
let pendingFrame = 0

function syncActiveTopicWithScroll() {
  if (isFollowingTabJump) {
    waitForJumpToSettle()
    return
  }
  cancelAnimationFrame(pendingFrame)
  pendingFrame = requestAnimationFrame(() => {
    const passedTabs = topicTabs.value.filter((tab) => {
      const sectionTop = document.getElementById(sectionElementId(tab.sectionId))?.getBoundingClientRect().top
      return sectionTop !== undefined && sectionTop <= SCROLL_SPY_OFFSET_PX
    })
    activeTopic.value = passedTabs.at(-1)?.topic ?? topicTabs.value[0]?.topic ?? null
  })
}

onMounted(() => window.addEventListener('scroll', syncActiveTopicWithScroll, { passive: true }))
onBeforeUnmount(() => {
  window.removeEventListener('scroll', syncActiveTopicWithScroll)
  cancelAnimationFrame(pendingFrame)
  clearTimeout(jumpSettleTimer)
})
</script>

<template>
  <div>
    <MobilePageHeader title="เงื่อนไขการใช้งาน" />

    <div class="page-container pt-4 pb-[calc(2rem+env(safe-area-inset-bottom))] md:pt-5 md:pb-12 xl:pt-9 xl:pb-16">
      <div class="max-md:hidden">
        <PageBreadcrumb current-label="เงื่อนไขการใช้งาน" />
        <h1 class="mt-3 text-[1.75rem] leading-tight xl:mt-4 xl:text-[3.5rem]">
          เงื่อนไขการใช้งาน
        </h1>
      </div>

      <div class="md:mt-6 md:max-w-3xl xl:mt-8">
        <div v-if="isLoading && !terms" class="flex justify-center py-16" role="status">
          <Icon name="lucide:loader-circle" class="size-6 animate-spin text-muted" />
          <span class="sr-only">กำลังโหลดเงื่อนไข</span>
        </div>

        <p v-else-if="!terms" class="py-16 text-center text-sm text-muted">
          ไม่พบเงื่อนไขเวอร์ชันนี้
          <NuxtLink to="/terms/membership" class="mt-2 block font-semibold text-primary hover:underline">
            ดูเวอร์ชันปัจจุบัน
          </NuxtLink>
        </p>

        <template v-else>
          <div class="flex flex-wrap items-center justify-between gap-x-4 gap-y-2">
            <p class="rounded-full bg-border/70 px-3 py-1 text-xs font-semibold">
              เวอร์ชัน {{ terms.version }} · มีผล {{ formatThaiShortDate(terms.effectiveAt) }}
            </p>
            <NuxtLink
              v-if="previousVersion"
              :to="{ query: { version: previousVersion.version } }"
              class="text-sm font-semibold text-primary hover:underline"
            >
              เวอร์ชันก่อนหน้า
            </NuxtLink>
          </div>

          <div v-if="!isCurrent" class="mt-3 flex items-center justify-between gap-3 rounded-2xl border bg-cream px-4 py-3 text-sm">
            <span>คุณกำลังดูเวอร์ชันเก่า</span>
            <NuxtLink to="/terms/membership" class="shrink-0 font-semibold text-primary hover:underline">
              ดูเวอร์ชัน {{ currentVersion }}
            </NuxtLink>
          </div>

          <nav v-if="topicTabs.length" aria-label="หัวข้อเงื่อนไข" class="-mx-4 mt-4 flex gap-2 overflow-x-auto px-4 scrollbar-none md:mx-0 md:px-0">
            <a
              v-for="tab in topicTabs"
              :key="tab.topic"
              :href="`#${sectionElementId(tab.sectionId)}`"
              :aria-current="activeTopic === tab.topic ? 'true' : undefined"
              class="flex h-9 shrink-0 items-center rounded-full border px-4 text-sm transition-colors xl:h-11 xl:px-5 xl:text-base"
              :class="activeTopic === tab.topic
                ? 'border-primary bg-primary font-semibold text-white'
                : 'bg-white hover:border-primary hover:text-primary'"
              @click.prevent="jumpToTopic(tab)"
            >
              {{ tab.label }}
            </a>
          </nav>

          <div class="mt-5 space-y-6 xl:mt-8 xl:space-y-8">
            <section
              v-for="(section, index) in terms.sections"
              :id="sectionElementId(section.id)"
              :key="section.id"
              :aria-labelledby="`${sectionElementId(section.id)}-heading`"
              class="scroll-mt-24 xl:scroll-mt-32"
            >
              <h2 :id="`${sectionElementId(section.id)}-heading`" class="text-lg leading-tight xl:text-2xl">
                {{ index + 1 }}. {{ section.title }}
              </h2>
              <ul class="mt-2 space-y-1.5 text-sm text-muted xl:mt-3 xl:space-y-2 xl:text-base">
                <li v-for="term in section.terms" :key="term" class="flex gap-2.5">
                  <span class="mt-2 size-1.5 shrink-0 rounded-full bg-primary xl:mt-2.5" aria-hidden="true" />
                  {{ term }}
                </li>
              </ul>
            </section>
          </div>

          <aside v-if="terms.isSampleText" class="mt-8 flex items-center gap-3 rounded-2xl bg-gold/20 px-4 py-4 text-sm text-pending">
            <Icon name="lucide:info" class="size-5 shrink-0" aria-hidden="true" />
            ข้อความตัวอย่าง รอข้อความจริงจากร้าน
          </aside>
        </template>
      </div>
    </div>
  </div>
</template>
