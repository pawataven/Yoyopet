<script setup lang="ts">
import type { MemberProfile } from '~/types/member'

const props = defineProps<{
  profile: MemberProfile
  isUploadingAvatar: boolean
}>()

const emit = defineEmits<{
  avatarSelected: [file: File]
}>()

const avatarInput = useTemplateRef<HTMLInputElement>('avatarInput')
const avatarInitial = computed(() => props.profile.firstName.charAt(0))

function handleAvatarChange(event: Event) {
  const input = event.target as HTMLInputElement
  const file = input.files?.[0]
  if (file) emit('avatarSelected', file)
  input.value = ''
}

const accountStatusRows = computed(() => [
  {
    label: 'บัญชี LINE',
    value: props.profile.isLineConnected ? 'เชื่อมต่อแล้ว' : 'ยังไม่เชื่อมต่อ',
    isPositive: props.profile.isLineConnected
  },
  {
    label: 'เบอร์โทร',
    value: props.profile.isPhoneVerified ? 'ยืนยันแล้ว' : 'ยังไม่ยืนยัน',
    isPositive: props.profile.isPhoneVerified
  }
])
</script>

<template>
  <section aria-label="สรุปบัญชีของฉัน" class="flex flex-col items-center rounded-[1.25rem] border bg-white px-5 pt-8 pb-5 xl:px-8 xl:pt-10 xl:pb-6">
    <div class="relative">
      <span class="flex size-28 items-center justify-center overflow-hidden rounded-full bg-primary-soft xl:size-36.5">
        <!-- Plain img: uploaded avatars can be blob/storage URLs that ipx can't fetch -->
        <img
          v-if="profile.avatarUrl"
          :src="profile.avatarUrl"
          :alt="`รูปโปรไฟล์ของ ${profile.firstName}`"
          class="size-full object-cover"
        >
        <span v-else class="font-heading text-5xl font-medium text-primary xl:text-[4.5rem]" aria-hidden="true">
          {{ avatarInitial }}
        </span>
      </span>

      <button
        type="button"
        aria-label="เปลี่ยนรูปโปรไฟล์"
        :disabled="isUploadingAvatar"
        class="absolute right-0 bottom-0 flex size-9 items-center justify-center rounded-full border bg-white text-ink shadow-sm shadow-ink/10 transition-colors hover:bg-primary-soft disabled:opacity-60 xl:-right-1 xl:size-10"
        @click="avatarInput?.click()"
      >
        <Icon :name="isUploadingAvatar ? 'lucide:loader-circle' : 'lucide:upload'" class="size-4 xl:size-4.5" :class="isUploadingAvatar && 'animate-spin'" />
      </button>
      <input
        ref="avatarInput"
        type="file"
        accept="image/*"
        class="hidden"
        tabindex="-1"
        aria-hidden="true"
        @change="handleAvatarChange"
      >
    </div>

    <p class="mt-5 font-heading text-2xl font-medium xl:mt-6 xl:text-[1.75rem]">
      คุณ{{ profile.firstName }}
    </p>
    <p class="mt-0.5 text-sm text-muted xl:text-[0.9375rem]">
      สมาชิกตั้งแต่ {{ formatThaiShortDate(profile.joinedAt) }}
    </p>
    <NuxtLink
      to="/tiers"
      class="mt-3 flex h-8 items-center rounded-full bg-primary px-5 text-sm font-semibold text-white transition-colors hover:bg-primary-dark xl:text-[0.9375rem]"
    >
      ระดับ {{ profile.tier }}
    </NuxtLink>

    <hr class="mt-6 w-full">

    <dl class="mt-5 w-full space-y-3 text-base xl:text-[1.0625rem]">
      <div class="flex items-center justify-between gap-4">
        <dt class="text-muted">
          รหัสสมาชิก
        </dt>
        <dd class="font-number font-semibold">
          {{ profile.memberCode }}
        </dd>
      </div>
      <div v-for="row in accountStatusRows" :key="row.label" class="flex items-center justify-between gap-4">
        <dt class="text-muted">
          {{ row.label }}
        </dt>
        <dd class="font-semibold" :class="row.isPositive ? 'text-success' : 'text-pending'">
          {{ row.value }}
        </dd>
      </div>
    </dl>

    <NuxtLink to="/profile/delete-account" class="mt-6 text-sm text-muted hover:text-primary-dark hover:underline xl:text-[0.9375rem]">
      ลบบัญชีสมาชิก
    </NuxtLink>
  </section>
</template>
