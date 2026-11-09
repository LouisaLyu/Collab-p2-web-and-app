if (new URLSearchParams(location.search).has('notes')) document.body.classList.add('notes');
const $ = (s, el = document) => el.querySelector(s);
const $$ = (s, el = document) => [...el.querySelectorAll(s)];

const SOB = {
  free: { label: 'Alcohol-free', desc: 'No alcohol served or allowed' },
  low:  { label: 'Low-alcohol', desc: 'Mostly alcohol-free, a few low-ABV options' },
  mixed:{ label: 'Mixed', desc: 'Drinks available, alcohol-free options on the menu' },
};

const SPOTS = [
  { name: 'Café Hailey', street: 'Türkenstraße 52', zip: '80799', area: 'Maxvorstadt', km: 1.2, x: 46, y: 40 },
  { name: 'Glockenbach Kitchen', street: 'Fraunhoferstraße 18', zip: '80469', area: 'Glockenbachviertel', km: 2.4, x: 40, y: 62 },
  { name: 'Englischer Garten, Chinesischer Turm', street: 'Englischer Garten 3', zip: '80538', area: 'Schwabing', km: 3.1, x: 62, y: 30 },
  { name: 'Spielwiese Board Café', street: 'Leopoldstraße 77', zip: '80802', area: 'Schwabing', km: 4.0, x: 58, y: 20 },
  { name: 'Werksviertel Hall 4', street: 'Atelierstraße 10', zip: '81671', area: 'Haidhausen / Berg am Laim', km: 5.6, x: 74, y: 62 },
  { name: 'Bahnwärter Thiel', street: 'Tumblingerstraße 29', zip: '80337', area: 'Sendling', km: 6.8, x: 30, y: 72 },
  { name: 'Olympiapark Theatron', street: 'Spiridon-Louis-Ring 21', zip: '80809', area: 'Milbertshofen', km: 8.9, x: 30, y: 16 },
  { name: 'Feringasee Beach', street: 'Feringastraße', zip: '85774', area: 'Unterföhring', km: 12.5, x: 90, y: 14 },
  { name: 'Westpark Pavilion', street: 'Westendstraße 305', zip: '80686', area: 'Westpark', km: 6.1, x: 14, y: 58 },
];

const BASE_EVENTS = [
  { id: 'e1', title: 'Sober Morning Rave', spot: 0, date: 'Sat 31 Oct', time: '10:00–13:00', price: 8, priceMax: 12, sob: 'free', spots: 14, host: 'Hailey Hostess', desc: 'Daytime dance party with coffee instead of drinks.' },
  { id: 'e2', title: 'Dinner for Strangers', spot: 1, date: 'Wed 4 Nov', time: '19:30–22:00', price: 18, sob: 'free', spots: 3, host: 'Glockenbach Kitchen', desc: 'Eight seats, one long table, a set menu.' },
  { id: 'e3', title: 'Run Club + Coffee', spot: 2, date: 'Sun 1 Nov', time: '09:00–10:30', price: 0, sob: 'free', spots: 40, host: 'Isar Runners', desc: '5 km easy loop, ends at the café.' },
  { id: 'e4', title: 'Board Game Night', spot: 3, date: 'Thu 29 Oct', time: '18:00–23:00', price: 5, sob: 'low', spots: 22, host: 'Spielwiese', desc: 'Hundreds of games, staff who explain the rules.' },
  { id: 'e5', title: 'Zero-Proof Mixology Class', spot: 4, date: 'Fri 6 Nov', time: '19:00–21:00', price: 24, priceMax: 30, sob: 'free', spots: 9, host: 'Werksviertel Kollektiv', desc: 'Learn five alcohol-free cocktails to make at home.' },
  { id: 'e6', title: 'Pay-What-You-Can Open Mic', spot: 5, date: 'Tue 3 Nov', time: '20:00–23:00', price: 0, pwyc: true, sob: 'mixed', spots: 60, host: 'Bahnwärter Thiel', desc: 'Sign up at the door. Alcohol-free bar runs all night.' },
  { id: 'e7', title: 'Sunset Lake Swim Social', spot: 7, date: 'Sat 7 Nov', time: '16:00–18:30', price: 0, sob: 'free', spots: 25, host: 'Cold Water Club', desc: 'Short dip, hot tea, sauna tent.' },
  { id: 'e8', title: 'Silent Disco in the Park', spot: 6, date: 'Fri 30 Oct', time: '20:00–23:00', price: 14, sob: 'low', spots: 80, host: 'Theatron Nights', desc: 'Three DJ channels, headphones included.' },
];

