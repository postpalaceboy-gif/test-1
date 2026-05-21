import { createFileRoute } from "@tanstack/react-router";
import { UploadPanel } from "@/components/UploadPanel";
import { PasswordGate } from "@/components/PasswordGate";

export const Route = createFileRoute("/editor")({
  head: () => ({
    meta: [
      { title: "Editor Panel — Library Readers Association" },
      { name: "description", content: "Editors upload imagery for Poya days and Special days." },
      { property: "og:title", content: "Editor Panel — LRA" },
      { property: "og:description", content: "Upload images for the day." },
    ],
  }),
  component: EditorPage,
});

function EditorPage() {
  return (
    <PasswordGate
      storageKey="lra-editor-unlocked"
      password="mrclraediter"
      title="Editor Panel"
      description="Enter the editor password to continue."
    >
    <div className="mx-auto max-w-3xl px-6 py-16">
      <p className="text-xs uppercase tracking-widest text-primary">Editor Panel</p>
      <h1 className="mt-2 font-serif text-4xl">Upload an image for the day</h1>
      <p className="mt-3 text-muted-foreground">
        Choose between Special day and Poya day, pick the occasion, and upload your artwork.
        Files are saved to the Association's Google Drive.
      </p>
      <div className="mt-10">
        <UploadPanel mode="image" accent="bg-primary text-primary-foreground hover:bg-primary/90" />
      </div>
    </div>
    </PasswordGate>
  );
}