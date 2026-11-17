/* ==========================================================
   FN TRADUCTION — comportements
   ========================================================== */
(function () {
  "use strict";
  var root = document.documentElement;
  root.classList.add("js");
  var reduce = window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches;

  function $(s, c) { return (c || document).querySelector(s); }
  function $$(s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); }
  function store(k, v) { try { if (v === undefined) return localStorage.getItem(k); localStorage.setItem(k, v); } catch (e) {} return null; }

  /* ---------- Langue FR / বাংলা ---------- */
  var lang = "fr";
  function t(el, name) { return el.getAttribute("data-" + lang) || el.getAttribute("data-fr") || ""; }

  function applyLang(l) {
    lang = l === "bn" ? "bn" : "fr";
    root.setAttribute("lang", lang);
    $$("[data-fr]").forEach(function (el) {
      var v = el.getAttribute("data-" + lang) || el.getAttribute("data-fr");
      if (el.innerHTML !== v) el.innerHTML = v;
    });
    $$("[data-fr-ph]").forEach(function (el) {
      el.setAttribute("placeholder", el.getAttribute("data-" + lang + "-ph") || el.getAttribute("data-fr-ph"));
    });
    $$("[data-fr-label]").forEach(function (el) {
      el.setAttribute("aria-label", el.getAttribute("data-" + lang + "-label") || el.getAttribute("data-fr-label"));
    });
    var title = document.documentElement.getAttribute("data-title-" + lang);
    if (title) document.title = title;
    $$(".lang button").forEach(function (b) {
      var on = b.getAttribute("data-lang") === lang;
      b.classList.toggle("on", on);
      b.setAttribute("aria-pressed", on ? "true" : "false");
    });
    store("fn-lang", lang);
    document.dispatchEvent(new CustomEvent("fn:lang", { detail: lang }));
  }
  var q = /[?&]lang=(fr|bn)/.exec(location.search);
  applyLang(q ? q[1] : (store("fn-lang") === "bn" ? "bn" : "fr"));
  $$(".lang button").forEach(function (b) {
    b.addEventListener("click", function () { applyLang(b.getAttribute("data-lang")); });
  });

  /* ---------- Menu mobile + en-tête ---------- */
  var burger = $("#burger"), nav = $("#nav"), header = $(".site-header");
  function closeNav() { if (nav) { nav.classList.remove("open"); burger.setAttribute("aria-expanded", "false"); } }
  if (burger && nav) {
    burger.addEventListener("click", function () {
      var open = nav.classList.toggle("open");
      burger.setAttribute("aria-expanded", open ? "true" : "false");
    });
    nav.addEventListener("click", function (e) { if (e.target.closest("a")) closeNav(); });
    document.addEventListener("keydown", function (e) { if (e.key === "Escape") closeNav(); });
  }
  function onScroll() { if (header) header.classList.toggle("scrolled", window.scrollY > 8); }
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  /* ---------- Planche de documents (accueil) ---------- */
  var docs = $("#docs");
  if (docs) {
    var DOCS = [
      { k: "birth",
        fr: "Acte de naissance", bn: "জন্ম সনদ",
        oTitle: "জন্ম নিবন্ধন সনদ",
        o: [["নাম", "রাহিমা আক্তার"], ["জন্মতারিখ", "১২ মার্চ ১৯৯০"], ["জন্মস্থান", "ঢাকা"]],
        tTitle: "Acte de naissance",
        tr: [["Nom", "Rahima Akter"], ["Date de naissance", "12 mars 1990"], ["Lieu de naissance", "Dhaka"]] },
      { k: "passport",
        fr: "Passeport", bn: "পাসপোর্ট",
        oTitle: "পাসপোর্ট",
        o: [["নাম", "রাহিমা আক্তার"], ["জাতীয়তা", "বাংলাদেশি"], ["জন্মস্থান", "ঢাকা"]],
        tTitle: "Passeport",
        tr: [["Nom", "Rahima Akter"], ["Nationalité", "Bangladaise"], ["Lieu de naissance", "Dhaka"]] },
      { k: "diploma",
        fr: "Diplôme", bn: "শিক্ষাসনদ",
        oTitle: "স্নাতক সনদ",
        o: [["নাম", "রাহিমা আক্তার"], ["বিষয়", "অর্থনীতি"], ["সনদের ধরন", "স্নাতক"]],
        tTitle: "Diplôme de licence",
        tr: [["Nom", "Rahima Akter"], ["Spécialité", "Économie"], ["Niveau", "Licence"]] },
      { k: "marriage",
        fr: "Acte de mariage", bn: "বিবাহ সনদ",
        oTitle: "বিবাহ নিবন্ধন সনদ",
        o: [["স্বামী", "করিম হোসেন"], ["স্ত্রী", "রাহিমা আক্তার"], ["বিবাহের স্থান", "ঢাকা"]],
        tTitle: "Acte de mariage",
        tr: [["Époux", "Karim Hossain"], ["Épouse", "Rahima Akter"], ["Lieu du mariage", "Dhaka"]] }
    ];
    var tabsBox = $("#doc-tabs"), stamp = $("#stamp"), idx = 0, timer = null, paused = false;
    function dl(rows) { return rows.map(function (r) { return "<dt>" + r[0] + "</dt><dd>" + r[1] + "</dd>"; }).join(""); }
    function show(i, animate) {
      idx = i;
      var d = DOCS[i];
      function paint() {
        $("#o-title").textContent = d.oTitle; $("#o-list").innerHTML = dl(d.o);
        $("#t-title").textContent = d.tTitle; $("#t-list").innerHTML = dl(d.tr);
        $$("button", tabsBox).forEach(function (b, n) { b.setAttribute("aria-selected", n === i ? "true" : "false"); });
        stamp.classList.remove("hit"); stamp.classList.add("off");
        void stamp.getBoundingClientRect();
        stamp.classList.remove("off");
        setTimeout(function () { stamp.classList.add("hit"); }, animate && !reduce ? 380 : 120);
      }
      if (animate && !reduce) {
        docs.classList.add("swapping");
        setTimeout(function () { paint(); docs.classList.remove("swapping"); }, 280);
      } else paint();
    }
    function buildTabs() {
      tabsBox.innerHTML = "";
      DOCS.forEach(function (d, i) {
        var b = document.createElement("button");
        b.type = "button"; b.setAttribute("role", "tab"); b.setAttribute("aria-selected", i === idx ? "true" : "false");
        b.textContent = lang === "bn" ? d.bn : d.fr;
        b.addEventListener("click", function () { stop(); show(i, true); });
        tabsBox.appendChild(b);
      });
    }
    function loop() { stop(); if (reduce) return; timer = setInterval(function () { if (!paused && !document.hidden) show((idx + 1) % DOCS.length, true); }, 5200); }
    function stop() { if (timer) clearInterval(timer); timer = null; }
    buildTabs(); show(0, false); loop();
    docs.addEventListener("mouseenter", function () { paused = true; });
    docs.addEventListener("mouseleave", function () { paused = false; });
    tabsBox.addEventListener("focusin", function () { paused = true; });
    tabsBox.addEventListener("focusout", function () { paused = false; });
    document.addEventListener("fn:lang", function () { buildTabs(); });
  }

  /* ---------- Onglets génériques (besoins, interprétation) ---------- */
  function tabs(list, getPanel, opts) {
    var btns = $$('[role="tab"]', list);
    if (!btns.length) return;
    function select(b, focus) {
      btns.forEach(function (x) {
        var on = x === b;
        x.setAttribute("aria-selected", on ? "true" : "false");
        x.tabIndex = on ? 0 : -1;
        var p = getPanel(x); if (p) p.hidden = !on;
      });
      if (focus) b.focus();
      if (opts && opts.hash) history.replaceState(null, "", "#" + b.getAttribute("aria-controls"));
    }
    btns.forEach(function (b, i) {
      b.addEventListener("click", function () { select(b); });
      b.addEventListener("keydown", function (e) {
        var vertical = opts && opts.vertical;
        var nextKey = vertical ? "ArrowDown" : "ArrowRight", prevKey = vertical ? "ArrowUp" : "ArrowLeft";
        if (e.key === nextKey) { e.preventDefault(); select(btns[(i + 1) % btns.length], true); }
        else if (e.key === prevKey) { e.preventDefault(); select(btns[(i - 1 + btns.length) % btns.length], true); }
        else if (e.key === "Home") { e.preventDefault(); select(btns[0], true); }
        else if (e.key === "End") { e.preventDefault(); select(btns[btns.length - 1], true); }
      });
    });
    var start = btns[0];
    if (opts && opts.hash) {
      var h = location.hash.slice(1);
      btns.forEach(function (b) { if (b.getAttribute("aria-controls") === h) start = b; });
    }
    select(start);
    return { select: select, btns: btns };
  }
  var needs = $("#needs");
  if (needs) tabs(needs, function (b) { return document.getElementById(b.getAttribute("aria-controls")); }, { vertical: true });
  var seg = $("#seg");
  if (seg) {
    var segCtl = tabs(seg, function (b) { return document.getElementById(b.getAttribute("aria-controls")); }, { hash: true });
    window.addEventListener("hashchange", function () {
      var h = location.hash.slice(1);
      segCtl.btns.forEach(function (b) { if (b.getAttribute("aria-controls") === h) segCtl.select(b); });
    });
  }

  /* ---------- Vérificateur de document ---------- */
  var chips = $("#chips");
  if (chips) {
    var verdict = $("#verdict");
    var V = {
      sworn: { cls: "sworn", icon: "i-shield", h: ["Traduction assermentée recommandée", "শপথবদ্ধ অনুবাদ প্রস্তাবিত"],
        p: ["Ce type de document est généralement exigé certifié conforme par les administrations françaises.", "এ ধরনের নথি ফ্রান্সের প্রশাসন সাধারণত সনদিত অনুবাদে চায়।"], s: "Traduction assermentée" },
      plain: { cls: "plain", icon: "i-file", h: ["Traduction normale suffisante", "সাধারণ অনুবাদই যথেষ্ট"],
        p: ["Sauf si l'organisme destinataire demande une certification : dans ce cas, dites-le-nous dans votre demande.", "তবে গ্রহীতা সংস্থা সনদ চাইলে অনুরোধে আমাদের জানান।"], s: "Traduction normale" }
    };
    var cta = ["Demander un devis", "মূল্য-উদ্ধৃতি চান"], current = null;
    function render() {
      if (!current) return;
      var v = V[current], i = lang === "bn" ? 1 : 0;
      verdict.className = "verdict " + v.cls + " pop";
      verdict.innerHTML = '<svg class="ico" aria-hidden="true"><use href="#' + v.icon + '"/></svg><div><h3>' + v.h[i] + "</h3><p>" + v.p[i] +
        '</p><a class="btn btn-primary btn-sm" href="devis.html?s=' + encodeURIComponent(v.s) + '">' + cta[i] + "</a></div>";
    }
    $$(".chip", chips).forEach(function (c) {
      c.addEventListener("click", function () {
        $$(".chip", chips).forEach(function (x) { x.setAttribute("aria-pressed", x === c ? "true" : "false"); });
        current = c.getAttribute("data-type"); render();
      });
    });
    document.addEventListener("fn:lang", render);
  }

  /* ---------- Apparition des étapes ---------- */
  var steps = $(".steps");
  if (steps && "IntersectionObserver" in window && !reduce) {
    var io = new IntersectionObserver(function (en) {
      en.forEach(function (e) { if (e.isIntersecting) { steps.classList.add("in"); io.disconnect(); } });
    }, { threshold: 0.35 });
    io.observe(steps);
  } else if (steps) steps.classList.add("in");

  /* ---------- Formulaire de devis ---------- */
  var form = $("#devis-form");
  if (form) {
    var EMAIL = form.getAttribute("data-email"), WA = form.getAttribute("data-wa");
    var sv = /[?&]s=([^&]+)/.exec(location.search);
    if (sv) {
      var want = decodeURIComponent(sv[1].replace(/\+/g, " "));
      $$('input[name="service"]', form).forEach(function (r) { if (r.value === want) r.checked = true; });
    }
    var file = $("#fichier"), fileNote = $("#file-note");
    if (file) file.addEventListener("change", function () { fileNote.hidden = !file.files.length; });

    function setBad(field, bad) { field.classList.toggle("bad", bad); }
    function validate() {
      var ok = true, first = null;
      $$(".field[data-req]", form).forEach(function (f) {
        var inp = $("input,select,textarea", f), v = (inp.value || "").trim(), bad = !v;
        if (!bad && inp.type === "email") bad = !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(v);
        setBad(f, bad); if (bad) { ok = false; if (!first) first = inp; }
      });
      var svc = $('input[name="service"]:checked', form), sf = $("#svc-fs");
      sf.classList.toggle("bad", !svc);
      if (!svc) { ok = false; if (!first) first = $('input[name="service"]', form); }
      if (first) first.focus();
      return ok;
    }
    $$(".field input,.field select,.field textarea", form).forEach(function (i) {
      i.addEventListener("input", function () { setBad(i.closest(".field"), false); });
    });
    $$('input[name="service"]', form).forEach(function (r) { r.addEventListener("change", function () { $("#svc-fs").classList.remove("bad"); }); });

    function summary() {
      var g = function (n) { return (form.elements[n] && form.elements[n].value || "").trim(); };
      return {
        subject: "Demande de devis — " + g("service") + " — " + g("nom"),
        body: [
          "Nom / নাম : " + g("nom"),
          "E-mail : " + g("email"),
          "Téléphone / ফোন : " + (g("tel") || "-"),
          "Service : " + g("service"),
          "Langues : " + g("source") + " -> " + g("cible"),
          "Délai / সময়সীমা : " + (g("delai") || "-"),
          "",
          "Message :",
          g("message")
        ].join("\n")
      };
    }
    var okBox = $("#form-success");
    function done() { okBox.classList.add("show"); okBox.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "nearest" }); }
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      if (!validate()) return;
      var s = summary();
      window.location.href = "mailto:" + EMAIL + "?subject=" + encodeURIComponent(s.subject) + "&body=" + encodeURIComponent(s.body);
      done();
    });
    var waBtn = $("#wa-btn");
    if (waBtn) waBtn.addEventListener("click", function () {
      if (!validate()) return;
      var s = summary();
      window.open("https://wa.me/" + WA + "?text=" + encodeURIComponent(s.subject + "\n\n" + s.body), "_blank", "noopener");
      done();
    });
  }
})();
