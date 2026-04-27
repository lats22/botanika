# Botanika - Task List

**Project:** Botanika Massage Website
**Live URL:** https://botanikamassage.com
**GitHub:** https://github.com/lats22/botanika
**VPS:** root@72.62.64.54:/root/botanika

---

## Completed

- [x] #1 Explore project context
- [x] #2 Ask clarifying questions
- [x] #6 Deploy website to VPS
- [x] #9 Configure nginx and SSL for botanikamassage.com
- [x] #10 Add Botanika favicon to browser tab
- [x] #7 Update bot to include website health in report
- [x] #11 Upload project to GitHub repository
- [x] #12 Validate dev/prod environment sync (Sync-Tom created)
- [x] #8 Update logo with new one
- [x] #13 Update QR code in branch location cards
- [x] #14 Update favicon to monstera leaf only (cropped from logo, no text)
- [x] #15 Validate dev/prod sync after favicon update
- [x] #17 Add WhatsApp "Chat with us" button to header (glass effect, EN/TH only)
- [x] #18 Remove Contact Us section (WhatsApp button in header replaces contact form)
- [x] #19 Branch Image Gallery Feature (completed 2026-04-27)
- [x] #20 Botanika Arôme Collection Feature (completed 2026-04-27)

---

## Completed - Botanika Arôme Collection Feature (Session: 2026-04-27)

| # | Task | Agent | Status |
|---|------|-------|--------|
| 1 | Implement Arôme Collection section | Frontend-Simon | ✅ Complete |
| 2 | Code review implementation | Reviewer-Ben | ✅ Complete |
| 3 | Push to GitHub | GitHub-Grace | ✅ Complete (commit: a5ba12d) |
| 4 | Deploy to VPS | VPS-Victor | ✅ Complete |
| 5 | Fix UI issues (spelling, alignment, lightbox) | Frontend-Simon | ✅ Complete |
| 6 | Push fixes to GitHub | GitHub-Grace | ✅ Complete (commit: 71df0e5) |
| 7 | Deploy fixes to VPS | VPS-Victor | ✅ Complete |
| 8 | Add sale badge & two-line subtitle | Frontend-Simon | ✅ Complete |
| 9 | Add lightbox zoom feature | Frontend-Simon | ✅ Complete |
| 10 | Push badge/zoom to GitHub | GitHub-Grace | ✅ Complete (commit: d5b24aa) |
| 11 | Deploy badge/zoom to VPS | VPS-Victor | ✅ Complete |
| 12 | Fix carousel responsive (desktop) | Frontend-Simon | ✅ Complete |
| 13 | Push carousel fix to GitHub | GitHub-Grace | ✅ Complete (commit: 4d0dea3) |
| 14 | Deploy carousel fix to VPS | VPS-Victor | ✅ Complete |
| 15 | Hide dots on desktop | Frontend-Simon | ✅ Complete |
| 16 | Push dots fix to GitHub | GitHub-Grace | ✅ Complete (commit: e5e1b8a) |
| 17 | Deploy dots fix to VPS | VPS-Victor | ✅ Complete |
| 18 | Test all features on production | Tester-Clement | ✅ Complete |
| 19 | Card border/shadow styling | Frontend-Simon | ✅ Complete |
| 20 | Review card styling | Reviewer-Ben | ✅ Complete |
| 21 | Validate dev/prod sync | Sync-Tom | ✅ Complete (all files in sync) |

### Features Implemented

| Feature | Description |
|---------|-------------|
| **Section Title** | "Botanika Arôme Collection" with header nav link |
| **Subtitle** | Two lines: "Body Scrub Cream" / "Natural Intensive Moisturizing" |
| **Sale Badge** | "Available for Purchase" green pill badge |
| **Product Carousel** | 4 products with floating effect, auto-scroll |
| **Product Cards** | Image + Name + Tagline (Jasmine Rice, Rose, Tamarind, Turmeric) |
| **Lightbox** | Full description, skin benefits, "Available at all branches" badge |
| **Lightbox Zoom** | Click image to view full-screen, ESC to close |
| **Responsive** | Desktop shows all 4 cards (no dots), mobile has scroll with dots |
| **Card Styling** | Thicker borders (1.6px) with shadow effect on all cards |
| **Translations** | 6 languages (EN, TH, ES, FR, KO, ZH) |

### Design Spec
`docs/superpowers/specs/2026-04-27-arome-collection-design.md`

### Final Commit
`e5e1b8a` - All files in sync between local and VPS

---

## Completed - Branch Image Gallery Feature (Session: botanika update 1)

| # | Task | Agent | Status |
|---|------|-------|--------|
| 1 | Gallery structure for all branches | Simon | ✅ Complete |
| 2 | Card layout verification | Simon | ✅ Complete |
| 3 | Full code review | Ben | ✅ Complete |
| 4 | Test local modifications | Clement | ✅ Complete |
| 5 | Push gallery images to GitHub | Grace | ✅ Complete (commit: 66e517d) |
| 6 | Deploy gallery to VPS | Victor | ✅ Complete |
| 7 | Test VPS production | Clement | ✅ Complete (33/33 images) |
| 8 | Validate dev/prod sync | Sync-Tom | ✅ Complete (found 5 files out of sync) |
| 9 | Push component fixes to GitHub | Grace | ✅ Complete (commit: c3209d3) |
| 10 | Deploy component fixes to VPS | Victor | ✅ Complete |

### Branch Images Added

| Branch | Folder | Images | Status |
|--------|--------|--------|--------|
| Decho | `/images/branches/decho/` | 5 | ✅ Complete |
| Silom | `/images/branches/silom/` | 8 | ✅ Complete |
| Silom 13 | `/images/branches/silom-13/` | 5 | ✅ Complete |
| Sala Daeng | `/images/branches/sala-daeng/` | 7 | ✅ Complete |
| Patpong | `/images/branches/patpong/` | 8 | ✅ Complete |

**Total: 33 images across 5 branches**

---

## Pending (Next Session)

### #10 Add animation videos to each service
**Status:** Blocked
**Blocker:** Need animation files (Lottie JSON or MP4)

---

### #12 Add nail products promotion section
**Status:** Pending
**Needs:** Nail product images from client

---

## Notes

### Ports
| Environment | Frontend | Backend |
|-------------|----------|---------|
| Local | 3002 | 5002 |
| VPS | 3002 | 5002 |

### Agents Used
| Agent | Tasks |
|-------|-------|
| VPS-Victor | Deploy, nginx/SSL |
| Frontend-Simon | Favicon, UI, branch images |
| Backend-Sebas | Bot health, sync validator |
| GitHub-Grace | GitHub upload, commits |
| Sync-Tom | Dev/prod validation |
| Tester-Clement | Local/VPS testing |
| Docker-Dave | Container rebuilds |

### Commands

**Local rebuild:**
```powershell
cd 'C:\Users\LENOVO.LENOVO\AI\botanika'
docker compose down
docker builder prune -af
docker compose build --no-cache
docker compose up -d
```

**VPS deploy:**
```bash
ssh root@72.62.64.54 "cd /root/botanika && git pull && docker compose build --no-cache frontend && docker compose up -d"
```

**Validate sync:**
```bash
bash scripts/validate-sync.sh
```
