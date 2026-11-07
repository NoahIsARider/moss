import type { Metadata } from "next";
import Link from "next/link";
import { createThread } from "@/app/actions/community";
import { MintFrame } from "@/components/shell/Frame";
import { BackLink, PageHead } from "@/components/shell/PageParts";
import { currentUser } from "@/lib/auth";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "New thread"
};

const MESSAGES: Record<string, string> = {
  title: "A title needs between 4 and 120 characters.",
  body: "A body needs at least 10 characters. Context helps the next reader.",
  channel: "Pick a channel."
};

export default async function NewThreadPage({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  const { error } = await searchParams;
  const user = await currentUser();

  return (
    <MintFrame news="New threads are open to any handle on this instance. No queue, no approval.">
      <tr>
        <td colSpan={2}>
          <BackLink href="/community" label="back to the commons" />
          <PageHead
            kicker="plugin: commons"
            title="New thread"
            lede="Write the thing you want to leave up. Markdown is limited to paragraphs, lists, links, bold and italic."
          />
          {!user ? (
            <div className="notice">
              You need a handle first. <Link href="/join">Create one</Link> or <Link href="/login">sign in</Link>.
            </div>
          ) : (
            <>
              {error && MESSAGES[error] ? <div className="notice error">{MESSAGES[error]}</div> : null}
              <form action={createThread} className="mint-form">
                <table>
                  <tbody>
                    <tr>
                      <td>
                        <label htmlFor="title">title</label>
                        <input id="title" type="text" name="title" maxLength={120} required />
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <label htmlFor="channel">channel</label>
                        <select id="channel" name="channel" defaultValue="workshop">
                          <option value="hello">#hello</option>
                          <option value="workshop">#workshop</option>
                          <option value="library">#library</option>
                          <option value="meta">#meta</option>
                        </select>
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <label htmlFor="body">body</label>
                        <textarea id="body" name="body" required />
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <button type="submit">post thread</button>{" "}
                        <span className="hint">posting as @{user.handle}</span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </form>
            </>
          )}
        </td>
      </tr>
    </MintFrame>
  );
}
