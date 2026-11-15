import Link from "next/link";
import { notFound } from "next/navigation";
import { LiveShell } from "@/components/shell/LiveShell";
import { FeedList } from "@/components/ui/Views";
import { Avatar } from "@/components/ui/Avatar";
import { getFeedItems } from "@/lib/feed";
import { readStore } from "@/lib/store";
import { currentUser } from "@/lib/auth";
import { replyToPost } from "@/app/actions/posts";
export const dynamic = "force-dynamic";
export default async function PostPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const [{ id }, store, items, user] = await Promise.all([
    params,
    readStore(),
    getFeedItems(),
    currentUser(),
  ]);
  const post = store.posts?.find((p) => p.id === id);
  const item = items.find((i) => i.social?.postId === id);
  if (!post || !item) notFound();
  const avatars = Object.fromEntries(
    store.users
      .filter((u) => u.avatar !== undefined)
      .map((u) => [u.handle, u.avatar!]),
  );
  return (
    <LiveShell>
      <div className="view-heading">
        <Link href="/timeline">← Timeline</Link>
        <h1 style={{ marginTop: 12 }}>Conversation</h1>
      </div>
      <FeedList items={[item]} avatars={avatars} />
      <div className="mint-page">
        <h2 id="replies">Replies</h2>
        {!post.replies?.length && <p>No replies yet. Say a little hello.</p>}
        {post.replies?.map((reply) => (
          <div className="reply" key={reply.id}>
            <div className="person-info">
              <Avatar
                handle={reply.authorHandle}
                index={avatars[reply.authorHandle]}
                size={35}
              />
              <Link href={`/people/${reply.authorHandle}`}>
                @{reply.authorHandle}
              </Link>
            </div>
            <p className="prose">{reply.body}</p>
          </div>
        ))}
        {user ? (
          <form action={replyToPost} className="mint-form">
            <input name="postId" value={id} type="hidden" />
            <label htmlFor="reply-body">Reply as @{user.handle}</label>
            <textarea id="reply-body" name="body" required maxLength={4000} />
            <button type="submit">Post reply</button>
          </form>
        ) : (
          <p className="notice">
            <Link href="/login">Sign in</Link> to join the conversation.
          </p>
        )}
      </div>
    </LiveShell>
  );
}
