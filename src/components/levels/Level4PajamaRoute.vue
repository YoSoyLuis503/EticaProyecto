<script setup>
import { computed, ref, shallowRef } from 'vue'
import DormiMascot from '../DormiMascot.vue'
import FeedbackOverlay from '../FeedbackOverlay.vue'
import { playSound } from '../../utils/sound'

const emit = defineEmits(['complete', 'next-level', 'go-map'])

const STEPS = [
  {
    order: 1,
    id: 'pajama',
    label: 'Baño y Pijama',
    emoji: '🛁',
    hint: 'Primero nos damos un baño tibio y nos ponemos la pijama limpia.',
  },
  {
    order: 2,
    id: 'story',
    label: 'Leer un Cuento',
    emoji: '📖',
    hint: 'Después del baño y la pijama, ¡leemos un cuento bonito para relajarnos!',
  },
  {
    order: 3,
    id: 'lights',
    label: 'Apagar la Luz',
    emoji: '🌙',
    hint: 'Al final, cuando ya estamos listos en la cama, apagamos la luz para dormir.',
  },
]

// Intentionally shuffled order for the puzzle
const SHUFFLED_CARDS = [STEPS[2], STEPS[0], STEPS[1]]

const slots = ref([null, null, null])
const selectedCardId = shallowRef(null)
const draggingCardId = shallowRef(null)
const feedback = ref({ show: false, type: 'win', message: '' })

const placedIds = computed(() => slots.value.map((s) => s?.id).filter(Boolean))
const remainingCards = computed(() =>
  SHUFFLED_CARDS.filter((card) => !placedIds.value.includes(card.id)),
)
const placedCount = computed(() => placedIds.value.length)

const ambientBgClass = computed(() => {
  if (placedCount.value === 3) return 'from-indigo-900 via-purple-900 to-violet-950 text-white'
  if (placedCount.value === 2) return 'from-violet-200 via-purple-100 to-amber-100 text-slate-900'
  if (placedCount.value === 1) return 'from-amber-100 via-orange-100 to-sky-100 text-slate-900'
  return 'from-sky-100 via-amber-50 to-violet-100 text-slate-900'
})

function selectCard(card) {
  playSound('pop')
  selectedCardId.value = selectedCardId.value === card.id ? null : card.id
}

function onDragStart(event, card) {
  draggingCardId.value = card.id
  selectedCardId.value = card.id
  if (event.dataTransfer) {
    event.dataTransfer.setData('text/plain', card.id)
    event.dataTransfer.effectAllowed = 'move'
  }
}

function tryPlaceInSlot(slotIndex, cardId) {
  const card = STEPS.find((s) => s.id === cardId)
  if (!card || slots.value[slotIndex]) return

  const expectedOrder = slotIndex + 1
  if (card.order !== expectedOrder) {
    feedback.value = {
      show: true,
      type: 'retry',
      message: `¡Pensemos juntos! ${card.hint}`,
    }
    return
  }

  const nextSlots = [...slots.value]
  nextSlots[slotIndex] = card
  slots.value = nextSlots
  selectedCardId.value = null
  draggingCardId.value = null
  playSound('correct')

  if (nextSlots.every(Boolean)) {
    emit('complete', { levelId: 4, stars: 3 })
    feedback.value = {
      show: true,
      type: 'win',
      message: '¡Orden perfecto! Baño y pijama, leer un cuento y apagar la luz es la mejor ruta para dormir feliz.',
    }
  }
}

function onDropSlot(event, slotIndex) {
  const id = event.dataTransfer?.getData('text/plain') || draggingCardId.value || selectedCardId.value
  tryPlaceInSlot(slotIndex, id)
}

function onTapSlot(slotIndex) {
  if (!selectedCardId.value) return
  tryPlaceInSlot(slotIndex, selectedCardId.value)
}
</script>

