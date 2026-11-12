<script setup lang="ts">
const { redemptions } = useRecentRewardRedemptions()
</script>

<template>
  <section v-if="redemptions.length" aria-labelledby="recent-redemptions-heading" class="rounded-[1.25rem] border bg-white px-5 py-5 xl:px-7 xl:py-7">
    <h2 id="recent-redemptions-heading" class="font-sans text-base leading-tight font-semibold xl:text-lg">
      การแลกล่าสุดของฉัน
    </h2>

    <ul class="mt-4 space-y-6 xl:mt-6 xl:space-y-10">
      <li
        v-for="redemption in redemptions"
        :key="redemption.id"
        class="flex items-center gap-4"
      >
        <span
          v-if="redemption.couponValueBaht !== null"
          class="flex size-14 shrink-0 items-center justify-center rounded-xl bg-primary font-number text-xl font-semibold text-white xl:size-19 xl:text-2xl"
          aria-hidden="true"
        >
          {{ formatNumber(redemption.couponValueBaht) }}
        </span>
        <NuxtImg
          v-else-if="redemption.imageUrl"
          :src="redemption.imageUrl"
          alt=""
          width="144"
          height="96"
          class="size-14 shrink-0 rounded-xl border object-cover xl:size-19"
        />
        <span v-else class="flex size-14 shrink-0 items-center justify-center rounded-xl bg-cream text-primary xl:size-19" aria-hidden="true">
          <Icon name="lucide:gift" class="size-6" />
        </span>

        <div class="min-w-0 flex-1">
          <p class="truncate text-sm xl:text-[0.9375rem]">
            {{ redemption.rewardName }}
          </p>
          <p class="text-xs text-muted xl:text-[0.8125rem]">
            แลกเมื่อ {{ formatThaiShortDate(redemption.redeemedAt) }}
          </p>
          <span
            class="mt-1.5 inline-flex h-6 items-center rounded-full px-3 text-xs font-semibold xl:h-7 xl:text-[0.8125rem]"
            :class="rewardRedemptionStatusAppearance[redemption.status].class"
          >
            {{ rewardRedemptionStatusAppearance[redemption.status].label }}
          </span>
        </div>
      </li>
    </ul>

    <div class="mt-4 text-right xl:mt-5">
      <NuxtLink to="/rewards/history" class="text-sm font-semibold text-primary-dark hover:underline xl:text-[0.9375rem]">
        ดูทั้งหมด ›
      </NuxtLink>
    </div>
  </section>
</template>
