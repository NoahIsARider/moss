import Link from "next/link";
import type { ReactNode } from "react";
import { config } from "@/lib/config";
import { enabledPlugins, serviceGroups } from "@/lib/plugins";

export const NEWS = config.news;

export function NewsBar({ text = NEWS }: { text?: string }) {
  const line = (
    <>
      <b>NEWS:</b> {text}
    </>
  );
  return (
    <div className="news" aria-label="News">
      <div className="news-track">
        <span>{line}</span>
        <span aria-hidden="true">{line}</span>
      </div>
    </div>
  );
}

export function SiteBanner() {
  return (
    <div
      className="mint-banner"
      role="img"
      aria-label={`${config.title} — ${config.tagline}`}
    >
      <div className="banner-moss" />
      <div className="banner-prism">
        <i />
        <i />
        <i />
        <i />
      </div>
      <div
        className="banner-word"
        style={config.title.length > 14 ? { fontSize: "24px" } : undefined}
      >
        {config.title}
      </div>
      <div className="banner-tag">{config.tagline}</div>
      <div className="banner-est">EST {config.established}</div>
    </div>
  );
}

export function MatrixBadge() {
  return (
    <Link className="matrix-badge" href="/chat" aria-label={`Open the ${config.title} chat room`}>
      <span className="matrix-left">
        <span className="matrix-grid" aria-hidden="true">
          <i />
          <i />
          <i />
          <i />
          <i />
          <i />
          <i />
          <i />
          <i />
        </span>
        matrix
      </span>
      <span className="matrix-right">
        <span className="matrix-room">chat:{config.title}</span>
        <span aria-hidden="true">&rarr;</span>
      </span>
    </Link>
  );
}

export function ServiceColumn() {
  return (
    <table width="100%" cellPadding={3} cellSpacing={0}>
      <tbody>
        {serviceGroups.map((group) => {
          const items = group.items.filter((item) => !item.plugin || enabledPlugins.has(item.plugin));
          return [
            <tr key={`title-${group.title}`}>
              <td colSpan={2} className="row">
                <small className="side-title">{group.title}</small>
              </td>
            </tr>,
            ...items.map((item) => (
              <tr key={item.href}>
                <td width={18} className="side-icon">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={`/assets/icons/${item.icon}.svg`} alt="" width={16} height={16} />
                </td>
                <td className="row">
                  <Link href={item.href} title={item.title}>
                    {item.label}
                    {item.flag ? ` [${item.flag}]` : ""}
                  </Link>
                </td>
              </tr>
            ))
          ];
        })}
      </tbody>
    </table>
  );
}

export function SiteFooter() {
  return (
    <div className="site-footer">
      Emblem, icons, and the default badges ship with the moss template.
      <br />
      Runs on Next.js, Forgejo, Matrix, and one JSON file per instance.
      <br />
      <span id="copy">&copy;</span> {new Date().getFullYear()} {config.title}. Licensed under the{" "}
      <Link href="/docs#license">ISC license</Link>.
    </div>
  );
}

export function BadgeRow() {
  return (
    <div className="badges">
      <table>
        <tbody>
          <tr>
            <td>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/assets/badges/together.svg" alt="Made together" width={88} height={31} />
            </td>
            <td>
              <a href="https://yesterweb.org/no-to-web3">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/assets/badges/noweb3.png" alt="Keep the web free, say no to Web3" width={88} height={31} />
              </a>
            </td>
            <td>
              <Link href="/docs">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/assets/badges/selfhost.svg" alt="Self hosted, run your own" width={88} height={31} />
              </Link>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

export function MintFrame({
  children,
  news,
  showNews = true
}: {
  children: ReactNode;
  news?: string;
  showNews?: boolean;
}) {
  return (
    <div className="mint-page">
      <table className="mint-frame" bgcolor="#1b241d" cellPadding={3} cellSpacing={0}>
        <colgroup>
          <col width={174} />
          <col width={426} />
        </colgroup>
        <tbody>
          <tr>
            <td colSpan={2}>
              <SiteBanner />
            </td>
          </tr>
          {showNews ? (
            <tr>
              <td colSpan={2}>
                <NewsBar text={news} />
              </td>
            </tr>
          ) : null}
          {children}
          <tr>
            <td colSpan={2}>
              <SiteFooter />
            </td>
          </tr>
          <tr>
            <td colSpan={2}>
              <BadgeRow />
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
