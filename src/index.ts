import { parseColours } from './parser/colours'
import { parseDifficulty } from './parser/difficulty'
import { parseEditor } from './parser/editor'
import { parseEvents } from './parser/events'
import { parseGeneral } from './parser/general'
import { parseHitObjects } from './parser/hit-objects'
import { parseMetadata } from './parser/metadata'
import { parseTimingPoints } from './parser/timing-points'
import type { OsuMap } from './type'
import { splitMapBlock } from './utils'

export type * from './type'

/**
 * Parse an osu! map into a structured and typed object.
 */
export function parseMap(map: string): OsuMap {
  const blocks = splitMapBlock(map)

  const general = parseGeneral(blocks.General ?? [])
  const editor = parseEditor(blocks.Editor ?? [])
  const metadata = parseMetadata(blocks.Metadata ?? [])
  const difficulty = parseDifficulty(blocks.Difficulty ?? [])
  const events = parseEvents(blocks.Events ?? [])
  const timingPoints = parseTimingPoints(blocks.TimingPoints ?? [])
  const colours = parseColours(blocks.Colours ?? [])
  const hitObjects = parseHitObjects(blocks.HitObjects ?? [], general.Mode)

  return {
    general,
    editor,
    metadata,
    difficulty,
    events,
    timingPoints,
    colours,
    hitObjects,
  }
}

export { OsuMap }
