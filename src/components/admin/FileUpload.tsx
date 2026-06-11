"use client";

import { useRef, useState } from "react";
import { LuFileText, LuTrash2, LuUpload } from "react-icons/lu";

export function FileUpload({
  folder,
  value,
  onChange,
  accept,
  label,
}: {
  folder: "avatar" | "projects" | "cv";
  value: string;
  onChange: (url: string) => void;
  accept: string;
  label: string;
}) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setError(null);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("folder", folder);
      const res = await fetch("/api/upload", { method: "POST", body: formData });
      const json = await res.json();
      if (!res.ok) {
        setError(json.error ?? "Upload failed");
      } else {
        onChange(json.url);
      }
    } catch {
      setError("Upload failed — check your connection");
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  const isImage = value && !value.endsWith(".pdf");

  return (
    <div>
      {value &&
        (isImage ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={value}
            alt={label}
            className="mb-2 h-24 w-24 rounded-lg border border-scroll-bar object-cover"
          />
        ) : (
          <a
            href={value}
            target="_blank"
            rel="noreferrer"
            className="mb-2 inline-flex items-center gap-2 text-small text-first hover:underline"
          >
            <LuFileText /> Current file
          </a>
        ))}
      <div className="flex items-center gap-2">
        <label className="button cursor-pointer px-3 py-2 text-small">
          <LuUpload />
          {uploading ? "Uploading..." : `Upload ${label}`}
          <input
            ref={inputRef}
            type="file"
            accept={accept}
            onChange={handleFile}
            disabled={uploading}
            className="hidden"
          />
        </label>
        {value && (
          <button
            type="button"
            onClick={() => onChange("")}
            className="inline-flex cursor-pointer items-center gap-1 text-small text-red-500 hover:underline"
          >
            <LuTrash2 /> Remove
          </button>
        )}
      </div>
      {error && <p className="mt-1 text-smaller text-red-500">{error}</p>}
    </div>
  );
}
