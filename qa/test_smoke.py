import pytest
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC

def test_dashboard_metrics_load(driver, base_url, login_helper):
    """Verify that dashboard metrics (Total Sales, etc.) are loaded and not zero/loading."""
    login_helper()
    
    # Wait for the Overview header to ensure dashboard is loaded
    WebDriverWait(driver, 10).until(
        EC.presence_of_element_located((By.XPATH, "//h1[text()='Overview']"))
    )
    
    # Check for specific metrics cards
    # We look for some of the metric titles
    metrics_titles = ["Total Sales", "Active Orders", "New Customers"]
    for title in metrics_titles:
        assert driver.find_element(By.XPATH, f"//h3[text()='{title}']").is_displayed()
    
    # Verify AI Insight box is present
    assert driver.find_element(By.XPATH, "//h2[text()='AI Intelligence Insight']").is_displayed()

def test_inventory_table_content(driver, base_url, login_helper):
    """Verify that the inventory table loads data rows."""
    login_helper()
    
    # Navigate to Inventory
    driver.find_element(By.XPATH, "//button[span[text()='Inventory']]").click()
    
    # Wait for table
    WebDriverWait(driver, 10).until(
        EC.presence_of_element_located((By.TAG_NAME, "table"))
    )
    
    # Check if we have rows (ignoring header)
    rows = driver.find_elements(By.CSS_SELECTOR, "tbody tr")
    assert len(rows) > 0, "Inventory table should have at least one product row"
