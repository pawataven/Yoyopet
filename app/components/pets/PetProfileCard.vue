<script setup lang="ts">
import type { Pet } from '~/types/pet'

const props = defineProps<{
  pet: Pet
  isBirthdayMonth: boolean
}>()

const speciesAndBreed = computed(() =>
  [petSpeciesLabels[props.pet.species], props.pet.breed].filter(Boolean).join(' · ')
)

const physicalDetails = computed(() => [
  props.pet.sex === 'female' ? 'เพศเมีย' : props.pet.sex === 'male' ? 'เพศผู้' : null,
  props.pet.weightKg !== null ? `${formatNumber(props.pet.weightKg)} กก.` : null
].filter(Boolean).join(' · '))
</script>

<template>
  <article class="flex flex-col rounded-[1.25rem] border bg-white p-3 xl:p-[0.9375rem]">
    <div class="relative">
      <!-- No width/height: member photos come in any ratio, and passing a fixed pair makes ipx center-crop before CSS can position the face -->
      <PetPhoto
        v-if="pet.photoUrl"
        :src="pet.photoUrl"
        :alt="pet.name"
        sizes="100vw md:50vw xl:540px"
        class="aspect-[32/17] w-full rounded-xl object-cover object-[center_12%]"
      />
      <div v-else class="flex aspect-[32/17] w-full items-center justify-center rounded-xl bg-cream text-primary">
        <Icon :name="petSpeciesIcons[pet.species]" class="size-12" />
      </div>
      <span
        v-if="isBirthdayMonth"
        class="absolute top-3 left-3 flex h-7 items-center rounded-full bg-primary px-3 text-xs font-semibold text-white xl:top-4 xl:left-4 xl:h-8 xl:px-4 xl:text-sm"
      >
        วันเกิดเดือนนี้!
      </span>
    </div>

    <div class="px-2 pt-4 pb-2 xl:px-3 xl:pt-6 xl:pb-8">
      <div class="flex items-start justify-between gap-3">
        <div class="min-w-0">
          <h2 class="truncate text-xl leading-tight xl:text-[1.625rem]">
            {{ pet.name }}
          </h2>
          <p class="mt-0.5 truncate text-sm text-muted xl:mt-1 xl:text-[0.9375rem]">
            {{ speciesAndBreed }}
          </p>
        </div>
        <NuxtLink
          :to="`/pets/${pet.id}/edit`"
          :aria-label="`แก้ไขข้อมูล${pet.name}`"
          class="shrink-0 text-sm font-semibold text-primary-dark hover:underline xl:text-[0.9375rem]"
        >
          แก้ไข
        </NuxtLink>
      </div>

      <ul class="mt-4 space-y-2 text-sm xl:mt-5 xl:space-y-2.5 xl:text-[0.9375rem]">
        <li class="flex items-center gap-2.5">
          <Icon name="lucide:cake" class="size-4 shrink-0 text-muted xl:size-4.5" />
          <span v-if="pet.birthDate">
            {{ formatThaiShortDate(pet.birthDate) }} ({{ formatPetAge(pet.birthDate) }})
          </span>
          <span v-else class="text-muted">ยังไม่ระบุวันเกิด</span>
        </li>
        <li v-if="physicalDetails" class="flex items-center gap-2.5">
          <Icon :name="petSpeciesIcons[pet.species]" class="size-4 shrink-0 text-muted xl:size-4.5" />
          {{ physicalDetails }}
        </li>
      </ul>
    </div>
  </article>
</template>
