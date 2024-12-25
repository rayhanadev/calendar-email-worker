import dayjs from "dayjs";
import advancedFormat from "dayjs/plugin/advancedFormat";

import type { OutputItem } from "./consts";

dayjs.extend(advancedFormat);

export async function streamToArrayBuffer(
  stream: ReadableStream,
  streamSize: number,
) {
  const result = new Uint8Array(streamSize);
  let bytesRead = 0;
  const reader = stream.getReader();
  while (true) {
    const { done, value } = await reader.read();
    if (done) {
      break;
    }
    result.set(value, bytesRead);
    bytesRead += value.length;
  }
  return result;
}

export function formatEvent(event: OutputItem): string {
  return `<strong>${event.name}</strong>
<ul>
  ${
    event.start === null && event.end === null
      ? "<li>Start Time: All Day</li><li>End Time: All Day</li>"
      : `<li>Start Time: ${event.start ? dayjs(event.start).format("MMM Do [at] h:mm A") : "Unknown"}</li>
        <li>End Time: ${event.end ? dayjs(event.end).format("MMM Do [at] h:mm A") : "Unknown"}</li>`
  }
  <li>Type: ${String(event.type)}</li>
  <li>Location: ${String(event.location)}</li>
  <li>Description: ${String(event.description)}</li>
</ul>`;
}
