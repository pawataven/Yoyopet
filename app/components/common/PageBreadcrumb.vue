<script setup lang="ts">
defineProps<{
  currentLabel: string
}>()
</script>

<template>
  <nav aria-label="breadcrumb" class="text-sm text-muted xl:text-[1.0625rem]">
    <ol class="flex items-center gap-1.5">
      <li>
        <NuxtLink to="/" class="hover:text-primary-dark hover:underline">
          หน้าแรก
        </NuxtLink>
      </li>
      <li aria-hidden="true">
        ›
      </li>
      <li aria-current="page">
        {{ currentLabel }}
      </li>
    </ol>
  </nav>
</template>
