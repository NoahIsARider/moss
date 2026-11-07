import Link from "next/link";
import { MatrixBadge, MintFrame, ServiceColumn } from "@/components/shell/Frame";
import { config } from "@/lib/config";
import { flagDescription } from "@/lib/plugins";
import type { PluginFlag } from "@/lib/types";

export default function HomePage() {
  const flags: PluginFlag[] = ["E", "J", "S"];

  return (
    <MintFrame>
      <tr>
        <td valign="top" className="side">
          <ServiceColumn />
        </td>
        <td valign="top">
          <div className="welcome">
            <h2>
              <u>Welcome to {config.title}!</u>
            </h2>
            <MatrixBadge />
            <p>
              {config.title} is a small suite for labs and independent circles. Since{" "}
              {config.established}, it gives one handle across a feed reader, a code hub, a few
              live rooms, and a slow forum. The whole suite is open source, so another group can
              put the same shape on their own domain.
            </p>
            <table className="legend" cellPadding={2} cellSpacing={0}>
              <tbody>
                <tr>
                  <td>
                    <b>Id.</b>
                  </td>
                  <td>
                    <b>Description</b>
                  </td>
                </tr>
                {flags.map((flag) => (
                  <tr key={flag}>
                    <td>{flag}</td>
                    <td>{flagDescription(flag)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <p className="mono">
              <Link href="/join">Start a handle</Link> &middot; <Link href="/docs">Deploy the same shape</Link>{" "}
              &middot; <Link href="/feed.xml">Subscribe without an account</Link>
            </p>
          </div>
        </td>
      </tr>
    </MintFrame>
  );
}
