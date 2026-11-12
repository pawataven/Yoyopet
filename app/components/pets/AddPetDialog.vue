<script setup lang="ts">
import type { NewPet, PetSex, PetSpecies } from '~/types/pet'

const MAX_PHOTO_BYTES = 5 * 1024 * 1024
const ACCEPTED_PHOTO_TYPES = ['image/jpeg', 'image/png']

const props = defineProps<{
  savePet: (newPet: NewPet, photo: File | null) => Promise<void>
}>()

const isOpen = defineModel<boolean>('open', { required: true })

const fieldId = useId()
const headingId = `${fieldId}-heading`
const nameInput = useTemplateRef<HTMLInputElement>('nameInput')
const photoInput = useTemplateRef<HTMLInputElement>('photoInput')

const speciesOptions: { value: PetSpecies, label: string }[] = [
  { value: 'dog', label: 'สุนัข' },
  { value: 'cat', label: 'แมว' },
  { value: 'rabbit', label: 'กระต่าย' },
  { value: 'other', label: 'อื่น ๆ' }
]

const sexOptions: { value: PetSex, label: string }[] = [
  { value: 'male', label: 'เพศผู้' },
  { value: 'female', label: 'เพศเมีย' },
  { value: 'unknown', label: 'ไม่ทราบ' }
]

const name = ref('')
const species = ref<PetSpecies | null>('dog')
const breed = ref('')
const birthDate = ref<string | null>(null)
const sex = ref<PetSex | null>(null)
const weightInput = ref('')
const photo = ref<File | null>(null)
const photoPreviewUrl = ref<string | null>(null)

const nameError = ref('')
const weightError = ref('')
const photoError = ref('')
const submitError = ref('')
const isSubmitting = ref(false)

const todayIsoDate = toLocalIsoDate(new Date())
const breedOptions = computed(() => petBreedsBySpecies[species.value ?? 'other'])

watch(species, () => {
  breed.value = ''
})
watch(name, () => {
  nameError.value = ''
})
watch(weightInput, () => {
  weightError.value = ''
})

function clearPhoto() {
  if (photoPreviewUrl.value) URL.revokeObjectURL(photoPreviewUrl.value)
  photo.value = null
  photoPreviewUrl.value = null
  if (photoInput.value) photoInput.value.value = ''
}

function resetForm() {
  name.value = ''
  species.value = 'dog'
  breed.value = ''
  birthDate.value = null
  sex.value = null
  weightInput.value = ''
  clearPhoto()
  nameError.value = ''
  weightError.value = ''
  photoError.value = ''
  submitError.value = ''
}

function handlePhotoChange(event: Event) {
  const file = (event.target as HTMLInputElement).files?.[0]
  if (!file) return
  if (!ACCEPTED_PHOTO_TYPES.includes(file.type)) {
    photoError.value = 'รองรับเฉพาะไฟล์ JPG หรือ PNG'
    return
  }
  if (file.size > MAX_PHOTO_BYTES) {
    photoError.value = 'ไฟล์ใหญ่เกิน 5 MB'
    return
  }
  clearPhoto()
  photoError.value = ''
  photo.value = file
  photoPreviewUrl.value = URL.createObjectURL(file)
}

function parseWeightKg() {
  if (!weightInput.value.trim()) return null
  const weightKg = Number(weightInput.value)
  return Number.isFinite(weightKg) && weightKg > 0 ? weightKg : Number.NaN
}

function validate() {
  nameError.value = name.value.trim() ? '' : 'กรุณากรอกชื่อน้อง'
  weightError.value = Number.isNaN(parseWeightKg()) ? 'กรุณากรอกน้ำหนักเป็นตัวเลขมากกว่า 0' : ''
  return !nameError.value && !weightError.value
}

