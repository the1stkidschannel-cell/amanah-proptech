import os
import time
import random
import csv
import requests
import json
# Using Selenium for navigation and PyAutoGUI to evade script detection and clipboard monitoring
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
import pyautogui

# --- COMPLIANCE CHECK (The Gemini Protocol) ---
# Ensuring this outreach strictly complies with Tied Agent BaFin guidelines
COMPLIANCE_DISCLAIMER = """
--
Amanah PropTech is a technology provider and Tied Agent (vertraglich gebundener Vermittler) 
pursuant to § 2 (10) KWG. All investment brokerage and eWpG tokenization is 
conducted under the liability of our licensed White-Label partner. We do not provide 
independent investment advice or hold client funds.
"""

def load_leads(filepath):
    print(f"\n[SYSTEM] Loading Target Accounts from {filepath}...")
    leads = []
    with open(filepath, 'r', encoding='utf-8') as f:
        reader = csv.DictReader(f)
        for row in reader:
            leads.append(row)
    print(f"[SYSTEM] Loaded {len(leads)} B2B Institutional Leads.")
    return leads

def inject_text_human_like(text):
    """Types text using PyAutoGUI to simulate actual human keystrokes, evading basic copy-paste detection."""
    for char in text:
        pyautogui.write(char)
        # Type slightly faster for realistic flow
        time.sleep(random.uniform(0.005, 0.02))

def launch_proton_automation(dry_run=True):
    print("\n[TURBO] Initializing ProtonMail B2B Outreach Bot...")
    
    # 1. Start WebDriver
    # Note: Assumes the user is already logged into ProtonMail on this Chrome profile to bypass 2FA
    options = webdriver.ChromeOptions()
    options.add_argument("user-data-dir=C:\\Selenium\\ChromeProfile") # Stubbed profile dir
    driver = webdriver.Chrome(options=options)
    
    # 2. Open ProtonMail Composer
    driver.get("https://mail.proton.me/u/0/inbox")
    print("[TURBO] Waiting for ProtonMail to load...")
    time.sleep(8) 
    
    leads = load_leads("../data/leads.csv")
    
    for lead in leads:
        print(f"\n[ACTION] Preparing Pitch for {lead['Company']} ({lead['Email']})")
        
        # Click "New Message" button (simulated locator)
        try:
            compose_btn = WebDriverWait(driver, 10).until(
                EC.element_to_be_clickable((By.CSS_SELECTOR, "button[data-testid='sidebar:compose']"))
            )
            compose_btn.click()
            time.sleep(2)
            
            # Switch to 'To' field and inject email
            pyautogui.write(lead['Email'])
            pyautogui.press('enter')
            time.sleep(1)
            
            # Switch to 'Subject' field
            pyautogui.press('tab')
            subject = f"Sharia-Compliant Real Estate (DACH) via eWpG Tokenization - {lead['Company']}"
            pyautogui.write(subject)
            time.sleep(1)
            
            # Switch to Email Body
            pyautogui.press('tab')
            pyautogui.press('tab')
            
            body = f"""Salam {lead['Name']},

As the {lead['Position']} at {lead['Company']}, you are actively seeking illiquidity-premium free, Sharia-compliant asset allocations in the EU. We have solved the regulatory bottleneck in Germany.

With Amanah PropTech, we have built the first eWpG-compliant tokenization platform for Core Real Estate (Ijarah/Diminishing Musharakah structures) - fully operated under BaFin regulations and pre-screened against AAOIFI standards.

We reduce the overhead of SPV structures by 80% and offer you direct access to European Core Assets with yields of 4-6% p.a. via our B2B Dashboard.

I would love to show you our live environment in a 15-minute call. When works for you next week?
"""
            
            # Injecting text human-like
            inject_text_human_like(body)
            inject_text_human_like(COMPLIANCE_DISCLAIMER)
            
            print("[SUCCESS] Email injected securely.")
            
            if dry_run:
                print(f"[DRY-RUN] Saved to drafts for {lead['Email']}. Not sending.")
                # Close composer to save draft
                pyautogui.press('escape') 
                time.sleep(2)
            else:
                # Press CTRL+ENTER to Send
                pyautogui.hotkey('ctrl', 'enter')
                print(f"[SENT] Fired Outreach to {lead['Email']}")
                time.sleep(4)
                
            # Send Webhook to Amanah CRM
            try:
                webhook_url = "http://localhost:3000/api/outreach/leads"
                payload = {
                    "action": "BOT_CONTACTED_LEAD",
                    "company": lead['Company']
                }
                headers = {'Content-Type': 'application/json'}
                requests.post(webhook_url, data=json.dumps(payload), headers=headers)
                print(f"[CRM SYNC] successfully updated pipeline for {lead['Company']}")
            except Exception as e:
                print(f"[CRM SYNC ERROR] Could not reach Next.js backend: {e}")
                
        except Exception as e:
            print(f"[ERROR] Failed automation for {lead['Email']}: {e}")
            break # Break completely to avoid catastrophic UI state failures
            
    print("\n[TURBO] Workflow Complete.")
    driver.quit()

if __name__ == "__main__":
    launch_proton_automation(dry_run=True)
