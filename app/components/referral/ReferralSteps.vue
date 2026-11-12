<script setup lang="ts">
const props = defineProps<{
  rewardPoints: number
}>()

const steps = computed(() => [
  { title: 'ส่งโค้ดให้เพื่อน', description: 'แชร์ผ่าน LINE หรือคัดลอกลิงก์', icon: 'lucide:users' },
  { title: 'เพื่อนสมัครสมาชิก', description: 'กรอกโค้ดของคุณตอนสมัคร', icon: 'lucide:pointer' },
  { title: 'เพื่อนสั่งซื้อครั้งแรก', description: 'กรอกเลขคำสั่งซื้อสำเร็จ', icon: null },
  { title: `รับ ${formatNumber(props.rewardPoints)} แต้มทั้งคู่`, description: 'แต้มเข้าอัตโนมัติ', icon: 'lucide:gift' }
])
</script>

<template>
  <section aria-labelledby="referral-steps-heading" class="mt-12 xl:mt-16">
    <h2 id="referral-steps-heading" class="text-2xl leading-tight xl:text-[2.25rem]">
      ได้แต้มยังไง
    </h2>
    <ol class="mt-4 grid grid-cols-2 gap-3 lg:grid-cols-4 xl:mt-6 xl:gap-6">
      <li v-for="(step, index) in steps" :key="step.title" class="flex flex-col rounded-[1.25rem] bg-cream p-4 xl:p-8">
        <div class="flex items-start justify-between">
          <span class="flex size-11 items-center justify-center rounded-full bg-white text-primary-dark xl:size-13">
            <Icon v-if="step.icon" :name="step.icon" class="size-5 xl:size-6" />
            <OrderEntryIcon v-else class="size-5 xl:size-6" />
          </span>
          <span class="flex size-8 items-center justify-center rounded-full bg-primary-soft font-number text-sm font-semibold text-primary-dark xl:size-10 xl:text-base">
            {{ index + 1 }}
          </span>
        </div>
        <h3 class="mt-4 font-sans text-base leading-tight font-semibold xl:mt-9 xl:text-[1.375rem]">
          {{ step.title }}
        </h3>
        <p class="mt-1 text-xs text-muted xl:text-[0.9375rem]">
          {{ step.description }}
        </p>
      </li>
    </ol>
  </section>
</template>
