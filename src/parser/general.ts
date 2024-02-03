import { useKVPairParser } from '../utils'

export function parseGeneral(input: string[]): General {
  const typeMap: Record<keyof General, 'string' | 'number'> = {
    AudioFilename: 'string',
    AudioLeadIn: 'number',
    AudioHash: 'string',
    PreviewTime: 'number',
    Countdown: 'number',
    SampleSet: 'string',
    StackLeniency: 'number',
    Mode: 'number',
    LetterboxInBreaks: 'number',
    StoryFireInFront: 'number',
    UseSkinSprites: 'number',
    AlwaysShowPlayfield: 'number',
    OverlayPosition: 'string',
    SkinPreference: 'string',
    EpilepsyWarning: 'number',
    CountdownOffset: 'number',
    SpecialStyle: 'number',
    WidescreenStoryboard: 'number',
    SamplesMatchPlaybackRate: 'number',
  } as const

  const defaultValues = {
    AudioFilename: '',
    AudioLeadIn: 0,
    PreviewTime: -1,
    Countdown: 1,
    SampleSet: 'Normal',
    StackLeniency: 0.7,
    Mode: 0,
    LetterboxInBreaks: 0,
    StoryFireInFront: 1,
    UseSkinSprites: 0,
    AlwaysShowPlayfield: 0,
    OverlayPosition: 'NoChange',
    EpilepsyWarning: 0,
    CountdownOffset: 0,
    SpecialStyle: 0,
    WidescreenStoryboard: 0,
    SamplesMatchPlaybackRate: 0,
  }

  const generalParser = useKVPairParser<General>(typeMap, defaultValues)

  return generalParser(input)
}

export interface General {
  /**
   * Location of the audio file relative to the current folder
   */
  AudioFilename: string

  /**
   * Milliseconds of silence before the audio starts playing
   *
   * @default 0
   */
  AudioLeadIn: number

  /**
   * @deprecated
   */
  AudioHash?: string

  /**
   * Time in milliseconds when the audio preview should start
   *
   * @default -1
   */
  PreviewTime: number

  /**
   * Speed of the countdown before the first hit object
   *
   * `0` = no countdown, `1` = normal, `2` = half, `3` = double
   *
   * @default 1
   */
  Countdown: 0 | 1 | 2 | 3

  /**
   * Sample set that will be used if timing points do not override it
   *
   * `Normal`, `Soft`, `Drum`
   *
   * @default Normal
   */
  SampleSet: 'Normal' | 'Soft' | 'Drum'

  /**
   * Multiplier for the threshold in time where hit objects placed close together stack (0–1)
   *
   * @default 0.7
   */
  StackLeniency: number

  /**
   * Game mode
   *
   * `0` = osu!, `1` = osu!taiko, `2` = osu!catch, `3` = osu!mania
   *
   * @default 0
   */
  Mode: OsuMapMode

  /**
   * Whether or not breaks have a letterboxing effect
   *
   * @default 0
   */
  LetterboxInBreaks: number

  /**
   * @deprecated
   *
   * @default 1
   */
  StoryFireInFront: number

  /**
   * Whether or not the storyboard can use the user's skin images
   *
   * @default 0
   */
  UseSkinSprites: number

  /**
   * @deprecated
   *
   * @default 0
   */
  AlwaysShowPlayfield: number

  /**
   * Draw order of hit circle overlays compared to hit numbers
   *
   * `NoChange` = use skin setting, `Below` = draw overlays under numbers, `Above` = draw overlays on top of numbers
   *
   * @default NoChange
   */
  OverlayPosition: 'NoChange' | 'Below' | 'Above'

  /**
   * Preferred skin to use during gameplay
   */
  SkinPreference?: string

  /**
   * Whether or not a warning about flashing colours should be shown at the beginning of the map
   *
   * @default 0
   */
  EpilepsyWarning: number

  /**
   * Time in beats that the countdown starts before the first hit object
   *
   * @default 0
   */
  CountdownOffset: number

  /**
   * Whether or not the "N+1" style key layout is used for osu!mania
   *
   * @default 0
   */
  SpecialStyle: number

  /**
   * Whether or not the storyboard allows widescreen viewing
   *
   * @default 0
   */
  WidescreenStoryboard: number

  /**
   * Whether or not sound samples will change rate when playing with speed-changing mods
   *
   * @default 0
   */
  SamplesMatchPlaybackRate: number
}

export enum OsuMapMode {
  Standard = 0,
  Taiko = 1,
  Catch = 2,
  Mania = 3,
}
