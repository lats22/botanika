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

### #16 Add WhatsApp notification to contact form
**Status:** Blocked
**Blocker:** Need Meta Business account and WhatsApp Business API setup

**Summary:**
- Remove email notification (Nodemailer/Gmail) from contact form
- Add WhatsApp notification via Meta Cloud API (free tier: 1,000 conversations/month)
- Admin phone: +66955707650

**WhatsApp Message Content:**
- Customer Name
- Phone Number
- Email Address
- Message

**Setup Steps (user action required):**
1. Create Meta Business account at https://business.facebook.com
2. Go to Meta Developer Console: https://developers.facebook.com
3. Create app → Select "Business" type
4. Add WhatsApp product to app
5. Verify business and add phone number
6. Get Phone Number ID and Access Token
7. Share credentials with Fred to continue implementation

**Files to modify:**
- `backend/routes/contact.js` - Replace email logic with WhatsApp API call
- `backend/.env` - Add WHATSAPP_TOKEN and WHATSAPP_PHONE_ID

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
