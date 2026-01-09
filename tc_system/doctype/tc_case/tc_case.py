import frappe
from frappe.model.document import Document

class TCCase(Document):
    def validate(self):
        if self.status == "Closed" and not self.resolution_notes:
            frappe.throw("Resolution notes are required before closing a case.")

    def before_save(self):
        if not self.priority:
            self.priority = "Medium"
