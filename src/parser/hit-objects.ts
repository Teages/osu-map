import { useStrAutomaton } from '../utils'
import { OsuMapMode } from './general'

export function parseHitObjects(lines: string[], mode: OsuMapMode): HitObject[] {
  const items: HitObject[] = []
  lines.forEach((line) => {
    const sa = useStrAutomaton(line)

    const x = Number(sa.readUntil(','))
    const y = Number(sa.readUntil(','))
    const time = Number(sa.readUntil(','))
    const type = parseType(Number(sa.readUntil(',')), mode)
    const hitsoundStr = sa.tryReadUntil(',')

    if (type === 'circle') {
      const hitSampleStr = sa.readAll() || '0:0:0:0:'
      items.push({
        x,
        y,
        time,
        type,
        combo: parseCombo(Number(hitsoundStr)),
        hitSound: parseHitSound(hitsoundStr, hitSampleStr),
      })
    }

    else if (type === 'slider') {
      const curveStr = sa.readUntil(',')
      const [curveType, ...rawCurvePoints] = curveStr.split('|').map(v => v.trim())
      const curvePoints = rawCurvePoints.map((point) => {
        const [x, y] = point.split(':').map(v => v.trim()).map(v => Number(v))
        return { x, y }
      })
      const slides = Number(sa.readUntil(','))
      const length = Number(sa.tryReadUntil(','))

      if (sa.preview() === '') {
        // no hitsound for this note, use default
        const repeatArray = Array.from({ length: slides + 1 }).fill(0)
        sa.add(`${repeatArray.join('|')},${repeatArray.map(() => '0:0').join('|')}`)
      }

      const edgeHitSoundEnable = sa.readUntil(',').split('|')
        .map(v => v.trim())
        .map(v => Number(v))
        .map(parseHitSoundEnable)
      const edgeHitSound = sa.tryReadUntil(',').split('|').map((hitSound, index) => {
        const [normalSet, additionSet] = hitSound.split(':').map(v => v.trim())
        const sample = edgeHitSoundEnable[index]
        return {
          normalSet: parseHitSoundSet(Number(normalSet)),
          additionSet: parseHitSoundSet(Number(additionSet)),
          sample,
        }
      })
      const hitSampleStr = sa.readAll() || '0:0:0:0:'

      items.push({
        x,
        y,
        time,
        type,
        combo: parseCombo(Number(hitsoundStr)),
        hitSound: parseHitSound(hitsoundStr, hitSampleStr),

        // slider
        curveType: curveType as HitObjectSlider['curveType'],
        curvePoints,
        slides,
        length,
        edgeHitSound,
      })
    }

    else if (type === 'spinner') {
      const endTime = Number(sa.tryReadUntil(','))
      const hitSampleStr = sa.readAll() || '0:0:0:0:'
      items.push({
        x,
        y,
        time,
        type,
        combo: parseCombo(Number(hitsoundStr)),
        hitSound: parseHitSound(hitsoundStr, hitSampleStr),

        // spinner
        endTime,
      })
    }

    else { // type === 'hold'
      const endTime = Number(sa.tryReadUntil(':')) // idk why it's `:` instead of `,`

      const hitSampleStr = sa.readAll() || '0:0:0:0:'
      items.push({
        x,
        y,
        time,
        type,
        combo: parseCombo(Number(hitsoundStr)),
        hitSound: parseHitSound(hitsoundStr, hitSampleStr),

        // hold
        endTime,
      })
    }
  })

  return items
}

function parseHitSound(hitsoundStr: string, hitSampleStr: string) {
  const { normalSample, additionSimple, index, volume, filename } = parseHitSample(hitSampleStr)
  return {
    normalSet: parseHitSoundSet(normalSample),
    additionSet: parseHitSoundSet(additionSimple),
    sample: parseHitSoundEnable(Number(hitsoundStr)),
    index,
    volume,
    filename,
  }
}

function parseHitSample(hitSampleStr: string) {
  const [normalSetStr, additionSetStr, indexStr, volumeStr, filename] = hitSampleStr.split(':')
  const [normalSample, additionSimple, index, volume]
    = [normalSetStr, additionSetStr, indexStr, volumeStr].map(Number)

  return { normalSample, additionSimple, index, volume, filename: filename || undefined }
}

