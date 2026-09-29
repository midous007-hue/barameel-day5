# Production backend setup

1. Create a Supabase project.
2. Run `supabase/schema.sql` in SQL Editor.
3. Load the 90-piece ALEXANDRIA pool from `assets/collections/collection01/collection.json` into `collection_pieces` (a small seed script can be generated once the final reward economics are locked).
4. Deploy Edge Functions: `scan`, `player`, `analytics`, `duo-link`.
5. Set `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` as function secrets.
6. Set `config.js` `apiBase` to the project's `/functions/v1` URL and set `production:true`.
7. Grant tickets only from trusted POS/admin workflows using `grant_scan_ticket` with the service role. Never expose the service role key to the browser.
8. Print ONE universal QR whose payload is `BARAMEEL-UNIVERSAL`.

Important: before public launch, disable the demo fallback in `screen05.html` or ensure `production:true` and a working `/scan` endpoint. The browser must never be trusted to choose production rewards.
