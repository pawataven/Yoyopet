<script setup lang="ts">
definePageMeta({ middleware: 'auth' })

useSeoMeta({
  title: 'โปรไฟล์ของฉัน · YoyoPet'
})

const { profile, isUploadingAvatar, uploadAvatar } = useMemberProfile()
const { preferences } = useNotificationPreferences()
const { isLoading: isAddressesLoading } = useShippingAddresses()

// The form copies these into drafts during setup, so it must mount after all of them have loaded
const isFormDataReady = computed(() => preferences.value !== null && !isAddressesLoading.value)
</script>

<template>
  <div class="page-container pt-5 pb-12 xl:pt-9 xl:pb-16">
    <nav aria-label="breadcrumb" class="text-sm text-muted xl:text-[1.0625rem]">
      <ol class="flex items-center gap-1.5">
        <li>
          <NuxtLink to="/" class="hover:text-primary-dark hover:underline">
            หน้าแรก
          </NuxtLink>
        </li>
        <li aria-hidden="true">
          ›
        </li>
        <li aria-current="page">
          โปรไฟล์ของฉัน
        </li>
      </ol>
    </nav>

    <header class="mt-3 xl:mt-4">
      <h1 class="text-[1.75rem] leading-tight xl:text-[3.5rem]">
        โปรไฟล์ของฉัน
      </h1>
      <p class="mt-1 text-base text-muted xl:text-[1.375rem]">
        จัดการข้อมูลส่วนตัว ที่อยู่จัดส่ง และการแจ้งเตือน
      </p>
    </header>

    <ProfileSettingsForm v-if="profile && isFormDataReady" :profile="profile" class="mt-6 xl:mt-9">
      <template #summary>
        <ProfileSummaryCard
          :profile="profile"
          :is-uploading-avatar="isUploadingAvatar"
          @avatar-selected="uploadAvatar"
        />
      </template>
    </ProfileSettingsForm>
  </div>
</template>
