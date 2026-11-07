"use client";

import { useEffect, useRef, useState } from "react";
import type { ChatMessage } from "@/lib/types";

function clock(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "--:--";
  return date.toISOString().slice(11, 16);
}

export function ChatRoom({ initial, viewer }: { initial: ChatMessage[]; viewer: string | null }) {
  const [messages, setMessages] = useState<ChatMessage[]>(initial);
  const [pending, setPending] = useState<string[]>([]);
  const [status, setStatus] = useState("connecting");
  const logRef = useRef<HTMLDivElement>(null);
  const listEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const source = new EventSource("/api/chat/stream");
    source.onopen = () => setStatus("live");
    source.onerror = () => setStatus("reconnecting");
    source.onmessage = (event) => {
      try {
        const incoming = JSON.parse(event.data) as ChatMessage;
        setMessages((current) => {
          if (current.some((message) => message.id === incoming.id)) return current;
          return [...current, incoming].slice(-60);
        });
      } catch {
        setStatus("reconnecting");
      }
    };
    return () => source.close();
  }, []);

  useEffect(() => {
    listEndRef.current?.scrollIntoView({ block: "nearest" });
  }, [messages.length]);

  async function send(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!viewer) return;
    const form = event.currentTarget;
    const input = form.elements.namedItem("body") as HTMLInputElement | null;
    const body = input?.value.trim() ?? "";
    if (!body) return;
    setPending((current) => [...current, body]);
    if (input) input.value = "";
    try {
      const response = await fetch("/api/chat/messages", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ body })
      });
      if (!response.ok) throw new Error("send failed");
      const saved = (await response.json()) as ChatMessage;
      setMessages((current) => (current.some((message) => message.id === saved.id) ? current : [...current, saved]));
    } catch {
      if (input) input.value = body;
    } finally {
      setPending((current) => current.slice(1));
    }
  }

  return (
    <div>
      <div className="chat-log" ref={logRef} aria-live="polite">
        {messages.length === 0 && pending.length === 0 ? (
          <div className="chat-line">
            <span className="what">No messages yet. The room is empty until someone speaks.</span>
          </div>
        ) : null}
        {messages.map((message) => (
          <div className="chat-line" key={message.id}>
            <span className="when">{clock(message.createdAt)}</span>
            <span className="who">{message.author}</span>
            <span className="what">{message.body}</span>
          </div>
        ))}
        {pending.map((body, index) => (
          <div className="chat-line pending" key={`pending-${index}`}>
            <span className="when">now</span>
            <span className="who">{viewer}</span>
            <span className="what">{body}</span>
          </div>
        ))}
        <div ref={listEndRef} />
      </div>
      <div className="chat-status">
        {status === "live" ? "connected" : status} &middot; {messages.length} messages in the buffer
      </div>
      {viewer ? (
        <form className="chat-form" onSubmit={send}>
          <input type="text" name="body" maxLength={2000} placeholder={`say something as ${viewer}`} autoComplete="off" />
          <button type="submit">send</button>
        </form>
      ) : (
        <div className="notice">
          Read-only for guests. <a href="/login">Sign in</a> or <a href="/join">create a handle</a> to talk.
        </div>
      )}
    </div>
  );
}
