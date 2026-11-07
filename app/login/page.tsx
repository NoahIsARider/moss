import type { Metadata } from "next";
import Link from "next/link";
import { login } from "@/app/actions/auth";
import { MintFrame } from "@/components/shell/Frame";
import { BackLink, PageHead } from "@/components/shell/PageParts";
import { currentUser } from "@/lib/auth";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Sign in"
};

const MESSAGES: Record<string, string> = {
  missing: "Both fields are needed.",
  bad: "That handle and password do not match anything here."
};

export default async function LoginPage({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  const user = await currentUser();
  if (user) redirect("/home");
  const { error } = await searchParams;

  return (
    <MintFrame news="Sessions are signed cookies, valid for 30 days. Signing out clears the cookie on this device.">
      <tr>
        <td colSpan={2}>
          <BackLink />
          <PageHead kicker="account" title="Sign in" lede="Use the handle or the email you signed up with." />
          {error && MESSAGES[error] ? <div className="notice error">{MESSAGES[error]}</div> : null}
          <form action={login} className="mint-form">
            <table>
              <tbody>
                <tr>
                  <td width={120}>
                    <label htmlFor="login">handle or email</label>
                  </td>
                  <td>
                    <input id="login" type="text" name="login" autoComplete="username" required />
                  </td>
                </tr>
                <tr>
                  <td>
                    <label htmlFor="password">password</label>
                  </td>
                  <td>
                    <input id="password" type="password" name="password" autoComplete="current-password" required />
                  </td>
                </tr>
                <tr>
                  <td />
                  <td>
                    <button type="submit">sign in</button>{" "}
                    <span className="hint">
                      no handle yet? <Link href="/join">create one</Link>
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </form>
        </td>
      </tr>
    </MintFrame>
  );
}
