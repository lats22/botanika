"""
QR Code Generator - GREEN dots on WHITE background
Rounded rectangle frame with transparent corners
"""

import qrcode
from PIL import Image, ImageDraw
import os

# Configuration
URL = "https://www.google.com/maps/place/Botanika+Massage+-+Silom/@13.7233072,100.5163592,17z/data=!3m1!4b1!4m6!3m5!1s0x30e29931f34d7ef7:0x17e81b36923e331f!8m2!3d13.723302!4d100.5189341!16s%2Fg%2F11h3cjqkbs"
OUTPUT_PATH = r"C:\Users\LENOVO.LENOVO\AI\botanika\frontend\public\images\qr\sample\qr-green-dots-white-bg.png"
LOGO_PATH = r"G:\My Drive\Simon\Botanika\Logo\leaf only.jpg"

# Colors - RGB tuples
GREEN_RGB = (27, 94, 58)    # #1B5E3A - Green for QR dots
WHITE_RGB = (255, 255, 255) # #FFFFFF - White background
GOLD_RGB = (196, 168, 77)   # #C4A84D - Gold for logo frame

# Size
FINAL_SIZE = 1000
CORNER_RADIUS = 45
BORDER_WIDTH = 4

print("[Progress] Creating QR code with GREEN dots...")

# Create QR code
qr = qrcode.QRCode(
    version=None,
    error_correction=qrcode.constants.ERROR_CORRECT_H,
    box_size=10,
    border=4,
)
qr.add_data(URL)
qr.make(fit=True)

# Generate basic QR - we'll colorize it manually
qr_img = qr.make_image(fill_color="black", back_color="white")
qr_img = qr_img.convert("RGBA")
qr_size = qr_img.size[0]

print(f"[Progress] Base QR code generated: {qr_size}x{qr_size}")

# Colorize: Replace black with green, keep white
pixels = qr_img.load()
for y in range(qr_img.height):
    for x in range(qr_img.width):
        r, g, b, a = pixels[x, y]
        if r < 128 and g < 128 and b < 128:  # Dark pixel (black)
            pixels[x, y] = GREEN_RGB + (255,)  # Green
        else:  # Light pixel (white)
            pixels[x, y] = WHITE_RGB + (255,)  # White

print("[Progress] QR code colorized to GREEN dots on WHITE background")

# Scale QR to fit within final size with padding
padding = 60
inner_size = FINAL_SIZE - (padding * 2)
qr_img = qr_img.resize((inner_size, inner_size), Image.LANCZOS)

print("[Progress] Creating rounded rectangle frame...")

# Create final canvas with transparency
final_img = Image.new("RGBA", (FINAL_SIZE, FINAL_SIZE), (0, 0, 0, 0))

# Create rounded rectangle mask
mask = Image.new("L", (FINAL_SIZE, FINAL_SIZE), 0)
mask_draw = ImageDraw.Draw(mask)
mask_draw.rounded_rectangle(
    [0, 0, FINAL_SIZE - 1, FINAL_SIZE - 1],
    radius=CORNER_RADIUS,
    fill=255
)

# Create white background layer
bg_layer = Image.new("RGBA", (FINAL_SIZE, FINAL_SIZE), WHITE_RGB + (255,))

# Apply rounded mask to background
final_img.paste(bg_layer, (0, 0), mask)

# Paste QR code centered
qr_offset = padding
final_img.paste(qr_img, (qr_offset, qr_offset), qr_img)

# Re-apply mask to ensure clean rounded corners
temp = Image.new("RGBA", (FINAL_SIZE, FINAL_SIZE), (0, 0, 0, 0))
temp.paste(final_img, (0, 0), mask)
final_img = temp

# Add thin green border
draw = ImageDraw.Draw(final_img)
draw.rounded_rectangle(
    [BORDER_WIDTH//2, BORDER_WIDTH//2, FINAL_SIZE - 1 - BORDER_WIDTH//2, FINAL_SIZE - 1 - BORDER_WIDTH//2],
    radius=CORNER_RADIUS - BORDER_WIDTH//2,
    outline=GREEN_RGB + (255,),
    width=BORDER_WIDTH
)

print("[Progress] Adding logo with gold frame...")

# Load and process logo
if os.path.exists(LOGO_PATH):
    logo = Image.open(LOGO_PATH).convert("RGBA")

    # Keep original rectangular shape, scale to fit
    logo_max_size = 180
    logo_ratio = min(logo_max_size / logo.width, logo_max_size / logo.height)
    new_logo_width = int(logo.width * logo_ratio)
    new_logo_height = int(logo.height * logo_ratio)
    logo = logo.resize((new_logo_width, new_logo_height), Image.LANCZOS)

    print(f"[Progress] Logo resized to {new_logo_width}x{new_logo_height}")

    # Create gold frame (rectangular)
    frame_padding = 8
    frame_width = 4

    framed_width = new_logo_width + (frame_padding * 2) + (frame_width * 2)
    framed_height = new_logo_height + (frame_padding * 2) + (frame_width * 2)

    # Create framed logo image with white background
    framed_logo = Image.new("RGBA", (framed_width, framed_height), WHITE_RGB + (255,))
    framed_draw = ImageDraw.Draw(framed_logo)

    # Draw gold frame rectangle
    framed_draw.rectangle(
        [0, 0, framed_width - 1, framed_height - 1],
        outline=GOLD_RGB + (255,),
        width=frame_width
    )

    # Paste logo centered within frame
    logo_x = frame_width + frame_padding
    logo_y = frame_width + frame_padding
    framed_logo.paste(logo, (logo_x, logo_y), logo if logo.mode == 'RGBA' else None)

    # Position in center
    logo_pos_x = (FINAL_SIZE - framed_width) // 2
    logo_pos_y = (FINAL_SIZE - framed_height) // 2

    # Create white clearing area behind logo (slightly larger)
    clear_padding = 12
    clear_area = Image.new("RGBA", (framed_width + clear_padding * 2, framed_height + clear_padding * 2), WHITE_RGB + (255,))
    final_img.paste(clear_area, (logo_pos_x - clear_padding, logo_pos_y - clear_padding))

    # Paste framed logo
    final_img.paste(framed_logo, (logo_pos_x, logo_pos_y), framed_logo)

    print("[Progress] Logo with gold frame added")
else:
    print(f"[Warning] Logo not found at {LOGO_PATH}")

# Final mask application for clean transparent corners
final_with_transparency = Image.new("RGBA", (FINAL_SIZE, FINAL_SIZE), (0, 0, 0, 0))
final_with_transparency.paste(final_img, (0, 0), mask)

# Save
final_with_transparency.save(OUTPUT_PATH, "PNG")
print(f"[Progress] COMPLETE - Saved to: {OUTPUT_PATH}")
print(f"[Progress] Size: {FINAL_SIZE}x{FINAL_SIZE}px")
print("[Progress] Style: GREEN dots (#1B5E3A) on WHITE background (#FFFFFF)")
