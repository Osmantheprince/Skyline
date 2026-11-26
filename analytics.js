/* Besøksstatistikk med GoatCounter: ingen cookies, ingen personopplysninger lagres.
   Dashbord: https://skysite.goatcounter.com */
(function () {
  // Eksempelsidene vises i rammer på forsiden. De skal ikke telles som egne besøk.
  if (window.self !== window.top) return;
  var gc = document.createElement("script");
  gc.async = true;
  gc.src = "https://gc.zgo.at/count.js";
  gc.setAttribute("data-goatcounter", "https://skysite.goatcounter.com/count");
  document.head.appendChild(gc);

  function event(name, title) {
    if (window.goatcounter && window.goatcounter.count) {
      window.goatcounter.count({ path: name, title: title || name, event: true });
    }
  }

  // Klikk på knapper, telefonnummer, e-post og lenker til andre sider
  document.addEventListener("click", function (e) {
    var a = e.target.closest && e.target.closest('a.btn, a[href^="tel:"], a[href^="mailto:"], a[href^="http"]');
    if (!a) return;
    var text = (a.textContent || "").replace(/\s+/g, " ").trim().slice(0, 60) || a.getAttribute("href");
    event("klikk skysite: " + text, a.getAttribute("href"));
  });

  // Kontaktskjemaet sendt
  document.addEventListener("submit", function (e) {
    if (e.target && e.target.id === "kontaktskjema") event("kontaktskjema sendt");
  });
})();
