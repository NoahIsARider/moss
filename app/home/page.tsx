import type { Metadata } from "next";
import Link from "next/link";
import { logout } from "@/app/actions/auth";
import { MintFrame } from "@/components/shell/Frame";
import { PageHead } from "@/components/shell/PageParts";
import { currentUser } from "@/lib/auth";
import { dateTime } from "@/lib/format";
import { readStore } from "@/lib/store";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Account"
};

export default async function AccountPage() {
  const user = await currentUser();
  const store = await readStore();
  const record = user ? store.users.find((entry) => entry.id === user.id) : undefined;
  const mine = user ? store.threads.filter((thread) => thread.authorHandle === user.handle) : [];
  const replies = user
    ? store.threads.flatMap((thread) => thread.replies).filter((reply) => reply.authorHandle === user.handle)
    : [];

  return (
    <MintFrame news="Account pages list what you wrote, not what an algorithm thinks you should see.">
      <tr>
        <td colSpan={2}>
          {!user ? (
            <>
              <PageHead kicker="account" title="Not signed in" lede="Reading is open. Writing needs a handle." />
              <div className="notice">
                <Link href="/login">Sign in</Link> or <Link href="/join">create a handle</Link>.
              </div>
            </>
          ) : (
            <>
              <PageHead
                kicker="account"
                title={`@${user.handle}`}
                lede={record ? `On this instance since ${dateTime(record.createdAt)}. ${mine.length} threads, ${replies.length} replies.` : undefined}
              />
              <table className="list">
                <tbody>
                  <tr>
                    <td className="stamp">handle</td>
                    <td>@{user.handle}</td>
                  </tr>
                  <tr className="alt">
                    <td className="stamp">threads</td>
                    <td>
                      {mine.length === 0 ? (
                        <span className="mono">none yet</span>
                      ) : (
                        mine.map((thread) => (
                          <span key={thread.id}>
                            <Link href={`/community/${thread.slug}`}>{thread.title}</Link>
                            <br />
                          </span>
                        ))
                      )}
                    </td>
                  </tr>
                  <tr>
                    <td className="stamp">replies</td>
                    <td>{replies.length === 0 ? <span className="mono">none yet</span> : `${replies.length} replies across the commons`}</td>
                  </tr>
                  <tr className="alt">
                    <td className="stamp">plugins</td>
                    <td>
                      <Link href="/timeline">timeline</Link> &middot; <Link href="/chat">chat</Link> &middot;{" "}
                      <Link href="/community">commons</Link> &middot; <Link href="/code">code</Link>
                    </td>
                  </tr>
                </tbody>
              </table>
              <form action={logout} className="mint-form" style={{ marginTop: 8 }}>
                <button type="submit">sign out</button>
              </form>
            </>
          )}
        </td>
      </tr>
    </MintFrame>
  );
}
