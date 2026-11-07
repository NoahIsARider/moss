import type { Metadata } from "next";
import Link from "next/link";
import { config } from "@/lib/config";
import { forgeIsLive, listRepos } from "@/lib/forgejo";
import { number, timeAgo } from "@/lib/format";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Code"
};

function Octicon({ path, size = 16 }: { path: string; size?: number }) {
  return (
    <svg viewBox="0 0 16 16" aria-hidden="true" width={size} height={size} style={{ fill: "currentColor" }}>
      <path d={path} />
    </svg>
  );
}

const PERSON =
  "M10.561 8.073a6 6 0 0 1 3.432 5.142.75.75 0 1 1-1.498.07 4.5 4.5 0 0 0-8.99 0 .75.75 0 0 1-1.498-.07 6 6 0 0 1 3.431-5.142 3.999 3.999 0 1 1 5.123 0M10.5 5a2.5 2.5 0 1 0-5 0 2.5 2.5 0 0 0 5 0";
const SIGNIN =
  "M2 2.75C2 1.784 2.784 1 3.75 1h2.5a.75.75 0 0 1 0 1.5h-2.5a.25.25 0 0 0-.25.25v10.5c0 .138.112.25.25.25h2.5a.75.75 0 0 1 0 1.5h-2.5A1.75 1.75 0 0 1 2 13.25Zm6.56 4.5h5.69a.75.75 0 0 1 0 1.5H8.56l1.97 1.97a.749.749 0 0 1-.326 1.275.75.75 0 0 1-.734-.215L6.22 8.53a.75.75 0 0 1 0-1.06l3.25-3.25a.749.749 0 0 1 1.275.326.75.75 0 0 1-.215.734Z";
const GLOBE =
  "M8 0a8 8 0 1 1 0 16A8 8 0 0 1 8 0M5.78 8.75a9.64 9.64 0 0 0 1.363 4.177q.383.64.857 1.215c.245-.296.551-.705.857-1.215A9.64 9.64 0 0 0 10.22 8.75Zm4.44-1.5a9.64 9.64 0 0 0-1.363-4.177c-.307-.51-.612-.919-.857-1.215a10 10 0 0 0-.857 1.215A9.64 9.64 0 0 0 5.78 7.25Zm-5.944 1.5H1.543a6.51 6.51 0 0 0 4.666 5.5q-.184-.271-.352-.552c-.715-1.192-1.437-2.874-1.581-4.948m-2.733-1.5h2.733c.144-2.074.866-3.756 1.58-4.948q.18-.295.353-.552a6.51 6.51 0 0 0-4.666 5.5m10.181 1.5c-.144 2.074-.866 3.756-1.58 4.948q-.18.296-.353.552a6.51 6.51 0 0 0 4.666-5.5Zm2.733-1.5a6.51 6.51 0 0 0-4.666-5.5q.184.272.353.552c.714 1.192 1.436 2.874 1.58 4.948Z";

