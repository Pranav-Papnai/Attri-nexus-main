import time
from locust import HttpUser, task, between

class AttriNexusApiUser(HttpUser):
    # Simulate a realistic user waiting 1 to 3 seconds between actions
    wait_time = between(1, 3)

    @task(4)
    def check_health(self):
        """High frequency health check & probe"""
        with self.client.get("/api/health", name="GET /api/health", catch_response=True) as response:
            if response.status_code == 200:
                data = response.json()
                if data.get("success") and data.get("dbConnected"):
                    response.success()
                else:
                    response.failure(f"Database not connected: {data}")
            else:
                response.failure(f"Status code: {response.status_code}")

    @task(3)
    def get_products(self):
        """Fetch product catalogue list"""
        with self.client.get("/api/products", name="GET /api/products", catch_response=True) as response:
            if response.status_code == 200:
                response.success()
            else:
                response.failure(f"Failed to fetch products: {response.status_code}")

    @task(1)
    def get_docs_spec(self):
        """Fetch OpenAPI JSON specification"""
        with self.client.get("/api/docs.json", name="GET /api/docs.json", catch_response=True) as response:
            if response.status_code == 200:
                response.success()
            else:
                response.failure(f"Docs failed: {response.status_code}")
