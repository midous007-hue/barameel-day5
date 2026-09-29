# BARAMEEL WORLD — Master Logic

## 1. World entry
Splash → World.
World is the brand universe, not a child-only game. RUN, DUO LINK, MENU, POST and MY BARAMEEL are separate paths.

## 2. RUN
RUN is the physical quest: enter → choose runner → progress/rewards → scan → collection → progress.
The existing ALEXANDRIA collection remains 10 images × 9 pieces = 90 pieces.

## 3. Universal QR
There is one printed universal QR. It is a portal, not a reward definition.
Production sequence:
Universal QR → Player ID → available scan ticket → atomic ticket consumption → server-side weighted draw → piece/points/reward → server save → client render.
The client never chooses the production reward.

## 4. Ticket anti-farming rule
A scan ticket is an entitlement. A ticket can be consumed exactly once. A universal QR alone never grants unlimited scans.
Tickets can be granted by trusted POS/admin/purchase/event workflows.

## 5. Cross-device source of truth
Points, collections, scans, tickets, matches and rewards live on the backend. localStorage is only a UI cache.

## 6. DUO LINK
Player A scans Player B's Barameel identity QR. The pair key is canonicalized so A+B and B+A are the same pair. One pair gets one result. No dating language, no open chat.

## 7. BARAMEEL POST
POST is physical/digital correspondence: choose a postcard, enter recipient details, Barameel contacts the recipient, and the recipient gets a Barameel reward/voucher. It is not news and not events.

## 8. Live map / visit layer
Later phase: custom-styled walking route to Barameel, nearby active-player presence as approximate avatar icons, route checkpoints, server-side checkpoint claims, final Barameel QR.
Exact player location is not exposed.

## 9. Analytics
Every meaningful event can be sent to analytics_events. The future admin dashboard should expose visits, unique players, active players, scans, rewards, matches, collection completion, route starts, arrivals, final QR completions, retention and source attribution.
