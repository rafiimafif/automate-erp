"""
What is this for:
Dashboard Page Object. Encapsulates interactions inside the Dashboard application tab.
"""
from selenium.webdriver.common.by import By
from .base_page import BasePage

class DashboardPage(BasePage):
    OVERVIEW_HEADER = (By.XPATH, "//h1[text()='Overview']")
    TOTAL_LIFETIME_SALES_CARD = (By.XPATH, "//*[contains(text(), 'Total Lifetime Sales')]")
    LIVE_PERFORMANCE_CARD = (By.XPATH, "//*[contains(text(), 'Live Performance Insight')]")
    
    def wait_for_overview_header(self):
        return self.wait_for_visibility(self.OVERVIEW_HEADER).is_displayed()
        
    def is_lifetime_sales_visible(self):
        return self.wait_for_visibility(self.TOTAL_LIFETIME_SALES_CARD).is_displayed()
        
    def is_live_performance_visible(self):
        return self.wait_for_visibility(self.LIVE_PERFORMANCE_CARD).is_displayed()
