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
