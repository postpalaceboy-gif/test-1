import { useMemo, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { POYA_DAYS, SPECIAL_DAYS, type TaskCategory } from "@/lib/tasks";
import { uploadImageEntry, uploadTextEntry } from "@/lib/drive.functions";

type Mode = "image" | "text";

export function UploadPanel({ mode, accent }: { mode: Mode; accent: string }) {
  const [category, setCategory] = useState<TaskCategory>("special");
  const [task, setTask] = useState<string>("");
  const [name, setName] = useState("");
  const [text, setText] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [busy, setBusy] = useState(false);

  const uploadText = useServerFn(uploadTextEntry);
  const uploadImage = useServerFn(uploadImageEntry);

  const tasks = useMemo(
    () => (category === "poya" ? POYA_DAYS : SPECIAL_DAYS),
    [category],
  );

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!task) return toast.error("Please select a day");
    if (!name.trim()) return toast.error(mode === "image" ? "Enter editor name" : "Enter author name");
    setBusy(true);
    try {
      if (mode === "text") {
        if (!text.trim()) throw new Error("Please write something");
        await uploadText({ data: { category, task, author: name.trim(), text: text.trim() } });
      } else {
        if (!file) throw new Error("Please choose an image");
        const fd = new FormData();
        fd.set("category", category);
        fd.set("task", task);
        fd.set("editor", name.trim());
        fd.set("file", file);
        await uploadImage({ data: fd });
      }
      toast.success("Uploaded to Google Drive");
      setText("");
      setFile(null);
      (document.getElementById("file-input") as HTMLInputElement | null)?.value &&
        ((document.getElementById("file-input") as HTMLInputElement).value = "");
    } catch (err) {
      toast.error((err as Error).message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <form onSubmit={submit} className="grid gap-6 rounded-2xl glass-strong p-6 md:p-8">
      <div className="grid gap-2">
        <Label>Task type</Label>
        <div className="flex gap-2">
          {(["special", "poya"] as const).map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => { setCategory(c); setTask(""); }}
              className={
                "flex-1 rounded-lg border px-4 py-3 text-sm font-medium transition " +
                (category === c
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border bg-background hover:bg-muted")
              }
            >
              {c === "special" ? "Special day" : "Poya day"}
            </button>
          ))}
        </div>
      </div>

      <div className="grid gap-2">
        <Label>Select the day</Label>
        <Select value={task} onValueChange={setTask}>
          <SelectTrigger><SelectValue placeholder="Choose a day..." /></SelectTrigger>
          <SelectContent className="max-h-72">
            {tasks.map((t) => (
              <SelectItem key={t} value={t}>{t}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="grid gap-2">
        <Label>{mode === "image" ? "Editor name" : "Author name"}</Label>
        <Input value={name} onChange={(e) => setName(e.target.value)} maxLength={80} placeholder="Your name" />
      </div>

      {mode === "text" ? (
        <div className="grid gap-2">
          <Label>Caption / text</Label>
          <Textarea value={text} onChange={(e) => setText(e.target.value)} maxLength={10000} rows={8} placeholder="Write your caption or reflection..." />
        </div>
      ) : (
        <div className="grid gap-2">
          <Label>Image (max 15 MB)</Label>
          <Input id="file-input" type="file" accept="image/*" onChange={(e) => setFile(e.target.files?.[0] ?? null)} />
          {file && <p className="text-xs text-muted-foreground">{file.name} — {(file.size / 1024).toFixed(0)} KB</p>}
        </div>
      )}

      <Button type="submit" disabled={busy} className={accent}>
        {busy ? "Uploading..." : mode === "image" ? "Upload image" : "Upload text"}
      </Button>
    </form>
  );
}