import Link from "next/link";
import { LiveShell } from "@/components/shell/LiveShell";
import { ThreadList, Empty } from "@/components/ui/Views";
import { readStore } from "@/lib/store";
import { config } from "@/lib/config";
export const dynamic = "force-dynamic";
export const metadata = { title: "Commons" };
export default async function Community() {
  const store = await readStore();
  const threads = [...store.threads].sort(
    (a, b) => Date.parse(b.createdAt) - Date.parse(a.createdAt),
  );
  return (
    <LiveShell>
      <div className="view-heading">
        <div className="section-heading">
          <h1>Commons</h1>
          <Link href="/community/new" className="button">
            New thread
          </Link>
        </div>
        <p>Conversations worth keeping. Take your time.</p>
      </div>
      {threads.length ? (
        <ThreadList threads={threads} />
      ) : (
        <Empty title="A shared notebook">
          No threads yet.{" "}
          <Link href="/community/new">Leave the first page</Link> for someone to
          find.
        </Empty>
      )}
    </LiveShell>
  );
}
