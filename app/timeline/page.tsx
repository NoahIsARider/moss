import type { Metadata } from "next";
import Link from "next/link";
import { MintFrame } from "@/components/shell/Frame";
import { PageHead } from "@/components/shell/PageParts";
import { getFeedItems, getRemoteFeedItems } from "@/lib/feed";
import { config } from "@/lib/config";
import { dateTime } from "@/lib/format";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Timeline"
};

function ItemLink({ href, children }: { href: string; children: React.ReactNode }) {
  if (href.startsWith("/")) {
    return <Link href={href}>{children}</Link>;
  }
  return (
    <a href={href} rel="noopener">
      {children}
    </a>
  );
}

export default async function TimelinePage() {
  const items = await getFeedItems();
  const remote = await getRemoteFeedItems();

  return (
    <MintFrame news="Timeline reads the commons, the code hub, and any feeds you add to MOSS_FEEDS.">
      <tr>
        <td colSpan={2}>
          <PageHead
            kicker="plugin: timeline"
            title="Timeline"
            lede="RSS and Atom from the circles around this instance, in one column. Fifteen minute cache, no tracking pixels, no account required."
          />
          <table className="list">
            <tbody>
              {items.length === 0 ? (
                <tr>
                  <td className="sub" colSpan={3}>
                    Nothing here yet. Add RSS or Atom addresses to <code>MOSS_FEEDS</code>, or start a thread in
                    the <Link href="/community">commons</Link>.
                  </td>
                </tr>
              ) : null}
              {items.map((item, index) => (
                <tr key={item.id} className={index % 2 ? "alt" : ""}>
                  <td className="stamp">{dateTime(item.publishedAt).slice(5, 16)}</td>
                  <td>
                    <span className="title">
                      <ItemLink href={item.link}>{item.title}</ItemLink>
                    </span>
                    <span className="sub">
                      {item.author} &middot; {item.summary}
                    </span>
                  </td>
                  <td className="tag">{item.source}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="panel">
            <h3>Sources on this instance</h3>
            <p className="mono">
              commons &middot; code &middot; {config.domain}/feed.xml
              {config.feeds.length > 0
                ? ` · ${config.feeds.length} extra feed${config.feeds.length === 1 ? "" : "s"} (${remote.length} items read)`
                : " · no extra feeds configured"}
            </p>
          </div>

          <p className="mono">
            <a href="/feed.xml">RSS 2.0</a> &middot; <Link href="/docs#timeline">how to add a feed</Link>{" "}
            &middot; <Link href="/community">threads behind the items</Link>
          </p>
        </td>
      </tr>
    </MintFrame>
  );
}
