<script setup lang="ts">
const SIMILAR_REWARD_LIMIT = 4

// TODO: confirm the final redemption terms with the business team
const productRedemptionTerms = [
  'แลกแล้วยกเลิกหรือคืนแต้มไม่ได้',
  'จัดส่งเฉพาะในประเทศไทย',
  'สินค้ามีจำนวนจำกัด',
  'ภาพสินค้าใช้เพื่อการโฆษณา'
]
const couponRedemptionTerms = [
  'แลกแล้วยกเลิกหรือคืนแต้มไม่ได้',
  'คูปองมีอายุ 30 วันหลังแลก',
  'ใช้ได้ 1 ใบต่อ 1 คำสั่งซื้อ'
]

definePageMeta({ middleware: 'auth' })

const route = useRoute()
const rewardId = computed(() => String(route.params.id))

const { rewardDetail, isLoading } = useRewardDetail(rewardId)
const { similarRewards } = useSimilarRewards(rewardId, SIMILAR_REWARD_LIMIT)
const { member } = useMember()

const memberPoints = computed(() => member.value?.points ?? 0)
const quantity = ref(1)
const isRedeemDialogOpen = ref(false)

watch(rewardId, () => {
  quantity.value = 1
})

useSeoMeta({
  title: () => `${rewardDetail.value?.name ?? 'ของรางวัล'} · YoyoPet`,
  description: () => rewardDetail.value?.tagline ?? 'ใช้แต้มแลกคูปองส่วนลดและสินค้า YoYo'
})
</script>

<template>
  <div class="page-container pt-5 pb-12 xl:pt-9 xl:pb-16">
    <template v-if="rewardDetail">
      <PageBreadcrumb
        :trail="[{ label: 'ของรางวัล', to: '/rewards' }]"
        :current-label="rewardGroupLabels[rewardDetail.group]"
      />

      <header class="mt-3 xl:mt-4">
        <h1 class="font-sans text-[1.75rem] leading-tight font-semibold xl:text-[3.5rem]">
          {{ rewardDetail.name }}
        </h1>
        <p v-if="rewardDetail.tagline" class="mt-1 text-base text-muted xl:text-[1.375rem]">
          {{ rewardDetail.tagline }}
        </p>
      </header>

      <div class="mt-6 grid items-start gap-8 lg:grid-cols-2 xl:mt-8 xl:grid-cols-[minmax(0,829fr)_minmax(0,688fr)] xl:gap-40">
        <RewardGallery :reward="rewardDetail" />
        <RewardRedeemPanel
          v-model:quantity="quantity"
          :reward="rewardDetail"
          :member-points="memberPoints"
          @redeem="isRedeemDialogOpen = true"
        />
      </div>

      <TermsNote
        title="เงื่อนไขการแลก"
        :terms="rewardDetail.category === 'coupon' ? couponRedemptionTerms : productRedemptionTerms"
        class="mt-8 xl:mt-14"
      />

      <section v-if="similarRewards.length" aria-labelledby="similar-rewards-heading" class="mt-12 xl:mt-17">
        <div class="flex items-center justify-between gap-4">
          <h2 id="similar-rewards-heading" class="text-2xl leading-tight xl:text-[2.25rem]">
            ของรางวัลที่คล้ายกัน
          </h2>
          <NuxtLink to="/rewards" class="shrink-0 text-sm font-semibold text-primary-dark hover:underline xl:text-lg">
            ดูทั้งหมด ›
          </NuxtLink>
        </div>
        <ul class="mt-4 grid grid-cols-2 gap-3 lg:grid-cols-4 xl:mt-6 xl:gap-6">
          <li v-for="reward in similarRewards" :key="reward.id" class="flex">
            <RewardCard :reward="reward" :member-points="memberPoints" variant="catalog" class="w-full" />
          </li>
        </ul>
      </section>

      <RewardRedeemDialog
        v-model:open="isRedeemDialogOpen"
        :reward="rewardDetail"
        :quantity="quantity"
        :member-points="memberPoints"
      />
    </template>

    <div v-else-if="!isLoading" class="py-20 text-center">
      <p class="text-lg text-muted xl:text-xl">
        ไม่พบของรางวัลนี้
      </p>
      <NuxtLink to="/rewards" class="mt-4 inline-flex h-12 items-center rounded-xl bg-primary px-8 font-semibold text-white hover:bg-primary-dark">
        กลับหน้าของรางวัล
      </NuxtLink>
    </div>
  </div>
</template>
