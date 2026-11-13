// Piani: calcolo del prezzo per postazioni (decisione 13/11).
// 450 € l'anno il primo computer, 60 € l'anno ogni computer in più. Calcolo fino a 20 computer, oltre: «Chiedici informazioni». Sul filo si vedono al massimo 10 computer, poi «+N».
(function () {
  var PRIMO = 450;
  var ALTRO = 60;
  var MAX_CALCOLO = 20;

  var box = document.querySelector('.calcolatore');
  if (!box) return;
  var numero = box.querySelector('.contatore-numero');
  var schermi = box.querySelectorAll('.schermi-fila li');
  var oltre = box.querySelector('.schermi-oltre');
  var meno = box.querySelector('[data-passo="-1"]');
  var piu = box.querySelector('[data-passo="1"]');
  var cifra = box.querySelector('#prezzo-cifra');
  var per = box.querySelector('#prezzo-per');
  var totale = box.querySelector('.prezzo-totale');
  var oltreLimite = box.querySelector('#prezzo-oltre');
  var iva = box.querySelector('#prezzo-iva');
  var n = 3;

  function prezzo(computer) {
    return PRIMO + ALTRO * (computer - 1);
  }

  // 1590 diventa «1.590»
  function euro(valore) {
    return String(valore).replace(/\B(?=(\d{3})+(?!\d))/g, '.') + ' €';
  }

  function mostra(prima) {
    var troppi = n > MAX_CALCOLO;
    numero.textContent = troppi ? MAX_CALCOLO + '+' : n;
    schermi.forEach(function (li, i) {
      var vedi = i < n;
      if (vedi && li.hidden && i >= prima) li.classList.add('arriva');
      li.hidden = !vedi;
    });
    oltre.hidden = n <= schermi.length;
    oltre.textContent = troppi ? MAX_CALCOLO + '+' : '+' + (n - schermi.length);
    totale.hidden = troppi;
    iva.hidden = troppi;
    oltreLimite.hidden = !troppi;
    if (!troppi) {
      per.textContent = 'Per ' + n + ' computer: ';
      cifra.textContent = euro(prezzo(n));
    }
    meno.disabled = n <= 1;
    piu.disabled = troppi;
  }

  box.addEventListener('click', function (e) {
    var tasto = e.target.closest('[data-passo]');
    if (!tasto || tasto.disabled) return;
    var prima = n;
    n = Math.min(MAX_CALCOLO + 1, Math.max(1, n + Number(tasto.dataset.passo)));
    mostra(prima);
  });

  mostra(n);
})();
