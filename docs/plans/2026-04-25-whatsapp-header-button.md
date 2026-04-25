# WhatsApp Header Button Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Add a bilingual (×6) "Chat with us" button in the site header that opens WhatsApp with a localized pre-filled reservation message.

**Architecture:** Small `<WhatsAppButton/>` component reads `VITE_WHATSAPP_NUMBER` from env at build time, reads label + pre-fill from i18n (reactive to language toggle), and renders an `<a>` tag pointing at `https://wa.me/<number>?text=<encoded>`. No state, no API calls.

**Tech Stack:** React 18, Vite 5, react-i18next 13, i18next-browser-languagedetector. No test framework — verification is manual (Reviewer-Ben on diff, Tester-Clement on prod).

**Design doc:** `docs/plans/2026-04-25-whatsapp-header-button-design.md`

**Team workflow (per CLAUDE.md):**
- **Frontend-Simon** — Tasks 1–5 (implementation + local smoke test)
- **Reviewer-Ben** — Task 6 (code + translation review)
- **GitHub-Grace** — Task 7 (push to GitHub)
- **Tester-Clement** — Task 8 (prod validation on `https://botanikamassage.com`)

---

## Translations reference (all 6 languages)

| Lang | `whatsapp.label` | `whatsapp.prefillMessage` |
|------|------------------|----------------------------|
| en | `Chat with us` | `Hi Botanika, I'd like to make a reservation.` |
| th | `แชทกับเรา` | `สวัสดีค่ะ Botanika ต้องการจองนวดค่ะ` |
| zh | `联系我们` | `你好 Botanika，我想预订按摩。` |
| fr | `Discutez avec nous` | `Bonjour Botanika, je souhaite réserver un massage.` |
| es | `Chatea con nosotros` | `Hola Botanika, me gustaría reservar un masaje.` |
| ko | `채팅하기` | `안녕하세요 Botanika, 마사지를 예약하고 싶습니다.` |

> **Reviewer-Ben — please verify translations with native-quality eye, especially Thai/Chinese/Korean.**

---

### Task 1: Add WhatsApp number to env files

**Owner:** Frontend-Simon
**Files:**
- Create: `frontend/.env`
- Create: `frontend/.env.example`
- Verify: `frontend/.gitignore` (must contain `.env`)

**Step 1: Confirm `.env` is gitignored**

Run: `grep -E "^\.env$|^\.env$" /root/botanika/frontend/.gitignore || grep -rn "^\.env" /root/botanika/.gitignore`
Expected: `.env` listed in `.gitignore`. If not, add it before continuing.

**Step 2: Create `frontend/.env`**

```
VITE_WHATSAPP_NUMBER=66955707650
```

**Step 3: Create `frontend/.env.example` (committed)**

```
# WhatsApp number in international format, no '+' or spaces.
# Example for Thailand: 66955707650
VITE_WHATSAPP_NUMBER=
```

**Step 4: Commit**

```bash
cd /root/botanika
git add frontend/.env.example
git commit -m "chore: add VITE_WHATSAPP_NUMBER to env example"
```

> Do **NOT** commit `frontend/.env` — it must stay gitignored.

---

### Task 2: Add i18n strings to all 6 locales

**Owner:** Frontend-Simon
**Files:**
- Modify: `frontend/src/locales/en.json`
- Modify: `frontend/src/locales/th.json`
- Modify: `frontend/src/locales/zh.json`
- Modify: `frontend/src/locales/fr.json`
- Modify: `frontend/src/locales/es.json`
- Modify: `frontend/src/locales/ko.json`

Add a top-level `whatsapp` block to each file (sibling of `nav`, `hero`, etc.) with `label` and `prefillMessage`.

**Step 1: `en.json`** — add block:

```json
"whatsapp": {
  "label": "Chat with us",
  "prefillMessage": "Hi Botanika, I'd like to make a reservation."
}
```

**Step 2: `th.json`** — add block:

