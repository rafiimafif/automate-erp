"""
What is this for:
Login Page Object. Encapsulates all locators and methods for logging into the application.
"""
from selenium.webdriver.common.by import By
from .base_page import BasePage

class LoginPage(BasePage):
    # Locators
    USERNAME_INPUT = (By.ID, "username")
    PASSWORD_INPUT = (By.ID, "password")
    SUBMIT_BUTTON = (By.CSS_SELECTOR, 'button[type="submit"]')
    ERROR_MESSAGE = (By.CSS_SELECTOR, ".text-red-600")
    
    def __init__(self, driver, base_url):
        super().__init__(driver)
        self.base_url = base_url

    def navigate(self):
        # We also clear storage when visiting login to ensure fresh state
        self.driver.get(self.base_url)
        self.driver.execute_script("window.localStorage.clear();")
        self.driver.get(f"{self.base_url}/login")

    def login(self, username, password):
        self.enter_text(self.USERNAME_INPUT, username)
        self.enter_text(self.PASSWORD_INPUT, password)
        self.click(self.SUBMIT_BUTTON)
        
    def get_error_message(self):
        return self.get_text(self.ERROR_MESSAGE)
        
    def is_login_page_loaded(self):
        return self.wait_for_visibility(self.USERNAME_INPUT).is_displayed()
