"""
What is this for:
Pytest configuration file. Contains a reusable login helper using Playwright.
"""
import pytest
import os
from dotenv import load_dotenv

from pages.login_page import LoginPage
from pages.home_page import HomePage

load_dotenv()

@pytest.fixture(scope="session")
def base_url():
    return os.environ.get("BASE_URL", "http://localhost:5173")

@pytest.fixture
def login_helper(page, base_url):
    def _login(username="admin@automate.erp", password="admin123"):
        login_page = LoginPage(page, base_url)
        login_page.navigate()
        login_page.login(username, password)
        
        # Wait for dashboard/home to load
        home_page = HomePage(page)
        home_page.is_loaded()
    return _login
