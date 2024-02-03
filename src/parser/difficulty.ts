import { useKVPairParser } from '../utils'

export function parseDifficulty(input: string[]): Difficulty {
  const typeMap = {
    HPDrainRate: 'number',
    CircleSize: 'number',
    OverallDifficulty: 'number',
    ApproachRate: 'number',
    SliderMultiplier: 'number',
    SliderTickRate: 'number',
  } as const

  const defaultValues = {
    HPDrainRate: 0,
    CircleSize: 0,
    OverallDifficulty: 0,
    ApproachRate: 0,
    SliderMultiplier: 1,
    SliderTickRate: 1,
  }

  const difficultyParser = useKVPairParser<Difficulty>(typeMap, defaultValues)

  return difficultyParser(input)
}

export interface Difficulty {
  /**
   * HP setting (0–10)
   */
  HPDrainRate: number

  /**
   * CS setting (0–10)
   */
  CircleSize: number

  /**
   * OD setting (0–10)
   */
  OverallDifficulty: number

  /**
   * AR setting (0–10)
   */
  ApproachRate: number

  /**
   * Base slider velocity in hundreds of [osu! pixels](https://osu.ppy.sh/wiki/Client/Beatmap_editor/osu!_pixel) per beat
   */
  SliderMultiplier: number

  /**
   * Amount of slider ticks per beat
   */
  SliderTickRate: number
}
