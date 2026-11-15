import Link from "next/link";
import { PostActions } from "@/components/social/Actions";
import { HomeHero } from "./Backgrounds";
import type { ReactNode } from "react";
import type { FeedItem, Thread } from "@/lib/types";
import { Avatar } from "./Avatar";
import { Icon } from "./Icon";
import { asset } from "@/lib/assets";
import {
  Header,
  Footer,
  type SiteIdentity,
} from "@/components/shell/CommunityShell";
export function Empty({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <div className="empty-state">
      <span className="empty-emblem">
        <Icon name="commons" size={27} />
      </span>
      <h2>{title}</h2>
      <p>{children}</p>
    </div>
  );
}
export function FeedList({
  items,
  avatars = {},
  renderActions,
}: {
  items: FeedItem[];
  avatars?: Record<string, number>;
  renderActions?: (item: FeedItem) => ReactNode;
}) {
  return (
    <div className="feed-list">
      {items.map((item) => (
        <article className="feed-post" id={item.id} key={item.id}>
          <Avatar
            handle={item.author}
            url={item.avatarUrl}
            index={avatars[item.author.replace(/^@/, "")]}
          />
          <div className="post-content">
            <div className="post-meta">
              <strong>
                {["local", "commons"].includes(item.source) ? (
                  <Link href={`/people/${item.author.replace(/^@/, "")}`}>
                    {item.author}
                  </Link>
                ) : (
                  item.author
                )}
              </strong>
              <span>{item.source}</span>
              <time dateTime={item.publishedAt}>
                {new Date(item.publishedAt).toLocaleDateString("en", {
                  month: "short",
                  day: "numeric",
                  timeZone: "UTC",
                })}
              </time>
            </div>
            {item.source !== "local" && (
              <h2>
                <Link href={item.link}>{item.title}</Link>
              </h2>
            )}
            <p>{item.summary}</p>
            {item.image && (
              <img
                className="post-image"
                src={asset(item.image)}
                alt={item.imageAlt || "Shared community illustration"}
                width={900}
                height={300}
              />
            )}
            {renderActions?.(item)}
            {item.social && (
              <PostActions id={item.social.postId} initial={item.social} />
            )}
            <div className="post-foot">
              {item.tags.map((tag) => (
                <span key={tag}>#{tag}</span>
              ))}
              <Link href={item.link} className="post-open">
                Open <Icon name="arrow" size={15} />
              </Link>
            </div>
          </div>
        </article>
      ))}
    </div>
  );
}
export function ThreadList({ threads }: { threads: Thread[] }) {
  return (
    <div className="thread-list">
      {threads.map((thread) => (
        <article className="thread-row" key={thread.id}>
          <Avatar handle={thread.authorHandle} />
          <div>
            <h2>
              <Link href={`/community/${thread.slug}`}>{thread.title}</Link>
            </h2>
            <p>{thread.body.slice(0, 160)}</p>
            <div className="post-meta">
              <span>@{thread.authorHandle}</span>
              <span>#{thread.channel}</span>
              <span>{thread.replies.length} replies</span>
            </div>
          </div>
          <Link
            className="reply-count"
            href={`/community/${thread.slug}#replies`}
            aria-label={`${thread.replies.length} replies to ${thread.title}`}
          >
            <Icon name="chat" size={18} />
            {thread.replies.length}
          </Link>
        </article>
      ))}
    </div>
  );
}
export function HomeView({
  site,
  items,
  threads,
  avatars = {},
}: {
  avatars?: Record<string, number>;
  site: SiteIdentity;
  items: FeedItem[];
  threads: Thread[];
}) {
  return (
    <>
      <a href="#main" className="skip-link">
        Skip to content
      </a>
      <Header site={site} />
      <HomeHero>
        <div className="hero-inner">
          <div className="hero-note">
            <span className="eyebrow">A home on the independent web</span>
            <h1>
              A little place to
              <br />
              be together.
            </h1>
            <p>
              Share a thought. Make something.
              <br className="mobile-break" /> Stay a while.
            </p>
            <div className="hero-actions">
              <Link href="/join" className="button">
                Join {site.title}
              </Link>
              <Link href="/timeline" className="button secondary">
                Look around <Icon name="arrow" size={17} />
              </Link>
            </div>
          </div>
        </div>
      </HomeHero>
      <main id="main" className="home-content">
        <section>
          <div className="section-heading">
            <h2>Around the neighborhood</h2>
            <Link href="/timeline">
              View timeline <Icon name="arrow" size={17} />
            </Link>
          </div>
          <div className="content-panel">
            {items.length ? (
              <FeedList items={items.slice(0, 4)} avatars={avatars} />
            ) : (
              <Empty title="The neighborhood starts with you">
                No posts yet.{" "}
                <Link href="/community/new">Start the first conversation</Link>,
                or simply settle in.
              </Empty>
            )}
          </div>
        </section>
        <aside>
          <div className="content-panel home-corners">
            <h2>Find your corner</h2>
            {[
              [
                "Timeline",
                "Recent posts from the community",
                "/timeline",
                "timeline",
              ],
              ["Code", "Build, share, and collaborate", "/code", "code"],
              ["Chat", "A room for conversations", "/chat", "chat"],
              [
                "Commons",
                "Threads, notes, and shared ideas",
                "/community",
                "commons",
              ],
            ]
              .filter(
                ([, , url]) =>
                  !site.enabled ||
                  site.enabled.includes(
                    (
                      {
                        "/timeline": "timeline",
                        "/code": "forge",
                        "/chat": "chat",
                        "/community": "commons",
                      } as Record<string, string>
                    )[url],
                  ),
              )
              .map(([name, desc, href, icon]) => (
                <Link href={href} className="corner-link" key={href}>
                  <Icon name={icon} size={26} />
                  <span>
                    <strong>{name}</strong>
                    <small>{desc}</small>
                  </span>
                  <Icon name="arrow" size={18} />
                </Link>
              ))}
          </div>
          <div className="content-panel home-commons">
            <h2>From the commons</h2>
            {threads.length ? (
              threads.slice(0, 2).map((thread) => (
                <Link
                  href={`/community/${thread.slug}`}
                  className="commons-preview"
                  key={thread.id}
                >
                  <Icon name="commons" />
                  <span>
                    <strong>{thread.title}</strong>
                    <small>
                      {thread.replies.length} replies · #{thread.channel}
                    </small>
                  </span>
                </Link>
              ))
            ) : (
              <p>
                A shared notebook, waiting for its first page.{" "}
                <Link href="/community">Visit the commons</Link>.
              </p>
            )}
          </div>
        </aside>
      </main>
      <Footer title={site.title} repositoryUrl={site.repositoryUrl} />
    </>
  );
}
