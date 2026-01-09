import frappe
from frappe.model.document import Document

class InstallationAppointment(Document):
    def validate(self):
        if self.appointment_date and self.appointment_date < frappe.utils.now_datetime():
            # Allow saving past appointments if status is Completed/Failed, but warn for new ones?
            # Keeping it simple for now.
            pass
            
    def on_submit(self):
        # Example: Notify field tech via push notification
        pass
