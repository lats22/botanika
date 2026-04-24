"""
Generate QR code with CIRCULAR overall shape
- Overall shape: CIRCLE (not rounded rectangle)
- Dark green circular background #1B5E3A
- White QR modules
- Thin green border around the edge
- Center logo: ORIGINAL RECTANGULAR SHAPE with gold frame (NOT cropped to circle)
- Corners outside circle: TRANSPARENT
"""

import qrcode
from PIL import Image, ImageDraw
import os

# Configuration
OUTPUT_SIZE = 1000
BORDER_WIDTH = 8  # Thin border around the edge

# Colors
FRAME_COLOR = (27, 94, 58)  # Dark Green #1B5E3A
QR_COLOR = (255, 255, 255)  # White modules
GOLD_COLOR = (212, 175, 55)  # Gold frame for logo
TRANSPARENT = (0, 0, 0, 0)

# Paths
LOGO_PATH = r"G:\My Drive\Simon\Botanika\Logo\leaf only.jpg"
OUTPUT_PATH = r"C:\Users\LENOVO.LENOVO\AI\botanika\frontend\public\images\qr\sample\qr-circular-frame.png"

# URL for Silom branch
URL = "https://www.google.com/maps/place/Botanika+Massage+-+Silom/@13.7233072,100.5163592,17z/data=!3m1!4b1!4m6!3m5!1s0x30e29931f34d7ef7:0x17e81b36923e331f!8m2!3d13.723302!4d100.5189341!16s%2Fg%2F11h3cjqkbs"

def create_circular_mask(size):
    """Create a circular mask"""
    mask = Image.new('L', (size, size), 0)
    draw = ImageDraw.Draw(mask)
    draw.ellipse([0, 0, size - 1, size - 1], fill=255)
    return mask

def generate_circular_qr():
    print(f"Generating QR code with CIRCULAR frame...")
    print(f"Output size: {OUTPUT_SIZE}x{OUTPUT_SIZE}")

    # Padding inside the circle for QR code
    circle_padding = 40  # Space between circle edge and QR code
    qr_area_size = OUTPUT_SIZE - (circle_padding * 2) - (BORDER_WIDTH * 2)
    print(f"QR area size: {qr_area_size}x{qr_area_size}")

    # Generate QR code with high error correction for logo
    qr = qrcode.QRCode(
        version=None,  # Auto-size
        error_correction=qrcode.constants.ERROR_CORRECT_H,  # 30% error correction
        box_size=10,
        border=0,  # No border - we add our own
    )
    qr.add_data(URL)
    qr.make(fit=True)

    # Create QR code image with white modules on green background
    qr_img = qr.make_image(fill_color=QR_COLOR, back_color=FRAME_COLOR)
    qr_img = qr_img.convert('RGBA')

    # Get actual QR dimensions
    qr_actual_size = qr_img.size[0]
    print(f"Raw QR size: {qr_actual_size}x{qr_actual_size}")

    # Scale QR to fit the area
    qr_img = qr_img.resize((qr_area_size, qr_area_size), Image.LANCZOS)

    # Create final image with transparency
    final = Image.new('RGBA', (OUTPUT_SIZE, OUTPUT_SIZE), TRANSPARENT)

    # Create dark green circular background (slightly smaller for border)
    inner_circle_size = OUTPUT_SIZE - (BORDER_WIDTH * 2)
    green_circle = Image.new('RGBA', (inner_circle_size, inner_circle_size), (*FRAME_COLOR, 255))

    # Create circular mask for the green background
    green_mask = create_circular_mask(inner_circle_size)
    green_circle.putalpha(green_mask)

    # Create thin border circle (slightly larger, same green color but could be different shade)
    border_color = (20, 80, 50)  # Slightly different green for border
    border_circle = Image.new('RGBA', (OUTPUT_SIZE, OUTPUT_SIZE), (*border_color, 255))
    border_mask = create_circular_mask(OUTPUT_SIZE)
    border_circle.putalpha(border_mask)

    # Composite: first the border circle
    final = Image.alpha_composite(final, border_circle)

    # Then the inner green circle
    border_offset = BORDER_WIDTH
    final.paste(green_circle, (border_offset, border_offset), green_circle)

    # Paste QR code centered
    qr_offset = circle_padding + BORDER_WIDTH
    final.paste(qr_img, (qr_offset, qr_offset))

    # Re-apply the circular mask to ensure corners are transparent
    final_mask = create_circular_mask(OUTPUT_SIZE)
    final.putalpha(final_mask)

    # Add logo in center - KEEP ORIGINAL RECTANGULAR SHAPE with gold frame
    if os.path.exists(LOGO_PATH):
        print(f"Adding logo from: {LOGO_PATH}")
        logo = Image.open(LOGO_PATH)
        logo = logo.convert('RGBA')

        # Get original logo dimensions to maintain aspect ratio
        orig_width, orig_height = logo.size
        print(f"Original logo size: {orig_width}x{orig_height}")

        # Logo size - about 22% of QR area, maintain aspect ratio
        max_logo_size = int(qr_area_size * 0.24)

        # Calculate new size maintaining aspect ratio
        if orig_width > orig_height:
            new_width = max_logo_size
            new_height = int(max_logo_size * orig_height / orig_width)
        else:
            new_height = max_logo_size
            new_width = int(max_logo_size * orig_width / orig_height)

        logo = logo.resize((new_width, new_height), Image.LANCZOS)
        print(f"Resized logo: {new_width}x{new_height}")

        # Gold frame border width
        gold_border = 4

        # Create white background rectangle with gold frame
        bg_width = new_width + (gold_border * 2) + 8  # Extra padding
        bg_height = new_height + (gold_border * 2) + 8

        # Create gold frame rectangle
        gold_frame = Image.new('RGBA', (bg_width, bg_height), (*GOLD_COLOR, 255))

        # Create white inner rectangle
        white_inner = Image.new('RGBA', (bg_width - gold_border * 2, bg_height - gold_border * 2), (255, 255, 255, 255))

        # Paste white inner onto gold frame
        gold_frame.paste(white_inner, (gold_border, gold_border))

        # Paste logo onto the white background (centered)
        logo_x = (bg_width - new_width) // 2
        logo_y = (bg_height - new_height) // 2
        gold_frame.paste(logo, (logo_x, logo_y), logo if logo.mode == 'RGBA' else None)

        # Position gold-framed logo in center of the QR
        frame_pos_x = (OUTPUT_SIZE - bg_width) // 2
        frame_pos_y = (OUTPUT_SIZE - bg_height) // 2

        # Paste the gold-framed logo
        final.paste(gold_frame, (frame_pos_x, frame_pos_y), gold_frame)

        # Re-apply circular mask to ensure corners stay transparent
        final.putalpha(final_mask)

        print(f"Logo with gold frame added at center")
    else:
        print(f"Warning: Logo not found at {LOGO_PATH}")

    # Save the final image
    final.save(OUTPUT_PATH, 'PNG')
    print(f"Saved to: {OUTPUT_PATH}")
    print(f"Final size: {final.size}")

    return OUTPUT_PATH

if __name__ == "__main__":
    generate_circular_qr()
