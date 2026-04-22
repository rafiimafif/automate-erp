"""
What is this for:
Inventory Page Object. Encapsulates interactions inside the Inventory application tab.
"""
from .base_page import BasePage

class InventoryPage(BasePage):
    SALES_AND_INVOICES_BTN = "xpath=//button[span[text()='Sales & Invoices']]"
    HEADER_TITLE = "header span"
    BACK_TO_HOME_BTN = "button[title='Back to Home']"
    DATA_TABLE = "table"
    DATA_TABLE_ROWS = "tbody tr"
    
    def is_loaded(self):
        return "Inventory" in self.get_text(self.HEADER_TITLE)
        
    def click_sales_and_invoices(self):
        self.click(self.SALES_AND_INVOICES_BTN)
        
    def get_header_title(self):
        return self.get_text(self.HEADER_TITLE)

    def go_back_home(self):
        self.click(self.BACK_TO_HOME_BTN)
        
    def get_table_row_count(self):
        self.wait_for_element(self.DATA_TABLE)
        return self.page.locator(self.DATA_TABLE_ROWS).count()
