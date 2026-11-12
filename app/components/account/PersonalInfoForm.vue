<script setup lang="ts">
import type { MemberProfile, MemberProfileUpdate } from '~/types/member'

const props = defineProps<{
  profile: MemberProfile
}>()

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

const { saveProfile, isUploadingAvatar, uploadAvatar, applyLinePictureAsAvatar } = useMemberProfile()
const profile = toRef(props, 'profile')

const fieldId = useId()
const avatarInput = useTemplateRef<HTMLInputElement>('avatarInput')
const todayIsoDate = new Date().toISOString().slice(0, 10)

// Filled from the prop during setup so the server render already shows the saved values
const draft = reactive({
  firstName: props.profile.firstName,
  lastName: props.profile.lastName,
  birthDate: props.profile.birthDate,
  email: props.profile.email ?? ''
})

function resetDraft() {
  draft.firstName = profile.value.firstName
  draft.lastName = profile.value.lastName
  draft.birthDate = profile.value.birthDate
  draft.email = profile.value.email ?? ''
}
watch(profile, resetDraft)

const errors = reactive({ firstName: '', lastName: '', birthDate: '', email: '' })
watch(() => draft.firstName, () => { errors.firstName = '' })
watch(() => draft.lastName, () => { errors.lastName = '' })
watch(() => draft.birthDate, () => { errors.birthDate = '' })
watch(() => draft.email, () => { errors.email = '' })

const isBirthDateLocked = computed(() => {
  const availableAt = profile.value?.birthDateChangeAvailableAt
  return Boolean(profile.value?.birthDate && availableAt && new Date(availableAt) > new Date())
})
const isBirthDateChanging = computed(() => Boolean(profile.value?.birthDate) && draft.birthDate !== profile.value?.birthDate)

const birthDateHint = computed(() => {
  if (isBirthDateLocked.value && profile.value?.birthDateChangeAvailableAt) {
    return `แก้ได้อีกครั้ง ${formatThaiShortDate(profile.value.birthDateChangeAvailableAt)} (ใช้แจกคูปองวันเกิด)`
  }
  if (isBirthDateChanging.value) return 'บันทึกแล้วจะแก้วันเกิดได้อีกครั้งในอีก 1 ปี'
  return 'แก้ได้ปีละ 1 ครั้ง (ใช้แจกคูปองวันเกิด)'
})

const linePictureUrl = computed(() => profile.value?.lineAccount?.pictureUrl ?? null)
const canUseLinePicture = computed(() => Boolean(linePictureUrl.value) && profile.value?.avatarUrl !== linePictureUrl.value)

function handleAvatarChange(event: Event) {
  const input = event.target as HTMLInputElement
  const file = input.files?.[0]
  if (file) uploadAvatar(file)
  input.value = ''
}

type SaveStatus = 'idle' | 'saving' | 'saved' | 'error'
const saveStatus = ref<SaveStatus>('idle')
const saveErrorMessage = ref('')
// Compared with the saved profile, not just "draft changed": a successful save refills the draft and must keep its message
const isDraftChanged = computed(() =>
  profile.value !== null && (
    draft.firstName !== profile.value.firstName
    || draft.lastName !== profile.value.lastName
    || draft.birthDate !== profile.value.birthDate
    || draft.email !== (profile.value.email ?? '')
  )
)
watch(isDraftChanged, (isChanged) => {
  if (isChanged && saveStatus.value !== 'saving') saveStatus.value = 'idle'
})

function validate() {
  errors.firstName = draft.firstName.trim() ? '' : 'กรุณากรอกชื่อ'
  errors.lastName = draft.lastName.trim() ? '' : 'กรุณากรอกนามสกุล'
  errors.birthDate = draft.birthDate ? '' : 'กรุณาเลือกวันเกิด'
  errors.email = !draft.email.trim() || EMAIL_PATTERN.test(draft.email.trim()) ? '' : 'รูปแบบอีเมลไม่ถูกต้อง'
  return Object.values(errors).every(error => !error)
}

async function handleSave() {
  if (!profile.value || !validate()) return
  const update: MemberProfileUpdate = {
    firstName: draft.firstName.trim(),
    lastName: draft.lastName.trim(),
    email: draft.email.trim() || null,
    birthDate: draft.birthDate,
    // Gender isn't on this screen; keep whatever the member set on the full profile page
    gender: profile.value.gender
  }
  saveStatus.value = 'saving'
  try {
    await saveProfile(update)
    saveStatus.value = 'saved'
  } catch (saveError) {
    saveErrorMessage.value = saveError instanceof Error && saveError.message === 'birth_date_change_locked'
      ? 'วันเกิดแก้ได้ปีละ 1 ครั้ง กรุณาลองใหม่ภายหลัง'
      : 'บันทึกไม่สำเร็จ กรุณาลองอีกครั้ง'
    saveStatus.value = 'error'
  }
}

