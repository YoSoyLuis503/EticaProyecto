<script setup>
import { shallowRef } from 'vue'
import LumiSpirit from './LumiSpirit.vue'
import StickerArt from './StickerArt.vue'
import { CABIN_STICKERS } from '../data/valleyData'
import { playSound } from '../utils/sound'

const { show, unlockedStickers, placedStickers } = defineProps({
  show: { type: Boolean, default: false },
  unlockedStickers: { type: Array, required: true },
  placedStickers: { type: Array, required: true },
})

const emit = defineEmits(['close', 'toggle-sticker'])

const bouncingStickerId = shallowRef(0)

function handleToggleSticker(stickerId) {
  if (!unlockedStickers.includes(stickerId)) {
    playSound('retry')
    return
  }
  playSound('catch')
  bouncingStickerId.value = stickerId
  setTimeout(() => {
    bouncingStickerId.value = 0
  }, 450)
  emit('toggle-sticker', stickerId)
}
</script>

<template>
  <Teleport to="body">
    <div
      v-if="show"
      role="dialog"
      aria-modal="true"
      aria-label="Cabaña de Lumi"
      class="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-900/65 backdrop-blur-sm"
    >
      <div
        class="w-full max-w-4xl max-h-[90vh] overflow-y-auto ac-parchment p-5 sm:p-7 space-y-5 animate-pop"
      >
        <div class="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 class="text-2xl sm:text-3xl font-display font-bold text-valley-moss">
              🏡 La Cabaña de Lumi
            </h2>
            <p class="text-sm sm:text-base font-bold text-slate-600">
              Toca tus pegatinas desbloqueadas abajo para decorar la cabaña del bosque
            </p>
          </div>

          <button
            type="button"
            @click="playSound('pop'); emit('close')"
            class="ac-btn px-6 py-3 min-h-[48px] bg-amber-400 hover:bg-amber-300 text-amber-950 border-b-4 border-amber-600 text-base"
          >
            Cerrar ✕
          </button>
        </div>

        <!-- Cozy Illustrated Wooden Cabin Interior -->
        <div
          class="relative w-full h-72 sm:h-80 rounded-[28px] border-4 border-[#B08968] bg-gradient-to-b from-[#F5E6CC] via-[#EDD5B3] to-[#C89F72] shadow-inner overflow-hidden"
        >
          <!-- Window showing starry/sunny valley -->
          <div
            class="absolute top-6 left-1/2 -translate-x-1/2 w-36 h-28 rounded-2xl bg-gradient-to-b from-indigo-900 to-sky-700 border-4 border-[#8C5E3C] shadow-inner flex items-center justify-center"
          >
            <div class="w-full h-1 bg-[#8C5E3C]" />
            <div class="absolute h-full w-1 bg-[#8C5E3C]" />
            <span class="absolute top-3 left-5 text-amber-200 text-lg" aria-hidden="true">🌙</span>
            <span class="absolute bottom-4 right-5 text-sky-200 text-sm" aria-hidden="true">✨</span>
          </div>

          <!-- Wooden floor rug -->
          <div class="absolute bottom-4 left-1/2 -translate-x-1/2 w-60 h-16 rounded-full bg-emerald-600/80 border-4 border-emerald-200/80" />

          <!-- Lumi relaxing in the cabin -->
          <div class="absolute bottom-5 left-1/2 -translate-x-1/2">
            <LumiSpirit
              :state="unlockedStickers.length > 0 ? 'healthy' : 'sleepy'"
              size="sm"
            />
          </div>

          <!-- Placed Stickers inside the cabin -->
          <template v-for="sticker in CABIN_STICKERS" :key="sticker.id">
            <button
              v-if="placedStickers.includes(sticker.id)"
              type="button"
              @click="handleToggleSticker(sticker.id)"
              :title="`Quitar ${sticker.name}`"
              :class="[sticker.slotClass, bouncingStickerId === sticker.id ? 'scale-125' : 'hover:scale-110']"
              class="absolute transition-transform duration-200 cursor-pointer"
            >
              <StickerArt :sticker-id="sticker.id" size-class="w-14 h-14 sm:w-16 sm:h-16" />
            </button>
          </template>
        </div>

        <!-- Sticker Inventory Tray -->
        <div class="grid grid-cols-2 sm:grid-cols-5 gap-3">
          <button
            v-for="sticker in CABIN_STICKERS"
            :key="sticker.id"
            type="button"
            @click="handleToggleSticker(sticker.id)"
            :class="[
              !unlockedStickers.includes(sticker.id)
                ? 'bg-slate-100 border-slate-200 opacity-60 cursor-not-allowed'
                : placedStickers.includes(sticker.id)
                  ? 'bg-emerald-100 border-emerald-400 ring-2 ring-emerald-300'
                  : 'bg-white hover:bg-amber-50 border-amber-200',
            ]"
            class="rounded-3xl border-4 p-3 flex flex-col items-center text-center gap-1.5 transition-all"
          >
            <StickerArt
              :sticker-id="sticker.id"
              size-class="w-12 h-12"
              :class="{ grayscale: !unlockedStickers.includes(sticker.id) }"
            />
            <span class="font-display font-bold text-xs sm:text-sm text-slate-900 leading-tight">
              {{ unlockedStickers.includes(sticker.id) ? sticker.name : '🔒 Bloqueada' }}
            </span>
            <span class="text-[11px] font-bold text-emerald-800">
              {{
                !unlockedStickers.includes(sticker.id)
                  ? 'Completa el nivel'
                  : placedStickers.includes(sticker.id)
                    ? '✓ En cabaña'
                    : '+ Colocar'
              }}
            </span>
          </button>
        </div>
      </div>
    </div>
  </Teleport>
</template>
