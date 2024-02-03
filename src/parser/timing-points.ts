export function parseTimingPoints(input: string[]): TimingPoint[] {
  const timingPoints: TimingPoint[] = []

  input.forEach((line) => {
    const [
      time,
      beatLength,
      meter,
      sampleSet,
      sampleIndex,
      volume,
      uninherited,
      effects,
    ] = line.split(',').map(v => v.trim()).map(v => Number(v))
    const item: TimingPoint = {
      time,
      meter,
      sampleSet,
      sampleIndex,
      volume,
      effect: {
        kiai: (effects & 1) === 1,
        omitFirstBarLine: (effects & 8) === 8,
      },
      ...(
        uninherited === 1
          ? {
              type: 'uninherited',
              BPM: Math.round(60000 / beatLength * 1e6) / 1e6,
            }
          : {
              type: 'inherited',
              sliderMultiplier: Math.round(-100 / beatLength * 1e6) / 1e6,
            }
      ),
    }

    timingPoints.push(item as TimingPoint)
  })

  return timingPoints
}

export type TimingPoint = {
  /**
   * Start time of the timing section, in milliseconds from the beginning of the beatmap's audio. The end of the timing section is the next timing point's time (or never, if this is the last timing point).
   */
  time: number

  /**
   * Amount of beats in a measure. Inherited timing points ignore this property.
   */
  meter: number

  /**
   * Default sample set for hit objects.
   *
   * `0` = beatmap default, `1` = normal, `2` = soft, `3` = drum
   */
  sampleSet: SampleSet

  /**
   * Custom sample index for hit objects. `0` indicates osu!'s default hitsounds.
   */
  sampleIndex: number

  /**
   * Volume percentage for hit objects.
   */
  volume: number

  effect: {
    /**
     * Bit flags that give the timing point extra effects. See [the effects section](#effects).
     */
    kiai: boolean

    /**
     * Whether or not the first barline is omitted in osu!taiko and osu!mania
     */
    omitFirstBarLine: boolean
  }
} & ({
  type: 'uninherited'
  /**
   * The BPM for this timing point.
   */
  BPM: number
} | {
  type: 'inherited'
  /**
   * The slider velocity multiplier for this timing point.
   * For example, a `sliderMultiplier` of `2` means `BPM * 2` in osu! editor.
   */
  sliderMultiplier: number
})

export enum SampleSet {
  BeatmapDefault = 0,
  Normal = 1,
  Soft = 2,
  Drum = 3,
}
