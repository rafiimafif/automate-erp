"""
What is this for:
Home Page Object. Encapsulates all interactions on the main dashboard grid after login.
"""
from .base_page import BasePage

class HomePage(BasePage):
    HEADER = "header"
    LOGOUT_BUTTON = "button[title='Sign Out']"
    WELCOME_TEXT = "xpath=//h1[contains(text(), 'Welcome')]"
    INVENTORY_CARD = "xpath=//button[h3[text()='Inventory']]"
    DASHBOARD_CARD = "xpath=//button[h3[text()='Dashboard']]"
    
    def is_loaded(self):
        return self.wait_for_visibility(self.HEADER).is_visible()
        
    def is_welcome_displayed(self):
        return self.wait_for_visibility(self.WELCOME_TEXT).is_visible()

    def logout(self):
        self.click(self.LOGOUT_BUTTON)
        
    def click_inventory(self):
        self.click(self.INVENTORY_CARD)
        
    def click_dashboard(self):
        self.click(self.DASHBOARD_CARD)
