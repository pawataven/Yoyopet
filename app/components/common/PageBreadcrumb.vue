<script setup lang="ts">
withDefaults(defineProps<{
  currentLabel: string
  trail?: { label: string, to: string }[]
}>(), {
  trail: () => []
})
</script>

<template>
  <nav aria-label="breadcrumb" class="text-sm text-muted xl:text-[1.0625rem]">
    <ol class="flex flex-wrap items-center gap-1.5">
      <li>
        <NuxtLink to="/" class="hover:text-primary-dark hover:underline">
          หน้าแรก
        </NuxtLink>
      </li>
      <template v-for="crumb in trail" :key="crumb.to">
        <li aria-hidden="true">
          ›
        </li>
        <li>
          <NuxtLink :to="crumb.to" class="hover:text-primary-dark hover:underline">
            {{ crumb.label }}
          </NuxtLink>
        </li>
      </template>
      <li aria-hidden="true">
        ›
      </li>
      <li aria-current="page">
        {{ currentLabel }}
      </li>
    </ol>
  </nav>
</template>
