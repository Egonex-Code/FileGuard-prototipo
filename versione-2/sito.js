(function () {
  var bottone = document.querySelector(".menu-apri");
  var menu = document.getElementById("menu");

  function chiudiMenu() {
    if (!bottone || !menu) return;
    menu.classList.remove("aperto");
    bottone.setAttribute("aria-expanded", "false");
    document.body.classList.remove("menu-aperto");
  }

  if (bottone && menu) {
    bottone.addEventListener("click", function () {
      var aperto = menu.classList.toggle("aperto");
      bottone.setAttribute("aria-expanded", aperto ? "true" : "false");
      document.body.classList.toggle("menu-aperto", aperto);
    });

    document.addEventListener("keydown", function (evento) {
      if (evento.key === "Escape" && menu.classList.contains("aperto")) {
        chiudiMenu();
        bottone.focus();
      }
    });

    menu.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", chiudiMenu);
    });
  }

  document.querySelectorAll("form.modulo").forEach(function (form) {
    form.addEventListener("submit", function (evento) {
      evento.preventDefault();
      var riga = form.querySelector(".avviso");
      if (riga) {
        riga.hidden = false;
      }
    });
  });

  var riduciMovimento = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var sezioni = document.querySelectorAll("main > .fascia:not(.apertura)");
  if (!riduciMovimento && "IntersectionObserver" in window && sezioni.length) {
    sezioni.forEach(function (sezione) {
      sezione.classList.add("entra");
    });

    function inVista(sezione) {
      var riquadro = sezione.getBoundingClientRect();
      var altezza = window.innerHeight || document.documentElement.clientHeight;
      return riquadro.top < altezza * 0.92 && riquadro.bottom > 0;
    }

    var comparsa = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.style.setProperty("--ritardo", "0ms");
        entry.target.classList.add("entrata");
        comparsa.unobserve(entry.target);
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -8% 0px" });

    requestAnimationFrame(function () {
      sezioni.forEach(function (sezione, indice) {
        if (inVista(sezione)) {
          sezione.style.setProperty("--ritardo", Math.min(indice * 80, 160) + "ms");
          sezione.classList.add("entrata");
        } else {
          comparsa.observe(sezione);
        }
      });
    });
  }

  var apertura = document.querySelector(".apertura");
  var barraBasso = document.querySelector(".barra-basso");
  if (apertura && barraBasso && "IntersectionObserver" in window) {
    var osservatore = new IntersectionObserver(function (entries) {
      var visibile = entries[0].isIntersecting;
      barraBasso.classList.toggle("visibile", !visibile);
      document.body.classList.toggle("con-barra-basso", !visibile);
    }, { threshold: 0 });
    osservatore.observe(apertura);
  }
})();
