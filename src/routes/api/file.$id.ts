import { createFileRoute } from "@tanstack/react-router";
import { getFileMedia } from "@/lib/drive.server";

export const Route = createFileRoute("/api/file/$id")({
  server: {
    handlers: {
      GET: async ({ params, request }) => {
        const url = new URL(request.url);
        const download = url.searchParams.get("download") === "1";
        try {
          const { bytes, mimeType, name } = await getFileMedia(params.id);
          const headers: Record<string, string> = {
            "Content-Type": mimeType,
            "Cache-Control": "private, max-age=60",
          };
          if (download) {
            headers["Content-Disposition"] = `attachment; filename="${name.replace(/"/g, "")}"`;
          }
          return new Response(bytes as unknown as BodyInit, { status: 200, headers });
        } catch (e) {
          return new Response((e as Error).message, { status: 500 });
        }
      },
    },
  },
});