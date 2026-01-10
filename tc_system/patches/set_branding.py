import frappe

def execute():
    # Force update of Website Settings to point to the new logo
    website_settings = frappe.get_single("Website Settings")
    website_settings.app_logo = "/assets/tc_system/images/tc_logo.png"
    website_settings.banner_image = "/assets/tc_system/images/tc_logo.png"
    website_settings.splash_image = "/assets/tc_system/images/tc_logo.png"
    website_settings.favicon = "/assets/tc_system/images/tc_logo.png"
    website_settings.brand_html = "<img src='/assets/tc_system/images/tc_logo.png' style='max-width: 40px; max-height: 40px;'> Telecom Cambodia"
    website_settings.save(ignore_permissions=True)

    # Clear cache to ensure the new path is picked up
    frappe.clear_cache()