function parseHitSoundSet(bit: number): HitSoundSampleSet {
  switch (bit) {
    case 0:
      return 'auto'
    case 1:
      return 'normal'
    case 2:
      return 'soft'
    case 3:
      return 'drum'
    default:
      throw new Error(`Unknown sample set: ${bit}`)
  }
}

function parseHitSoundEnable(bit: number): HitObjectHitSound['sample'] {
  return {
    normal: (bit & 1) === 1,
    whistle: (bit & 2) === 2,
    finish: (bit & 4) === 4,
    clap: (bit & 8) === 8,
  }
}

function parseType(typeBit: number, mode: OsuMapMode): HitObjectType {
  if (typeBit & 0b1) {
    return 'circle'
  }
  if (typeBit & 0b10) {
    return 'slider'
  }
  if (typeBit & 0b1000) {
    return 'spinner'
  }
  if (typeBit & 0b10000000 && mode === OsuMapMode.Mania) {
    return 'hold'
  }
  throw new Error(`Unknown hit object type: ${typeBit}(mode:${mode})`)
}

function parseCombo(typeBit: number): HitObjectNewCombo {
  return {
    newCombo: (typeBit & 0b100) === 4,
    skip: (typeBit & 0b1110000) >> 4,
  }
}

export type HitObject = HitObjectCircle | HitObjectSlider | HitObjectSpinner | HitObjectHold

export type HitObjectCircle = HitObjectBasic & {
  type: 'circle'
}

export type HitObjectSlider = HitObjectBasic & {
  type: 'slider'

  /**
   * Type of curve used to construct this slider.
   *
   * `B` = bézier, `C` = centripetal catmull-rom, `L` = linear, `P` = perfect circle
   */
  curveType: 'B' | 'C' | 'L' | 'P'

  /**
   * Anchor points used to construct the slider.
   */
  curvePoints: Array<{
    x: number
    y: number
  }>

  /**
   * Amount of times the player has to follow the slider's curve back-and-forth before the slider is complete. It can also be interpreted as the repeat count plus one.
   */
  slides: number

  /**
   * Visual length in [osu! pixels](https://osu.ppy.sh/wiki/en/Client/Beatmap_editor/osu%21_pixel) of the slider.
   */
  length: number

  /**
   * Hitsounds that play when hitting edges of the slider's curve. The first sound is the one that plays when the slider is first clicked, and the last sound is the one that plays when the slider's end is hit.
   */
  edgeHitSound: Array<HitObjectHitSound>
}

export type HitObjectSpinner = HitObjectBasic & {
  type: 'spinner'
  endTime: number
}

export type HitObjectHold = HitObjectBasic & {
  type: 'hold'
  endTime: number
}

export interface HitObjectBasic {
  /**
   * x position
   */
  x: number

  /**
   * y position
   */
  y: number

  /**
   * Time when the object is to be hit, in milliseconds from the beginning of the beatmap's audio.
   */
  time: number

  /**
   * The combo state of the object.
   */
  combo: HitObjectNewCombo

  /**
   * The hit sound when the object is hit.
   */
  hitSound: HitObjectHitSound & {
    /**
     * Index of the sample. If this is `0`, the timing point's sample index will be used instead.
     */
    index: number

    /**
     * Volume of the sample from 1 to 100. If this is `0`, the timing point's volume will be used instead.
     */
    volume: number

    /**
     * Custom filename of the addition sound.
     */
    filename?: string
  }
}

export interface HitObjectHitSound {
  /**
   * Sample set of the normal sound.
   */
  normalSet: HitSoundSampleSet

  /**
   * Sample set of the whistle, finish, and clap sounds.
   */
  additionSet: HitSoundSampleSet

  /**
   * The sounds will play when the object is hit.
   */
  sample: {
    /**
     * It is enabled even it is `false` except in osu!mania.
     */
    normal: boolean
    whistle: boolean
    finish: boolean
    clap: boolean
  }
}

export type HitObjectNewCombo = {
  /**
   * The object is a new combo.
   */
  newCombo: true

  /**
   * Specifying how many combo colours to skip, a practice referred to as "colour hax". Only relevant if the object starts a new combo.
   */
  skip: number
} | {
  newCombo: false
}

export type HitSoundSampleSet = 'auto' | 'normal' | 'soft' | 'drum'

export type HitObjectType = 'circle' | 'slider' | 'spinner' | 'hold'
