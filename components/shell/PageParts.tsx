import Link from "next/link";
import type { ReactNode } from "react";

export function PageHead({
  kicker,
  title,
  lede
}: {
  kicker: string;
  title: string;
  lede?: string;
}) {
  return (
    <div className="page-head">
      <span className="kicker">{kicker}</span>
      <h2>{title}</h2>
      {lede ? <p className="lede">{lede}</p> : null}
    </div>
  );
}

export function BackLink({ href = "/", label = "back to the shell" }: { href?: string; label?: string }) {
  return (
    <div className="inner-nav">
      <Link href={href}>&larr; {label}</Link>
    </div>
  );
}

export function InnerShell({
  kicker,
  title,
  lede,
  children,
  news
}: {
  kicker: string;
  title: string;
  lede?: string;
  children: ReactNode;
  news?: string;
}) {
  return (
    <>
      <tr>
        <td colSpan={2}>
          <PageHead kicker={kicker} title={title} lede={lede} />
          {children}
        </td>
      </tr>
    </>
  );
}
