import sys
import time
from playwright.sync_api import sync_playwright

def run_puppeteer_audit():
    print("=" * 60)
    print("STARTING COMPREHENSIVE PUPPETEER / PLAYWRIGHT AUDIT")
    print("=" * 60)
    
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        errors = []
        
        # ---------------------------------------------------------
        # 1. DESKTOP VIEWPORT (1440 x 900)
        # ---------------------------------------------------------
        print("\n[1/4] AUDITING DESKTOP (1440x900)...")
        page = browser.new_page(viewport={"width": 1440, "height": 900})
        page.on("pageerror", lambda err: errors.append(f"PAGE ERROR: {err}"))
        page.on("console", lambda msg: errors.append(f"CONSOLE {msg.type}: {msg.text}") if msg.type == "error" else None)
        
        page.goto("http://localhost:8080/index.html", wait_until="networkidle")
        page.wait_for_timeout(2000)
        
        # Check Desktop Horizontal Overflow
        desktop_overflow = page.evaluate("() => document.documentElement.scrollWidth > window.innerWidth")
        print(f"  - Desktop Horizontal Overflow: {desktop_overflow} (PASS: {not desktop_overflow})")
        
        # Check Lottie Neural Switcher
        print("  - Testing Lottie Matrix Switcher...")
        page.click("#tabLottieCore")
        page.wait_for_timeout(600)
        lottie_rendered = page.evaluate("() => document.querySelector('#lottieNeuralCore svg') !== null")
        print(f"  - Lottie Neural Core SVG Rendered: {lottie_rendered}")
        page.screenshot(path="audit_desktop_lottie.png", full_page=False)
        
        # Check if modal popped up, dismiss it if needed
        if page.evaluate("() => document.getElementById('modalStage').classList.contains('active')"):
            page.click("#closeModalBtn")
            page.wait_for_timeout(300)

        # Switch back to 3D Brain
        page.click("#tab3DBrain")
        page.wait_for_timeout(400)
        
        # Check Projects Lottie Wave
        lottie_wave_rendered = page.evaluate("() => document.querySelector('#lottieAnalyticsWave svg') !== null")
        print(f"  - Lottie Analytics Wave Rendered: {lottie_wave_rendered}")
        
        # Take full hero screenshot
        page.screenshot(path="audit_desktop_hero.png", full_page=False)
        print("  - Saved audit_desktop_hero.png")
        
        # Scroll to Curriculum & Projects
        page.evaluate("() => window.scrollTo(0, 1100)")
        page.wait_for_timeout(500)
        page.screenshot(path="audit_desktop_curriculum.png", full_page=False)
        print("  - Saved audit_desktop_curriculum.png")

        page.close()

        # ---------------------------------------------------------
        # 2. TABLET VIEWPORT (768 x 1024 - iPad Portrait)
        # ---------------------------------------------------------
        print("\n[2/4] AUDITING TABLET PORTRAIT (768x1024)...")
        tablet = browser.new_page(viewport={"width": 768, "height": 1024})
        tablet.goto("http://localhost:8080/index.html", wait_until="networkidle")
        tablet.wait_for_timeout(1500)
        
        tablet_overflow = tablet.evaluate("() => document.documentElement.scrollWidth > window.innerWidth")
        print(f"  - Tablet 768px Horizontal Overflow: {tablet_overflow} (PASS: {not tablet_overflow})")
        
        # Test Tablet Drawer Toggle
        print("  - Testing Tablet Drawer Menu Toggle...")
        tablet.click("#mobileMenuToggle")
        tablet.wait_for_timeout(400)
        drawer_open = tablet.evaluate("() => document.getElementById('mobileDrawer').classList.contains('open')")
        print(f"  - Drawer Menu Opened: {drawer_open}")
        tablet.screenshot(path="audit_tablet_menu.png", full_page=False)
        print("  - Saved audit_tablet_menu.png")
        
        # Close Drawer
        tablet.click("#mobileMenuToggle")
        tablet.wait_for_timeout(300)
        tablet.screenshot(path="audit_tablet_hero.png", full_page=False)
        print("  - Saved audit_tablet_hero.png")
        
        tablet.close()

        # ---------------------------------------------------------
        # 3. TABLET LANDSCAPE VIEWPORT (1024 x 768 - iPad Landscape)
        # ---------------------------------------------------------
        print("\n[3/4] AUDITING TABLET LANDSCAPE (1024x768)...")
        tab_land = browser.new_page(viewport={"width": 1024, "height": 768})
        tab_land.goto("http://localhost:8080/index.html", wait_until="networkidle")
        tab_land.wait_for_timeout(1500)
        
        tab_land_overflow = tab_land.evaluate("() => document.documentElement.scrollWidth > window.innerWidth")
        print(f"  - Tablet 1024px Horizontal Overflow: {tab_land_overflow} (PASS: {not tab_land_overflow})")
        tab_land.screenshot(path="audit_tablet_landscape.png", full_page=False)
        print("  - Saved audit_tablet_landscape.png")
        tab_land.close()

        # ---------------------------------------------------------
        # 4. MOBILE SMARTPHONE VIEWPORT (390 x 844 - iPhone 14/15)
        # ---------------------------------------------------------
        print("\n[4/4] AUDITING MOBILE SMARTPHONE (390x844)...")
        mobile = browser.new_page(viewport={"width": 390, "height": 844})
        mobile.goto("http://localhost:8080/index.html", wait_until="networkidle")
        mobile.wait_for_timeout(1500)
        
        mobile_overflow = mobile.evaluate("() => document.documentElement.scrollWidth > window.innerWidth")
        print(f"  - Mobile 390px Horizontal Overflow: {mobile_overflow} (PASS: {not mobile_overflow})")
        
        # Mobile hero screenshot
        mobile.screenshot(path="audit_mobile_hero.png", full_page=False)
        print("  - Saved audit_mobile_hero.png")
        
        # Test 5-Second Auto-Popup on mobile
        print("  - Waiting for 5-Second Auto-Popup...")
        mobile.wait_for_timeout(4000)
        popup_active = mobile.evaluate("() => document.getElementById('modalStage').classList.contains('active')")
        print(f"  - Mobile Auto-Popup Triggered after 5s: {popup_active}")
        mobile.screenshot(path="audit_mobile_popup.png", full_page=False)
        print("  - Saved audit_mobile_popup.png")
        
        mobile.close()
        
        # ---------------------------------------------------------
        # CONSOLE & PAGE ERRORS SUMMARY
        # ---------------------------------------------------------
        print("\n" + "=" * 60)
        print(f"TOTAL CONSOLE / PAGE ERRORS: {len(errors)}")
        for err in errors:
            print("  [ERROR]", err)
        print("=" * 60)
        
        browser.close()

if __name__ == "__main__":
    run_puppeteer_audit()
