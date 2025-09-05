import type { NextApiRequest, NextApiResponse } from "next";
import http from "http";
export const config = { api: { bodyParser: false } };

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache, no-transform");
  res.setHeader("Connection", "keep-alive");
  res.setHeader("X-Accel-Buffering", "no");

  const url = new URL(req.url ?? "", "http://localhost:3001");
  const upstream = http.request(
    {
      hostname: "localhost",
      port: 3000,
      path: `/api/1/stream/power-output${url.search || ""}`,
      method: "GET",
      headers: { Accept: "text/event-stream" },
    },
    (uRes) => {
      uRes.on("data", (chunk) => res.write(chunk));
      uRes.on("end", () => res.end());
    }
  );

  upstream.on("error", (err) => {
    console.error("stream-proxy error:", err);
    res.write(`event: error\ndata: ${JSON.stringify({ message: String(err) })}\n\n`);
    res.end();
  });

  upstream.end();
  req.on("close", () => { upstream.destroy(); res.end(); });
}
