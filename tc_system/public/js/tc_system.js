frappe.provide("tc_system");

$(document).on("app_ready", function () {
    let retry_count = 0;
    const cleanHelpMenu = setInterval(() => {
        let help_dropdown = $('.dropdown-help .dropdown-menu');

        if (help_dropdown.length) {
            // Check if we need to clean (if it has items that are NOT ours)
            // We define ours by class 'tc-safe'
            if (help_dropdown.children(':not(.tc-safe)').length > 0) {

                // Remove anything that isn't ours
                // Actually, empty() and rebuild is safer to ensure order
                help_dropdown.empty();

                // Re-add OUR Branding with 'tc-safe' class
                let custom_help = `
                     <li class="dropdown-header tc-safe">Telecom Cambodia Operations</li>
                     <li class="tc-safe"><a class="dropdown-item" href="#" onclick="frappe.msgprint('Manual Coming Soon')">Platform Manual</a></li>
                     <li class="tc-safe"><a class="dropdown-item" href="mailto:support@telecomcambodia.com">Contact IT Ops</a></li>
                 `;
                help_dropdown.append(custom_help);

                // Also try to forcefully remove specific selectors if they are stubborn
                $('.dropdown-help .dropdown-menu > li:not(.tc-safe)').remove();

                console.log("TC System: Help Menu Sanitized");
            }
        }

        retry_count++;
        if (retry_count > 20) clearInterval(cleanHelpMenu);
    }, 500);
});

frappe.provide('frappe.ui.misc');
frappe.ui.misc.about = function () {
    frappe.msgprint({
        title: "About Telecom Cambodia Control Plane",
        message: "Version 2.0 (Day 2)<br>Powered by Frappe Cloud",
        indicator: "blue"
    });
};
