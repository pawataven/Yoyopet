<template>
  <span class="success-checkmark relative mx-auto flex size-18 items-center justify-center rounded-full bg-success text-white sm:size-24" aria-hidden="true">
    <span class="success-checkmark-ring absolute inset-0 rounded-full bg-success" />
    <svg viewBox="0 0 24 24" fill="none" class="relative size-9 sm:size-12">
      <path
        class="success-checkmark-tick"
        d="M20 6 9 17l-5-5"
        pathLength="1"
        stroke="currentColor"
        stroke-width="2.5"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </svg>
  </span>
</template>

<style scoped>
.success-checkmark {
  animation: success-checkmark-pop 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) both;
}

.success-checkmark-ring {
  animation: success-checkmark-ring 0.9s ease-out 0.25s both;
}

.success-checkmark-tick {
  stroke-dasharray: 1;
  stroke-dashoffset: 1;
  animation: success-checkmark-draw 0.4s ease-out 0.35s forwards;
}

@keyframes success-checkmark-pop {
  from {
    transform: scale(0);
    opacity: 0;
  }
  to {
    transform: scale(1);
    opacity: 1;
  }
}

@keyframes success-checkmark-ring {
  from {
    transform: scale(1);
    opacity: 0.35;
  }
  to {
    transform: scale(1.6);
    opacity: 0;
  }
}

@keyframes success-checkmark-draw {
  to {
    stroke-dashoffset: 0;
  }
}

@media (prefers-reduced-motion: reduce) {
  .success-checkmark,
  .success-checkmark-ring {
    animation: none;
  }

  .success-checkmark-ring {
    opacity: 0;
  }

  .success-checkmark-tick {
    animation: none;
    stroke-dashoffset: 0;
  }
}
</style>