async function handleSubmit() {
  if (!validate()) {
    if (nameError.value) nameInput.value?.focus()
    return
  }
  isSubmitting.value = true
  submitError.value = ''
  try {
    await props.savePet({
      name: name.value.trim(),
      species: species.value ?? 'other',
      breed: breed.value.trim() || null,
      sex: sex.value,
      birthDate: birthDate.value,
      weightKg: parseWeightKg()
    }, photo.value)
    isOpen.value = false
  } catch {
    submitError.value = 'บันทึกข้อมูลไม่สำเร็จ กรุณาลองอีกครั้ง'
  } finally {
    isSubmitting.value = false
  }
}

const textFieldClass = 'h-12 w-full rounded-xl border-2 bg-white px-4 text-base transition-colors placeholder:text-muted/60 focus:border-primary focus:outline-none xl:h-14.5 xl:px-5 xl:text-lg'
const labelClass = 'mb-1.5 block text-sm sm:text-base'
</script>

<template>
  <ModalDialog
    v-model:open="isOpen"
    :aria-labelledby="headingId"
    class="max-w-200"
    @opened="nameInput?.focus()"
    @closed="resetForm"
  >
    <form novalidate class="relative p-6 sm:p-10" @submit.prevent="handleSubmit">
      <button
        type="button"
        aria-label="ปิด"
        class="absolute top-4 right-4 flex size-9 items-center justify-center rounded-full bg-border text-ink transition-colors hover:bg-primary-soft focus-visible:ring-4 focus-visible:ring-primary-soft focus-visible:outline-none sm:top-6 sm:right-6 sm:size-10"
        @click="isOpen = false"
      >
        <Icon name="lucide:x" class="size-4.5 sm:size-5" />
      </button>

      <h2 :id="headingId" class="pr-12 text-xl leading-tight sm:text-[1.625rem]">
        เพิ่มสัตว์เลี้ยง
      </h2>

      <div class="mt-5 flex items-center gap-4 sm:mt-7 sm:gap-6">
        <button
          type="button"
          :aria-label="photoPreviewUrl ? 'เปลี่ยนรูปน้อง' : 'อัปโหลดรูปน้อง'"
          class="flex size-20 shrink-0 items-center justify-center overflow-hidden rounded-full border-2 border-dashed border-primary/30 bg-cream text-muted transition-colors hover:border-primary/60 hover:text-primary focus-visible:ring-4 focus-visible:ring-primary-soft focus-visible:outline-none sm:size-27"
          :class="photoPreviewUrl && 'border-solid'"
          @click="photoInput?.click()"
        >
          <img v-if="photoPreviewUrl" :src="photoPreviewUrl" alt="" class="size-full object-cover">
          <Icon v-else name="lucide:upload" class="size-6 sm:size-7" />
        </button>
        <input
          ref="photoInput"
          type="file"
          :accept="ACCEPTED_PHOTO_TYPES.join(',')"
          class="sr-only"
          tabindex="-1"
          aria-hidden="true"
          @change="handlePhotoChange"
        >
        <div class="min-w-0">
          <p class="text-sm font-semibold sm:text-base">
            รูปน้อง
          </p>
          <p class="mt-0.5 text-xs text-muted sm:text-sm">
            อัปโหลดรูป JPG, PNG (ไม่บังคับ)
          </p>
          <p v-if="photoError" role="alert" class="mt-1 text-xs text-primary-dark sm:text-sm">
            {{ photoError }}
          </p>
          <button
            v-else-if="photoPreviewUrl"
            type="button"
            class="mt-1 text-xs font-semibold text-primary-dark hover:underline sm:text-sm"
            @click="clearPhoto"
          >
            ลบรูป
          </button>
        </div>
      </div>

      <div class="mt-5 grid gap-x-4 gap-y-5 sm:mt-6 sm:grid-cols-2 sm:gap-y-6">
        <div class="sm:col-span-2">
          <label :for="`${fieldId}-name`" :class="labelClass">ชื่อน้อง</label>
          <input
            :id="`${fieldId}-name`"
            ref="nameInput"
            v-model="name"
            type="text"
            required
            maxlength="40"
            autocomplete="off"
            placeholder="เช่น มะลิ"
            :aria-invalid="nameError ? 'true' : undefined"
            :aria-describedby="nameError ? `${fieldId}-name-error` : undefined"
            :class="[textFieldClass, nameError ? 'border-primary' : 'border-muted/25']"
          >
          <p v-if="nameError" :id="`${fieldId}-name-error`" class="mt-1.5 text-sm text-primary-dark">
            {{ nameError }}
          </p>
        </div>

        <fieldset class="sm:col-span-2">
          <legend :class="labelClass">
            ประเภท
          </legend>
          <ChoiceChips v-model="species" :options="speciesOptions" :name="`${fieldId}-species`" />
        </fieldset>

        <div>
          <label :for="`${fieldId}-breed`" :class="labelClass">สายพันธุ์</label>
          <div v-if="breedOptions.length" class="relative">
            <select
              :id="`${fieldId}-breed`"
              v-model="breed"
              :class="[textFieldClass, 'cursor-pointer appearance-none border-muted/25 pr-12', !breed && 'text-muted/60']"
            >
              <option value="">
                เลือกสายพันธุ์
              </option>
              <option v-for="breedOption in breedOptions" :key="breedOption" :value="breedOption" class="text-ink">
                {{ breedOption }}
              </option>
            </select>
            <Icon name="lucide:chevron-down" class="pointer-events-none absolute top-1/2 right-4 size-5 -translate-y-1/2 text-ink sm:size-6" />
          </div>
          <input
            v-else
            :id="`${fieldId}-breed`"
            v-model="breed"
            type="text"
            maxlength="40"
            autocomplete="off"
            placeholder="ระบุชนิดหรือสายพันธุ์"
            :class="[textFieldClass, 'border-muted/25']"
          >
        </div>

        <div>
          <label :for="`${fieldId}-birth-date`" :class="labelClass">วันเกิด</label>
          <DateField
            :id="`${fieldId}-birth-date`"
            v-model="birthDate"
            placeholder="เลือกวันเกิด"
            :max="todayIsoDate"
          />
        </div>

        <fieldset>
          <legend :class="labelClass">
            เพศ
          </legend>
          <ChoiceChips v-model="sex" :options="sexOptions" :name="`${fieldId}-sex`" />
        </fieldset>

        <div>
          <label :for="`${fieldId}-weight`" :class="labelClass">น้ำหนัก (กก.)</label>
          <input
            :id="`${fieldId}-weight`"
            v-model="weightInput"
            type="text"
            inputmode="decimal"
            autocomplete="off"
            placeholder="0.0"
            :aria-invalid="weightError ? 'true' : undefined"
            :aria-describedby="weightError ? `${fieldId}-weight-error` : undefined"
            :class="[textFieldClass, weightError ? 'border-primary' : 'border-muted/25']"
          >
          <p v-if="weightError" :id="`${fieldId}-weight-error`" class="mt-1.5 text-sm text-primary-dark">
            {{ weightError }}
          </p>
        </div>
      </div>

      <p v-if="submitError" role="alert" class="mt-4 text-center text-sm text-primary-dark">
        {{ submitError }}
      </p>

      <div class="mt-8 grid grid-cols-2 gap-3 sm:mt-14 sm:gap-4">
        <button
          type="button"
          class="flex h-12 items-center justify-center rounded-xl border-2 border-primary bg-white text-base font-semibold text-primary-dark transition-colors hover:bg-primary-soft xl:h-14.5 xl:text-lg"
          @click="isOpen = false"
        >
          ยกเลิก
        </button>
        <button
          type="submit"
          :disabled="isSubmitting"
          class="flex h-12 items-center justify-center gap-2 rounded-xl bg-primary text-base font-semibold text-white transition-colors hover:bg-primary-dark disabled:opacity-60 xl:h-14.5 xl:text-lg"
        >
          <Icon v-if="isSubmitting" name="lucide:loader-circle" class="size-5 animate-spin" />
          บันทึก
        </button>
      </div>
    </form>
  </ModalDialog>
</template>
