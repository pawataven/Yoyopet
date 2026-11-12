<script setup lang="ts">
import type { MemberOnboarding } from '~/types/member'

const { onboardingStatus, isOnboardingRequired, completeOnboarding } = useMemberOnboarding()
const { signOut } = useAuth()

// Shown on every page until the member finishes it once; the backend's onboarding status decides, not the sign-in flow
const isOpen = computed({
  get: () => isOnboardingRequired.value,
  set: () => {}
})
const welcomeBonusPoints = computed(() => onboardingStatus.value?.welcomeBonusPoints ?? 0)
const formattedBonusPoints = computed(() => formatNumber(welcomeBonusPoints.value))

const SIGN_UP_STEP = 2
const SIGN_UP_STEP_COUNT = 3

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

const fieldId = useId()
const headingId = `${fieldId}-heading`
const firstNameInput = useTemplateRef<HTMLInputElement>('firstNameInput')

const form = reactive({
  firstName: '',
  lastName: '',
  birthDate: null as string | null,
  email: '',
  referralCode: '',
  acceptedTerms: onboardingStatus.value?.hasAcceptedPrivacyPolicy ?? false,
  marketingOptIn: false
})

const errors = reactive({
  firstName: '',
  lastName: '',
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
watch(() => form.birthDate, () => { errors.birthDate = '' })
watch(() => form.email, () => { errors.email = '' })
watch(() => form.acceptedTerms, () => { errors.acceptedTerms = '' })

function validate() {
  errors.firstName = form.firstName ? '' : 'กรุณากรอกชื่อ'
  errors.lastName = form.lastName ? '' : 'กรุณากรอกนามสกุล'
  errors.birthDate = form.birthDate ? '' : 'กรุณาเลือกวันเกิด'
  errors.email = !form.email || EMAIL_PATTERN.test(form.email) ? '' : 'รูปแบบอีเมลไม่ถูกต้อง'
  errors.acceptedTerms = form.acceptedTerms ? '' : 'กรุณายอมรับเงื่อนไขสมาชิกและนโยบายความเป็นส่วนตัว'
  return Object.values(errors).every(error => !error)
}

async function handleSubmit() {
  if (!validate()) return
  isSubmitting.value = true
  submitError.value = ''
  const onboarding: MemberOnboarding = {
    firstName: form.firstName,
    lastName: form.lastName,
    birthDate: form.birthDate,
    email: form.email || null,
    referralCode: form.referralCode.toUpperCase() || null,
    acceptedTerms: form.acceptedTerms,
    marketingOptIn: form.marketingOptIn
  }
  try {
    await completeOnboarding(onboarding)
  } catch {
    submitError.value = 'บันทึกข้อมูลไม่สำเร็จ กรุณาลองอีกครั้ง'
  } finally {
    isSubmitting.value = false
  }
}

// The account already exists after OTP, so leaving sign-up signs out; the form returns on the next sign-in
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
        ขั้นที่ {{ SIGN_UP_STEP }} จาก {{ SIGN_UP_STEP_COUNT }} · ข้อมูลของคุณ
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
            :aria-describedby="errorId('firstName')"
            :class="textFieldClass(Boolean(errors.firstName))"
          >
          <p v-if="errors.firstName" :id="errorId('firstName')" class="mt-1.5 text-sm text-primary-dark">
            {{ errors.firstName }}
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
            :aria-invalid="errors.lastName ? 'true' : undefined"
            :aria-describedby="errorId('lastName')"
            :class="textFieldClass(Boolean(errors.lastName))"
          >
          <p v-if="errors.lastName" :id="errorId('lastName')" class="mt-1.5 text-sm text-primary-dark">
            {{ errors.lastName }}
          </p>
        </div>

        <div class="md:col-span-2">
          <label :for="`${fieldId}-birth-date`" :class="labelClass">วันเกิด <span class="text-primary" aria-hidden="true">*</span></label>
          <DateField
            :id="`${fieldId}-birth-date`"
            v-model="form.birthDate"
            placeholder="เลือกวันเกิด"
            :max="todayIsoDate"
            :invalid="Boolean(errors.birthDate)"
            :described-by="errors.birthDate ? errorId('birthDate') : `${fieldId}-birth-date-hint`"
          />
          <p v-if="errors.birthDate" :id="errorId('birthDate')" class="mt-1.5 text-sm text-primary-dark">
            {{ errors.birthDate }}
          </p>
          <p v-else :id="`${fieldId}-birth-date-hint`" class="mt-1.5 text-xs text-muted xl:text-sm">
            ใช้แจกคูปองวันเกิดทุกปี
          </p>
        </div>

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

        <div>
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
            <span class="mt-0.5 block text-xs text-muted xl:text-sm">เปลี่ยนได้ทุกเมื่อในหน้าบัญชีของฉัน</span>
          </span>
        </label>
      </div>

      <p v-if="submitError" role="alert" class="mt-4 text-center text-sm text-primary-dark">
        {{ submitError }}
      </p>

      <button
        type="submit"
        :disabled="isSubmitting"
        class="mt-6 flex h-12 w-full items-center justify-center gap-2 rounded-full bg-primary text-base font-semibold text-white transition-colors hover:bg-primary-dark disabled:opacity-60 xl:h-14 xl:text-lg"
      >
        <Icon v-if="isSubmitting" name="lucide:loader-circle" class="size-5 animate-spin" />
        {{ welcomeBonusPoints > 0 ? `สมัครสมาชิก รับ ${formattedBonusPoints} แต้ม` : 'สมัครสมาชิก' }}
      </button>
    </form>
  </ModalDialog>
</template>