const PRICE_BUCKETS = [
  { id: 'free', label: 'Free / PWYC', test: e => e.price === 0 },
  { id: 'u10', label: 'Under €10', test: e => e.price > 0 && e.price < 10 },
  { id: '10to20', label: '€10–20', test: e => e.price >= 10 && e.price <= 20 },
  { id: 'o20', label: 'Over €20', test: e => e.price > 20 },
];

const NOTES = {
  start: ['Entry point. The user picks one of the two paths: join events, or host them.', 'Sticky: "Two options: User or Hosts" (Louisa)'],
  discover: ['Lists the places the user can find nearby (10 km default). Search for areas or spots, then filter by distance, sobriety, and price.', 'Stickies: list places ~10 km (Yamin), distance filter + search (Darian), sobriety + price filters (Louisa)'],
  event: ['The user selects the event they want to join and sees time, place, sobriety level, price, and spots left.', 'Sticky: "Select event they want to join" (Louisa)'],
  info: ['The user fills in email and/or phone, plus payment info. Free events skip payment.', 'Sticky: "Fill in their information" (Louisa)'],
  confirm: ['The user reviews the order and confirms or pays.', 'Sticky: "Confirm / Pay" (Louisa)'],
  done: ['The user reviews location details and payment status. An email notification arrives.', 'Stickies: "Review details of location and status of payment" (Darian), "Notifications via email" (Louisa)'],
  tickets: ['Upcoming and past tickets. Past events prompt for feedback. Tap "Simulate: event ended" to test the loop.', 'Sticky: "Feedback after event" (Rajat)'],
  feedback: ['Short post-event feedback for the host.', 'Sticky: "Feedback after event" (Rajat)'],
  host: ['The host sets the sobriety level and price charged, and searches for the spot. The host profile with ZIP and street is greyed out as future work.', 'Stickies: sobriety, price, search (Louisa, Darian); profile ZIP + street (Darian, future)'],
  hostPreview: ['The host checks the event card the way guests will see it.', 'Added step between setup and "Create the event"'],
  hostDone: ['The event is created and now shows up in Discover for nearby users.', 'Sticky: "Create the event" (Louisa)'],
};

let S;
function freshState() {
  return {
    screen: 'start', stack: [],
    events: structuredClone(BASE_EVENTS),
    q: '', dist: 10, sob: 'any', prices: new Set(), view: 'list',
    cur: null, qty: 1, pm: 'card',
    tickets: [{ id: 'past1', title: 'Coffee & Crosswords', date: 'Sun 25 Oct', spot: 0, past: true, fb: false }],
    fbFor: null, rating: 0, again: null, fbTags: new Set(),
    host: { sob: 'free', pt: 'free', cap: 20, spot: null },
  };
}
S = freshState();

/* ---------- router ---------- */
function go(id, push = true) {
  if (id === S.screen) return;
  if (push) S.stack.push(S.screen);
  S.screen = id;
  render();
}
function back() { if (S.stack.length) { S.screen = S.stack.pop(); render(); } }

function render() {
  $$('.screen').forEach(s => s.classList.toggle('on', s.id === 's-' + S.screen));
  $$('.side [data-go]').forEach(b => b.classList.toggle('on', b.dataset.go === S.screen));
  const n = NOTES[S.screen] || ['', ''];
  $('#note p').textContent = n[0]; $('#note .by').textContent = n[1];
  closeSheet();
  ({ discover: renderDiscover, event: renderEvent, info: renderInfo, confirm: renderConfirm, done: renderDone, tickets: renderTickets, feedback: renderFeedback, host: renderHost, hostPreview: renderPreview }[S.screen] || (() => {}))();
  const b = $('#s-' + S.screen + ' .body'); if (b) b.scrollTop = 0;
}

document.addEventListener('click', e => {
  const g = e.target.closest('[data-go]');
  if (g) {
    const id = g.dataset.go;
    // guard jumps that need an event selected
    if (['event', 'info', 'confirm', 'done'].includes(id) && !S.cur) S.cur = S.events[0];
    if (id === 'feedback' && !S.fbFor) S.fbFor = S.tickets.find(t => t.past) || S.tickets[0];
    if (id === 'hostPreview' || id === 'hostDone') ensureHostDraft();
    if (g.closest('.side')) { S.stack = id === 'start' ? [] : ['start']; S.screen = id; render(); return; }
    go(id); return;
  }
  if (e.target.closest('[data-back]')) back();
});

