app_name = "tc_system"
app_title = "Telecom Cambodia"
app_publisher = "Antigravity"
app_description = "Telecom Cambodia Control Plane"
app_email = "admin@telecomcambodia.com"
app_license = "mit"

app_logo_url = "/assets/tc_system/images/logo.png"

# Includes in <head>
# ------------------

# include js, css files in header of desk.html
# app_include_js = "/assets/tc_system/js/tc_system.js"
app_include_css = "/assets/tc_system/css/tc_system.css"

# include js, css files in header of web template
# web_include_js = "/assets/tc_system/js/tc_system_web.js"
# web_include_css = "/assets/tc_system/css/tc_system_web.css"

# Authentication and Authorization
# --------------------------------
# auth_hooks = ["tc_system.auth.validate"]

# Document Events
# ---------------
# doc_events = {
# 	"*": {
# 		"on_update": "method",
# 		"on_cancel": "method",
# 		"on_trash": "method"
# 	}
# }

# API Endpoints
# -------------
# List of API methods that can be called via /api/method/tc_system.api.method_name
# These are handled in api.py

# Scheduled Tasks
# ---------------
scheduler_events = {
	"all": [
		"tc_system.jobs.scheduler.check_slas",       # Every 5 mins (default frequency for 'all' is usually configurable, but typically use cron)
	],
    "cron": {
        "*/5 * * * *": [
            "tc_system.jobs.scheduler.check_slas"
        ],
        "*/10 * * * *": [
             "tc_system.jobs.scheduler.check_stuck_orders"
        ]
    },
	"daily": [
		"tc_system.jobs.scheduler.daily_reconciliation"
	]
}

