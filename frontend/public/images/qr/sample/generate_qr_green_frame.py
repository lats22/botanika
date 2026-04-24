"""
Generate QR code with:
- GREEN FRAME (thick border)
- WHITE interior area
- GREEN QR dots on white
- Rectangular monstera logo with gold frame in center
- Rounded rectangle shape with transparent corners
"""

import qrcode
from PIL import Image, ImageDraw
import os

# Configuration
OUTPUT_SIZE = 1000
GREEN_COLOR = (27, 94, 58)  # #1B5E3A
WHITE_COLOR = (255, 255, 255)
GOLD_COLOR = (184, 157, 92)  # Gold for logo frame
CORNER_RADIUS = 45
FRAME_THICKNESS = 20  # Thick green frame

# URL for Silom branch
URL = "https://www.google.com/maps/place/Botanika+Massage+-+Silom/@13.7233072,100.5163592,17z/data=!3m1!4b1!4m6!3m5!1s0x30e29931f34d7ef7:0x17e81b36923e331f!8m2!3d13.723302!4d100.5189341!16s%2Fg%2F11h3cjqkbs"

# Logo path
LOGO_PATH = r"G:\My Drive\Simon\Botanika\Logo\leaf only.jpg"

# Output path
OUTPUT_PATH = r"C:\Users\LENOVO.LENOVO\AI\botanika\frontend\public\images\qr\sample\qr-green-dots-white-bg-v2.png"

def create_rounded_rect_mask(size, radius):
    """Create a mask with rounded corners"""
    mask = Image.new('L', (size, size), 0)
    draw = ImageDraw.Draw(mask)
    draw.rounded_rectangle([0, 0, size-1, size-1], radius=radius, fill=255)
    return mask

def generate_qr():
    print("[Progress] Creating QR code...")

    # Generate QR code with high error correction for logo
    qr = qrcode.QRCode(
        version=None,
        error_correction=qrcode.constants.ERROR_CORRECT_H,
        box_size=10,
        border=2,  # Minimal border since we'll add our own frame
    )
    qr.add_data(URL)
    qr.make(fit=True)

    # Create QR with green modules on white background
    qr_img = qr.make_image(fill_color=GREEN_COLOR, back_color=WHITE_COLOR)
    qr_img = qr_img.convert('RGBA')

    print(f"[Progress] QR code generated: {qr_img.size}")

    # Calculate sizes for the composition
    # The QR should fill most of the space inside the frame
    inner_size = OUTPUT_SIZE - (FRAME_THICKNESS * 2)

    # Resize QR to fit the inner area
    qr_img = qr_img.resize((inner_size, inner_size), Image.LANCZOS)

    print(f"[Progress] Creating canvas with green frame...")

    # Create main canvas with transparency
    canvas = Image.new('RGBA', (OUTPUT_SIZE, OUTPUT_SIZE), (0, 0, 0, 0))
    draw = ImageDraw.Draw(canvas)

    # Draw green frame (rounded rectangle)
    draw.rounded_rectangle(
        [0, 0, OUTPUT_SIZE-1, OUTPUT_SIZE-1],
        radius=CORNER_RADIUS,
        fill=GREEN_COLOR + (255,)
    )

    # Draw white interior (slightly smaller rounded rectangle)
    inner_radius = max(CORNER_RADIUS - FRAME_THICKNESS, 10)
    draw.rounded_rectangle(
        [FRAME_THICKNESS, FRAME_THICKNESS, OUTPUT_SIZE-1-FRAME_THICKNESS, OUTPUT_SIZE-1-FRAME_THICKNESS],
        radius=inner_radius,
        fill=WHITE_COLOR + (255,)
    )

    # Paste QR code onto the white area
    canvas.paste(qr_img, (FRAME_THICKNESS, FRAME_THICKNESS), qr_img)

    # Create rounded corners mask and apply to the whole thing
    mask = create_rounded_rect_mask(OUTPUT_SIZE, CORNER_RADIUS)

    # Apply mask for transparent corners
    final = Image.new('RGBA', (OUTPUT_SIZE, OUTPUT_SIZE), (0, 0, 0, 0))
    final.paste(canvas, (0, 0), mask)

    print("[Progress] Adding logo with gold frame...")

    # Load and prepare logo
    logo = Image.open(LOGO_PATH).convert('RGBA')

    # Keep original aspect ratio - rectangular
    logo_original_w, logo_original_h = logo.size

    # Logo size - about 15% of the output
    max_logo_dim = int(OUTPUT_SIZE * 0.15)

    # Calculate scaling to fit within max dimension while keeping aspect ratio
    scale = min(max_logo_dim / logo_original_w, max_logo_dim / logo_original_h)
    logo_w = int(logo_original_w * scale)
    logo_h = int(logo_original_h * scale)

    logo = logo.resize((logo_w, logo_h), Image.LANCZOS)

    # Create gold frame around logo
    frame_width = 4
    framed_w = logo_w + frame_width * 2
    framed_h = logo_h + frame_width * 2

    # Create framed logo image
    framed_logo = Image.new('RGBA', (framed_w, framed_h), GOLD_COLOR + (255,))
    framed_logo.paste(logo, (frame_width, frame_width), logo)

    # Calculate center position
    logo_x = (OUTPUT_SIZE - framed_w) // 2
    logo_y = (OUTPUT_SIZE - framed_h) // 2

    # Paste framed logo
    final.paste(framed_logo, (logo_x, logo_y), framed_logo)

    # Save output
    os.makedirs(os.path.dirname(OUTPUT_PATH), exist_ok=True)
    final.save(OUTPUT_PATH, 'PNG')

    print(f"[Progress] QR code saved to: {OUTPUT_PATH}")
    print(f"[Progress] Final size: {final.size}")

    return OUTPUT_PATH

if __name__ == "__main__":
    generate_qr()
