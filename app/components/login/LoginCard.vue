<script setup lang="ts">
const { variant = 'card' } = defineProps<{
  variant?: 'card' | 'sheet'
}>()

const isSheet = computed(() => variant === 'sheet')

const route = useRoute()
const { signInWithLine, requestPhoneOtp, verifyPhoneOtp } = useAuth()
const { isOnboardingRequired, refresh: refreshOnboardingStatus } = useMemberOnboarding()

const isOtpDialogOpen = ref(false)
const isWaitingForOnboarding = ref(false)
const otpSentAt = ref(0)
const otpExpiresInSeconds = ref(0)

const phone = ref('')
const acceptedTerms = ref(false)
const marketingOptIn = ref(false)

const phoneError = ref('')
const termsError = ref('')
const otpError = ref('')
const isSigningInWithLine = ref(false)
const isRequestingOtp = ref(false)
const isVerifyingOtp = ref(false)
const resendAfterSeconds = ref(0)

const fieldId = useId()
const termsCheckbox = useTemplateRef<HTMLInputElement>('termsCheckbox')
const phoneInput = useTemplateRef<HTMLInputElement>('phoneInput')

// The sheet design has no consent checkboxes: continuing counts as accepting the terms, and marketing stays opted out
const consents = computed(() => ({
  acceptedTerms: isSheet.value || acceptedTerms.value,
  marketingOptIn: !isSheet.value && marketingOptIn.value
}))

watch(acceptedTerms, (isAccepted) => {
  if (isAccepted) termsError.value = ''
})

function handlePhoneInput(event: Event) {
  const input = event.target as HTMLInputElement
  phone.value = formatThaiMobile(input.value)
  input.value = phone.value
  phoneError.value = ''
}

function ensureTermsAccepted() {
  if (consents.value.acceptedTerms) return true
  termsError.value = 'กรุณายอมรับเงื่อนไขการเป็นสมาชิกและนโยบายความเป็นส่วนตัวก่อน'
  termsCheckbox.value?.focus()
  return false
}

async function finishSignIn() {
  await navigateTo(safeRedirectPath(route.query.redirect), { replace: true })
}

// The welcome dialog in the layout opens by itself for members who haven't onboarded; leave this page once they finish
async function continueAfterSignIn() {
  await refreshOnboardingStatus()
  if (isOnboardingRequired.value) {
    isWaitingForOnboarding.value = true
    return
  }
  await finishSignIn()
}

watch(isOnboardingRequired, async (isRequired) => {
  if (isRequired || !isWaitingForOnboarding.value) return
  isWaitingForOnboarding.value = false
  await finishSignIn()
})

async function handleLineSignIn() {
  if (!ensureTermsAccepted()) return
  isSigningInWithLine.value = true
  try {
    await signInWithLine(consents.value)
    await continueAfterSignIn()
  } catch {
    termsError.value = 'เข้าสู่ระบบด้วย LINE ไม่สำเร็จ กรุณาลองอีกครั้ง'
  } finally {
    isSigningInWithLine.value = false
  }
}

async function sendOtp() {
  isRequestingOtp.value = true
  try {
    const otpRequest = await requestPhoneOtp(digitsOnly(phone.value))
    resendAfterSeconds.value = otpRequest.resendAfterSeconds
    otpExpiresInSeconds.value = otpRequest.expiresInSeconds
    otpSentAt.value = Date.now()
    otpError.value = ''
    isOtpDialogOpen.value = true
  } catch {
    if (isOtpDialogOpen.value) otpError.value = 'ส่งรหัส OTP ไม่สำเร็จ กรุณาลองอีกครั้ง'
    else phoneError.value = 'ส่งรหัส OTP ไม่สำเร็จ กรุณาลองอีกครั้ง'
  } finally {
    isRequestingOtp.value = false
  }
}

async function handleRequestOtp() {
  const isPhoneValid = isValidThaiMobile(phone.value)
  phoneError.value = isPhoneValid ? '' : 'กรุณากรอกเบอร์มือถือ 10 หลักให้ถูกต้อง'
  if (!ensureTermsAccepted() || !isPhoneValid) return
  await sendOtp()
}

async function handleVerifyOtp(code: string) {
  isVerifyingOtp.value = true
  otpError.value = ''
  try {
    await verifyPhoneOtp(digitsOnly(phone.value), code, consents.value)
    isOtpDialogOpen.value = false
    await continueAfterSignIn()
  } catch {
    otpError.value = 'รหัส OTP ไม่ถูกต้องหรือหมดอายุ'
  } finally {
    isVerifyingOtp.value = false
  }
}

