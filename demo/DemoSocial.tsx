"use client";
import { useState, useEffect, type FormEvent } from "react";
import Link from "next/link";
import { Neighborhood } from "../components/shell/CommunityShell";
import { Avatar } from "../components/ui/Avatar";
import { Icon } from "../components/ui/Icon";
import type { FeedItem } from "../lib/types";
import { demoThreads } from "./data";
import { asset } from "../lib/assets";
export const people = [
  { handle: "ira", name: "Ira", avatar: 0 },
  { handle: "juniper", name: "Juniper", avatar: 1 },
  { handle: "mari", name: "Mari", avatar: 2 },
];
export function DemoSidebar({
  following,
  onFollow,
}: {
  following: string[];
  onFollow: (handle: string) => void;
}) {
  const [query, setQuery] = useState("");
  return (
    <Neighborhood
      search={
        <label className="search-field">
          <Icon name="search" size={18} />
          <input
            aria-label="Search demo people"
            type="search"
            placeholder="Search moss"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </label>
      }
    >
      <section className="sidebar-section">
        <h3>People around here</h3>
        {people
          .filter((person) => person.handle.includes(query.toLowerCase()))
          .map((person) => (
            <div className="person-row" key={person.handle}>
              <Link className="person-info" href={"/people/" + person.handle}>
                <Avatar
                  handle={person.handle}
                  index={person.avatar}
                  size={40}
                />
                <span>
                  <strong>{person.name}</strong>
                  <small>@{person.handle}.moss</small>
                </span>
              </Link>
              <button
                type="button"
                className="follow-button"
                aria-pressed={following.includes(person.handle)}
                onClick={() => onFollow(person.handle)}
              >
                {following.includes(person.handle) ? "Following" : "Follow"}
              </button>
            </div>
          ))}
        {query &&
          !people.some((p) => p.handle.includes(query.toLowerCase())) && (
            <p>No matching neighbors.</p>
          )}
      </section>
      <section className="sidebar-section">
        <h3>From the commons</h3>
        {demoThreads.slice(1).map((thread) => (
          <Link
            className="commons-preview"
            href={"/community/" + thread.slug}
            key={thread.id}
          >
            <Icon name="chat" size={18} />
            <span>
              <strong>{thread.title}</strong>
              <small>
                {thread.replies.length} replies · example discussion
              </small>
            </span>
          </Link>
        ))}
      </section>
    </Neighborhood>
  );
}
type State = {
  liked: boolean;
  reposted: boolean;
  bookmarked: boolean;
  replies: string[];
};
const empty: State = {
  liked: false,
  reposted: false,
  bookmarked: false,
  replies: [],
};
export function DemoPostActions({ item }: { item: FeedItem }) {
  const [state, setState] = useState<State>(empty);
  const [replying, setReplying] = useState(false);
  const [status, setStatus] = useState("");
  useEffect(() => {
    try {
      setState(
        JSON.parse(
          sessionStorage.getItem("moss-demo-action-" + item.id) || "null",
        ) || empty,
      );
    } catch {}
  }, [item.id]);
  function save(next: State) {
    setState(next);
    try {
      sessionStorage.setItem(
        "moss-demo-action-" + item.id,
        JSON.stringify(next),
      );
      dispatchEvent(new Event("moss-demo-actions"));
    } catch {
      setStatus("This browser could not save the demo interaction.");
    }
  }
  function reply(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const body = String(new FormData(form).get("body") || "").trim();
    if (!body) return;
    save({ ...state, replies: [...state.replies, body] });
    form.reset();
    setReplying(false);
  }
  return (
    <>
      <div className="post-actions">
        <button
          aria-label="Reply in demo"
          aria-expanded={replying}
          onClick={() => setReplying(!replying)}
        >
          <Icon name="chat" size={18} />
          {state.replies.length}
        </button>
        <button
          aria-label="Repost in demo"
          aria-pressed={state.reposted}
          onClick={() => save({ ...state, reposted: !state.reposted })}
        >
          <Icon name="repost" size={18} />
          {Number(state.reposted)}
        </button>
        <button
          aria-label="Like in demo"
          aria-pressed={state.liked}
          onClick={() => save({ ...state, liked: !state.liked })}
        >
          <Icon name="heart" size={18} />
          {Number(state.liked)}
        </button>
        <button
          aria-label="Bookmark in demo"
          aria-pressed={state.bookmarked}
          onClick={() => save({ ...state, bookmarked: !state.bookmarked })}
        >
          <Icon name="bookmark" size={18} />
        </button>
        <button
          aria-label="Copy demo post link"
          onClick={async () => {
            try {
              await navigator.clipboard.writeText(
                location.origin + asset(item.link),
              );
              setStatus("Link copied.");
            } catch {
              setStatus("Link: " + location.origin + asset(item.link));
            }
          }}
        >
          <Icon name="share" size={18} />
        </button>
      </div>
      {replying && (
        <form className="demo-reply" onSubmit={reply}>
          <label htmlFor={"reply-" + item.id}>Reply in this browser only</label>
          <textarea
            id={"reply-" + item.id}
            name="body"
            required
            maxLength={4000}
          />
          <button type="submit">Reply</button>
        </form>
      )}
      {state.replies.map((body, i) => (
        <p className="demo-local-reply" key={i}>
          <strong>@you</strong> {body}
        </p>
      ))}
      {status && (
        <p className="action-message" role="status">
          {status}
        </p>
      )}
    </>
  );
}
