"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Icon } from "@/components/ui/Icon";
export function PeopleSearch() {
  const [query, setQuery] = useState("");
  const router = useRouter();
  return (
    <form
      className="search-field people-search"
      onSubmit={(e) => {
        e.preventDefault();
        router.push("/explore?q=" + encodeURIComponent(query));
      }}
    >
      <Icon name="search" size={18} />
      <input
        aria-label="Search moss"
        type="search"
        placeholder="Search moss"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      <button type="submit" aria-label="Search people">
        <Icon name="arrow" size={16} />
      </button>
    </form>
  );
}
