<script setup lang="ts">
import type { ShippingAddress, ShippingAddressInput } from '~/types/address'

// Without an address the form adds a new one; with one it edits (and can delete) it
const { address = null } = defineProps<{
  address?: ShippingAddress | null
}>()

const POSTAL_CODE_PATTERN = /^\d{5}$/
const ADDRESS_LIST_PATH = '/account/addresses'
const labelSuggestions = ['บ้าน', 'ที่ทำงาน']

const { addresses, addAddress, updateAddress, deleteAddress } = useShippingAddresses()
const { profile } = useMemberProfile()

const fieldId = useId()
const isEditing = computed(() => address !== null)
const isOnlyAddress = computed(() => addresses.value.length <= 1)

// Filled during setup so the server render already shows the saved values
const form = reactive({
  label: address?.label ?? '',
  recipientName: address?.recipientName ?? (profile.value ? `${profile.value.firstName} ${profile.value.lastName}` : ''),
  phone: address?.phone ?? profile.value?.phone ?? '',
  addressLine: address?.addressLine ?? '',
  subdistrict: address?.subdistrict ?? '',
  district: address?.district ?? '',
  province: address?.province ?? '',
  postalCode: address?.postalCode ?? '',
  // A member's first address becomes the default either way, so the switch starts on
  isDefault: address?.isDefault ?? addresses.value.length === 0
})

type RequiredField = 'recipientName' | 'phone' | 'addressLine' | 'subdistrict' | 'district' | 'province' | 'postalCode'
const errors = reactive<Record<RequiredField, string>>({
  recipientName: '',
  phone: '',
  addressLine: '',
  subdistrict: '',
  district: '',
  province: '',
  postalCode: ''
})

const requiredMessages: Record<RequiredField, string> = {
  recipientName: 'กรุณากรอกชื่อผู้รับ',
  phone: 'กรุณากรอกเบอร์มือถือ',
  addressLine: 'กรุณากรอกบ้านเลขที่ ซอย ถนน',
  subdistrict: 'กรุณากรอกแขวง/ตำบล',
  district: 'กรุณากรอกเขต/อำเภอ',
  province: 'กรุณากรอกจังหวัด',
  postalCode: 'กรุณากรอกรหัสไปรษณีย์'
}

for (const field of Object.keys(errors) as RequiredField[]) {
  watch(() => form[field], () => {
    errors[field] = ''
  })
}

function handlePhoneInput(event: Event) {
  const input = event.target as HTMLInputElement
  form.phone = formatThaiMobile(input.value)
  input.value = form.phone
}

function handlePostalCodeInput(event: Event) {
  const input = event.target as HTMLInputElement
  form.postalCode = digitsOnly(input.value).slice(0, 5)
  input.value = form.postalCode
}

function validate() {
  for (const field of Object.keys(errors) as RequiredField[]) {
    errors[field] = form[field].trim() ? '' : requiredMessages[field]
  }
  if (!errors.phone && !isValidThaiMobile(form.phone)) errors.phone = 'กรุณากรอกเบอร์มือถือ 10 หลักให้ถูกต้อง'
  if (!errors.postalCode && !POSTAL_CODE_PATTERN.test(form.postalCode)) errors.postalCode = 'รหัสไปรษณีย์ต้องเป็นตัวเลข 5 หลัก'
  return Object.values(errors).every(error => !error)
}

const isSaving = ref(false)
const saveError = ref('')

async function handleSubmit() {
  if (!validate()) return
  const input: ShippingAddressInput = {
    label: form.label.trim() || null,
    recipientName: form.recipientName.trim(),
    phone: form.phone,
    addressLine: form.addressLine.trim(),
    subdistrict: form.subdistrict.trim(),
    district: form.district.trim(),
    province: form.province.trim(),
    postalCode: form.postalCode,
    isDefault: form.isDefault
  }
  isSaving.value = true
  saveError.value = ''
  try {
    if (address) await updateAddress(address.id, input)
    else await addAddress(input)
    await navigateTo(ADDRESS_LIST_PATH)
  } catch (error) {
    saveError.value = error instanceof Error && error.message === 'address_limit_reached'
      ? 'เก็บที่อยู่ได้สูงสุด 5 ที่อยู่ ลบที่อยู่เดิมก่อนเพิ่มใหม่'
      : 'บันทึกที่อยู่ไม่สำเร็จ กรุณาลองอีกครั้ง'
  } finally {
    isSaving.value = false
  }
}

