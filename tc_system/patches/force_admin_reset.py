import frappe
from frappe.utils.password import update_password

def execute():
    try:
        # Force reset Administrator password
        update_password("Administrator", "me1234$")
        frappe.db.commit()
        print("XXX: Administrator password reset to me1234$")
    except Exception as e:
        print(f"XXX: Password reset failed: {str(e)}")
