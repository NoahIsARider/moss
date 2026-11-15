import type { ReactNode } from "react";
import { LiveShell } from "./LiveShell";
export async function MintFrame({
  children,
}: {
  children: ReactNode;
  news?: string;
  showNews?: boolean;
}) {
  return (
    <LiveShell>
      <div className="mint-page">
        <table className="mint-frame">
          <tbody>{children}</tbody>
        </table>
      </div>
    </LiveShell>
  );
}
