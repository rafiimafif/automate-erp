import pytest
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC

def test_sidebar_navigation(driver, base_url, login_helper):
    """Verify that clicking sidebar links updates the current view."""
    login_helper()
    
    # First, enter an app from the Home grid
    # Wait for the "Welcome" hero text
    WebDriverWait(driver, 10).until(EC.presence_of_element_located((By.XPATH, "//h1[contains(text(), 'Welcome')]")))
    
    # Click Inventory card in the grid
    inventory_card = driver.find_element(By.XPATH, "//button[h3[text()='Inventory']]")
    inventory_card.click()
    
    # Now that we are inside, we can use the Sidebar
    # Click on Sales
    sales_btn = WebDriverWait(driver, 10).until(
        EC.element_to_be_clickable((By.XPATH, "//button[span[text()='Sales & Invoices']]"))
    )
    sales_btn.click()
    
    # Verify header span updates
    WebDriverWait(driver, 10).until(
        EC.text_to_be_present_in_element((By.CSS_SELECTOR, "header span"), "Sales & Invoices")
    )

def test_app_launcher_to_inventory(driver, base_url, login_helper):
    """Verify that opening an app from the Home grid works."""
    login_helper()
    
    # Wait for Home grid
    inventory_card = WebDriverWait(driver, 10).until(
        EC.element_to_be_clickable((By.XPATH, "//button[h3[text()='Inventory']]"))
    )
    inventory_card.click()
    
    # Verify inside Inventory
    WebDriverWait(driver, 10).until(
        EC.text_to_be_present_in_element((By.CSS_SELECTOR, "header span"), "Inventory")
    )
    
    # Go back to home
    back_btn = driver.find_element(By.CSS_SELECTOR, "button[title='Back to Home']")
    back_btn.click()
    
    # Verify back on Home
    WebDriverWait(driver, 10).until(EC.presence_of_element_located((By.XPATH, "//h1[contains(text(), 'Welcome')]")))
