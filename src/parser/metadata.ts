import { useKVPairParser } from '../utils'

export function parseMetadata(input: string[]): Metadata {
  const typeMap = {
    Title: 'string',
    TitleUnicode: 'string',
    Artist: 'string',
    ArtistUnicode: 'string',
    Creator: 'string',
    Version: 'string',
    Source: 'string',
    Tags: 'string',
    BeatmapID: 'number',
    BeatmapSetID: 'number',
  } as const

  const generalParser = useKVPairParser<Omit<Metadata, 'Tags'> & { Tags: string }>(typeMap, {})

  const res = generalParser(input)
  return {
    ...res,
    Tags: res.Tags.split(' '),
  }
}

export interface Metadata {
  /**
   * Romanised song title
   */
  Title?: string

  /**
   * Song title
   */
  TitleUnicode?: string

  /**
   * Romanised song artist
   */
  Artist?: string

  /**
   * Song artist
   */
  ArtistUnicode?: string

  /**
   * Beatmap creator
   */
  Creator?: string

  /**
   * Difficulty name
   */
  Version?: string

  /**
   * Original media the song was produced for
   */
  Source?: string

  /**
   * Search terms
   */
  Tags?: string[]

  /**
   * Difficulty ID
   */
  BeatmapID?: number

  /**
   * Beatmap ID
   */
  BeatmapSetID?: number
}
