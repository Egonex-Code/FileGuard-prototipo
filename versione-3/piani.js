// Piani: anteprima del calcolo delle postazioni. Nessuna cifra: solo i computer sul filo.
(function () {
  var box = document.querySelector('.calcolatore');
  if (!box) return;
  var numero = box.querySelector('.contatore-numero');
  var schermi = box.querySelectorAll('.schermi-fila li');
  var oltre = box.querySelector('.schermi-oltre');
  var meno = box.querySelector('[data-passo="-1"]');
  var n = 3;
  var MAX = 99;

  function mostra(prima) {
    numero.textContent = n;
    schermi.forEach(function (li, i) {
      var vedi = i < n;
      if (vedi && li.hidden && i >= prima) li.classList.add('arriva');
      li.hidden = !vedi;
    });
    oltre.hidden = n <= schermi.length;
    meno.disabled = n <= 1;
  }

  box.addEventListener('click', function (e) {
    var tasto = e.target.closest('[data-passo]');
    if (!tasto) return;
    var prima = n;
    n = Math.min(MAX, Math.max(1, n + Number(tasto.dataset.passo)));
    mostra(prima);
  });

  mostra(n);
})();
