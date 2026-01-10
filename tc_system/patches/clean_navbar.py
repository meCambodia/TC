import frappe

def execute():
    """
    Cleans up the Navbar Settings to remove standard Help items
    and sets our custom ones persistently in the Database.
    """
    if not frappe.db.exists("Navbar Settings", "Navbar Settings"):
        return

    navbar = frappe.get_single("Navbar Settings")
    
    # 1. CLEAR HELP DROPDOWN (This removes standard Frappe items if they are configured here)
    navbar.help_dropdown = []
    
    # 2. Add Ours (Server-Side Persistence)
    # Note: Modern Frappe allows adding items here.
    # standard items like "About" and "Shortcuts" might be hardcoded in UI, 
    # but "Help" links are often here.
    
    navbar.append("help_dropdown", {
        "item_label": "Platform Manual",
        "item_type": "Route",
        "route": "#manual",
        "is_hidden": 0
    })
    
    navbar.append("help_dropdown", {
        "item_label": "Contact IT Ops",
        "item_type": "Route",
        "route": "mailto:support@telecomcambodia.com",
        "is_hidden": 0
    })

    # 3. SETTINGS DROPDOWN (Check for Support links there too)
    # Iterate and remove anything with "Support"
    # (Safe logic: filter existing list)
    if hasattr(navbar, 'settings_dropdown'):
        new_settings = []
        for item in navbar.settings_dropdown:
            if "Support" not in (item.item_label or "") and "Frappe" not in (item.item_label or ""):
                new_settings.append(item)
        navbar.settings_dropdown = new_settings

    navbar.save(ignore_permissions=True)
