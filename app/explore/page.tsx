import Link from "next/link";
import { LiveShell } from "@/components/shell/LiveShell";
import { Avatar } from "@/components/ui/Avatar";
import { FollowButton } from "@/components/social/Actions";
import { PeopleSearch } from "@/components/social/PeopleSearch";
import { readStore } from "@/lib/store";
import { currentUser } from "@/lib/auth";
import { Empty } from "@/components/ui/Views";
export const dynamic = "force-dynamic";
export const metadata = { title: "Explore" };
export default async function Explore({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const [{ q = "" }, store, session] = await Promise.all([
    searchParams,
    readStore(),
    currentUser(),
  ]);
  const user = store.users.find((u) => u.id === session?.id);
  const people = store.users.filter((u) =>
    u.handle.toLowerCase().includes(q.toLowerCase()),
  );
  return (
    <LiveShell>
      <div className="view-heading">
        <h1>Explore</h1>
        <p>Find the people who make this place.</p>
        <PeopleSearch />
      </div>
      {people.length ? (
        people.map((person) => (
          <div className="directory-row" key={person.id}>
            <Link className="person-info" href={`/people/${person.handle}`}>
              <Avatar handle={person.handle} index={person.avatar} />
              <span>
                <strong>{person.handle}</strong>
                <small>@{person.handle}</small>
              </span>
            </Link>
            {session?.id !== person.id && (
              <FollowButton
                handle={person.handle}
                initial={user?.following?.includes(person.id)}
              />
            )}
          </div>
        ))
      ) : (
        <Empty title="A little room to grow">
          {q
            ? "No people match that search."
            : "Nobody has joined yet. The first hello can be yours."}
        </Empty>
      )}
    </LiveShell>
  );
}
