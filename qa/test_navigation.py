import pytest
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC

def test_sidebar_navigation(driver, base_url, login_helper):
    """Verify that clicking sidebar links updates the current view."""
    login_helper()
    
    # Click on Inventory
    inventory_btn = driver.find_element(By.XPATH, "//button[span[text()='Inventory']]")
    inventory_btn.click()
    
    # Verify Inventory header
    WebDriverWait(driver, 10).until(
        EC.text_to_be_present_in_element((By.CSS_SELECTOR, "header span"), "Inventory")
    )
    assert "Inventory" in driver.find_element(By.CSS_SELECTOR, "header span").text

    # Click on Sales
    sales_btn = driver.find_element(By.XPATH, "//button[span[text()='Sales & Invoices']]")
    sales_btn.click()
    
    # Verify Sales header
    WebDriverWait(driver, 10).until(
        EC.text_to_be_present_in_element((By.CSS_SELECTOR, "header span"), "Sales & Invoices")
    )
    assert "Sales & Invoices" in driver.find_element(By.CSS_SELECTOR, "header span").text

def test_app_launcher_to_inventory(driver, base_url, login_helper):
    """Verify that opening an app from the Home grid works."""
    login_helper()
    
    # Go back to home
    driver.find_element(By.CSS_SELECTOR, "button[title='Back to Home']").click()
    
    # Click Inventory card in the grid
    # Looking for the card with "Inventory Management" title
    inventory_card = driver.find_element(By.XPATH, "//div[h3[text()='Inventory Management']]")
    inventory_card.click()
    
    # Verify redirection
    WebDriverWait(driver, 10).until(
        EC.text_to_be_present_in_element((By.CSS_SELECTOR, "header span"), "Inventory")
    )
