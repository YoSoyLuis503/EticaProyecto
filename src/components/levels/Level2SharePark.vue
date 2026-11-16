<script setup>
import { computed, ref, shallowRef } from 'vue'
import DormiMascot from '../DormiMascot.vue'
import FeedbackOverlay from '../FeedbackOverlay.vue'
import { playSound } from '../../utils/sound'

const emit = defineEmits(['complete', 'next-level', 'go-map'])

const FRIENDS = [
  { id: 'tito', name: 'Tito', emoji: '🦊', color: 'bg-orange-100 border-orange-400' },
  { id: 'luna', name: 'Luna', emoji: '🐰', color: 'bg-pink-100 border-pink-400' },
  { id: 'bruno', name: 'Bruno', emoji: '🐻', color: 'bg-amber-100 border-amber-400' },
  { id: 'pepo', name: 'Pepo', emoji: '🐸', color: 'bg-emerald-100 border-emerald-400' },
]

const SPOTS = ref([
  { id: 'swing1', label: 'Columpio Sol', icon: '☀️', occupant: null },
  { id: 'swing2', label: 'Columpio Nube', icon: '☁️', occupant: null },
  { id: 'seesaw', label: 'Sube y Baja', icon: '⚖️', occupant: null },
  { id: 'slide', label: 'Resbaladilla', icon: '🛝', occupant: null },
])

const selectedFriendId = shallowRef(null)
const draggingFriendId = shallowRef(null)
const feedback = ref({ show: false, type: 'win', message: '' })

const placedIds = computed(() =>
  SPOTS.value.map((s) => s.occupant?.id).filter(Boolean),
)

const waitingFriends = computed(() =>
  FRIENDS.filter((f) => !placedIds.value.includes(f.id)),
)

const placedCount = computed(() => placedIds.value.length)

function selectFriend(friend) {
  playSound('pop')
  selectedFriendId.value = selectedFriendId.value === friend.id ? null : friend.id
}

function onDragStart(event, friend) {
  draggingFriendId.value = friend.id
  selectedFriendId.value = friend.id
  if (event.dataTransfer) {
    event.dataTransfer.setData('text/plain', friend.id)
    event.dataTransfer.effectAllowed = 'move'
  }
}

function assignFriendToSpot(spot, friendId) {
  const friend = FRIENDS.find((f) => f.id === friendId)
  if (!friend) return

  if (spot.occupant) {
    feedback.value = {
      show: true,
      type: 'retry',
      message: `¡Ups! ${spot.occupant.name} ya está en "${spot.label}". Lleva a ${friend.name} a un espacio libre para compartir sin pelear.`,
    }
    return
  }

  spot.occupant = friend
  selectedFriendId.value = null
  draggingFriendId.value = null
  playSound('correct')

  if (placedCount.value === FRIENDS.length) {
    emit('complete', { levelId: 2, stars: 3 })
    feedback.value = {
      show: true,
      type: 'win',
      message: '¡Qué gran trabajo en equipo! Cuando compartimos el parque, todos juegan felices y en paz.',
    }
  }
}

function onDropSpot(event, spot) {
  const id = event.dataTransfer?.getData('text/plain') || draggingFriendId.value || selectedFriendId.value
  assignFriendToSpot(spot, id)
}

function onTapSpot(spot) {
  if (!selectedFriendId.value) {
    if (!spot.occupant) playSound('pop')
    return
  }
  assignFriendToSpot(spot, selectedFriendId.value)
}
</script>

<template>
  <section class="max-w-4xl mx-auto px-4 py-6 space-y-6">
    <div class="flex flex-wrap items-center justify-between gap-3">
      <div>
        <h1 class="text-2xl sm:text-4xl font-display font-bold text-emerald-800">
          🎠 Nivel 2: Comparte el Parque
        </h1>
        <p class="text-sm sm:text-base font-bold text-slate-700">
          Arrastra (o toca) a cada amigo hacia un juego libre
        </p>
      </div>

      <div class="px-5 py-2.5 rounded-full bg-emerald-500 text-white font-display font-bold text-lg shadow-md border-2 border-white">
        Amigos jugando: {{ placedCount }} / {{ FRIENDS.length }}
      </div>
    </div>

    <DormiMascot
      mood="happy"
      message="¡Todos quieren jugar en el parque! Arrastra o toca a cada amigo y llévalo a un juego libre para que nadie se pelee."
      auto-speak
    />

    <!-- Waiting Friends Tray -->
    <div class="card-kid p-4 sm:p-5 bg-amber-50/90">
      <p class="font-display font-bold text-base sm:text-lg text-violet-900 mb-3 text-center">
        {{
          waitingFriends.length > 0
            ? selectedFriendId
              ? '👇 ¡Ahora toca un juego libre abajo!'
              : '👆 Arrastra o toca a un amiguito:'
            : '🎉 ¡Todos están jugando juntos!'
        }}
      </p>

      <div class="flex flex-wrap items-center justify-center gap-4 min-h-[108px]">
        <button
          v-for="friend in waitingFriends"
          :key="friend.id"
          type="button"
          draggable="true"
          @dragstart="onDragStart($event, friend)"
          @click="selectFriend(friend)"
          :class="[
            friend.color,
            selectedFriendId === friend.id ? 'ring-4 ring-violet-600 scale-110 -translate-y-1' : 'hover:scale-105',
          ]"
          class="btn-tactile min-w-[120px] min-h-[96px] px-5 py-3 border-4 border-b-8 flex flex-col items-center justify-center gap-1 cursor-grab active:cursor-grabbing"
        >
          <span class="text-5xl" aria-hidden="true">{{ friend.emoji }}</span>
          <span class="font-display font-bold text-lg text-slate-900">{{ friend.name }}</span>
        </button>
      </div>
    </div>

    <!-- Playground Drop Zones -->
    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
      <button
        v-for="spot in SPOTS"
        :key="spot.id"
        type="button"
        @dragover.prevent
        @drop.prevent="onDropSpot($event, spot)"
        @click="onTapSpot(spot)"
        :class="
          spot.occupant
            ? 'bg-emerald-100 border-emerald-400'
            : selectedFriendId
              ? 'bg-sky-50 border-violet-500 border-dashed ring-4 ring-violet-200 animate-pulse'
              : 'bg-white/95 border-sky-300 border-dashed'
        "
        class="rounded-3xl border-4 p-5 min-h-[145px] shadow-xl flex items-center justify-between gap-4 transition-all text-left"
      >
        <div class="space-y-1">
          <div class="flex items-center gap-2">
            <span class="text-3xl" aria-hidden="true">{{ spot.icon }}</span>
            <h2 class="text-xl sm:text-2xl font-display font-bold text-slate-900">
              {{ spot.label }}
            </h2>
          </div>
          <p class="text-sm font-bold text-slate-600">
            {{ spot.occupant ? `¡${spot.occupant.name} está feliz aquí!` : 'Espacio libre para jugar' }}
          </p>
        </div>

        <div
          :class="spot.occupant ? 'bg-white border-emerald-400 scale-105' : 'bg-sky-100/80 border-sky-300'"
          class="shrink-0 w-24 h-24 rounded-3xl border-4 flex flex-col items-center justify-center shadow-inner"
        >
          <template v-if="spot.occupant">
            <span class="text-5xl animate-wiggle" aria-hidden="true">{{ spot.occupant.emoji }}</span>
            <span class="text-xs font-display font-bold text-emerald-900">{{ spot.occupant.name }}</span>
          </template>
          <span v-else class="text-3xl text-sky-600 font-display font-bold">＋</span>
        </div>
      </button>
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
