"""
Botanika QR Code Generator - White Background ONLY
Regenerates white background QR codes with CORRECT styling:
- Full WHITE background/frame (NO green border)
- Green QR dots
- Rounded corners (~45px)
- Transparent corners outside rounded rectangle
- Logo with gold frame in center

This is the INVERSE of the green version:
- Green version: GREEN frame, WHITE QR dots
- White version: WHITE frame, GREEN QR dots
"""

import qrcode
from PIL import Image, ImageDraw
import os

# Configuration
OUTPUT_SIZE = 1000
CORNER_RADIUS = 45
GREEN_COLOR = (27, 94, 58)  # #1B5E3A
WHITE_COLOR = (255, 255, 255)
GOLD_COLOR = (184, 157, 92)  # Gold for logo frame

# Frame width (same as green version)
FRAME_WIDTH = 20

# Paths
LOGO_PATH = r"G:\My Drive\Simon\Botanika\Logo\leaf only.jpg"
OUTPUT_DIR = r"C:\Users\LENOVO.LENOVO\AI\botanika\frontend\public\images\qr\print\white-bg"

# Branch data: (name, filename, url)
BRANCHES = [
    ("Silom", "qr-silom", "https://www.google.com/maps/place/Botanika+Massage+-+Silom/@13.7233072,100.5163592,17z/data=!3m1!4b1!4m6!3m5!1s0x30e29931f34d7ef7:0x17e81b36923e331f!8m2!3d13.723302!4d100.5189341!16s%2Fg%2F11h3cjqkbs"),
    ("Silom 13", "qr-silom-13", "https://www.google.com/maps/place/Botanika+Massage-Silom13/@13.7248107,100.5217457,17z/data=!3m1!4b1!4m6!3m5!1s0x30e299d34ae81e39:0x9f52d390dbefb0a2!8m2!3d13.7248055!4d100.5243206!16s%2Fg%2F11n4cqh33t"),
    ("Decho", "qr-decho", "https://www.google.com/maps/place/Botanika+Massage+-+Decho/@13.72568,100.523154,17z/data=!3m1!4b1!4m6!3m5!1s0x30e29f58393c0e67:0x54271c2db5ab09b4!8m2!3d13.7256748!4d100.5257289!16s%2Fg%2F11t30w1ddh"),
    ("Sala Daeng", "qr-sala-daeng", "https://www.google.com/maps/place/Botanika+Massage+-+Sala+Daeng/@13.7305095,100.5305506,17z/data=!3m1!4b1!4m6!3m5!1s0x30e29f6c00c7b0dd:0x18d4cc32b10438ed!8m2!3d13.7305043!4d100.5331255!16s%2Fg%2F11n31mgbw_"),
    ("Patpong", "qr-patpong", "https://www.google.com/maps/place/Botanika+Massage+-+Patpong/@13.7297281,100.528696,17z/data=!3m1!4b1!4m6!3m5!1s0x30e29f0063fb3c29:0x75f4614c7f1ba717!8m2!3d13.7297229!4d100.5312709!16s%2Fg%2F11whfcgc51"),
]

def create_rounded_rect_mask(size, radius):
    """Create a mask with rounded corners"""
    mask = Image.new('L', (size, size), 0)
    draw = ImageDraw.Draw(mask)
    draw.rounded_rectangle([0, 0, size-1, size-1], radius=radius, fill=255)
    return mask

def load_logo():
    """Load and prepare logo"""
    if not os.path.exists(LOGO_PATH):
        print(f"[Warning] Logo not found at {LOGO_PATH}")
        return None
    return Image.open(LOGO_PATH).convert('RGBA')

