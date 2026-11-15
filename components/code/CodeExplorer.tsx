"use client";
import Link from "next/link";
import { useMemo, useState } from "react";
import type { Repo } from "@/lib/types";
import { Icon } from "@/components/ui/Icon";
import { Empty } from "@/components/ui/Views";
export function CodeExplorer({
  repos,
  configured,
}: {
  repos: Repo[];
  configured: boolean;
}) {
  const [query, setQuery] = useState("");
  const [language, setLanguage] = useState("");
  const [sort, setSort] = useState("updated");
  const languages = [...new Set(repos.map((repo) => repo.language))].sort();
  const filtered = useMemo(
    () =>
      repos
        .filter(
          (repo) =>
            (!language || repo.language === language) &&
            `${repo.owner}/${repo.name} ${repo.description}`
              .toLowerCase()
              .includes(query.toLowerCase()),
        )
        .sort((a, b) =>
          sort === "stars"
            ? b.stars - a.stars
            : Date.parse(b.updatedAt) - Date.parse(a.updatedAt),
        ),
    [repos, query, language, sort],
  );
  return (
    <div className="forge-layout">
      <aside className="forge-sidebar">
        <span className="eyebrow">Explore</span>
        <div className="forge-selected">
          <Icon name="repo" />
          Repositories
        </div>
        <h3>Filter by language</h3>
        <button
          className={!language ? "filter active" : "filter"}
          onClick={() => setLanguage("")}
        >
          All languages <span>{repos.length}</span>
        </button>
        {languages.map((lang) => (
          <button
            key={lang}
            className={language === lang ? "filter active" : "filter"}
            onClick={() => setLanguage(lang)}
          >
            {lang}
            <span>{repos.filter((repo) => repo.language === lang).length}</span>
          </button>
        ))}
        <p className="forge-tip">
          Small projects.
          <br />
          Shared possibilities.
        </p>
      </aside>
      <section className="forge-results">
        <div className="section-heading">
          <div>
            <span className="eyebrow">Made around here</span>
            <h1>Explore repositories</h1>
            <p>Code and small projects from the neighborhood.</p>
          </div>
        </div>
        <div className="repo-controls">
          <label className="search-field">
            <Icon name="search" size={20} />
            <input
              type="search"
              aria-label="Search repositories"
              placeholder="Search repositories..."
              value={query}
              onChange={(event) => setQuery(event.target.value)}
            />
          </label>
          <select
            aria-label="Sort repositories"
            value={sort}
            onChange={(e) => setSort(e.target.value)}
          >
            <option value="updated">Recently updated</option>
            <option value="stars">Most stars</option>
          </select>
        </div>
        <div className="repo-count" aria-live="polite">
          {filtered.length}{" "}
          {filtered.length === 1 ? "repository" : "repositories"}
          {language && ` · ${language}`}
        </div>
        {filtered.map((repo) => (
          <article className="repo-row" key={`${repo.owner}/${repo.name}`}>
            <Icon name="repo" />
            <div className="repo-info">
              <h2>
                <a href={repo.url}>
                  {repo.owner} <span>/</span> {repo.name}
                </a>
              </h2>
              <p>{repo.description}</p>
              <div className="repo-metadata">
                <span>
                  <i
                    className={
                      "language-dot lang-" + repo.language.toLowerCase()
                    }
                  />
                  {repo.language}
                </span>
                <span>
                  <Icon name="star" size={15} />
                  {repo.stars}
                </span>
                <span>
                  <Icon name="fork" size={15} />
                  {repo.forks}
                </span>
                <time dateTime={repo.updatedAt}>
                  Updated{" "}
                  {new Date(repo.updatedAt).toLocaleDateString("en", {
                    month: "short",
                    day: "numeric",
                    timeZone: "UTC",
                  })}
                </time>
              </div>
            </div>
            <a
              className="repo-open"
              href={repo.url}
              aria-label={`Open ${repo.owner}/${repo.name}`}
            >
              <Icon name="arrow" size={19} />
            </a>
          </article>
        ))}
        {!filtered.length && (
          <Empty
            title={
              repos.length ? "No matching repositories" : "No repositories yet"
            }
          >
            {repos.length
              ? "Try another search or language."
              : configured
                ? "No repositories are available from this forge right now."
                : "Connect your forge to share the things you build here."}
          </Empty>
        )}
      </section>
      <aside className="forge-about">
        <h2>About this forge</h2>
        <p>A place for useful tools, experiments, and work made together.</p>
        <Link href="/docs#forge">
          Forge setup notes <Icon name="arrow" size={16} />
        </Link>
        <hr />
        <p>
          Open source.
          <br />
          Independently hosted.
          <br />A little closer to home.
        </p>
      </aside>
    </div>
  );
}
