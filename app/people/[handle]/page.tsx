import { notFound } from "next/navigation";
import { LiveShell } from "@/components/shell/LiveShell";
import { Avatar } from "@/components/ui/Avatar";
import { FollowButton } from "@/components/social/Actions";
import { FeedList, Empty } from "@/components/ui/Views";
import { readStore } from "@/lib/store";
import { currentUser } from "@/lib/auth";
import { getFeedItems } from "@/lib/feed";
export const dynamic = "force-dynamic";
export default async function Profile({
  params,
}: {
  params: Promise<{ handle: string }>;
}) {
  const [{ handle }, store, session, items] = await Promise.all([
    params,
    readStore(),
    currentUser(),
    getFeedItems(),
  ]);
  const person = store.users.find((u) => u.handle === handle);
  if (!person) notFound();
  const user = store.users.find((u) => u.id === session?.id);
  const visible = items.filter(
    (item) =>
      item.author === "@" + handle ||
      item.social?.repostedBy.includes(person.id),
  );
  return (
    <LiveShell>
      <div className="profile-banner" />
      <div className="view-heading">
        <div className="section-heading">
          <Avatar
            handle={handle}
            index={person.avatar}
            url={person.avatarUrl}
            size={80}
          />
          {session?.id !== person.id && (
            <FollowButton
              handle={handle}
              initial={user?.following?.includes(person.id)}
            />
          )}
        </div>
        <h1>{handle}</h1>
        <p>
          @{handle} · Joined{" "}
          {new Date(person.createdAt).toLocaleDateString("en", {
            month: "long",
            year: "numeric",
            timeZone: "UTC",
          })}
        </p>
        <div className="post-meta">
          <span>
            {store.users.filter((u) => u.following?.includes(person.id)).length}{" "}
            followers
          </span>
          <span>{person.following?.length || 0} following</span>
        </div>
      </div>
      {visible.length ? (
        <FeedList items={visible} avatars={{ [handle]: person.avatar! }} />
      ) : (
        <Empty title="A fresh page">No posts here yet.</Empty>
      )}
    </LiveShell>
  );
}
