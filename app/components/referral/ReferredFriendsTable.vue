<script setup lang="ts">
import type { ReferredFriend, ReferredFriendStatus } from '~/types/referral'

defineProps<{
  referredFriends: ReferredFriend[]
}>()

const statusAppearance: Record<ReferredFriendStatus, { label: string, class: string }> = {
  rewarded: { label: 'ได้แต้มแล้ว', class: 'bg-success/10 text-success' },
  awaiting_first_order: { label: 'รอสั่งซื้อครั้งแรก', class: 'bg-gold/25 text-pending' }
}

// Masked names look like "คุณป***"; the avatar shows the first unmasked letter after the honorific
function getInitial(displayName: string) {
  return displayName.replace(/^คุณ/, '').charAt(0)
}
</script>

<template>
  <section aria-labelledby="referred-friends-heading" class="mt-12 xl:mt-19">
    <h2 id="referred-friends-heading" class="text-2xl leading-tight xl:text-[2.25rem]">
      เพื่อนที่ชวนแล้ว
    </h2>

    <div v-if="referredFriends.length" class="mt-4 overflow-x-auto rounded-[1.25rem] border bg-white px-4 xl:mt-6 xl:px-10">
      <table class="w-full text-left">
        <thead>
          <tr class="border-b text-xs text-muted xl:text-sm">
            <th scope="col" class="w-1/3 pt-4 pb-3 font-normal xl:pt-6 xl:pb-4">
              เพื่อน
            </th>
            <th scope="col" class="hidden w-1/4 pt-4 pb-3 font-normal sm:table-cell xl:pt-6 xl:pb-4">
              วันที่สมัคร
            </th>
            <th scope="col" class="pt-4 pb-3 font-normal xl:pt-6 xl:pb-4">
              สถานะ
            </th>
            <th scope="col" class="pt-4 pb-3 text-right font-normal xl:pt-6 xl:pb-4">
              แต้มที่ได้
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="friend in referredFriends" :key="friend.id" class="border-b text-sm last:border-b-0 xl:text-base">
            <td class="py-3">
              <span class="flex items-center gap-3">
                <span class="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary-soft text-xs font-semibold text-primary-dark xl:size-10 xl:text-sm" aria-hidden="true">
                  {{ getInitial(friend.displayName) }}
                </span>
                {{ friend.displayName }}
              </span>
            </td>
            <td class="hidden py-3 text-muted sm:table-cell">
              {{ formatThaiShortDate(friend.signedUpAt) }}
            </td>
            <td class="py-3">
              <span class="inline-flex h-6 items-center rounded-full px-3 text-xs font-semibold whitespace-nowrap xl:h-7 xl:text-sm" :class="statusAppearance[friend.status].class">
                {{ statusAppearance[friend.status].label }}
              </span>
            </td>
            <td class="py-3 text-right">
              <span v-if="friend.pointsEarned" class="font-number text-base font-semibold text-success xl:text-lg">
                +{{ formatNumber(friend.pointsEarned) }}
              </span>
              <span v-else class="text-muted" aria-label="ยังไม่ได้แต้ม">–</span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <p v-else class="mt-4 rounded-[1.25rem] border bg-cream px-6 py-12 text-center text-muted xl:mt-6 xl:text-lg">
      ยังไม่มีเพื่อนที่สมัครด้วยโค้ดของคุณ
    </p>
  </section>
</template>
