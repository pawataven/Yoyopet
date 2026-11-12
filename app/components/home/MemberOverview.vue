<script setup lang="ts">
const { member } = useMember()
const { dashboard } = useMemberDashboard()
</script>

<template>
  <section v-if="member && dashboard" aria-labelledby="member-greeting" class="page-container pt-6 xl:pt-16">
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
