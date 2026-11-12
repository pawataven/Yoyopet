<script setup lang="ts">
const { isPromptVisible, snooze, openAddFriend } = useLineFriendPrompt()
const { lineOfficialAccount } = useAppConfig()

const isOpen = computed({
  get: () => isPromptVisible.value,
  set: (shouldOpen) => {
    if (!shouldOpen) snooze()
  }
})

const headingId = useId()
const descriptionId = `${headingId}-description`

const lineBenefits = [
  { icon: 'lucide:star', label: 'แต้มเข้าเมื่อไหร่ แจ้งทันที' },
  { icon: 'lucide:truck', label: 'ติดตามพัสดุของรางวัลได้ในแชท' },
  { icon: 'lucide:cake', label: 'คูปองวันเกิดเจ้าของและน้อง' },
  { icon: 'lucide:clock', label: 'เตือนก่อนแต้มและคูปองหมดอายุ' }
]
</script>

<template>
  <ModalDialog
    v-model:open="isOpen"
    bottom-sheet-on-mobile
    :aria-labelledby="headingId"
    :aria-describedby="descriptionId"
    class="md:max-w-110"
  >
    <div class="px-4 pt-3 pb-[calc(1.25rem+env(safe-area-inset-bottom))] text-center md:px-8 md:pt-8 md:pb-8">
      <span class="mx-auto block h-1 w-10 rounded-full bg-border md:hidden" aria-hidden="true" />

      <div class="mt-4 flex items-center justify-center md:mt-0" aria-hidden="true">
        <img src="/logo/logo.png" alt="" width="88" height="88" class="size-16 rounded-2xl">
        <span class="relative z-10 -mx-2 flex size-7 items-center justify-center rounded-full bg-primary text-white ring-3 ring-white">
          <Icon name="lucide:plus" class="size-4" />
        </span>
        <span class="flex size-16 items-center justify-center rounded-2xl bg-line-green font-number text-base font-semibold text-white">
          LINE
        </span>
      </div>

      <h2 :id="headingId" class="mt-4 text-[1.375rem] leading-tight">
        เพิ่ม YoYo เป็นเพื่อนใน LINE
      </h2>
      <p :id="descriptionId" class="mt-1 text-sm text-muted">
        รับแจ้งเตือนสำคัญทันที ไม่พลาดแต้มและคูปอง
      </p>

      <ul class="mt-5 space-y-1 rounded-2xl bg-cream px-4 py-3 text-left">
        <li v-for="benefit in lineBenefits" :key="benefit.label" class="flex min-h-11 items-center gap-3 text-sm">
          <span class="flex size-8 shrink-0 items-center justify-center rounded-full bg-white text-primary" aria-hidden="true">
            <Icon :name="benefit.icon" class="size-4" />
          </span>
          {{ benefit.label }}
        </li>
      </ul>

      <div class="mt-3 flex items-center gap-3 rounded-2xl border px-4 py-3 text-left">
        <img src="/logo/logo.png" alt="" width="88" height="88" class="size-10 shrink-0 rounded-full">
        <div class="min-w-0 flex-1">
          <p class="truncate text-sm font-semibold">
            {{ lineOfficialAccount.name }}
          </p>
          <p class="truncate text-xs text-muted">
            {{ lineOfficialAccount.lineId }} · บัญชีทางการ
          </p>
        </div>
        <Icon name="lucide:shield-check" class="size-5 shrink-0 text-line-green" aria-label="บัญชีที่ยืนยันแล้ว" />
      </div>

      <button
        type="button"
        class="mt-4 flex h-12 w-full items-center justify-center rounded-full bg-line-green text-[0.9375rem] font-semibold text-white transition-opacity hover:opacity-90 focus-visible:ring-4 focus-visible:ring-line-green/30 focus-visible:outline-none"
        @click="openAddFriend"
      >
        เพิ่มเพื่อนใน LINE
      </button>
      <button
        type="button"
        class="mt-3 flex h-12 w-full items-center justify-center rounded-full border-2 border-border bg-white text-[0.9375rem] font-semibold transition-colors hover:border-primary hover:text-primary-dark"
        @click="snooze"
      >
        ไว้ทีหลัง
      </button>

      <p class="mt-4 text-xs text-muted">
        เปลี่ยนใจได้ทุกเมื่อในหน้า
        <NuxtLink to="/profile#notification-settings" class="underline underline-offset-2 hover:text-primary-dark" @click="snooze">ตั้งค่าการแจ้งเตือน</NuxtLink>
      </p>
    </div>
  </ModalDialog>
</template>
