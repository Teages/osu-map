export const knownBlockNames = ['General', 'Editor', 'Metadata', 'Difficulty', 'Events', 'TimingPoints', 'Colours', 'HitObjects'] as const

export type MapBlocks = Partial<Record<typeof knownBlockNames[number], string[]>>

export function splitMapBlock(map: string): MapBlocks & {
  comments: { line: number, content: string }[]
  blockOrder: Array<typeof knownBlockNames[number]>
} {
  const lines = map.split('\n')
    .map(line => line.trim()) // remove leading and trailing whitespace

  const blockOrder: Set<typeof knownBlockNames[number]> = new Set()
  const mapBlockRecord: MapBlocks = {}
  const comments: { line: number, content: string }[] = []

  let currentBlock: typeof knownBlockNames[number] | undefined
  lines.forEach((line, index) => {
    if (line === '' || line.startsWith('//')) {
      comments.push({ line: index, content: line })
    }

    // change current block
    else if (line.startsWith('[') && line.endsWith(']')) {
      const name = line.slice(1, -1)
      if (!knownBlockNames.includes(name as any)) {
        // unknown block, treat as comments
        comments.push({ line: index, content: line })
        currentBlock = undefined
      }
      blockOrder.add(name as any)
      currentBlock = name as any
    }

    // add to current block
    else if (currentBlock) {
      if (!mapBlockRecord[currentBlock]) {
        mapBlockRecord[currentBlock] = []
      }
      mapBlockRecord[currentBlock]!.push(line)
    }

    // comments
    else {
      comments.push({ line: index, content: line })
    }
  })
  return {
    ...mapBlockRecord,
    comments,
    blockOrder: [...blockOrder],
  }
}

export function useKVPairParser<
  TResult,
  TRules extends Record<string, 'string' | 'number'> = any,
>(
  rules: TRules,
  defaultValue: Partial<Record<keyof TRules, string | number>> = {},
): (lines: string[]) => TResult {
  return (lines: string[]) => {
    const res = { ...defaultValue }
    const knowKeys = Object.keys(rules) as (keyof TRules)[]
    lines.forEach((line) => {
      const [key, value] = line.split(':')
      if (knowKeys.includes(key as any)) {
        const type = rules[key as keyof TRules]
        switch (type) {
          case 'string':
            res[key as keyof TRules] = value.trim()
            break
          case 'number':
            res[key as keyof TRules] = Number(value.trim())
            break
        }
      }
    })
    return res as TResult
  }
}

export function useStrAutomaton(str: string) {
  let string = str

  return {
    // read until the first occurrence of the char, throw error if not found
    readUntil: (char: string) => {
      const index = string.indexOf(char)
      if (index === -1) {
        throw new Error(`Unexpected end. Maybe missing arguments? Expected ${char}`)
      }
      else {
        const res = string.slice(0, index)
        string = string.slice(index + 1)
        return res
      }
    },

    // try read until the first occurrence of the char, return the rest if not found, throw error if empty
    tryReadUntil: (char: string) => {
      const index = string.indexOf(char)
      if (index === -1) {
        if (string === '') {
          throw new Error(`Unexpected end. Maybe missing arguments? Expected ${char}`)
        }
        const res = string
        string = ''
        return res
      }
      else {
        const res = string.slice(0, index)
        string = string.slice(index + 1)
        return res
      }
    },

    // read all remaining string
    readAll: () => {
      const res = string
      string = ''
      return res
    },

    // preview the remaining string
    preview: () => string,

    // add string to the end of the remaining string
    add: (str: string) => {
      string += str
    },
  }
}
