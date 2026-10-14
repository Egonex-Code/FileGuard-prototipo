(function () {
  var bottone = document.querySelector(".menu-apri");
  var menu = document.getElementById("menu");

  if (bottone && menu) {
    bottone.addEventListener("click", function () {
      var aperto = menu.classList.toggle("aperto");
      bottone.setAttribute("aria-expanded", aperto ? "true" : "false");
    });

    document.addEventListener("keydown", function (evento) {
      if (evento.key === "Escape" && menu.classList.contains("aperto")) {
        menu.classList.remove("aperto");
        bottone.setAttribute("aria-expanded", "false");
        bottone.focus();
      }
    });
  }

  document.querySelectorAll(".regola").forEach(function (tasto) {
    tasto.addEventListener("click", function () {
      var aperto = tasto.getAttribute("aria-expanded") === "true";
      document.querySelectorAll(".regola").forEach(function (altro) {
        altro.setAttribute("aria-expanded", "false");
        var testo = altro.querySelector(".regola-testo");
        if (testo) testo.hidden = true;
      });
      if (!aperto) {
        tasto.setAttribute("aria-expanded", "true");
        var testo = tasto.querySelector(".regola-testo");
        if (testo) testo.hidden = false;
      }
    });
  });

  document.querySelectorAll("[data-avviso]").forEach(function (el) {
    el.addEventListener("click", function () {
      var riga = document.getElementById(el.getAttribute("data-avviso"));
      if (riga) {
        riga.hidden = false;
      }
    });
  });

  document.querySelectorAll("form.modulo").forEach(function (form) {
    form.addEventListener("submit", function (evento) {
      evento.preventDefault();
      var riga = form.querySelector(".avviso");
      if (riga) {
        riga.hidden = false;
      }
    });
  });
})();
