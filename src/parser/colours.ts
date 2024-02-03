export function parseColours(lines: string[]): Colours {
  const colours: Colours = {}

  lines.forEach((line) => {
    const [name, value] = line.split(':').map(v => v.trim())
    if (name === 'SliderTrackOverride') {
      colours.SliderTrackOverride = parseColor(value)
    }
    else if (name === 'SliderBorder') {
      colours.SliderBorder = parseColor(value)
    }
    else if (name.startsWith('Combo')) {
      const index = Number(name.slice('Combo'.length))
      colours[index] = parseColor(value)
    }
  })

  return colours
}

function parseColor(value: string): Color {
  const [red, green, blue] = value.split(',').map(v => v.trim()).map(v => Number(v))
  return {
    red,
    green,
    blue,
    hex: `#${red.toString(16).padStart(2, '0')}${green.toString(16).padStart(2, '0')}${blue.toString(16).padStart(2, '0')}`,
  }
}

export interface Colours {
  /**
   * Additive combo colours
   */
  [key: number]: Color

  /**
   * Additive slider track colour
   */
  SliderTrackOverride?: Color

  /**
   * Slider border colour
   */
  SliderBorder?: Color
}
export interface Color {
  red: number
  green: number
  blue: number
  hex: string
}
