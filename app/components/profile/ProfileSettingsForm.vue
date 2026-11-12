<script setup lang="ts">
import type { MemberProfile, MemberProfileUpdate } from '~/types/member'

const props = defineProps<{
  profile: MemberProfile
}>()

const { saveProfile } = useMemberProfile()
const { addresses, defaultAddressId, setDefaultAddress } = useShippingAddresses()

const profileDraft = ref<MemberProfileUpdate>(toProfileUpdate(props.profile))
const selectedAddressId = ref<string | null>(null)

type SaveStatus = 'idle' | 'saving' | 'saved' | 'error'
const saveStatus = ref<SaveStatus>('idle')

function toProfileUpdate(profile: MemberProfile): MemberProfileUpdate {
  const { firstName, lastName, email, birthDate, gender } = profile
  return { firstName, lastName, email, birthDate, gender }
}

function isSameValue(left: unknown, right: unknown) {
  return JSON.stringify(left) === JSON.stringify(right)
}

const isProfileChanged = computed(() => !isSameValue(profileDraft.value, toProfileUpdate(props.profile)))
const isDefaultAddressChanged = computed(() => selectedAddressId.value !== defaultAddressId.value)
const hasChanges = computed(() => isProfileChanged.value || isDefaultAddressChanged.value)

function resetDrafts() {
  profileDraft.value = toProfileUpdate(props.profile)
  selectedAddressId.value = defaultAddressId.value
}

watch([() => props.profile, defaultAddressId], resetDrafts, { immediate: true })
watch([profileDraft, selectedAddressId], () => {
  if (saveStatus.value !== 'saving') saveStatus.value = 'idle'
}, { deep: true })

async function handleSubmit() {
  if (!hasChanges.value) {
    saveStatus.value = 'saved'
    return
  }

  saveStatus.value = 'saving'
  try {
    await Promise.all([
      isProfileChanged.value && saveProfile({ ...profileDraft.value }),
      isDefaultAddressChanged.value && selectedAddressId.value && setDefaultAddress(selectedAddressId.value)
    ])
    await nextTick()
    saveStatus.value = 'saved'
  } catch {
    saveStatus.value = 'error'
  }
}

function handleCancel() {
  resetDrafts()
  saveStatus.value = 'idle'
}

const saveStatusMessage = computed(() => {
  if (saveStatus.value === 'saved') return 'บันทึกข้อมูลเรียบร้อยแล้ว'
  if (saveStatus.value === 'error') return 'บันทึกไม่สำเร็จ กรุณาลองอีกครั้ง'
  return ''
})
</script>

<template>
  <!-- One grid for the summary and the form, so the summary card and the personal-info card share the first row's height -->
  <form class="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,406fr)_minmax(0,1264fr)]" @submit.prevent="handleSubmit">
    <slot name="summary" />

    <PersonalInfoCard
      v-model="profileDraft"
      :phone="profile.phone"
      :is-phone-verified="profile.isPhoneVerified"
      class="min-w-0"
    />

    <div class="flex min-w-0 flex-col gap-6 xl:col-start-2">
      <ShippingAddressCard v-model="selectedAddressId" :addresses="addresses" />

      <NotificationConsentCard />
    </div>

    <div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-end sm:gap-4 xl:col-start-2 xl:mt-2">
      <p
        role="status"
        class="text-sm sm:mr-auto xl:text-base"
        :class="saveStatus === 'error' ? 'text-primary-dark' : 'text-success'"
      >
        {{ saveStatusMessage }}
      </p>

      <div class="grid grid-cols-2 gap-3 sm:flex sm:gap-4">
        <button
          type="button"
          :disabled="saveStatus === 'saving'"
          class="h-12 rounded-xl border-2 border-primary bg-white font-heading text-lg font-medium text-primary-dark transition-colors hover:bg-primary-soft disabled:opacity-60 sm:w-44 xl:h-14.5 xl:w-50.5 xl:text-[1.375rem]"
          @click="handleCancel"
        >
          ยกเลิก
        </button>
        <button
          type="submit"
          :disabled="saveStatus === 'saving'"
          class="flex h-12 items-center justify-center gap-2 rounded-xl bg-primary font-heading text-lg font-medium text-white transition-colors hover:bg-primary-dark disabled:opacity-60 sm:w-44 xl:h-14.5 xl:w-50.5 xl:text-[1.375rem]"
        >
          <Icon v-if="saveStatus === 'saving'" name="lucide:loader-circle" class="size-5 animate-spin" />
          บันทึก
        </button>
      </div>
    </div>
  </form>
</template>
