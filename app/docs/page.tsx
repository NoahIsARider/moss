import type { Metadata } from "next";
import Link from "next/link";
import { MintFrame } from "@/components/shell/Frame";
import { BackLink, PageHead } from "@/components/shell/PageParts";
import { config } from "@/lib/config";

export const metadata: Metadata = {
  title: "Documentation"
};

export default function DocsPage() {
  return (
    <MintFrame news="Documentation is one page on purpose. If you can read this, you can run the suite.">
      <tr>
        <td colSpan={2}>
          <BackLink />
          <PageHead
            kicker="documentation"
            title="Run your own instance"
            lede="The shell is one small Next.js app. Each plugin is a folder. The database is a JSON file until it isn't enough."
          />

          <h2 className="doc-h">1. Quick start</h2>
          <pre className="code">{`git clone ${config.repositoryUrl}
cd shell
cp .env.example .env
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
# put that value in MOSS_SECRET, then
npm install
npm run dev`}</pre>
          <p className="prose">
            The app listens on port 3000. The chat bridge is a separate process on port 8787. Neither needs a
            database server, a message queue, or a container orchestrator.
          </p>

          <h2 className="doc-h">2. Plugins</h2>
          <table className="list">
            <tbody>
              <tr>
                <td>
                  <span className="title">timeline</span>
                  <span className="sub">RSS and Atom aggregation with a fifteen minute cache.</span>
                </td>
              </tr>
              <tr className="alt">
                <td>
                  <span className="title">forge</span>
                  <span className="sub">Forgejo or Gitea read through the public API. Empty list until configured.</span>
                </td>
              </tr>
              <tr>
                <td>
                  <span className="title">chat</span>
                  <span className="sub">Server sent events in the page, WebSocket on the bridge, optional Matrix mirror.</span>
                </td>
              </tr>
              <tr className="alt">
                <td>
                  <span className="title">commons</span>
                  <span className="sub">Threads, replies, channels. No ranking, no votes.</span>
                </td>
              </tr>
            </tbody>
          </table>
          <p className="mono">
            These are the plugins that ship with the template. Switch them with
            MOSS_PLUGINS=timeline,forge,chat,commons. The sidebar, the home page and
            <Link href="/api/plugins">the manifest</Link> follow that list, and new plugins register in
            <code>lib/plugins.ts</code>.
          </p>

          <h2 className="doc-h" id="timeline">
            3. Adding feeds
          </h2>
          <p className="prose">
            Set <code>MOSS_FEEDS</code> to a comma separated list of RSS or Atom URLs. The parser keeps twenty
            items per source and never blocks a page render for more than four seconds. Results are merged with
            the commons threads into <Link href="/feed.xml">one RSS feed</Link>.
          </p>

          <h2 className="doc-h" id="forge">
            4. Reading a real forge
          </h2>
          <p className="prose">
            Point <code>FORGEJO_BASE_URL</code> at your instance, add a read-only token and an owner name. The
            code page then lists live repositories through <code>/api/v1/repos/search</code>. Without those
            values the list stays empty and the page tells you which keys are missing.
          </p>

          <h2 className="doc-h" id="chat">
            5. Chat and Matrix
          </h2>
          <pre className="code">{`npm run bridge
# then, from another client
wscat -c "ws://localhost:8787?as=juniper"`}</pre>
          <p className="prose">
            The bridge reads the same JSON store as the web app and broadcasts new messages to every socket.
            Set <code>MATRIX_HOMESERVER_URL</code>, <code>MATRIX_ACCESS_TOKEN</code> and <code>MATRIX_ROOM_ID</code>{" "}
            to mirror a Matrix room instead. The page prefers the room when it can reach it.
          </p>

          <h2 className="doc-h" id="federation">
            6. Federation surface
          </h2>
          <p className="prose">
            Every instance answers WebFinger for <code>acct:</code> handles, NodeInfo 2.1, a security.txt, and the
            shared RSS feed. There is no ActivityPub actor yet. The feed is the honest federation layer: it
            works in every reader and it does not pretend to be a social graph.
          </p>
          <p className="mono">
            <a href={`/.well-known/webfinger?resource=acct:relay@${config.domain}`}>webfinger</a> &middot;{" "}
            <a href="/nodeinfo/2.1">nodeinfo 2.1</a> &middot; <a href="/feed.xml">feed.xml</a> &middot;{" "}
            <a href="/api/plugins">plugin manifest</a>
          </p>

          <h2 className="doc-h" id="about">
            7. About
          </h2>
          <p className="prose">
            moss is a shell plus a shelf of plugins for small labs and independent circles. It is not a platform. It
            has no growth plan. The design deliberately follows the plain web that small community sites kept
            alive, adapted to a green palette and a slower pace.
          </p>

          <h2 className="doc-h" id="terms">
            8. Terms, briefly
          </h2>
          <p className="prose">
            Do not use this instance to harass people, scrape identities, or redistribute work you do not own.
            Content warnings are expected for the hard things. Moderators can remove a thread and will say why
            in #meta. There is no appeals council.
          </p>

          <h2 className="doc-h" id="privacy">
            9. Privacy
          </h2>
          <p className="prose">
            No analytics, no third party scripts, no advertising. The session cookie is signed and httpOnly.
            Email is stored so a handle can be recovered. IP addresses are not logged by the app. If you mirror
            a Matrix room, that homeserver has its own policy and its own logs.
          </p>

          <h2 className="doc-h" id="donate">
            10. Donate
          </h2>
          <p className="prose">
            Hosting is paid month to month by the people who run this instance. The costs are posted in the
            commons. If you want to help, ask in <Link href="/chat">the room</Link>. There is no subscription
            tier and no badge for paying.
          </p>

          <h2 className="doc-h" id="license">
            11. License
          </h2>
          <p className="prose">
            The shell, plugins, and deployment files are licensed under the ISC license. The Avara typeface is
            by Raphaël Bastide and contributors, released under the SIL Open Font License. The pixel avatar and
            the default badges ship with the template and may be replaced.
          </p>

          <h2 className="doc-h" id="customize">
            12. Make it yours
          </h2>
          <p className="prose">
            Every fork is meant to look like its own place. Set <code>MOSS_TITLE</code>, <code>MOSS_TAGLINE</code>,{" "}
            <code>MOSS_DOMAIN</code> and <code>MOSS_BASE_URL</code> before the first build. The banner is plain
            HTML, so the name and tagline follow those values without touching an image. <code>MOSS_NEWS</code>{" "}
            sets the news bar text. <code>MOSS_DEMO=1</code> loads the example content in{" "}
            <code>examples/demo-data.ts</code> for a local preview; a deployed instance starts with an empty store.
            Replace the pixel avatar
            in <code>public/assets/img/logo.svg</code> and the badges in <code>public/assets/badges/</code> when
            you want a different mark.
          </p>
        </td>
      </tr>
    </MintFrame>
  );
}
