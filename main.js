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
  var failed = "Meldingen ble ikke sendt. Send e-post til post@skysite.no eller ring 484 27 504.";
  function show(type, msg) { status.className = "status " + type; status.textContent = msg; }
  function reset() { btn.disabled = false; btn.textContent = "Send melding"; }

  // Etter vanlig POST (uten JavaScript) sender Web3Forms brukeren tilbake til #takk.
  if (location.hash === "#takk") {
    show("ok", sent);
    status.scrollIntoView({ block: "center" });
  }

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    if (form.botcheck.checked) return;
    var captcha = form.querySelector("[name=h-captcha-response]");
    if (captcha && !captcha.value) { show("err", "Kryss av i boksen «Jeg er et menneske» først."); return; }
    btn.disabled = true; btn.textContent = "Sender …";

    // Gi opp etter 20 sekunder, så knappen aldri blir hengende på «Sender …».
    var ctrl = window.AbortController ? new AbortController() : null;
    var timer = ctrl && setTimeout(function () { ctrl.abort(); }, 20000);

    fetch(form.action, {
      method: "POST",
      headers: { "Accept": "application/json" },
      body: new FormData(form),
      signal: ctrl ? ctrl.signal : undefined
    })
      .then(function (r) { return r.json().then(function (d) { if (!r.ok || !d.success) throw d; }); })
      .then(function () { form.reset(); show("ok", sent); status.scrollIntoView({ block: "nearest" }); })
      .catch(function (d) { if (window.console) console.error("Web3Forms:", d); show("err", failed); })
      .finally(function () { clearTimeout(timer); reset(); if (window.hcaptcha) try { hcaptcha.reset(); } catch (x) {} });
  });
})();

// Skaler PC-eksemplene slik at hele 1280px-bredden passer i vinduet
(function () {
  var screens = document.querySelectorAll(".screen");
  if (!screens.length) return;
  function fit(s) { var f = s.querySelector("iframe"); if (f) f.style.transform = "scale(" + s.clientWidth / 1280 + ")"; }
  if ("ResizeObserver" in window) {
    var ro = new ResizeObserver(function (es) { es.forEach(function (e) { fit(e.target); }); });
    screens.forEach(function (s) { ro.observe(s); });
  } else {
    var all = function () { screens.forEach(fit); };
    all(); window.addEventListener("resize", all);
  }
})();

// Animasjon når man scroller: kort, bilder og overskrifter glir rolig inn.
(function () {
  if (!("IntersectionObserver" in window)) return;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  var sel = [
    "main h2", ".block .intro", ".cards > li", ".features > li", ".person",
    ".faq-cards > details", ".trio > figure", ".steps > li", ".duo", ".faq > details",
    ".contact.cta > .wrap", ".price", ".faq-more", ".tool-index > li", ".tool", ".plans > li", ".plans-more", ".proof-rings > li", ".proof-form", ".promises > li"
  ].join(",");
  var els = [].slice.call(document.querySelectorAll(sel)).filter(function (el) {
    return !el.closest(".hero");
  });
  if (!els.length) return;
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (!e.isIntersecting) return;
      e.target.classList.add("in");
      io.unobserve(e.target);
    });
  }, { rootMargin: "0px 0px -8% 0px", threshold: 0.12 });
  els.forEach(function (el) {
    // Søsken kommer litt etter hverandre (maks 0,4 s forsinkelse).
    var i = [].indexOf.call(el.parentNode.children, el);
    el.style.setProperty("--d", Math.min(i, 5) * 80 + "ms");
    el.classList.add("reveal");
    io.observe(el);
  });
})();

// Eksempelsidene i telefonene lastes først når man nærmer seg dem, så forsiden åpner raskere.
(function () {
  var frames = document.querySelectorAll("iframe[data-src]");
  if (!frames.length) return;
  function load(f) { f.src = f.getAttribute("data-src"); f.removeAttribute("data-src"); }
  if (!("IntersectionObserver" in window)) { [].forEach.call(frames, load); return; }
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) { if (e.isIntersecting) { load(e.target); io.unobserve(e.target); } });
  }, { rootMargin: "400px 0px" });
  [].forEach.call(frames, function (f) { io.observe(f); });
})();