def create_framed_logo(logo, max_size):
    """Create logo with gold frame, maintaining rectangular shape"""
    if logo is None:
        return None, 0, 0

    # Keep original aspect ratio
    logo_w, logo_h = logo.size
    scale = min(max_size / logo_w, max_size / logo_h)
    new_w = int(logo_w * scale)
    new_h = int(logo_h * scale)

    resized_logo = logo.resize((new_w, new_h), Image.LANCZOS)

    # Create gold frame
    frame_width = 4
    framed_w = new_w + frame_width * 2
    framed_h = new_h + frame_width * 2

    # Create framed logo with white background inside gold frame
    framed = Image.new('RGBA', (framed_w, framed_h), GOLD_COLOR + (255,))
    # White interior
    inner = Image.new('RGBA', (new_w, new_h), WHITE_COLOR + (255,))
    framed.paste(inner, (frame_width, frame_width))
    # Paste logo
    framed.paste(resized_logo, (frame_width, frame_width), resized_logo)

    return framed, framed_w, framed_h

def generate_qr_matrix(url):
    """Generate QR code data matrix"""
    qr = qrcode.QRCode(
        version=None,
        error_correction=qrcode.constants.ERROR_CORRECT_H,
        box_size=10,
        border=2,
    )
    qr.add_data(url)
    qr.make(fit=True)
    return qr

def generate_white_bg_qr(url, output_png, output_svg, logo):
    """
    CORRECT Style: White background with green QR dots
    - Rounded rectangle overall shape
    - FULL WHITE background (like green version has full green background)
    - GREEN QR modules
    - Logo with gold frame in center
    - Transparent corners outside rounded rectangle

    NO GREEN BORDER - this is the opposite of green version
    """
    print(f"  [White BG] Generating PNG...")

    qr = generate_qr_matrix(url)

    # Create QR with green dots on white background
    qr_img = qr.make_image(fill_color=GREEN_COLOR, back_color=WHITE_COLOR)
    qr_img = qr_img.convert('RGBA')

    # Calculate sizes - same as green version
    inner_size = OUTPUT_SIZE - (FRAME_WIDTH * 2)
    qr_img = qr_img.resize((inner_size, inner_size), Image.LANCZOS)

    # Create canvas with transparency
    canvas = Image.new('RGBA', (OUTPUT_SIZE, OUTPUT_SIZE), (0, 0, 0, 0))
    draw = ImageDraw.Draw(canvas)

    # Draw WHITE background (rounded rectangle) - FULL WHITE, NO GREEN BORDER
    draw.rounded_rectangle(
        [0, 0, OUTPUT_SIZE-1, OUTPUT_SIZE-1],
        radius=CORNER_RADIUS,
        fill=WHITE_COLOR + (255,)
    )

    # Paste QR code (green dots on white)
    canvas.paste(qr_img, (FRAME_WIDTH, FRAME_WIDTH))

    # Apply rounded mask for transparent corners
    mask = create_rounded_rect_mask(OUTPUT_SIZE, CORNER_RADIUS)
    final = Image.new('RGBA', (OUTPUT_SIZE, OUTPUT_SIZE), (0, 0, 0, 0))
    final.paste(canvas, (0, 0), mask)

    # Add logo
    if logo is not None:
        logo_size = int(OUTPUT_SIZE * 0.15)
        framed_logo, fw, fh = create_framed_logo(logo.copy(), logo_size)
        if framed_logo:
            logo_x = (OUTPUT_SIZE - fw) // 2
            logo_y = (OUTPUT_SIZE - fh) // 2
            # Clear area behind logo with WHITE (matching background)
            clear_pad = 8
            clear = Image.new('RGBA', (fw + clear_pad*2, fh + clear_pad*2), WHITE_COLOR + (255,))
            final.paste(clear, (logo_x - clear_pad, logo_y - clear_pad))
            final.paste(framed_logo, (logo_x, logo_y), framed_logo)

    # Save PNG
    final.save(output_png, 'PNG')
    print(f"    Saved: {output_png}")

    # Generate SVG
    print(f"  [White BG] Generating SVG...")
    generate_svg_white_bg(url, output_svg)

