frappe.provide("tc_system");

$(document).on("app_ready", function () {
    // REPLACEMENT STRATEGY
    // 1. Wait for Navbar
    let retries = 0;
    const injectMenu = setInterval(() => {
        let user_menu = $('.dropdown-navbar-user');
        let existing = $('#tc-help-menu');

        // If User menu exists and we haven't injected yet
        if (user_menu.length && existing.length === 0) {

            // 2. Create Pure HTML Dropdown (Bootstrap 4/5 compatible)
            // Using standard Frappe icons for style match
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
                        <div class="dropdown-divider"></div>
                        <a class="dropdown-item" href="#" onclick="frappe.ui.misc.about()">
                            About
                        </a>
                    </div>
                </li>
            `;

            // 3. Insert BEFORE the User Menu
            user_menu.before(menuHtml);
            console.log("TC System: Custom Help Menu Injected");

            // Stop loop
            clearInterval(injectMenu);
        }

        retries++;
        if (retries > 50) clearInterval(injectMenu); // Give up after 25s
    }, 500);
});

// Customize About Dialog
frappe.provide('frappe.ui.misc');
frappe.ui.misc.about = function () {
    frappe.msgprint({
        title: "About Telecom Cambodia",
        message: "Control Plane v2.0 <br> Built for Internal Operations",
        indicator: "blue"
    });
};
