// Verktøy på skysite.no/verktoy. Alt regnes ut i nettleseren.
// Bare nettside-sjekken sender noe ut: adressen går til Google PageSpeed Insights.
(function () {
  "use strict";

  function $(sel, root) { return (root || document).querySelector(sel); }
  function el(tag, cls, text) {
    var e = document.createElement(tag);
    if (cls) e.className = cls;
    if (text != null) e.textContent = text;
    return e;
  }
  var nok = new Intl.NumberFormat("nb-NO", { maximumFractionDigits: 0 });
  function kr(n) { return nok.format(Math.round(n)) + " kr"; }
  function track(name) {
    if (window.goatcounter && window.goatcounter.count) {
      window.goatcounter.count({ path: "verktøy: " + name, title: name, event: true });
    }
  }
  var used = {};
  function once(name) { if (!used[name]) { used[name] = 1; track(name); } }

  // ---------- 1. Nettside-sjekk (Google PageSpeed Insights) ----------
  // Google-nøkkel for PageSpeed Insights. Uten nøkkel deler alle en felles kvote som ofte er brukt opp.
  // Lag nøkkelen i Google Cloud og begrens den til nettstedet skysite.no og «PageSpeed Insights API».
  var PSI_KEY = "";
  (function () {
    var form = $("#sjekk-form"); if (!form) return;
    var out = $("#sjekk-out");
    var btn = form.querySelector("button");
    var CATS = [
      ["performance", "Fart"],
      ["seo", "SEO"],
      ["accessibility", "Tilgjengelighet"],
      ["best-practices", "Sikkerhet og beste praksis"]
    ];
    var METRICS = [
      ["largest-contentful-paint", "Største innhold vises", "Bør være under 2,5 s"],
      ["cumulative-layout-shift", "Hopper innholdet?", "Bør være under 0,1"],
      ["total-blocking-time", "Tid siden er låst", "Bør være under 200 ms"],
      ["first-contentful-paint", "Første innhold vises", "Bør være under 1,8 s"]
    ];

    function normalize(v) {
      v = (v || "").trim();
      if (!v) return null;
      if (!/^https?:\/\//i.test(v)) v = "https://" + v;
      try {
        var u = new URL(v);
        if (!/\./.test(u.hostname)) return null;
        return u.href;
      } catch (e) { return null; }
    }
    function grade(s) { return s >= 90 ? "good" : s >= 50 ? "ok" : "bad"; }
    function ring(score, label) {
      var wrap = el("div", "score " + grade(score));
      var r = 26, c = 2 * Math.PI * r;
      wrap.innerHTML =
        '<svg viewBox="0 0 64 64" aria-hidden="true"><circle cx="32" cy="32" r="' + r + '" class="trk"/>' +
        '<circle cx="32" cy="32" r="' + r + '" class="val" stroke-dasharray="' + c + '" stroke-dashoffset="' + (c * (1 - score / 100)) + '"/></svg>';
      var n = el("span", "num", String(score)); wrap.appendChild(n);
      wrap.appendChild(el("span", "lbl", label));
      wrap.setAttribute("role", "img");
      wrap.setAttribute("aria-label", label + ": " + score + " av 100");
      return wrap;
    }
    function message(cls, text) { out.innerHTML = ""; out.appendChild(el("p", "msg " + cls, text)); }
    function busy(url, strategy) {
      out.innerHTML = "";
      var p = el("p", "msg err", "Google har fått for mange forespørsler akkurat nå, så målingen ble ikke gjort her. Du kan kjøre den samme målingen direkte hos Google: ");
      var a = el("a", null, "Åpne målingen hos Google");
      a.href = "https://pagespeed.web.dev/analysis?url=" + encodeURIComponent(url) + "&form_factor=" + strategy;
      a.target = "_blank"; a.rel = "noopener";
      p.appendChild(a); out.appendChild(p);
    }

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var url = normalize(form.url.value);
      if (!url) { message("err", "Skriv inn en gyldig adresse, for eksempel dinbedrift.no."); form.url.focus(); return; }
      form.url.value = url;
      var strategy = form.querySelector("input[name=strategy]:checked").value;
      var api = "https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=" + encodeURIComponent(url) +
        "&strategy=" + strategy + "&locale=no" + (PSI_KEY ? "&key=" + PSI_KEY : "") + CATS.map(function (c) { return "&category=" + c[0]; }).join("");
      btn.disabled = true; btn.textContent = "Måler …";
      out.innerHTML = "";
      var wait = el("div", "loading");
      wait.appendChild(el("span", "spin"));
      wait.appendChild(el("span", null, "Google måler " + new URL(url).hostname + (strategy === "mobile" ? " på mobil" : " på PC") + ". Det tar vanligvis 15–40 sekunder."));
      out.appendChild(wait);
      track("nettside-sjekk");

      fetch(api)
        .then(function (r) {
          return r.json().then(function (d) {
            if (!r.ok) { var err = new Error((d.error && d.error.message) || "Feil"); err.status = r.status; throw err; }
            return d;
          });
        })
        .then(function (d) { render(d, url, strategy); })
        .catch(function (err) {
          var t;
          if (err.status === 429) { busy(url, strategy); return; }
          else if (err.status === 400 || err.status === 500) t = "Google klarte ikke å åpne siden. Sjekk at adressen er riktig og at siden er oppe.";
          else t = "Noe gikk galt under målingen. Sjekk internettforbindelsen og prøv igjen.";
          message("err", t);
        })
        .finally(function () { btn.disabled = false; btn.textContent = "Sjekk siden"; });
    });

    function render(d, url, strategy) {
      var lh = d.lighthouseResult; if (!lh) { message("err", "Fikk ikke noe resultat fra Google. Prøv igjen."); return; }
      out.innerHTML = "";
      var head = el("p", "out-head");
      head.appendChild(el("b", null, new URL(url).hostname));
      head.appendChild(document.createTextNode(" målt " + (strategy === "mobile" ? "på mobil" : "på PC") + " med Google PageSpeed Insights"));
      out.appendChild(head);

      var scores = el("div", "scores");
      CATS.forEach(function (c) {
        var cat = lh.categories[c[0]];
        if (cat && cat.score != null) scores.appendChild(ring(Math.round(cat.score * 100), c[1]));
      });
      out.appendChild(scores);

      var mt = el("dl", "metrics");
      METRICS.forEach(function (m) {
        var a = lh.audits[m[0]]; if (!a) return;
        var box = el("div", "metric " + (a.score == null ? "" : grade(Math.round(a.score * 100))));
        box.appendChild(el("dt", null, m[1]));
        box.appendChild(el("dd", "v", a.displayValue || "–"));
        box.appendChild(el("dd", "hint", m[2]));
        mt.appendChild(box);
      });
      out.appendChild(mt);

      // Det som bør fikses først: revisjoner som feiler, sortert etter vekt i kategoriene.
      var weight = {};
      CATS.forEach(function (c) {
        var cat = lh.categories[c[0]]; if (!cat) return;
        cat.auditRefs.forEach(function (ref) { weight[ref.id] = Math.max(weight[ref.id] || 0, ref.weight || 0); });
      });
      var savings = function (a) { return (a.details && a.details.overallSavingsMs) || 0; };
      var fails = Object.keys(lh.audits).map(function (k) { return lh.audits[k]; }).filter(function (a) {
        return a.score != null && a.score < 0.9 && (a.scoreDisplayMode === "binary" || a.scoreDisplayMode === "numeric" || a.scoreDisplayMode === "metricSavings") &&
          (weight[a.id] > 0 || savings(a) > 0) && METRICS.every(function (m) { return m[0] !== a.id; });
      }).sort(function (a, b) {
        return (savings(b) - savings(a)) || ((weight[b.id] || 0) * (1 - b.score) - (weight[a.id] || 0) * (1 - a.score));
      }).slice(0, 6);

      var box = el("div", "fixes");
      box.appendChild(el("h3", null, fails.length ? "Dette bør fikses først" : "Ingen store feil funnet"));
      if (fails.length) {
        var ol = el("ol");
        fails.forEach(function (a) {
          var li = el("li");
          li.appendChild(el("b", null, a.title.replace(/`/g, "")));
          if (savings(a) > 300) li.appendChild(el("span", "save", "Kan spare ca. " + (savings(a) / 1000).toFixed(1).replace(".", ",") + " s"));
          ol.appendChild(li);
        });
        box.appendChild(ol);
      } else {
        box.appendChild(el("p", null, "Siden ser bra ut. Små justeringer kan likevel gi mer, så spør oss gjerne."));
      }
      out.appendChild(box);

      var cta = el("p", "out-cta");
      cta.appendChild(document.createTextNode("Vil du ha hjelp med å fikse dette? "));
      var a = el("a", null, "Ta kontakt"); a.href = "/kontakt/"; cta.appendChild(a);
      cta.appendChild(document.createTextNode(", så går vi gjennom resultatet med deg gratis."));
      out.appendChild(cta);
    }
  })();

  // ---------- 2. Google-forhåndsvisning ----------
  (function () {
    var form = $("#g-form"); if (!form) return;
    var ctx = document.createElement("canvas").getContext("2d");
    var TITLE_PX = 580, DESC_PX = 920; // omtrent det Google viser på PC
    function width(text, font) { ctx.font = font; return ctx.measureText(text).width; }
    function cut(text, max, font) {
      if (width(text, font) <= max) return { text: text, cut: false };
      var lo = 0, hi = text.length;
      while (lo < hi) { var mid = (lo + hi + 1) >> 1; if (width(text.slice(0, mid) + " …", font) <= max) lo = mid; else hi = mid - 1; }
      var t = text.slice(0, lo); var sp = t.lastIndexOf(" "); if (sp > lo * 0.6) t = t.slice(0, sp);
      return { text: t.replace(/[\s,.;:–-]+$/, "") + " …", cut: true };
    }
    function update() {
      var title = form.title.value.trim(), desc = form.desc.value.trim().replace(/\s+/g, " "), raw = form.url.value.trim();
      var host = "", path = "";
      try { var u = new URL(/^https?:\/\//.test(raw) ? raw : "https://" + raw); host = u.hostname.replace(/^www\./, ""); path = u.pathname.replace(/\/$/, "").split("/").filter(Boolean).join(" › "); } catch (e) { host = raw; }
      var tf = "20px Arial, sans-serif", df = "14px Arial, sans-serif";
      var t = cut(title || "Tittelen på siden din", TITLE_PX, tf);
      var d = cut(desc || "Beskrivelsen som vises under tittelen i Google.", DESC_PX * 1, df);
      $("#g-name").textContent = host ? host.split(".")[0].replace(/^./, function (c) { return c.toUpperCase(); }) : "Nettsted";
      $("#g-url").textContent = "https://" + host + (path ? " › " + path : "");
      $("#g-title").textContent = t.text;
      $("#g-desc").textContent = d.text;
      var tw = Math.round(width(title, tf)), dw = Math.round(width(desc, df));
      $("#g-tc").textContent = title.length + " tegn";
      $("#g-tc").className = "count " + (t.cut ? "bad" : title.length < 30 ? "ok" : "good");
      $("#g-dc").textContent = desc.length + " tegn";
      $("#g-dc").className = "count " + (d.cut ? "bad" : desc.length < 70 ? "ok" : "good");
      var tips = [];
      if (!title) tips.push(["bad", "Siden mangler tittel. Google lager da en selv, ofte dårligere."]);
      else if (t.cut) tips.push(["bad", "Tittelen er for lang (" + tw + " av " + TITLE_PX + " piksler) og blir kuttet. Flytt det viktigste først."]);
      else if (title.length < 30) tips.push(["ok", "Tittelen er kort. Ta gjerne med hva du tilbyr og hvor, for eksempel «Frisør i Sandnes»."]);
      else tips.push(["good", "Tittelen har god lengde og vises i sin helhet."]);
      if (!desc) tips.push(["bad", "Siden mangler beskrivelse. Google plukker da tekst fra siden selv."]);
      else if (d.cut) tips.push(["bad", "Beskrivelsen er for lang og blir kuttet. Hold den under ca. 155 tegn."]);
      else if (desc.length < 70) tips.push(["ok", "Beskrivelsen er kort. Fortell hva kunden får, og avslutt gjerne med en oppfordring."]);
      else tips.push(["good", "Beskrivelsen har god lengde."]);
      if (host && title && title.toLowerCase().indexOf(host.split(".")[0].toLowerCase()) === -1) tips.push(["ok", "Vurder å ta med bedriftsnavnet i tittelen, for eksempel til slutt etter en strek."]);
      var ul = $("#g-tips"); ul.innerHTML = "";
      tips.forEach(function (x) { ul.appendChild(el("li", x[0], x[1])); });
    }
    form.addEventListener("input", function () { update(); once("google-forhåndsvisning"); });
    update();
  })();

  // ---------- 3. Priskalkulator ----------
  (function () {
    var form = $("#p-form"); if (!form) return;
    var PAKKER = {
      start: { navn: "Start", pris: 2990, mnd: 149, tag: "En enkel side med alt det viktigste",
        med: ["Én side, laget for mobil først", "Meny eller prisliste", "Åpningstider, adresse og kart", "Knapper for å ringe og sende SMS", "Riktig oppsett for Google"] },
      standard: { navn: "Standard", pris: 5990, mnd: 249, tag: "For de fleste bedrifter",
        med: ["Alt i Start", "Opptil fem sider", "Bestillingsknapper til Wolt, foodora eller timebestilling", "Bildegalleri", "Kontaktskjema", "Vi oppdaterer meny, priser og åpningstider for deg"] },
      pluss: { navn: "Pluss", pris: 9990, mnd: 399, tag: "For deg som vil ha alt ordnet",
        med: ["Alt i Standard", "Flere sider etter behov", "Hjelp med domene og e-post", "IT-støtte rundt nettsiden", "Raskere hjelp når noe skal endres"] }
    };
    function choose() {
      var sider = +form.querySelector("input[name=sider]:checked").value;
      var why = [];
      if (sider >= 6) why.push("flere enn fem sider");
      if (form.it.checked) why.push("hjelp med domene, e-post og IT");
      if (why.length) return { p: PAKKER.pluss, why: why };
      if (sider === 5) why.push("2–5 sider");
      if (form.bestilling.checked) why.push("bestilling");
      if (form.galleri.checked) why.push("bildegalleri");
      if (form.skjema.checked) why.push("kontaktskjema");
      if (form.oppdatering.checked) why.push("at vi oppdaterer for deg");
      if (why.length) return { p: PAKKER.standard, why: why };
      return { p: PAKKER.start, why: ["én side med det viktigste"] };
    }
    function list(arr) { return arr.length > 1 ? arr.slice(0, -1).join(", ") + " og " + arr[arr.length - 1] : arr[0]; }
    function update() {
      var c = choose(), p = c.p, out = $("#p-out");
      out.innerHTML = "";
      out.appendChild(el("p", "rc-kicker", "Vi anbefaler"));
      out.appendChild(el("h3", "rc-title", p.navn));
      out.appendChild(el("p", "rc-tag", p.tag));
      var big = el("p", "rc-big"); big.appendChild(el("span", null, nok.format(p.pris))); big.appendChild(document.createTextNode(" kr")); out.appendChild(big);
      out.appendChild(el("p", "rc-sub", "+ " + p.mnd + " kr/mnd for drift, domene og endringer"));
      out.appendChild(el("p", "rc-sub", "Første år totalt: " + kr(p.pris + p.mnd * 12)));
      out.appendChild(el("p", "rc-why", "Fordi du ønsker " + list(c.why) + "."));
      var ul = el("ul", "rc-list"); p.med.forEach(function (m) { ul.appendChild(el("li", null, m)); }); out.appendChild(ul);
      var a = el("a", "btn btn-sun", "Få et uforpliktende forslag"); a.href = "/kontakt/"; out.appendChild(a);
      out.appendChild(el("p", "fine", "Du ser et ferdig forslag før du bestemmer deg. Prisen er fast og avtales etter første prat."));
    }
    form.addEventListener("change", function () { update(); once("priskalkulator"); });
    update();
  })();

  // ---------- 4. Hva er en bedre nettside verdt? ----------
  (function () {
    var form = $("#r-form"); if (!form) return;
    function num(n) { var v = parseFloat(String(form[n].value).replace(",", ".")); return isFinite(v) && v >= 0 ? v : 0; }
    function update() {
      var besok = num("besok"), rate = num("rate") / 100, verdi = num("verdi"), lift = num("lift") / 100;
      var naa = besok * 12 * rate, ny = besok * 12 * (rate + lift);
      var ekstraKunder = ny - naa, ekstraKr = ekstraKunder * verdi;
      var kost = 5990 + 249 * 12;
      var out = $("#r-out"); out.innerHTML = "";
      out.appendChild(el("p", "rc-kicker", "Ekstra per år"));
      var big = el("p", "rc-big"); big.appendChild(el("span", null, nok.format(Math.round(ekstraKr)))); big.appendChild(document.createTextNode(" kr")); out.appendChild(big);
      var dl = el("dl", "rc-rows");
      [["Kunder fra nettsiden i dag", nok.format(Math.round(naa)) + " i året"],
       ["Med en bedre nettside", nok.format(Math.round(ny)) + " i året"],
       ["Ekstra kunder", "+" + nok.format(Math.round(ekstraKunder)) + " i året"]].forEach(function (r) {
        var d = el("div"); d.appendChild(el("dt", null, r[0])); d.appendChild(el("dd", null, r[1])); dl.appendChild(d);
      });
      out.appendChild(dl);
      if (ekstraKr > 0) {
        var mnd = kost / (ekstraKr / 12);
        out.appendChild(el("p", "rc-why", mnd <= 12
          ? "En Standard-nettside (" + kr(kost) + " første år) er tjent inn på omtrent " + (mnd < 1 ? "under én måned" : Math.ceil(mnd) + " måneder") + "."
          : "Med disse tallene tar det over et år å tjene inn en Standard-nettside (" + kr(kost) + " første år)."));
      } else {
        out.appendChild(el("p", "rc-why", "Fyll inn tallene dine for å se hva en forbedring er verdt."));
      }
      out.appendChild(el("p", "fine", "Regnestykket er et anslag. Mange lokale bedrifter har 1–3 % som tar kontakt eller bestiller."));
    }
    form.addEventListener("input", function () { update(); once("nettside-verdi"); });
    update();
  })();

  // ---------- 5. UTM-lenker ----------
  (function () {
    var form = $("#u-form"); if (!form) return;
    function clean(v) { return (v || "").trim().toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9æøå._-]/g, ""); }
    function update() {
      var out = $("#u-out"); out.innerHTML = "";
      var raw = form.url.value.trim();
      var src = clean(form.source.value), med = clean(form.medium.value), camp = clean(form.campaign.value);
      out.appendChild(el("p", "rc-kicker", "Lenken din"));
      if (!raw) { out.appendChild(el("p", "rc-why", "Lim inn lenken du vil dele, og fyll ut kilde, type og kampanje.")); return; }
      var u;
      try { u = new URL(/^https?:\/\//i.test(raw) ? raw : "https://" + raw); } catch (e) { out.appendChild(el("p", "msg err", "Lenken ser ikke riktig ut.")); return; }
      [["utm_source", src], ["utm_medium", med], ["utm_campaign", camp], ["utm_content", clean(form.content.value)], ["utm_term", clean(form.term.value)]].forEach(function (p) {
        if (p[1]) u.searchParams.set(p[0], p[1]); else u.searchParams.delete(p[0]);
      });
      var link = u.href;
      var box = el("div", "utm-link"); var code = el("code", null, link); box.appendChild(code); out.appendChild(box);
      var b = el("button", "btn btn-sun", "Kopier lenken"); b.type = "button";
      b.addEventListener("click", function () {
        var done = function () { b.textContent = "Kopiert"; setTimeout(function () { b.textContent = "Kopier lenken"; }, 1800); };
        if (navigator.clipboard) navigator.clipboard.writeText(link).then(done, function () { select(code); });
        else select(code);
        once("utm-kopiert");
      });
      out.appendChild(b);
      var miss = [];
      if (!src) miss.push("kilde"); if (!med) miss.push("type"); if (!camp) miss.push("kampanje");
      out.appendChild(el("p", miss.length ? "rc-why warn" : "rc-why",
        miss.length ? "Fyll også ut " + miss.join(", ") + ", ellers blir lenken vanskelig å skille fra andre i statistikken."
                    : "Bruk samme skrivemåte hver gang (små bokstaver), så havner alt på samme linje i statistikken."));
    }
    function select(node) { var r = document.createRange(); r.selectNodeContents(node); var s = getSelection(); s.removeAllRanges(); s.addRange(r); }
    form.addEventListener("input", function () { update(); once("utm-generator"); });
    update();
  })();
})();