<template>
  <section
    :class="ambientBgClass"
    class="max-w-4xl mx-auto px-4 py-6 rounded-3xl transition-colors duration-700 space-y-6"
  >
    <div class="flex flex-wrap items-center justify-between gap-3">
      <div>
        <h1 class="text-2xl sm:text-4xl font-display font-bold">
          🛁 Nivel 4: La Ruta de la Pijama
        </h1>
        <p class="text-sm sm:text-base font-bold opacity-85">
          Ordena las 3 acciones en orden (1 · 2 · 3) antes de dormir
        </p>
      </div>

      <div class="px-5 py-2.5 rounded-full bg-violet-600 text-white font-display font-bold text-lg shadow-md border-2 border-white">
        Pasos listos: {{ placedCount }} / 3
      </div>
    </div>

    <DormiMascot
      :mood="placedCount >= 2 ? 'tired' : 'happy'"
      :dark="placedCount === 3"
      message="¡Ya casi es hora de dormir! Toca o arrastra qué hacemos Primero (1), Después (2) y Al final (3)."
      auto-speak
    />

    <!-- 3 Ordered Slots -->
    <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
      <button
        v-for="(slot, idx) in slots"
        :key="idx"
        type="button"
        @dragover.prevent
        @drop.prevent="onDropSlot($event, idx)"
        @click="onTapSlot(idx)"
        :class="
          slot
            ? 'bg-emerald-100 border-emerald-400 text-slate-900'
            : selectedCardId
              ? 'bg-white/95 border-violet-500 border-dashed ring-4 ring-violet-300 text-slate-800'
              : 'bg-white/90 border-violet-300 border-dashed text-slate-800'
        "
        class="rounded-3xl border-4 p-5 min-h-[168px] shadow-xl flex flex-col items-center justify-center gap-2 text-center transition-all"
      >
        <span class="px-4 py-1 rounded-full bg-violet-600 text-white font-display font-bold text-sm">
          {{ idx === 0 ? '1. Primero' : idx === 1 ? '2. Después' : '3. Al final' }}
        </span>

        <template v-if="slot">
          <span class="text-5xl mt-1" aria-hidden="true">{{ slot.emoji }}</span>
          <span class="font-display font-bold text-xl">{{ slot.label }}</span>
        </template>
        <template v-else>
          <span class="text-4xl text-violet-400 font-bold mt-2">?</span>
          <span class="text-sm font-bold text-slate-500">Coloca el paso {{ idx + 1 }}</span>
        </template>
      </button>
    </div>

    <!-- Cards Tray -->
    <div v-if="remainingCards.length > 0" class="card-kid p-5 bg-white/95 text-slate-900">
      <p class="font-display font-bold text-base sm:text-lg text-violet-800 text-center mb-4">
        {{ selectedCardId ? '👇 ¡Ahora toca la casilla correcta arriba!' : '👆 Elige o arrastra una acción:' }}
      </p>

      <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <button
          v-for="card in remainingCards"
          :key="card.id"
          type="button"
          draggable="true"
          @dragstart="onDragStart($event, card)"
          @click="selectCard(card)"
          :class="
            selectedCardId === card.id
              ? 'bg-amber-200 border-violet-600 ring-4 ring-violet-300 -translate-y-1'
              : 'bg-amber-50 hover:bg-amber-100 border-amber-300'
          "
          class="btn-tactile min-h-[135px] p-4 border-4 border-b-8 flex flex-col items-center justify-center gap-2 text-center cursor-grab active:cursor-grabbing"
        >
          <span class="text-5xl" aria-hidden="true">{{ card.emoji }}</span>
          <span class="font-display font-bold text-lg sm:text-xl text-slate-900">
            {{ card.label }}
          </span>
        </button>
      </div>
    </div>

    <FeedbackOverlay
      :show="feedback.show"
      :type="feedback.type"
      :message="feedback.message"
      @close="feedback.show = false"
      @next-level="emit('next-level')"
      @go-map="emit('go-map')"
    />
  </section>
</template>
