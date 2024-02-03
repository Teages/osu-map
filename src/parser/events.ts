export function parseEvents(input: string[]): Events {
  const rawEvents = input.map((line) => {
    const [eventType, startTime, ...eventParams] = line.split(',')
    const parsedEventType = Number(eventType)
    return {
      eventType: Number.isNaN(parsedEventType) ? eventType : parsedEventType,
      startTime: Number(startTime.trim()),
      eventParams: eventParams.map(v => v.trim()),
    }
  })

  const rawBackground = rawEvents.find(e => e.eventType === 0)
  const rawVideo = rawEvents.find(e => e.eventType === 'Video' || e.eventType === 1)
  const breaks = rawEvents.filter(e => e.eventType === 'Break' || e.eventType === 2)
    .map(e => ({
      startTime: e.startTime,
      endTime: Number(e.eventParams[0]),
    }))

  return {
    background: rawBackground
      ? {
          filename: cleanFilename(rawBackground.eventParams[0]),
          xOffset: Number(rawBackground.eventParams[1]) || 0,
          yOffset: Number(rawBackground.eventParams[2]) || 0,
        }
      : undefined,
    video: rawVideo
      ? {
          startTime: rawVideo.startTime,
          filename: cleanFilename(rawVideo.eventParams[0]),
          xOffset: Number(rawVideo.eventParams[1]) || 0,
          yOffset: Number(rawVideo.eventParams[2]) || 0,
        }
      : undefined,
    breaks,
    raw: rawEvents,
  }
}

// Double quotes are usually included surrounding the filename, but they are not required.
function cleanFilename(filename: string) {
  if (filename.startsWith('"') && filename.endsWith('"')) {
    return filename.slice(1, -1)
  }
  return filename
}

export interface Events {
  /**
   * Background
   */
  background?: {
    /**
     * Location of the background image relative to the beatmap directory. Double quotes are usually included surrounding the filename, but they are not required.
     *
     * The library will automatically remove the double quotes.
     */
    filename: string

    /**
     * Horizontal offset of the background image. Using [osu! pixels](https://osu.ppy.sh/wiki/Client/Beatmap_editor/osu!_pixel) as the unit.
     */
    xOffset: number

    /**
     * Vertical offset of the background image. Using [osu! pixels](https://osu.ppy.sh/wiki/Client/Beatmap_editor/osu!_pixel) as the unit.
     */
    yOffset: number
  }

  /**
   * Video events
   */
  video?: {
    /**
     * Time when the video starts, in milliseconds from the beginning of the beatmap's audio.
     */
    startTime: number

    /**
     * Location of the background video relative to the beatmap directory. Double quotes are usually included surrounding the filename, but they are not required.
     *
     * The library will automatically remove the double quotes.
     */
    filename: string

    /**
     * Horizontal offset of the background image. Using [osu! pixels](https://osu.ppy.sh/wiki/Client/Beatmap_editor/osu!_pixel) as the unit.
     */
    xOffset: number

    /**
     * Vertical offset of the background image. Using [osu! pixels](https://osu.ppy.sh/wiki/Client/Beatmap_editor/osu!_pixel) as the unit.
     */
    yOffset: number
  }

  /**
   * Break events
   */
  breaks: Array<{
    /**
     * Time when the break starts, in milliseconds from the beginning of the beatmap's audio.
     */
    startTime: number

    /**
     * Time when the break ends, in milliseconds from the beginning of the beatmap's audio.
     */
    endTime: number
  }>

  /**
   * Raw event data
   */
  raw: RawEvent[]
}
export interface RawEvent {
  /**
   * Type of the event. Some events may be referred to by either a name or a number.
   */
  eventType: number | string

  /**
   * Start time of the event, in milliseconds from the beginning of the beatmap's audio. For events that do not use a start time, the default is `0`.
   */
  startTime: number

  /**
   * Extra parameters specific to the event's type.
   */
  eventParams: Array<number | string>
}
