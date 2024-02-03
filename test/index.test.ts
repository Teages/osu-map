import fs from 'node:fs'
import path from 'pathe'
import { describe, expect, it } from 'vitest'
import { parseMap } from '../src'

describe('@teages/osu-map', () => {
  it('parses map: std map(4025768)', () => {
    const rawMap = useRawMap()
    const mapData = useMapData()

    const parsed = parseMap(rawMap)
    Object.entries(parsed).forEach(([key, value]) => {
      expect(value).toEqual(mapData[key])
    })
  })

  it('parses map: std map(3942128)', () => {
    const rawMap = useRawMap(3942128)
    const mapData = useMapData(3942128)

    const parsed = parseMap(rawMap)
    Object.entries(parsed).forEach(([key, value]) => {
      expect(value).toEqual(mapData[key])
    })
  })

  it('parses map: std map(4007906)', () => {
    const rawMap = useRawMap(4007906)
    const mapData = useMapData(4007906)

    const parsed = parseMap(rawMap)
    Object.entries(parsed).forEach(([key, value]) => {
      expect(value).toEqual(mapData[key])
    })
  })

  it('parses map: taiko map(3542680)', () => {
    const rawMap = useRawMap(3542680)
    const mapData = useMapData(3542680)

    const parsed = parseMap(rawMap)
    Object.entries(parsed).forEach(([key, value]) => {
      expect(value).toEqual(mapData[key])
    })
  })

  it('parses map: mania map(3208358)', () => {
    const rawMap = useRawMap(3208358)
    const mapData = useMapData(3208358)

    const parsed = parseMap(rawMap)
    Object.entries(parsed).forEach(([key, value]) => {
      expect(value).toEqual(mapData[key])
    })
  })
})

function useRawMap(mapId: number = 4025768) {
  return fs.readFileSync(path.join(import.meta.dirname, `./data/${mapId}/input.osu`), 'utf-8')
}

function useMapData(mapId: number = 4025768) {
  return JSON.parse(fs.readFileSync(path.join(import.meta.dirname, `./data/${mapId}/output.json`), 'utf-8'))
}
