import { readStore } from "@/lib/store";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const encoder = new TextEncoder();
  let cursor = new Date().toISOString();
  let closed = false;

  const stream = new ReadableStream({
    start(controller) {
      const send = (event: string, data: string) => {
        if (closed) return;
        controller.enqueue(encoder.encode(`event: ${event}\ndata: ${data}\n\n`));
      };

      send("ready", JSON.stringify({ at: cursor }));

      const tick = async () => {
        if (closed) return;
        try {
          const store = await readStore();
          const fresh = store.chat.filter((message) => message.createdAt > cursor);
          if (fresh.length > 0) {
            cursor = fresh[fresh.length - 1].createdAt;
            for (const message of fresh) {
              send("message", JSON.stringify(message));
            }
          } else {
            send("ping", JSON.stringify({ at: new Date().toISOString() }));
          }
        } catch {
          send("error", JSON.stringify({ error: "store unreadable" }));
        }
      };

      const interval = setInterval(tick, 2000);
      void tick();

      const close = () => {
        if (closed) return;
        closed = true;
        clearInterval(interval);
        try {
          controller.close();
        } catch {
          /* already closed */
        }
      };

      request.signal.addEventListener("abort", close);
    },
    cancel() {
      closed = true;
    }
  });

  return new Response(stream, {
    headers: {
      "content-type": "text/event-stream; charset=utf-8",
      "cache-control": "no-cache, no-transform",
      connection: "keep-alive",
      "x-accel-buffering": "no"
    }
  });
}
