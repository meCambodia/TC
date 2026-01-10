import frappe
from frappe.utils import now, add_to_date

@frappe.whitelist(allow_guest=True)
def ping():
    return {"message": "pong", "status": "TC System API is active"}

@frappe.whitelist()
def get_user_details():
    """Example endpoint for the mobile app to get logged-in user info"""
    user = frappe.session.user
    roles = frappe.get_roles(user)
    return {
        "user": user,
        "full_name": frappe.utils.get_fullname(user),
        "roles": roles,
        "is_manager": "System Manager" in roles
    }

@frappe.whitelist()
def get_dashboard_stats():
    """Aggregate real-time metrics for Management Dashboard"""
    # Only allow Managers
    # if "System Manager" not in frappe.get_roles(): return {} 

    todo = frappe.db.count("TC Case", {"status": "Open"})
    in_progress = frappe.db.count("TC Case", {"status": "In Progress"})
    resolved = frappe.db.count("TC Case", {"status": "Resolved"})
    critical = frappe.db.count("TC Case", {"priority": "Critical", "status": ["!=", "Resolved"]})
    
    # Calculate SLA Breaches (Deadline passed and not resolved)
    breached = frappe.db.sql("""
        SELECT count(name) FROM `tabTC Case`
        WHERE resolution_deadline < NOW() AND status != 'Resolved'
    """)[0][0]

    return {
        "open": todo,
        "working": in_progress,
        "done": resolved,
        "critical": critical,
        "breached": breached
    }

@frappe.whitelist()
def get_my_cases():
    """Fetch support tickets for the logged-in user."""
    # Allow fetching all cases if Administrator/Technician, otherwise filter by owner
    filters = {}
    if "System Manager" not in frappe.get_roles(frappe.session.user):
        filters["owner"] = frappe.session.user

    return frappe.get_all(
        "TC Case",
        filters=filters,
        fields=["name", "subject", "status", "priority", "modified", "owner"],
        order_by="modified desc"
    )

@frappe.whitelist()
def create_case(subject, description, priority="Medium"):
    """Allow mobile users to create a new support ticket with SLA."""
    if not subject:
        frappe.throw("Subject is required")
    
    case = frappe.get_doc({
        "doctype": "TC Case",
        "subject": subject,
        "description": description,
        "priority": priority,
        "status": "Open",
        "owner": frappe.session.user
    })

    # Day 2: SLA Logic
    if priority == "Critical":
        case.resolution_deadline = add_to_date(now(), hours=4)
    elif priority == "High":
        case.resolution_deadline = add_to_date(now(), hours=24)
    
    case.insert(ignore_permissions=True)
    return {"message": "Case created", "name": case.name}

@frappe.whitelist()
def update_status(case_id, status):
    """Transition Check: Open -> In Progress -> Resolved"""
    if not frappe.db.exists("TC Case", case_id):
        frappe.throw("Case not found")
    
    doc = frappe.get_doc("TC Case", case_id)
    
    # Simple State Machine
    if status == "In Progress":
        if doc.status == "Open":
            doc.status = "In Progress"
            frappe.msgprint("Ticket Accepted")
    elif status == "Resolved":
        if doc.status == "In Progress":
            doc.status = "Resolved"
            # Here we would send Notification (Day 2 Feature)
    
    doc.save(ignore_permissions=True)
    return {"status": doc.status}
