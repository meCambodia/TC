import frappe
import unittest
from unittest.mock import patch, MagicMock
from tc_system.tc_system.doctype.refund_request.refund_request import RefundRequest

class TestRefundRequest(unittest.TestCase):
    def setUp(self):
        # Create a mock customer for testing
        if not frappe.db.exists("User", "test_customer@example.com"):
            frappe.get_doc({
                "doctype": "User",
                "email": "test_customer@example.com",
                "first_name": "Test",
                "last_name": "Customer",
                "enabled": 1
            }).insert(ignore_permissions=True)

    @patch('tc_system.integrations.api_client.APIClient.send_command')
    def test_refund_submission_success(self, mock_send_command):
        """
        Test that submitting a valid Refund Request triggers the API and saves the transaction ID.
        """
        # Setup Mock Response
        mock_send_command.return_value = {"transaction_id": "tx_12345_abc"}

        # Create Refund Request
        refund = frappe.get_doc({
            "doctype": "Refund Request",
            "customer": "test_customer@example.com",
            "related_order_id": "ORD-2024-001",
            "amount": 100.50,
            "reason": "Service outage",
            "status": "Draft"
        }).insert()

        # Simulate Submit (which triggers on_submit -> process_refund_in_billing_system)
        refund.submit()

        # Reload to get updated fields
        refund.reload()

        # Assertions
        self.assertEqual(refund.docstatus, 1) # Submitted
        self.assertEqual(refund.external_transaction_id, "tx_12345_abc")
        
        # Verify API was called correctly
        mock_send_command.assert_called_once()
        args, kwargs = mock_send_command.call_args
        self.assertEqual(kwargs['endpoint'], "/billing/refunds")
        self.assertEqual(kwargs['payload']['order_id'], "ORD-2024-001")
        self.assertEqual(kwargs['payload']['amount'], 100.50)

    def test_refund_validation_zero_amount(self):
        """Test that zero amount refund raises an error."""
        refund = frappe.get_doc({
            "doctype": "Refund Request",
            "customer": "test_customer@example.com",
            "related_order_id": "ORD-000",
            "amount": 0,
            "reason": "Test"
        })
        
        # Should raise validation error on submit
        with self.assertRaises(frappe.ValidationError):
            refund.submit()
