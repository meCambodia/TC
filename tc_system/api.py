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

@frappe.whitelist()
def get_my_cases():
    """Fetch support tickets for the logged-in user."""
    return frappe.get_all(
        "TC Case",
        filters={"customer_id": frappe.session.user},
        fields=["name", "subject", "status", "priority", "modified"],
        order_by="modified desc"
    )

@frappe.whitelist()
def create_case(subject, description, priority="Medium"):
    """Allow mobile users to create a new support ticket."""
    if not subject:
        frappe.throw("Subject is required")
    
    case = frappe.get_doc({
        "doctype": "TC Case",
        "subject": subject,
        "description": description,
        "priority": priority,
        "customer_id": frappe.session.user,
        "status": "Open"
    })
    case.insert(ignore_permissions=True)
    return {"message": "Case created", "name": case.name}
@frappe.whitelist(allow_guest=True)
def sign_up(email, full_name, password):
    """
    Creates a new user from the mobile app.
    """
    if frappe.db.exists("User", email):
        frappe.throw("User with this email already exists", frappe.DuplicateEntryError)

    user = frappe.get_doc({
        "doctype": "User",
        "email": email,
        "first_name": full_name,
        "enabled": 1,
        "new_password": password,
        "user_type": "System User" # Or "Website User" depending on needs
    })
    user.insert(ignore_permissions=True)
    
    # Add 'Customer' role or any specific role for TCsystem
    user.add_roles("System Manager") # Warning: Only for dev. Usually 'Customer' or 'Guest'.
    
    return {"message": "User created successfully", "user": user.name}

@frappe.whitelist(allow_guest=True)
def handle_webhook():
    """
    Inbound webhook receiver from Microservices.
    Expected Payload:
    {
        "event": "OrderNeedsReview",
        "payload": { ... },
        "timestamp": "iso-date"
    }
    """
    # 1. Verify Signature (HMAC)
    # signature = frappe.get_request_header("X-Signature")
    # secret = frappe.conf.get("TCSYSTEM_WEBHOOK_SECRET")
    # if not verify_signature(frappe.request.data, signature, secret):
    #     frappe.throw("Invalid Signature", frappe.PermissionError)

    data = frappe.form_dict
    event_type = data.get("event")
    
    if not event_type:
        return {"status": "error", "message": "Missing event type"}

    # 2. Enqueue processing to avoid blocking the caller
    frappe.enqueue(
        "tc_system.jobs.event_processor.process_event",
        queue="default",
        event_type=event_type,
        payload=data.get("payload")
    )

    return {"status": "queued", "event": event_type}
