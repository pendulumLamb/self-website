<script setup lang="ts">
const visible = ref(true)
const hovering = ref(false)
const exiting = ref(false)

function enter() {
  if (exiting.value) return
  exiting.value = true
  hovering.value = false
  // Let the letters fly outward and the page slide up before unmounting.
  setTimeout(() => {
    visible.value = false
  }, 750)
}

// Lock body scroll while loading screen is up.
onMounted(() => {
  document.documentElement.style.overflow = 'hidden'
})
onBeforeUnmount(() => {
  document.documentElement.style.overflow = ''
})

watch(visible, (v) => {
  if (!v) document.documentElement.style.overflow = ''
})
</script>

<template>
  <Transition name="loading-slide">
    <div v-if="visible" class="loading-screen" :class="{ 'is-exiting': exiting }">
      <div
        class="ring-wrap"
        @mouseenter="hovering = true && !exiting"
        @mouseleave="hovering = false"
      >
        <CircularText
          :segments="[
            { text: 'WYLONG', color: '#000', center: 0, arc: 130, flip: false },
            { text: 'DESIGN', color: '#10b981', center: 180, arc: 130, flip: true }
          ]"
          :spin-duration="hovering ? 4 : 14"
          :font-size="36"
          :radius="150"
          :exiting="exiting"
        />

        <Transition name="enter-fade">
          <button
            v-if="hovering && !exiting"
            type="button"
            class="enter-btn"
            @click="enter"
          >
            进入
          </button>
        </Transition>
      </div>
    </div>
  </Transition>
</template>

<style scoped>
.loading-screen {
  position: fixed;
  inset: 0;
  z-index: 9999;
  background: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: 'Montserrat', sans-serif;
  will-change: transform, opacity;
}

.ring-wrap {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
}

.enter-btn {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  background: #000;
  color: #fff;
  border: none;
  border-radius: 999px;
  padding: 14px 32px;
  font-family: inherit;
  font-size: 16px;
  font-weight: 600;
  letter-spacing: 0.18em;
  cursor: url("/cursor-pointer.svg") 16 16, pointer;
  transition: background 0.2s ease, transform 0.2s ease;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.18);
}

.enter-btn:hover {
  background: #10b981;
  transform: translate(-50%, -50%) scale(1.06);
}

.enter-btn:active {
  transform: translate(-50%, -50%) scale(0.98);
}

/* Slide the entire loading screen upward as it leaves. */
.loading-slide-leave-active {
  transition: transform 0.75s cubic-bezier(0.7, 0, 0.3, 1), opacity 0.6s ease 0.1s;
}
.loading-slide-leave-to {
  transform: translateY(-100%);
  opacity: 0;
}

.enter-fade-enter-active,
.enter-fade-leave-active {
  transition: opacity 0.25s ease, transform 0.25s ease;
}
.enter-fade-enter-from,
.enter-fade-leave-to {
  opacity: 0;
  transform: translate(-50%, -50%) scale(0.85);
}
</style>
