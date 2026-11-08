/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this file,
 * You can obtain one at http://mozilla.org/MPL/2.0/. */

"use strict";

// Clock and date, updated once a minute.
const timeEl = document.getElementById("time");
const dateEl = document.getElementById("date");
function tick() {
  const now = new Date();
  timeEl.textContent = now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  dateEl.textContent = now.toLocaleDateString([], { weekday: "long", day: "numeric", month: "long" });
}
tick();
setTimeout(() => { tick(); setInterval(tick, 60000); }, (60 - new Date().getSeconds()) * 1000);

// Search box: an address goes straight to the site, anything else to the search engine.
const form = document.querySelector(".search");
const q = document.getElementById("q");
form.addEventListener("submit", event => {
  const text = q.value.trim();
  if (!text) { event.preventDefault(); return; }
  const looksLikeUrl = /^(https?:\/\/)?[\w-]+(\.[\w-]+)+(:\d+)?(\/\S*)?$/i.test(text) && !/\s/.test(text);
  if (looksLikeUrl) {
    event.preventDefault();
    location.href = /^https?:\/\//i.test(text) ? text : "https://" + text;
  }
});
