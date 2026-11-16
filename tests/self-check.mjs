import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import { CABIN_STICKERS, SLEEP_POSES, VALLEY_LEVELS } from '../src/data/valleyData.js'

assert.equal(VALLEY_LEVELS.length, 5, 'Debe haber exactamente 5 niveles en Valle Dormilón')
assert.equal(SLEEP_POSES.length, 5, 'Debe haber 5 poses de sueño en el Álbum')
assert.equal(CABIN_STICKERS.length, 5, 'Debe haber 5 pegatinas para la Cabaña')

VALLEY_LEVELS.forEach((level, idx) => {
  assert.equal(level.id, idx + 1, `Nivel ${idx + 1} debe tener id secuencial`)
  assert.equal(level.screen, `level${idx + 1}`, `Pantalla esperada: level${idx + 1}`)
  assert.ok(level.title.length > 0, `Nivel ${level.id} requiere título`)
  assert.equal(level.poseId, level.id)
  assert.equal(level.stickerId, level.id)
})

const requiredFiles = [
  'src/App.vue',
  'src/utils/sound.js',
  'src/data/valleyData.js',
  'src/components/LumiSpirit.vue',
  'src/components/StickerArt.vue',
  'src/components/DonPlumasGuide.vue',
  'src/components/TopNavHud.vue',
  'src/components/SleepAlbumModal.vue',
  'src/components/CabinDecoratorModal.vue',
  'src/components/RewardCelebrationModal.vue',
  'src/components/WelcomeValley.vue',
  'src/components/ValleyMap.vue',
  'src/components/levels/Level1SafeRefuge.vue',
  'src/components/levels/Level2EnergyKitchen.vue',
  'src/components/levels/Level3RecessPuzzle.vue',
  'src/components/levels/Level4StarRitual.vue',
  'src/components/levels/Level5LumiDream.vue',
]

for (const file of requiredFiles) {
  assert.ok(fs.existsSync(path.resolve(file)), `Falta el archivo requerido: ${file}`)
}

const viteCfg = fs.readFileSync(path.resolve('vite.config.js'), 'utf8')
assert.ok(viteCfg.includes("'/EticaProyecto/'"), 'vite.config.js debe configurar base /EticaProyecto/')

console.log('✓ Self-check passed: Guardianes del Valle Dormilón (5 niveles, 5 poses, 5 pegatinas).')
