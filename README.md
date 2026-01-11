# <img src="tc_system/public/images/logo.png" align="center" width="100" /> Telecom Cambodia (Frappe App)

> Note: This README assumes the Frappe app/module name is `tc_system`. If your actual app name differs, replace `tc_system` and `TCSYSTEM_*` accordingly.

TCSystem is a **Frappe Framework** app for running ISP customer-facing operations with a **human-in-the-loop** model:
- Agents/Ops handle **cases, approvals, exceptions, field ops**
- High-throughput systems (orders, billing, payments, provisioning) stay in **microservices**
- TCSystem stays the **control plane**: *work queues + workflows + audit trail + “what happened?”*

This repo contains the TCSystem Frappe app only. It integrates with the transaction/data plane via APIs + events.

---

## Architecture choice (Option B)

We are using the **official Frappe Framework** (from frappe.io) as-is, and building **TCSystem as a custom Frappe app** installed into a Frappe site.

- Frappe Framework = platform/runtime (bench, site, users, permissions, UI engine)
- **TCSystem** = our business app (DocTypes, workflows, integrations, jobs)

We are **not** forking or rebuilding the Frappe Framework.


## What TCSystem is responsible for

✅ **Customer Care**
- Complaint / ticket intake
- SLA tracking + escalations
- Interaction logs, notes, attachments

✅ **Order Ops (Human Review)**
- Manual review queue (coverage ambiguity, address issues, fraud flags, VIP handling)
- Maker-checker approvals for refunds/credits/exceptions

✅ **Field Ops**
- Installation appointment scheduling
- Dispatch notes and technician checklists

✅ **Exception Handling**
- Provisioning failures
- Payment disputes/chargebacks
- Reconciliation mismatches

❌ **Not the source of truth for money/network state**
- Billing, payments, provisioning, subscription state live in microservices
- TCSystem references IDs: `order_id`, `subscription_id`, `invoice_id`, `payment_id`, `provisioning_job_id`

---

## Product channels (who uses what)

TCSystem is designed as a **multi-channel platform**:

- **Operations Web Portal (Frappe)**  
  Used by internal teams (Customer Care, Order Ops, Finance Ops, Field Ops coordinators) for:
  - case management, approvals, exception handling
  - installation scheduling + dispatch coordination
  - audit trail + SLA tracking + “why is this stuck?”

- **Mobile Apps (Field Sales + Customers) — Android / iOS / Huawei**
  A separate mobile app (or two apps) consumes APIs to support:
  - plan browsing, signup, onboarding, payments, self-service (customer)
  - lead capture, order creation, visit scheduling, KYC document capture (field sales)

  **Huawei note:** plan for HMS-compatible builds (AppGallery). Common implications:
  - Push notifications: **FCM (Android), APNs (iOS), HMS Push Kit (Huawei)**
  - Maps/location: Google Maps / Apple Maps / **Huawei Map Kit** (if needed)
  - Analytics: consider dual providers if you rely on Google-only SDKs

- **Partner APIs**  
  External partners integrate via secured APIs for:
  - order submission, status tracking
  - provisioning triggers (where applicable)
  - reconciliation / settlement reporting (if needed)

**Rule:** Frappe (TCSystem) is the human workflow layer. Mobile and partners talk to the data plane via APIs.



## Repo structure (recommended)

Typical Frappe app layout:
- `tc_system/` — Python package (DocTypes, hooks, API)
- `tc_system/public/` — JS/CSS assets (if needed)
- `tc_system/tc_system/doctype/` — DocType controllers
- `tc_system/tc_system/api/` — whitelisted API endpoints (REST/webhooks)
- `tc_system/tc_system/integrations/` — API client(s) to microservices
- `tc_system/tc_system/jobs/` — background jobs / scheduled tasks
- `tc_system/tc_system/patches/` — schema/data patches (migrations)

---

## Local development (Bench)

### Prerequisites
- Linux/macOS (WSL2 is fine)
- Python, Node.js, Yarn, Redis, MariaDB/MySQL
- `bench` installed

> Tip: Keep your local bench version aligned with your Frappe Cloud bench major version (e.g., v15).

### Create the TCSystem app skeleton (only once)

If you are starting from zero (no app code yet), generate the standard Frappe app structure:

```bash
# from within frappe-bench/
bench new-app tc_system
```

Then install it on your site:

```bash
bench --site tcsystem.local install-app tc_system
bench --site tcsystem.local migrate
```

If you already have a TCSystem app repo, skip `bench new-app` and use `bench get-app` / `git clone` instead.


