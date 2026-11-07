import { config } from "./config";
import { readStore } from "./store";
import type { ChatMessage } from "./types";

export function matrixConfigured(): boolean {
  return Boolean(config.matrix.homeserver && config.matrix.token && config.matrix.room);
}

interface MatrixEvent {
  event_id: string;
  sender: string;
  origin_server_ts: number;
  type: string;
  content?: { body?: string };
}

export async function readChat(limit = 30): Promise<ChatMessage[]> {
  const store = await readStore();
  const local = store.chat.slice(-limit);

  if (!matrixConfigured()) return local;

  try {
    const room = encodeURIComponent(config.matrix.room);
    const url = `${config.matrix.homeserver.replace(/\/$/, "")}/_matrix/client/v3/rooms/${room}/messages?dir=b&limit=${limit}`;
    const response = await fetch(url, {
      headers: { authorization: `Bearer ${config.matrix.token}` },
      signal: AbortSignal.timeout(3000),
      cache: "no-store"
    });
    if (!response.ok) throw new Error(`matrix returned ${response.status}`);
    const payload = (await response.json()) as { chunk?: MatrixEvent[] };
    const events = (payload.chunk ?? [])
      .filter((event) => event.type === "m.room.message" && event.content?.body)
      .map<ChatMessage>((event) => ({
        id: event.event_id,
        author: event.sender,
        body: event.content?.body ?? "",
        createdAt: new Date(event.origin_server_ts).toISOString(),
        transport: "matrix"
      }))
      .reverse();
    return events.length > 0 ? events : local;
  } catch {
    return local;
  }
}
