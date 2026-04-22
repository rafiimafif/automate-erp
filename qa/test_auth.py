"""
What is this for:
Tests the authentication flows: successful login, logout, and failed login attempts.
"""
import pytest
from pages.login_page import LoginPage
from pages.home_page import HomePage

def test_login_success(page, base_url, login_helper):
    """Verify that a user can login with valid credentials."""
    login_helper() # Uses defaults admin@automate.erp / admin123
    
    # Verify we are on the home/dashboard
    home_page = HomePage(page)
    assert "automateERP" in page.content()
    assert home_page.is_loaded()

def test_logout(page, base_url, login_helper):
    """Verify that a user can logout safely."""
    login_helper()
    
    home_page = HomePage(page)
    home_page.logout()
    
    # Verify we are back on login page
    login_page = LoginPage(page, base_url)
    assert login_page.is_login_page_loaded()
    assert "Sign in" in page.content()

def test_login_failure(page, base_url):
    """Verify that invalid credentials show an error message."""
    login_page = LoginPage(page, base_url)
    login_page.navigate()
    login_page.login("wrong@user.com", "wrongpass")
    
    text = login_page.get_error_message()
    assert "failed" in text.lower() or "error" in text.lower()