/* ---------- discover ---------- */
const priceText = e => e.pwyc ? 'Pay what you can' : e.price === 0 ? 'Free' : e.priceMax ? `€${e.price} – €${e.priceMax}` : `€${e.price}`;
function sp(e) { return e.customSpot || SPOTS[e.spot]; }

function filtered() {
  const q = S.q.trim().toLowerCase();
  return S.events.filter(e => {
    const s = sp(e);
    if (s.km > S.dist) return false;
    if (S.sob !== 'any' && e.sob !== S.sob) return false;
    if (S.prices.size && ![...S.prices].some(id => PRICE_BUCKETS.find(b => b.id === id).test(e))) return false;
    if (q && !(e.title + ' ' + s.name + ' ' + s.area + ' ' + s.street).toLowerCase().includes(q)) return false;
    return true;
  }).sort((a, b) => sp(a).km - sp(b).km);
}

function cardHTML(e, clickable = true) {
  const s = sp(e);
  return `<${clickable ? 'button' : 'div'} class="card" ${clickable ? `data-ev="${e.id}"` : ''}>
    <div class="ph"><span>event photo</span></div>
    <div class="cb">
      <h4>${e.title}</h4>
      <p class="addr">${s.name}<br>${s.street}, ${s.zip} München</p>
      <p class="price">${priceText(e)} <span class="check">✓</span><small>Total ticket price</small></p>
      <p class="meta">${SOB[e.sob].label} &nbsp;|&nbsp; ${e.date} &nbsp;|&nbsp; ${s.km.toFixed(1)} km</p>
    </div></${clickable ? 'button' : 'div'}>`;
}

function renderDiscover() {
  const list = filtered();
  $('#fDist').textContent = `Within ${S.dist} km`;
  $('#fSob').textContent = S.sob === 'any' ? 'Sobriety: Any' : SOB[S.sob].label;
  $('#fPrice').textContent = S.prices.size ? (S.prices.size === 1 ? PRICE_BUCKETS.find(b => S.prices.has(b.id)).label : `Price: ${S.prices.size} ranges`) : 'Price: Any';
  $('[data-sheet="dist"]').classList.toggle('on', S.dist !== 10);
  $('[data-sheet="sob"]').classList.toggle('on', S.sob !== 'any');
  $('[data-sheet="price"]').classList.toggle('on', S.prices.size > 0);
  $('#count').textContent = `${list.length} event${list.length === 1 ? '' : 's'} near you`;
  $('#list').style.display = S.view === 'list' ? '' : 'none';
  $('#list').innerHTML = list.length ? list.map(e => cardHTML(e)).join('') +
      (list.length > 2 ? `<button class="btn ghost" style="width:auto;margin:6px auto 10px;padding:11px 26px" onclick="toast('No more events yet')">View more</button>` : '')
    : `<div class="empty">No events match.<br><button style="text-decoration:underline;margin-top:8px" onclick="clearFilters()">Clear filters</button></div>`;
}
function clearFilters() { S.q = ''; $('#q').value = ''; $('#qx').style.display = 'none'; S.dist = 10; S.sob = 'any'; S.prices.clear(); renderDiscover(); }

$('#q').addEventListener('input', e => { S.q = e.target.value; $('#qx').style.display = S.q ? '' : 'none'; renderDiscover(); });
$('#qx').onclick = () => { S.q = ''; $('#q').value = ''; $('#qx').style.display = 'none'; renderDiscover(); };
document.addEventListener('click', e => {
  const c = e.target.closest('[data-ev]');
  if (c) { S.cur = S.events.find(x => x.id === c.dataset.ev); S.qty = 1; go('event'); }
});

