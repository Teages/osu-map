# @teages/osu-map

[![npm version][npm-version-src]][npm-version-href]
[![npm downloads][npm-downloads-src]][npm-downloads-href]

<!-- [![bundle][bundle-src]][bundle-href] -->
<!-- [![Codecov][codecov-src]][codecov-href] -->

Parse an osu! map into a structured and type safe object.

## Usage

Install package:

```sh
# npm
npm install @teages/osu-map

# yarn
yarn add @teages/osu-map

# pnpm
pnpm install @teages/osu-map

# bun
bun install @teages/osu-map
```

Import:

```js
// ESM
import { parseMap } from '@teages/osu-map'

// CommonJS
const { parseMap } = require('@teages/osu-map')
```

Use:

```ts
import { parseMap } from '@teages/osu-map'

const mapFile = useRawMap()
const map = parseMap(mapFile)
console.log(`Map: ${map.metadata.TitleUnicode} - ${map.metadata.ArtistUnicode} [${map.metadata.Version}]`)

// verify the first timing point
const firstTiming = map.timingPoints[0]
if (!firstTiming || firstTiming.type !== 'uninherited') {
  throw new Error('First timing point must be uninherited.')
}
console.log(`BPM of the first uninherited: ${firstTiming.BPM}`)
```

## Development

- Clone this repository
- Install latest LTS version of [Node.js](https://nodejs.org/en/)
- Enable [Corepack](https://github.com/nodejs/corepack) using `corepack enable`
- Install dependencies using `pnpm install`
- Run interactive tests using `pnpm dev`

## TODO

- [ ] Add more storyboard things
- [ ] Add `stringifyMap` function

## License

Published under [MIT License](./LICENSE).

<!-- Badges -->

[npm-version-src]: https://img.shields.io/npm/v/@teages/osu-map?style=flat&colorA=18181B&colorB=F0DB4F
[npm-version-href]: https://npmjs.com/package/@teages/osu-map
[npm-downloads-src]: https://img.shields.io/npm/dm/@teages/osu-map?style=flat&colorA=18181B&colorB=F0DB4F
[npm-downloads-href]: https://npmjs.com/package/@teages/osu-map

<!-- [codecov-src]: https://img.shields.io/codecov/c/gh/teages/osu-map/main?style=flat&colorA=18181B&colorB=F0DB4F
[codecov-href]: https://codecov.io/gh/teages/osu-map

[bundle-src]: https://img.shields.io/bundlephobia/minzip/@teages/osu-map?style=flat&colorA=18181B&colorB=F0DB4F
[bundle-href]: https://bundlephobia.com/result?p=@teages/osu-map -->
