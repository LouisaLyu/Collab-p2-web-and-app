/* Shared iteration of the Web and Mobile wireframes. All data stays in this demo. */
(() => {
  const mobile = !!document.querySelector('#phone');
  const root = mobile ? document.querySelector('#phone') : document.body;
  const home = mobile ? 'start' : 'home';
  const esc = value => String(value).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const hostSection = document.querySelector(mobile ? '#s-host' : '#p-host');
  hostSection.querySelector('.disabled-sec')?.remove();
  document.querySelector('#hDate').insertAdjacentHTML('afterend', '<p class="hint">Choose the first event date.</p>');
  document.querySelector('#hTime').insertAdjacentHTML('afterend', '<p class="hint">Munich local time · 24-hour clock</p>');
  document.querySelector('#hDate').min = new Date().toLocaleDateString('en-CA');
  document.querySelector('#hTime').step = '900';
  ['#hDate', '#hTime'].forEach(selector => {
    const input = document.querySelector(selector);
    input.addEventListener('click', () => {
      try { input.showPicker?.(); } catch { /* Native text entry remains available. */ }
    });
  });
  document.querySelector('#hDate').closest('.row').insertAdjacentHTML('afterend', `
    <label class="f" for="hRepeat">Repeat event</label>
    <select class="in" id="hRepeat"><option value="once">Does not repeat</option><option value="weekly">Weekly · 4 occurrences</option><option value="fortnightly">Every 2 weeks · 4 occurrences</option></select>
    <p class="hint">Each date has its own tickets and capacity.</p>`);
  document.querySelector('#hPriceIn').insertAdjacentHTML('afterend', '<p class="hint" id="priceExplanation" aria-live="polite"></p>');
  document.querySelector('#hPrice').type = 'number';
  document.querySelector('#hPrice').min = '0.01';
  document.querySelector('#hPrice').step = '0.01';
  document.querySelector('#hPrice').setAttribute('aria-label', 'Ticket price in euros per person');
  document.querySelectorAll('label.f').forEach(label => {
    const input = label.nextElementSibling;
    if (input?.id) label.htmlFor = input.id;
  });

  function pricing() {
    const p = Number(document.querySelector('#hPrice').value);
    document.querySelector('#priceExplanation').textContent = S.host.pt === 'fixed'
      ? `Per guest: ${money(p || 0)} ticket + ${money(Math.round((p || 0) * 5) / 100)} service fee. You set the ticket price; guests see the fee before booking.`
      : S.host.pt === 'pwyc' ? 'Reserve for free. Guests may contribute at the event; no online payment or service fee.' : 'Free entry. No payment or service fee.';
  }
  hostSection.addEventListener('input', pricing);
  hostSection.addEventListener('click', () => queueMicrotask(pricing));
  const originalDraft = hostDraft;
  hostDraft = function () {
    const d = originalDraft();
    if (S.host.pt === 'fixed') d.price = Math.round(Number(document.querySelector('#hPrice').value) * 100) / 100;
    d.repeat = document.querySelector('#hRepeat').value;
    d.isoDate = document.querySelector('#hDate').value;
    d.cap = S.host.cap;
    return d;
  };
  const preview = document.querySelector('#toPreview').onclick;
  document.querySelector('#toPreview').onclick = () => {
    const date = document.querySelector('#hDate');
    const today = new Date().toLocaleDateString('en-CA');
    const p = Number(document.querySelector('#hPrice').value);
    const valid = date.value >= today && document.querySelector('#hTime').value && (S.host.pt !== 'fixed' || Number.isFinite(p) && p >= .01);
    if (!valid) {
      const error = document.querySelector('#errHost');
      error.textContent = 'Choose today or a future date, a start time, and a valid ticket price.';
      error.classList.add('show'); error.scrollIntoView({block:'nearest'}); return;
    }
    document.querySelector('#errHost').textContent = 'Add a name, a date, and a location.';
    preview();
  };
  const originalPreview = renderPreview;
  renderPreview = function () {
    originalPreview();
    const target = document.querySelector(mobile ? '#previewCard' : '#previewSum');
    target.insertAdjacentHTML('beforeend', `<div class="box recurrence"><b>${S.draft.repeat === 'once' ? 'One event' : '4 dates · ' + (S.draft.repeat === 'weekly' ? 'weekly' : 'every 2 weeks')}</b><p class="hint">${S.draft.repeat === 'once' ? 'Tickets are for this date only.' : 'Your first date and the next three occurrences will appear separately in Explore.'}</p></div>`);
  };
  const create = document.querySelector('#createBtn').onclick;
  document.querySelector('#createBtn').onclick = () => {
    const draft = S.draft;
    create();
    if (draft.repeat !== 'once') {
      for (let i = 1; i <= 3; i++) {
        const date = new Date(draft.isoDate + 'T12:00:00');
        date.setDate(date.getDate() + i * (draft.repeat === 'weekly' ? 7 : 14));
        S.events.push({...draft, id: draft.id + '-' + i, isoDate: date.toLocaleDateString('en-CA'), date: date.toLocaleDateString('en-GB', {weekday:'short',day:'numeric',month:'short'}).replace(',', '')});
      }
    }
  };

  const capacities = [60,8,50,40,16,120,30,150,20];
  function prepareEvents() {
    if (!S.events.some(e => e.id === 'e9')) S.events.push({id:'e9',title:'Sketch & Tea Club',spot:8,time:'18:30–20:30',price:6,sob:'free',spots:11,cap:20,host:'Westpark Pavilion',desc:'Bring a sketchbook. Tea and pencils provided.'});
    S.events.forEach((e, i) => {
      e.cap ??= capacities[i] || e.spots;
      if (e.host !== 'You' && !e.isoDate) {
        const date = new Date(); date.setDate(date.getDate() + i + 2);
        e.isoDate = date.toLocaleDateString('en-CA');
        e.date = date.toLocaleDateString('en-GB', {weekday:'short',day:'numeric',month:'short'}).replace(',', '');
        delete e.priceMax;
      }
    });
  }
  prepareEvents();

  const originalEvent = renderEvent;
  renderEvent = function () {
    originalEvent();
    const e = S.cur;
    const target = document.querySelector(mobile ? '#eventBody' : '#eventWrap .ev > div');
    target.querySelector('.faces')?.remove();
    if (mobile) [...target.querySelectorAll('.sec')].find(el => el.textContent === "Who's going")?.nextElementSibling?.remove();
    target.insertAdjacentHTML('beforeend', `<div class="box attendance"><b>${Math.max(0,e.cap - e.spots)} attending · ${e.spots} spots available</b><p class="hint">Contact the host to confirm accessibility.</p></div>`);
    addReportSection(target, e);
  };
  const originalTickets = renderTickets;
  renderTickets = function () {
    originalTickets();
    document.querySelectorAll('#ticketsBody .ti small:first-of-type').forEach(el => el.classList.add('ticket-date'));
    const tickets = [...S.tickets.filter(t => !t.past), ...S.tickets.filter(t => t.past)];
    document.querySelectorAll('#ticketsBody .tk .ti').forEach((details, index) => {
      const ticket = tickets[index];
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'report-ticket';
      button.textContent = 'Report a concern';
      button.onclick = () => showReport(S.events.find(e => e.id === ticket.id) || ticket);
      details.append(button);
    });
  };
  const originalDone = renderDone;
  renderDone = function () {
    originalDone();
    addReportSection(document.querySelector(mobile ? '#doneBody' : '#doneWrap .co .main'), S.cur);
  };
  const originalRender = render;
  let visitedPages = [];
  let lastPage = mobile ? S.screen : S.page;
  function updateBackButtons() {
    document.querySelectorAll(mobile ? '.screen' : '.page').forEach(page => {
      const ticketsPage = page.id === (mobile ? 's-' : 'p-') + 'tickets';
      if (page.id === (mobile ? 's-' : 'p-') + home) {
        page.querySelector('.page-back-row')?.remove();
        page.querySelector('.page-back-button')?.remove();
        return;
      }
      let button = page.querySelector('.page-back-button');
      if (!button) {
        const top = mobile ? page.querySelector('.top') : null;
        button = top?.querySelector('button[data-back]');
        if (!button) {
          button = document.createElement('button');
          button.type = 'button';
          button.setAttribute('data-back', '');
          if (top) top.prepend(button);
          else {
            const row = document.createElement('div');
            row.className = mobile ? 'page-back-row' : 'wrap page-back-row';
            row.append(button);
            page.prepend(row);
          }
        }
        button.classList.remove('back');
        button.classList.add('page-back-button');
        if (ticketsPage) {
          button.removeAttribute('data-back');
          button.setAttribute('data-go', home);
          button.textContent = 'Home';
          page.querySelector('.home-link')?.remove();
        } else {
          button.innerHTML = '<span aria-hidden="true">←</span> <span>Back</span>';
        }
      }
      button.disabled = !ticketsPage && visitedPages.length === 0;
    });
  }
  // Record every page transition, including header, tab and completion-page jumps.
  // The original flow stacks sometimes reset to Home, so keep actual visits separately.
  back = function () {
    if (!visitedPages.length) return;
    const destination = visitedPages.pop();
    lastPage = destination;
    if (mobile) S.screen = destination;
    else S.page = destination;
    render();
  };
  render = function () {
    const current = mobile ? S.screen : S.page;
    if (current !== lastPage) {
      visitedPages.push(lastPage);
      lastPage = current;
    }
    S.stack = [...visitedPages];
    prepareEvents(); originalRender(); pricing(); updateBackButtons();
  };
  const originalReset = resetAll;
  resetAll = function () {
    visitedPages = [];
    lastPage = home;
    document.querySelector('#hRepeat').value = 'once';
    originalReset();
  };

  function addReportSection(target, event) {
    const section = document.createElement('section');
    section.className = 'box report-section';
    section.innerHTML = '<h3>Safety and support</h3><p class="hint">Something feel unsafe at the event or host space? Report behaviour, venue conditions, or misleading information.</p><button type="button" class="btn ghost report-trigger">Report a concern</button>';
    section.querySelector('button').onclick = () => showReport(event);
    target.append(section);
  }
  function showReport(event) {
    if (root.querySelector('.report-dialog')) return;
    const reportableEvents = [...S.events, ...S.tickets.filter(t => !S.events.some(e => e.id === t.id))];
    const dialog = document.createElement('dialog');
    dialog.className = 'report-dialog';
    dialog.setAttribute('aria-labelledby', 'reportTitle');
    dialog.innerHTML = `<form method="dialog"><h2 id="reportTitle">Report a concern</h2><p class="hint">If you are in immediate danger, move to a safe place and contact local emergency services. This form is not monitored for emergencies.</p>
      <label class="f" for="reportEvent">Event or host space</label><select class="in" id="reportEvent" required><option value="">Choose an event or space</option>${reportableEvents.map(item => `<option value="${esc(item.id)}" ${item.id === event?.id ? 'selected' : ''}>${esc(item.title)} · ${esc(sp(item).name)}</option>`).join('')}</select>
      <label class="f" for="reportTarget">What is your concern about?</label><select class="in" id="reportTarget" required><option value="event">The event or an attendee</option><option value="host">The host or venue</option></select>
      <label class="f" for="reportReason">What happened?</label><select class="in" id="reportReason" required><option value="">Choose a reason</option><option>Unsafe behaviour or harassment</option><option>Unsafe venue conditions</option><option>Misleading event information</option><option>Alcohol policy concern</option><option>Accessibility concern</option><option>Other concern</option></select>
      <label class="f" for="reportDetails">Details (optional)</label><textarea class="in" id="reportDetails" rows="3" maxlength="1000" placeholder="Describe what happened and where. Avoid sharing unnecessary personal details."></textarea>
      <p class="hint">Prototype only: reports are kept in memory for this session and are not sent to a support team.</p><div class="report-actions"><button class="btn ghost" type="button" id="cancelReport">Cancel</button><button class="btn" type="submit">Save demo report</button></div></form>`;
    root.append(dialog);
    dialog.querySelector('#cancelReport').onclick = () => dialog.close();
    dialog.querySelector('form').onsubmit = submitEvent => {
      submitEvent.preventDefault();
      const selectedEvent = reportableEvents.find(item => item.id === dialog.querySelector('#reportEvent').value);
      if (!selectedEvent) { dialog.querySelector('#reportEvent').focus(); return; }
      const reason = dialog.querySelector('#reportReason').value;
      if (!reason) { dialog.querySelector('#reportReason').focus(); return; }
      S.reports ??= [];
      const report = {id:'RPT-' + String(S.reports.length + 1).padStart(4,'0'),eventId:selectedEvent.id,eventTitle:selectedEvent.title,venue:sp(selectedEvent).name,target:dialog.querySelector('#reportTarget').value,reason,details:dialog.querySelector('textarea').value,createdAt:new Date().toISOString()};
      S.reports.push(report);
      dialog.innerHTML = `<h2 id="reportTitle">Demo report saved</h2><p role="status">Reference ${esc(report.id)}</p><p class="hint">Your concern about ${esc(report.eventTitle)} has been saved for this session. No report was sent to a support team. Refreshing clears it.</p><button type="button" class="btn" id="closeReport">Done</button>`;
      dialog.querySelector('#closeReport').onclick = () => dialog.close();
      dialog.querySelector('#closeReport').focus();
    };
    dialog.onclose = () => dialog.remove();
    dialog.showModal();
  }
  document.addEventListener('click', click => {
    if (!click.target.closest('[data-report]')) return;
    const current = mobile ? S.screen : S.page;
    showReport(['event', 'info', 'confirm', 'done'].includes(current) ? S.cur : null);
  });
  if (mobile) {
    document.querySelectorAll('.screen .top').forEach(top => {
      top.insertAdjacentHTML('beforeend', '<button type="button" class="report-launcher" data-report>Report a concern</button>');
    });
    document.querySelector('#s-start > div').insertAdjacentHTML('afterbegin', '<button type="button" class="report-launcher start-report" data-report>Report a concern</button>');
    document.querySelectorAll('.tabs').forEach(nav => {
      nav.innerHTML = '<button data-go="start">Home</button><button data-go="discover">Explore</button><button data-go="host">Host</button><button data-go="tickets">Tickets</button>';
    });
    document.querySelectorAll('.screen .top').forEach(top => {
      if (!top.querySelector('[data-go="start"]')) top.insertAdjacentHTML('beforeend','<button class="home-link" data-go="start" aria-label="Return to home">Home</button>');
    });
    document.querySelector('#s-discover .filters').insertAdjacentHTML('beforebegin','<p class="filter-heading">Filter events</p>');
  }
  // Translate interface controls locally; event and host-authored content keeps its original language.
  const de = {
    'Booking details':'Buchungsdetails','Booking reference':'Buchungsnummer','Confirmation sent to':'Bestätigung gesendet an',
    'Back':'Zurück',
    'Find your people in Munich.':'Finde deine Leute in München.',
    'Explore events':'Events entdecken','Explore':'Entdecken','Home':'Start',
    'Host an event':'Event veranstalten','My tickets':'Meine Tickets','Tickets':'Tickets',
    'I want to join':'Ich möchte teilnehmen','I want to host':'Ich möchte veranstalten',
    'I want to host events':'Ich möchte Events veranstalten','Host':'Veranstalten',
    'Events near you':'Events in deiner Nähe','Explore events in Munich':'Events in München entdecken',
    'How do you want to start?':'Wie möchtest du starten?',
    'Filters':'Filter','Filter events':'Events filtern','Clear all':'Alle zurücksetzen',
    'Distance':'Entfernung','Level of sobriety':'Alkoholangebot','Price range':'Preisspanne',
    'Any':'Alle','Show everything':'Alles anzeigen','Alcohol-free':'Alkoholfrei',
    'Low-alcohol':'Alkoholarm','Mixed':'Gemischt',
    'Show events':'Events anzeigen','Reset':'Zurücksetzen','Search':'Suchen',
    'Event name':'Eventname','Date':'Datum','Start':'Beginn','Start time':'Startzeit',
    'Repeat event':'Event wiederholen','Does not repeat':'Keine Wiederholung',
    'Weekly · 4 occurrences':'Wöchentlich · 4 Termine',
    'Every 2 weeks · 4 occurrences':'Alle 2 Wochen · 4 Termine',
    'Location':'Ort','Price charged':'Ticketpreis','Free':'Kostenlos',
    'Fixed price':'Fester Preis','Pay what you can':'Zahle, was du kannst',
    'Capacity':'Kapazität','Preview event':'Eventvorschau','Review event':'Event prüfen',
    'Preview':'Vorschau','Create the event':'Event erstellen','Edit':'Bearbeiten',
    'Join event':'Teilnehmen','Upcoming':'Bevorstehend','Past':'Vergangen',
    'Leave feedback':'Feedback geben','Send feedback':'Feedback senden',
    'Report a concern':'Problem melden','What happened?':'Was ist passiert?',
    'Choose a reason':'Grund auswählen','Cancel':'Abbrechen',
    'Save demo report':'Demo-Meldung speichern','Details (optional)':'Details (optional)',
    'Unsafe behaviour or harassment':'Unsicheres Verhalten oder Belästigung',
    'Misleading event information':'Irreführende Eventinformationen',
    'Alcohol policy concern':'Problem mit den Alkoholregeln',
    'Accessibility concern':'Problem mit der Barrierefreiheit',
    'Get directions':'Route anzeigen','Summary':'Übersicht','Service fee':'Servicegebühr',
    'Total':'Gesamt','Payment':'Zahlung','Contact':'Kontakt','When':'Wann',
    'Spots left':'Freie Plätze','About':'Über das Event',"Who's going":'Wer nimmt teil?',
    'How it works':'So funktioniert es','View more':'Mehr anzeigen',
    'List your space':'Event veranstalten',
    'Choose the first event date.':'Wähle den ersten Termin.',
    'Munich local time · 24-hour clock':'Ortszeit München · 24-Stunden-Format',
    'Each date has its own tickets and capacity.':'Jeder Termin hat eigene Tickets und Kapazität.',
    'Free entry. No payment or service fee.':'Kostenloser Eintritt. Keine Zahlung oder Servicegebühr.'
  };
  let language = 'en';
  const originals = new WeakMap();
  const languageButton = document.createElement('button');
  languageButton.className = 'language-button';
  languageButton.type = 'button';
  languageButton.setAttribute('aria-label', 'Interface language: English or German. Event descriptions keep their original language.');
  (mobile ? document.querySelector('.status') : document.querySelector('.hdr-r')).append(languageButton);
  if (mobile) root.append(languageButton);
  function translate() {
    observer.disconnect();
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
    while (walker.nextNode()) {
      const node = walker.currentNode;
      if (node.parentElement.closest('script,style,.language-button')) continue;
      const value = node.textContent.trim();
      const prior = originals.get(node);
      if (prior && value !== de[prior] && value !== prior) originals.delete(node);
      const english = originals.get(node) || value;
      if (de[english]) {
        originals.set(node, english);
        node.textContent = node.textContent.replace(value, language === 'de' ? de[english] : english);
      }
    }
    languageButton.textContent = language === 'en' ? 'EN / Deutsch' : 'DE / English';
    document.documentElement.lang = language;
    observer.observe(root, {subtree:true, childList:true, characterData:true});
  }
  const observer = new MutationObserver(translate);
  languageButton.onclick = () => { language = language === 'en' ? 'de' : 'en'; translate(); };
  translate();
  document.querySelector('#toast').setAttribute('role','status');
  document.querySelectorAll('[data-q], [data-cap]').forEach(b => b.setAttribute('aria-label', (b.dataset.q || b.dataset.cap) === '+' ? 'Increase quantity' : 'Decrease quantity'));
  render();
})();
