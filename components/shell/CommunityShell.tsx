import Link from "next/link";
import type { ReactNode } from "react";
import { Brand, Navigation } from "./Navigation";
import { Icon } from "@/components/ui/Icon";
import { asset } from "@/lib/assets";
export type SiteIdentity = {
  title: string;
  enabled?: string[];
  repositoryUrl?: string;
  viewer?: { handle: string; avatar?: number; avatarUrl?: string };
};
export function Footer({
  title = "moss",
  repositoryUrl,
}: {
  title?: string;
  repositoryUrl?: string;
}) {
  return (
    <footer className="site-footer">
      <span>
        {title}{" "}
        <span className="footer-note">· An open, independent community.</span>
      </span>
      <div>
        <Link href="/docs">Docs</Link>
        <Link href="/docs#terms">Guidelines</Link>
        <Link href="/docs#privacy">Privacy</Link>
        {repositoryUrl && <a href={repositoryUrl}>Source</a>}
      </div>
    </footer>
  );
}
export function Header({
  site,
  code = false,
}: {
  site: SiteIdentity;
  code?: boolean;
}) {
  return (
    <header className="site-header">
      <div className="header-inner">
        <Brand title={site.title} code={code} />
        <Navigation title={site.title} mode="top" enabled={site.enabled} />
        <div className="header-auth">
          <Link href="/login" className="button secondary">
            Sign in
          </Link>
          <Link href="/join" className="button">
            Join {site.title}
          </Link>
        </div>
      </div>
    </header>
  );
}
export function Neighborhood({
  title = "moss",
  children,
  search,
}: {
  title?: string;
  children?: ReactNode;
  search?: ReactNode;
}) {
  return (
    <aside className="neighborhood">
      {search}
      <img
        className="neighborhood-art"
        src={asset("/assets/img/neighborhood.webp")}
        alt="Neighbors sharing zines and tending a rooftop garden"
        width={600}
        height={200}
      />
      <h2>Your neighborhood</h2>
      <p>A little room for everyday things. Make yourself at home.</p>
      <div className="text-links">
        <Link href="/docs#terms">Community guidelines</Link>
        <Link href="/docs#about">About {title}</Link>
      </div>

      {children}
      <div className="sidebar-foot">
        <Link href="/docs">Docs</Link>
        <Link href="/docs#privacy">Privacy</Link>
        <Link href="/avatars">Default avatars</Link>
        <Link href="/appearance">Appearance</Link>
      </div>
    </aside>
  );
}
export function CommunityShell({
  children,
  site = { title: "moss" },
  aside,
}: {
  children: ReactNode;
  site?: SiteIdentity;
  aside?: ReactNode;
}) {
  return (
    <>
      <a href="#main" className="skip-link">
        Skip to content
      </a>
      <div className="community-shell">
        <Navigation
          title={site.title}
          enabled={site.enabled}
          viewer={site.viewer}
        />
        <main id="main" className="community-main">
          {children}
        </main>
        {aside || <Neighborhood title={site.title} />}
      </div>
      <Footer title={site.title} repositoryUrl={site.repositoryUrl} />
    </>
  );
}
