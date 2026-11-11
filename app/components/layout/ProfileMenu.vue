<script setup lang="ts">
import type { MemberSummary } from '~/types/member'

const props = defineProps<{
  member: MemberSummary
}>()

const { referral } = useReferral()
const { signOut } = useAuth()

const rootElement = useTemplateRef<HTMLElement>('root')
const avatarButton = useTemplateRef<HTMLButtonElement>('avatarButton')
const popoverId = useId()
const { isOpen, toggle: togglePopover, close: closePopover } = usePopover(rootElement, avatarButton)

const referralLabel = computed(() =>
  referral.value ? `ชวนเพื่อน รับ ${formatNumber(referral.value.rewardPointsPerReferral)} แต้ม` : 'ชวนเพื่อน'
)

const profileMenuItems = computed(() => [
  { label: 'โปรไฟล์ของฉัน', icon: 'lucide:users', to: '/profile' },
  { label: 'สัตว์เลี้ยงของฉัน', icon: 'lucide:paw-print', to: '/pets' },
  { label: 'ระดับสมาชิกและสิทธิพิเศษ', icon: 'lucide:award', to: '/tiers' },
  { label: 'ประวัติแต้มและการแลก', icon: 'lucide:history', to: '/points/history' },
  { label: referralLabel.value, icon: 'lucide:gift', to: '/referral' },
  { label: 'ตั้งค่าการแจ้งเตือน', icon: 'lucide:bell', to: '/settings/notifications' },
  { label: 'ภาษา: ไทย', icon: 'lucide:globe', to: '/settings/language' }
])

const avatarInitial = computed(() => props.member.displayName.charAt(0))

async function handleSignOut() {
  closePopover()
  await signOut()
}
</script>

<template>
  <div ref="root" class="relative">
    <button
      ref="avatarButton"
      type="button"
      aria-label="เมนูบัญชีของฉัน"
      :aria-expanded="isOpen"
      :aria-controls="popoverId"
      class="flex size-(--nav-avatar-size) shrink-0 items-center justify-center overflow-hidden rounded-full bg-white ring-white/40 transition-shadow hover:ring-4"
      :class="isOpen && 'ring-4'"
      @click="togglePopover"
    >
      <NuxtImg
        v-if="member.avatarUrl"
        :src="member.avatarUrl"
        :alt="member.displayName"
        width="62"
        height="62"
        class="size-full object-cover"
      />
      <CatAvatarIcon v-else class="aspect-[35/40] h-[62%] translate-y-[8%]" />
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
        aria-label="เมนูบัญชีของฉัน"
        class="fixed inset-x-4 top-[calc(var(--nav-height)+0.5rem)] z-50 max-h-[calc(100dvh-var(--nav-height)-1.5rem)] overflow-y-auto overscroll-contain rounded-[1.25rem] border bg-white text-ink shadow-xl shadow-ink/10 sm:absolute sm:inset-x-auto sm:top-full sm:right-0 sm:mt-4 sm:w-96"
      >
        <div class="flex items-center gap-4 px-6 pt-6 pb-5 xl:px-7 xl:pt-8 xl:pb-6">
          <span class="flex size-14 shrink-0 items-center justify-center rounded-full bg-primary-soft font-heading text-2xl font-medium text-primary-dark xl:size-16 xl:text-[1.75rem]" aria-hidden="true">
            {{ avatarInitial }}
          </span>
          <div class="min-w-0 flex-1">
            <p class="truncate font-heading text-lg font-medium xl:text-[1.375rem]">
              คุณ{{ member.displayName }}
            </p>
            <p class="text-sm text-muted">
              {{ member.memberCode }}
            </p>
          </div>
          <span class="flex h-8 shrink-0 items-center rounded-full bg-primary-soft px-4 text-sm font-semibold text-primary-dark">
            {{ member.tier }}
          </span>
        </div>

        <hr class="mx-6">
        <nav aria-label="บัญชีของฉัน" class="px-3 py-4 xl:pb-5">
          <ul class="space-y-2">
            <li v-for="item in profileMenuItems" :key="item.to">
              <NuxtLink
                :to="item.to"
                class="flex h-12 items-center gap-4 rounded-2xl px-3 text-base transition-colors hover:bg-cream xl:h-13 xl:px-5 xl:text-lg"
              >
                <Icon :name="item.icon" class="size-5 shrink-0 xl:size-5.5" />
                <span class="min-w-0 flex-1 truncate">{{ item.label }}</span>
                <Icon name="lucide:chevron-right" class="size-5 shrink-0 text-muted" />
              </NuxtLink>
            </li>
          </ul>
        </nav>

        <hr class="mx-6">
        <div class="px-3 py-2 xl:py-2.5">
          <button
            type="button"
            class="flex h-12 w-full items-center gap-4 rounded-2xl px-3 font-heading text-base font-medium text-primary-dark transition-colors hover:bg-primary-soft/60 xl:h-13 xl:px-5 xl:text-lg"
            @click="handleSignOut"
          >
            <Icon name="lucide:arrow-right" class="size-5 shrink-0 xl:size-5.5" />
            ออกจากระบบ
          </button>
        </div>
      </div>
    </Transition>
  </div>
</template>
