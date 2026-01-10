frappe.provide("tc_system");

$(document).on("app_ready", function () {

    // REPLACEMENT STRATEGY
    let retries = 0;
    const injectMenu = setInterval(() => {
        let user_menu = $('.dropdown-navbar-user');
        let existing = $('#tc-help-menu');

        // Capture and Hide original if it sneaks back
        $('.dropdown-help').hide();

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

    // SENTRY ROBOT: The "Text Sniper" using MutationObserver
    // This watches the DOM continuously for unwanted elements
    const observer = new MutationObserver(function (mutations) {
        // Find ANY list item or link containing "Frappe Support"
        const targets = document.querySelectorAll('li, a, .dropdown-item');

        targets.forEach(function (el) {
            // Check text content safely
            const text = (el.textContent || "").trim();
            if (text.includes("Frappe Support") || text.includes("Keyboard Shortcuts")) {
                el.style.display = 'none';
                el.style.visibility = 'hidden'; // Double tap
                el.classList.add('banned-by-sentry');
            }
        });
    });

    // Start watching
    observer.observe(document.body, { childList: true, subtree: true });
    console.log("TC System: Sentry Robot Deployed");
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
