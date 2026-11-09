if (new URLSearchParams(location.search).has('notes')) document.body.classList.add('notes');
    const $ = (s, el = document) => el.querySelector(s);
    const $$ = (s, el = document) => [...el.querySelectorAll(s)];

    const SOB = {
      free: {label: 'Alcohol-free', desc: 'No alcohol served or allowed'},
      low: {label: 'Low-alcohol', desc: 'Mostly alcohol-free, a few low-ABV options'},
      mixed: {label: 'Mixed', desc: 'Drinks available, alcohol-free options on the menu'},
    };
    const SPOTS = [
      {name: 'Café Hailey', street: 'Türkenstraße 52', zip: '80799', area: 'Maxvorstadt', km: 1.2, x: 46, y: 40},
      {name: 'Glockenbach Kitchen', street: 'Fraunhoferstraße 18', zip: '80469', area: 'Glockenbachviertel', km: 2.4, x: 40, y: 62},
      {name: 'Englischer Garten, Chinesischer Turm', street: 'Englischer Garten 3', zip: '80538', area: 'Schwabing', km: 3.1, x: 62, y: 30},
      {name: 'Spielwiese Board Café', street: 'Leopoldstraße 77', zip: '80802', area: 'Schwabing', km: 4.0, x: 58, y: 20},
      {name: 'Werksviertel Hall 4', street: 'Atelierstraße 10', zip: '81671', area: 'Berg am Laim', km: 5.6, x: 74, y: 62},
      {name: 'Bahnwärter Thiel', street: 'Tumblingerstraße 29', zip: '80337', area: 'Sendling', km: 6.8, x: 30, y: 72},
      {name: 'Olympiapark Theatron', street: 'Spiridon-Louis-Ring 21', zip: '80809', area: 'Milbertshofen', km: 8.9, x: 30, y: 16},
      {name: 'Feringasee Beach', street: 'Feringastraße 1', zip: '85774', area: 'Unterföhring', km: 12.5, x: 90, y: 14},
      {name: 'Westpark Pavilion', street: 'Westendstraße 305', zip: '80686', area: 'Westpark', km: 6.1, x: 14, y: 58},
    ];
    const BASE_EVENTS = [
      {id: 'e1', title: 'Sober Morning Rave', spot: 0, date: 'Sat 31 Oct', time: '10:00–13:00', price: 8, priceMax: 12, sob: 'free', spots: 14, cap: 60, host: 'Hailey Hostess', desc: 'Daytime dance party with coffee instead of drinks.'},
      {id: 'e2', title: 'Dinner for Strangers', spot: 1, date: 'Wed 4 Nov', time: '19:30–22:00', price: 18, sob: 'free', spots: 3, cap: 8, host: 'Glockenbach Kitchen', desc: 'Eight seats, one long table, a set menu.'},
      {id: 'e3', title: 'Run Club + Coffee', spot: 2, date: 'Sun 1 Nov', time: '09:00–10:30', price: 0, sob: 'free', spots: 40, cap: 50, host: 'Isar Runners', desc: '5 km easy loop that ends at the café.'},
      {id: 'e4', title: 'Board Game Night', spot: 3, date: 'Thu 29 Oct', time: '18:00–23:00', price: 5, sob: 'low', spots: 22, cap: 40, host: 'Spielwiese', desc: 'Hundreds of games, and staff who explain the rules.'},
      {id: 'e5', title: 'Zero-Proof Mixology Class', spot: 4, date: 'Fri 6 Nov', time: '19:00–21:00', price: 24, priceMax: 30, sob: 'free', spots: 9, cap: 16, host: 'Werksviertel Kollektiv', desc: 'Learn five alcohol-free cocktails to make at home.'},
      {id: 'e6', title: 'Pay-What-You-Can Open Mic', spot: 5, date: 'Tue 3 Nov', time: '20:00–23:00', price: 0, pwyc: true, sob: 'mixed', spots: 60, cap: 120, host: 'Bahnwärter Thiel', desc: 'Sign up at the door. The alcohol-free bar runs all night.'},
      {id: 'e7', title: 'Sunset Lake Swim Social', spot: 7, date: 'Sat 7 Nov', time: '16:00–18:30', price: 0, sob: 'free', spots: 25, cap: 30, host: 'Cold Water Club', desc: 'Short dip, hot tea, and a sauna tent.'},
      {id: 'e8', title: 'Silent Disco in the Park', spot: 6, date: 'Fri 30 Oct', time: '20:00–23:00', price: 14, sob: 'low', spots: 80, cap: 150, host: 'Theatron Nights', desc: 'Three DJ channels, headphones included.'},
      {id: 'e9', title: 'Sketch & Tea Club', spot: 8, date: 'Mon 2 Nov', time: '18:30–20:30', price: 6, sob: 'free', spots: 11, cap: 20, host: 'Westpark Pavilion', desc: 'Bring a sketchbook. Tea and pencils provided.'},
    ];
    const PRICE_BUCKETS = [
      {id: 'free', label: 'Free / pay what you can', test: e => e.price === 0},
      {id: 'u10', label: 'Under €10', test: e => e.price > 0 && e.price < 10},
      {id: '10to20', label: '€10–20', test: e => e.price >= 10 && e.price <= 20},
      {id: 'o20', label: 'Over €20', test: e => e.price > 20},
    ];
    const NOTES = {
      home: ['Entry point. The visitor picks one of two paths: join events, or host them.', 'Sticky: "Two options: User or Hosts" (Louisa)'],
      discover: ['Lists places and events nearby (10 km default). The search bar finds areas or spots. The sidebar filters by distance, sobriety, and price.', 'Stickies: list places ~10 km (Yamin), distance filter + search bar (Darian), sobriety + price filters (Louisa)'],
      event: ['The user selects the event they want to join and sees time, place, sobriety level, price, and spots left.', 'Sticky: "Select event they want to join" (Louisa)'],
      info: ['The user fills in email and/or phone, plus payment information. Free events skip payment.', 'Sticky: "Fill in their information" (Louisa)'],
      confirm: ['The user reviews the order, then confirms or pays.', 'Sticky: "Confirm / Pay" (Louisa)'],
      done: ['The user reviews location details and payment status. An email notification arrives.', 'Stickies: "Review details of location and status of payment" (Darian), "Notifications via email" (Louisa)'],
      tickets: ['Upcoming and past tickets. Past events ask for feedback. Click "Simulate: event ended" to test the loop.', 'Sticky: "Feedback after event" (Rajat)'],
      feedback: ['Short post-event feedback for the host.', 'Sticky: "Feedback after event" (Rajat)'],
      host: ['The host sets the sobriety level and price charged, and searches for the spot. The host profile (ZIP + street) is greyed out as future work.', 'Stickies: sobriety, price, search (Louisa, Darian); profile ZIP + street (Darian, future)'],
      hostPreview: ['The host checks the event the way guests will see it.', 'Added step before "Create the event"'],
      hostDone: ['The event is created and shows up in Explore for nearby users.', 'Sticky: "Create the event" (Louisa)'],
    };

    let S;
    function freshState() {
      return {
        page: 'home', stack: [], events: structuredClone(BASE_EVENTS),
        q: '', dist: 10, sob: 'any', prices: new Set(), view: 'list',
        cur: null, qty: 1, pm: 'card',
        tickets: [{id: 'past1', title: 'Coffee & Crosswords', date: 'Sun 25 Oct', time: '11:00–13:00', spot: 0, past: true, fb: false}],
        fbFor: null, rating: 0, again: null, fbTags: new Set(),
        host: {sob: 'free', pt: 'free', cap: 20, spot: null, spotIdx: null}, draft: null,
      };
    }
    S = freshState();

    /* ---------- router ---------- */
    function go(id, push = true) {
      if (id === S.page) return;
      if (push) S.stack.push(S.page);
      S.page = id; render();
    }
    function back() {if (S.stack.length) {S.page = S.stack.pop(); render();} }
    function render() {
      $$('.page').forEach(p => p.classList.toggle('on', p.id === 'p-' + S.page));
      $$('#flow [data-go]').forEach(b => b.classList.toggle('on', b.dataset.go === S.page));
      $$('nav.main button').forEach(b => b.classList.toggle('on', b.dataset.nav.split(' ').includes(S.page)));
      const n = NOTES[S.page] || ['', ''];
      $('#noteTxt').textContent = n[0]; $('#noteBy').textContent = n[1];
      ({
        home: renderHome, discover: renderDiscover, event: renderEvent, info: renderInfo, confirm: renderConfirm, done: renderDone,
        tickets: renderTickets, feedback: renderFeedback, host: renderHost, hostPreview: renderPreview, hostDone: renderHostDone
      }[S.page] || (() => { }))();
      window.scrollTo(0, 0);
    }
    document.addEventListener('click', e => {
      const g = e.target.closest('[data-go]');
      if (g) {
        const id = g.dataset.go;
        if (['event', 'info', 'confirm', 'done'].includes(id) && !S.cur) S.cur = S.events[0];
        if (id === 'done' && !S.tickets.some(t => t.id === S.cur.id)) bookCurrent();
        if (id === 'feedback' && !S.fbFor) S.fbFor = S.tickets.find(t => t.past && !t.fb) || S.tickets[0];
        if (id === 'hostPreview' || id === 'hostDone') ensureHostDraft();
        if (id === 'hostDone' && !S.events.includes(S.draft)) publishDraft();
        if (g.closest('#flow, header')) {S.stack = id === 'home' ? [] : ['home']; S.page = id; render(); return;}
        go(id); return;
      }
      if (e.target.closest('[data-back]')) {back(); return;}
      const c = e.target.closest('[data-ev]');
      if (c) {S.cur = S.events.find(x => x.id === c.dataset.ev); S.qty = 1; go('event');}
    });

    /* ---------- helpers ---------- */
    const sp = e => SPOTS[e.spot];
    const priceText = e => e.pwyc ? 'Pay what you can' : e.price === 0 ? 'Free' : e.priceMax ? `€${e.price} – €${e.priceMax}` : `€${e.price}`;
    const fee = e => e.price ? Math.round(e.price * 0.05 * 100) / 100 : 0;
    const money = n => '€' + n.toFixed(2).replace('.', ',');
    function cardHTML(e, clickable = true) {
      const s = sp(e), T = clickable ? 'button' : 'div';
      return `<${T} class="card" ${clickable ? `data-ev="${e.id}"` : ''}>
    <div class="ph"><span>event photo</span></div>
    <div class="cb"><h4>${e.title}</h4>
      <p class="addr">${s ? `${s.name}<br>${s.street}, ${s.zip} München` : 'Pick a location<br>&nbsp;'}</p>
      <p class="price">${priceText(e)} <span class="check">✓</span><small>Total ticket price</small></p>
      <p class="meta">${SOB[e.sob].label} &nbsp;|&nbsp; ${e.date}${s ? ` &nbsp;|&nbsp; ${s.km.toFixed(1)} km` : ''}</p>
    </div></${T}>`;
    }
    function rowHTML(e, extra = '') {
      const s = sp(e);
      return `<button class="tk" data-ev="${e.id}"><div class="ph"><span>img</span></div><div class="ti"><b>${e.title}</b><small>${s.name}, ${s.km.toFixed(1)} km</small><small>${SOB[e.sob].label}, ${e.date}</small></div><div class="r">${priceText(e)}</div></button>`;
    }

    /* ---------- home ---------- */
    function renderHome() {$('#homeGrid').innerHTML = [...S.events].sort((a, b) => sp(a).km - sp(b).km).slice(0, 4).map(e => cardHTML(e)).join('');}

    /* ---------- discover ---------- */
    function filtered() {
      const q = S.q.trim().toLowerCase();
      return S.events.filter(e => {
        const s = sp(e);
        if (s.km > S.dist) return false;
        if (S.sob !== 'any' && e.sob !== S.sob) return false;
        if (S.prices.size && ![...S.prices].some(id => PRICE_BUCKETS.find(b => b.id === id).test(e))) return false;
        if (q && !`${e.title} ${s.name} ${s.area} ${s.street}`.toLowerCase().includes(q)) return false;
        return true;
      }).sort((a, b) => sp(a).km - sp(b).km);
    }
    function renderFilters() {
      $('#dv').textContent = S.dist + ' km'; $('#dr').value = S.dist;
      const so = [['any', 'Any', 'Show everything'], ...Object.entries(SOB).map(([k, v]) => [k, v.label, v.desc])];
      $('#fSob').innerHTML = so.map(([k, l, d]) => `<button class="opt ${k === S.sob ? 'on' : ''}" data-sob="${k}"><span class="dot"></span><span><b>${l}</b><small>${d}</small></span></button>`).join('');
      $('#fPrice').innerHTML = PRICE_BUCKETS.map(b => `<button class="opt sq ${S.prices.has(b.id) ? 'on' : ''}" data-pr="${b.id}"><span class="dot"></span><span><b>${b.label}</b><small>${S.events.filter(b.test).length} events</small></span></button>`).join('');
    }
    function renderDiscover() {
      renderFilters();
      const list = filtered();
      $('#count').textContent = `${list.length} event${list.length === 1 ? '' : 's'} within ${S.dist} km`;
      const act = [];
      if (S.q) act.push(['q', `“${S.q}”`]);
      if (S.dist !== 10) act.push(['dist', `Within ${S.dist} km`]);
      if (S.sob !== 'any') act.push(['sob', SOB[S.sob].label]);
      S.prices.forEach(id => act.push(['pr:' + id, PRICE_BUCKETS.find(b => b.id === id).label]));
      $('#activeF').innerHTML = act.map(([k, l]) => `<button class="chip on" data-rm="${k}">${l} ✕</button>`).join('');
      $('#activeF').style.display = act.length ? '' : 'none';
      const empty = `<div class="empty">No events match these filters.<br><button style="text-decoration:underline;margin-top:8px" onclick="clearFilters()">Clear filters</button></div>`;
      $('#listv').innerHTML = list.length ? `<div class="grid g3">${list.map(e => cardHTML(e)).join('')}</div>` + (list.length > 3 ? `<div class="more"><button class="btn" onclick="toast('That is every event for now')">View more</button></div>` : '') : empty;
    }
    function clearFilters() {S.q = ''; $('#q').value = ''; $('#qx').style.display = 'none'; S.dist = 10; S.sob = 'any'; S.prices = new Set(); renderDiscover();}
    $('#q').addEventListener('input', e => {S.q = e.target.value; $('#qx').style.display = S.q ? '' : 'none'; renderDiscover();});
    $('#qx').onclick = () => {$('#q').value = ''; S.q = ''; $('#qx').style.display = 'none'; renderDiscover();};
    $('#dr').addEventListener('input', e => {S.dist = +e.target.value; renderDiscover();});
    $('#clearF').onclick = clearFilters;
    $('#p-discover').addEventListener('click', e => {
      const so = e.target.closest('[data-sob]'); if (so) {S.sob = so.dataset.sob; renderDiscover();}
      const pr = e.target.closest('[data-pr]'); if (pr) {const k = pr.dataset.pr; S.prices.has(k) ? S.prices.delete(k) : S.prices.add(k); renderDiscover();}
      const rm = e.target.closest('[data-rm]');
      if (rm) {
        const k = rm.dataset.rm;
        if (k === 'q') {S.q = ''; $('#q').value = ''; $('#qx').style.display = 'none';}
        else if (k === 'dist') S.dist = 10; else if (k === 'sob') S.sob = 'any'; else S.prices.delete(k.slice(3));
        renderDiscover();
      }
    });

    /* ---------- event ---------- */
    function renderEvent() {
      const e = S.cur, s = sp(e), has = S.tickets.some(t => t.id === e.id && !t.past);
      const similar = S.events.filter(x => x.id !== e.id && x.sob === e.sob).slice(0, 4);
      $('#eventWrap').innerHTML = `
    <div class="crumbs"><button data-go="home">Home</button> / <button data-back>Explore</button> / ${e.title}</div>
    <div class="gallery"><div class="ph"><span>event photo</span></div><div class="ph"><span>photo</span></div><div class="ph"><span>photo</span></div></div>
    <div class="ev">
      <div>
        <span class="tag fill">${SOB[e.sob].label}</span>
        <h1 class="pt" style="margin-top:12px">${e.title}</h1>
        <p class="sub">Hosted by ${e.host}, ${s.area}</p>
        <div class="facts">
          <div class="fact"><small>When</small><b>${e.date}<br>${e.time}</b></div>
          <div class="fact"><small>Distance</small><b>${s.km.toFixed(1)} km<br>from you</b></div>
          <div class="fact"><small>Price</small><b>${priceText(e)}</b></div>
          <div class="fact"><small>Spots left</small><b>${e.spots} of ${e.cap}</b></div>
        </div>
        <p class="eyebrow">About</p>
        <p style="font-size:17px;line-height:1.5;margin-bottom:14px">${e.desc}</p>
        <div class="lines"><i style="width:100%"></i><i style="width:94%"></i><i style="width:88%"></i><i style="width:60%"></i></div>
        <p class="eyebrow">Location</p>
        <div class="box">
          <div><b style="font-weight:500;font-size:17px">${s.name}</b><p class="hint">${s.street}<br>${s.zip} München</p><p class="hint">${s.km.toFixed(1)} km from you</p><button class="btn ghost sm" style="margin-top:14px">Get directions</button></div>
        </div>
        <p class="eyebrow">Who's going</p>
        <div class="faces"><i></i><i></i><i></i><i></i><i></i><span class="hint" style="margin:0 0 0 22px">${e.cap - e.spots} going, including some first-timers</span></div>
      </div>
      <aside class="aside"><div class="box">
        <div class="bigprice">${priceText(e)}</div><p class="hint" style="margin-top:2px">${e.price ? 'per person, fees shown at checkout' : 'no payment needed'}</p>
        <div class="kv" style="margin-top:16px"><span>Date</span><span>${e.date}</span></div>
        <div class="kv"><span>Time</span><span>${e.time}</span></div>
        <div class="kv"><span>Sobriety</span><span>${SOB[e.sob].label}</span></div>
        <div class="kv" style="align-items:center"><span>Tickets</span><div class="stepper"><button data-q="-">−</button><span id="qtyV">${S.qty}</span><button data-q="+">+</button></div></div>
        <button class="btn block" id="joinBtn" style="margin-top:16px" ${has ? 'disabled' : ''}>${has ? "You're going ✓" : 'Join event'}</button>
        <p class="hint" style="text-align:center">${e.spots <= 5 ? `Only ${e.spots} spots left` : `${e.spots} spots left`}. Free cancellation up to 24 h before.</p>
      </div><button class="hint" style="display:block;margin:12px auto 0;text-decoration:underline">♡ Save for later</button></aside>
    </div>
    ${similar.length ? `<h2 class="sec-h" style="font-size:30px;text-align:left;margin:64px 0 22px">More ${SOB[e.sob].label.toLowerCase()} events</h2><div class="grid">${similar.map(x => cardHTML(x)).join('')}</div>` : ''}`;
      $$('#eventWrap [data-q]').forEach(b => b.onclick = () => {S.qty = Math.max(1, Math.min(Math.min(6, e.spots), S.qty + (b.dataset.q === '+' ? 1 : -1))); $('#qtyV').textContent = S.qty;});
      $('#joinBtn').onclick = () => go('info');
    }

    /* ---------- checkout ---------- */
    function summaryHTML() {
      const e = S.cur, s = sp(e), sub = e.price * S.qty, f = fee(e) * S.qty;
      return `<div class="tk" style="border:none;padding:0 0 14px;border-bottom:1px solid var(--line);border-radius:0"><div class="ph"><span>img</span></div><div class="ti"><b>${e.title}</b><small>${e.date}, ${e.time}</small><small>${s.name}</small></div></div>
    <div style="margin-top:12px"><div class="kv"><span>${S.qty} × ${e.price ? money(e.price) : 'free ticket'}</span><span>${money(sub)}</span></div>
    <div class="kv"><span>Service fee</span><span>${money(f)}</span></div>
    <div class="kv total"><span>Total</span><span>${money(sub + f)}</span></div></div>`;
    }
    function renderInfo() {
      const free = S.cur.price === 0;
      $('#paySec').style.display = free ? 'none' : '';
      $('#freeNote').style.display = free ? '' : 'none';
      $$('.err').forEach(x => x.classList.remove('show')); $$('.in').forEach(x => x.classList.remove('bad'));
      $('#infoSum').innerHTML = `<div class="box">${summaryHTML()}</div>`;
      paintPM();
    }
    function paintPM() {
      $$('#payMethod .chip').forEach(c => c.classList.toggle('on', c.dataset.pm === S.pm));
      $('#cardFields').style.display = S.pm === 'card' ? '' : 'none';
      $('#altPay').style.display = S.pm === 'card' ? 'none' : '';
      $('#altName').textContent = S.pm === 'paypal' ? 'PayPal' : 'Apple Pay';
    }
    $$('#payMethod .chip').forEach(c => c.onclick = () => {S.pm = c.dataset.pm; paintPM();});
    $('#cardno').addEventListener('input', e => {e.target.value = e.target.value.replace(/\D/g, '').slice(0, 16).replace(/(.{4})/g, '$1 ').trim();});
    $('#exp').addEventListener('input', e => {const v = e.target.value.replace(/\D/g, '').slice(0, 4); e.target.value = v.length > 2 ? v.slice(0, 2) + ' / ' + v.slice(2) : v;});
    $('#cvc').addEventListener('input', e => {e.target.value = e.target.value.replace(/\D/g, '').slice(0, 4);});
    $('#autofill').onclick = () => {$('#email').value = 'louisa@example.com'; $('#cardno').value = '4242 4242 4242 4242'; $('#exp').value = '12 / 28'; $('#cvc').value = '123'; $('#cname').value = 'Louisa M.';};
    $('#toConfirm').onclick = () => {
      const em = $('#email'), ph = $('#tel');
      let ok = /\S+@\S+\.\S+/.test(em.value) || ph.value.replace(/\D/g, '').length >= 6;
      $('#errContact').classList.toggle('show', !ok); em.classList.toggle('bad', !ok); ph.classList.toggle('bad', !ok);
      if (S.cur.price > 0 && S.pm === 'card') {
        const f = ['#cardno', '#exp', '#cvc', '#cname'].map(s => $(s)), bad = f.filter(x => !x.value.trim());
        f.forEach(x => x.classList.toggle('bad', bad.includes(x)));
        $('#errCard').classList.toggle('show', bad.length > 0);
        if (bad.length) ok = false;
      }
      if (ok) go('confirm');
    };
    function payLabel() {
      if (S.cur.price === 0) return 'None (free event)';
      if (S.pm === 'card') return 'Card •••• ' + ($('#cardno').value.replace(/\s/g, '').slice(-4) || '4242');
      return S.pm === 'paypal' ? 'PayPal' : 'Apple Pay';
    }
    const contactLabel = () => [$('#email').value, $('#tel').value].filter(Boolean).join(', ') || 'louisa@example.com';
    function renderConfirm() {
      const e = S.cur, s = sp(e);
      $('#confirmMain').innerHTML = `
    <p class="eyebrow">Event</p>
    <div class="box"><div class="kv"><span>Event</span><span>${e.title}</span></div><div class="kv"><span>When</span><span>${e.date}, ${e.time}</span></div><div class="kv"><span>Where</span><span>${s.name}, ${s.area}</span></div><div class="kv"><span>Sobriety</span><span>${SOB[e.sob].label}</span></div></div>
    <p class="eyebrow">Your details</p>
    <div class="box"><div class="kv"><span>Contact</span><span>${contactLabel()}</span></div><div class="kv"><span>Payment</span><span>${payLabel()}</span></div><button class="hint" data-back style="text-decoration:underline;margin-top:8px">Edit</button></div>
    <p class="hint" style="margin-top:16px">By confirming you agree to the house rules of the host. Free cancellation up to 24 h before.</p>`;
      const t = e.price * S.qty + fee(e) * S.qty;
      $('#confirmSum').innerHTML = summaryHTML() + `<button class="btn block" id="payBtn" style="margin-top:18px">${e.price ? `Confirm and pay ${money(t)}` : 'Confirm spot'}</button>`;
      $('#payBtn').onclick = () => {
        const b = $('#payBtn'); b.disabled = true; b.textContent = 'Processing…';
        setTimeout(() => {bookCurrent(); S.stack = ['home', 'discover']; S.page = 'done'; render();}, 900);
      };
    }
    function bookCurrent() {
      const e = S.cur;
      e.spots = Math.max(0, e.spots - S.qty);
      S.tickets = S.tickets.filter(t => t.id !== e.id);
      S.tickets.unshift({id: e.id, title: e.title, date: e.date, time: e.time, spot: e.spot, qty: S.qty, total: (e.price + fee(e)) * S.qty, paid: e.price > 0, past: false, fb: false});
    }
    function renderDone() {
      const e = S.cur, s = sp(e), t = S.tickets.find(x => x.id === e.id);
      $('#doneWrap').innerHTML = `
    <div style="display:flex;gap:22px;align-items:center;padding:44px 0 10px"><div class="ok">✓</div><div><h1 class="pt" style="margin:0">You're going to ${e.title}</h1><p class="sub">Booking CX-${e.id.toUpperCase()}4821, ${t.qty} ticket${t.qty > 1 ? 's' : ''}, confirmation sent to ${contactLabel()}</p></div></div>
    <div class="steps"><span class="done"><i>✓</i>Details</span><hr><span class="done"><i>✓</i>Confirm and pay</span><hr><span class="on"><i>3</i>Done</span></div>
    <div class="co">
      <div class="main">
        <p class="eyebrow">Location details</p>
        <div class="box" style="padding:0;overflow:hidden">
          <div style="padding:20px;display:grid;grid-template-columns:1fr 1fr;gap:20px">
            <div><b style="font-weight:500;font-size:17px">${s.name}</b><p class="hint">${s.street}, ${s.zip} München<br>${s.km.toFixed(1)} km from you</p><button class="btn ghost sm" style="margin-top:12px">Get directions</button></div>
            <div><div class="kv"><span>When</span><span>${e.date}</span></div><div class="kv"><span>Time</span><span>${e.time}</span></div><div class="kv"><span>Host</span><span>${e.host}</span></div></div>
          </div></div>
        <p class="eyebrow">Notifications</p>
        <div class="box">✉ We emailed your ticket. You get a reminder 24 h before, and a feedback request after the event.</div>
      </div>
      <aside class="aside"><div class="box">
        <p class="eyebrow" style="margin-top:0">Payment status</p>
        <div style="display:flex;justify-content:space-between;align-items:center"><div><div class="bigprice">${t.paid ? money(t.total) : 'Free'}</div><p class="hint">${payLabel()}</p></div><span class="status-pill">● ${t.paid ? 'Paid' : 'No payment needed'}</span></div>
        <button class="btn block" data-go="tickets" style="margin-top:20px">View my tickets</button>
        <button class="btn ghost block" style="margin-top:10px">Add to calendar</button>
      </div></aside>
    </div>`;
      $('#notifTxt').textContent = `Your spot at ${e.title} (${e.date}) is confirmed. Click for details.`;
      setTimeout(() => $('#notif').classList.add('on'), 500);
      setTimeout(() => $('#notif').classList.remove('on'), 4500);
    }

    /* ---------- tickets / feedback ---------- */
    function renderTickets() {
      const up = S.tickets.filter(t => !t.past), past = S.tickets.filter(t => t.past);
      const row = t => {
        const s = SPOTS[t.spot]; return `<div class="tk" style="margin-bottom:10px"><div class="ph"><span>img</span></div><div class="ti"><b>${t.title}</b><small>${t.date}, ${t.time}</small><small>${s.name}, ${s.area}</small></div>
    ${t.past ? (t.fb ? `<span class="hint" style="margin:0 10px 0 0">Feedback sent ✓</span>` : `<button class="btn sm" data-fb="${t.id}">Leave feedback</button>`)
            : `<button class="btn ghost sm" data-end="${t.id}">Simulate: event ended</button>`}</div>`;
      };
      $('#ticketsBody').innerHTML = `<p class="eyebrow" style="margin-top:28px">Upcoming</p>${up.length ? up.map(row).join('') : `<div class="empty" style="padding:30px">No upcoming events. <button data-go="discover" style="text-decoration:underline">Find one</button></div>`}
    <p class="eyebrow">Past</p>${past.map(row).join('') || '<p class="hint">Nothing yet.</p>'}`;
      $$('[data-end]').forEach(b => b.onclick = () => {S.tickets.find(x => x.id === b.dataset.end).past = true; toast('Event ended. We emailed you a feedback request'); renderTickets();});
      $$('[data-fb]').forEach(b => b.onclick = () => {S.fbFor = S.tickets.find(x => x.id === b.dataset.fb); go('feedback');});
    }
    const FB_TAGS = ['Met new people', 'Good vibe', 'Host was welcoming', 'Great drinks', 'Felt safe', 'Too crowded', 'Hard to find'];
    function renderFeedback() {
      const t = S.fbFor, s = SPOTS[t.spot];
      $('#fbTitle').textContent = t.title; $('#fbSub').textContent = `${t.date}, ${s.name}`;
      S.rating = 0; S.again = null; S.fbTags = new Set(); $('#fbText').value = ''; paintFB();
    }
    function paintFB() {
      $('#stars').innerHTML = [1, 2, 3, 4, 5].map(n => `<button class="${n <= S.rating ? 'on' : ''}" data-r="${n}">${n <= S.rating ? '★' : '☆'}</button>`).join('');
      $$('#stars button').forEach(b => b.onclick = () => {S.rating = +b.dataset.r; paintFB();});
      $('#fbTags').innerHTML = FB_TAGS.map(t => `<button class="chip ${S.fbTags.has(t) ? 'on' : ''}">${t}</button>`).join('');
      $$('#fbTags .chip').forEach(c => c.onclick = () => {S.fbTags.has(c.textContent) ? S.fbTags.delete(c.textContent) : S.fbTags.add(c.textContent); paintFB();});
      $$('#again .chip').forEach(c => c.classList.toggle('on', c.dataset.v === S.again));
      $('#fbSend').disabled = !S.rating;
    }
    $$('#again .chip').forEach(c => c.onclick = () => {S.again = c.dataset.v; paintFB();});
    $('#fbSend').onclick = () => {S.fbFor.fb = true; toast('Thanks! The host got your feedback'); S.stack = ['home']; S.page = 'tickets'; render();};

    /* ---------- host ---------- */
    function renderHost() {
      const h = S.host;
      if (!$('#hDate').value) {const d = new Date(); d.setDate(d.getDate() + 7); $('#hDate').value = d.toISOString().slice(0, 10);}
      $('#hSob').innerHTML = Object.entries(SOB).map(([k, v]) => `<button class="opt card-opt ${k === h.sob ? 'on' : ''}" data-k="${k}"><span class="dot"></span><span><b>${v.label}</b><small>${v.desc}</small></span></button>`).join('');
      $$('#hSob .opt').forEach(o => o.onclick = () => {h.sob = o.dataset.k; renderHost();});
      $$('#hPriceType .chip').forEach(c => c.classList.toggle('on', c.dataset.pt === h.pt));
      $('#hPriceIn').classList.toggle('on', h.pt === 'fixed');
      $('#hCap').textContent = h.cap;
      $('#hPicked').classList.toggle('on', !!h.spot);
      if (h.spot) $('#hPickedTxt').textContent = `${h.spot.name}, ${h.spot.street}, ${h.spot.zip}`;
      $('#errHost').classList.remove('show');
      live();
    }
    function live() {$('#hLive').innerHTML = cardHTML(hostDraft(), false);}
    ['#hName', '#hDate', '#hTime', '#hPrice', '#hDesc'].forEach(s => $(s).addEventListener('input', live));
    $$('#hPriceType .chip').forEach(c => c.onclick = () => {S.host.pt = c.dataset.pt; renderHost();});
    $$('[data-cap]').forEach(b => b.onclick = () => {S.host.cap = Math.max(2, Math.min(200, S.host.cap + (b.dataset.cap === '+' ? 5 : -5))); $('#hCap').textContent = S.host.cap;});
    $('#hLoc').addEventListener('input', e => {
      const q = e.target.value.trim().toLowerCase();
      const hits = q ? SPOTS.filter(s => `${s.name} ${s.area} ${s.street}`.toLowerCase().includes(q)) : SPOTS.slice(0, 5);
      $('#hSuggest').innerHTML = hits.map(s => `<button data-spot="${SPOTS.indexOf(s)}">${s.name}<small>${s.street}, ${s.area}</small></button>`).join('') || `<button disabled>No spots found<small>Try an area like “Schwabing”</small></button>`;
      $('#hSuggest').classList.add('on');
    });
    $('#hLoc').addEventListener('focus', e => e.target.dispatchEvent(new Event('input')));
    $('#hSuggest').addEventListener('click', e => {
      const b = e.target.closest('[data-spot]'); if (!b) return;
      S.host.spotIdx = +b.dataset.spot; S.host.spot = SPOTS[S.host.spotIdx];
      $('#hLoc').value = S.host.spot.name; $('#hSuggest').classList.remove('on'); renderHost();
    });
    document.addEventListener('click', e => {if (!e.target.closest('#hLoc,#hSuggest')) $('#hSuggest').classList.remove('on');});
    function hostDraft() {
      const h = S.host, d = new Date($('#hDate').value + 'T' + ($('#hTime').value || '19:00'));
      const price = h.pt === 'fixed' ? Math.max(1, Math.round(parseFloat($('#hPrice').value.replace(',', '.')) || 10)) : 0;
      const ok = !isNaN(d);
      const date = ok ? d.toLocaleDateString('en-GB', {weekday: 'short', day: 'numeric', month: 'short'}).replace(',', '') : 'Date TBD';
      const end = ok ? String((d.getHours() + 3) % 24).padStart(2, '0') + ':' + String(d.getMinutes()).padStart(2, '0') : '';
      return {
        id: 'h' + Date.now(), title: $('#hName').value.trim() || 'Untitled event', spot: h.spotIdx, date, time: `${$('#hTime').value || '19:00'}–${end}`,
        price, pwyc: h.pt === 'pwyc', sob: h.sob, spots: h.cap, cap: h.cap, host: 'You', desc: $('#hDesc').value.trim() || 'The host has not added a description yet.'
      };
    }
    function ensureHostDraft() {
      if (!$('#hName').value) $('#hName').value = 'Sunday Coffee Rave';
      if (!$('#hDate').value) {const d = new Date(); d.setDate(d.getDate() + 7); $('#hDate').value = d.toISOString().slice(0, 10);}
      if (!S.host.spot) {S.host.spotIdx = 0; S.host.spot = SPOTS[0]; $('#hLoc').value = SPOTS[0].name;}
      if (!S.draft || !S.events.includes(S.draft)) S.draft = hostDraft();
    }
    $('#toPreview').onclick = () => {
      const ok = $('#hName').value.trim() && $('#hDate').value && S.host.spot;
      $('#errHost').classList.toggle('show', !ok);
      if (!ok) return;
      S.draft = hostDraft(); go('hostPreview');
    };
    function renderPreview() {
      const e = S.draft, s = sp(e);
      $('#previewMain').innerHTML = `<p class="eyebrow">How guests see it in Explore</p><div style="max-width:320px">${cardHTML(e, false)}</div>
    <p class="eyebrow">Event page</p><div class="box"><div class="kv"><span>Name</span><span>${e.title}</span></div><div class="kv"><span>When</span><span>${e.date}, ${e.time}</span></div><div class="kv"><span>Where</span><span>${s.name}, ${s.street}</span></div><div class="kv"><span>About</span><span style="text-align:right;max-width:60%">${e.desc}</span></div></div>`;
      $('#previewSum').innerHTML = `<div class="kv"><span>Sobriety</span><span>${SOB[e.sob].label}</span></div><div class="kv"><span>Price charged</span><span>${priceText(e)}</span></div><div class="kv"><span>Capacity</span><span>${e.cap} guests</span></div><div class="kv"><span>Visible to</span><span>People within 10 km</span></div>`;
    }
    function publishDraft() {S.events = S.events.filter(x => x.id !== S.draft.id); S.events.unshift(S.draft);}
    $('#createBtn').onclick = () => {publishDraft(); S.stack = ['home']; S.page = 'hostDone'; render();};
    function renderHostDone() {$('#hostDoneCard').innerHTML = cardHTML(S.draft);}
    $('#seeInDiscover').onclick = () => {S.q = ''; $('#q').value = ''; S.dist = 10; S.sob = 'any'; S.prices = new Set(); S.stack = ['home']; S.page = 'discover'; render();};
    $('#hostAnother').onclick = () => {
      ['#hName', '#hLoc', '#hPrice', '#hDesc'].forEach(s => $(s).value = '');
      S.host = {sob: 'free', pt: 'free', cap: 20, spot: null, spotIdx: null}; S.draft = null;
      S.stack = ['home']; S.page = 'host'; render();
    };

    /* ---------- misc ---------- */
    let tt;
    function toast(m) {const t = $('#toast'); t.textContent = m; t.classList.add('on'); clearTimeout(tt); tt = setTimeout(() => t.classList.remove('on'), 2400);}
    $('#flowBtn').onclick = () => $('#flow').classList.toggle('on');
    $('#notif').onclick = () => $('#notif').classList.remove('on');
    function resetAll() {S = freshState(); $$('input, textarea').forEach(i => {if (i.type !== 'time' && i.type !== 'range') i.value = '';}); $('#qx').style.display = 'none'; render();}
    render();
