import Link from "next/link";
import { CommunityShell } from "@/components/shell/CommunityShell";
export default function NotFound() {
  return (
    <CommunityShell>
      <div className="empty-state">
        <span className="eyebrow">404 · A little off the path</span>
        <h1>This corner isn't here.</h1>
        <p>The page may have moved, or the link took a wrong turn.</p>
        <Link href="/" className="button">
          Back to the neighborhood
        </Link>
      </div>
    </CommunityShell>
  );
}
