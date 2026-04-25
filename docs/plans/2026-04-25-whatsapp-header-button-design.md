# Design: WhatsApp "Chat with us" Button in Header

**Date:** 2026-04-25
**Status:** Approved
**Project:** Botanika Massage (botanikamassage.com)
**Author:** Brainstorm session — PM-Fred + Simon

---

## Goal

Let customers reach Botanika's central WhatsApp account directly from the website header to make reservations.

## Scope

- **One** WhatsApp button in the site header (no floating button, no per-page CTAs).
- **One** central number: `+66 95 570 7650` (`66955707650` in `wa.me` format).
- Bilingual: button label and pre-fill message localize with the existing language toggle (EN / TH).
- Out of scope (deferred): floating button, per-branch routing, modal-based branch picker, gallery, blog, other Q2 features.

## User flow

1. Customer lands on any page.
2. Sees `[WhatsApp icon] Chat with us` (or `แชทกับเรา` in Thai) in the header nav.
3. Clicks the button → new tab opens to `https://wa.me/66955707650?text=<localized pre-fill>`.
4. On mobile this opens the WhatsApp app; on desktop it opens WhatsApp Web.
5. Pre-filled message:
   - **EN:** `Hi Botanika, I'd like to make a reservation.`
   - **TH:** `สวัสดีค่ะ Botanika ต้องการจองนวดค่ะ`
6. Customer sends, Botanika team replies and books.

## Architecture

### Files affected

| # | File | Type | Change |
|---|------|------|--------|
| 1 | `frontend/.env` | env (gitignored) | Add `VITE_WHATSAPP_NUMBER=66955707650` |
| 2 | `frontend/.env.example` | committed | Add same key with placeholder |
| 3 | `frontend/src/locales/en.json` | edit | Add `header.whatsappLabel`, `whatsapp.prefillMessage` |
| 4 | `frontend/src/locales/th.json` | edit | Same keys, Thai translations |
| 5 | `frontend/src/components/WhatsAppButton.jsx` | new | Small component |
| 6 | `frontend/src/components/Header.jsx` | edit | Render `<WhatsAppButton />` in nav |
| 7 | `frontend/src/components/Header.css` | edit | Minor styling (spacing, icon alignment) |

### Component contract — `WhatsAppButton.jsx`

```jsx
// Reads import.meta.env.VITE_WHATSAPP_NUMBER
// Reads i18n keys: header.whatsappLabel, whatsapp.prefillMessage
// Builds: https://wa.me/<number>?text=<encodeURIComponent(prefill)>
// Renders: <a href={url} target="_blank" rel="noopener noreferrer">
//            <WhatsAppIcon /> {label}
//          </a>
// If VITE_WHATSAPP_NUMBER is missing/empty → return null (graceful fallback)
```

- Icon: inline SVG (no new npm dependency).
- Pre-fill message is URL-encoded.
- `rel="noopener noreferrer"` for security.

### i18n strings

| Key | EN | TH |
|---|---|---|
| `header.whatsappLabel` | `Chat with us` | `แชทกับเรา` |
| `whatsapp.prefillMessage` | `Hi Botanika, I'd like to make a reservation.` | `สวัสดีค่ะ Botanika ต้องการจองนวดค่ะ` |

## Data flow

```
[Header.jsx]
   └── <WhatsAppButton />
         ├── reads VITE_WHATSAPP_NUMBER (build-time)
         ├── reads t('header.whatsappLabel')   ← reactive to language toggle
         ├── reads t('whatsapp.prefillMessage') ← reactive to language toggle
         └── renders <a href="https://wa.me/...?text=...">
```

No runtime API calls. No state. Build-time env + reactive i18n.

## Error handling

- Missing env var → component renders nothing (header still works).
- Missing i18n key → falls back to key name (default react-i18next behavior); should be caught in code review.
- WhatsApp not installed on mobile → wa.me redirects to App Store / Play Store automatically (handled by WhatsApp).

## Testing

| Type | What | Where |
|---|---|---|
| Manual desktop | Click button in EN → WhatsApp Web opens with English pre-fill | Local dev (`localhost:3000`) |
| Manual desktop | Toggle to TH → click → Thai pre-fill | Local dev |
| Manual mobile | Open site on phone → click → WhatsApp app opens with pre-fill | Phone, via VPS preview |
| Manual prod | Same checks on `https://botanikamassage.com` after deploy | Tester-Clement |
| Sync check | `bash scripts/validate-sync.sh` after deploy | VPS |

No unit tests — component logic is trivial URL construction; manual checks cover the surface area.

## Deploy flow (per `CLAUDE.md`)

1. **Frontend-Simon** — implement files 1–7 above, build locally with `--no-cache`, smoke-test.
2. **Reviewer-Ben** — review diff, check Thai wording, verify env var fallback.
3. **GitHub-Grace** — commit + push to `lats22/botanika`.
4. **Tester-Clement** — pull on VPS, rebuild with `--no-cache`, validate live on `https://botanikamassage.com`.

## Open questions

None. All decisions made during brainstorm.

## Future scope (do not implement now)

- Floating WhatsApp button on every page (Q4 option a).
- Per-branch numbers + branch-picker modal (Q3 option b/c).
- WhatsApp on individual "Book Now" CTAs in service / branch cards (Q4 option e).
- Track click events to analytics.
