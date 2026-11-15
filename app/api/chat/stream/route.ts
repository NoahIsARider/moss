import { readStore } from "@/lib/store";
export const dynamic = "force-dynamic";
export async function GET(request: Request) {
  const encoder = new TextEncoder();
  let cursor = new Date().toISOString();
  let closed = false;
  let interval: ReturnType<typeof setInterval> | undefined;
  let close = () => {
    closed = true;
    if (interval) clearInterval(interval);
  };
  const stream = new ReadableStream({
    start(controller) {
      const send = (event: string, data: string) => {
        if (!closed)
          controller.enqueue(
            encoder.encode(`event: ${event}\ndata: ${data}\n\n`),
          );
      };
      send("ready", JSON.stringify({ at: cursor }));
      const tick = async () => {
        if (closed) return;
        try {
          const store = await readStore();
          if (closed) return;
          const fresh = store.chat.filter(
            (message) => message.createdAt > cursor,
          );
          if (fresh.length) {
            cursor = fresh[fresh.length - 1].createdAt;
            for (const message of fresh)
              send("message", JSON.stringify(message));
          } else send("ping", JSON.stringify({ at: new Date().toISOString() }));
        } catch {
          send("error", JSON.stringify({ error: "store unreadable" }));
        }
      };
      close = () => {
        if (closed) return;
        closed = true;
        if (interval) clearInterval(interval);
        request.signal.removeEventListener("abort", close);
        try {
          controller.close();
        } catch {}
      };
      interval = setInterval(tick, 2000);
      request.signal.addEventListener("abort", close);
      if (request.signal.aborted) close();
      else void tick();
    },
    cancel() {
      close();
    },
  });
  return new Response(stream, {
    headers: {
      "content-type": "text/event-stream; charset=utf-8",
      "cache-control": "no-cache, no-transform",
      connection: "keep-alive",
      "x-accel-buffering": "no",
    },
  });
}
