<script setup lang="ts">
import { MAX_SHIPPING_ADDRESSES } from '~/types/address'
import type { ShippingAddress } from '~/types/address'

definePageMeta({ middleware: 'auth', hideMobileTabBar: true, hideSiteChromeOnMobile: true })

useSeoMeta({
  title: 'ที่อยู่จัดส่ง · YoyoPet'
})

const { addresses, canAddAddress, isLoading } = useShippingAddresses()

function addressTitle(address: ShippingAddress) {
  return [address.label, address.recipientName].filter(Boolean).join(' · ')
}
</script>

<template>
  <div class="md:page-container md:pt-5 md:pb-16 xl:pt-9">
    <MobilePageHeader title="ที่อยู่จัดส่ง" fallback-path="/account" />

    <div class="max-md:hidden">
      <PageBreadcrumb current-label="ที่อยู่จัดส่ง" />
      <h1 class="mt-3 text-[1.75rem] leading-tight xl:mt-4 xl:text-[3.5rem]">
        ที่อยู่จัดส่ง
      </h1>
    </div>

    <div class="px-4 pt-4 pb-[calc(2rem+env(safe-area-inset-bottom))] md:mt-6 md:max-w-2xl md:px-0 xl:mt-8">
      <div v-if="isLoading && addresses.length === 0" class="flex justify-center py-16" role="status">
        <Icon name="lucide:loader-circle" class="size-6 animate-spin text-muted" />
        <span class="sr-only">กำลังโหลดที่อยู่</span>
      </div>

      <template v-else>
        <ul v-if="addresses.length" class="space-y-3">
          <li
            v-for="address in addresses"
            :key="address.id"
            class="flex gap-3 rounded-2xl border bg-white px-4 py-4"
          >
            <Icon name="lucide:map-pin" class="mt-0.5 size-5 shrink-0 text-primary" aria-hidden="true" />
            <div class="min-w-0 flex-1">
              <p class="flex flex-wrap items-center gap-x-2 gap-y-1">
                <span class="text-[0.9375rem] font-semibold">{{ addressTitle(address) }}</span>
                <span v-if="address.isDefault" class="rounded-full bg-border/70 px-2 py-0.5 text-xs font-semibold">ค่าเริ่มต้น</span>
              </p>
              <p class="mt-1 text-xs leading-relaxed text-muted">
                <span v-for="line in formatThaiAddressLines(address)" :key="line" class="block">{{ line }}</span>
                <span class="block tabular-nums">{{ maskThaiMobile(address.phone) }}</span>
              </p>
            </div>
            <NuxtLink
              :to="`/account/addresses/${address.id}`"
              :aria-label="`แก้ไขที่อยู่ ${addressTitle(address)}`"
              class="shrink-0 self-start text-sm font-semibold text-primary hover:underline"
            >
              แก้ไข
            </NuxtLink>
          </li>
        </ul>

        <p v-else class="rounded-2xl border bg-white px-4 py-8 text-center text-sm text-muted">
          ยังไม่มีที่อยู่จัดส่ง
        </p>

        <NuxtLink
          v-if="canAddAddress"
          to="/account/addresses/new"
          class="mt-3 flex h-16 items-center justify-center gap-3 rounded-2xl border-2 border-dashed border-primary/30 bg-primary-soft/30 text-[0.9375rem] font-semibold text-primary-dark transition-colors hover:bg-primary-soft/60"
        >
          <span class="flex size-7 items-center justify-center rounded-full bg-primary text-white" aria-hidden="true">
            <Icon name="lucide:plus" class="size-4" />
          </span>
          เพิ่มที่อยู่ใหม่
        </NuxtLink>
        <p v-else class="mt-3 rounded-2xl bg-cream px-4 py-3 text-center text-sm text-muted">
          ครบ {{ MAX_SHIPPING_ADDRESSES }} ที่อยู่แล้ว ลบที่อยู่เดิมก่อนเพิ่มใหม่
        </p>

        <p class="mt-4 text-xs text-muted">
          เก็บได้สูงสุด {{ MAX_SHIPPING_ADDRESSES }} ที่อยู่ · ใช้ตอนแลกของรางวัลที่ต้องจัดส่ง
        </p>
      </template>
    </div>
  </div>
</template>
