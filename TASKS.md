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

---

## Pending

### #3 Add branch location images and videos
**Status:** Blocked
**Blocker:** Need to download images/videos from Google Maps for each branch
**Branches:**
- [ ] Silom
- [ ] Silom 13
- [ ] Decho
- [ ] Sala Daeng
- [ ] Patpong

**Action:** Save images from Google Maps to a folder, then share the path.

---

### #4 Add animation videos to each service
**Status:** Blocked
**Blocker:** Need animation files (Lottie JSON or MP4)
**Services:**
- [ ] Thai Massage
- [ ] Oil Massage
- [ ] Foot Massage
- [ ] Head & Shoulder
- [ ] Herbal Compress
- [ ] Aromatherapy

**Options:**
- Lottie animations (.json) - lightweight, scalable
- Video files (.mp4) - actual massage footage

---

## Notes

### Ports
| Environment | Frontend | Backend |
|-------------|----------|---------|
| Local | 3000 | 5000 |
| VPS | 3002 | 5002 |

### Agents Used
| Agent | Tasks |
|-------|-------|
| VPS-Victor | Deploy, nginx/SSL |
| Frontend-Simon | Favicon, UI |
| Backend-Sebas | Bot health, sync validator |
| GitHub-Grace | GitHub upload |
| Sync-Tom | Dev/prod validation |

### Commands

**Local rebuild:**
```powershell
cd 'C:\Users\LENOVO.LENOVO\AI\botanika'
docker-compose build --no-cache frontend
docker-compose up -d
```

**VPS deploy:**
```bash
ssh root@72.62.64.54 "cd /root/botanika && docker compose build --no-cache frontend && docker compose up -d"
```

**Validate sync:**
```bash
bash scripts/validate-sync.sh
```
