"""
What is this for:
Base Page class. It wraps Playwright page instances and provides common helper methods.
"""

class BasePage:
    def __init__(self, page):
        self.page = page

    def wait_for_element(self, selector):
        return self.page.locator(selector).first.wait_for(state="attached")
        
    def wait_for_visibility(self, selector):
        locator = self.page.locator(selector).first
        locator.wait_for(state="visible")
        return locator
        
    def click(self, selector):
        self.page.locator(selector).first.click()
        
    def enter_text(self, selector, text):
        self.page.locator(selector).first.fill(text)

    def get_text(self, selector):
        return self.page.locator(selector).first.inner_text()
