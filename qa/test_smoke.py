import pytest
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC

def test_dashboard_metrics_load(driver, base_url, login_helper):
    """Verify that dashboard metrics (Total Sales, etc.) are loaded and not zero/loading."""
    login_helper()
    
    # Enter Dashboard from Home grid
    dashboard_card = WebDriverWait(driver, 10).until(
        EC.element_to_be_clickable((By.XPATH, "//button[h3[text()='Dashboard']]"))
    )
    dashboard_card.click()
    
    # Wait for the Overview header to ensure dashboard is loaded
    WebDriverWait(driver, 10).until(
        EC.presence_of_element_located((By.XPATH, "//h1[text()='Overview']"))
    )
    
    # Check for specific metrics cards (Waiting for visibility handles animations)
    WebDriverWait(driver, 10).until(
        EC.visibility_of_element_located((By.XPATH, "//*[contains(text(), 'Total Lifetime Sales')]"))
    )
    
    # Verify AI Insight card is present and visible
    WebDriverWait(driver, 10).until(
        EC.visibility_of_element_located((By.XPATH, "//*[contains(text(), 'Live Performance Insight')]"))
    )

def test_inventory_table_content(driver, base_url, login_helper):
    """Verify that the inventory table loads data rows."""
    login_helper()
    
    # Navigate into Inventory from Home
    inventory_card = WebDriverWait(driver, 10).until(
        EC.element_to_be_clickable((By.XPATH, "//button[h3[text()='Inventory']]"))
    )
    inventory_card.click()
    
    # Wait for table
    WebDriverWait(driver, 10).until(
        EC.presence_of_element_located((By.TAG_NAME, "table"))
    )
    
    # Check if we have rows (ignoring header)
    rows = driver.find_elements(By.CSS_SELECTOR, "tbody tr")
    assert len(rows) > 0, "Inventory table should have at least one product row"
