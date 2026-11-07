import type { Metadata } from "next";
import { ChatRoom } from "@/components/chat/ChatRoom";
import { MintFrame } from "@/components/shell/Frame";
import { PageHead } from "@/components/shell/PageParts";
import { currentUser } from "@/lib/auth";
import { config } from "@/lib/config";
import { matrixConfigured } from "@/lib/matrix";
import { readChat } from "@/lib/matrix";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Chat"
};

export default async function ChatPage() {
  const user = await currentUser();
  const messages = await readChat(40);

  return (
    <MintFrame news="The room mirrors a Matrix room when a homeserver is configured. WebSocket clients can join on port 8787.">
      <tr>
        <td colSpan={2}>
          <PageHead
            kicker="plugin: chat"
            title="Chat"
            lede="One room, no threads, no read receipts. Messages arrive over server sent events by default and over a WebSocket bridge when one is running."
          />
          <div className="panel" style={{ marginTop: 6 }}>
            <p className="mono" style={{ margin: 0 }}>
              room #lobby:{config.domain} &middot; {matrixConfigured() ? "mirrored to a matrix homeserver" : "local store"} &middot;{" "}
              {user ? `signed in as @${user.handle}` : "guest, read only"}
            </p>
          </div>
          <ChatRoom initial={messages} viewer={user ? `@${user.handle}` : null} />
          <p className="mono">
            Bridge: <span style={{ color: "#8fe3b0" }}>ws://localhost:8787</span> &middot;{" "}
            <a href="/docs#chat">setup notes</a>
          </p>
        </td>
      </tr>
    </MintFrame>
  );
}
