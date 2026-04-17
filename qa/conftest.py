import pytest
from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.chrome.options import Options
from webdriver_manager.chrome import ChromeDriverManager
import os
from dotenv import load_dotenv

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
    driver.implicitly_wait(10)
    
    yield driver
    
    driver.quit()

@pytest.fixture
def base_url():
    return os.environ.get("BASE_URL", "http://localhost:5173")

@pytest.fixture
def login_helper(driver, base_url):
    def _login(username="admin@automate.erp", password="admin123"):
        # Ensure we are on the domain before clearing storage
        driver.get(base_url)
        driver.execute_script("window.localStorage.clear();")
        
        # Now go to the login page correctly
        driver.get(f"{base_url}/login")
        driver.find_element("id", "username").clear()
        driver.find_element("id", "username").send_keys(username)
        driver.find_element("id", "password").clear()
        driver.find_element("id", "password").send_keys(password)
        driver.find_element("css selector", 'button[type="submit"]').click()
        # Wait for dashboard/home to load
        driver.find_element("css selector", "header") 
    return _login
