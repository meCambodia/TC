frappe.provide("tc_system");

$(document).on("app_ready", function () {
    let retry_count = 0;
    const cleanHelpMenu = setInterval(() => {
        let help_dropdown = $('.dropdown-help .dropdown-menu'); // Desk

        // Also check User Menu just in case
        let user_dropdown = $('.dropdown-navbar-user .dropdown-menu');

        // 1. CLEAN HELP MENU
        if (help_dropdown.length) {

            // PASS 1: If untagged items exist, rebuild
            if (help_dropdown.children(':not(.tc-safe)').length > 0) {
                help_dropdown.empty();
                let custom_help = `
                     <li class="dropdown-header tc-safe">Telecom Cambodia Operations</li>
                     <li class="tc-safe"><a class="dropdown-item" href="#" onclick="frappe.msgprint('Manual Coming Soon')">Platform Manual</a></li>
                     <li class="tc-safe"><a class="dropdown-item" href="mailto:support@telecomcambodia.com">Contact IT Ops</a></li>
                 `;
                help_dropdown.append(custom_help);
            }

            // PASS 2: Text Sniper (Double verify)
            help_dropdown.find('li, a').each(function () {
                const txt = $(this).text() || "";
                if (txt.includes("Frappe Support") || txt.includes("Fauxtomation") || txt.includes("Keyboard Shortcuts")) {
                    $(this).remove();
                }
            });
        }

        // 2. CLEAN USER MENU (Sometimes Support hides here)
        if (user_dropdown.length) {
            user_dropdown.find('li, a').each(function () {
                const txt = $(this).text() || "";
                if (txt.includes("Support") || txt.includes("Report an Issue")) {
                    $(this).hide(); // Use Hide to avoid breaking layout
                }
            });
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
