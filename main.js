// Årstall i bunnteksten.
var year = document.getElementById("year");
if (year) year.textContent = new Date().getFullYear();

// Tynn strek under menyen når man har scrollet.
(function () {
  var top = document.getElementById("top");
  function check() { top.classList.toggle("scrolled", window.scrollY > 8); }
  window.addEventListener("scroll", check, { passive: true }); check();
})();

// Mobilmeny.
(function () {
  var top = document.getElementById("top");
  var btn = top.querySelector(".menu-btn");
  if (!btn) return;
  function set(open) {
    top.classList.toggle("open", open);
    btn.setAttribute("aria-expanded", open ? "true" : "false");
    btn.setAttribute("aria-label", open ? "Lukk meny" : "Åpne meny");
  }
  btn.addEventListener("click", function () { set(!top.classList.contains("open")); });
  document.addEventListener("keydown", function (e) { if (e.key === "Escape") set(false); });
})();

// Send skjemaet uten å forlate siden. Fungerer også uten JavaScript (vanlig POST).
(function () {
  var form = document.getElementById("kontaktskjema");
  if (!form) return;
  var status = document.getElementById("takk");
  var btn = form.querySelector("button");
  var sent = "Meldingen er sendt. Vi svarer innen én virkedag.";
  function show(type, msg) { status.className = "status " + type; status.textContent = msg; }

  // Etter vanlig POST (uten JavaScript) sender Formsubmit brukeren tilbake til #takk.
  if (location.hash === "#takk") {
    show("ok", sent);
    status.scrollIntoView({ block: "center" });
  }

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    if (form._honey.value) return;
    btn.disabled = true; btn.textContent = "Sender …";
    fetch(form.action.replace("formsubmit.co/", "formsubmit.co/ajax/"), {
      method: "POST",
      headers: { "Accept": "application/json" },
      body: new FormData(form)
    })
      .then(function (r) { return r.json().then(function (d) { if (!r.ok || d.success === "false") throw d; }); })
      .then(function () { form.reset(); show("ok", sent); status.scrollIntoView({ block: "nearest" }); })
      .catch(function (d) { if (window.console) console.error("Formsubmit:", d); show("err", "Meldingen ble ikke sendt. Prøv igjen, eller ring 484 27 504."); })
      .finally(function () { btn.disabled = false; btn.textContent = "Send melding"; });
  });
})();
