import type { Metadata } from "next";
import Link from "next/link";
import { signup } from "@/app/actions/auth";
import { MintFrame } from "@/components/shell/Frame";
import { BackLink, PageHead } from "@/components/shell/PageParts";
import { currentUser } from "@/lib/auth";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Create a handle"
};

const MESSAGES: Record<string, string> = {
  handle: "A handle is 3 to 20 characters, lowercase letters, numbers or underscore.",
  email: "That email address does not look complete.",
  password: "A password needs at least 8 characters.",
  taken: "That handle or email is already on this instance."
};

export default async function JoinPage({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  const user = await currentUser();
  if (user) redirect("/home");
  const { error } = await searchParams;

  return (
    <MintFrame news="One handle covers every plugin. Accounts are local to this instance, nothing is federated automatically.">
      <tr>
        <td colSpan={2}>
          <BackLink />
          <PageHead
            kicker="account"
            title="Create a handle"
            lede="A handle is how the commons, the chat and the code hub know you. Email is only used for recovery on this instance."
          />
          {error && MESSAGES[error] ? <div className="notice error">{MESSAGES[error]}</div> : null}
          <form action={signup} className="mint-form">
            <table>
              <tbody>
                <tr>
                  <td width={120}>
                    <label htmlFor="handle">handle</label>
                  </td>
                  <td>
                    <input id="handle" type="text" name="handle" placeholder="juniper" maxLength={20} required />
                  </td>
                </tr>
                <tr>
                  <td>
                    <label htmlFor="email">email</label>
                  </td>
                  <td>
                    <input id="email" type="email" name="email" placeholder="you@somewhere" required />
                  </td>
                </tr>
                <tr>
                  <td>
                    <label htmlFor="password">password</label>
                  </td>
                  <td>
                    <input id="password" type="password" name="password" minLength={8} required />
                  </td>
                </tr>
                <tr>
                  <td />
                  <td>
                    <button type="submit">create handle</button>{" "}
                    <span className="hint">
                      already here? <Link href="/login">sign in</Link>
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </form>
          <p className="mono">
            No terms checkbox. The short version is in the <Link href="/docs#privacy">privacy note</Link>. Do not
            be cruel, do not scrape people, label the hard things.
          </p>
        </td>
      </tr>
    </MintFrame>
  );
}
