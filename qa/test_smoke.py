"""
What is this for:
Smoke tests to verify that critical data is loading correctly once a user logs into 
specific applications (Metrics in Dashboard, Data rows in Inventory).
"""
import pytest
from pages.home_page import HomePage
from pages.dashboard_page import DashboardPage
from pages.inventory_page import InventoryPage

def test_dashboard_metrics_load(page, base_url, login_helper):
    """Verify that dashboard metrics (Total Sales, etc.) are loaded and not zero/loading."""
    login_helper()
    
    home_page = HomePage(page)
    home_page.click_dashboard()
    
    dashboard_page = DashboardPage(page)
    assert dashboard_page.wait_for_overview_header()
    assert dashboard_page.is_lifetime_sales_visible()
    assert dashboard_page.is_live_performance_visible()

def test_inventory_table_content(page, base_url, login_helper):
    """Verify that the inventory table loads data rows."""
    login_helper()
    
    home_page = HomePage(page)
    home_page.click_inventory()
    
    inventory_page = InventoryPage(page)
    row_count = inventory_page.get_table_row_count()
    assert row_count > 0, "Inventory table should have at least one product row"
