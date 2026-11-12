<script setup lang="ts">
import type { ShippingAddress } from '~/types/address'

defineProps<{
  addresses: ShippingAddress[]
}>()

const selectedAddressId = defineModel<string | null>({ required: true })

const radioGroupName = useId()
</script>

<template>
  <section id="shipping-addresses" aria-labelledby="shipping-address-heading" class="scroll-mt-24 rounded-[1.25rem] xl:scroll-mt-32 border bg-white p-5 xl:p-10">
    <div class="flex items-center justify-between gap-4">
      <h2 id="shipping-address-heading" class="text-xl leading-tight xl:text-[1.625rem]">
        ที่อยู่จัดส่งของรางวัล
      </h2>
      <NuxtLink to="/profile/addresses/new" class="shrink-0 text-sm font-semibold text-primary-dark hover:underline xl:text-lg">
        + เพิ่มที่อยู่
      </NuxtLink>
    </div>

    <fieldset v-if="addresses.length" class="mt-5 space-y-3 xl:mt-6">
      <legend class="sr-only">
        เลือกที่อยู่จัดส่งเริ่มต้น
      </legend>
      <div
        v-for="address in addresses"
        :key="address.id"
        class="rounded-2xl border-2 p-4 transition-colors has-focus-visible:ring-4 has-focus-visible:ring-primary-soft xl:px-6 xl:pt-4 xl:pb-3"
        :class="selectedAddressId === address.id ? 'border-primary/40 bg-cream' : 'border-border hover:border-primary/25'"
      >
        <label class="flex cursor-pointer items-start gap-3 xl:gap-3.5">
          <input
            v-model="selectedAddressId"
            type="radio"
            :name="radioGroupName"
            :value="address.id"
            class="peer sr-only"
          >
          <span
            class="mt-0.5 flex size-5.5 shrink-0 items-center justify-center rounded-full border-2 border-muted/40 peer-checked:border-primary xl:size-6"
            aria-hidden="true"
          >
            <span
              class="size-2.5 rounded-full bg-primary transition-transform xl:size-3"
              :class="selectedAddressId === address.id ? 'scale-100' : 'scale-0'"
            />
          </span>
          <span class="min-w-0 flex-1">
            <span class="block text-base font-semibold xl:text-lg">
              {{ address.recipientName }} · {{ address.phone }}
            </span>
            <span class="mt-1 block text-sm text-muted xl:text-[1.0625rem]">
              {{ formatThaiAddress(address) }}
            </span>
          </span>
          <span
            v-if="selectedAddressId === address.id"
            class="flex h-7 shrink-0 items-center rounded-full bg-primary-soft px-3 text-xs font-semibold text-primary-dark xl:h-8 xl:px-4 xl:text-sm"
          >
            ค่าเริ่มต้น
          </span>
        </label>
        <div class="mt-2 flex justify-end">
          <NuxtLink
            :to="`/profile/addresses/${address.id}/edit`"
            :aria-label="`แก้ไขที่อยู่ของ ${address.recipientName}`"
            class="text-sm font-semibold text-primary-dark hover:underline xl:text-lg"
          >
            แก้ไข
          </NuxtLink>
        </div>
      </div>
    </fieldset>

    <p v-else class="mt-5 rounded-2xl bg-cream px-5 py-6 text-center text-sm text-muted xl:text-base">
      ยังไม่มีที่อยู่จัดส่ง เพิ่มที่อยู่เพื่อรับของรางวัล
    </p>
  </section>
</template>
