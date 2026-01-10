frappe.provide("tc_system");

$(document).on("app_ready", function () {
    // Override Help Menu
    setTimeout(() => {
        let help_dropdown = $('.dropdown-help .dropdown-menu');
        if (help_dropdown.length) {
            // Clear existing (Documentation, Forum, etc.)
            help_dropdown.empty();

            // Add our custom links
            let custom_help = `
                <li class="dropdown-header">Telecom Cambodia</li>
                <li><a class="dropdown-item" href="https://wiki.telecomcambodia.com" target="_blank">Platform Manual</a></li>
                <li><a class="dropdown-item" href="mailto:support@telecomcambodia.com">Contact IT Ops</a></li>
            `;

            help_dropdown.append(custom_help);
        }
    }, 1000);
});

// Also customize the generic "About" dialog if needed
frappe.provide('frappe.ui.misc');
frappe.ui.misc.about = function () {
    frappe.msgprint({
        title: "About Telecom Cambodia Control Plane",
        message: "Version 1.0.0<br>Built with ❤️ by Antigravity",
        indicator: "blue"
    });
};
