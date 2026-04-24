"""
QR Code Generator for Botanika Massage Branches
Generates QR codes with centered logo for 5 branch locations
"""

import qrcode
from qrcode.image.styledpil import StyledPilImage
from qrcode.image.styles.moduledrawers import RoundedModuleDrawer
from qrcode.image.styles.colormasks import SolidFillColorMask
from PIL import Image
import os

# Configuration
QR_COLOR = (27, 94, 58)  # Deep Green #1B5E3A
BG_COLOR = (255, 255, 255)  # White #FFFFFF
LOGO_PATH = r"G:\My Drive\Simon\Botanika\Logo\leaf only.jpg"

# Output directories
WEB_OUTPUT_DIR = r"C:\Users\LENOVO.LENOVO\AI\botanika\frontend\public\images\qr"
PRINT_OUTPUT_DIR = r"C:\Users\LENOVO.LENOVO\AI\botanika\frontend\public\images\qr\print"

# Branch data: (name, filename, url)
BRANCHES = [
    ("Silom", "qr-silom", "https://www.google.com/maps/place/Botanika+Massage+-+Silom/@13.7233072,100.5163592,17z/data=!3m1!4b1!4m6!3m5!1s0x30e29931f34d7ef7:0x17e81b36923e331f!8m2!3d13.723302!4d100.5189341!16s%2Fg%2F11h3cjqkbs"),
    ("Silom 13", "qr-silom-13", "https://www.google.com/maps/place/Botanika+Massage-Silom13/@13.7248107,100.5217457,17z/data=!3m1!4b1!4m6!3m5!1s0x30e299d34ae81e39:0x9f52d390dbefb0a2!8m2!3d13.7248055!4d100.5243206!16s%2Fg%2F11n4cqh33t"),
    ("Decho", "qr-decho", "https://www.google.com/maps/place/Botanika+Massage+-+Decho/@13.72568,100.523154,17z/data=!3m1!4b1!4m6!3m5!1s0x30e29f58393c0e67:0x54271c2db5ab09b4!8m2!3d13.7256748!4d100.5257289!16s%2Fg%2F11t30w1ddh"),
    ("Sala Daeng", "qr-sala-daeng", "https://www.google.com/maps/place/Botanika+Massage+-+Sala+Daeng/@13.7305095,100.5305506,17z/data=!3m1!4b1!4m6!3m5!1s0x30e29f6c00c7b0dd:0x18d4cc32b10438ed!8m2!3d13.7305043!4d100.5331255!16s%2Fg%2F11n31mgbw_"),
    ("Patpong", "qr-patpong", "https://www.google.com/maps/place/Botanika+Massage+-+Patpong/@13.7297281,100.528696,17z/data=!3m1!4b1!4m6!3m5!1s0x30e29f0063fb3c29:0x75f4614c7f1ba717!8m2!3d13.7297229!4d100.5312709!16s%2Fg%2F11whfcgc51"),
]

