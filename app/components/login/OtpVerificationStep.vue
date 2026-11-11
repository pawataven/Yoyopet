<script setup lang="ts">
const props = defineProps<{
  phone: string
  resendAfterSeconds: number
  isVerifying: boolean
  isResending: boolean
  errorMessage: string
}>()

const emit = defineEmits<{
  verify: [code: string]
  resend: []
  changePhone: []
}>()

const OTP_LENGTH = 6
const otpCode = ref('')
const otpInputId = useId()
const otpInput = useTemplateRef<HTMLInputElement>('otpInput')

const secondsUntilResend = ref(props.resendAfterSeconds)
let countdownTimer: ReturnType<typeof setInterval> | undefined

function startCountdown(seconds: number) {
  clearInterval(countdownTimer)
  secondsUntilResend.value = seconds
  countdownTimer = setInterval(() => {
    secondsUntilResend.value = Math.max(0, secondsUntilResend.value - 1)
    if (secondsUntilResend.value === 0) clearInterval(countdownTimer)
  }, 1000)
}

watch(() => props.resendAfterSeconds, startCountdown)

onMounted(() => {
  startCountdown(props.resendAfterSeconds)
  otpInput.value?.focus()
})
onBeforeUnmount(() => clearInterval(countdownTimer))

function handleOtpInput(event: Event) {
  const input = event.target as HTMLInputElement
  otpCode.value = digitsOnly(input.value).slice(0, OTP_LENGTH)
  input.value = otpCode.value
  if (otpCode.value.length === OTP_LENGTH && !props.isVerifying) emit('verify', otpCode.value)
}

function handleSubmit() {
  if (otpCode.value.length === OTP_LENGTH) emit('verify', otpCode.value)
}
</script>

<template>
  <form novalidate @submit.prevent="handleSubmit">
    <p class="text-sm text-muted xl:text-base">
      ส่งรหัส OTP 6 หลักไปที่
      <span class="font-semibold text-ink">{{ formatThaiMobile(phone) }}</span>
      <button type="button" class="ml-1 font-semibold text-primary-dark hover:underline" @click="emit('changePhone')">
        เปลี่ยนเบอร์
      </button>
    </p>

    <label :for="otpInputId" class="mt-5 mb-1.5 block text-sm xl:mt-6 xl:text-[1.0625rem]">รหัส OTP</label>
    <input
      :id="otpInputId"
      ref="otpInput"
      :value="otpCode"
      type="text"
      inputmode="numeric"
      autocomplete="one-time-code"
      :maxlength="OTP_LENGTH"
      placeholder="••••••"
      :aria-invalid="errorMessage ? 'true' : undefined"
      :aria-describedby="errorMessage ? `${otpInputId}-error` : undefined"
      class="h-12 w-full rounded-xl border-2 bg-white px-4 text-center font-number text-xl font-semibold tracking-[0.5em] transition-colors placeholder:text-muted/40 focus:border-primary focus:outline-none xl:h-14.5 xl:text-2xl"
      :class="errorMessage ? 'border-primary' : 'border-muted/25'"
      @input="handleOtpInput"
    >
    <p v-if="errorMessage" :id="`${otpInputId}-error`" class="mt-2 text-sm text-primary-dark">
      {{ errorMessage }}
    </p>

    <button
      type="submit"
      :disabled="otpCode.length < OTP_LENGTH || isVerifying"
      class="mt-4 flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-primary text-base font-semibold text-white transition-colors hover:bg-primary-dark disabled:opacity-60 xl:mt-5 xl:h-14 xl:text-lg"
    >
      <Icon v-if="isVerifying" name="lucide:loader-circle" class="size-5 animate-spin" />
      ยืนยันรหัส
    </button>

    <p class="mt-4 text-center text-sm text-muted xl:text-base">
      ไม่ได้รับรหัส?
      <button
        v-if="secondsUntilResend === 0"
        type="button"
        :disabled="isResending"
        class="font-semibold text-primary-dark hover:underline disabled:opacity-60"
        @click="emit('resend')"
      >
        ส่งรหัสอีกครั้ง
      </button>
      <span v-else>ขอรหัสใหม่ได้ใน <span class="font-number font-semibold">{{ secondsUntilResend }}</span> วินาที</span>
    </p>
  </form>
</template>
