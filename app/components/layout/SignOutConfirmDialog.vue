<script setup lang="ts">
const isOpen = defineModel<boolean>('open', { required: true })

const { signOut } = useAuth()

const headingId = useId()
const descriptionId = `${headingId}-description`
const cancelButton = useTemplateRef<HTMLButtonElement>('cancelButton')
const isSigningOut = ref(false)

async function handleConfirm() {
  isSigningOut.value = true
  try {
    await signOut()
    isOpen.value = false
  } finally {
    isSigningOut.value = false
  }
}
</script>

<template>
  <!-- Focus starts on "cancel" so a stray Enter doesn't sign the member out -->
  <ModalDialog
    v-model:open="isOpen"
    :aria-labelledby="headingId"
    :aria-describedby="descriptionId"
    role="alertdialog"
    class="max-w-80 sm:max-w-110"
    @opened="cancelButton?.focus()"
  >
    <div class="px-5 pt-6 pb-6 text-center sm:p-10">
      <span class="mx-auto flex size-14 items-center justify-center rounded-full bg-primary-soft text-primary sm:size-16" aria-hidden="true">
        <Icon name="lucide:log-out" class="size-6 -scale-x-100 sm:size-7" />
      </span>

      <h2 :id="headingId" class="mt-4 text-xl leading-tight sm:mt-5 sm:text-[1.625rem]">
        ออกจากระบบ?
      </h2>
      <p :id="descriptionId" class="mt-1.5 text-xs sm:mt-2 text-muted sm:text-[1.0625rem]">
        แต้มและคูปองยังอยู่ครบ เข้าสู่ระบบใหม่ได้ทุกเมื่อ
      </p>

      <div class="mt-5 grid grid-cols-2 gap-3 sm:mt-8">
        <button
          ref="cancelButton"
          type="button"
          :disabled="isSigningOut"
          class="h-12 rounded-full border-2 border-border bg-white text-[0.9375rem] font-semibold text-ink transition-colors hover:border-primary hover:text-primary-dark disabled:opacity-60 sm:h-14 sm:text-lg"
          @click="isOpen = false"
        >
          ยกเลิก
        </button>
        <button
          type="button"
          :disabled="isSigningOut"
          class="flex h-12 items-center justify-center gap-2 rounded-full bg-primary text-[0.9375rem] font-semibold text-white transition-colors hover:bg-primary-dark disabled:opacity-60 sm:h-14 sm:text-lg"
          @click="handleConfirm"
        >
          <Icon v-if="isSigningOut" name="lucide:loader-circle" class="size-5 animate-spin" />
          ออกจากระบบ
        </button>
      </div>
    </div>
  </ModalDialog>
</template>
