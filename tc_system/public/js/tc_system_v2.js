frappe.provide("tc_system");

$(document).on("app_ready", function () {

    // REPLACEMENT STRATEGY v2 (Hard Rename)
    let retries = 0;
    const injectMenu = setInterval(() => {
        let user_menu = $('.dropdown-navbar-user');
        let existing = $('#tc-help-menu');

        // Capture and Hide original if it sneaks back
        $('.dropdown-help').hide();

        // Check if we need to replace the old menu (if it doesn't have "Hello World")
        if (existing.length > 0 && existing.text().indexOf("Hello World") === -1) {
            existing.remove();
            existing = $('#tc-help-menu'); // Reset
        }

        if (user_menu.length && existing.length === 0) {
            let menuHtml = `
                <li class="nav-item dropdown" id="tc-help-menu">
                    <a class="nav-link dropdown-toggle" href="#" id="tcHelpDropdown" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                        <span>Help</span>
                    </a>
                    <div class="dropdown-menu dropdown-menu-right" aria-labelledby="tcHelpDropdown">
                        <span class="dropdown-header">Telecom Cambodia Ops</span>
                        <a class="dropdown-item" href="#" onclick="frappe.msgprint('Platform Manual: Coming Soon')">
                            Platform Manual
                        </a>
                        <a class="dropdown-item" href="mailto:support@telecomcambodia.com">
                            Contact IT Ops
                        </a>
                        <a class="dropdown-item" href="#" onclick="frappe.msgprint('Hello World! 🌍')">
                            Hello World
                        </a>
                        <div class="dropdown-divider"></div>
                        <a class="dropdown-item" href="#" onclick="frappe.ui.misc.about()">
                            About
                        </a>
                    </div>
                </li>
            `;
            user_menu.before(menuHtml);
            clearInterval(injectMenu);
        }
        retries++;
        if (retries > 50) clearInterval(injectMenu);
    }, 500);

    // SENTRY ROBOT v2
    const observer = new MutationObserver(function (mutations) {
        const targets = document.querySelectorAll('li, a, .dropdown-item');
        targets.forEach(function (el) {
            const text = (el.textContent || "").trim();
            if (text.includes("Frappe Support") || text.includes("Keyboard Shortcuts")) {
                el.style.display = 'none';
                el.style.visibility = 'hidden';
                el.classList.add('banned-by-sentry');
            }
        });
    });
    observer.observe(document.body, { childList: true, subtree: true });
    console.log("TC System v2: Sentry Robot Deployed");
});

// LOGIN PAGE BRANDING FIX
$(document).ready(function () {
    if (window.location.pathname === "/login") {
        // Fix the Heading "Login to Frappe"
        // Retrying for 2 seconds to catch rendering
        const fixLoginTitle = setInterval(() => {
            const heading = $(".page-card-head span");
            if (heading.length > 0) {
                heading.text("Login to Telecom Cambodia");
                document.title = "Login - Telecom Cambodia";
                clearInterval(fixLoginTitle);
            }
        }, 100);
        setTimeout(() => clearInterval(fixLoginTitle), 3000);
    }
});

frappe.provide('frappe.ui.misc');
frappe.ui.misc.about = function () {
    frappe.msgprint({
        title: "About Telecom Cambodia",
        message: "Control Plane v2.0 <br> Powered by Frappe Cloud",
        indicator: "blue"
    });
};
