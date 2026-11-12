<script setup lang="ts">
definePageMeta({ middleware: 'auth' })

useSeoMeta({
  title: 'สัตว์เลี้ยงของฉัน · YoyoPet',
  description: 'เพิ่มข้อมูลน้อง รับคูปองวันเกิดและคำแนะนำสินค้าที่เหมาะกับน้อง'
})

const { pets, addPet } = usePets()
const { birthdayCoupon } = usePetBirthdayCoupon()

const route = useRoute()
const router = useRouter()
const isAddPetDialogOpen = ref(false)

// Other pages link here with ?add=1 to open the dialog directly; drop the flag so a refresh doesn't reopen it
onMounted(() => {
  if (route.query.add === undefined) return
  isAddPetDialogOpen.value = true
  router.replace({ query: { ...route.query, add: undefined } })
})
</script>

<template>
  <div class="page-container pt-5 pb-12 xl:pt-9 xl:pb-16">
    <PageBreadcrumb current-label="สัตว์เลี้ยงของฉัน" />

    <header class="mt-3 xl:mt-4">
      <h1 class="text-[1.75rem] leading-tight xl:text-[3.5rem]">
        สัตว์เลี้ยงของฉัน
      </h1>
      <p class="mt-1 text-base text-muted xl:text-[1.375rem]">
        เพิ่มข้อมูลน้อง รับคูปองวันเกิดและคำแนะนำสินค้าที่เหมาะกับน้อง
      </p>
    </header>

    <ul class="mt-6 grid gap-4 md:grid-cols-2 xl:mt-8 xl:grid-cols-3 xl:gap-6">
      <li v-for="pet in pets" :key="pet.id" class="flex">
        <PetProfileCard :pet="pet" :is-birthday-month="birthdayCoupon?.petId === pet.id" class="w-full" />
      </li>
      <li class="flex">
        <AddPetCard class="w-full" @click="isAddPetDialogOpen = true" />
      </li>
    </ul>

    <PetProductRecommendations />
    <PetDataBenefitsNote />

    <AddPetDialog v-model:open="isAddPetDialogOpen" :save-pet="addPet" />
  </div>
</template>