function textFieldClass(hasError: boolean) {
  return [
    'h-12 w-full rounded-xl border-2 bg-white px-4 text-base transition-colors placeholder:text-muted/60 focus:border-primary focus:outline-none',
    hasError ? 'border-primary' : 'border-muted/25'
  ]
}

const labelClass = 'mb-1.5 block text-sm font-semibold'
</script>

<template>
  <form
    novalidate
    class="px-4 pt-5 pb-[calc(2rem+env(safe-area-inset-bottom))] md:mt-6 md:max-w-2xl md:px-0 xl:mt-8"
    @submit.prevent="handleSave"
  >
    <div class="flex flex-col items-center">
      <div class="relative">
        <span class="flex size-24 items-center justify-center overflow-hidden rounded-full border-2 border-primary-soft bg-white">
          <!-- Plain img: uploaded avatars can be blob/storage URLs that ipx can't fetch -->
          <img
            v-if="profile.avatarUrl"
            :src="profile.avatarUrl"
            :alt="`รูปโปรไฟล์ของ ${profile.firstName}`"
            class="size-full object-cover"
          >
          <CatAvatarIcon v-else class="aspect-35/40 h-[58%] translate-y-[8%]" />
        </span>
        <button
          type="button"
          aria-label="เปลี่ยนรูปโปรไฟล์"
          :disabled="isUploadingAvatar"
          class="absolute -right-0.5 -bottom-0.5 flex size-8 items-center justify-center rounded-full border bg-white shadow-sm shadow-ink/10 transition-colors hover:bg-primary-soft disabled:opacity-60"
          @click="avatarInput?.click()"
        >
          <Icon :name="isUploadingAvatar ? 'lucide:loader-circle' : 'lucide:pencil'" class="size-3.5" :class="isUploadingAvatar && 'animate-spin'" />
        </button>
        <input
          ref="avatarInput"
          type="file"
          accept="image/*"
          class="hidden"
          tabindex="-1"
          aria-hidden="true"
          @change="handleAvatarChange"
        >
      </div>
      <button
        v-if="canUseLinePicture"
        type="button"
        :disabled="isUploadingAvatar"
        class="mt-2 text-sm font-semibold text-primary hover:underline disabled:opacity-60"
        @click="applyLinePictureAsAvatar"
      >
        ใช้รูปจาก LINE
      </button>
    </div>

    <div class="mt-5 grid grid-cols-1 gap-x-4 gap-y-4 md:grid-cols-2">
      <div>
        <label :for="`${fieldId}-first-name`" :class="labelClass">ชื่อ <span class="text-primary" aria-hidden="true">*</span></label>
        <input
          :id="`${fieldId}-first-name`"
          v-model="draft.firstName"
          type="text"
          required
          autocomplete="given-name"
          :aria-invalid="errors.firstName ? 'true' : undefined"
          :aria-describedby="errors.firstName ? `${fieldId}-first-name-error` : undefined"
          :class="textFieldClass(Boolean(errors.firstName))"
        >
        <p v-if="errors.firstName" :id="`${fieldId}-first-name-error`" class="mt-1.5 text-sm text-primary-dark">
          {{ errors.firstName }}
        </p>
      </div>

      <div>
        <label :for="`${fieldId}-last-name`" :class="labelClass">นามสกุล <span class="text-primary" aria-hidden="true">*</span></label>
        <input
          :id="`${fieldId}-last-name`"
          v-model="draft.lastName"
          type="text"
          required
          autocomplete="family-name"
          :aria-invalid="errors.lastName ? 'true' : undefined"
          :aria-describedby="errors.lastName ? `${fieldId}-last-name-error` : undefined"
          :class="textFieldClass(Boolean(errors.lastName))"
        >
        <p v-if="errors.lastName" :id="`${fieldId}-last-name-error`" class="mt-1.5 text-sm text-primary-dark">
          {{ errors.lastName }}
        </p>
      </div>

      <div class="md:col-span-2">
        <label :for="`${fieldId}-birth-date`" :class="labelClass">วันเกิด <span class="text-primary" aria-hidden="true">*</span></label>
        <DateField
          :id="`${fieldId}-birth-date`"
          v-model="draft.birthDate"
          placeholder="เลือกวันเกิด"
          :max="todayIsoDate"
          :disabled="isBirthDateLocked"
          :invalid="Boolean(errors.birthDate)"
          :described-by="`${fieldId}-birth-date-hint`"
        />
        <p v-if="errors.birthDate" class="mt-1.5 text-sm text-primary-dark">
          {{ errors.birthDate }}
        </p>
        <p :id="`${fieldId}-birth-date-hint`" class="mt-1.5 text-xs" :class="isBirthDateChanging ? 'text-pending' : 'text-muted'">
          {{ birthDateHint }}
        </p>
      </div>

      <div>
        <label :for="`${fieldId}-phone`" :class="labelClass">เบอร์โทรศัพท์</label>
        <div class="relative">
          <!-- Read-only: changing the phone number needs OTP verification, which is its own flow -->
          <input
            :id="`${fieldId}-phone`"
            :value="profile.phone"
            type="tel"
            readonly
            :aria-describedby="`${fieldId}-phone-hint`"
            class="h-12 w-full rounded-xl border-2 border-border bg-border/40 px-4 text-base text-ink focus:outline-none"
            :class="profile.isPhoneVerified && 'pr-24'"
          >
          <span
            v-if="profile.isPhoneVerified"
            class="absolute top-1/2 right-3 flex h-6 -translate-y-1/2 items-center rounded-full bg-success/10 px-2.5 text-xs font-semibold text-success"
          >
            ยืนยันแล้ว
          </span>
        </div>
        <p :id="`${fieldId}-phone-hint`" class="mt-1.5 text-xs text-muted">
          เปลี่ยนเบอร์ต้องยืนยัน OTP ใหม่
        </p>
      </div>

      <div>
        <label :for="`${fieldId}-email`" :class="labelClass">
          อีเมล <span class="ml-1 text-xs font-normal text-muted">(ไม่บังคับ)</span>
        </label>
        <input
          :id="`${fieldId}-email`"
          v-model="draft.email"
          type="email"
          inputmode="email"
          autocomplete="email"
          placeholder="name@email.com"
          :aria-invalid="errors.email ? 'true' : undefined"
          :aria-describedby="errors.email ? `${fieldId}-email-error` : undefined"
          :class="textFieldClass(Boolean(errors.email))"
        >
        <p v-if="errors.email" :id="`${fieldId}-email-error`" class="mt-1.5 text-sm text-primary-dark">
          {{ errors.email }}
        </p>
      </div>
    </div>

    <section :aria-labelledby="`${fieldId}-linked-heading`" class="mt-5">
      <h2 :id="`${fieldId}-linked-heading`" class="mb-1.5 font-sans text-sm font-semibold">
        บัญชีที่เชื่อม
      </h2>
      <div class="flex items-center gap-3 rounded-2xl border bg-white px-4 py-3">
        <span class="flex size-11 shrink-0 items-center justify-center rounded-xl bg-line-green font-number text-xs font-semibold text-white" aria-hidden="true">LINE</span>
        <div class="min-w-0 flex-1">
          <p class="truncate text-[0.9375rem] font-semibold">
            LINE<template v-if="profile.lineAccount">
              · {{ profile.lineAccount.displayName }}
            </template>
          </p>
          <p class="text-xs text-muted">
            {{ profile.lineAccount ? `เชื่อมเมื่อ ${formatThaiShortDate(profile.lineAccount.linkedAt)}` : 'ยังไม่ได้เชื่อมบัญชี LINE' }}
          </p>
        </div>
        <span
          class="shrink-0 rounded-full px-2.5 py-1 text-xs font-semibold"
          :class="profile.lineAccount ? 'bg-success/10 text-success' : 'bg-border text-muted'"
        >
          {{ profile.lineAccount ? 'เชื่อมแล้ว' : 'ยังไม่เชื่อม' }}
        </span>
      </div>
    </section>

    <p v-if="saveStatus === 'saved' || saveStatus === 'error'" role="status" class="mt-4 text-center text-sm" :class="saveStatus === 'error' ? 'text-primary-dark' : 'text-success'">
      {{ saveStatus === 'error' ? saveErrorMessage : 'บันทึกข้อมูลแล้ว' }}
    </p>

    <button
      type="submit"
      :disabled="saveStatus === 'saving'"
      class="mt-5 flex h-12 w-full items-center justify-center gap-2 rounded-full bg-primary text-[0.9375rem] font-semibold text-white transition-colors hover:bg-primary-dark disabled:opacity-60"
    >
      <Icon v-if="saveStatus === 'saving'" name="lucide:loader-circle" class="size-5 animate-spin" />
      บันทึก
    </button>
  </form>
</template>
