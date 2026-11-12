<template>
  <button
    type="button"
    aria-haspopup="dialog"
    class="group flex min-h-60 flex-col items-center justify-center rounded-[1.25rem] border-2 border-dashed border-primary/30 bg-white p-6 text-center transition-colors hover:border-primary/60 hover:bg-cream"
  >
    <span class="flex size-18 items-center justify-center rounded-full bg-primary-soft text-primary transition-colors group-hover:bg-primary group-hover:text-white xl:size-25">
      <Icon name="lucide:plus" class="size-8 xl:size-10" />
    </span>
    <span class="mt-4 font-heading text-lg font-medium text-primary-dark xl:mt-6 xl:text-2xl">
      เพิ่มสัตว์เลี้ยง
    </span>
    <span class="mt-1 text-sm text-muted xl:text-[0.9375rem]">
      เพิ่มได้ไม่จำกัดจำนวน
    </span>
  </button>
</template>
