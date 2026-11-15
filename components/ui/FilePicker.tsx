"use client";
import { useState } from "react";

export function FilePicker({
  id,
  name = "image",
  required = false,
}: {
  id: string;
  name?: string;
  required?: boolean;
}) {
  const [filename, setFilename] = useState("");
  return (
    <div className="file-picker">
      <span className="file-picker-button" aria-hidden="true">
        Choose image
      </span>
      <span className="file-picker-name" aria-live="polite">
        {filename || "No image selected"}
      </span>
      <input
        id={id}
        type="file"
        name={name}
        accept="image/png,image/jpeg,image/webp"
        required={required}
        aria-label="Choose image"
        onChange={(event) => setFilename(event.target.files?.[0]?.name || "")}
      />
    </div>
  );
}
