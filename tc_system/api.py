import frappe

@frappe.whitelist(allow_guest=True)
def ping():
    return {"message": "pong", "status": "TC System API is active"}

@frappe.whitelist()
def get_user_details():
    """Example endpoint for the mobile app to get logged-in user info"""
    user = frappe.session.user
    return {
        "user": user,
        "full_name": frappe.utils.get_fullname(user),
        "roles": frappe.get_roles(user)
    }
