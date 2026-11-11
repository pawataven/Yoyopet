<script setup lang="ts">
import type { Gender, MemberProfileUpdate } from '~/types/member'

defineProps<{
  phone: string
  isPhoneVerified: boolean
}>()

const draft = defineModel<MemberProfileUpdate>({ required: true })

const fieldId = useId()
const birthDateHintId = `${fieldId}-birth-date-hint`

const genderOptions: { value: Gender, label: string }[] = [
  { value: 'female', label: 'หญิง' },
  { value: 'male', label: 'ชาย' },
  { value: 'unspecified', label: 'ไม่ระบุ' }
]

const email = computed({
  get: () => draft.value.email ?? '',
  set: (value: string) => {
    draft.value.email = value.trim() || null
  }
})

const birthDate = computed({
  get: () => draft.value.birthDate ?? '',
  set: (value: string) => {
    draft.value.birthDate = value || null
  }
})

const todayIsoDate = new Date().toISOString().slice(0, 10)

function openDatePicker(event: MouseEvent) {
  const input = event.currentTarget as HTMLInputElement
  try {
    input.showPicker()
  } catch {
    // showPicker throws inside cross-origin iframes and is missing in older browsers; the native input still works
  }
}

const textFieldClass = 'h-12 w-full rounded-xl border-2 border-muted/25 bg-white px-4 text-base transition-colors placeholder:text-muted/60 focus:border-primary focus:outline-none xl:h-14.5 xl:px-5 xl:text-lg'
const labelClass = 'mb-1.5 block text-sm xl:text-[1.0625rem]'
</script>

<template>
  <section aria-labelledby="personal-info-heading" class="rounded-[1.25rem] border bg-white p-5 xl:p-10">
    <h2 id="personal-info-heading" class="text-xl leading-tight xl:text-[1.625rem]">
      ข้อมูลส่วนตัว
    </h2>

    <div class="mt-5 grid gap-x-6 gap-y-5 sm:grid-cols-2 xl:mt-4 xl:gap-y-7">
      <div>
        <label :for="`${fieldId}-first-name`" :class="labelClass">ชื่อ</label>
        <input
          :id="`${fieldId}-first-name`"
          v-model.trim="draft.firstName"
          type="text"
          required
          autocomplete="given-name"
          :class="textFieldClass"
        >
      </div>

      <div>
        <label :for="`${fieldId}-last-name`" :class="labelClass">นามสกุล</label>
        <input
          :id="`${fieldId}-last-name`"
          v-model.trim="draft.lastName"
          type="text"
          required
          autocomplete="family-name"
          :class="textFieldClass"
        >
      </div>

      <div>
        <label :for="`${fieldId}-phone`" :class="labelClass">เบอร์โทรศัพท์</label>
        <div class="relative">
          <!-- Read-only: changing the phone number needs OTP verification, which is its own flow -->
          <input
            :id="`${fieldId}-phone`"
            :value="phone"
            type="tel"
            readonly
            :class="[textFieldClass, isPhoneVerified && 'pr-28 xl:pr-32']"
          >
          <span
            v-if="isPhoneVerified"
            class="absolute top-1/2 right-3 flex h-7 -translate-y-1/2 items-center rounded-full bg-success/10 px-3 text-xs font-semibold text-success xl:right-4 xl:h-8 xl:px-4 xl:text-sm"
          >
            ยืนยันแล้ว
          </span>
        </div>
      </div>

      <div>
        <label :for="`${fieldId}-email`" :class="labelClass">อีเมล (ไม่บังคับ)</label>
        <input
          :id="`${fieldId}-email`"
          v-model.lazy="email"
          type="email"
          autocomplete="email"
          placeholder="กรอกอีเมล"
          :class="textFieldClass"
        >
      </div>

      <div>
        <label :for="`${fieldId}-birth-date`" :class="labelClass">วันเกิด</label>
        <div class="relative">
          <input
            :id="`${fieldId}-birth-date`"
            v-model="birthDate"
            type="date"
            :max="todayIsoDate"
            :aria-describedby="birthDateHintId"
            class="peer absolute inset-0 size-full cursor-pointer opacity-0"
            @click="openDatePicker"
          >
          <div
            :class="textFieldClass"
            class="pointer-events-none flex items-center justify-between peer-focus:border-primary"
            aria-hidden="true"
          >
            <span :class="!birthDate && 'text-muted/60'">
              {{ birthDate ? formatThaiShortDate(birthDate) : 'เลือกวันเกิด' }}
            </span>
            <Icon name="lucide:calendar" class="size-5 text-muted xl:size-6" />
          </div>
        </div>
        <p :id="birthDateHintId" class="mt-2 text-xs text-muted xl:text-[0.9375rem]">
          ใช้วันเกิดเพื่อส่งคูปองวันเกิดให้คุณทุกปี
        </p>
      </div>

      <fieldset>
        <legend :class="labelClass">
          เพศ
        </legend>
        <div class="flex flex-wrap gap-2.5">
          <label
            v-for="option in genderOptions"
            :key="option.value"
            class="flex h-11 cursor-pointer items-center rounded-full border-2 px-5 text-base transition-colors hover:border-primary/40 has-checked:border-primary has-checked:bg-primary has-checked:font-semibold has-checked:text-white has-focus-visible:ring-4 has-focus-visible:ring-primary-soft xl:h-11.5 xl:px-6 xl:text-lg"
          >
            <input
              v-model="draft.gender"
              type="radio"
              :name="`${fieldId}-gender`"
              :value="option.value"
              class="sr-only"
            >
            {{ option.label }}
          </label>
        </div>
      </fieldset>
    </div>
  </section>
</template>