const isDeleteDialogOpen = ref(false)
const isDeleting = ref(false)

async function handleConfirmDelete() {
  if (!address) return
  isDeleting.value = true
  try {
    await deleteAddress(address.id)
    isDeleteDialogOpen.value = false
    await navigateTo(ADDRESS_LIST_PATH)
  } catch {
    saveError.value = 'ลบที่อยู่ไม่สำเร็จ กรุณาลองอีกครั้ง'
    isDeleteDialogOpen.value = false
  } finally {
    isDeleting.value = false
  }
}

function textFieldClass(hasError: boolean) {
  return [
    'h-12 w-full rounded-xl border-2 bg-white px-4 text-base transition-colors placeholder:text-muted/60 focus:border-primary focus:outline-none',
    hasError ? 'border-primary' : 'border-muted/25'
  ]
}

const labelClass = 'mb-1.5 block text-sm font-semibold'

const addressFields: { field: Exclude<RequiredField, 'recipientName' | 'phone' | 'postalCode'>, label: string, autocomplete: string, placeholder: string, wide?: boolean }[] = [
  { field: 'addressLine', label: 'บ้านเลขที่ ซอย ถนน', autocomplete: 'address-line1', placeholder: 'เช่น 99/12 ซ.ลาดพร้าว 15', wide: true },
  { field: 'subdistrict', label: 'แขวง/ตำบล', autocomplete: 'address-level3', placeholder: '' },
  { field: 'district', label: 'เขต/อำเภอ', autocomplete: 'address-level2', placeholder: '' },
  { field: 'province', label: 'จังหวัด', autocomplete: 'address-level1', placeholder: '' }
]
</script>

