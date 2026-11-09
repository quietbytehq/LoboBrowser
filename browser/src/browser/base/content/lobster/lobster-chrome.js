/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this file,
 * You can obtain one at http://mozilla.org/MPL/2.0/. */

// Lobster additions to the main browser window: the splash after a reboot and
// the classic throbber. Loaded by browser.xhtml.

"use strict";

(function LobsterChrome() {
  const BASE = "chrome://browser/content/lobster/";

  // ---------------------------------------------------------------------------
  // Splash: shown on the first window after each reboot (or every launch / never).
  // lobster.splash.mode = "boot" (default) | "always" | "never"
  // ---------------------------------------------------------------------------
  function readBootId() {
    // Linux: changes on every boot. Other systems: no boot id yet, so "boot" mode
    // falls back to showing the splash once per browser start.
    try {
      const file = Cc["@mozilla.org/file/local;1"].createInstance(Ci.nsIFile);
      file.initWithPath("/proc/sys/kernel/random/boot_id");
      if (!file.exists()) return "";
      const stream = Cc["@mozilla.org/network/file-input-stream;1"].createInstance(Ci.nsIFileInputStream);
      stream.init(file, -1, 0, 0);
      // /proc files report a size of 0, so read the fixed 36-character id directly.
      const bin = Cc["@mozilla.org/binaryinputstream;1"].createInstance(Ci.nsIBinaryInputStream);
      bin.setInputStream(stream);
      const id = bin.readBytes(36).trim();
      stream.close();
      return id;
    } catch (e) {
      return "";
    }
  }

  function shouldShowSplash() {
    if (window.opener) return false; // only the first, normal window
    const mode = Services.prefs.getStringPref("lobster.splash.mode", "boot");
    if (mode === "never") return false;
    const others = [...Services.wm.getEnumerator("navigator:browser")].filter(w => w !== window);
    if (others.length) return false;
    if (mode === "always") return true;
    const bootId = readBootId() || "session-" + Services.startup.getStartupInfo().process?.getTime();
    if (Services.prefs.getStringPref("lobster.splash.lastBootId", "") === bootId) return false;
    Services.prefs.setStringPref("lobster.splash.lastBootId", bootId);
    return true;
  }

  function showSplash() {
    const frame = document.createElementNS("http://www.w3.org/1999/xhtml", "iframe");
    frame.id = "lobster-splash";
    frame.setAttribute("src", BASE + "splash.html");
    document.documentElement.appendChild(frame);
    // The address bar sits in the top layer (above any z-index), so hide it meanwhile.
    document.documentElement.setAttribute("lobster-splash", "true");
    let gone = false;
    const hide = () => {
      if (gone) return;
      gone = true;
      frame.classList.add("lobster-fade");
      document.documentElement.removeAttribute("lobster-splash");
      setTimeout(() => frame.remove(), 350);
    };
    // The animation lasts about 2.6 s; it never stays longer than that.
    setTimeout(hide, 2700);
    frame.addEventListener("click", hide);
    window.addEventListener("keydown", hide, { once: true, capture: true });
  }

  // ---------------------------------------------------------------------------
  // Throbber: the Lobster mark at the end of the toolbar; the dot orbits the
  // ring while the current tab is loading.
  // ---------------------------------------------------------------------------
  function addThrobber() {
    const target = document.getElementById("nav-bar-customization-target");
    if (!target || document.getElementById("lobster-throbber")) return;
    const item = document.createXULElement("toolbaritem");
    item.id = "lobster-throbber";
    item.setAttribute("removable", "false");
    item.setAttribute("tooltiptext", "Lobster");
    for (const [cls, file] of [["lobster-idle", "throbber-idle.svg"], ["lobster-busy", "throbber-busy.svg"]]) {
      const img = document.createElementNS("http://www.w3.org/1999/xhtml", "img");
      img.className = cls;
      img.setAttribute("src", BASE + file);
      img.setAttribute("alt", "");
      item.appendChild(img);
    }
    target.appendChild(item);

    const update = () => item.toggleAttribute("busy", !!gBrowser.selectedTab?.hasAttribute("busy"));
    gBrowser.tabContainer.addEventListener("TabAttrModified", update);
    gBrowser.tabContainer.addEventListener("TabSelect", update);
    update();
  }

  window.addEventListener("DOMContentLoaded", () => {
    try { if (shouldShowSplash()) showSplash(); } catch (e) { console.error("Lobster splash:", e); }
  }, { once: true });

  window.addEventListener("load", () => {
    // gBrowser is ready after the window's delayed startup begins.
    setTimeout(() => { try { addThrobber(); } catch (e) { console.error("Lobster throbber:", e); } }, 0);
  }, { once: true });
})();
