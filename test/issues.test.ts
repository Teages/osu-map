import { describe, expect, it } from 'vitest'
import { parseHitObjects } from '../src/parser/hit-objects'
import { OsuMapMode } from '../src/parser/general'

describe('issues', () => {
  it('#1', () => {
    expect(parseHitObjects([
      '131,169,9759,2,0,P|155:177|176:192,1,52.5',
    ], OsuMapMode.Standard)).matchSnapshot()
  })
})
