<script setup lang="ts">
import type { MemberOnboarding } from '~/types/member'

const { onboardingStatus, isOnboardingRequired, completeOnboarding, requestPhoneVerification, verifyPhone } = useMemberOnboarding()
const { signOut } = useAuth()
const { lineOfficialAccount } = useAppConfig()

// Shown on every page until the member finishes it once; the backend's onboarding status decides, not the sign-in flow
const isOpen = computed({
  get: () => isOnboardingRequired.value,
  set: () => {}
})
const welcomeBonusPoints = computed(() => onboardingStatus.value?.welcomeBonusPoints ?? 0)
const formattedBonusPoints = computed(() => formatNumber(welcomeBonusPoints.value))

// LINE gives a name but no phone, so LINE sign-ups add and verify a phone here; phone sign-ups verified it at sign-in
const isLineSignUp = computed(() => onboardingStatus.value?.signUpMethod === 'line')
const lineProfile = computed(() => onboardingStatus.value?.lineProfile ?? null)

const SIGN_UP_STEP = 2
const SIGN_UP_STEP_COUNT = 3

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

const fieldId = useId()
const headingId = `${fieldId}-heading`
const firstNameInput = useTemplateRef<HTMLInputElement>('firstNameInput')
const phoneInput = useTemplateRef<HTMLInputElement>('phoneInput')

// The dialog only mounts once the onboarding status has loaded, so the LINE name is available here
const form = reactive({
  firstName: lineProfile.value?.displayName ?? '',
  lastName: '',
  phone: '',
  birthDate: null as string | null,
  email: '',
  referralCode: '',
  // Always unticked: the member gives explicit consent here, even if the sign-in screen implied it
  acceptedTerms: false,
  marketingOptIn: false
})

const errors = reactive({
  firstName: '',
  lastName: '',
  phone: '',
  birthDate: '',
  email: '',
  acceptedTerms: ''
})
const submitError = ref('')
const isSubmitting = ref(false)
const isSigningOut = ref(false)

const todayIsoDate = new Date().toISOString().slice(0, 10)

watch(() => form.firstName, () => { errors.firstName = '' })
watch(() => form.lastName, () => { errors.lastName = '' })
watch(() => form.phone, () => { errors.phone = '' })
watch(() => form.birthDate, () => { errors.birthDate = '' })
watch(() => form.email, () => { errors.email = '' })
watch(() => form.acceptedTerms, () => { errors.acceptedTerms = '' })

function handlePhoneInput(event: Event) {
  const input = event.target as HTMLInputElement
  form.phone = formatThaiMobile(input.value)
  input.value = form.phone
}

function validate() {
  errors.firstName = form.firstName ? '' : 'กรุณากรอกชื่อ'
  errors.lastName = form.lastName ? '' : 'กรุณากรอกนามสกุล'
  errors.phone = !isLineSignUp.value || isValidThaiMobile(form.phone) ? '' : 'กรุณากรอกเบอร์มือถือ 10 หลักให้ถูกต้อง'
  errors.birthDate = form.birthDate ? '' : 'กรุณาเลือกวันเกิด'
  errors.email = isLineSignUp.value || !form.email || EMAIL_PATTERN.test(form.email) ? '' : 'รูปแบบอีเมลไม่ถูกต้อง'
  errors.acceptedTerms = form.acceptedTerms ? '' : 'กรุณายอมรับเงื่อนไขสมาชิกและนโยบายความเป็นส่วนตัว'
  return Object.values(errors).every(error => !error)
}

async function finishSignUp() {
  const onboarding: MemberOnboarding = {
    firstName: form.firstName,
    lastName: form.lastName,
    birthDate: form.birthDate,
    email: isLineSignUp.value ? null : form.email || null,
    referralCode: form.referralCode.toUpperCase() || null,
    acceptedTerms: form.acceptedTerms,
    marketingOptIn: form.marketingOptIn
  }
  isSubmitting.value = true
  submitError.value = ''
  try {
    await completeOnboarding(onboarding)
  } catch {
    submitError.value = 'บันทึกข้อมูลไม่สำเร็จ กรุณาลองอีกครั้ง'
  } finally {
    isSubmitting.value = false
  }
}