/* ---------- sheets ---------- */
let draft;
function openSheet(kind) {
  const sh = $('#sheet');
  if (kind === 'dist') {
    draft = S.dist;
    sh.innerHTML = `<div class="grab"></div><h4>Distance</h4><p class="d">How far from where you are right now.</p>
      <div class="big" id="dv">${draft} km</div>
      <input type="range" class="range" min="1" max="25" value="${draft}" id="dr">
      <div class="rangeval"><span>1 km</span><span>10 km (default)</span><span>25 km</span></div>
      <div class="acts"><button class="btn ghost" id="sReset">Reset</button><button class="btn" id="sApply">Show events</button></div>`;
    $('#dr').oninput = e => { draft = +e.target.value; $('#dv').textContent = draft + ' km'; };
    $('#sReset').onclick = () => { draft = 10; $('#dr').value = 10; $('#dv').textContent = '10 km'; };
    $('#sApply').onclick = () => { S.dist = draft; closeSheet(); renderDiscover(); };
  }
  if (kind === 'sob') {
    draft = S.sob;
    const opts = [['any', 'Any', 'Show everything'], ...Object.entries(SOB).map(([k, v]) => [k, v.label, v.desc])];
    sh.innerHTML = `<div class="grab"></div><h4>Level of sobriety</h4><p class="d">Pick the kind of night you're after.</p>
      <div id="so">${opts.map(([k, l, d]) => `<button class="opt ${k === draft ? 'on' : ''}" data-k="${k}"><span class="dot"></span><span><b>${l}</b><small>${d}</small></span></button>`).join('')}</div>
      <div class="acts"><button class="btn ghost" id="sReset">Reset</button><button class="btn" id="sApply">Show events</button></div>`;
    const paint = () => $$('#so .opt').forEach(o => o.classList.toggle('on', o.dataset.k === draft));
    $$('#so .opt').forEach(o => o.onclick = () => { draft = o.dataset.k; paint(); });
    $('#sReset').onclick = () => { draft = 'any'; paint(); };
    $('#sApply').onclick = () => { S.sob = draft; closeSheet(); renderDiscover(); };
  }
  if (kind === 'price') {
    draft = new Set(S.prices);
    sh.innerHTML = `<div class="grab"></div><h4>Price range</h4><p class="d">Per person. Pick one or more.</p>
      <div id="po">${PRICE_BUCKETS.map(b => `<button class="opt sq ${draft.has(b.id) ? 'on' : ''}" data-k="${b.id}"><span class="dot"></span><span><b>${b.label}</b><small>${S.events.filter(b.test).length} events</small></span></button>`).join('')}</div>
      <div class="acts"><button class="btn ghost" id="sReset">Reset</button><button class="btn" id="sApply">Show events</button></div>`;
    const paint = () => $$('#po .opt').forEach(o => o.classList.toggle('on', draft.has(o.dataset.k)));
    $$('#po .opt').forEach(o => o.onclick = () => { draft.has(o.dataset.k) ? draft.delete(o.dataset.k) : draft.add(o.dataset.k); paint(); });
    $('#sReset').onclick = () => { draft.clear(); paint(); };
    $('#sApply').onclick = () => { S.prices = draft; closeSheet(); renderDiscover(); };
  }
  $('#scrim').classList.add('on'); sh.classList.add('on');
}
function closeSheet() { $('#scrim').classList.remove('on'); $('#sheet').classList.remove('on'); }
$$('[data-sheet]').forEach(b => b.onclick = () => openSheet(b.dataset.sheet));
$('#scrim').onclick = closeSheet;

/* ---------- event ---------- */
function renderEvent() {
  const e = S.cur, s = sp(e);
  $('#eventBody').innerHTML = `
    <div class="ph hero"><span>event photo</span></div>
    <span class="tag fill">${SOB[e.sob].label}</span>
    <h2 class="d-title" style="margin-top:10px">${e.title}</h2>
    <p class="d-host">Hosted by ${e.host}</p>
    <div class="facts">
      <div class="fact"><small>When</small><b>${e.date}<br>${e.time}</b></div>
      <div class="fact"><small>Distance</small><b>${s.km.toFixed(1)} km<br>${s.area}</b></div>
      <div class="fact"><small>Price</small><b>${priceText(e)}</b></div>
      <div class="fact"><small>Spots left</small><b>${e.spots} of ${e.cap || Math.max(e.spots + 6, 12)}</b></div>
    </div>
    <p class="sec">About</p>
    <p style="font-size:15px;line-height:1.45;margin-bottom:12px">${e.desc}</p>
    <div class="lines"><i style="width:100%"></i><i style="width:92%"></i><i style="width:70%"></i></div>
    <p class="sec">Location</p>
    <div class="box" style="padding:0;overflow:hidden">
      <div style="padding:12px 14px"><b style="font-weight:500">${s.name}</b><p class="hint" style="margin-top:2px">${s.street}, ${s.zip} München</p></div></div>
    <p class="sec">Who's going</p>
    <div style="display:flex;align-items:center">${'<span style="width:32px;height:32px;border-radius:50%;background:#ddd;border:2px solid #fff;margin-right:-8px;display:inline-block"></span>'.repeat(5)}<span class="hint" style="margin:0 0 0 16px">+${Math.max(3, 20 - e.spots)} others, ${Math.min(4, 20 - e.spots > 0 ? 3 : 1)} first-timers</span></div>`;
  $('#evPrice').textContent = priceText(e);
  $('#evSpots').textContent = e.spots <= 5 ? `Only ${e.spots} spots left` : `${e.spots} spots left`;
  const has = S.tickets.some(t => t.id === e.id);
  $('#joinBtn').textContent = has ? 'You\'re going ✓' : 'Join event';
  $('#joinBtn').disabled = has;
}

