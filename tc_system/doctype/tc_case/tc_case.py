import frappe
from frappe.model.document import Document

class TCCase(Document):
    def validate(self):
        if self.status == "Closed" and not self.resolution_notes:
            frappe.throw("Resolution notes are required before closing a case.")

    def before_save(self):
        if not self.priority:
            self.priority = "Medium"
        
        # Business Rule 1: Auto-route Critical cases to Escalations
        if self.priority == "Critical" and not self.department:
            self.department = "Escalations" # Assumes 'Escalations' Department exists in Frappe
            
        # Business Rule 2: If resolved, ensure resolution notes
        if self.status == "Resolved" and not self.resolution_notes:
             frappe.throw("Please add resolution notes before marking as Resolved.")
