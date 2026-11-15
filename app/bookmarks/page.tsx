import Link from "next/link";
import { LiveShell } from "@/components/shell/LiveShell";
import { readStore } from "@/lib/store";
import { currentUser } from "@/lib/auth";
import { getFeedItems } from "@/lib/feed";
import { FeedList, Empty } from "@/components/ui/Views";
export const dynamic = "force-dynamic";
export const metadata = { title: "Bookmarks" };
export default async function Bookmarks() {
  const [store, session, items] = await Promise.all([
    readStore(),
    currentUser(),
    getFeedItems(),
  ]);
  const user = store.users.find((u) => u.id === session?.id);
  const saved = items.filter(
    (item) => item.social && user?.bookmarks?.includes(item.social.postId),
  );
  return (
    <LiveShell>
      <div className="view-heading">
        <h1>Bookmarks</h1>
        <p>A few things to come back to.</p>
      </div>
      {!user ? (
        <Empty title="Keep something for later">
          <Link href="/login">Sign in</Link> to see your bookmarks.
        </Empty>
      ) : saved.length ? (
        <FeedList items={saved} />
      ) : (
        <Empty title="Nothing saved yet">
          Use the bookmark button on a post to keep it here.
        </Empty>
      )}
    </LiveShell>
  );
}
