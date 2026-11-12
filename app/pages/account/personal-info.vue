<script setup lang="ts">
definePageMeta({ middleware: 'auth', hideMobileTabBar: true, hideSiteChromeOnMobile: true })

useSeoMeta({
  title: 'ข้อมูลส่วนตัว · YoyoPet'
})

const { profile } = useMemberProfile()
</script>

<template>
  <div class="md:page-container md:pt-5 md:pb-16 xl:pt-9">
    <MobilePageHeader title="ข้อมูลส่วนตัว" fallback-path="/account" />

    <div class="max-md:hidden">
      <PageBreadcrumb current-label="ข้อมูลส่วนตัว" />
      <h1 class="mt-3 text-[1.75rem] leading-tight xl:mt-4 xl:text-[3.5rem]">
        ข้อมูลส่วนตัว
      </h1>
    </div>

    <PersonalInfoForm v-if="profile" :profile="profile" />
    <div v-else class="flex justify-center py-16" role="status">
      <Icon name="lucide:loader-circle" class="size-6 animate-spin text-muted" />
      <span class="sr-only">กำลังโหลดข้อมูล</span>
    </div>
  </div>
</template>
