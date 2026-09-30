import sys
from playwright.sync_api import sync_playwright

def test_page():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        
        # Test Desktop 1440x900
        page = browser.new_page(viewport={"width": 1440, "height": 900})
        errors = []
        page.on("pageerror", lambda err: errors.append(str(err)))
        page.on("console", lambda msg: errors.append(f"CONSOLE {msg.type}: {msg.text}") if msg.type == "error" else None)
        
        print("Navigating to http://localhost:8080/index.html...")
        page.goto("http://localhost:8080/index.html", wait_until="networkidle")
        page.wait_for_timeout(2000)
        
        # Check desktop overflow
        overflow = page.evaluate("() => document.documentElement.scrollWidth > window.innerWidth")
        print(f"Desktop 1440px Horizontal Overflow: {overflow}")
        
        page.screenshot(path="desktop_workspace_hero.png", full_page=False)
        print("Saved desktop_workspace_hero.png")
        
        # Open 30-Second Registration Popup
        print("Opening 30-Second Registration Popup...")
        page.click("#navRegisterBtn")
        page.wait_for_timeout(800)
        page.screenshot(path="registration_popup_30s.png", full_page=False)
        print("Saved registration_popup_30s.png")
        
        # Close popup
        page.click("#closeRegModalBtn")
        page.wait_for_timeout(500)
        
        # Test Mobile 390x844
        mobile_page = browser.new_page(viewport={"width": 390, "height": 844})
        mobile_page.goto("http://localhost:8080/index.html", wait_until="networkidle")
        mobile_page.wait_for_timeout(2000)
        
        mobile_overflow = mobile_page.evaluate("() => document.documentElement.scrollWidth > window.innerWidth")
        print(f"Mobile 390px Horizontal Overflow: {mobile_overflow}")
        
        mobile_page.screenshot(path="mobile_workspace_hero.png", full_page=False)
        print("Saved mobile_workspace_hero.png")
        
        print(f"Total Console/Page Errors: {len(errors)}")
        for err in errors:
            print("ERR:", err)
            
        browser.close()

if __name__ == "__main__":
    test_page()
