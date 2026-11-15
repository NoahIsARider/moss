"use client";
import { useState } from "react";
import { Icon } from "@/components/ui/Icon";
import Link from "next/link";
export type SocialState = {
  likes: number;
  reposts: number;
  replies: number;
  liked: boolean;
  reposted: boolean;
  bookmarked: boolean;
};
export function PostActions({
  id,
  initial,
}: {
  id: string;
  initial: SocialState;
}) {
  const [state, setState] = useState(initial);
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);
  async function act(action: string) {
    setBusy(true);
    try {
      const response = await fetch("/api/social", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ action, id }),
      });
      if (response.status === 401) {
        location.href = "/login";
        return;
      }
      if (!response.ok) throw new Error();
      setState(await response.json());
      setMessage("");
    } catch {
      setMessage("Could not save that change. Please try again.");
    } finally {
      setBusy(false);
    }
  }
  return (
    <>
      <div className="post-actions">
        <Link
          href={`/post/${id}#replies`}
          aria-label={`Reply, ${state.replies} replies`}
        >
          <Icon name="chat" size={18} />
          <span>{state.replies}</span>
        </Link>
        <button
          type="button"
          disabled={busy}
          onClick={() => act("repost")}
          aria-label="Repost"
          aria-pressed={state.reposted}
        >
          <Icon name="repost" size={18} />
          <span>{state.reposts}</span>
        </button>
        <button
          type="button"
          disabled={busy}
          onClick={() => act("like")}
          aria-label="Like"
          aria-pressed={state.liked}
        >
          <Icon name="heart" size={18} />
          <span>{state.likes}</span>
        </button>
        <button
          type="button"
          disabled={busy}
          onClick={() => act("bookmark")}
          aria-label="Bookmark"
          aria-pressed={state.bookmarked}
        >
          <Icon name="bookmark" size={18} />
        </button>
        <button
          type="button"
          aria-label="Copy post link"
          onClick={async () => {
            try {
              await navigator.clipboard.writeText(
                location.origin + "/post/" + id,
              );
              setMessage("Link copied.");
            } catch {
              setMessage("Copy this link: " + location.origin + "/post/" + id);
            }
          }}
        >
          <Icon name="share" size={18} />
        </button>
      </div>
      {message && (
        <p className="action-message" role="status">
          {message}
        </p>
      )}
    </>
  );
}
export function FollowButton({
  handle,
  initial = false,
}: {
  handle: string;
  initial?: boolean;
}) {
  const [following, setFollowing] = useState(initial);
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);
  return (
    <>
      <button
        type="button"
        className="follow-button"
        disabled={busy}
        aria-pressed={following}
        onClick={async () => {
          setBusy(true);
          try {
            const response = await fetch("/api/social", {
              method: "POST",
              headers: { "content-type": "application/json" },
              body: JSON.stringify({ action: "follow", handle }),
            });
            if (response.status === 401) {
              location.href = "/login";
              return;
            }
            if (!response.ok) throw new Error();
            const data = await response.json();
            setFollowing(data.following);
            setMessage("");
          } catch {
            setMessage("Could not update follow.");
          } finally {
            setBusy(false);
          }
        }}
      >
        {following ? "Following" : "Follow"}
      </button>
      {message && <span role="status">{message}</span>}
    </>
  );
}
