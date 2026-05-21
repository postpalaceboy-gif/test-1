const GATEWAY = "https://connector-gateway.lovable.dev/google_drive";

function authHeaders() {
  const lov = process.env.LOVABLE_API_KEY;
  const drive = process.env.GOOGLE_DRIVE_API_KEY;
  if (!lov) throw new Error("LOVABLE_API_KEY is not configured");
  if (!drive) throw new Error("GOOGLE_DRIVE_API_KEY is not configured");
  return {
    Authorization: `Bearer ${lov}`,
    "X-Connection-Api-Key": drive,
  };
}

export async function uploadToDrive(opts: {
  folderId: string;
  name: string;
  mimeType: string;
  body: Uint8Array | string;
}) {
  const boundary = "lov_boundary_" + Math.random().toString(36).slice(2);
  const metadata = {
    name: opts.name,
    parents: [opts.folderId],
    mimeType: opts.mimeType,
  };
  const bodyBytes =
    typeof opts.body === "string" ? new TextEncoder().encode(opts.body) : opts.body;
  const enc = new TextEncoder();
  const head = enc.encode(
    `--${boundary}\r\nContent-Type: application/json; charset=UTF-8\r\n\r\n` +
      JSON.stringify(metadata) +
      `\r\n--${boundary}\r\nContent-Type: ${opts.mimeType}\r\n\r\n`,
  );
  const tail = enc.encode(`\r\n--${boundary}--`);
  const payload = new Uint8Array(head.length + bodyBytes.length + tail.length);
  payload.set(head, 0);
  payload.set(bodyBytes, head.length);
  payload.set(tail, head.length + bodyBytes.length);

  const res = await fetch(
    `${GATEWAY}/upload/drive/v3/files?uploadType=multipart&fields=id,name,mimeType,modifiedTime`,
    {
      method: "POST",
      headers: {
        ...authHeaders(),
        "Content-Type": `multipart/related; boundary=${boundary}`,
      },
      body: payload,
    },
  );
  const text = await res.text();
  if (!res.ok) throw new Error(`Drive upload failed [${res.status}]: ${text}`);
  return JSON.parse(text) as { id: string; name: string; mimeType: string; modifiedTime: string };
}

export interface DriveFile {
  id: string;
  name: string;
  mimeType: string;
  modifiedTime: string;
}

export async function listLatest(folderId: string, pageSize = 12): Promise<DriveFile[]> {
  const q = encodeURIComponent(`'${folderId}' in parents and trashed = false`);
  const fields = encodeURIComponent("files(id,name,mimeType,modifiedTime)");
  const url = `${GATEWAY}/drive/v3/files?q=${q}&orderBy=modifiedTime desc&pageSize=${pageSize}&fields=${fields}`;
  const res = await fetch(url, { headers: authHeaders() });
  const text = await res.text();
  if (!res.ok) throw new Error(`Drive list failed [${res.status}]: ${text}`);
  return (JSON.parse(text).files ?? []) as DriveFile[];
}

export async function getFileMedia(fileId: string): Promise<{ bytes: Uint8Array; mimeType: string; name: string }> {
  const meta = await fetch(
    `${GATEWAY}/drive/v3/files/${fileId}?fields=id,name,mimeType`,
    { headers: authHeaders() },
  );
  if (!meta.ok) throw new Error(`Drive meta failed [${meta.status}]: ${await meta.text()}`);
  const metaJson = (await meta.json()) as { name: string; mimeType: string };
  const res = await fetch(`${GATEWAY}/drive/v3/files/${fileId}?alt=media`, {
    headers: authHeaders(),
  });
  if (!res.ok) throw new Error(`Drive download failed [${res.status}]: ${await res.text()}`);
  const buf = new Uint8Array(await res.arrayBuffer());
  return { bytes: buf, mimeType: metaJson.mimeType, name: metaJson.name };
}