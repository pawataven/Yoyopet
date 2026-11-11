<script setup lang="ts">
const isOpen = defineModel<boolean>('open', { required: true })

const { member } = useMember()

const headingId = useId()
const closeButton = useTemplateRef<HTMLButtonElement>('closeButton')
</script>

<template>
  <ModalDialog
    v-model:open="isOpen"
    :aria-labelledby="headingId"
    class="max-w-135.5"
    @opened="closeButton?.focus()"
  >
    <div v-if="member" class="px-5 pt-5 pb-6 text-center sm:px-10 sm:pt-10 sm:pb-8">
      <div class="flex items-center gap-3 rounded-[1.25rem] bg-primary px-5 py-4 text-left text-white sm:gap-4 sm:px-7 sm:py-6">
        <img src="/logo/logo.png" alt="" width="88" height="88" class="size-11 shrink-0 sm:size-13">
        <div class="min-w-0">
          <h2 :id="headingId" class="truncate text-lg leading-tight sm:text-[1.375rem]">
            คุณ{{ member.displayName }}
          </h2>
          <p class="mt-0.5 text-sm text-white/85 sm:text-[0.9375rem]">
            ระดับ {{ member.tier }} · {{ formatNumber(member.points) }} แต้ม
          </p>
        </div>
      </div>

      <!-- TODO: encode a short-lived signed token from the backend instead, so a screenshot of the QR can't be reused -->
      <div class="mx-auto mt-6 w-60 rounded-[1.25rem] border bg-white p-5 text-ink sm:mt-8 sm:w-74 sm:p-6">
        <QrCode :value="member.memberCode" :label="`QR บัตรสมาชิก ${member.memberCode}`" />
      </div>

      <p class="mt-4 font-number text-2xl font-semibold tracking-wide sm:text-[1.75rem]">
        {{ member.memberCode }}
      </p>
      <p class="mt-1 text-sm text-muted sm:text-[0.9375rem]">
        แสดง QR นี้ที่หน้าร้านเพื่อสะสมแต้มหรือใช้สิทธิ์
      </p>

      <button
        ref="closeButton"
        type="button"
        class="mt-6 h-12 w-full rounded-xl border-[1.5px] border-primary bg-white text-base font-semibold text-primary-dark transition-colors hover:bg-primary-soft focus-visible:ring-4 focus-visible:ring-primary-soft focus-visible:outline-none sm:mt-7 sm:h-13.5 sm:text-lg"
        @click="isOpen = false"
      >
        ปิด
      </button>
    </div>
  </ModalDialog>
</template>
