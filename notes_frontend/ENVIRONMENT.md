# Runtime Environment Variables

The frontend expects the notes backend API (notes_database) to be reachable via the following runtime variable:

- NOTES_API_BASE_URL: Base URL for the Notes API (e.g., https://api.example.com or /api)

How it is used:
- The value is read at runtime from `window.__env__.NOTES_API_BASE_URL`.
- `src/index.html` includes a minimal script that sets a default `'/api'`. Override this during deployment by injecting a script before the Angular bundle loads, or by serving a `public/env.js` file that sets `window.__env__`.

Example snippet to inject:
```html
<script>
window.__env__ = { NOTES_API_BASE_URL: "https://your-backend.example.com" };
</script>
```

Required API routes expected by the app:
- GET    {NOTES_API_BASE_URL}/notes
- POST   {NOTES_API_BASE_URL}/notes           body: { title: string, content?: string }
- PUT    {NOTES_API_BASE_URL}/notes/{id}      body: Partial<Note>
- DELETE {NOTES_API_BASE_URL}/notes/{id}

Note shape:
```ts
interface Note {
  id: string;
  title: string;
  content: string;
  createdAt: string; // ISO
  updatedAt: string; // ISO
  tags?: string[];
  pinned?: boolean;
}
```
