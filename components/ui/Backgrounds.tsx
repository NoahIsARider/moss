"use client";
import { useEffect, useState, type ReactNode } from "react";
import { backgrounds, defaultBackground } from "@/lib/backgrounds";
import { asset } from "@/lib/assets";
import Link from "next/link";
function read() {
  try {
    return (
      backgrounds.find(
        (b) => b.id === localStorage.getItem("moss-background"),
      ) || defaultBackground()
    );
  } catch {
    return defaultBackground();
  }
}
export function HomeHero({ children }: { children: ReactNode }) {
  const [background, setBackground] = useState(defaultBackground);
  useEffect(() => {
    setBackground(read());
    const update = () => setBackground(read());
    addEventListener("storage", update);
    addEventListener("moss-appearance", update);
    return () => {
      removeEventListener("storage", update);
      removeEventListener("moss-appearance", update);
    };
  }, []);
  return (
    <section
      className="home-hero"
      style={{ backgroundImage: `url("${asset(background.src)}")` }}
      aria-label={background.name}
    >
      {children}
      <Link className="change-scene" href="/appearance">
        Change scenery
      </Link>
    </section>
  );
}
export function BackgroundPicker() {
  const [selected, setSelected] = useState(defaultBackground);
  const [status, setStatus] = useState("");
  useEffect(() => setSelected(read()), []);
  function choose(id: string) {
    const bg = backgrounds.find((b) => b.id === id)!;
    setSelected(bg);
    try {
      localStorage.setItem("moss-background", id);
      dispatchEvent(new Event("moss-appearance"));
      setStatus("Your scenery is saved for this browser.");
    } catch {
      setStatus(
        "This browser could not save your choice. Please allow local storage and try again.",
      );
    }
  }
  return (
    <>
      <div className="background-grid">
        {backgrounds.map((bg) => (
          <button
            key={bg.id}
            type="button"
            className={
              "background-choice " + (selected.id === bg.id ? "selected" : "")
            }
            aria-pressed={selected.id === bg.id}
            onClick={() => choose(bg.id)}
          >
            <img src={asset(bg.src)} alt={bg.name} width={900} height={300} />
            <span>
              <strong>{bg.name}</strong>
              <small>{bg.description}</small>
            </span>
            {selected.id === bg.id && <b>Selected</b>}
          </button>
        ))}
      </div>
      <p role="status" className="appearance-status">
        {status || "Choose a scene for your home page."}
      </p>
      <Link className="button" href="/">
        Back to the neighborhood
      </Link>
    </>
  );
}
