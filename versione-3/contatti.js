// Contatti FileGuard: invio del modulo allo stesso servizio del sito Egonex.
// Nessun dato salvato nel browser, nessun servizio esterno oltre a quello di Egonex, nessuna chiave.
// Se l'invio non riesce, il messaggio non si perde: si offre l'email già compilata.

const INDIRIZZO_INVIO = 'https://egonex-group.com/api/contact';
const EMAIL_RIPIEGO = {
  info: 'info@egonex-group.com',
  licensing: 'licensing@egonex-group.com',
};
const ATTESA_MASSIMA = 15000; // millisecondi

(function () {
  const modulo = document.getElementById('modulo-contatto');
  if (!modulo) return;

  modulo.noValidate = true; // i controlli li facciamo noi, con messaggi chiari

  const campi = {
    nome: modulo.elements.name,
    email: modulo.elements.email,
    studio: modulo.elements.company,
    messaggio: modulo.elements.message,
    privacy: modulo.elements.privacy,
    trappola: modulo.elements.website,
  };
  const pulsante = modulo.querySelector('button[type="submit"]');
  const testoPulsante = pulsante.textContent;
  const esito = document.getElementById('esito');
  const ripiego = document.getElementById('ripiego');
  const apriEmail = document.getElementById('apri-email');

  const formaEmail = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

  function controlla() {
    const errori = [];
    const nome = campi.nome.value.trim();
    const email = campi.email.value.trim();
    const studio = campi.studio.value.trim();
    const messaggio = campi.messaggio.value.trim();

    if (nome.length < 2) errori.push([campi.nome, 'Scrivi il tuo nome (almeno 2 lettere).']);
    else if (nome.length > 100) errori.push([campi.nome, 'Il nome può avere al massimo 100 caratteri.']);

    if (!email) errori.push([campi.email, 'Scrivi la tua email, così possiamo risponderti.']);
    else if (!formaEmail.test(email) || email.length > 254) errori.push([campi.email, "Controlla l'email: per esempio nome@studio.it."]);

    if (studio.length > 100) errori.push([campi.studio, 'Il nome dello studio può avere al massimo 100 caratteri.']);

    if (messaggio.length < 10) errori.push([campi.messaggio, 'Scrivi qualche parola in più (almeno 10 caratteri).']);
    else if (messaggio.length > 2000) errori.push([campi.messaggio, 'Il messaggio può avere al massimo 2000 caratteri.']);

    if (!campi.privacy.checked) errori.push([campi.privacy, "Per inviare devi accettare l'informativa privacy."]);

    return errori;
  }

  function mostraErrore(campo, testo) {
    const riga = document.getElementById(campo.id + '-errore');
    campo.setAttribute('aria-invalid', 'true');
    if (riga) {
      riga.textContent = testo;
      riga.hidden = false;
    }
  }

  function pulisciErrore(campo) {
    const riga = document.getElementById(campo.id + '-errore');
    campo.removeAttribute('aria-invalid');
    if (riga) {
      riga.textContent = '';
      riga.hidden = true;
    }
  }

  function argomento() {
    const scelto = modulo.querySelector('input[name="recipient"]:checked');
    return scelto && scelto.value === 'licensing' ? 'licensing' : 'info';
  }

  function datiDaInviare() {
    return {
      name: campi.nome.value.trim(),
      email: campi.email.value.trim(),
      company: campi.studio.value.trim(),
      message: campi.messaggio.value.trim(),
      privacy: true,
      recipient: argomento(),
      preferredLanguage: 'it',
    };
  }

  function emailGiaCompilata(dati) {
    const tema = dati.recipient === 'licensing' ? 'Licenze e prezzi' : 'Informazioni generali';
    const oggetto = 'FileGuard: ' + tema;
    const righe = [
      'Nome: ' + dati.name,
      'Email: ' + dati.email,
    ];
    if (dati.company) righe.push('Studio o azienda: ' + dati.company);
    righe.push('', dati.message);
    return 'mailto:' + EMAIL_RIPIEGO[dati.recipient] +
      '?subject=' + encodeURIComponent(oggetto) +
      '&body=' + encodeURIComponent(righe.join('\n'));
  }

  function mostraEsito(testo, tipo) {
    esito.textContent = testo;
    esito.className = 'esito esito-' + tipo;
    esito.hidden = false;
  }

  function staInviando(si) {
    pulsante.disabled = si;
    pulsante.textContent = si ? 'Invio in corso…' : testoPulsante;
  }

  // Mentre si corregge, l'errore sparisce dal campo
  Object.values(campi).forEach(function (campo) {
    if (!campo || campo === campi.trappola) return;
    campo.addEventListener('input', function () { pulisciErrore(campo); });
    campo.addEventListener('change', function () { pulisciErrore(campo); });
  });

  modulo.addEventListener('submit', async function (evento) {
    evento.preventDefault();
    ripiego.hidden = true;
    esito.hidden = true;

    // Trappola compilata: è un programma automatico, non si invia niente
    if (campi.trappola.value) return;

    Object.values(campi).forEach(function (campo) { if (campo) pulisciErrore(campo); });
    const errori = controlla();
    if (errori.length) {
      errori.forEach(function (e) { mostraErrore(e[0], e[1]); });
      errori[0][0].focus();
      mostraEsito(errori.length === 1 ? 'Manca una cosa: la trovi segnata sopra.' : 'Mancano ' + errori.length + ' cose: le trovi segnate sopra.', 'errore');
      return;
    }

    const dati = datiDaInviare();
    staInviando(true);
    mostraEsito('Invio in corso…', 'attesa');

    const ferma = new AbortController();
    const orologio = setTimeout(function () { ferma.abort(); }, ATTESA_MASSIMA);

    try {
      const risposta = await fetch(INDIRIZZO_INVIO, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dati),
        signal: ferma.signal,
      });
      let risultato = null;
      try { risultato = await risposta.json(); } catch (e) { risultato = null; }

      if (risposta.ok && risultato && risultato.success) {
        modulo.reset();
        mostraEsito('Grazie, abbiamo ricevuto il tuo messaggio. Ti risponde una persona.', 'fatto');
        esito.focus();
      } else {
        throw new Error('Invio non riuscito');
      }
    } catch (errore) {
      // Origine non ammessa, rete assente, servizio in errore: si passa all'email
      esito.hidden = true;
      apriEmail.href = emailGiaCompilata(dati);
      ripiego.hidden = false;
      apriEmail.focus();
    } finally {
      clearTimeout(orologio);
      staInviando(false);
    }
  });
})();
