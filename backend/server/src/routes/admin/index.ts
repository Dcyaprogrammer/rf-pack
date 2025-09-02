import { Hono } from "hono";

const app = new Hono()
  .get("/health", (c) => c.json({ status: "ok" }))
  .get("/models", (c) => c.json({ items: [] }));

export default app;