async function handleChangePhone() {
  isOtpDialogOpen.value = false
  await nextTick()
  phoneInput.value?.focus()
  phoneInput.value?.select()
}
</script>

<template>
  <section
    :aria-labelledby="`${fieldId}-heading`"
    class="flex flex-col bg-white"
    :class="isSheet
      ? 'rounded-t-[1.75rem] px-4 pt-6 pb-[calc(1.75rem+env(safe-area-inset-bottom))]'
      : 'rounded-[1.25rem] border p-5 xl:p-10'"
  >
    <template v-if="isSheet">
      <h2 :id="`${fieldId}-heading`" class="text-[1.375rem] leading-tight">
        ยินดีต้อนรับสู่ YoYo Member
      </h2>
      <p class="mt-1 text-sm text-muted">
        สมัครฟรี รับทันที 50 แต้ม + คูปองลด 5%
      </p>
    </template>
    <template v-else>
      <h2 :id="`${fieldId}-heading`" class="text-xl leading-tight xl:text-[1.75rem]">
        เข้าสู่ระบบ / สมัครสมาชิก
      </h2>
      <p class="mt-1 text-sm text-muted xl:text-base">
        สมัครฟรี ใช้เวลาไม่ถึง 1 นาที
      </p>
    </template>

    <div :class="isSheet ? 'mt-5' : 'mt-6 xl:mt-7'">
      <button
        type="button"
        :disabled="isSigningInWithLine"
        class="relative flex h-12 w-full items-center justify-center bg-line-green text-base font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-60"
        :class="isSheet ? 'rounded-full' : 'rounded-xl xl:h-15.5 xl:text-lg'"
        @click="handleLineSignIn"
      >
        <span class="absolute left-4 flex size-7 items-center justify-center rounded-lg bg-white font-number text-sm font-semibold text-line-green xl:left-5 xl:size-8 xl:text-base" aria-hidden="true">
          L
        </span>
        <Icon v-if="isSigningInWithLine" name="lucide:loader-circle" class="mr-2 size-5 animate-spin" />
        เข้าสู่ระบบด้วย LINE
      </button>

      <div class="flex items-center gap-4 text-xs text-muted" :class="isSheet ? 'my-4' : 'my-5 xl:my-6 xl:text-sm'" role="separator" aria-label="หรือ">
        <span class="h-px flex-1 bg-border" />
        หรือ
        <span class="h-px flex-1 bg-border" />
      </div>

      <form novalidate @submit.prevent="handleRequestOtp">
        <label
          :for="`${fieldId}-phone`"
          :class="isSheet ? 'sr-only' : 'mb-1.5 block text-sm xl:text-[1.0625rem]'"
        >เบอร์โทรศัพท์</label>
        <div
          class="flex h-12 items-center border-2 bg-white transition-colors focus-within:border-primary"
          :class="[
            phoneError ? 'border-primary' : isSheet ? 'border-border' : 'border-muted/25',
            isSheet ? 'rounded-full' : 'rounded-xl xl:h-14.5'
          ]"
        >
          <div v-if="isSheet" class="relative flex h-6 shrink-0 items-center border-r border-border">
            <label :for="`${fieldId}-country-code`" class="sr-only">รหัสประเทศ</label>
            <!-- Only Thai mobiles are supported (see isValidThaiMobile), so +66 is the sole option -->
            <select
              :id="`${fieldId}-country-code`"
              class="h-full cursor-pointer appearance-none rounded-l-full bg-transparent pr-8 pl-5 text-sm font-semibold focus:outline-none"
            >
              <option value="+66">
                +66
              </option>
            </select>
            <Icon name="lucide:chevron-down" class="pointer-events-none absolute right-3 size-4 text-muted" aria-hidden="true" />
          </div>
          <input
            :id="`${fieldId}-phone`"
            ref="phoneInput"
            :value="phone"
            type="tel"
            inputmode="tel"
            autocomplete="tel-national"
            :placeholder="isSheet ? 'เบอร์โทรศัพท์' : '08X-XXX-XXXX'"
            :aria-invalid="phoneError ? 'true' : undefined"
            :aria-describedby="phoneError ? `${fieldId}-phone-error` : undefined"
            class="h-full min-w-0 flex-1 rounded-[inherit] bg-transparent text-base placeholder:text-muted/60 focus:outline-none"
            :class="isSheet ? 'px-3' : 'px-4 xl:px-5 xl:text-lg'"
            @input="handlePhoneInput"
          >
        </div>
        <p v-if="phoneError" :id="`${fieldId}-phone-error`" class="mt-2 text-sm text-primary-dark">
          {{ phoneError }}
        </p>

        <button
          type="submit"
          :disabled="isRequestingOtp"
          class="mt-4 flex h-12 w-full items-center justify-center gap-2 font-semibold text-white transition-colors disabled:opacity-60"
          :class="isSheet ? 'rounded-full bg-cocoa text-sm hover:bg-ink' : 'rounded-xl bg-primary text-base hover:bg-primary-dark xl:mt-5 xl:h-14 xl:text-lg'"
        >
          <Icon v-if="isRequestingOtp" name="lucide:loader-circle" class="size-5 animate-spin" />
          ขอรหัส OTP
        </button>
      </form>

      <template v-if="isSheet">
        <p v-if="termsError" role="alert" class="mt-3 text-center text-sm text-primary-dark">
          {{ termsError }}
        </p>
        <p class="mt-5 text-center text-xs text-muted">
          การเข้าสู่ระบบถือว่ายอมรับ
          <NuxtLink to="/terms/membership" target="_blank" class="text-ink underline underline-offset-2">เงื่อนไข</NuxtLink>
          และ
          <NuxtLink to="/privacy" target="_blank" class="text-ink underline underline-offset-2">นโยบายความเป็นส่วนตัว</NuxtLink>
        </p>
      </template>

      <template v-else>
        <hr class="mt-6 xl:mt-7">

        <div class="mt-5 space-y-3 text-sm xl:mt-6 xl:space-y-4 xl:text-base">
          <label class="flex cursor-pointer items-start gap-3">
            <input
              ref="termsCheckbox"
              v-model="acceptedTerms"
              type="checkbox"
              :aria-invalid="termsError ? 'true' : undefined"
              :aria-describedby="termsError ? `${fieldId}-terms-error` : undefined"
              class="mt-0.5 size-4.5 shrink-0 cursor-pointer accent-primary xl:size-5"
            >
            <span>
              ยอมรับ
              <NuxtLink to="/terms/membership" target="_blank" class="font-semibold text-primary-dark hover:underline">เงื่อนไขการเป็นสมาชิก</NuxtLink>
              และ
              <NuxtLink to="/privacy" target="_blank" class="font-semibold text-primary-dark hover:underline">นโยบายความเป็นส่วนตัว</NuxtLink>
            </span>
          </label>
          <p v-if="termsError" :id="`${fieldId}-terms-error`" class="text-sm text-primary-dark">
            {{ termsError }}
          </p>

          <label class="flex cursor-pointer items-start gap-3">
            <input
              v-model="marketingOptIn"
              type="checkbox"
              class="mt-0.5 size-4.5 shrink-0 cursor-pointer accent-primary xl:size-5"
            >
            <span>ยินยอมรับข่าวสารและโปรโมชันจาก YoYo (ไม่บังคับ)</span>
          </label>
        </div>
      </template>
    </div>

    <OtpVerificationDialog
      v-model:open="isOtpDialogOpen"
      :variant="isSheet ? 'screen' : 'dialog'"
      :phone="phone"
      :otp-sent-at="otpSentAt"
      :resend-after-seconds="resendAfterSeconds"
      :expires-in-seconds="otpExpiresInSeconds"
      :is-verifying="isVerifyingOtp"
      :is-resending="isRequestingOtp"
      :error-message="otpError"
      @verify="handleVerifyOtp"
      @resend="sendOtp"
      @change-phone="handleChangePhone"
    />
    <aside v-if="!isSheet" class="mt-6 flex gap-3 rounded-2xl bg-cream p-4 xl:mt-8 xl:gap-3.5 xl:px-6 xl:py-5">
      <Icon name="lucide:info" class="mt-0.5 size-4.5 shrink-0 text-muted xl:size-5" />
      <div>
        <p class="text-sm font-semibold xl:text-base">
          ซื้อสินค้าผ่าน Shopee / TikTok / Lazada อยู่แล้ว?
        </p>
        <p class="mt-1 text-xs text-muted xl:text-[0.9375rem]">
          สมัครแล้วกรอกเลขคำสั่งซื้อย้อนหลังได้ภายใน 30 วัน
        </p>
      </div>
    </aside>
  </section>
</template>
