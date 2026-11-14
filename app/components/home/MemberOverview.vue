<script setup lang="ts">
const { member } = useMember()
const { dashboard } = useMemberDashboard()
</script>

<template>
  <template v-if="member && dashboard">
    <section aria-labelledby="member-greeting-mobile" class="md:hidden">
      <div class="mobile-hero bg-primary px-4 pt-4 pb-32 text-white">
        <h1 id="member-greeting-mobile" class="text-[1.625rem] leading-tight">
          สวัสดี คุณ{{ member.displayName }}
        </h1>
        <p class="mt-0.5 text-[0.9375rem] text-white/90">
          วันนี้ช้อปแล้วอย่าลืมกรอกเลขออเดอร์นะ
        </p>
      </div>

      <div class="-mt-28 px-4">
        <MobilePointsCard
          :points="member.points"
          :member-code="member.memberCode"
          :tier-progress="dashboard.tierProgress"
          :expiring-points="dashboard.expiringPoints"
        />
        <PendingOrdersBanner
          v-if="dashboard.pendingOrders.count > 0"
          :pending-orders="dashboard.pendingOrders"
          class="mt-4"
        />
        <MobileQuickActions class="mt-4" />
        <MobileOrderEntryCard class="mt-5" />
      </div>
    </section>

    <section aria-labelledby="member-greeting" class="page-container pt-6 max-md:hidden xl:pt-16">
      <header class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 id="member-greeting" class="text-[1.75rem] leading-tight xl:text-[3.5rem]">
            สวัสดี คุณ{{ member.displayName }}
          </h1>
          <p class="mt-1 text-base text-muted xl:text-[1.375rem]">
            ยินดีต้อนรับสู่ YoYo Member
          </p>
        </div>

        <p
          v-if="dashboard.isLineConnected"
          class="flex h-9 items-center gap-2.5 self-start rounded-full bg-line-green/10 px-4 text-sm text-success sm:self-auto xl:h-11.5 xl:px-5 xl:text-lg"
        >
          <span class="size-2.5 rounded-full bg-line-green" aria-hidden="true" />
          เชื่อมต่อบัญชี LINE แล้ว
        </p>
      </header>

      <div class="mt-6 grid grid-cols-1 gap-6 xl:mt-8 xl:grid-cols-[minmax(0,686fr)_minmax(0,970fr)]">
        <PointsCard
          :points="member.points"
          :member-code="member.memberCode"
          :tier-progress="dashboard.tierProgress"
          :expiring-points="dashboard.expiringPoints"
        />

        <div class="flex min-w-0 flex-col gap-6">
          <OrderEntryCard />
          <PendingOrdersBanner v-if="dashboard.pendingOrders.count > 0" :pending-orders="dashboard.pendingOrders" />
          <QuickActions />
        </div>
      </div>
    </section>
  </template>
</template>

<style scoped>
/* The red header's bottom edge curves upward under the points card, so only the gutters show its dipping corners */
.mobile-hero {
  background-image: radial-gradient(ellipse 58% 1.25rem at 50% 100%, var(--color-white) 98%, transparent 100%);
}
</style>