```json
"whatsapp": {
  "label": "แชทกับเรา",
  "prefillMessage": "สวัสดีค่ะ Botanika ต้องการจองนวดค่ะ"
}
```

**Step 3: `zh.json`** — add block:

```json
"whatsapp": {
  "label": "联系我们",
  "prefillMessage": "你好 Botanika，我想预订按摩。"
}
```

**Step 4: `fr.json`** — add block:

```json
"whatsapp": {
  "label": "Discutez avec nous",
  "prefillMessage": "Bonjour Botanika, je souhaite réserver un massage."
}
```

**Step 5: `es.json`** — add block:

```json
"whatsapp": {
  "label": "Chatea con nosotros",
  "prefillMessage": "Hola Botanika, me gustaría reservar un masaje."
}
```

**Step 6: `ko.json`** — add block:

```json
"whatsapp": {
  "label": "채팅하기",
  "prefillMessage": "안녕하세요 Botanika, 마사지를 예약하고 싶습니다."
}
```

**Step 7: Verify JSON is valid (no trailing commas, all closing braces correct)**

Run: `for f in /root/botanika/frontend/src/locales/*.json; do echo "$f"; python3 -c "import json; json.load(open('$f'))" && echo "  OK" || echo "  INVALID"; done`
Expected: every file prints `OK`.

**Step 8: Commit**

```bash
cd /root/botanika
git add frontend/src/locales/*.json
git commit -m "i18n: add whatsapp.label and whatsapp.prefillMessage in all 6 languages"
```

---

### Task 3: Create `WhatsAppButton` component

**Owner:** Frontend-Simon
**Files:**
- Create: `frontend/src/components/WhatsAppButton.jsx`
- Create: `frontend/src/components/WhatsAppButton.css`

**Step 1: Create `frontend/src/components/WhatsAppButton.jsx`**

```jsx
import React from 'react'
import { useTranslation } from 'react-i18next'
import './WhatsAppButton.css'

function WhatsAppButton() {
  const { t } = useTranslation()
  const number = import.meta.env.VITE_WHATSAPP_NUMBER

  if (!number) return null

  const message = t('whatsapp.prefillMessage')
  const url = `https://wa.me/${number}?text=${encodeURIComponent(message)}`

  return (
    <a
      className="whatsapp-button"
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={t('whatsapp.label')}
    >
      <svg
        className="whatsapp-button__icon"
        viewBox="0 0 24 24"
        width="20"
        height="20"
        fill="currentColor"
        aria-hidden="true"
      >
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
      </svg>
      <span className="whatsapp-button__label">{t('whatsapp.label')}</span>
    </a>
  )
}

export default WhatsAppButton
```

**Step 2: Create `frontend/src/components/WhatsAppButton.css`**

```css
.whatsapp-button {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 8px 14px;
  border-radius: 999px;
  background: #25D366;
  color: #fff;
  font-weight: 600;
  font-size: 0.95rem;
  text-decoration: none;
  transition: background 0.2s ease, transform 0.1s ease;
}

.whatsapp-button:hover {
  background: #1ebe5d;
}

.whatsapp-button:active {
  transform: scale(0.97);
}

.whatsapp-button__icon {
  flex-shrink: 0;
}

