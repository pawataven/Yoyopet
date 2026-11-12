<script setup lang="ts">
import type { MemberOnboarding, PetOwnership } from '~/types/member'

const { onboardingStatus, isOnboardingRequired, completeOnboarding } = useMemberOnboarding()

// Shown on every page until the member finishes it once; the backend's onboarding status decides, not the sign-in flow
const isOpen = computed({
  get: () => isOnboardingRequired.value,
  set: () => {}
})
const welcomeBonusPoints = computed(() => onboardingStatus.value?.welcomeBonusPoints ?? 0)

const fieldId = useId()
const headingId = `${fieldId}-heading`
const firstNameInput = useTemplateRef<HTMLInputElement>('firstNameInput')

const petOwnershipOptions: { value: PetOwnership, label: string }[] = [
  { value: 'dog', label: 'สุนัข' },
  { value: 'cat', label: 'แมว' },
  { value: 'both', label: 'ทั้งสองอย่าง' },
  { value: 'other', label: 'อื่น ๆ' }
]

const onboarding = reactive<MemberOnboarding>({
  firstName: '',
  lastName: '',
  birthDate: null,
  petOwnership: null,
  acceptedPrivacyPolicy: onboardingStatus.value?.hasAcceptedPrivacyPolicy ?? false,
  lineNotificationsOptIn: true
})

const nameError = ref('')
const privacyError = ref('')
const submitError = ref('')
const isSubmitting = ref(false)

const todayIsoDate = new Date().toISOString().slice(0, 10)
const formattedBonusPoints = computed(() => formatNumber(welcomeBonusPoints.value))

watch(() => [onboarding.firstName, onboarding.lastName], () => {
  nameError.value = ''
})
watch(() => onboarding.acceptedPrivacyPolicy, (isAccepted) => {
  if (isAccepted) privacyError.value = ''
})

function validate() {
  nameError.value = onboarding.firstName && onboarding.lastName ? '' : 'กรุณากรอกชื่อและนามสกุล'
  privacyError.value = onboarding.acceptedPrivacyPolicy ? '' : 'กรุณายินยอมนโยบายความเป็นส่วนตัวเพื่อเริ่มใช้งาน'
  return !nameError.value && !privacyError.value
}

async function handleSubmit() {
  if (!validate()) return
  isSubmitting.value = true
  submitError.value = ''
  try {
    await completeOnboarding({ ...onboarding })
  } catch {
    submitError.value = 'บันทึกข้อมูลไม่สำเร็จ กรุณาลองอีกครั้ง'
  } finally {
    isSubmitting.value = false
  }
}

const textFieldClass = 'h-12 w-full rounded-xl border-2 bg-white px-4 text-base transition-colors placeholder:text-muted/60 focus:border-primary focus:outline-none xl:h-14.5 xl:px-5 xl:text-lg'
const labelClass = 'mb-1.5 block text-sm xl:text-base'
</script>

