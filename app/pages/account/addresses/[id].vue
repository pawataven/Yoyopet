<script setup lang="ts">
definePageMeta({ middleware: 'auth', hideMobileTabBar: true, hideSiteChromeOnMobile: true })

useSeoMeta({
  title: 'แก้ไขที่อยู่ · YoyoPet'
})

const route = useRoute()
const { addresses, isLoading } = useShippingAddresses()

const address = computed(() => addresses.value.find(entry => entry.id === route.params.id) ?? null)
</script>

<template>
  <div class="md:page-container md:pt-5 md:pb-16 xl:pt-9">
    <MobilePageHeader title="แก้ไขที่อยู่" fallback-path="/account/addresses" />

    <div class="max-md:hidden">
      <PageBreadcrumb current-label="แก้ไขที่อยู่" />
      <h1 class="mt-3 text-[1.75rem] leading-tight xl:mt-4 xl:text-[3.5rem]">
        แก้ไขที่อยู่
      </h1>
    </div>

    <div v-if="isLoading && !address" class="flex justify-center py-16" role="status">
      <Icon name="lucide:loader-circle" class="size-6 animate-spin text-muted" />
      <span class="sr-only">กำลังโหลดที่อยู่</span>
    </div>
    <div v-else-if="!address" class="px-4 py-16 text-center md:px-0">
      <p class="text-sm text-muted">
        ไม่พบที่อยู่นี้ อาจถูกลบไปแล้ว
      </p>
      <NuxtLink to="/account/addresses" class="mt-3 inline-block text-sm font-semibold text-primary hover:underline">
        กลับไปที่อยู่จัดส่ง
      </NuxtLink>
    </div>
    <AddressForm v-else :key="address.id" :address="address" />
  </div>
</template>