@media (max-width: 768px) {
  .whatsapp-button {
    padding: 6px 10px;
    font-size: 0.85rem;
  }
}
```

**Step 3: Commit**

```bash
cd /root/botanika
git add frontend/src/components/WhatsAppButton.jsx frontend/src/components/WhatsAppButton.css
git commit -m "feat: add WhatsAppButton component"
```

---

### Task 4: Mount `WhatsAppButton` in Header

**Owner:** Frontend-Simon
**Files:**
- Modify: `frontend/src/components/Header.jsx` (add import + render between nav and LanguageSelector)
- Modify: `frontend/src/components/Header.css` (only if header layout breaks)

**Step 1: Edit `frontend/src/components/Header.jsx`**

Add this import near the existing `LanguageSelector` import:

```jsx
import WhatsAppButton from './WhatsAppButton'
```

Place `<WhatsAppButton />` between the `</nav>` close tag and `<LanguageSelector />` (Header.jsx line 90–92 area). After change, the JSX inside `header__container` should look like:

```jsx
<nav ref={navRef} className={`header__nav ${isMobileMenuOpen ? 'header__nav--open' : ''}`}>
  <button onClick={() => scrollToSection('services')}>{t('nav.services')}</button>
  <button onClick={() => scrollToSection('packages')}>{t('nav.packages')}</button>
  <button onClick={() => scrollToSection('branches')}>{t('nav.locations')}</button>
  <button onClick={() => scrollToSection('contact')}>{t('nav.contact')}</button>
</nav>

<WhatsAppButton />

<LanguageSelector />
```

**Step 2: Inspect on `localhost:3000` to see if `Header.css` needs a small flex/gap tweak. If the header items are crammed, add `gap: 12px;` to `.header__container` (or whatever existing flex container holds these). Only make the minimum tweak needed.**

**Step 3: Commit**

```bash
cd /root/botanika
git add frontend/src/components/Header.jsx
# only add Header.css if you actually changed it
git commit -m "feat: mount WhatsAppButton in site header"
```

---

### Task 5: Frontend-Simon — local smoke test

**Owner:** Frontend-Simon

**Step 1: Rebuild frontend with --no-cache** (per memory: always `--no-cache` for Docker)

```bash
cd /root/botanika
docker compose build --no-cache frontend
docker compose up -d
```

**Step 2: Open `http://localhost:3000` (or `:3002` on VPS)**

**Step 3: Manual checklist (desktop)**

- [ ] Green "Chat with us" pill button visible in header (right side, before language selector)
- [ ] Click button → new tab opens to `https://wa.me/66955707650?text=...` with EN message URL-encoded
- [ ] Toggle language to TH → button label becomes `แชทกับเรา` → click → URL contains Thai pre-fill
- [ ] Repeat for ZH, FR, ES, KO — each language localizes both label AND pre-fill
- [ ] Header doesn't visually break on a 1280×800 viewport

**Step 4: Manual checklist (mobile viewport, e.g. 375×667 in DevTools or real phone)**

- [ ] Button visible and tappable
- [ ] Doesn't push other elements off-screen
- [ ] Text doesn't wrap awkwardly

**Step 5: Negative test — env var fallback**

- Temporarily comment out `VITE_WHATSAPP_NUMBER` in `frontend/.env`
- Rebuild: `docker compose build --no-cache frontend && docker compose up -d`
- Open site → button should **not** render; rest of header still works
- Restore the env var and rebuild again

**Step 6: Update TASKS.md**

Add to `/root/botanika/TASKS.md` under Completed:
```
- [x] #16 Add WhatsApp "Chat with us" button to site header (6 languages)
```

```bash
cd /root/botanika
git add TASKS.md
git commit -m "docs: mark whatsapp header button task complete in TASKS.md"
```

---

### Task 6: Reviewer-Ben — code & translation review

**Owner:** Reviewer-Ben

**Step 1: Pull latest commits and review the diff**

```bash
cd /root/botanika
git log --oneline -10
git diff <commit-before-task-1>..HEAD -- frontend/
```

**Step 2: Code review checklist**

- [ ] `frontend/.env` is **not** in the commits (only `.env.example`)
- [ ] `VITE_WHATSAPP_NUMBER=66955707650` placeholder in `.env.example` looks right
- [ ] All 6 locale JSON files have the `whatsapp.label` and `whatsapp.prefillMessage` keys
- [ ] No trailing commas, JSON valid
- [ ] `WhatsAppButton.jsx`:
  - Uses `import.meta.env.VITE_WHATSAPP_NUMBER`
  - Returns `null` when env var missing
  - `target="_blank"` AND `rel="noopener noreferrer"` (security)
  - Pre-fill is URL-encoded via `encodeURIComponent`
  - Has `aria-label` for accessibility
