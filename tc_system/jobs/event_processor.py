import frappe

def process_event(event_type, payload):
    """
    Background worker to process incoming webhook events.
    """
    frappe.log_error(f"Processing Event: {event_type}", "TCSystem Event Processor")
    
    if event_type == "OrderNeedsReview":
        create_order_review_case(payload)
    elif event_type == "ProvisioningFailed":
        create_provisioning_exception(payload)
    # Add more handlers here

def create_order_review_case(payload):
    # Logic to create a 'Case' DocType for manual review
    # frappe.get_doc({...}).insert()
    pass

def create_provisioning_exception(payload):
    # Logic to create an 'Exception' DocType
    pass
