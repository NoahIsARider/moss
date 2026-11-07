import type { Metadata } from "next";
import Link from "next/link";
import { MintFrame } from "@/components/shell/Frame";
import { PageHead } from "@/components/shell/PageParts";
import { readStore } from "@/lib/store";
import { shortDate } from "@/lib/format";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Commons"
};

export default async function CommunityPage() {
  const store = await readStore();
  const threads = [...store.threads].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
  const channels = [...new Set(threads.map((thread) => thread.channel))];

  return (
    <MintFrame news="The commons is deliberately slow. Threads stay up, replies stay attached, and nothing is ranked.">
      <tr>
        <td colSpan={2}>
          <PageHead
            kicker="plugin: commons"
            title="Commons"
            lede="Long form threads in the shape of a small forum. No votes, no algorithm, no notification bell. Channels are a filing cabinet, not a feed."
          />
          <p className="mono">
            {threads.length} threads &middot; channels {channels.map((channel) => `#${channel}`).join(" ")}{" "}
            &middot; <Link href="/community/new">start a thread</Link>
          </p>
          {threads.length === 0 ? (
            <div className="panel">
              <p className="prose" style={{ margin: 0 }}>
                No threads yet. This instance starts empty on purpose, so the first post is yours.{" "}
                <Link href="/community/new">Write it</Link>.
              </p>
            </div>
          ) : null}
          <table className="list">
            <tbody>
              {threads.map((thread, index) => (
                <tr key={thread.id} className={index % 2 ? "alt" : ""}>
                  <td className="stamp">{shortDate(thread.createdAt).slice(5)}</td>
                  <td>
                    <span className="title">
                      <Link href={`/community/${thread.slug}`}>{thread.title}</Link>
                    </span>
                    <span className="sub">
                      @{thread.authorHandle} in #{thread.channel} &middot; {thread.replies.length}{" "}
                      {thread.replies.length === 1 ? "reply" : "replies"}
                    </span>
                  </td>
                  <td className="tag">#{thread.channel}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </td>
      </tr>
    </MintFrame>
  );
}
