import type { Difficulty } from './parser/difficulty'
import type { Editor } from './parser/editor'
import type { General } from './parser/general'
import type { Metadata } from './parser/metadata'
import type { Events } from './parser/events'
import type { TimingPoint } from './parser/timing-points'
import type { Colours } from './parser/colours'
import type { HitObject } from './parser/hit-objects'

// see https://osu.ppy.sh/wiki/en/Client/File_formats/osu_%28file_format%29
export interface OsuMap {
  /**
   * General information about the beatmap
   */
  general: General

  /**
   * Saved settings for the beatmap editor
   */
  editor: Editor

  /**
   * [Information](https://osu.ppy.sh/wiki/en/Client/Beatmap_editor/Song_setup#general) used to identify the beatmap
   */
  metadata: Metadata

  /**
   * [Difficulty settings](https://osu.ppy.sh/wiki/en/Client/Beatmap_editor/Song_setup#difficulty)
   */
  difficulty: Difficulty

  /**
   * Beatmap and storyboard graphic events
   */
  events: Events

  /**
   * Timing and control points
   */
  timingPoints: TimingPoint[]

  /**
   * Combo and skin colours
   */
  colours: Colours

  /**
   * Hit objects
   */
  hitObjects: HitObject[]
}

export type { Difficulty, Editor, General, Metadata, Events, TimingPoint, Colours, HitObject }