const isOtpOpen = ref(false)
const otpSentAt = ref(0)
const otpResendAfterSeconds = ref(0)
const otpExpiresInSeconds = ref(0)
const otpError = ref('')
const isSendingOtp = ref(false)
const isVerifyingOtp = ref(false)

async function sendPhoneOtp() {
  isSendingOtp.value = true
  try {
    const request = await requestPhoneVerification(digitsOnly(form.phone))
    otpResendAfterSeconds.value = request.resendAfterSeconds
    otpExpiresInSeconds.value = request.expiresInSeconds
    otpSentAt.value = Date.now()
    otpError.value = ''
    isOtpOpen.value = true
  } catch (error) {
    const isTaken = error instanceof Error && error.message === 'phone_in_use'
    if (isTaken) {
      isOtpOpen.value = false
      errors.phone = 'เบอร์นี้ใช้กับบัญชีอื่นแล้ว เข้าสู่ระบบด้วยเบอร์นี้แทน หรือใช้เบอร์อื่น'
    } else if (isOtpOpen.value) {
      otpError.value = 'ส่งรหัส OTP ไม่สำเร็จ กรุณาลองอีกครั้ง'
    } else {
      submitError.value = 'ส่งรหัส OTP ไม่สำเร็จ กรุณาลองอีกครั้ง'
    }
  } finally {
    isSendingOtp.value = false
  }
}

async function handleVerifyOtp(code: string) {
  isVerifyingOtp.value = true
  otpError.value = ''
  try {
    await verifyPhone(digitsOnly(form.phone), code)
    isOtpOpen.value = false
    await finishSignUp()
  } catch {
    otpError.value = 'รหัส OTP ไม่ถูกต้องหรือหมดอายุ'
  } finally {
    isVerifyingOtp.value = false
  }
}

async function handleChangePhone() {
  isOtpOpen.value = false
  await nextTick()
  phoneInput.value?.focus()
  phoneInput.value?.select()
}

async function handleSubmit() {
  if (!validate()) return
  submitError.value = ''
  if (isLineSignUp.value) await sendPhoneOtp()
  else await finishSignUp()
}

// The account already exists after sign-in, so leaving sign-up signs out; the form returns on the next sign-in
async function cancelSignUp() {
  isSigningOut.value = true
  try {
    await signOut('/login')
  } finally {
    isSigningOut.value = false
  }
}

function errorId(field: keyof typeof errors) {
  return errors[field] ? `${fieldId}-${field}-error` : undefined
}

const submitLabel = computed(() => {
  if (isLineSignUp.value) return 'ถัดไป: ยืนยันเบอร์'
  return welcomeBonusPoints.value > 0 ? `สมัครสมาชิก รับ ${formattedBonusPoints.value} แต้ม` : 'สมัครสมาชิก'
})

function textFieldClass(hasError: boolean) {
  return [
    'h-12 w-full rounded-xl border-2 bg-white px-4 text-base transition-colors placeholder:text-muted/60 focus:border-primary focus:outline-none xl:h-14 xl:text-lg',
    hasError ? 'border-primary' : 'border-muted/25'
  ]
}

const labelClass = 'mb-1.5 block text-sm font-semibold xl:text-base'
const checkboxClass = 'peer size-full cursor-pointer appearance-none rounded-md border-2 border-muted/25 bg-white transition-colors checked:border-primary checked:bg-primary focus-visible:ring-4 focus-visible:ring-primary-soft focus-visible:outline-none'
</script>

