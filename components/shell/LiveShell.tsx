import type { ReactNode } from "react";
import { CommunityShell, Neighborhood } from "./CommunityShell";
import { config } from "@/lib/config";
import { enabledPlugins } from "@/lib/plugins";
import { readStore } from "@/lib/store";
import { currentUser } from "@/lib/auth";
import { Avatar } from "@/components/ui/Avatar";
import { FollowButton } from "@/components/social/Actions";
import Link from "next/link";
import { PeopleSearch } from "@/components/social/PeopleSearch";
export async function LiveShell({ children }: { children: ReactNode }) {
  const [store, session] = await Promise.all([readStore(), currentUser()]);
  const user = store.users.find((u) => u.id === session?.id);
  const people = store.users.filter((u) => u.id !== session?.id).slice(0, 3);
  return (
    <CommunityShell
      site={{
        title: config.title,
        enabled: [...enabledPlugins],
        repositoryUrl: config.repositoryUrl,
        viewer: user
          ? {
              handle: user.handle,
              avatar: user.avatar,
              avatarUrl: user.avatarUrl,
            }
          : undefined,
      }}
      aside={
        <Neighborhood title={config.title} search={<PeopleSearch />}>
          {people.length > 0 && (
            <section className="sidebar-section">
              <h3>People around here</h3>
              {people.map((person) => (
                <div className="person-row" key={person.id}>
                  <Link
                    className="person-info"
                    href={`/people/${person.handle}`}
                  >
                    <Avatar
                      handle={person.handle}
                      index={person.avatar}
                      url={person.avatarUrl}
                      size={38}
                    />
                    <span>
                      <strong>{person.handle}</strong>
                      <small>@{person.handle}</small>
                    </span>
                  </Link>
                  <FollowButton
                    handle={person.handle}
                    initial={user?.following?.includes(person.id)}
                  />
                </div>
              ))}
            </section>
          )}
          {store.threads.length > 0 && (
            <section className="sidebar-section">
              <h3>From the commons</h3>
              {store.threads
                .slice(-2)
                .reverse()
                .map((thread) => (
                  <Link
                    className="commons-preview"
                    key={thread.id}
                    href={`/community/${thread.slug}`}
                  >
                    <span>
                      <strong>{thread.title}</strong>
                      <small>{thread.replies.length} replies</small>
                    </span>
                  </Link>
                ))}
            </section>
          )}
        </Neighborhood>
      }
    >
      {children}
    </CommunityShell>
  );
}
