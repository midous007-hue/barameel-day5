# BARAMEEL WORLD V14 — Master Rebuild

This is a fresh rebuild of the Barameel digital game architecture based on the accessible BARAMEEL brand reference, the uploaded game evaluation PDF, the latest V13 source, and the agreed project logic.

## Core flow
BARAMEEL WORLD SPLASH → BARAMEEL WORLD → RUN / DUO LINK / MENU / POST / MY BARAMEEL.
Only RUN is fully wired into the existing game screens in this build. The other World paths are intentionally isolated so their future screens do not pollute RUN.

## RUN flow
run.html → screen02.html → screen03.html → screen04.html → screen05.html → screen06.html.

## Universal QR rule
Production QR is one universal token: `BARAMEEL-UNIVERSAL`.
The QR itself does NOT encode a collection/image/piece. Production scanning must call the server `/scan` endpoint, consume a one-time scan ticket atomically, and draw the reward server-side. This is the anti-farming architecture.

A client-side random draw exists only as an explicit demo fallback when no API base is configured. It is NOT production-secure and must be disabled before launch.

## Cross-device state
localStorage is only a cache. Production source of truth is Supabase. Player state, points, collections, scans, tickets, matches and rewards are server-side.

## Backend
See `supabase/schema.sql` and `supabase/functions/*`.

## Assets
See `ASSET-MANIFEST.txt`. New artwork must be uploaded with the exact names listed there. Do not rename existing RUN artwork.

## Language
Current master UI is English. Arabic/English choice is planned as a separate language screen before World.

## Audio
Local WAV/MP3 assets from the last working RUN build are retained. V14 uses a local arcade audio bank with a loud, punchy master chain and fallback oscillator motifs for critical interactions.
