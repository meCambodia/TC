import frappe
from frappe.model.document import Document
import json

class OpsException(Document):
    def before_insert(self):
        if self.exception_payload and isinstance(self.exception_payload, dict):
             self.exception_payload = json.dumps(self.exception_payload, indent=4)
