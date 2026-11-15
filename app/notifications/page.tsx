import Link from "next/link";
import { LiveShell } from "@/components/shell/LiveShell";
import { readStore } from "@/lib/store";
import { currentUser } from "@/lib/auth";
import { Avatar } from "@/components/ui/Avatar";
import { Empty } from "@/components/ui/Views";
export const dynamic = "force-dynamic";
export const metadata = { title: "Notifications" };
export default async function Notifications() {
  const [store, session] = await Promise.all([readStore(), currentUser()]);
  const user = store.users.find((u) => u.id === session?.id);
  const events: {
    key: string;
    handle: string;
    text: string;
    href: string;
    avatar?: number;
  }[] = [];
  if (user) {
    for (const person of store.users.filter(
      (p) => p.id !== user.id && p.following?.includes(user.id),
    ))
      events.push({
        key: "follow-" + person.id,
        handle: person.handle,
        text: "followed you",
        href: "/people/" + person.handle,
        avatar: person.avatar,
      });
    for (const post of (store.posts || []).filter(
      (p) => p.authorHandle === user.handle,
    )) {
      for (const [action, ids] of [
        ["liked", post.likedBy],
        ["reposted", post.repostedBy],
      ] as const) {
        for (const id of ids || []) {
          const person = store.users.find((p) => p.id === id && id !== user.id);
          if (person)
            events.push({
              key: action + post.id + id,
              handle: person.handle,
              text: action + " your post",
              href: "/post/" + post.id,
              avatar: person.avatar,
            });
        }
      }
      for (const reply of post.replies || [])
        if (reply.authorHandle !== user.handle)
          events.push({
            key: reply.id,
            handle: reply.authorHandle,
            text: "replied to your post",
            href: "/post/" + post.id + "#replies",
          });
    }
  }
  return (
    <LiveShell>
      <div className="view-heading">
        <h1>Notifications</h1>
        <p>Little signs of life around your corner.</p>
      </div>
      {events.length ? (
        events.map((event) => (
          <Link className="notification-row" key={event.key} href={event.href}>
            <Avatar handle={event.handle} index={event.avatar} />
            <span>
              <strong>@{event.handle}</strong> {event.text}
            </span>
          </Link>
        ))
      ) : (
        <Empty title={user ? "All quiet for now" : "Your notifications"}>
          {user ? (
            "Follows, replies, likes and reposts will appear here."
          ) : (
            <>
              <Link href="/login">Sign in</Link> to see your notifications.
            </>
          )}
        </Empty>
      )}
    </LiveShell>
  );
}
