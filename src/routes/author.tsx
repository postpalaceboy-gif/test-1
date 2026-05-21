import { createFileRoute } from "@tanstack/react-router";
import { UploadPanel } from "@/components/UploadPanel";
import { PasswordGate } from "@/components/PasswordGate";

export const Route = createFileRoute("/author")({
  head: () => ({
    meta: [
      { title: "Author Panel — Library Readers Association" },
      { name: "description", content: "Authors upload captions for Poya days and Special days." },
      { property: "og:title", content: "Author Panel — LRA" },
      { property: "og:description", content: "Upload captions and reflections for the day." },
    ],
  }),
  component: AuthorPage,
});

function AuthorPage() {
  return (
    <PasswordGate
      storageKey="lra-author-unlocked"
      password="mrclrauthor"
      title="Author Panel"
      description="Enter the author password to continue."
    >
    <div className="mx-auto max-w-3xl px-6 py-16">
      <p className="text-xs uppercase tracking-widest text-primary">Author Panel</p>
      <h1 className="mt-2 font-serif text-4xl">Share a caption or reflection</h1>
      <p className="mt-3 text-muted-foreground">
        Choose between Special day and Poya day, pick the occasion, and write your words.
      </p>
      <div className="mt-10">
        <UploadPanel mode="text" accent="bg-accent text-accent-foreground hover:bg-accent/90" />
      </div>
    </div>
    </PasswordGate>
  );
}