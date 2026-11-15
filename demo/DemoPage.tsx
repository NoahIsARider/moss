"use client";
import { useState, useEffect, type FormEvent } from "react";
import Link from "next/link";
import {
  CommunityShell,
  Header,
  Footer,
} from "../components/shell/CommunityShell";
import { HomeView, FeedList, ThreadList } from "../components/ui/Views";
import { DemoSidebar, DemoPostActions, people } from "./DemoSocial";
import { Avatar } from "../components/ui/Avatar";
import { AvatarOptions } from "../components/ui/AvatarPicker";
import { BackgroundPicker } from "../components/ui/Backgrounds";
import { CodeExplorer } from "../components/code/CodeExplorer";
import { asset } from "../lib/assets";
import { demoFeed, demoRepos, demoThreads, demoChat } from "./data";
import type { FeedItem } from "../lib/types";
const site = {
  title: "moss",
  repositoryUrl: "https://github.com/NoahIsARider/moss",
};
export function DemoPage({ route }: { route: string }) {
  const [posts, setPosts] = useState<FeedItem[]>([]);
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState(demoChat);
  const [avatar, setAvatar] = useState(0);
  const [following, setFollowing] = useState<string[]>([]);
  const [tab, setTab] = useState("local");
  useEffect(() => {
    try {
      setFollowing(
        JSON.parse(sessionStorage.getItem("moss-demo-following") || "[]"),
      );
      setPosts(JSON.parse(sessionStorage.getItem("moss-demo-posts") || "[]"));
      setAvatar(Number(localStorage.getItem("moss-demo-avatar") || 0));
    } catch {}
  }, []);
  const all = [...posts, ...demoFeed];
  function follow(handle: string) {
    const next = following.includes(handle)
      ? following.filter((h) => h !== handle)
      : [...following, handle];
    setFollowing(next);
    try {
      sessionStorage.setItem("moss-demo-following", JSON.stringify(next));
    } catch {}
  }
  const shell = (children: React.ReactNode) => (
    <CommunityShell
      site={site}
      aside={<DemoSidebar following={following} onFollow={follow} />}
    >
      {children}
    </CommunityShell>
  );
  function post(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const body = String(new FormData(form).get("body") || "").trim();
    if (!body) return;
    const next = [
      {
        id: "demo-local-" + Date.now(),
        title: body.slice(0, 80),
        summary: body,
        author: "@you",
        source: "local",
        link: "/timeline",
        publishedAt: new Date().toISOString(),
        tags: [],
      },
      ...posts,
    ];
    setPosts(next);
    try {
      sessionStorage.setItem("moss-demo-posts", JSON.stringify(next));
    } catch {}
    form.reset();
    setMessage(
      "Posted in this browser's demo session. Nothing was sent to a server.",
    );
  }
  if (route === "explore")
    return shell(
      <>
        <div className="view-heading">
          <h1>Explore</h1>
          <p>
            Example people from the neighborhood. Search them in the sidebar.
          </p>
        </div>
        {people.map((person) => (
          <div className="directory-row" key={person.handle}>
            <Link className="person-info" href={"/people/" + person.handle}>
              <Avatar handle={person.handle} index={person.avatar} />
              <span>
                {person.name}
                <small>@{person.handle}.moss</small>
              </span>
            </Link>
            <button
              className="follow-button"
              aria-pressed={following.includes(person.handle)}
              onClick={() => follow(person.handle)}
            >
              {following.includes(person.handle) ? "Following" : "Follow"}
            </button>
          </div>
        ))}
      </>,
    );
  if (["notifications", "bookmarks"].includes(route))
    return shell(
      <div className="mint-page">
        <h1>{route[0].toUpperCase() + route.slice(1)}</h1>
        <p className="notice">
          The live template connects this page to real accounts and
          interactions. This public showcase does not have an account server.
        </p>
        <Link className="button" href="/timeline">
          Explore the example timeline
        </Link>
      </div>,
    );
  if (route.startsWith("people/")) {
    const handle = route.split("/")[1];
    return shell(
      <>
        <div className="profile-banner" />
        <div className="view-heading">
          <Avatar handle={handle} size={80} />
          <h1 style={{ marginTop: 12 }}>{handle}</h1>
          <p>@{handle} · Example profile</p>
        </div>
        <FeedList items={all.filter((item) => item.author === "@" + handle)} />
      </>,
    );
  }
  if (!route)
    return (
      <HomeView
        site={site}
        items={all.map((item) => ({ ...item, image: undefined }))}
        threads={demoThreads}
      />
    );
  if (route === "code")
    return (
      <>
        <Header site={site} code />
        <main id="main">
          <CodeExplorer
            repos={demoRepos.map((repo) => ({
              ...repo,
              url: asset(repo.url + "/"),
            }))}
            configured
          />
        </main>
        <Footer {...site} />
      </>
    );
  if (route === "timeline")
    return shell(
      <>
        <div className="view-heading">
          <h1>Timeline</h1>
          <p>Everyday things, from the people around here.</p>
        </div>
        <div className="feed-tabs" role="tablist" aria-label="Demo timelines">
          {["following", "local", "feeds"].map((value) => (
            <button
              role="tab"
              aria-selected={tab === value}
              className={tab === value ? "active" : ""}
              key={value}
              onClick={() => setTab(value)}
            >
              {value[0].toUpperCase() + value.slice(1)}
            </button>
          ))}
        </div>
        <form onSubmit={post} className="composer">
          <Avatar handle="you" index={avatar} />
          <div className="composer-body">
            <label htmlFor="demo-post">What's happening around you?</label>
            <textarea
              id="demo-post"
              name="body"
              maxLength={2000}
              required
              placeholder="A small thought, a good find, a hello..."
            />
            <div className="composer-foot">
              <span>Try posting · this browser only</span>
              <button type="submit">Post</button>
            </div>
          </div>
        </form>
        {message && (
          <p className="demo-toast" role="status">
            {message}
          </p>
        )}
        <FeedList
          renderActions={(item) => <DemoPostActions item={item} />}
          items={
            tab === "feeds"
              ? all.filter((p) => p.source === "code")
              : tab === "following"
                ? all.filter((p) =>
                    following.includes(p.author.replace(/^@/, "")),
                  )
                : all
          }
        />
      </>,
    );
  if (route === "community")
    return shell(
      <>
        <div className="view-heading">
          <div className="section-heading">
            <h1>Commons</h1>
            <Link href="/community/new" className="button">
              New thread
            </Link>
          </div>
          <p>Conversations worth keeping. Take your time.</p>
        </div>
        <ThreadList threads={demoThreads} />
      </>,
    );
  const thread = demoThreads.find((t) => route === "community/" + t.slug);
  if (thread)
    return shell(
      <div className="mint-page">
        <Link href="/community">← Back to the commons</Link>
        <div className="page-head">
          <span className="kicker">
            #{thread.channel} · @{thread.authorHandle}
          </span>
          <h1>{thread.title}</h1>
        </div>
        <p className="prose">{thread.body}</p>
        <h2 id="replies" className="doc-h">
          Replies
        </h2>
        {thread.replies.map((r) => (
          <div className="reply" key={r.id}>
            <Avatar handle={r.authorHandle} size={32} /> @{r.authorHandle}
            <p>{r.body}</p>
          </div>
        ))}
        <p className="notice">
          This is an example discussion. Try the timeline composer to add a
          browser-only demo post.
        </p>
        <Link className="button" href="/timeline">
          Try the timeline
        </Link>
      </div>,
    );
  if (route === "chat")
    return shell(
      <>
        <div className="view-heading">
          <h1>Chat</h1>
          <p>A room to stop by, say hello, and catch up.</p>
        </div>
        <div className="demo-chat">
          <p className="notice">
            Example room · messages you send stay on this page. No live server
            is connected.
          </p>
          <div className="chat-log" aria-live="polite">
            {chat.map((m) => (
              <div className="chat-line" key={m.id}>
                <span className="when">{m.createdAt.slice(11, 16)}</span>
                <span className="who">{m.author}</span>
                <span className="what">{m.body}</span>
              </div>
            ))}
          </div>
          <form
            className="chat-form"
            onSubmit={(event) => {
              event.preventDefault();
              const form = event.currentTarget;
              const body = String(new FormData(form).get("body") || "").trim();
              if (!body) return;
              setChat([
                ...chat,
                {
                  id: String(Date.now()),
                  author: "@you",
                  body,
                  createdAt: new Date().toISOString(),
                  transport: "moss",
                },
              ]);
              form.reset();
            }}
          >
            <input
              name="body"
              aria-label="Demo message"
              required
              maxLength={2000}
              placeholder="Say hello in this demo..."
            />
            <button type="submit">Send</button>
          </form>
        </div>
      </>,
    );
  if (route === "appearance")
    return shell(
      <>
        <div className="view-heading">
          <h1>A change of scenery</h1>
          <p>Same neighborhood feeling. A different little view.</p>
        </div>
        <div className="mint-page">
          <BackgroundPicker />
        </div>
      </>,
    );
  if (route === "avatars")
    return shell(
      <>
        <div className="view-heading">
          <h1>A face for your corner</h1>
          <p>Thirty-two hand-drawn neighbors.</p>
        </div>
        <form
          className="mint-page"
          onSubmit={(event) => {
            event.preventDefault();
            const value = Number(
              new FormData(event.currentTarget).get("avatar"),
            );
            setAvatar(value);
            try {
              localStorage.setItem("moss-demo-avatar", String(value));
              setMessage("Saved for this browser's demo.");
            } catch {
              setMessage("Your browser could not save this preference.");
            }
          }}
        >
          <AvatarOptions key={avatar} selected={avatar} />
          <button type="submit">Save demo avatar</button>
          <p role="status">{message}</p>
        </form>
      </>,
    );
  if (route.startsWith("repo/")) {
    const repo = demoRepos.find((r) => route === "repo/" + r.name)!;
    return shell(
      <div className="mint-page">
        <Link href="/code">← Repositories</Link>
        <div className="page-head">
          <span className="kicker">Example repository</span>
          <h1>
            {repo.owner} / {repo.name}
          </h1>
          <p>{repo.description}</p>
        </div>
        <p className="notice">
          This repository is illustrative. The real template reads repositories
          from your Forgejo instance.
        </p>
        <h2 className="doc-h">README.md</h2>
        <p>
          A small project from the moss neighborhood. Explore the real template
          for the application source, setup instructions, and deployment files.
        </p>
        <a href={site.repositoryUrl} className="button">
          View moss source ↗
        </a>
      </div>,
    );
  }
  if (["home", "login", "join", "community/new"].includes(route))
    return shell(
      <div className="mint-page">
        <div className="page-head">
          <h1>
            {route === "home"
              ? "Your corner"
              : route === "community/new"
                ? "Start a conversation"
                : "Make yourself at home"}
          </h1>
        </div>
        <p>
          This public showcase runs on GitHub Pages. Accounts and shared
          discussions need a running moss server.
        </p>
        <p className="notice">
          You can try a local post or chat message without creating an account.
        </p>
        <div className="inline-actions">
          <Link href="/timeline" className="button">
            Try a post
          </Link>
          <Link href="/chat" className="button secondary">
            Visit the room
          </Link>
        </div>
        <h2 className="doc-h">Make this corner yours</h2>
        <p>
          <Link href="/avatars">Choose a demo avatar</Link> ·{" "}
          <Link href="/appearance">Change scenery</Link>
        </p>
        <a href={site.repositoryUrl + "#getting-started"}>
          Set up your own moss ↗
        </a>
      </div>,
    );
  return shell(
    <div className="mint-page">
      <div className="page-head">
        <span className="kicker">An independent community</span>
        <h1>Make a little place of your own.</h1>
      </div>
      <p>
        moss brings a timeline, code hub, chat room, and a slow discussion space
        together on your own domain.
      </p>
      <h2 className="doc-h" id="about">
        About this demo
      </h2>
      <p>
        People, posts, repositories and counts in this showcase are examples.
        The production template starts empty and reads your actual data.
        Browser-only demo interactions do not create real accounts or send
        messages to other people.
      </p>
      <h2 className="doc-h" id="forge">
        Your code, your forge
      </h2>
      <p>
        Connect a Forgejo instance to show real repositories. Search, language
        filtering and sorting work with that data.
      </p>
      <h2 className="doc-h" id="timeline">
        Your timeline
      </h2>
      <p>
        Publish short posts, keep longer discussions in the commons, and bring
        RSS or Atom feeds into one readable place.
      </p>
      <h2 className="doc-h" id="terms">
        Community guidelines
      </h2>
      <p>
        Be considerate. Share work with permission. Leave room for people to
        disagree and take their time.
      </p>
      <h2 className="doc-h" id="privacy">
        Privacy
      </h2>
      <p>
        This demo uses browser storage only for your scenery choice, avatar
        choice and session posts. No account details are requested. GitHub
        serves these static pages.
      </p>
      <a href={site.repositoryUrl} className="button">
        Read the setup guide ↗
      </a>
    </div>,
  );
}
