<script setup lang="ts">
import type { Pet } from '~/types/pet'

const MAX_VISIBLE_PETS = 2

const props = defineProps<{
  pets: Pet[]
}>()

const visiblePets = computed(() => props.pets.slice(0, MAX_VISIBLE_PETS))
</script>

<template>
  <section aria-labelledby="my-pets-heading" class="flex flex-col rounded-[1.25rem] border bg-white p-6 xl:p-8">
    <div class="flex items-center justify-between gap-4">
      <h2 id="my-pets-heading" class="text-lg leading-tight xl:text-2xl">
        สัตว์เลี้ยงของฉัน
      </h2>
      <NuxtLink to="/pets" class="shrink-0 text-sm font-semibold text-primary-dark hover:underline xl:text-lg">
        จัดการ ›
      </NuxtLink>
    </div>

    <ul class="mt-5 mb-5 grid grid-cols-3 xl:mt-7">
      <li v-for="pet in visiblePets" :key="pet.id" class="flex flex-col items-center text-center">
        <NuxtImg
          v-if="pet.photoUrl"
          :src="pet.photoUrl"
          :alt="pet.name"
          width="96"
          height="96"
          loading="lazy"
          class="size-18 rounded-full object-cover xl:size-24"
        />
        <span v-else class="flex size-18 items-center justify-center rounded-full bg-primary-soft text-primary xl:size-24">
          <Icon name="lucide:paw-print" class="size-8" />
        </span>
        <p class="mt-3 font-semibold xl:mt-4.5 xl:text-xl">
          {{ pet.name }}
        </p>
        <p class="text-xs text-muted xl:text-sm">
          {{ pet.breed }}<template v-if="pet.birthDate">
            · {{ formatPetAge(pet.birthDate) }}
          </template>
        </p>
      </li>
      <li class="flex flex-col items-center text-center">
        <NuxtLink to="/pets/new" class="group flex flex-col items-center">
          <span class="flex size-18 items-center justify-center rounded-full border-2 border-dashed border-primary/50 text-primary-dark transition-colors group-hover:bg-primary-soft xl:size-24">
            <Icon name="lucide:plus" class="size-6 xl:size-7" />
          </span>
          <span class="mt-3 font-semibold text-primary-dark xl:mt-4.5 xl:text-xl">เพิ่มน้อง</span>
        </NuxtLink>
      </li>
    </ul>

    <p class="mt-auto rounded-2xl bg-cream px-4 py-3 text-center text-xs text-muted xl:py-3 xl:text-base">
      ใส่วันเกิดน้อง รับคูปองวันเกิดทุกปี
    </p>
  </section>
</template>
