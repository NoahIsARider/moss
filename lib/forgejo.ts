import { config } from "./config";
import type { Repo } from "./types";

interface CacheEntry {
  at: number;
  repos: Repo[];
}

let cache: CacheEntry | null = null;
const CACHE_MS = 60 * 60 * 1000;

interface ForgejoRepo {
  name: string;
  owner?: { login?: string; username?: string };
  description?: string;
  language?: string;
  stars_count?: number;
  forks_count?: number;
  updated_at?: string;
  html_url?: string;
}

function mapRepo(repo: ForgejoRepo): Repo {
  return {
    owner:
      repo.owner?.login ?? repo.owner?.username ?? config.forge.owner ?? "moss",
    name: repo.name,
    description: repo.description || "No description yet.",
    language: repo.language || "Unknown",
    stars: repo.stars_count ?? 0,
    forks: repo.forks_count ?? 0,
    updatedAt: repo.updated_at ?? new Date().toISOString(),
    url: repo.html_url ?? `${config.forge.baseUrl}/${repo.name}`,
  };
}

export async function listRepos(): Promise<Repo[]> {
  const { baseUrl, token } = config.forge;
  if (!baseUrl || !token) return [];
  if (cache && Date.now() - cache.at < CACHE_MS) return cache.repos;

  try {
    const response = await fetch(
      config.forge.owner
        ? `${baseUrl.replace(/\/$/, "")}/api/v1/users/${encodeURIComponent(config.forge.owner)}/repos?limit=50&sort=updated`
        : `${baseUrl.replace(/\/$/, "")}/api/v1/repos/search?limit=50&sort=updated`,
      {
        headers: {
          authorization: `token ${token}`,
          accept: "application/json",
        },
        signal: AbortSignal.timeout(4000),
        cache: "no-store",
      },
    );
    if (!response.ok) throw new Error(`forge returned ${response.status}`);
    const payload = (await response.json()) as
      { data?: ForgejoRepo[] } | ForgejoRepo[];
    const repos = (Array.isArray(payload) ? payload : (payload.data ?? [])).map(
      mapRepo,
    );
    if (repos.length === 0) return [];
    cache = { at: Date.now(), repos };
    return repos;
  } catch {
    return [];
  }
}

export function forgeIsLive(): boolean {
  return Boolean(config.forge.baseUrl && config.forge.token);
}
