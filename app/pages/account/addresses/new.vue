<script setup lang="ts">
definePageMeta({ middleware: 'auth', hideMobileTabBar: true, hideSiteChromeOnMobile: true })

useSeoMeta({
  title: 'เพิ่มที่อยู่ใหม่ · YoyoPet'
})

const { isLoading: isAddressesLoading, canAddAddress } = useShippingAddresses()
const { profile } = useMemberProfile()

// The form copies the profile and the address count during setup, so it must mount after both have loaded
const isFormDataReady = computed(() => !isAddressesLoading.value && profile.value !== null)
</script>

<template>
  <div class="md:page-container md:pt-5 md:pb-16 xl:pt-9">
    <MobilePageHeader title="เพิ่มที่อยู่ใหม่" fallback-path="/account/addresses" />

    <div class="max-md:hidden">
      <PageBreadcrumb current-label="เพิ่มที่อยู่ใหม่" />
      <h1 class="mt-3 text-[1.75rem] leading-tight xl:mt-4 xl:text-[3.5rem]">
        เพิ่มที่อยู่ใหม่
      </h1>
    </div>

    <div v-if="!isFormDataReady" class="flex justify-center py-16" role="status">
      <Icon name="lucide:loader-circle" class="size-6 animate-spin text-muted" />
      <span class="sr-only">กำลังโหลด</span>
    </div>
    <div v-else-if="!canAddAddress" class="px-4 py-16 text-center md:px-0">
      <p class="text-sm text-muted">
        เก็บที่อยู่ได้สูงสุด 5 ที่อยู่ ลบที่อยู่เดิมก่อนเพิ่มใหม่
      </p>
      <NuxtLink to="/account/addresses" class="mt-3 inline-block text-sm font-semibold text-primary hover:underline">
        กลับไปที่อยู่จัดส่ง
      </NuxtLink>
    </div>
    <AddressForm v-else />
  </div>
</template>
