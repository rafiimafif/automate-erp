"""
What is this for:
Base Page class. It wraps Selenium driver instances and provides common helper methods 
(like waiting for elements) that all other page classes will inherit.
"""
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC

class BasePage:
    def __init__(self, driver):
        self.driver = driver
        self.wait = WebDriverWait(self.driver, 10)

    def wait_for_element(self, by_locator):
        return self.wait.until(EC.presence_of_element_located(by_locator))
        
    def wait_for_visibility(self, by_locator):
        return self.wait.until(EC.visibility_of_element_located(by_locator))
        
    def wait_for_clickable(self, by_locator):
        return self.wait.until(EC.element_to_be_clickable(by_locator))
        
    def click(self, by_locator):
        self.wait_for_clickable(by_locator).click()
        
    def enter_text(self, by_locator, text):
        element = self.wait_for_visibility(by_locator)
        element.clear()
        element.send_keys(text)

    def get_text(self, by_locator):
        element = self.wait_for_visibility(by_locator)
        return element.text
