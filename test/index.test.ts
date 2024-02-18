import fs from 'node:fs'
import path from 'pathe'
import { describe, expect, it } from 'vitest'
import { parseMap } from '../src'

describe('@teages/osu-map', () => {
  it('parses map: std map(4025768)', () => {
    const rawMap = useRawMap(4025768)

    const parsed = parseMap(rawMap)
    Object.entries(parsed).forEach(([_key, value]) => {
      expect(value).toMatchSnapshot()
    })
  })

  it('parses map: std map(3942128)', () => {
    const rawMap = useRawMap(3942128)

    const parsed = parseMap(rawMap)
    Object.entries(parsed).forEach(([_key, value]) => {
      expect(value).toMatchSnapshot()
    })
  })

  it('parses map: std map(4007906)', () => {
    const rawMap = useRawMap(4007906)

    const parsed = parseMap(rawMap)
    Object.entries(parsed).forEach(([_key, value]) => {
      expect(value).toMatchSnapshot()
    })
  })

  it('parses map: taiko map(3542680)', () => {
    const rawMap = useRawMap(3542680)

    const parsed = parseMap(rawMap)
    Object.entries(parsed).forEach(([_key, value]) => {
      expect(value).toMatchSnapshot()
    })
  })

  it('parses map: mania map(3208358)', () => {
    const rawMap = useRawMap(3208358)

    const parsed = parseMap(rawMap)
    Object.entries(parsed).forEach(([_key, value]) => {
      expect(value).toMatchSnapshot()
    })
  })
})

function useRawMap(mapId: number) {
  return fs.readFileSync(path.join(import.meta.dirname, `./data/${mapId}/input.osu`), 'utf-8')
}
