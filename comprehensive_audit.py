import sys
from playwright.sync_api import sync_playwright

VIEWPORTS = [
    (320, 568),   # iPhone SE 1st gen
    (360, 800),   # Galaxy S20
    (375, 667),   # iPhone SE / 8
    (390, 844),   # iPhone 13/14
    (412, 915),   # Pixel 7
    (430, 932),   # iPhone 14 Pro Max
    (480, 854),   # Large mobile / phablet
    (600, 960),   # Small tablet portrait
    (768, 1024),  # iPad portrait
    (820, 1180),  # iPad Air portrait
    (991, 768),   # Just below desktop breakpoint
    (1024, 768),  # iPad landscape / small laptop
    (1100, 800),  # Mid laptop
    (1280, 800),  # Standard laptop
    (1366, 768),  # Common laptop
    (1440, 900),  # Standard desktop
    (1920, 1080), # Full HD desktop
    (2560, 1440), # QHD / 2K monitor
]

def main():
    failed = False
    with sync_playwright() as p:
        browser = p.chromium.launch()
        for w, h in VIEWPORTS:
            page = browser.new_page(viewport={"width": w, "height": h})
            console_errors = []
            page.on("console", lambda msg: console_errors.append(msg.text) if msg.type == "error" else None)
            page.goto("http://localhost:8080")
            page.wait_for_load_state("networkidle")
            
            # Check horizontal overflow
            scroll_width = page.evaluate("document.documentElement.scrollWidth")
            inner_width = page.evaluate("window.innerWidth")
            diff = scroll_width - inner_width
            
            status = "PASS" if diff <= 0 else f"FAIL (+{diff}px overflow)"
            if diff > 0 or console_errors:
                failed = True
            print(f"[{status}] {w}x{h}: scrollWidth={scroll_width}, innerWidth={inner_width}, errors={len(console_errors)}")
            page.close()
        browser.close()
    
    if failed:
        sys.exit(1)
    else:
        print("\nALL 18 VIEWPORTS AUDITED SUCCESSFULLY: 0 HORIZONTAL OVERFLOW & 0 CONSOLE ERRORS.")

if __name__ == "__main__":
    main()
