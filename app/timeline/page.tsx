import { FilePicker } from "@/components/ui/FilePicker";
import Link from "next/link";
import { LiveShell } from "@/components/shell/LiveShell";
import { FeedList, Empty } from "@/components/ui/Views";
import { Avatar } from "@/components/ui/Avatar";
import { getFeedItems } from "@/lib/feed";
import { config } from "@/lib/config";
import { currentUser } from "@/lib/auth";
import { readStore } from "@/lib/store";
import { createPost } from "@/app/actions/posts";
export const dynamic = "force-dynamic";
export const metadata = { title: "Timeline" };
export default async function Timeline({
  searchParams,
}: {
  searchParams: Promise<{ view?: string; error?: string }>;
}) {
  const [{ view, error }, items, user, store] = await Promise.all([
    searchParams,
    getFeedItems(),
    currentUser(),
    readStore(),
  ]);
  const feeds = view === "feeds";
  const following = view === "following";
  const viewer = store.users.find((u) => u.id === user?.id);
  const followed = store.users.filter((u) => viewer?.following?.includes(u.id));
  const visible = items
    .filter(
      (item) =>
        !following ||
        followed.some(
          (person) =>
            item.author === "@" + person.handle ||
            item.social?.repostedBy.includes(person.id),
        ),
    )
    .filter((item) =>
      feeds
        ? !["commons", "local"].includes(item.source)
        : ["commons", "local"].includes(item.source),
    );
  const avatars = Object.fromEntries(
    store.users
      .filter((u) => u.avatar !== undefined)
      .map((u) => [u.handle, u.avatar!]),
  );
  return (
    <LiveShell>
      <div className="view-heading">
        <h1>Timeline</h1>
        <p>Everyday things, from the people around here.</p>
      </div>
      <nav className="feed-tabs" aria-label="Timeline sources">
        <Link
          href="/timeline?view=following"
          aria-current={following ? "page" : undefined}
        >
          Following
        </Link>
        <Link
          href="/timeline"
          aria-current={!feeds && !following ? "page" : undefined}
        >
          Local
        </Link>
        <Link
          href="/timeline?view=feeds"
          aria-current={feeds ? "page" : undefined}
        >
          Feeds
        </Link>
        <a href="/feed.xml">RSS</a>
      </nav>
      {!feeds &&
        (user ? (
          <form action={createPost} className="composer">
            <Avatar
              handle={user.handle}
              index={avatars[user.handle]}
              url={viewer?.avatarUrl}
            />
            <div className="composer-body">
              <label htmlFor="post-body">What's happening around you?</label>
              <textarea
                id="post-body"
                name="body"
                maxLength={2000}
                minLength={1}
                required
                placeholder="A small thought, a good find, a hello..."
              />
              {error && (
                <p role="alert">
                  {error === "image"
                    ? "Use a PNG, JPEG or WebP up to 5 MB."
                    : "Please write between 1 and 2,000 characters."}
                </p>
              )}
              <details className="attach-image">
                <summary>Attach an image</summary>
                <label htmlFor="post-image">
                  PNG, JPEG or WebP · up to 5 MB
                </label>
                <FilePicker id="post-image" />
                <label htmlFor="image-alt">Describe the image</label>
                <input
                  id="image-alt"
                  type="text"
                  name="imageAlt"
                  maxLength={500}
                />
              </details>
              <div className="composer-foot">
                <span>@{user.handle}</span>
                <button type="submit" className="button">
                  Post
                </button>
              </div>
            </div>
          </form>
        ) : (
          <div className="notice" style={{ margin: "20px 24px" }}>
            <Link href="/login">Sign in</Link> to share a thought. Just looking
            around? You're welcome here.
          </div>
        ))}
      {visible.length ? (
        <FeedList items={visible} avatars={avatars} />
      ) : (
        <Empty title={feeds ? "No feeds connected yet" : "A quiet moment"}>
          {feeds ? (
            <>
              Add your favorite RSS or Atom feeds in the{" "}
              <Link href="/docs#timeline">setup notes</Link>.
            </>
          ) : (
            <>
              No posts yet. Start a conversation in the{" "}
              <Link href="/community">commons</Link> or sign in to say hello.
            </>
          )}
        </Empty>
      )}
    </LiveShell>
  );
}
