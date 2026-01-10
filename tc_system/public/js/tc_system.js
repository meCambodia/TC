frappe.provide("tc_system");

$(document).on("app_ready", function () {
    // Override Help Menu - Use Interval to ensure it catches late rendering
    let retry_count = 0;
    const cleanHelpMenu = setInterval(() => {
        let help_dropdown = $('.dropdown-help .dropdown-menu');

        // Find if there are standard items to remove (or just ensure ours are the only ones)
        if (help_dropdown.length) {

            // Check if it still has Frappe defaults (like "Documentation")
            let hasDefaults = help_dropdown.find('a[href*="frappeframework.com"]').length > 0;

            if (hasDefaults || help_dropdown.children().length > 3) {
                // Wipe it clean
                help_dropdown.empty();

                // Re-add OUR Branding
                let custom_help = `
                     <li class="dropdown-header">Telecom Cambodia Operations</li>
                     <li><a class="dropdown-item" href="#" onclick="frappe.msgprint('Manual Coming Soon')">Platform Manual</a></li>
                     <li><a class="dropdown-item" href="mailto:support@telecomcambodia.com">Contact IT Ops</a></li>
                 `;
                help_dropdown.append(custom_help);
                console.log("TC System: Help Menu Sanitized");
            }
        }

        retry_count++;
        // Stop checking after 10 seconds of app load
        if (retry_count > 20) clearInterval(cleanHelpMenu);
    }, 500);
});

// Also customize the generic "About" dialog
frappe.provide('frappe.ui.misc');
frappe.ui.misc.about = function () {
    frappe.msgprint({
        title: "About Telecom Cambodia Control Plane",
        message: "Version 2.0 (Day 2)<br>Powered by Frappe Cloud",
        indicator: "blue"
    });
};