def generate_svg_white_bg(url, output_svg):
    """Generate SVG with FULL WHITE background and GREEN QR modules - NO green border"""
    qr = generate_qr_matrix(url)
    matrix = qr.get_matrix()
    module_count = len(matrix)

    # SVG dimensions
    svg_size = 1000
    padding = 20  # Same as green version
    qr_area = svg_size - (padding * 2)
    module_size = qr_area / module_count

    svg_content = f'''<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"
     viewBox="0 0 {svg_size} {svg_size}" width="{svg_size}" height="{svg_size}">
  <defs>
    <clipPath id="rounded-clip">
      <rect x="0" y="0" width="{svg_size}" height="{svg_size}" rx="45" ry="45"/>
    </clipPath>
  </defs>

  <!-- FULL WHITE background with rounded corners - NO GREEN BORDER -->
  <rect x="0" y="0" width="{svg_size}" height="{svg_size}" rx="45" ry="45" fill="#FFFFFF"/>

  <!-- Green QR modules -->
  <g fill="#1B5E3A">
'''

    # Add QR modules
    for row_idx, row in enumerate(matrix):
        for col_idx, cell in enumerate(row):
            if cell:
                x = padding + (col_idx * module_size)
                y = padding + (row_idx * module_size)
                svg_content += f'    <rect x="{x:.2f}" y="{y:.2f}" width="{module_size:.2f}" height="{module_size:.2f}"/>\n'

    # Logo placeholder (center white rectangle with gold border)
    logo_size = 150
    logo_x = (svg_size - logo_size) / 2
    logo_y = (svg_size - logo_size) / 2

    svg_content += f'''  </g>

  <!-- Logo area (white background for logo) -->
  <rect x="{logo_x-4}" y="{logo_y-4}" width="{logo_size+8}" height="{logo_size+8}" fill="#B89D5C"/>
  <rect x="{logo_x}" y="{logo_y}" width="{logo_size}" height="{logo_size}" fill="#FFFFFF"/>

  <!-- Note: Embed actual logo image here or use external reference -->
</svg>'''

    with open(output_svg, 'w', encoding='utf-8') as f:
        f.write(svg_content)
    print(f"    Saved: {output_svg}")

def main():
    print("=" * 60)
    print("Botanika QR Code Generator - White Background ONLY")
    print("CORRECT STYLE: Full white frame, green QR dots")
    print("=" * 60)
    print(f"Output size: {OUTPUT_SIZE}x{OUTPUT_SIZE}px")
    print(f"Output directory: {OUTPUT_DIR}")
    print()

    # Ensure directory exists
    os.makedirs(OUTPUT_DIR, exist_ok=True)

    # Load logo once
    logo = load_logo()
    if logo:
        print(f"[Progress] Logo loaded: {logo.size}")
    else:
        print("[Progress] Continuing without logo")

    print()

    for branch_name, filename, url in BRANCHES:
        print(f"[Progress] {branch_name}:")

        png_path = os.path.join(OUTPUT_DIR, f"{filename}.png")
        svg_path = os.path.join(OUTPUT_DIR, f"{filename}.svg")
        generate_white_bg_qr(url, png_path, svg_path, logo)

        print()

    print("=" * 60)
    print("[Progress] COMPLETE - All white-bg QR codes regenerated!")
    print("=" * 60)

    # Verify files
    print("\nVerifying generated files:")
    all_files_exist = True

    for branch_name, filename, url in BRANCHES:
        files = [
            os.path.join(OUTPUT_DIR, f"{filename}.png"),
            os.path.join(OUTPUT_DIR, f"{filename}.svg"),
        ]
        for f in files:
            exists = os.path.exists(f)
            status = "OK" if exists else "MISSING"
            print(f"  [{status}] {f}")
            if not exists:
                all_files_exist = False

    print()
    if all_files_exist:
        print("[SUCCESS] All 10 white-bg files generated successfully!")
    else:
        print("[ERROR] Some files are missing!")

if __name__ == "__main__":
    main()
