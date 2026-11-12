<script setup lang="ts">
const languageSelectId = useId()
const selectedLanguage = ref('th')
</script>

<template>
  <div class="relative isolate min-h-80 flex-1 overflow-hidden">
    <NuxtImg
      src="/banners/yoyo-for-your-pet.jpg"
      alt="YoYo for your pet"
      width="960"
      height="540"
      preload
      class="absolute inset-0 -z-10 size-full object-cover object-right"
    />

    <div class="flex items-center justify-between px-4 pt-[calc(1rem+env(safe-area-inset-top))]">
      <img
        src="/logo/logo.png"
        alt="YoYo"
        width="88"
        height="88"
        class="size-11 rounded-xl"
      >

      <!-- Thai is the only language for now; a real select keeps the control honest until more locales ship -->
      <div class="relative flex h-8 items-center rounded-full bg-white/90 text-ink shadow-sm backdrop-blur-sm">
        <label :for="languageSelectId" class="sr-only">ภาษา</label>
        <Icon name="lucide:globe" class="pointer-events-none absolute left-2.5 size-4" aria-hidden="true" />
        <select
          :id="languageSelectId"
          v-model="selectedLanguage"
          class="h-full cursor-pointer appearance-none rounded-full bg-transparent pr-7 pl-8 text-sm font-semibold focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
        >
          <option value="th">
            ไทย
          </option>
        </select>
        <Icon name="lucide:chevron-down" class="pointer-events-none absolute right-2.5 size-3.5" aria-hidden="true" />
      </div>
    </div>
  </div>
</template>
