# harbour-test-notes

Simple notes REST API — Express + PostgreSQL. Used as a Harbour pipeline test case.

## Endpoints

| Method | Path | Description |
|--------|------|-------------|
| GET | /api/health | Health check |
| GET | /api/notes | List all notes |
| POST | /api/notes | Create note `{ title, body }` |
| DELETE | /api/notes/:id | Delete note |

## Run locally

```bash
docker compose up
```
