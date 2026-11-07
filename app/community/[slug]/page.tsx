import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { addReply } from "@/app/actions/community";
import { MintFrame } from "@/components/shell/Frame";
import { BackLink } from "@/components/shell/PageParts";
import { currentUser } from "@/lib/auth";
import { dateTime } from "@/lib/format";
import { renderMarkdown } from "@/lib/markdown";
import { readStore } from "@/lib/store";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const store = await readStore();
  const thread = store.threads.find((entry) => entry.slug === slug);
  return { title: thread ? thread.title : "Thread" };
}

export default async function ThreadPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const store = await readStore();
  const thread = store.threads.find((entry) => entry.slug === slug);
  if (!thread) notFound();

  const user = await currentUser();

  return (
    <MintFrame news={`#${thread.channel} · ${thread.title} · ${thread.replies.length} replies and counting.`}>
      <tr>
        <td colSpan={2}>
          <BackLink href="/community" label="back to the commons" />
          <div className="page-head">
            <span className="kicker">
              #{thread.channel} &middot; started by @{thread.authorHandle} &middot; {dateTime(thread.createdAt)}
            </span>
            <h2>{thread.title}</h2>
          </div>
          <div className="prose" dangerouslySetInnerHTML={{ __html: renderMarkdown(thread.body) }} />

          <div id="replies">
            {thread.replies.length === 0 ? (
              <p className="mono">No replies yet. The first one can be short.</p>
            ) : (
              thread.replies.map((reply) => (
                <div className="reply" key={reply.id}>
                  <div className="meta">
                    @{reply.authorHandle} &middot; {dateTime(reply.createdAt)}
                  </div>
                  <div className="prose" dangerouslySetInnerHTML={{ __html: renderMarkdown(reply.body) }} />
                </div>
              ))
            )}
          </div>

          {user ? (
            <form action={addReply} className="mint-form">
              <input type="hidden" name="threadId" value={thread.id} />
              <table>
                <tbody>
                  <tr>
                    <td>
                      <label htmlFor="reply-body">reply as @{user.handle}</label>
                      <textarea id="reply-body" name="body" maxLength={4000} required />
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <button type="submit">post reply</button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </form>
          ) : (
            <div className="notice">
              <Link href="/login">Sign in</Link> or <Link href="/join">create a handle</Link> to reply. Reading is
              open to everyone.
            </div>
          )}
        </td>
      </tr>
    </MintFrame>
  );
}
