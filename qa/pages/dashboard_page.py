"""
What is this for:
Dashboard Page Object. Encapsulates interactions inside the Dashboard application tab.
"""
from .base_page import BasePage

class DashboardPage(BasePage):
    OVERVIEW_HEADER = "xpath=//h1[text()='Overview']"
    TOTAL_LIFETIME_SALES_CARD = "xpath=//*[contains(text(), 'Total Lifetime Sales')]"
    LIVE_PERFORMANCE_CARD = "xpath=//*[contains(text(), 'Live Performance Insight')]"
    
    def wait_for_overview_header(self):
        return self.wait_for_visibility(self.OVERVIEW_HEADER).is_visible()
        
    def is_lifetime_sales_visible(self):
        return self.wait_for_visibility(self.TOTAL_LIFETIME_SALES_CARD).is_visible()
        
    def is_live_performance_visible(self):
        return self.wait_for_visibility(self.LIVE_PERFORMANCE_CARD).is_visible()