/* ---------- info ---------- */
function renderInfo() {
  const free = S.cur.price === 0;
  $('#paySec').style.display = free ? 'none' : '';
  $('#freeNote').style.display = free ? '' : 'none';
  $$('.err').forEach(x => x.classList.remove('show'));
  $$('.in').forEach(x => x.classList.remove('bad'));
  paintPM();
}
function paintPM() {
  $$('#payMethod .chip').forEach(c => c.classList.toggle('on', c.dataset.pm === S.pm));
  $('#cardFields').style.display = S.pm === 'card' ? '' : 'none';
  $('#altPay').style.display = S.pm === 'card' ? 'none' : '';
  $('#altName').textContent = S.pm === 'paypal' ? 'PayPal' : 'Apple Pay';
}
$$('#payMethod .chip').forEach(c => c.onclick = () => { S.pm = c.dataset.pm; paintPM(); });
$('#cardno').addEventListener('input', e => { e.target.value = e.target.value.replace(/\D/g, '').slice(0, 16).replace(/(.{4})/g, '$1 ').trim(); });
$('#exp').addEventListener('input', e => { const v = e.target.value.replace(/\D/g, '').slice(0, 4); e.target.value = v.length > 2 ? v.slice(0, 2) + ' / ' + v.slice(2) : v; });
$('#cvc').addEventListener('input', e => { e.target.value = e.target.value.replace(/\D/g, '').slice(0, 4); });
$('#toConfirm').onclick = () => {
  let ok = true;
  const em = $('#email'), ph = $('#tel');
  const contactOk = /\S+@\S+\.\S+/.test(em.value) || ph.value.replace(/\D/g, '').length >= 6;
  $('#errContact').classList.toggle('show', !contactOk);
  em.classList.toggle('bad', !contactOk); ph.classList.toggle('bad', !contactOk);
  ok = contactOk;
  if (S.cur.price > 0 && S.pm === 'card') {
    const f = ['#cardno', '#exp', '#cvc', '#cname'].map(s => $(s));
    const bad = f.filter(x => !x.value.trim());
    f.forEach(x => x.classList.toggle('bad', bad.includes(x)));
    $('#errCard').classList.toggle('show', bad.length > 0);
    if (bad.length) ok = false;
  }
  if (ok) go('confirm');
};
// demo autofill: double-click the title
$('#s-info .top h3').ondblclick = () => { $('#email').value = 'louisa@example.com'; $('#cardno').value = '4242 4242 4242 4242'; $('#exp').value = '12 / 28'; $('#cvc').value = '123'; $('#cname').value = 'Louisa M.'; };

