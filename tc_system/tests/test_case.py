import frappe
import unittest

class TestTCCase(unittest.TestCase):
    def test_auto_assign_critical_cases(self):
        """Test that Critical cases are auto-assigned to Escalations dept."""
        case = frappe.get_doc({
            "doctype": "TC Case",
            "subject": "Critical Network Failure",
            "priority": "Critical", 
            "status": "Open"
        })
        case.insert()

        self.assertEqual(case.department, "Escalations")

    def test_default_priority_medium(self):
        """Test that priority defaults to Medium if not set."""
        case = frappe.get_doc({
            "doctype": "TC Case",
            "subject": "General Inquiry",
            "status": "Open"
        })
        case.insert()
        
        self.assertEqual(case.priority, "Medium")
