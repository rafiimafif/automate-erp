"""
What is this for:
Home Page Object. Encapsulates all interactions on the main dashboard grid after login.
"""
from selenium.webdriver.common.by import By
from .base_page import BasePage

class HomePage(BasePage):
    HEADER = (By.CSS_SELECTOR, "header")
    LOGOUT_BUTTON = (By.CSS_SELECTOR, "button[title='Sign Out']")
    WELCOME_TEXT = (By.XPATH, "//h1[contains(text(), 'Welcome')]")
    INVENTORY_CARD = (By.XPATH, "//button[h3[text()='Inventory']]")
    DASHBOARD_CARD = (By.XPATH, "//button[h3[text()='Dashboard']]")
    
    def is_loaded(self):
        return self.wait_for_visibility(self.HEADER).is_displayed()
        
    def is_welcome_displayed(self):
        return self.wait_for_visibility(self.WELCOME_TEXT).is_displayed()

    def logout(self):
        self.click(self.LOGOUT_BUTTON)
        
    def click_inventory(self):
        self.click(self.INVENTORY_CARD)
        
    def click_dashboard(self):
        self.click(self.DASHBOARD_CARD)