/* ---------- confirm ---------- */
const fee = e => e.price ? Math.round(e.price * 0.05 * 100) / 100 : 0;
const money = n => '€' + n.toFixed(2).replace('.', ',');
function payLabel() {
  if (S.cur.price === 0) return 'None (free event)';
  if (S.pm === 'card') { const n = $('#cardno').value.replace(/\s/g, ''); return 'Card •••• ' + (n.slice(-4) || '0000'); }
  return S.pm === 'paypal' ? 'PayPal' : 'Apple Pay';
}
function contactLabel() { return [$('#email').value, $('#tel').value].filter(Boolean).join(', ') || '(none)'; }
function renderConfirm() {
  const e = S.cur, s = sp(e), sub = e.price * S.qty, f = fee(e) * S.qty;
  $('#confirmBody').innerHTML = `
    <div class="tk"><div class="ph"><span>img</span></div><div class="ti"><b>${e.title}</b><small>${e.date}, ${e.time}</small><small>${s.name}, ${s.area}</small></div></div>
    <p class="sec">Tickets</p>
    <div style="display:flex;justify-content:space-between;align-items:center"><span>${e.price ? money(e.price) + ' each' : 'Free'}</span>
      <div class="stepper"><button data-q="-">−</button><span>${S.qty}</span><button data-q="+">+</button></div></div>
    <p class="sec">Summary</p>
    <div class="box">
      <div class="kv"><span>${S.qty} × ticket</span><span>${money(sub)}</span></div>
      <div class="kv"><span>Service fee</span><span>${money(f)}</span></div>
      <div class="kv total"><span>Total</span><span>${money(sub + f)}</span></div>
    </div>
    <p class="sec">Details</p>
    <div class="box">
      <div class="kv"><span>Contact</span><span style="text-align:right;max-width:65%;word-break:break-all">${contactLabel()}</span></div>
      <div class="kv"><span>Payment</span><span>${payLabel()}</span></div>
      <div class="kv"><span>Sobriety</span><span>${SOB[e.sob].label}</span></div>
    </div>
    <p class="hint" style="margin-top:12px">Free cancellation up to 24 h before the event.</p>`;
  $$('[data-q]').forEach(b => b.onclick = () => { S.qty = Math.max(1, Math.min(Math.min(6, e.spots), S.qty + (b.dataset.q === '+' ? 1 : -1))); renderConfirm(); });
  $('#payBtn').textContent = e.price ? `Confirm and pay ${money(sub + f)}` : 'Confirm spot';
}
$('#payBtn').onclick = () => {
  const b = $('#payBtn'); b.disabled = true; b.textContent = 'Processing…';
  setTimeout(() => {
    b.disabled = false;
    const e = S.cur;
    e.spots = Math.max(0, e.spots - S.qty);
    S.tickets = S.tickets.filter(t => t.id !== e.id);
    S.tickets.unshift({ id: e.id, title: e.title, date: e.date, time: e.time, spot: e.spot, customSpot: e.customSpot, qty: S.qty, total: e.price * S.qty + fee(e) * S.qty, past: false, fb: false, paid: e.price > 0 });
    S.stack = ['start', 'discover'];
    S.screen = 'done'; render();
  }, 900);
};

/* ---------- done ---------- */
function renderDone() {
  const e = S.cur, s = sp(e), t = S.tickets.find(x => x.id === e.id) || { qty: 1, total: 0, paid: e.price > 0 };
  const ref = 'CX-' + (e.id.toUpperCase() + '4821').slice(0, 6);
  $('#doneBody').innerHTML = `
    <div class="center"><div class="ok">✓</div><p class="done-h">You're going!</p><p class="hint" style="margin:4px 0 18px">Booking ${ref}, ${t.qty} ticket${t.qty > 1 ? 's' : ''}</p></div>
    <p class="sec">Payment status</p>
    <div class="box" style="display:flex;justify-content:space-between;align-items:center">
      <div><b style="font-weight:500">${t.paid ? money(t.total) : 'Free'}</b><p class="hint" style="margin-top:2px">${payLabel()}</p></div>
      <span class="status-pill">${t.paid ? '● Paid' : '● No payment needed'}</span>
    </div>
    <p class="sec">Location details</p>
    <div class="box" style="padding:0;overflow:hidden">
      <div style="padding:12px 14px">
        <b style="font-weight:500">${s.name}</b><p class="hint" style="margin-top:2px">${s.street}, ${s.zip} München (${s.km.toFixed(1)} km away)</p>
        <div class="kv" style="margin-top:8px"><span>When</span><span>${e.date}, ${e.time}</span></div>
        <div class="kv"><span>Sobriety</span><span>${SOB[e.sob].label}</span></div>
        <div class="kv"><span>Host</span><span>${e.host}</span></div>
        <button class="btn ghost" style="margin-top:10px;padding:10px">Get directions</button>
      </div></div>
    <p class="sec">Notifications</p>
    <div class="box" style="font-size:14px">✉ Confirmation sent to <b style="font-weight:500">${$('#email').value || $('#tel').value || 'your contact'}</b>. Reminder 24 h before.</div>`;
  $('#notifTxt').textContent = `Your spot at ${e.title} (${e.date}) is confirmed. Tap for details.`;
  setTimeout(() => $('#notif').classList.add('on'), 500);
  setTimeout(() => $('#notif').classList.remove('on'), 4200);
}