### 1) Create a bench
```bash
bench init frappe-bench --frappe-branch version-15
cd frappe-bench
```

### 2) Get the TCSystem app
If this repo is the app:
```bash
# Option A: clone into apps/
cd apps
git clone <YOUR_GIT_URL> tc_system
cd ..
```

Or via bench:
```bash
bench get-app <YOUR_GIT_URL>
```

### 3) Create a site + install the app
```bash
bench new-site tcsystem.local
bench --site tcsystem.local install-app tc_system
bench --site tcsystem.local migrate
```

### 4) Enable developer mode (local only)
```bash
bench --site tcsystem.local set-config developer_mode 1
bench --site tcsystem.local clear-cache
```

### 5) Start the dev server
```bash
bench start
# Visit: http://localhost:8000
```

---

## Configuration

TCSystem reads config from `site_config.json` (local) / Site Config (Frappe Cloud).

Recommended keys:
- `TCSYSTEM_API_BASE_URL` — API gateway base URL (e.g., https://api.example.com)
- `TCSYSTEM_API_TOKEN` — service token for calling microservices
- `TCSYSTEM_WEBHOOK_SECRET` — shared secret for inbound events
- `TCSYSTEM_TENANT_ID` — if multi-tenant
- `TCSYSTEM_PUBLIC_BASE_URL` — public-facing base URL for callbacks/links (optional)
- `SENTRY_DSN` — optional observability

In Python you can access these via:
```python
import frappe
base_url = frappe.conf.get("TCSYSTEM_API_BASE_URL")
```

---

## API strategy (mobile + partners)

### Public API layers
TCSystem typically participates in two API layers:

1) **Data Plane APIs (microservices / API gateway) — primary**
- Used by **mobile apps** and **partners**
- Owns high-throughput operations (orders, subscription lifecycle, billing, payments, provisioning)

2) **Control Plane APIs (TCSystem/Frappe) — secondary**
- Used for **ops-only** workflows (cases, approvals, exception actions)
- Should not be the source of truth for balances, invoices, or provisioning state

### Authentication & authorization (recommended)
- **Customers / Field Sales (mobile):** OIDC/OAuth2 (short-lived access tokens), RBAC/ABAC at gateway
- **Partners:** OAuth2 client credentials or signed API keys + IP allowlist (as needed)
- **Ops portal:** SSO (OIDC/SAML) with roles mapped to Frappe roles

### API gateway responsibilities
- rate limiting, throttling, WAF rules
- request/response logging + correlation IDs
- versioning (`/v1`, `/v2`)
- partner-specific quotas and scopes



## Mobile apps (Android, iOS, Huawei)

TCSystem does not ship the mobile apps in this repo, but the platform is designed to support them via APIs.

### Recommended approach
- Build **one shared codebase** where possible (Flutter / React Native), and maintain Huawei compatibility (avoid hard Google-only dependencies).
- Keep auth flows consistent across platforms (OIDC/OAuth2).
- Use a single backend API gateway and enforce scopes/roles per app type (customer vs field sales).

### Platform services checklist
- Push: FCM + APNs + HMS Push Kit
- Deep links: Universal Links (iOS) + App Links (Android) + Huawei equivalents
- Offline mode (field sales): local cache + queued sync
- Device/KYC capture: camera, document upload, optional liveness (if required)



## Integrations (microservices + events)

Mobile apps and partners should call microservices via the API gateway. TCSystem focuses on ops workflows and exceptions.

### Outbound (commands)
TCSystem should call microservices via the API gateway using **idempotent commands**:
- include a `command_id` (UUID)
- include a `case_id` for traceability
- retry safely

Example commands TCSystem might send:
- `ApproveOrderReview`
- `CreateInstallationAppointment`
- `ApproveRefund`
- `RetryProvisioning`
- `SuspendSubscription`

### Inbound (events)
Microservices should emit events such as:
- `OrderNeedsReview`
- `PaymentConfirmed`
- `ProvisioningFailed`
- `ServiceActivated`
- `RefundPosted`

Implementation options:
- **Webhook endpoint** in TCSystem (preferred): event bus → webhook relay → Frappe endpoint
- **Scheduled polling** (fallback): TCSystem polls an “events API” periodically

Best practice:
- Validate event signature (HMAC)
- Enqueue processing in a background worker (`frappe.enqueue`) so webhook responses stay fast

---

## Background jobs & scheduler

Define scheduled jobs in `hooks.py` under `scheduler_events`, for example:
- SLA escalation checks (every 5 minutes)
- “stuck order” detection (every 10 minutes)
- nightly reconciliation case creation (daily)

