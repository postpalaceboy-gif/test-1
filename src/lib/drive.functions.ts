import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { FOLDERS, type ContentKind, type TaskCategory } from "./tasks";
import { listLatest, uploadToDrive } from "./drive.server";

const categorySchema = z.enum(["special", "poya"]);
const kindSchema = z.enum(["image", "text"]);

function sanitize(s: string) {
  return s.replace(/[\\/:*?"<>|]/g, "_").slice(0, 120);
}

export const uploadTextEntry = createServerFn({ method: "POST" })
  .inputValidator(
    z.object({
      category: categorySchema,
      task: z.string().min(1).max(200),
      author: z.string().min(1).max(80),
      text: z.string().min(1).max(10000),
    }).parse,
  )
  .handler(async ({ data }) => {
    const folderId = FOLDERS[data.category as TaskCategory].text;
    const stamp = new Date().toISOString().replace(/[:.]/g, "-");
    const name = `${sanitize(data.task)}__${sanitize(data.author)}__${stamp}.txt`;
    const file = await uploadToDrive({
      folderId,
      name,
      mimeType: "text/plain; charset=utf-8",
      body: `Task: ${data.task}\nAuthor: ${data.author}\nDate: ${new Date().toISOString()}\n\n${data.text}`,
    });
    return { ok: true as const, file };
  });

export const uploadImageEntry = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => {
    if (!(input instanceof FormData)) throw new Error("Expected FormData");
    const category = categorySchema.parse(input.get("category"));
    const task = z.string().min(1).max(200).parse(input.get("task"));
    const editor = z.string().min(1).max(80).parse(input.get("editor"));
    const file = input.get("file");
    if (!(file instanceof File)) throw new Error("Missing file");
    if (file.size > 15 * 1024 * 1024) throw new Error("File too large (max 15MB)");
    if (!file.type.startsWith("image/")) throw new Error("Only image files allowed");
    return { category, task, editor, file };
  })
  .handler(async ({ data }) => {
    const folderId = FOLDERS[data.category as TaskCategory].image;
    const stamp = new Date().toISOString().replace(/[:.]/g, "-");
    const ext = data.file.name.split(".").pop() || "png";
    const name = `${sanitize(data.task)}__${sanitize(data.editor)}__${stamp}.${ext}`;
    const bytes = new Uint8Array(await data.file.arrayBuffer());
    const file = await uploadToDrive({
      folderId,
      name,
      mimeType: data.file.type,
      body: bytes,
    });
    return { ok: true as const, file };
  });

export const listEntries = createServerFn({ method: "GET" })
  .inputValidator(
    z.object({
      category: categorySchema,
      kind: kindSchema,
    }).parse,
  )
  .handler(async ({ data }) => {
    const folderId = FOLDERS[data.category as TaskCategory][data.kind as ContentKind];
    const files = await listLatest(folderId, 24);
    return { files };
  });