/* ---------- tickets ---------- */
function renderTickets() {
  const up = S.tickets.filter(t => !t.past), past = S.tickets.filter(t => t.past);
  const row = t => { const s = t.customSpot || SPOTS[t.spot]; return `<div class="tk"><div class="ph"><span>img</span></div><div class="ti"><b>${t.title}</b><small>${t.date}${t.time ? ', ' + t.time : ''}</small><small>${s.name}</small>
      ${t.past ? (t.fb ? `<span class="mini flat">Feedback sent ✓</span>` : `<button class="mini fill" data-fb="${t.id}">Leave feedback</button>`)
               : `<button class="mini" data-end="${t.id}">Simulate: event ended</button>`}</div></div>`; };
  $('#ticketsBody').innerHTML = `<p class="sec">Upcoming</p>${up.length ? up.map(row).join('') : `<div class="empty" style="padding:24px">No upcoming events.<br><button data-go="discover" style="text-decoration:underline;margin-top:6px">Find one</button></div>`}
    <p class="sec">Past</p>${past.map(row).join('') || '<p class="hint">Nothing yet.</p>'}`;
  $$('[data-end]').forEach(b => b.onclick = () => { const t = S.tickets.find(x => x.id === b.dataset.end); t.past = true; toast('Event ended. Feedback request sent'); renderTickets(); });
  $$('[data-fb]').forEach(b => b.onclick = () => { S.fbFor = S.tickets.find(x => x.id === b.dataset.fb); go('feedback'); });
}

/* ---------- feedback ---------- */
const FB_TAGS = ['Met new people', 'Good vibe', 'Host was welcoming', 'Great drinks', 'Felt safe', 'Too crowded', 'Hard to find'];
function renderFeedback() {
  const t = S.fbFor, s = t.customSpot || SPOTS[t.spot];
  $('#fbTitle').textContent = t.title; $('#fbSub').textContent = `${t.date}, ${s.name}`;
  S.rating = 0; S.again = null; S.fbTags = new Set(); $('#s-feedback textarea').value = '';
  paintFB();
}
function paintFB() {
  $('#stars').innerHTML = [1, 2, 3, 4, 5].map(n => `<button class="${n <= S.rating ? 'on' : ''}" data-r="${n}">${n <= S.rating ? '★' : '☆'}</button>`).join('');
  $$('#stars button').forEach(b => b.onclick = () => { S.rating = +b.dataset.r; paintFB(); });
  $('#fbTags').innerHTML = FB_TAGS.map(t => `<button class="chip ${S.fbTags.has(t) ? 'on' : ''}">${t}</button>`).join('');
  $$('#fbTags .chip').forEach(c => c.onclick = () => { S.fbTags.has(c.textContent) ? S.fbTags.delete(c.textContent) : S.fbTags.add(c.textContent); paintFB(); });
  $$('#again .chip').forEach(c => c.classList.toggle('on', c.dataset.v === S.again));
  $('#fbSend').disabled = !S.rating;
}
$$('#again .chip').forEach(c => c.onclick = () => { S.again = c.dataset.v; paintFB(); });
$('#fbSend').onclick = () => { S.fbFor.fb = true; toast('Thanks! The host got your feedback'); S.stack = ['start']; S.screen = 'tickets'; render(); };

/* ---------- host ---------- */
function renderHost() {
  const h = S.host;
  $('#hSob').innerHTML = Object.entries(SOB).map(([k, v]) => `<button class="opt ${k === h.sob ? 'on' : ''}" data-k="${k}"><span class="dot"></span><span><b>${v.label}</b><small>${v.desc}</small></span></button>`).join('');
  $$('#hSob .opt').forEach(o => o.onclick = () => { h.sob = o.dataset.k; renderHost(); });
  $$('#hPriceType .chip').forEach(c => c.classList.toggle('on', c.dataset.pt === h.pt));
  $('#hPriceIn').classList.toggle('on', h.pt === 'fixed');
  $('#hCap').textContent = h.cap;
  $('#hPicked').classList.toggle('on', !!h.spot);
  if (h.spot) $('#hPickedTxt').textContent = `${h.spot.name}, ${h.spot.street}`;
  if (!$('#hDate').value) { const d = new Date(); d.setDate(d.getDate() + 7); $('#hDate').value = d.toISOString().slice(0, 10); }
  $('#errHost').classList.remove('show');
}
$$('#hPriceType .chip').forEach(c => c.onclick = () => { S.host.pt = c.dataset.pt; renderHost(); });
$$('[data-cap]').forEach(b => b.onclick = () => { S.host.cap = Math.max(2, Math.min(200, S.host.cap + (b.dataset.cap === '+' ? 5 : -5))); $('#hCap').textContent = S.host.cap; });
$('#hLoc').addEventListener('input', e => {
  const q = e.target.value.trim().toLowerCase();
  const hits = q ? SPOTS.filter(s => (s.name + ' ' + s.area + ' ' + s.street).toLowerCase().includes(q)) : SPOTS.slice(0, 4);
  $('#hSuggest').innerHTML = hits.map(s => `<button data-spot="${SPOTS.indexOf(s)}">${s.name}<small>${s.street}, ${s.area}</small></button>`).join('') || `<button disabled>No spots found<small>Try an area like "Schwabing"</small></button>`;
  $('#hSuggest').classList.add('on');
});
$('#hLoc').addEventListener('focus', e => e.target.dispatchEvent(new Event('input')));
$('#hSuggest').addEventListener('click', e => {
  const b = e.target.closest('[data-spot]'); if (!b) return;
  S.host.spot = SPOTS[+b.dataset.spot]; S.host.spotIdx = +b.dataset.spot;
  $('#hLoc').value = S.host.spot.name; $('#hSuggest').classList.remove('on'); renderHost();
});
document.addEventListener('click', e => { if (!e.target.closest('#hLoc,#hSuggest')) $('#hSuggest').classList.remove('on'); });

