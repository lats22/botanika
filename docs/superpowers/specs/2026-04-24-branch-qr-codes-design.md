# Botanika Branch QR Codes - Design Spec

**Date:** 2026-04-24
**Status:** Approved

## Overview

Generate static QR codes for all 5 Botanika branch locations to be used on:
1. Website branch cards (local container development first)
2. Business cards (downloadable print files)

## Branches

| # | Branch Name | Address |
|---|-------------|---------|
| 1 | Silom | 316/8 Si Lom Rd, Suriya Wong, Bang Rak, Bangkok 10500 |
| 2 | Silom 13 | 711 Si Lom Rd, Si Lom, Bang Rak, Bangkok 10500 |
| 3 | Decho | 174/3 Silom Rd, Suriya Wong, Bang Rak, Bangkok 10500 |
| 4 | Sala Daeng | 8 Surawong Rd, Si Phraya, Bang Rak, Bangkok 10500 |
| 5 | Patpong | 18 Surawong Rd, Suriya Wong, Bang Rak, Bangkok 10500 |

## QR Code Specifications

### Type
- **Static QR codes** - URL embedded directly in QR image
- **No third-party dependency** - Works forever without external service

### Destination
- **Google Maps Place URL** (full URL, not shortened)
- Links to official Botanika business listing with reviews, photos, business info
- Same URLs will be used in website `branches.json`

### Design
- **QR Color:** Deep Green `#1B5E3A` (primary brand color)
- **Background:** White `#FFFFFF`
- **Center Logo:** Monstera leaf only (no text)
- **Logo Source:** `G:\My Drive\Simon\Botanika\Logo\leaf only.jpg`

### Output Files

#### For Website (branch cards)
- Format: PNG
- Size: 300x300px (optimized for web)
- Location: `botanika/frontend/public/images/qr/`

#### For Business Cards (print)
- Format: PNG + SVG
- Size: 1000x1000px
- Location: `botanika/frontend/public/images/qr/print/`

### File Naming Convention
```
qr-silom.png
qr-silom-13.png
qr-decho.png
qr-sala-daeng.png
qr-patpong.png
```

## Website Integration

### Update branches.json
Replace current `mapsUrl` values with full Google Maps Place URLs for all branches.

### Branch Card Component
Add QR code image to each branch card in the locations section.

### Development Environment
- Implement and test locally in Docker container first
- Port: 8931 (bar-tracker-dev) or as configured for botanika

## Tasks

1. **Research** - Find full Google Maps Place URLs for all 5 branches
2. **Generate QR Codes** - Create QR codes with logo for all branches (web + print sizes)
3. **Update branches.json** - Replace mapsUrl with full Place URLs
4. **Update BranchCard** - Add QR code display to branch cards
5. **Test** - Verify QR codes work and display correctly in container

## Success Criteria

- [ ] All 5 QR codes scan correctly to Google Maps Place listings
- [ ] QR codes display on branch cards in website
- [ ] Print-quality files (1000x1000, PNG+SVG) available for download
- [ ] branches.json updated with full Google Maps URLs
- [ ] Tested in local Docker container
