import frappe
import requests
import uuid
from frappe.utils import get_url

class APIClient:
    """
    Base client for interacting with the Data Plane Microservices via the API Gateway.
    Enforces idempotency and standardized headers.
    """
    def __init__(self):
        self.base_url = frappe.conf.get("TCSYSTEM_API_BASE_URL") or "http://localhost:8000"
        self.api_token = frappe.conf.get("TCSYSTEM_API_TOKEN")
        self.timeout = 10

    def _get_headers(self, idempotency_key=None):
        headers = {
            "Authorization": f"Bearer {self.api_token}",
            "Content-Type": "application/json",
            "User-Agent": "TCSystem-ControlPlane/1.0"
        }
        if idempotency_key:
            headers["X-Idempotency-Key"] = idempotency_key
        return headers

    def send_command(self, endpoint, payload, case_id=None):
        """
        Sends a command to the API Gateway.
        Automatically generates a command_id (UUID) if not present, but 
        it's better if the caller manages idempotency keys if they are retrying.
        """
        command_id = str(uuid.uuid4())
        
        # Standard command envelope
        command_payload = {
            "command_id": command_id,
            "case_id": case_id,
            "payload": payload,
            "timestamp": frappe.utils.now_datetime().isoformat()
        }

        url = f"{self.base_url}{endpoint}"
        
        try:
            response = requests.post(
                url, 
                json=command_payload, 
                headers=self._get_headers(idempotency_key=command_id),
                timeout=self.timeout
            )
            response.raise_for_status()
            return response.json()
        except requests.exceptions.RequestException as e:
            frappe.log_error(f"API Command Failed: {str(e)}", "TCSystem API Client")
            # In a real scenario, we might want to re-raise or handle specific codes
            raise e

    def get_resource(self, endpoint, params=None):
        """
        Fetches data from the API Gateway (Read-only).
        """
        url = f"{self.base_url}{endpoint}"
        try:
            response = requests.get(
                url, 
                params=params, 
                headers=self._get_headers(),
                timeout=self.timeout
            )
            response.raise_for_status()
            return response.json()
        except requests.exceptions.RequestException as e:
            frappe.log_error(f"API Read Failed: {str(e)}", "TCSystem API Client")
            raise e
