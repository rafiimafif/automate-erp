"""
What is this for:
Login Page Object. Encapsulates all locators and methods for logging into the application.
"""
from .base_page import BasePage

class LoginPage(BasePage):
    # Locators
    USERNAME_INPUT = "#username"
    PASSWORD_INPUT = "#password"
    SUBMIT_BUTTON = 'button[type="submit"]'
    ERROR_MESSAGE = ".text-red-600"
    
    def __init__(self, page, base_url):
        super().__init__(page)
        self.base_url = base_url

    def navigate(self):
        # We also clear storage when visiting login to ensure fresh state
        self.page.goto(self.base_url)
        self.page.evaluate("window.localStorage.clear();")
        self.page.goto(f"{self.base_url}/login")

    def login(self, username, password):
        self.enter_text(self.USERNAME_INPUT, username)
        self.enter_text(self.PASSWORD_INPUT, password)
        self.click(self.SUBMIT_BUTTON)
        
    def get_error_message(self):
        return self.get_text(self.ERROR_MESSAGE)
        
    def is_login_page_loaded(self):
        return self.wait_for_visibility(self.USERNAME_INPUT).is_visible()
