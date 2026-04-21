"""
What is this for:
Pytest configuration file. It contains shared fixtures for the Selenium test suite, 
including driver initialization and a reusable login helper.
"""
import pytest
from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.chrome.options import Options
from webdriver_manager.chrome import ChromeDriverManager
import os
from dotenv import load_dotenv

from pages.login_page import LoginPage
from pages.home_page import HomePage

load_dotenv()

@pytest.fixture(scope="session")
def driver():
    chrome_options = Options()
    
    # Check if running in CI for headless mode
    if os.environ.get("GITHUB_ACTIONS") == "true" or os.environ.get("HEADLESS") == "true":
        chrome_options.add_argument("--headless")
    
    chrome_options.add_argument("--no-sandbox")
    chrome_options.add_argument("--disable-dev-shm-usage")
    chrome_options.add_argument("--window-size=1920,1080")

    service = Service(ChromeDriverManager().install())
    driver = webdriver.Chrome(service=service, options=chrome_options)
    
    # Removed implicitly_wait to avoid mixed wait anti-patterns
    
    yield driver
    
    driver.quit()

@pytest.fixture
def base_url():
    return os.environ.get("BASE_URL", "http://localhost:5173")

@pytest.fixture
def login_helper(driver, base_url):
    def _login(username="admin@automate.erp", password="admin123"):
        login_page = LoginPage(driver, base_url)
        login_page.navigate()
        login_page.login(username, password)
        
        # Wait for dashboard/home to load
        home_page = HomePage(driver)
        home_page.is_loaded()
    return _login
