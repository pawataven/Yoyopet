<script setup lang="ts">
import type { ShippingAddress } from '~/types/address'

const props = defineProps<{
  addresses: ShippingAddress[]
  selectedAddressId: string | null
  headingId: string
}>()

const emit = defineEmits<{
  apply: [addressId: string]
  cancel: []
  navigate: []
}>()

const draftAddressId = ref(props.selectedAddressId)
const radioGroupName = useId()
</script>

<template>
  <div>
    <h2 :id="headingId" class="pr-12 text-xl leading-tight sm:text-[1.75rem]">
      เลือกที่อยู่จัดส่ง
    </h2>

    <fieldset class="mt-5 space-y-3 sm:mt-6 sm:space-y-4">
      <legend class="sr-only">
        ที่อยู่จัดส่ง
      </legend>
      <div
        v-for="address in addresses"
        :key="address.id"
        class="rounded-2xl border-2 px-4 pt-4 pb-3 transition-colors has-focus-visible:ring-4 has-focus-visible:ring-primary-soft sm:px-6"
        :class="draftAddressId === address.id ? 'border-primary bg-cream' : 'border-border hover:border-primary/25'"
      >
        <label class="flex cursor-pointer items-start gap-3">
          <input
            v-model="draftAddressId"
            type="radio"
            :name="radioGroupName"
            :value="address.id"
            class="peer sr-only"
          >
          <span
            class="mt-0.5 flex size-5.5 shrink-0 items-center justify-center rounded-full border-2 border-muted/40 peer-checked:border-primary"
            aria-hidden="true"
          >
            <span
              class="size-2.5 rounded-full bg-primary transition-transform"
              :class="draftAddressId === address.id ? 'scale-100' : 'scale-0'"
            />
          </span>
          <span class="min-w-0 flex-1">
            <span class="block font-semibold sm:text-lg">
              {{ address.recipientName }} · {{ address.phone }}
            </span>
            <span class="mt-1 block text-sm text-muted sm:text-base">
              {{ formatThaiAddress(address) }}
            </span>
          </span>
          <span
            v-if="address.label"
            class="flex h-7 shrink-0 items-center rounded-full px-3 text-xs font-semibold sm:h-8 sm:px-4 sm:text-sm"
            :class="draftAddressId === address.id ? 'bg-primary-soft text-primary-dark' : 'bg-border text-muted'"
          >
            {{ address.label }}
          </span>
        </label>
        <NuxtLink
          :to="`/profile/addresses/${address.id}/edit`"
          :aria-label="`แก้ไขที่อยู่${address.label ?? ''} ${address.recipientName}`"
          class="mt-1 ml-8.5 inline-block text-sm font-semibold text-primary-dark hover:underline sm:text-base"
          @click="emit('navigate')"
        >
          แก้ไข
        </NuxtLink>
      </div>
    </fieldset>

    <NuxtLink
      to="/profile/addresses/new"
      class="mt-3 flex h-14 items-center justify-center gap-3 rounded-2xl border-2 border-dashed border-primary/30 text-base font-semibold text-primary-dark transition-colors hover:bg-cream sm:mt-4 sm:h-18 sm:text-lg"
      @click="emit('navigate')"
    >
      <Icon name="lucide:plus" class="size-5" />
      เพิ่มที่อยู่ใหม่
    </NuxtLink>

    <div class="mt-8 grid grid-cols-1 gap-3 sm:mt-16 sm:grid-cols-2 sm:gap-4">
      <button
        type="button"
        class="flex h-12 w-full items-center justify-center rounded-xl border-2 border-primary text-base font-semibold text-primary-dark transition-colors hover:bg-primary-soft max-sm:order-2 sm:h-14 sm:text-lg"
        @click="emit('cancel')"
      >
        ยกเลิก
      </button>
      <button
        type="button"
        :disabled="!draftAddressId"
        class="flex h-12 w-full items-center justify-center rounded-xl bg-primary text-base font-semibold text-white transition-colors hover:bg-primary-dark disabled:cursor-not-allowed disabled:opacity-60 sm:h-14 sm:text-lg"
        @click="draftAddressId && emit('apply', draftAddressId)"
      >
        ใช้ที่อยู่นี้
      </button>
    </div>
  </div>
</template>
