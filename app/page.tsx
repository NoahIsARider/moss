import { HomeView } from "@/components/ui/Views";
import { config } from "@/lib/config";
import { getFeedItems } from "@/lib/feed";
import { readStore } from "@/lib/store";
import { enabledPlugins } from "@/lib/plugins";
export const dynamic = "force-dynamic";
export default async function Home() {
  const [items, store] = await Promise.all([getFeedItems(), readStore()]);
  return (
    <HomeView
      site={{
        title: config.title,
        enabled: [...enabledPlugins],
        repositoryUrl: config.repositoryUrl,
      }}
      avatars={Object.fromEntries(
        store.users
          .filter((u) => u.avatar !== undefined)
          .map((u) => [u.handle, u.avatar!]),
      )}
      items={items}
      threads={[...store.threads].sort(
        (a, b) => Date.parse(b.createdAt) - Date.parse(a.createdAt),
      )}
    />
  );
}
