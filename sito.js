(function () {
  var bottone = document.querySelector(".menu-apri");
  var menu = document.getElementById("menu");

  if (bottone && menu) {
    bottone.addEventListener("click", function () {
      var aperto = menu.classList.toggle("aperto");
      bottone.setAttribute("aria-expanded", aperto ? "true" : "false");
    });
  }

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
