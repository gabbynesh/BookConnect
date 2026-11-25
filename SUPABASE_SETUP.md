# Supabase setup
1. Review the existing database before applying schema.sql. It is a proposed fresh schema, not a migration.
2. In Supabase Project Settings / API Keys copy the project URL and publishable (or legacy anon) key. Never expose service_role or secret keys.
3. Enable email authentication and create test accounts. Each account needs a profile before reserving.
4. The API module can be used from a browser module:
```js
import {createClient} from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm";
import {createLibraryApi} from "./supabase-api.js";
const api = createLibraryApi(createClient(PROJECT_URL, PUBLISHABLE_KEY));
await api.signIn(email,password);
await api.ensureProfile(displayName);
const books = await api.listBooks();
```
5. Verify reservations, cancellation and cross-account isolation. A second reservation of the same book must fail while the first is active.
6. The current UI still uses localStorage. The API is a separate module and is not wired into index.html yet. Do not claim live integration until UI wiring and real database tests are complete.
7. The catalog's available flag is a base inventory flag; global active reservation availability requires a separate safe public view or RPC. Do not expose other users' reservation records.
8. Librarian checkout/return requires a trusted role and policies; the current student API intentionally cannot mark a book borrowed.
