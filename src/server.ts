import express, { Request, Response } from "express";
import path from "path";
import { pool, initDb } from "./db";

const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname, "../public")));

const rawPort = process.env.PORT;
if (!rawPort) {
  console.error("FATAL: PORT environment variable is required but not set.");
  process.exit(1);
}
const PORT = parseInt(rawPort, 10);
if (isNaN(PORT)) {
  console.error(`FATAL: PORT must be a valid number, got "${rawPort}".`);
  process.exit(1);
}

app.get("/api/health", (_req: Request, res: Response) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

app.get("/api/notes", async (_req: Request, res: Response) => {
  const { rows } = await pool.query("SELECT * FROM notes ORDER BY created_at DESC");
  res.json(rows);
});

app.post("/api/notes", async (req: Request, res: Response) => {
  const { title, body } = req.body as { title?: string; body?: string };
  if (!title) {
    res.status(400).json({ error: "title is required" });
    return;
  }
  const { rows } = await pool.query(
    "INSERT INTO notes (title, body) VALUES ($1, $2) RETURNING *",
    [title, body ?? ""]
  );
  res.status(201).json(rows[0]);
});

app.delete("/api/notes/:id", async (req: Request, res: Response) => {
  const { id } = req.params;
  const { rowCount } = await pool.query("DELETE FROM notes WHERE id = $1", [id]);
  if (!rowCount) {
    res.status(404).json({ error: "not found" });
    return;
  }
  res.status(204).send();
});

initDb()
  .then(() => {
    app.listen(PORT, () => console.log(`Listening on :${PORT}`));
  })
  .catch((err) => {
    console.error("DB init failed", err);
    process.exit(1);
  });