def create_qr_with_logo(url, output_path, size, logo_path):
    """
    Generate a QR code with custom colors and centered logo
    """
    # Create QR code with high error correction for logo overlay
    qr = qrcode.QRCode(
        version=None,  # Auto-determine version
        error_correction=qrcode.constants.ERROR_CORRECT_H,  # High error correction (30%)
        box_size=10,
        border=2,
    )
    qr.add_data(url)
    qr.make(fit=True)

    # Generate styled QR code with custom colors
    img = qr.make_image(
        image_factory=StyledPilImage,
        module_drawer=RoundedModuleDrawer(),
        color_mask=SolidFillColorMask(
            back_color=BG_COLOR,
            front_color=QR_COLOR
        )
    )

    # Convert to PIL Image if needed
    if hasattr(img, 'get_image'):
        img = img.get_image()

    # Resize to target size
    img = img.resize((size, size), Image.Resampling.LANCZOS)

    # Add logo in center
    if os.path.exists(logo_path):
        logo = Image.open(logo_path)

        # Calculate logo size (about 20% of QR code)
        logo_max_size = int(size * 0.22)

        # Resize logo while maintaining aspect ratio
        logo_ratio = min(logo_max_size / logo.width, logo_max_size / logo.height)
        logo_new_size = (int(logo.width * logo_ratio), int(logo.height * logo_ratio))
        logo = logo.resize(logo_new_size, Image.Resampling.LANCZOS)

        # Create circular mask for logo
        # First create a white background circle
        logo_bg_size = max(logo_new_size) + 20  # Add padding
        logo_bg = Image.new('RGBA', (logo_bg_size, logo_bg_size), (255, 255, 255, 255))

        # Calculate position to paste logo on white background
        logo_x = (logo_bg_size - logo_new_size[0]) // 2
        logo_y = (logo_bg_size - logo_new_size[1]) // 2

        # Convert logo to RGBA if needed
        if logo.mode != 'RGBA':
            logo = logo.convert('RGBA')

        logo_bg.paste(logo, (logo_x, logo_y), logo if logo.mode == 'RGBA' else None)

        # Calculate position to center the logo+background on QR code
        img = img.convert('RGBA')
        pos_x = (size - logo_bg_size) // 2
        pos_y = (size - logo_bg_size) // 2

        # Paste logo with background
        img.paste(logo_bg, (pos_x, pos_y), logo_bg)

        # Convert back to RGB for PNG saving
        img = img.convert('RGB')

    # Save the image
    img.save(output_path, 'PNG', quality=95)
    print(f"  Created: {output_path}")
    return img

def create_svg_qr(url, output_path):
    """
    Generate an SVG version of the QR code (without logo - logo needs to be added separately)
    """
    import qrcode.image.svg

    # Create custom SVG factory with green color
    class GreenSvgPathImage(qrcode.image.svg.SvgPathImage):
        QR_PATH_STYLE = {
            'fill': '#1B5E3A',
            'fill-opacity': '1',
        }

    qr = qrcode.QRCode(
        version=None,
        error_correction=qrcode.constants.ERROR_CORRECT_H,
        box_size=10,
        border=2,
    )
    qr.add_data(url)
    qr.make(fit=True)

    img = qr.make_image(image_factory=GreenSvgPathImage)
    img.save(output_path)
    print(f"  Created: {output_path}")

def main():
    print("=" * 60)
    print("Botanika QR Code Generator")
    print("=" * 60)

    # Ensure directories exist
    os.makedirs(WEB_OUTPUT_DIR, exist_ok=True)
    os.makedirs(PRINT_OUTPUT_DIR, exist_ok=True)

    # Check logo
    if not os.path.exists(LOGO_PATH):
        print(f"WARNING: Logo not found at {LOGO_PATH}")
        print("QR codes will be generated without logo")
    else:
        print(f"Logo found: {LOGO_PATH}")

    print()

    for branch_name, filename, url in BRANCHES:
        print(f"Generating QR codes for: {branch_name}")

        # Web size (300x300)
        web_path = os.path.join(WEB_OUTPUT_DIR, f"{filename}.png")
        create_qr_with_logo(url, web_path, 300, LOGO_PATH)

        # Print size PNG (1000x1000)
        print_png_path = os.path.join(PRINT_OUTPUT_DIR, f"{filename}.png")
        create_qr_with_logo(url, print_png_path, 1000, LOGO_PATH)

        # Print size SVG
        print_svg_path = os.path.join(PRINT_OUTPUT_DIR, f"{filename}.svg")
        create_svg_qr(url, print_svg_path)

        print()

    print("=" * 60)
    print("All QR codes generated successfully!")
    print("=" * 60)
    print(f"\nWeb size (300x300): {WEB_OUTPUT_DIR}")
    print(f"Print size (1000x1000 + SVG): {PRINT_OUTPUT_DIR}")

if __name__ == "__main__":
    main()
