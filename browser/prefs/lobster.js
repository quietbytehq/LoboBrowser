// Lobster Browser default preferences.
// Shipped into the build as a default-prefs file; users can still change these in about:config.
// Grouped by purpose. Each line should have a reason; remove anything that breaks sites.

// --- Telemetry and studies: off ---
pref("datareporting.policy.dataSubmissionEnabled", false);
pref("datareporting.healthreport.uploadEnabled", false);
pref("toolkit.telemetry.enabled", false);
pref("toolkit.telemetry.unified", false);
pref("toolkit.telemetry.archive.enabled", false);
pref("app.shield.optoutstudies.enabled", false);
pref("app.normandy.enabled", false);
pref("browser.discovery.enabled", false);

// --- Pocket and sponsored content: off ---
pref("extensions.pocket.enabled", false);
pref("browser.newtabpage.activity-stream.showSponsored", false);
pref("browser.newtabpage.activity-stream.showSponsoredTopSites", false);
pref("browser.newtabpage.activity-stream.feeds.section.topstories", false);
pref("browser.urlbar.suggest.quicksuggest.sponsored", false);
pref("browser.urlbar.suggest.quicksuggest.nonsponsored", false);

// --- Firefox's own AI chatbot sidebar: off (Lobster uses DSH instead) ---
pref("browser.ml.chat.enabled", false);

// --- Search: separate default engine for private windows ---
// Normal windows default to Google (see policies.json).
// Private windows default to DuckDuckGo; the engine itself is set in the search
// configuration patch (browser/patches/), since there is no single pref for it.
pref("browser.search.separatePrivateDefault", true);
pref("browser.search.separatePrivateDefault.ui.enabled", true);

// --- Speed and memory ---
pref("browser.tabs.unloadOnLowMemory", true);
// TODO (Phase 1): add tuned network and cache settings after measuring
// startup time and RAM against stock Firefox. Change one thing at a time.
