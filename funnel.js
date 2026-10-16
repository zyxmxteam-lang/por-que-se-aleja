// Lógica compartida de upsell / downsell (1 clic con la tarjeta ya guardada en Stripe).
(function () {
  const F = window.FUNNEL || {};
  const qs = new URLSearchParams(location.search);
  const sessionId = qs.get("session_id") || "";
  const here = (p) => new URL(p, location.href).href;
  const withSession = (p) => here(p) + (sessionId ? "?session_id=" + encodeURIComponent(sessionId) : "");

  // Precios desde config.js
  const P = Object.assign({}, F.prices || {}, {});
  const PP = F.publicPrices || {};
  document.querySelectorAll("[data-p]").forEach((el) => (el.textContent = P[el.dataset.p]));
  document.querySelectorAll("[data-pp]").forEach((el) => (el.textContent = PP[el.dataset.pp]));

  function toast(t) {
    const el = document.querySelector(".toast");
    if (!el) return alert(t);
    el.textContent = t; el.style.display = "block";
    clearTimeout(el._t); el._t = setTimeout(() => (el.style.display = "none"), 3500);
  }

  if (F.metaPixelId) {
    !function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');
    fbq("init", F.metaPixelId); fbq("track", "PageView");
    // La página de upsell solo se ve después de pagar: ahí registramos la compra (1 vez por pago).
    if (document.body.dataset.purchase !== undefined && sessionId) {
      try {
        const k = "tovlov_purchase_" + sessionId;
        if (!localStorage.getItem(k)) { fbq("track", "Purchase", { value: P.front, currency: "MXN" }, { eventID: sessionId }); localStorage.setItem(k, "1"); }
      } catch (_) {}
    }
  }

  // <button data-accept="upsell" data-next="downsell.html|gracias.html">
  document.querySelectorAll("[data-accept]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const key = btn.dataset.accept;
      if (!F.klazeUrl) return toast("Falta conectar el pago: pega la URL de Klaze en config.js");
      if (!sessionId) return toast("No encontramos tu compra. Revisa el enlace de tu correo.");
      btn.disabled = true; btn.textContent = "Procesando…";
      // Formulario POST normal (no fetch): navega a Klaze, que cobra y redirige a "next".
      const f = document.createElement("form");
      f.method = "POST";
      f.action = F.klazeUrl.replace(/\/$/, "") + "/api/funnel/upsell";
      const add = (n, v) => { const i = document.createElement("input"); i.type = "hidden"; i.name = n; i.value = v; f.appendChild(i); };
      add("session_id", sessionId);
      add("item", (F.products || {})[key] || key);
      add("next", withSession(btn.dataset.next || "gracias.html"));
      document.body.appendChild(f); f.submit();
    });
  });

  // <a data-skip="downsell.html">
  document.querySelectorAll("[data-skip]").forEach((a) => {
    a.addEventListener("click", (e) => { e.preventDefault(); location.href = withSession(a.dataset.skip); });
  });

  // Mensaje de error que regresa Klaze (?error=...)
  const err = qs.get("error");
  if (err) toast(err === "card" ? "Tu banco pidió confirmar el cargo. Te llevamos a un pago seguro." : "No pudimos procesar el cargo. No se te cobró nada.");
})();
