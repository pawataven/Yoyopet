<script setup lang="ts">
const props = defineProps<{
  phone: string
  otpSentAt: number
  resendAfterSeconds: number
  expiresInSeconds: number
  isVerifying: boolean
  isResending: boolean
  errorMessage: string
}>()

const emit = defineEmits<{
  verify: [code: string]
  resend: []
  changePhone: []
}>()

const isOpen = defineModel<boolean>('open', { required: true })

const OTP_LENGTH = 6
const otpCode = ref('')
const otpInput = useTemplateRef<{ focus: () => void }>('otpInput')
const headingId = useId()

const now = ref(Date.now())
let clockTimer: ReturnType<typeof setInterval> | undefined

const secondsUntilResend = computed(() =>
  Math.max(0, props.resendAfterSeconds - Math.floor((now.value - props.otpSentAt) / 1000))
)
const resendCountdownLabel = computed(() => {
  const minutes = Math.floor(secondsUntilResend.value / 60)
  const seconds = secondsUntilResend.value % 60
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
})
const expiresInMinutes = computed(() => Math.round(props.expiresInSeconds / 60))

function handleOpened() {
  otpCode.value = ''
  now.value = Date.now()
  clearInterval(clockTimer)
  clockTimer = setInterval(() => {
    now.value = Date.now()
  }, 1000)
  otpInput.value?.focus()
}

function handleClosed() {
  clearInterval(clockTimer)
}

onBeforeUnmount(handleClosed)

watch(() => props.otpSentAt, () => {
  otpCode.value = ''
  otpInput.value?.focus()
})

watch(() => props.errorMessage, async (message) => {
  if (!message) return
  otpCode.value = ''
  await nextTick()
  otpInput.value?.focus()
})

watch(otpCode, (code) => {
  if (code.length === OTP_LENGTH && !props.isVerifying) emit('verify', code)
})

function handleSubmit() {
  if (otpCode.value.length === OTP_LENGTH) emit('verify', otpCode.value)
}
</script>

<template>
  <ModalDialog
    v-model:open="isOpen"
    :aria-labelledby="headingId"
    class="max-w-135.5"
    @opened="handleOpened"
    @closed="handleClosed"
  >
    <form novalidate class="relative p-6 sm:p-10" @submit.prevent="handleSubmit">
      <button
        type="button"
        aria-label="ปิด"
        class="absolute top-4 right-4 flex size-9 items-center justify-center rounded-full bg-primary-soft/70 text-muted transition-colors hover:bg-primary-soft hover:text-ink sm:top-7 sm:right-5 sm:size-10"
        @click="isOpen = false"
      >
        <Icon name="lucide:x" class="size-4.5 sm:size-5" />
      </button>

      <h2 :id="headingId" class="pr-10 text-xl leading-tight sm:text-[1.625rem]">
        ยืนยันเบอร์โทรศัพท์
      </h2>
      <p class="mt-2 text-sm text-muted sm:text-[1.0625rem]">
        กรอกรหัส 6 หลักที่ส่งไปที่ {{ formatThaiMobile(phone) }}
      </p>

      <OtpCodeInput
        ref="otpInput"
        v-model="otpCode"
        :length="OTP_LENGTH"
        :is-invalid="Boolean(errorMessage)"
        class="mt-6 sm:mt-8"
      />
      <p v-if="errorMessage" role="alert" class="mt-3 text-center text-sm text-primary-dark">
        {{ errorMessage }}
      </p>

      <div class="mt-6 text-center text-sm sm:mt-8 sm:text-[1.0625rem]">
        <p v-if="secondsUntilResend > 0" class="text-muted">
          ขอรหัสใหม่ได้ใน <span class="tabular-nums">{{ resendCountdownLabel }}</span>
        </p>
        <button
          v-else
          type="button"
          :disabled="isResending"
          class="font-semibold text-primary-dark hover:underline disabled:opacity-60"
          @click="emit('resend')"
        >
          ขอรหัสใหม่
        </button>

        <button type="button" class="mt-1.5 block w-full font-semibold text-primary-dark hover:underline" @click="emit('changePhone')">
          เปลี่ยนเบอร์โทรศัพท์
        </button>
      </div>

      <button
        type="submit"
        :disabled="otpCode.length < OTP_LENGTH || isVerifying"
        class="mt-8 flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-primary text-base font-semibold text-white transition-colors hover:bg-primary-dark disabled:opacity-60 sm:mt-11 sm:h-14 sm:text-lg"
      >
        <Icon v-if="isVerifying" name="lucide:loader-circle" class="size-5 animate-spin" />
        ยืนยัน
      </button>

      <p class="mt-6 text-center text-xs text-muted sm:mt-8 sm:text-[0.9375rem]">
        รหัส OTP ใช้ได้ภายใน {{ expiresInMinutes }} นาที
      </p>
    </form>
  </ModalDialog>
</template>