export default async function CodePage() {
  const repos = await listRepos();
  const live = forgeIsLive();

  return (
    <div className="gitea">
      <nav className="gitea-nav" aria-label="Navigation bar">
        <div className="side">
          <Link className="logo-link" href="/" aria-label="Home">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/assets/img/logo.svg" alt={config.title} width={30} height={30} />
          </Link>
          <Link href="/code">Explore</Link>
          <Link href="/docs#donate">Donate</Link>
          <Link href="/docs">Help</Link>
        </div>
        <div className="side">
          <Link href="/join">
            <Octicon path={PERSON} />
            <span>Register</span>
          </Link>
          <Link href="/login">
            <Octicon path={SIGNIN} />
            <span>Sign in</span>
          </Link>
        </div>
      </nav>

      <main className="home">
        <div className="gitea-hero">
          <div className="background" aria-hidden="true" />
          <div className="logo" aria-hidden="true">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/assets/img/logo.svg" alt="" width={220} height={220} />
          </div>
          <div className="text">
            <h2>Code hosting for your circle</h2>
            <p>
              Offering Git hosting, a shared feed, and a few quiet rooms. {config.title} is a
              place for small teams and independent labs to publish their work without renting an
              audience from anyone.
            </p>
          </div>
        </div>

        <div className="gitea-sellingpoints">
          <div className="sellingpoint">
            <h3>Community</h3>
            <p>
              This instance is run by a small collective that would rather keep a server warm than
              build another platform. No growth targets, no brand voice.
            </p>
          </div>
          <div className="sellingpoint">
            <h3>Comfy</h3>
            <p>
              No ads, no third party trackers, no third party cookies. The pages are deliberately
              plain, and they load on a phone from 2016 over one bar of signal.
            </p>
          </div>
          <div className="sellingpoint">
            <h3>Open Source</h3>
            <p>
              The shell, every plugin, and the deployment files are published under the ISC
              license. Copy the whole shape, run it on your own domain, and change what you do not
              like.
            </p>
          </div>
        </div>

        <div className="gitea-who">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/assets/img/logo.svg" width={96} height={96} alt="" aria-hidden="true" />
          <div className="text">
            <h2>by its maintainers</h2>
            <p>
              {config.title} is owned and operated by{" "}
              <Link href="/docs">the people who run this instance</Link>, making small things for
              the web since {config.established}.
            </p>
          </div>
        </div>

        <section className="gitea-section" id="repos">
          <h2>Explore repositories</h2>
          <div className="gitea-box">
            <div className="gitea-box-head">
              <span>{repos.length} public repositories</span>
              <span>{live ? "reading a live Forgejo" : "no forge configured"}</span>
            </div>
            {repos.length === 0 ? (
              <div className="gitea-repo">
                <div>
                  <div className="desc">
                    No repositories yet. Set <code>FORGEJO_BASE_URL</code>, <code>FORGEJO_TOKEN</code> and{" "}
                    <code>FORGEJO_OWNER</code> in <code>.env</code> to read from your own forge. The{" "}
                    <Link href="/docs#forge">setup notes</Link> cover the API token.
                  </div>
                </div>
              </div>
            ) : (
              repos.map((repo) => (
                <div className="gitea-repo" key={`${repo.owner}/${repo.name}`}>
                  <div>
                    <a className="name" href={repo.url}>
                      {repo.owner}/{repo.name}
                    </a>
                    <div className="desc">{repo.description}</div>
                  </div>
                  <div className="meta">
                    <span>{repo.language}</span>
                    <span>&#9733; {number(repo.stars)}</span>
                    <span>&#8916; {number(repo.forks)}</span>
                    <span>updated {timeAgo(repo.updatedAt)}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>
      </main>

      <footer className="gitea-footer">
        <div className="gitea-footer-inner">
          <div>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/assets/img/logo.svg" width={84} height={84} alt="" aria-hidden="true" />
          </div>
          <div>
            <b>{config.title}</b>
            <ul>
              <li>
                <Link href="/docs">Pages</Link>
              </li>
              <li>
                <Link href="/timeline">Timeline</Link>
              </li>
              <li>
                <Link href="/docs#about">About</Link>
              </li>
              <li>
                <Link href="/docs#terms">Terms</Link>
              </li>
              <li>
                <Link href="/docs#privacy">Privacy policy</Link>
              </li>
            </ul>
            <p>
              Ran by <Link href="/docs">its maintainers</Link>
            </p>
          </div>
          <div>
            <b>Forgejo</b>
            <ul>
              <li>
                <p>Version: 1.22</p>
              </li>
              <li>
                <Link href="/docs#forge">Source code</Link>
              </li>
              <li>
                <Link href="/nodeinfo/2.1">API</Link>
              </li>
            </ul>
          </div>
          <div>
            <Link className="gitea-button-badge" href="/">
              <span className="dot" />
              {config.title}
            </Link>
            <span className="gitea-box-head" style={{ background: "transparent", border: 0, padding: "0.4rem 0" }}>
              <Octicon path={GLOBE} />
              <span>English</span>
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}
