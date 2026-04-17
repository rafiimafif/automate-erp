import pytest
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC

def test_login_success(driver, base_url, login_helper):
    """Verify that a user can login with valid credentials."""
    login_helper() # Uses defaults admin@automate.erp / admin123
    
    # Verify we are on the home/dashboard
    assert "automateERP" in driver.page_source
    assert driver.find_element(By.CSS_SELECTOR, "header").is_displayed()

def test_logout(driver, base_url, login_helper):
    """Verify that a user can logout safely."""
    login_helper()
    
    # Click logout button in header (last button usually or by title)
    logout_btn = driver.find_element(By.CSS_SELECTOR, "button[title='Sign Out']")
    logout_btn.click()
    
    # Verify we are back on login page
    WebDriverWait(driver, 10).until(
        EC.presence_of_element_located((By.ID, "username"))
    )
    assert "Sign in" in driver.page_source

def test_login_failure(driver, base_url):
    """Verify that invalid credentials show an error message."""
    driver.get(f"{base_url}/login")
    driver.find_element(By.ID, "username").send_keys("wrong@user.com")
    driver.find_element(By.ID, "password").send_keys("wrongpass")
    driver.find_element(By.CSS_SELECTOR, 'button[type="submit"]').click()
    
    # Wait for error message
    error_msg = WebDriverWait(driver, 10).until(
        EC.presence_of_element_located((By.CSS_SELECTOR, ".text-red-600"))
    )
    assert error_msg.is_displayed()
    assert "Login failed" in error_msg.text
