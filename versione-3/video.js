/* Video della home (23/11): al clic il riquadro diventa il lettore.
   Il file si carica solo adesso, parte con l'audio e non si ripete. */
(function () {
  var riquadro = document.querySelector('.video-copertina');
  var pulsante = riquadro && riquadro.querySelector('.video-play');
  if (!pulsante) return;

  pulsante.addEventListener('click', function (event) {
    var video = document.createElement('video');
    video.controls = true;
    video.preload = 'auto';
    video.playsInline = true;
    video.poster = 'video/fileguard-60s-copertina.jpg';
    video.setAttribute('aria-label', 'Video: FileGuard in 60 secondi');
    video.src = 'video/fileguard-60s-v2.mp4';

    riquadro.textContent = '';
    riquadro.classList.add('video-attivo');
    riquadro.appendChild(video);
    if (event.detail === 0) video.focus(); // solo se aperto da tastiera
    var avvio = video.play();
    if (avvio && avvio.catch) avvio.catch(function () {});
  });
})();
