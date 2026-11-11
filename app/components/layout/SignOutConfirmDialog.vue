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
    class="max-w-110"
    @opened="cancelButton?.focus()"
  >
    <div class="p-6 text-center sm:p-10">
      <span class="mx-auto flex size-14 items-center justify-center rounded-full bg-primary-soft text-primary-dark sm:size-16" aria-hidden="true">
        <Icon name="lucide:log-out" class="size-6 sm:size-7" />
      </span>

      <h2 :id="headingId" class="mt-4 text-xl leading-tight sm:mt-5 sm:text-[1.625rem]">
        ออกจากระบบ?
      </h2>
      <p :id="descriptionId" class="mt-2 text-sm text-muted sm:text-[1.0625rem]">
        แต้มและคูปองของคุณยังอยู่ครบ เข้าสู่ระบบอีกครั้งได้ทุกเมื่อ
      </p>

      <div class="mt-6 grid grid-cols-2 gap-3 sm:mt-8">
        <button
          ref="cancelButton"
          type="button"
          :disabled="isSigningOut"
          class="h-12 rounded-xl border-2 border-primary bg-white text-base font-semibold text-primary-dark transition-colors hover:bg-primary-soft disabled:opacity-60 sm:h-14 sm:text-lg"
          @click="isOpen = false"
        >
          ยกเลิก
        </button>
        <button
          type="button"
          :disabled="isSigningOut"
          class="flex h-12 items-center justify-center gap-2 rounded-xl bg-primary text-base font-semibold text-white transition-colors hover:bg-primary-dark disabled:opacity-60 sm:h-14 sm:text-lg"
          @click="handleConfirm"
        >
          <Icon v-if="isSigningOut" name="lucide:loader-circle" class="size-5 animate-spin" />
          ออกจากระบบ
        </button>
      </div>
    </div>
  </ModalDialog>
</template>