<template>
  <!-- Not dismissible: the account exists already, but it isn't usable until the member accepts the privacy policy -->
  <ModalDialog
    v-model:open="isOpen"
    :dismissible="false"
    :aria-labelledby="headingId"
    class="max-w-207"
    @opened="firstNameInput?.focus()"
  >
    <form novalidate class="p-6 sm:p-10" @submit.prevent="handleSubmit">
      <h2 :id="headingId" class="text-xl leading-tight sm:text-[1.625rem]">
        ยินดีต้อนรับสู่ YoYo Member
      </h2>
      <p v-if="welcomeBonusPoints > 0" class="mt-2 text-sm text-muted sm:text-[1.0625rem]">
        กรอกข้อมูลอีกนิด รับ {{ formattedBonusPoints }} แต้มต้อนรับทันที
      </p>
      <p v-else class="mt-2 text-sm text-muted sm:text-[1.0625rem]">
        กรอกข้อมูลอีกนิดเพื่อเริ่มใช้งาน
      </p>

      <div class="mt-6 grid grid-cols-1 gap-x-4 gap-y-5 sm:mt-7 sm:grid-cols-2 sm:gap-y-6">
        <div>
          <label :for="`${fieldId}-first-name`" :class="labelClass">ชื่อ</label>
          <input
            :id="`${fieldId}-first-name`"
            ref="firstNameInput"
            v-model.trim="onboarding.firstName"
            type="text"
            required
            autocomplete="given-name"
            :aria-invalid="nameError && !onboarding.firstName ? 'true' : undefined"
            :aria-describedby="nameError ? `${fieldId}-name-error` : undefined"
            :class="[textFieldClass, nameError && !onboarding.firstName ? 'border-primary' : 'border-muted/25']"
          >
        </div>

        <div>
          <label :for="`${fieldId}-last-name`" :class="labelClass">นามสกุล</label>
          <input
            :id="`${fieldId}-last-name`"
            v-model.trim="onboarding.lastName"
            type="text"
            required
            autocomplete="family-name"
            :aria-invalid="nameError && !onboarding.lastName ? 'true' : undefined"
            :aria-describedby="nameError ? `${fieldId}-name-error` : undefined"
            :class="[textFieldClass, nameError && !onboarding.lastName ? 'border-primary' : 'border-muted/25']"
          >
        </div>

        <p v-if="nameError" :id="`${fieldId}-name-error`" class="-mt-2 text-sm text-primary-dark sm:col-span-2">
          {{ nameError }}
        </p>

        <div class="sm:col-span-2">
          <label :for="`${fieldId}-birth-date`" :class="labelClass">วันเกิด</label>
          <DateField
            :id="`${fieldId}-birth-date`"
            v-model="onboarding.birthDate"
            placeholder="เลือกวันเกิด"
            :max="todayIsoDate"
          />
        </div>

        <fieldset class="sm:col-span-2">
          <legend :class="labelClass">
            เลี้ยงสัตว์อะไรบ้าง
          </legend>
          <ChoiceChips v-model="onboarding.petOwnership" :options="petOwnershipOptions" :name="`${fieldId}-pet-ownership`" />
        </fieldset>
      </div>

      <div class="mt-6 space-y-4 rounded-[1.25rem] bg-cream px-5 py-5 text-sm sm:mt-7 sm:px-6 sm:py-6 sm:text-[1.0625rem]">
        <label class="flex cursor-pointer items-start gap-3 sm:gap-3.5">
          <input
            v-model="onboarding.acceptedPrivacyPolicy"
            type="checkbox"
            :aria-invalid="privacyError ? 'true' : undefined"
            :aria-describedby="privacyError ? `${fieldId}-privacy-error` : undefined"
            class="mt-0.5 size-4.5 shrink-0 cursor-pointer accent-primary sm:size-5.5"
          >
          <span>
            ยินยอมให้เก็บและใช้ข้อมูลตาม<NuxtLink to="/privacy" target="_blank" class="hover:text-primary-dark hover:underline">นโยบายความเป็นส่วนตัว</NuxtLink>
          </span>
        </label>
        <p v-if="privacyError" :id="`${fieldId}-privacy-error`" class="-mt-2 pl-7.5 text-sm text-primary-dark sm:pl-9">
          {{ privacyError }}
        </p>

        <label class="flex cursor-pointer items-start gap-3 sm:gap-3.5">
          <input
            v-model="onboarding.lineNotificationsOptIn"
            type="checkbox"
            class="mt-0.5 size-4.5 shrink-0 cursor-pointer accent-primary sm:size-5.5"
          >
          <span>รับแจ้งเตือนแต้มและสิทธิพิเศษผ่าน LINE</span>
        </label>
      </div>

      <p v-if="submitError" role="alert" class="mt-4 text-center text-sm text-primary-dark">
        {{ submitError }}
      </p>

      <button
        type="submit"
        :disabled="isSubmitting"
        class="mt-6 flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-primary text-base font-semibold text-white transition-colors hover:bg-primary-dark disabled:opacity-60 sm:mt-8 sm:h-14 sm:text-lg"
      >
        <Icon v-if="isSubmitting" name="lucide:loader-circle" class="size-5 animate-spin" />
        {{ welcomeBonusPoints > 0 ? `เริ่มใช้งาน รับ ${formattedBonusPoints} แต้ม` : 'เริ่มใช้งาน' }}
      </button>
    </form>
  </ModalDialog>
</template>
