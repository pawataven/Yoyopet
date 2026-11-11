<script setup lang="ts">
const AUTOPLAY_INTERVAL_MS = 5000

const NuxtLink = resolveComponent('NuxtLink')
const { banners } = useHomeBanners()

const track = useTemplateRef<HTMLElement>('track')
const activeIndex = ref(0)
const isAutoplayPaused = ref(false)

const SLIDE_DURATION_MS = 600

const isSliding = ref(false)
let slideAnimationFrame = 0
let autoplayTimer: ReturnType<typeof setTimeout> | undefined

const easeOutCubic = (progress: number) => 1 - (1 - progress) ** 3

// Animated by hand because Chromium on Windows turns `behavior: 'smooth'` into an instant jump
// when the OS "Animation effects" setting is off, and the slide must always animate.
// Scroll snapping is disabled while sliding, otherwise each frame's scrollLeft snaps back.
function animateTrackTo(targetScrollLeft: number) {
  const trackElement = track.value
  if (!trackElement) return

  cancelAnimationFrame(slideAnimationFrame)
  const startScrollLeft = trackElement.scrollLeft
  const distance = targetScrollLeft - startScrollLeft
  const startTime = performance.now()
  isSliding.value = true

  const step = (now: number) => {
    const progress = Math.min((now - startTime) / SLIDE_DURATION_MS, 1)
    trackElement.scrollLeft = startScrollLeft + distance * easeOutCubic(progress)
    if (progress < 1) {
      slideAnimationFrame = requestAnimationFrame(step)
    } else {
      isSliding.value = false
    }
  }
  slideAnimationFrame = requestAnimationFrame(step)
}

function scrollToBanner(index: number) {
  if (!track.value) return
  animateTrackTo(index * track.value.clientWidth)
  restartAutoplay()
}

function syncActiveIndex() {
  if (!track.value?.clientWidth) return
  activeIndex.value = Math.round(track.value.scrollLeft / track.value.clientWidth)
}

function restartAutoplay() {
  clearTimeout(autoplayTimer)
  autoplayTimer = setTimeout(() => {
    if (isAutoplayPaused.value || document.hidden || banners.value.length < 2) {
      restartAutoplay()
      return
    }
    scrollToBanner((activeIndex.value + 1) % banners.value.length)
  }, AUTOPLAY_INTERVAL_MS)
}

onMounted(restartAutoplay)

onBeforeUnmount(() => {
  clearTimeout(autoplayTimer)
  cancelAnimationFrame(slideAnimationFrame)
})
</script>

<template>
  <section
    v-if="banners.length"
    aria-roledescription="carousel"
    aria-label="โปรโมชัน"
    class="page-container mt-8 xl:mt-12"
    @mouseenter="isAutoplayPaused = true"
    @mouseleave="isAutoplayPaused = false"
  >
    <div
      ref="track"
      class="flex overflow-x-auto overscroll-x-contain rounded-[1.75rem] scrollbar-none"
      :class="isSliding ? 'snap-none' : 'snap-x snap-mandatory'"
      @scroll.passive="syncActiveIndex"
    >
      <div
        v-for="(banner, index) in banners"
        :key="banner.id"
        role="group"
        aria-roledescription="slide"
        :aria-label="`${index + 1} จาก ${banners.length}`"
        class="w-full shrink-0 snap-start"
      >
        <component :is="banner.linkUrl ? NuxtLink : 'div'" :to="banner.linkUrl ?? undefined" class="block">
          <NuxtImg
            :src="banner.imageUrl"
            :alt="banner.alt"
            width="1680"
            height="945"
            sizes="xs:100vw xl:1680px"
            :loading="index === 0 ? 'eager' : 'lazy'"
            :preload="index === 0"
            class="aspect-2/1 w-full object-cover object-top xl:aspect-3/1"
          />
        </component>
      </div>
    </div>

    <div v-if="banners.length > 1" class="mt-4 flex justify-center gap-2 xl:mt-6">
      <button
        v-for="(banner, index) in banners"
        :key="banner.id"
        type="button"
        :aria-label="`แสดงแบนเนอร์ที่ ${index + 1}`"
        :aria-current="index === activeIndex"
        class="relative h-2 rounded-full transition-all before:absolute before:-inset-2"
        :class="index === activeIndex ? 'w-8 bg-primary' : 'w-2 bg-muted/25 hover:bg-muted/50'"
        @click="scrollToBanner(index)"
      />
    </div>
  </section>
</template>
