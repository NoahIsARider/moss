import { Header, Footer } from "@/components/shell/CommunityShell";
import { CodeExplorer } from "@/components/code/CodeExplorer";
import { config } from "@/lib/config";
import { listRepos, forgeIsLive } from "@/lib/forgejo";
import { enabledPlugins } from "@/lib/plugins";
export const dynamic = "force-dynamic";
export const metadata = { title: "Code" };
export default async function Code() {
  const repos = await listRepos();
  return (
    <>
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <Header
        site={{ title: config.title, enabled: [...enabledPlugins] }}
        code
      />
      <main id="main">
        <CodeExplorer repos={repos} configured={forgeIsLive()} />
      </main>
      <Footer title={config.title} repositoryUrl={config.repositoryUrl} />
    </>
  );
}