<template>
  <form novalidate class="px-4 pt-5 pb-[calc(2rem+env(safe-area-inset-bottom))] md:mt-6 md:max-w-2xl md:px-0 xl:mt-8" @submit.prevent="handleSubmit">
    <div class="grid grid-cols-1 gap-x-4 gap-y-4 md:grid-cols-2">
      <div class="md:col-span-2">
        <label :for="`${fieldId}-label`" :class="labelClass">
          ชื่อที่อยู่ <span class="ml-1 text-xs font-normal text-muted">(ไม่บังคับ)</span>
        </label>
        <input
          :id="`${fieldId}-label`"
          v-model="form.label"
          type="text"
          maxlength="30"
          placeholder="เช่น บ้าน, ที่ทำงาน"
          :class="textFieldClass(false)"
        >
        <div class="mt-2 flex gap-2">
          <button
            v-for="suggestion in labelSuggestions"
            :key="suggestion"
            type="button"
            :aria-pressed="form.label === suggestion"
            class="h-8 rounded-full border px-3.5 text-sm transition-colors"
            :class="form.label === suggestion ? 'border-primary bg-primary-soft font-semibold text-primary-dark' : 'bg-white hover:border-primary'"
            @click="form.label = suggestion"
          >
            {{ suggestion }}
          </button>
        </div>
      </div>

      <div>
        <label :for="`${fieldId}-recipient`" :class="labelClass">ชื่อผู้รับ <span class="text-primary" aria-hidden="true">*</span></label>
        <input
          :id="`${fieldId}-recipient`"
          v-model="form.recipientName"
          type="text"
          required
          autocomplete="name"
          :aria-invalid="errors.recipientName ? 'true' : undefined"
          :aria-describedby="errors.recipientName ? `${fieldId}-recipientName-error` : undefined"
          :class="textFieldClass(Boolean(errors.recipientName))"
        >
        <p v-if="errors.recipientName" :id="`${fieldId}-recipientName-error`" class="mt-1.5 text-sm text-primary-dark">
          {{ errors.recipientName }}
        </p>
      </div>

      <div>
        <label :for="`${fieldId}-phone`" :class="labelClass">เบอร์มือถือผู้รับ <span class="text-primary" aria-hidden="true">*</span></label>
        <input
          :id="`${fieldId}-phone`"
          :value="form.phone"
          type="tel"
          inputmode="tel"
          autocomplete="tel-national"
          placeholder="08X-XXX-XXXX"
          required
          :aria-invalid="errors.phone ? 'true' : undefined"
          :aria-describedby="errors.phone ? `${fieldId}-phone-error` : undefined"
          :class="textFieldClass(Boolean(errors.phone))"
          @input="handlePhoneInput"
        >
        <p v-if="errors.phone" :id="`${fieldId}-phone-error`" class="mt-1.5 text-sm text-primary-dark">
          {{ errors.phone }}
        </p>
      </div>

      <div v-for="item in addressFields" :key="item.field" :class="item.wide && 'md:col-span-2'">
        <label :for="`${fieldId}-${item.field}`" :class="labelClass">{{ item.label }} <span class="text-primary" aria-hidden="true">*</span></label>
        <input
          :id="`${fieldId}-${item.field}`"
          v-model="form[item.field]"
          type="text"
          required
          :autocomplete="item.autocomplete"
          :placeholder="item.placeholder"
          :aria-invalid="errors[item.field] ? 'true' : undefined"
          :aria-describedby="errors[item.field] ? `${fieldId}-${item.field}-error` : undefined"
          :class="textFieldClass(Boolean(errors[item.field]))"
        >
        <p v-if="errors[item.field]" :id="`${fieldId}-${item.field}-error`" class="mt-1.5 text-sm text-primary-dark">
          {{ errors[item.field] }}
        </p>
      </div>

      <div>
        <label :for="`${fieldId}-postal-code`" :class="labelClass">รหัสไปรษณีย์ <span class="text-primary" aria-hidden="true">*</span></label>
        <input
          :id="`${fieldId}-postal-code`"
          :value="form.postalCode"
          type="text"
          inputmode="numeric"
          autocomplete="postal-code"
          required
          :aria-invalid="errors.postalCode ? 'true' : undefined"
          :aria-describedby="errors.postalCode ? `${fieldId}-postalCode-error` : undefined"
          :class="textFieldClass(Boolean(errors.postalCode))"
          @input="handlePostalCodeInput"
        >
        <p v-if="errors.postalCode" :id="`${fieldId}-postalCode-error`" class="mt-1.5 text-sm text-primary-dark">
          {{ errors.postalCode }}
        </p>
      </div>
    </div>

    <div class="mt-5 flex items-center justify-between gap-4 rounded-2xl border bg-white px-4 py-3.5">
      <span :id="`${fieldId}-default-label`" class="text-[0.9375rem]">
        ตั้งเป็นที่อยู่เริ่มต้น
        <span v-if="address?.isDefault || isOnlyAddress" class="mt-0.5 block text-xs text-muted">ต้องมีที่อยู่เริ่มต้นอย่างน้อย 1 ที่อยู่</span>
      </span>
      <!-- The current default can't be switched off here; picking another address as default moves it instead -->
      <ToggleSwitch
        v-model="form.isDefault"
        :disabled="Boolean(address?.isDefault) || (!isEditing && addresses.length === 0)"
        :aria-labelledby="`${fieldId}-default-label`"
      />
    </div>

    <p v-if="saveError" role="alert" class="mt-4 text-center text-sm text-primary-dark">
      {{ saveError }}
    </p>

    <button
      type="submit"
      :disabled="isSaving"
      class="mt-5 flex h-12 w-full items-center justify-center gap-2 rounded-full bg-primary text-[0.9375rem] font-semibold text-white transition-colors hover:bg-primary-dark disabled:opacity-60"
    >
      <Icon v-if="isSaving" name="lucide:loader-circle" class="size-5 animate-spin" />
      {{ isEditing ? 'บันทึก' : 'เพิ่มที่อยู่' }}
    </button>

    <button
      v-if="isEditing"
      type="button"
      class="mt-3 flex h-12 w-full items-center justify-center gap-2 rounded-full border-2 border-border bg-white text-[0.9375rem] font-semibold text-primary-dark transition-colors hover:border-primary"
      @click="isDeleteDialogOpen = true"
    >
      <Icon name="lucide:trash-2" class="size-4.5" aria-hidden="true" />
      ลบที่อยู่นี้
    </button>

    <ConfirmDialog
      v-model:open="isDeleteDialogOpen"
      title="ลบที่อยู่นี้?"
      :description="address?.isDefault && !isOnlyAddress
        ? 'ที่อยู่นี้เป็นค่าเริ่มต้น ระบบจะใช้ที่อยู่ถัดไปเป็นค่าเริ่มต้นแทน'
        : 'ลบแล้วกู้คืนไม่ได้ ต้องกรอกใหม่หากต้องการใช้อีก'"
      confirm-label="ลบที่อยู่"
      icon="lucide:trash-2"
      :is-submitting="isDeleting"
      @confirm="handleConfirmDelete"
    />
  </form>
</template>
