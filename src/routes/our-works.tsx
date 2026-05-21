import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Download, Eye, FileText, ImageIcon, Loader2 } from "lucide-react";
import { listEntries } from "@/lib/drive.functions";
import type { TaskCategory, ContentKind } from "@/lib/tasks";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export const Route = createFileRoute("/our-works")({
  head: () => ({
    meta: [
      { title: "Our Works — Library Readers Association" },
      { name: "description", content: "Read and download editors' images and authors' captions for Poya and Special days." },
      { property: "og:title", content: "Our Works — LRA" },
      { property: "og:description", content: "Browse and download member contributions." },
    ],
  }),
  component: OurWorksPage,
});

interface DriveFile { id: string; name: string; mimeType: string; modifiedTime: string }

function useEntries(category: TaskCategory, kind: ContentKind) {
  const list = useServerFn(listEntries);
  return useQuery({
    queryKey: ["entries", category, kind],
    queryFn: () => list({ data: { category, kind } }),
  });
}

function OurWorksPage() {
  return (
    <div className="mx-auto max-w-6xl px-6 py-16">
      <p className="text-xs uppercase tracking-widest text-primary">Our Works</p>
      <h1 className="mt-2 font-serif text-4xl">Read, view & download</h1>
      <p className="mt-3 max-w-2xl text-muted-foreground">
        Editors' posts and authors' captions, organised by Special day and Poya day. The latest
        contribution always appears at the top.
      </p>

      <Tabs defaultValue="special" className="mt-10">
        <TabsList>
          <TabsTrigger value="special">Special day</TabsTrigger>
          <TabsTrigger value="poya">Poya day</TabsTrigger>
        </TabsList>
        <TabsContent value="special" className="mt-8">
          <CategorySection category="special" />
        </TabsContent>
        <TabsContent value="poya" className="mt-8">
          <CategorySection category="poya" />
        </TabsContent>
      </Tabs>
    </div>
  );
}

function CategorySection({ category }: { category: TaskCategory }) {
  return (
    <div className="grid gap-10 lg:grid-cols-2">
      <div>
        <SectionHeader icon={<ImageIcon className="h-4 w-4" />} title="Editors' images" />
        <EntryList category={category} kind="image" />
      </div>
      <div>
        <SectionHeader icon={<FileText className="h-4 w-4" />} title="Authors' captions" />
        <EntryList category={category} kind="text" />
      </div>
    </div>
  );
}

function SectionHeader({ icon, title }: { icon: React.ReactNode; title: string }) {
  return (
    <div className="mb-4 flex items-center gap-2 border-b border-border pb-2">
      <span className="text-primary">{icon}</span>
      <h2 className="font-serif text-xl">{title}</h2>
    </div>
  );
}

function EntryList({ category, kind }: { category: TaskCategory; kind: ContentKind }) {
  const { data, isLoading, error, refetch, isFetching } = useEntries(category, kind);
  const [preview, setPreview] = useState<DriveFile | null>(null);
  const [previewText, setPreviewText] = useState<string>("");
  const [loadingText, setLoadingText] = useState(false);

  async function openPreview(f: DriveFile) {
    setPreview(f);
    if (kind === "text") {
      setLoadingText(true);
      setPreviewText("");
      try {
        const r = await fetch(`/api/file/${f.id}`);
        setPreviewText(await r.text());
      } finally {
        setLoadingText(false);
      }
    }
  }

  if (isLoading) {
    return <div className="flex items-center gap-2 text-muted-foreground"><Loader2 className="h-4 w-4 animate-spin" /> Loading…</div>;
  }
  if (error) {
    return (
      <div className="rounded-lg border border-destructive/40 bg-destructive/5 p-4 text-sm">
        Couldn't load: {(error as Error).message}
        <Button size="sm" variant="ghost" onClick={() => refetch()} className="ml-2">Retry</Button>
      </div>
    );
  }
  const files = data?.files ?? [];
  if (files.length === 0) {
    return <p className="text-sm text-muted-foreground">No contributions yet. Be the first to upload one.</p>;
  }

  return (
    <>
      <ul className="space-y-3">
        {files.map((f, i) => (
          <li key={f.id} className={"rounded-xl glass p-4 " + (i === 0 ? "ring-2 ring-primary/40" : "")}>
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0">
                {i === 0 && <span className="mb-1 inline-block rounded-full bg-accent/20 px-2 py-0.5 text-[10px] uppercase tracking-wider text-accent-foreground">Latest</span>}
                <p className="truncate font-medium">{prettyName(f.name)}</p>
                <p className="text-xs text-muted-foreground">{new Date(f.modifiedTime).toLocaleString()}</p>
              </div>
              <div className="flex shrink-0 gap-2">
                <Button size="sm" variant="outline" onClick={() => openPreview(f)}>
                  <Eye className="mr-1 h-3.5 w-3.5" /> {kind === "image" ? "View" : "Read"}
                </Button>
                <Button size="sm" asChild>
                  <a href={`/api/file/${f.id}?download=1`}><Download className="mr-1 h-3.5 w-3.5" /> Download</a>
                </Button>
              </div>
            </div>
          </li>
        ))}
      </ul>
      {isFetching && <p className="mt-2 text-xs text-muted-foreground">Refreshing…</p>}

      <Dialog open={!!preview} onOpenChange={(o) => !o && setPreview(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="truncate">{preview && prettyName(preview.name)}</DialogTitle>
          </DialogHeader>
          {preview && kind === "image" && (
            <img src={`/api/file/${preview.id}`} alt={preview.name} className="max-h-[70vh] w-full rounded-lg object-contain" />
          )}
          {preview && kind === "text" && (
            loadingText ? (
              <div className="flex items-center gap-2 text-muted-foreground"><Loader2 className="h-4 w-4 animate-spin" /> Loading…</div>
            ) : (
              <pre className="max-h-[70vh] overflow-auto whitespace-pre-wrap rounded-lg bg-muted p-4 font-sans text-sm">{previewText}</pre>
            )
          )}
          {preview && (
            <div className="flex justify-end">
              <Button asChild><a href={`/api/file/${preview.id}?download=1`}><Download className="mr-1 h-3.5 w-3.5" /> Download</a></Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}

function prettyName(n: string) {
  // task__author__timestamp.ext
  const parts = n.split("__");
  if (parts.length >= 2) return `${parts[0].replace(/_/g, " ")} — ${parts[1].replace(/_/g, " ")}`;
  return n;
}