Run workers locally (bench start runs them), or explicitly:
```bash
bench worker
bench schedule
```

---


## What gets coded vs configured (Option B)

### Mostly configured in Frappe (still committed as JSON)
- DocTypes (fields, links, naming series)
- Workflows (states, transitions)
- Roles/Permissions
- Workspaces, Reports, Print Formats

In developer mode locally, these changes are stored as files (JSON) in the app repo and committed to Git.

### Coded in the TCSystem app (Python/JS)
- webhook endpoints + event validation
- background jobs / schedulers
- API client wrappers to microservices (commands)
- server-side business rules that must be consistent and testable
- any non-trivial automation (SLA escalations, exception creation, sync)

This split keeps TCSystem maintainable, testable, and deployable through Frappe Cloud builds.


## Tests

Run tests for the app:
```bash
bench --site tcsystem.local run-tests --app tc_system
```

---

## Coding standards (so we don’t suffer later)

- Keep all “money/network truth” out of Frappe DocTypes—store references + human notes only.
- Use DocType controllers (`validate`, `before_save`, `on_submit`) for business rules.
- Prefer server-side logic over heavy client scripts.
- Always add **idempotency + correlation IDs** for cross-service calls.
- For changes to DocTypes/Reports/Workspaces: commit the generated JSON to the repo (developer mode local).

---

## Deploying to Frappe Cloud (recommended workflow)

### F) Frappe Cloud gotchas (read this once)
- **Custom apps need a private bench group.** Shared/public benches typically don’t allow installing arbitrary custom apps.
- **Bench Groups are a two-step process:** create the bench group **and then deploy/build it** (no build = no app).
- After pushing code:
  1) **Deploy/Build the bench group** (creates a new bench build)
  2) **Update the site** to that new build (otherwise your site keeps running the older build)
- **Site Config is your “env vars” panel** on Frappe Cloud. Put all `TCSYSTEM_*` keys there (don’t hardcode secrets).
- **Developer Mode is for local dev.** On Cloud, treat customization as code: commit DocType/Report/Workspace JSON and deploy through the bench build.
- **Workers/scheduler depend on plan & settings.** If background jobs look “dead,” check site logs and confirm workers are enabled.


### A) Create a **private bench group**
You need a private bench group to install custom apps.

1. In Frappe Cloud dashboard → `+ New` → **Bench Group**
2. Select version + region
3. Create → then **Deploy** the bench group (bench groups are not auto-deployed)

### B) Add TCSystem app from GitHub
1. Bench Group → **Apps** tab → **Add App**
2. “Add from GitHub” → connect GitHub → choose repo + branch
3. Validate → Add → Deploy bench group

### C) Create a site that includes TCSystem
1. Sites tab → **New Site**
2. Select apps to install (include TCSystem)
3. Choose version/region/plan + hostname → Create

### D) Configure site variables
Site Dashboard → **Site Config** → set `TCSYSTEM_*` keys.

### E) Updating after code changes
1. Push code to the tracked branch
2. Bench Group → Deploy a new build
3. Update the site to pick up the new bench build

---

## Release / branch strategy (simple & sane)

- `main` → production
- `staging` → staging/UAT
- feature branches → PR into staging, then promote to main

In Frappe Cloud:
- Staging bench group tracks `staging`
- Prod bench group tracks `main`

---

## Troubleshooting

### Cloud deploy checklist
When something “didn’t update” on Frappe Cloud, run this mental checklist:
1. Did I **push** the code to the correct branch?
2. Did I **deploy/build** the bench group after the push?
3. Did I **update the site** to the newest bench build?
4. Did I run **migrations** (if DocTypes changed)?
5. Did I clear cache / restart if needed?


### “My changes don’t show up on Cloud”
- Did you deploy the **bench group** after pushing code?
- Did you then update the **site** to use the new bench build?

### “Background jobs not running”
- Confirm workers are enabled for the site plan
- Check errors in site logs
- Verify your `scheduler_events` hooks

### “Migration errors after pulling updates”
```bash
bench --site <site> migrate
bench --site <site> clear-cache
bench restart
```

---

## Security notes (don’t skip)
- Webhooks must be signed (HMAC) and verified.
- Never store raw payment tokens in Frappe.
- Least-privilege: roles + permissions by DocType and field when necessary.
- Log correlation IDs, not sensitive payloads.

---

## Contact / ownership
- Team: TCSystem (ISP Customer Ops)
- Hosting: Frappe Cloud (private bench groups)
Last Updated: Sun Jan 11 12:32:53 +07 2026