- [ ] `Header.jsx` import + placement is between `</nav>` and `<LanguageSelector />`
- [ ] `WhatsAppButton.css` doesn't conflict with global classes
- [ ] No console errors / warnings on dev server

**Step 3: Translation review (have a native or competent speaker check, or use translation-quality LLM)**

For each language, verify:
- `label` is natural, conversational, fits a header CTA (not too long)
- `prefillMessage` makes sense as the first message to a massage spa
- No grammatical errors, no machine-translation oddities
- Especially check: TH (formal vs. casual), ZH (Simplified, polite tone), KO (formal speech level)

**Step 4: Sign off or send back with comments**

If approved, leave a comment on the latest commit (or just ping Frontend-Simon). If not, list specific changes needed and re-loop.

---

### Task 7: GitHub-Grace — push to GitHub

**Owner:** GitHub-Grace
**Repo:** `https://github.com/lats22/botanika`

**Step 1: Confirm Reviewer-Ben approved (Task 6)**

**Step 2: Push commits**

```bash
cd /root/botanika
git status         # should be clean
git log origin/main..HEAD --oneline   # commits about to be pushed
git push origin main
```

**Step 3: Verify push landed**

Run: `gh repo view lats22/botanika --json defaultBranchRef --jq '.defaultBranchRef.name'` and `gh api repos/lats22/botanika/commits/main --jq '.sha,.commit.message'`
Expected: latest commit SHA matches what you just pushed.

---

### Task 8: Tester-Clement — prod validation

**Owner:** Tester-Clement
**Target:** `https://botanikamassage.com`
**VPS:** `root@72.62.64.54:/root/botanika`

**Step 1: Pull and rebuild on VPS**

```bash
ssh root@72.62.64.54 "cd /root/botanika && git pull && docker compose build --no-cache frontend && docker compose up -d"
```

Wait ~30s for the container to come up.

**Step 2: Add VPS env var**

Confirm `/root/botanika/frontend/.env` on the VPS contains `VITE_WHATSAPP_NUMBER=66955707650`. If not, create it and rebuild:

```bash
ssh root@72.62.64.54 "echo 'VITE_WHATSAPP_NUMBER=66955707650' > /root/botanika/frontend/.env && cd /root/botanika && docker compose build --no-cache frontend && docker compose up -d"
```

**Step 3: Validate on `https://botanikamassage.com` — desktop**

- [ ] Site loads, no console errors
- [ ] Green "Chat with us" button visible in header
- [ ] Click → opens WhatsApp Web at `https://web.whatsapp.com/...` with `+66 95 570 7650` chat and EN pre-fill
- [ ] Toggle to each of TH / ZH / FR / ES / KO → label and pre-fill update on each click

**Step 4: Validate on real mobile**

- [ ] Open `https://botanikamassage.com` on a phone
- [ ] Tap button → WhatsApp app opens with chat to `+66 95 570 7650` and pre-filled message
- [ ] Send a test message; confirm Botanika receives it (Simon to check WhatsApp inbox)

**Step 5: Run sync validator**

```bash
ssh root@72.62.64.54 "cd /root/botanika && bash scripts/validate-sync.sh"
```
Expected: no errors / drift between dev and prod.

**Step 6: Sign off or report regressions**

If a check fails, write up the issue, ping Frontend-Simon, and reopen the relevant task.

---

## Done criteria

- All 6 locales render correct label + pre-fill on production
- WhatsApp opens correctly on desktop (Web) and mobile (app)
- A real test message reaches the Botanika WhatsApp inbox
- `validate-sync.sh` passes
- Reviewer-Ben + Tester-Clement have signed off

## Out of scope (future)

- Floating button on every page
- Per-branch WhatsApp routing + branch-picker modal
- WhatsApp on individual "Book Now" CTAs in service / branch cards
- Click-tracking analytics
