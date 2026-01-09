import frappe
from frappe.model.document import Document
from tc_system.integrations.api_client import APIClient

class RefundRequest(Document):
    def on_submit(self):
        """
        When the Refund Request is approved and submitted:
        1. Check permissions (handled by Workflow state usually).
        2. Trigger the refund via the Billing Microservice API.
        """
        if self.amount <= 0:
            frappe.throw("Refund amount must be greater than zero.")
            
        self.process_refund_in_billing_system()

    def process_refund_in_billing_system(self):
        client = APIClient()
        
        payload = {
            "order_id": self.related_order_id,
            "amount": self.amount,
            "reason": self.reason,
            "approved_by": frappe.session.user
        }
        
        try:
            # Idempotent call to billing service
            response = client.send_command(
                endpoint="/billing/refunds",
                payload=payload,
                case_id=self.name
            )
            
            # Save the external transaction ID for reference
            self.db_set("external_transaction_id", response.get("transaction_id"))
            frappe.msgprint(f"Refund successfully processed. Transaction ID: {response.get('transaction_id')}")
            
        except Exception as e:
            frappe.log_error(f"Refund Failed: {str(e)}", "Refund Processor")
            frappe.throw("Failed to process refund in billing system. Please check logs and try again or escalate.")
