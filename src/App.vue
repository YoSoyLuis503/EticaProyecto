<script setup>
import { computed, ref, shallowRef, watch } from 'vue'
import TopNavHud from './components/TopNavHud.vue'
import WelcomeValley from './components/WelcomeValley.vue'
import ValleyMap from './components/ValleyMap.vue'
import SleepAlbumModal from './components/SleepAlbumModal.vue'
import CabinDecoratorModal from './components/CabinDecoratorModal.vue'
import Level1SafeRefuge from './components/levels/Level1SafeRefuge.vue'
import Level2EnergyKitchen from './components/levels/Level2EnergyKitchen.vue'
import Level3RecessPuzzle from './components/levels/Level3RecessPuzzle.vue'
import Level4StarRitual from './components/levels/Level4StarRitual.vue'
import Level5LumiDream from './components/levels/Level5LumiDream.vue'
import { CABIN_STICKERS, SLEEP_POSES, VALLEY_LEVELS } from './data/valleyData'
import { isMuted, playSound, stopSpeaking, toggleMute } from './utils/sound'

const STORAGE_KEY = 'guardianes_valle_v1'

function loadProgress() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) {
      return {
        completedLevels: [],
        unlockedPoses: [],
        unlockedStickers: [],
        placedStickers: [],
        demoUnlocked: false,
      }
    }
    const parsed = JSON.parse(raw)
    return {
      completedLevels: Array.isArray(parsed.completedLevels) ? parsed.completedLevels : [],
      unlockedPoses: Array.isArray(parsed.unlockedPoses) ? parsed.unlockedPoses : [],
      unlockedStickers: Array.isArray(parsed.unlockedStickers) ? parsed.unlockedStickers : [],
      placedStickers: Array.isArray(parsed.placedStickers) ? parsed.placedStickers : [],
      demoUnlocked: Boolean(parsed.demoUnlocked),
    }
  } catch {
    return {
      completedLevels: [],
      unlockedPoses: [],
      unlockedStickers: [],
      placedStickers: [],
      demoUnlocked: false,
    }
  }
}

const initial = loadProgress()
const currentScreen = shallowRef('welcome')
const showAlbum = shallowRef(false)
const showCabin = shallowRef(false)
const completedLevels = ref(initial.completedLevels)
const unlockedPoses = ref(initial.unlockedPoses)
const unlockedStickers = ref(initial.unlockedStickers)
const placedStickers = ref(initial.placedStickers)
const demoUnlocked = shallowRef(initial.demoUnlocked)

const LEVEL_COMPONENTS = {
  level1: Level1SafeRefuge,
  level2: Level2EnergyKitchen,
  level3: Level3RecessPuzzle,
  level4: Level4StarRitual,
  level5: Level5LumiDream,
}

const activeLevelComponent = computed(() => LEVEL_COMPONENTS[currentScreen.value] || null)

const effectivePoses = computed(() =>
  demoUnlocked.value ? SLEEP_POSES.map((p) => p.id) : unlockedPoses.value,
)

const effectiveStickers = computed(() =>
  demoUnlocked.value ? CABIN_STICKERS.map((s) => s.id) : unlockedStickers.value,
)

const backgroundClass = computed(() => {
  if (currentScreen.value === 'level4' || currentScreen.value === 'level5') {
    return 'bg-gradient-to-b from-indigo-950 via-purple-950 to-slate-950'
  }
  return 'bg-gradient-to-b from-[#EAF6EF] via-valley-cream to-[#F2E8CF]'
})

watch(
  [completedLevels, unlockedPoses, unlockedStickers, placedStickers, demoUnlocked],
  () => {
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          completedLevels: completedLevels.value,
          unlockedPoses: unlockedPoses.value,
          unlockedStickers: unlockedStickers.value,
          placedStickers: placedStickers.value,
          demoUnlocked: demoUnlocked.value,
        }),
      )
    } catch {
      // Storage unavailable; continue in memory
    }
  },
  { deep: true },
)

function navigate(screen) {
  stopSpeaking()
  currentScreen.value = screen
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

function handleLevelComplete({ levelId, poseId, stickerId }) {
  if (!completedLevels.value.includes(levelId)) {
    completedLevels.value = [...completedLevels.value, levelId]
  }
  if (!unlockedPoses.value.includes(poseId)) {
    unlockedPoses.value = [...unlockedPoses.value, poseId]
  }
  if (!unlockedStickers.value.includes(stickerId)) {
    unlockedStickers.value = [...unlockedStickers.value, stickerId]
  }
  if (!placedStickers.value.includes(stickerId)) {
    placedStickers.value = [...placedStickers.value, stickerId]
  }
}

function toggleCabinSticker(stickerId) {
  if (placedStickers.value.includes(stickerId)) {
    placedStickers.value = placedStickers.value.filter((id) => id !== stickerId)
  } else {
    placedStickers.value = [...placedStickers.value, stickerId]
  }
}

function goToNextLevel() {
  const num = Number(currentScreen.value.replace('level', ''))
  if (num >= 1 && num < VALLEY_LEVELS.length) {
    navigate(`level${num + 1}`)
    return
  }
  navigate('map')
}

function toggleDemoMode() {
  playSound('pop')
  demoUnlocked.value = !demoUnlocked.value
  if (demoUnlocked.value && placedStickers.value.length === 0) {
    placedStickers.value = CABIN_STICKERS.map((s) => s.id)
  }
}

function resetProgress() {
  playSound('pop')
  completedLevels.value = []
  unlockedPoses.value = []
  unlockedStickers.value = []
  placedStickers.value = []
  demoUnlocked.value = false
  navigate('map')
}
</script>

<template>
  <div :class="backgroundClass" class="min-h-screen flex flex-col transition-colors duration-700">
    <TopNavHud
      :current-screen="currentScreen"
      :completed-levels="completedLevels"
      :unlocked-poses="effectivePoses"
      :unlocked-stickers="effectiveStickers"
      :is-muted="isMuted"
      :demo-unlocked="demoUnlocked"
      @navigate="navigate"
      @open-album="playSound('pop'); showAlbum = true"
      @open-cabin="playSound('pop'); showCabin = true"
      @toggle-mute="toggleMute"
      @toggle-demo="toggleDemoMode"
      @reset-progress="resetProgress"
    />

    <main class="flex-1 w-full pb-12">
      <WelcomeValley
        v-if="currentScreen === 'welcome'"
        @start="navigate('map')"
        @open-album="showAlbum = true"
        @open-cabin="showCabin = true"
      />

      <ValleyMap
        v-else-if="currentScreen === 'map'"
        :completed-levels="completedLevels"
        :unlocked-poses="effectivePoses"
        :demo-unlocked="demoUnlocked"
        @select-level="navigate"
      />

      <component
        :is="activeLevelComponent"
        v-else-if="activeLevelComponent"
        :key="currentScreen"
        @complete="handleLevelComplete"
        @next-level="goToNextLevel"
        @go-map="navigate('map')"
        @open-album="showAlbum = true"
      />
    </main>

    <SleepAlbumModal
      :show="showAlbum"
      :unlocked-poses="effectivePoses"
      @close="showAlbum = false"
    />

    <CabinDecoratorModal
      :show="showCabin"
      :unlocked-stickers="effectiveStickers"
      :placed-stickers="placedStickers"
      @close="showCabin = false"
      @toggle-sticker="toggleCabinSticker"
    />
  </div>
</template>