<template>
  <!-- Not dismissible: the account exists already, but it isn't usable until the member accepts the terms -->
  <ModalDialog
    v-model:open="isOpen"
    :dismissible="false"
    fullscreen="mobile"
    :aria-labelledby="headingId"
    class="md:max-w-160"
    @opened="firstNameInput?.focus()"
  >
    <header class="sticky top-0 z-10 border-b bg-white px-4 pt-[calc(0.75rem+env(safe-area-inset-top))] pb-3 md:static md:px-10 md:pt-6 md:pb-4">
      <div class="relative flex h-11 items-center justify-center">
        <button
          type="button"
          aria-label="ยกเลิกการสมัครและออกจากระบบ"
          :disabled="isSigningOut"
          class="absolute left-0 flex size-10 items-center justify-center rounded-full bg-cream transition-colors hover:bg-primary-soft disabled:opacity-60"
          @click="cancelSignUp"
        >
          <Icon name="lucide:chevron-left" class="size-5.5" />
        </button>
        <h2 :id="headingId" class="text-lg xl:text-xl">
          สมัครสมาชิก
        </h2>
      </div>
    </header>

    <form novalidate class="px-4 pt-4 pb-[calc(1.5rem+env(safe-area-inset-bottom))] md:px-10 md:pt-5 md:pb-10" @submit.prevent="handleSubmit">
      <div v-if="isLineSignUp && lineProfile" class="mb-4 flex items-center gap-3 rounded-2xl bg-success/10 px-4 py-3">
        <span class="flex size-11 shrink-0 items-center justify-center overflow-hidden rounded-full bg-white">
          <img v-if="lineProfile.pictureUrl" :src="lineProfile.pictureUrl" alt="" class="size-full object-cover">
          <CatAvatarIcon v-else class="aspect-35/40 h-[62%] translate-y-[8%]" />
        </span>
        <div class="min-w-0 flex-1">
          <p class="text-xs text-success">
            เข้าสู่ระบบด้วย LINE แล้ว
          </p>
          <p class="truncate font-heading text-base">
            {{ lineProfile.displayName }}
          </p>
        </div>
        <span class="flex size-9 shrink-0 items-center justify-center rounded-lg bg-line-green font-number text-[0.625rem] font-semibold text-white" aria-hidden="true">LINE</span>
      </div>

      <div
        role="progressbar"
        :aria-valuenow="SIGN_UP_STEP"
        aria-valuemin="1"
        :aria-valuemax="SIGN_UP_STEP_COUNT"
        :aria-label="`ขั้นที่ ${SIGN_UP_STEP} จาก ${SIGN_UP_STEP_COUNT}`"
        class="h-1.5 overflow-hidden rounded-full bg-primary-soft"
      >
        <div class="h-full rounded-full bg-primary" :style="{ width: `${(SIGN_UP_STEP / SIGN_UP_STEP_COUNT) * 100}%` }" />
      </div>
      <p class="mt-2 text-xs text-muted xl:text-sm">
        <template v-if="isLineSignUp">
          อีกนิดเดียว · กรอกข้อมูลที่ LINE ไม่มีให้
        </template>
        <template v-else>
          ขั้นที่ {{ SIGN_UP_STEP }} จาก {{ SIGN_UP_STEP_COUNT }} · ข้อมูลของคุณ
        </template>
      </p>

      <div class="mt-4 grid grid-cols-1 gap-x-4 gap-y-4 md:grid-cols-2 md:gap-y-5">
        <div>
          <label :for="`${fieldId}-first-name`" :class="labelClass">ชื่อ <span class="text-primary" aria-hidden="true">*</span></label>
          <input
            :id="`${fieldId}-first-name`"
            ref="firstNameInput"
            v-model.trim="form.firstName"
            type="text"
            required
            autocomplete="given-name"
            :aria-invalid="errors.firstName ? 'true' : undefined"
            :aria-describedby="errorId('firstName') ?? (isLineSignUp ? `${fieldId}-first-name-hint` : undefined)"
            :class="textFieldClass(Boolean(errors.firstName))"
          >
          <p v-if="errors.firstName" :id="errorId('firstName')" class="mt-1.5 text-sm text-primary-dark">
            {{ errors.firstName }}
          </p>
          <p v-else-if="isLineSignUp" :id="`${fieldId}-first-name-hint`" class="mt-1.5 text-xs text-muted">
            ดึงจากชื่อ LINE แก้ได้
          </p>
        </div>

        <div>
          <label :for="`${fieldId}-last-name`" :class="labelClass">นามสกุล <span class="text-primary" aria-hidden="true">*</span></label>
          <input
            :id="`${fieldId}-last-name`"
            v-model.trim="form.lastName"
            type="text"
            required
            autocomplete="family-name"
            placeholder="นามสกุล"
            :aria-invalid="errors.lastName ? 'true' : undefined"
            :aria-describedby="errorId('lastName')"
            :class="textFieldClass(Boolean(errors.lastName))"
          >
          <p v-if="errors.lastName" :id="errorId('lastName')" class="mt-1.5 text-sm text-primary-dark">
            {{ errors.lastName }}
          </p>
        </div>

        <div v-if="isLineSignUp" class="md:col-span-2">
          <label :for="`${fieldId}-phone`" :class="labelClass">เบอร์โทรศัพท์ <span class="text-primary" aria-hidden="true">*</span></label>
          <input
            :id="`${fieldId}-phone`"
            ref="phoneInput"
            :value="form.phone"
            type="tel"
            inputmode="tel"
            autocomplete="tel-national"
            placeholder="08x-xxx-xxxx"
            required
            :aria-invalid="errors.phone ? 'true' : undefined"
            :aria-describedby="errorId('phone') ?? `${fieldId}-phone-hint`"
            :class="textFieldClass(Boolean(errors.phone))"
            @input="handlePhoneInput"
          >
          <p v-if="errors.phone" :id="errorId('phone')" class="mt-1.5 text-sm text-primary-dark">
            {{ errors.phone }}
          </p>
          <p v-else :id="`${fieldId}-phone-hint`" class="mt-1.5 text-xs text-muted">
            1 เบอร์ = 1 บัญชี · ยืนยันด้วย OTP ขั้นถัดไป
          </p>
        </div>

        <div class="md:col-span-2">
          <label :for="`${fieldId}-birth-date`" :class="labelClass">วันเกิด <span class="text-primary" aria-hidden="true">*</span></label>
          <DateField
            :id="`${fieldId}-birth-date`"
            v-model="form.birthDate"
            placeholder="วว / ดด / ปปปป"
            :max="todayIsoDate"
            :invalid="Boolean(errors.birthDate)"
            :described-by="errors.birthDate ? errorId('birthDate') : (isLineSignUp ? undefined : `${fieldId}-birth-date-hint`)"
          />
          <p v-if="errors.birthDate" :id="errorId('birthDate')" class="mt-1.5 text-sm text-primary-dark">
            {{ errors.birthDate }}
          </p>
          <p v-else-if="!isLineSignUp" :id="`${fieldId}-birth-date-hint`" class="mt-1.5 text-xs text-muted xl:text-sm">
            ใช้แจกคูปองวันเกิดทุกปี
          </p>
        </div>

        <template v-if="!isLineSignUp">
          <div>
            <label :for="`${fieldId}-email`" :class="labelClass">
              อีเมล <span class="ml-1 text-xs font-normal text-muted">(ไม่บังคับ)</span>
            </label>
            <input
              :id="`${fieldId}-email`"
              v-model.trim="form.email"
              type="email"
              inputmode="email"
              autocomplete="email"
              placeholder="name@email.com"
              :aria-invalid="errors.email ? 'true' : undefined"
              :aria-describedby="errorId('email')"
              :class="textFieldClass(Boolean(errors.email))"
            >
            <p v-if="errors.email" :id="errorId('email')" class="mt-1.5 text-sm text-primary-dark">
              {{ errors.email }}
            </p>
          </div>
        </template>

        <!-- Both sign-up methods take a referral code, so a friend who picks LINE still credits whoever invited them -->
        <div :class="isLineSignUp && 'md:col-span-2'">
          <label :for="`${fieldId}-referral-code`" :class="labelClass">
            รหัสชวนเพื่อน <span class="ml-1 text-xs font-normal text-muted">(ไม่บังคับ)</span>
          </label>
          <input
            :id="`${fieldId}-referral-code`"
            v-model.trim="form.referralCode"
            type="text"
            autocomplete="off"
            autocapitalize="characters"
            spellcheck="false"
            placeholder="ถ้ามี"
            :class="textFieldClass(false)"
          >
        </div>
      </div>

      <div class="mt-6 space-y-4 text-sm xl:text-base">
        <div>
          <label class="flex cursor-pointer items-start gap-3">
            <span class="relative mt-px flex size-5.5 shrink-0">
              <input
                v-model="form.acceptedTerms"
                type="checkbox"
                :aria-invalid="errors.acceptedTerms ? 'true' : undefined"
                :aria-describedby="errorId('acceptedTerms')"
                :class="[checkboxClass, errors.acceptedTerms && 'border-primary']"
              >
              <Icon name="lucide:check" class="pointer-events-none absolute inset-0 m-auto size-3.5 text-white opacity-0 peer-checked:opacity-100" aria-hidden="true" />
            </span>
            <span>
              ยอมรับ<NuxtLink to="/terms/membership" target="_blank" class="hover:text-primary-dark hover:underline">เงื่อนไขสมาชิก</NuxtLink>และ<NuxtLink to="/privacy" target="_blank" class="hover:text-primary-dark hover:underline">นโยบายความเป็นส่วนตัว</NuxtLink>
            </span>
          </label>
          <p v-if="errors.acceptedTerms" :id="errorId('acceptedTerms')" class="mt-1.5 pl-8.5 text-sm text-primary-dark">
            {{ errors.acceptedTerms }}
          </p>
        </div>

        <label class="flex cursor-pointer items-start gap-3">
          <span class="relative mt-px flex size-5.5 shrink-0">
            <input v-model="form.marketingOptIn" type="checkbox" :class="checkboxClass">
            <Icon name="lucide:check" class="pointer-events-none absolute inset-0 m-auto size-3.5 text-white opacity-0 peer-checked:opacity-100" aria-hidden="true" />
          </span>
          <span>
            ยินยอมรับข่าวสารและโปรโมชันจาก YoYo
            <span class="mt-0.5 block text-xs text-muted xl:text-sm">
              {{ isLineSignUp ? 'ไม่บังคับ · เปลี่ยนได้ทุกเมื่อ' : 'เปลี่ยนได้ทุกเมื่อในหน้าบัญชีของฉัน' }}
            </span>
          </span>
        </label>
      </div>

      <p
        v-if="isLineSignUp && onboardingStatus?.isLineOfficialAccountFriend"
        class="mt-5 flex items-center gap-2.5 rounded-2xl bg-cream px-4 py-3 text-xs"
      >
        <Icon name="lucide:check" class="size-4 shrink-0 text-success" aria-hidden="true" />
        เป็นเพื่อน LINE {{ lineOfficialAccount.lineId }} แล้ว รับแจ้งเตือนได้
      </p>

      <p v-if="submitError" role="alert" class="mt-4 text-center text-sm text-primary-dark">
        {{ submitError }}
      </p>

      <button
        type="submit"
        :disabled="isSubmitting || isSendingOtp"
        class="mt-5 flex h-12 w-full items-center justify-center gap-2 rounded-full bg-primary text-base font-semibold text-white transition-colors hover:bg-primary-dark disabled:opacity-60 xl:h-14 xl:text-lg"
      >
        <Icon v-if="isSubmitting || isSendingOtp" name="lucide:loader-circle" class="size-5 animate-spin" />
        {{ submitLabel }}
      </button>
    </form>

    <OtpVerificationDialog
      v-if="isLineSignUp"
      v-model:open="isOtpOpen"
      variant="screen"
      :phone="form.phone"
      :otp-sent-at="otpSentAt"
      :resend-after-seconds="otpResendAfterSeconds"
      :expires-in-seconds="otpExpiresInSeconds"
      :is-verifying="isVerifyingOtp || isSubmitting"
      :is-resending="isSendingOtp"
      :error-message="otpError"
      @verify="handleVerifyOtp"
      @resend="sendPhoneOtp"
      @change-phone="handleChangePhone"
    />
  </ModalDialog>
</template>
