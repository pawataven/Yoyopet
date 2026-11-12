<script setup lang="ts">
import type { ReferralSummary } from '~/types/referral'

const props = defineProps<{
  referral: ReferralSummary
  signUpUrl: string
}>()

const { copiedKey, copy } = useClipboardCopy()
const isCodeCopied = computed(() => copiedKey.value === 'code')
const isLinkCopied = computed(() => copiedKey.value === 'link')

const lineShareUrl = computed(() => buildLineShareUrl(props.referral, props.signUpUrl))
const facebookShareUrl = computed(() => buildFacebookShareUrl(props.signUpUrl))

const shareButtonClass = 'flex h-12 items-center justify-center gap-2 rounded-xl px-4 text-sm font-semibold transition-colors xl:h-14 xl:w-50 xl:text-base'
</script>

<template>
  <section
    aria-label="โค้ดชวนเพื่อนของคุณ"
    class="mt-6 flex flex-col gap-6 rounded-[1.75rem] bg-primary-soft p-5 sm:flex-row sm:items-center sm:justify-between xl:mt-8 xl:pt-8 xl:pr-16 xl:pb-3.5 xl:pl-12"
  >
    <div class="min-w-0">
      <p class="text-sm xl:text-[0.9375rem]">
        โค้ดชวนเพื่อนของคุณ
      </p>
      <div class="mt-2 flex h-14 items-center justify-between gap-3 rounded-xl bg-white pr-2 pl-4 sm:max-w-140 xl:mt-5 xl:h-17.5 xl:pr-3 xl:pl-6">
        <span class="truncate font-number text-xl font-semibold tracking-wide xl:text-[1.75rem]">{{ referral.referralCode }}</span>
        <button
          type="button"
          class="flex h-10 shrink-0 items-center justify-center gap-1.5 rounded-xl border-2 border-primary px-4 text-sm font-semibold text-primary-dark transition-colors hover:bg-primary-soft xl:h-12 xl:w-36.5 xl:text-base"
          @click="copy(referral.referralCode, 'code')"
        >
          <Icon v-if="isCodeCopied" name="lucide:check" class="size-4" />
          {{ isCodeCopied ? 'คัดลอกแล้ว' : 'คัดลอก' }}
        </button>
      </div>

      <p class="mt-4 text-sm xl:mt-7 xl:text-[0.9375rem]">
        แชร์ให้เพื่อน
      </p>
      <div class="mt-2 grid grid-cols-3 gap-2 xl:mt-3 xl:flex xl:gap-4">
        <a
          :href="lineShareUrl"
          target="_blank"
          rel="noopener noreferrer"
          :class="[shareButtonClass, 'bg-line-green text-white hover:opacity-90']"
        >
          แชร์ผ่าน LINE
        </a>
        <a
          :href="facebookShareUrl"
          target="_blank"
          rel="noopener noreferrer"
          :class="[shareButtonClass, 'bg-cocoa text-white hover:bg-ink']"
        >
          Facebook
        </a>
        <button
          type="button"
          :class="[shareButtonClass, 'border-2 border-primary bg-white text-primary-dark hover:bg-primary-soft']"
          @click="copy(signUpUrl, 'link')"
        >
          <Icon v-if="isLinkCopied" name="lucide:check" class="size-4 shrink-0" />
          {{ isLinkCopied ? 'คัดลอกแล้ว' : 'คัดลอกลิงก์' }}
        </button>
      </div>
      <span class="sr-only" aria-live="polite">{{ isCodeCopied ? 'คัดลอกโค้ดแล้ว' : isLinkCopied ? 'คัดลอกลิงก์แล้ว' : '' }}</span>
    </div>

    <figure class="flex shrink-0 flex-col items-center self-center">
      <div class="rounded-2xl bg-white p-4 xl:p-5">
        <QrCode :value="signUpUrl" label="QR สำหรับสมัครสมาชิกด้วยโค้ดของคุณ" class="size-36 text-ink xl:size-52" />
      </div>
      <figcaption class="mt-1.5 text-xs text-muted xl:text-sm">
        สแกนเพื่อสมัคร
      </figcaption>
    </figure>
  </section>
</template>
