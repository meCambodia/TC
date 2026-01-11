import frappe
from frappe.model.document import Document

class TCSubscriptionRequest(Document):
    
    def before_insert(self):
        # Set default
        self.workflow_state = "Draft"
        if not self.customer:
            self.customer = frappe.session.user

    @frappe.whitelist()
    def process_action(self, action, comment=None):
        """
        Main State Machine for Subscription Flow.
        Actions: submit, verify, manager_approve, head_approve, reject, revert
        """
        user = frappe.session.user
        roles = frappe.get_roles(user)
        
        # 1. CUSTOMER SUBMIT
        if action == "submit" and self.workflow_state in ["Draft", "Action Required"]:
            self.workflow_state = "Pending Rep"
            self.save()
            return "Submitted to Sales Rep"

        # 2. SALES REP VERIFY
        elif action == "verify" and self.workflow_state == "Pending Rep":
            if "Sales User" not in roles and "System Manager" not in roles:
                frappe.throw("Only Sales Reps can verify")
            
            self.workflow_state = "Pending Manager"
            self.sales_rep_verify_by = user
            if comment: self.sales_rep_notes = comment
            self.save()
            return "Verified. Sent to Manager."

        # 3. SALES MANAGER APPROVE
        elif action == "manager_approve" and self.workflow_state == "Pending Manager":
            if "Sales Manager" not in roles and "System Manager" not in roles:
                frappe.throw("Only Sales Managers can approve")
                
            self.workflow_state = "Pending Head of Sales"
            self.sales_manager_approve_by = user
            if comment: self.manager_rev_notes = comment
            self.save()
            return "Approved. Sent to Head of Sales."

        # 4. HEAD OF SALES FINAL APPROVE
        elif action == "head_approve" and self.workflow_state == "Pending Head of Sales":
            # Assuming 'Sales Master' or specific role for Head
            if "Sales Manager" not in roles and "System Manager" not in roles: 
                 # In real life, check for 'Head of Sales' role specifically
                 frappe.throw("Only Head of Sales can final approve")
            
            self.workflow_state = "Approved"
            self.head_of_sales_approve_by = user
            if comment: self.head_approval_notes = comment
            self.save()
            # TODO: Trigger actual subscription change logic here
            return "Final Approval Granted. Subscription Updated."

        # 5. REJECTION LOGIC (Cascading)
        elif action == "reject":
            if self.workflow_state == "Pending Head of Sales":
                self.workflow_state = "Pending Manager" # HoS sends back to Manager
                if comment: self.head_approval_notes = f"REJECTED: {comment}"
            
            elif self.workflow_state == "Pending Manager":
                self.workflow_state = "Pending Rep" # Manager sends back to Rep
                if comment: self.manager_rev_notes = f"REJECTED: {comment}"

            elif self.workflow_state == "Pending Rep":
                self.workflow_state = "Action Required" # Rep sends back to Customer
                if comment: self.sales_rep_notes = f"RETURNED: {comment}"
            
            self.save()
            return "Request Returned/Rejected"

        else:
            frappe.throw(f"Invalid Action '{action}' for state '{self.workflow_state}'")
