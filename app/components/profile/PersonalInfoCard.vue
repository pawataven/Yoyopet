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

const todayIsoDate = new Date().toISOString().slice(0, 10)

const textFieldClass = 'h-12 w-full rounded-xl border-2 border-muted/25 bg-white px-4 text-base transition-colors placeholder:text-muted/60 focus:border-primary focus:outline-none xl:h-14.5 xl:px-5 xl:text-lg'
const labelClass = 'mb-1.5 block text-sm xl:text-[1.0625rem]'
</script>

<template>
  <section aria-labelledby="personal-info-heading" class="flex flex-col rounded-[1.25rem] border bg-white p-5 xl:p-10">
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
        <DateField
          :id="`${fieldId}-birth-date`"
          v-model="draft.birthDate"
          placeholder="เลือกวันเกิด"
          :max="todayIsoDate"
          :described-by="birthDateHintId"
        />
      </div>

      <fieldset>
        <legend :class="labelClass">
          เพศ
        </legend>
        <ChoiceChips v-model="draft.gender" :options="genderOptions" :name="`${fieldId}-gender`" />
      </fieldset>
    </div>

    <p :id="birthDateHintId" class="mt-auto pt-6 text-xs text-muted xl:pt-10 xl:text-[0.9375rem]">
      ใช้วันเกิดเพื่อส่งคูปองวันเกิดให้คุณทุกปี
    </p>
  </section>
</template>
