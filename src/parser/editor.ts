import { useKVPairParser } from '../utils'

export function parseEditor(input: string[]): Editor {
  const typeMap = {
    Bookmarks: 'string',
    DistanceSpacing: 'number',
    BeatDivisor: 'number',
    GridSize: 'number',
    TimelineZoom: 'number',
  } as const

  const defaultValues = {
    Bookmarks: '',
  }

  const editorParser = useKVPairParser<Omit<Editor, 'Bookmarks'> & { Bookmarks: string }>(typeMap, defaultValues)

  const res = editorParser(input)

  return {
    ...res,
    Bookmarks: res.Bookmarks.split(',').map(v => v.trim()).map(Number),
  }
}

export interface Editor {
  /**
   * Time in milliseconds of [bookmarks](https://osu.ppy.sh/wiki/Client/Beatmap_editor/Compose#song-timeline)
   */
  Bookmarks: number[]

  /**
   * [Distance snap](https://osu.ppy.sh/wiki/Client/Beatmap_editor/Distance_snap) multiplier
   */
  DistanceSpacing?: number

  /**
   * [Beat snap divisor](https://osu.ppy.sh/wiki/Client/Beatmap_editor/Beat_snap_divisor)
   */
  BeatDivisor?: number

  /**
   * [Grid size](https://osu.ppy.sh/wiki/Beatmapping/Grid_snapping)
   */
  GridSize?: number

  /**
   * Scale factor for the [object timeline](https://osu.ppy.sh/wiki/Client/Beatmap_editor/Compose#hit-object-timeline)
   */
  TimelineZoom?: number
}