function hostDraft() {
  const h = S.host, d = new Date($('#hDate').value + 'T' + ($('#hTime').value || '19:00'));
  const price = h.pt === 'fixed' ? Math.max(1, Math.round(parseFloat($('#hPrice').value.replace(',', '.')) || 10)) : 0;
  const dateStr = isNaN(d) ? 'TBD' : d.toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' }).replace(',', '');
  const endH = isNaN(d) ? '' : String((d.getHours() + 3) % 24).padStart(2, '0') + ':' + String(d.getMinutes()).padStart(2, '0');
  return { id: 'h' + Date.now(), title: $('#hName').value.trim() || 'Untitled event', spot: h.spotIdx, date: dateStr, time: `${$('#hTime').value || '19:00'}–${endH}`, price, pwyc: h.pt === 'pwyc', sob: h.sob, spots: h.cap, cap: h.cap, host: 'You', desc: 'New event. The host has not added a description yet.' };
}
function ensureHostDraft() {
  if (!$('#hName').value) $('#hName').value = 'Sunday Coffee Rave';
  if (!S.host.spot) { S.host.spotIdx = 0; S.host.spot = SPOTS[0]; $('#hLoc').value = SPOTS[0].name; }
  if (!$('#hDate').value) renderHost();
  S.draft = hostDraft();
  $('#hostDoneCard').innerHTML = cardHTML(S.draft, false);
}
$('#toPreview').onclick = () => {
  const ok = $('#hName').value.trim() && $('#hDate').value && S.host.spot;
  $('#errHost').classList.toggle('show', !ok);
  if (!ok) { $('#s-host .body').scrollTop = 9999; return; }
  S.draft = hostDraft(); go('hostPreview');
};
function renderPreview() { $('#previewCard').innerHTML = cardHTML(S.draft, false) + `<div class="box"><div class="kv"><span>Capacity</span><span>${S.draft.cap} guests</span></div><div class="kv"><span>Sobriety</span><span>${SOB[S.draft.sob].label}</span></div><div class="kv"><span>Price</span><span>${priceText(S.draft)}</span></div></div>`; }
$('#createBtn').onclick = () => {
  S.events = S.events.filter(e => e.id !== S.draft.id);
  S.events.unshift(S.draft); S.created = S.draft;
  $('#hostDoneCard').innerHTML = cardHTML(S.draft, false);
  S.stack = ['start']; S.screen = 'hostDone'; render();
};
$('#seeInDiscover').onclick = () => { clearFilters(); S.stack = ['start']; S.screen = 'discover'; render(); };
$('#hostAnother').addEventListener('click', () => { $('#hName').value = ''; $('#hLoc').value = ''; $('#hPrice').value = ''; S.host = { sob: 'free', pt: 'free', cap: 20, spot: null }; });

/* ---------- misc ---------- */
let tt;
function toast(m) { const t = $('#toast'); t.textContent = m; t.classList.add('on'); clearTimeout(tt); tt = setTimeout(() => t.classList.remove('on'), 2200); }
function resetAll() { S = freshState(); $$('#phone input, #phone textarea').forEach(i => { if (i.type !== 'time') i.value = ''; }); $('#qx').style.display = 'none'; render(); }
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeSheet(); });

render();
