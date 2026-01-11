import frappe

def get_context(context):
    """
    Security Force:
    If the user is a Guest (not logged in), kick them to the Login page immediately.
    They should not see the landing page.
    """
    if frappe.session.user == "Guest":
        frappe.local.flags.redirect_location = "/login"
        raise frappe.Redirect
    else:
        # If logged in, go to the Desk
        frappe.local.flags.redirect_location = "/app"
        raise frappe.Redirect
