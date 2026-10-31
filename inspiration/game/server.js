// Odd Word Out: tiny multiplayer server. No dependencies.
// Rooms live in memory. Phones get live updates over Server-Sent Events and send actions with POST /api.
'use strict';
const http = require('http');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const HOST = process.env.HOST || '127.0.0.1';
const PORT = +(process.env.PORT || 8820);
const DIR = __dirname;

/* ---------------- content ---------------- */
// [word, echo word, imposter hint]
const PACKS = {
  Places: [['Lighthouse','Windmill',"It's tall"],['Airport','Train station','Lots of waiting'],['Library','Bookshop','Be quiet'],
    ['Zoo','Farm','Animals live here'],['Cinema','Theatre','Sit in the dark'],['Beach','Swimming pool','You get wet'],['Hospital','Dentist','Nobody wants to go']],
  Food: [['Pancakes','Waffles','Breakfast'],['Pizza','Lasagne','Has cheese'],['Ice cream','Frozen yogurt','Cold'],
    ['Popcorn','Crisps','Crunchy'],['Sushi','Spring roll','You roll it'],['Spaghetti','Noodles','Slurp']],
  Animals: [['Penguin','Puffin','Lives somewhere cold'],['Shark','Dolphin','Swims'],['Owl','Bat','Awake at night'],
    ['Giraffe','Camel','Long legs'],['Octopus','Jellyfish','No bones'],['Hamster','Guinea pig','Lives in a cage']],
  Jobs: [['Firefighter','Police officer','Wears a uniform'],['Chef','Baker','Works in a kitchen'],['Pilot','Astronaut','Goes up'],
    ['Teacher','Librarian','Works with kids'],['Dentist','Doctor','Wears gloves']],
  'At home': [['Toaster','Microwave','In the kitchen'],['Pillow','Blanket','Soft'],['Toothbrush','Hairbrush','Every morning'],
    ['Fridge','Freezer','Hums'],['Sofa','Bed','You lie on it']],
  Sports: [['Football','Rugby','Kick it'],['Tennis','Badminton','Uses a net'],['Skiing','Snowboarding','Needs snow'],['Swimming','Diving','Wear goggles']],
  Stories: [['Dragon','Dinosaur','Huge'],['Pirate','Viking','Sails the sea'],['Wizard','Witch','Does magic'],['Robot','Alien','Not human'],['Mermaid','Fairy','Not real']],
  Holidays: [['Birthday','Wedding',"There's cake"],['Halloween','Bonfire Night','Happens in autumn'],['Christmas','New Year','Late night'],['Sleepover','Camping','You stay the night']],
};
const ANGLES = ['a sound','a colour','a place','a feeling','who uses it','how it moves','a smell','a time of year','a texture','its size'];
const CODES = ['MOTH','LAMP','FROG','KITE','TOAD','PEAR','WOLF','DUCK','FISH','BEAR','CAKE','SOCK','BELL','MOON','STAR','LEAF','ROSE','SEAL','CROW','MINT','PLUM','FERN','GOAT','HARP','JAM','OWL','YAK','BUN','FIG','EMU'].filter(c => c.length === 4);
const BOT_NAMES = ['Gran','Dad','Mum','Mia','Leo','Ava','Sam','Zoe','Max'];
const SHAPES = 8;
const T = { secret: 25000, talk: 90000, vote: 30000, guess: 25000 };
const MAX_PLAYERS = 10;

/* ---------------- helpers ---------------- */
const rnd = n => Math.floor(Math.random() * n);
const pick = a => a[rnd(a.length)];
const shuffle = a => { a = [...a]; for (let i = a.length - 1; i > 0; i--) { const j = rnd(i + 1); [a[i], a[j]] = [a[j], a[i]]; } return a; };
const id = () => crypto.randomBytes(9).toString('base64url');
const norm = s => String(s || '').toLowerCase().replace(/[^a-z]/g, '').replace(/s$/, '');
const cleanName = s => String(s || '').replace(/[\u0000-\u001f<>]/g, '').trim().slice(0, 14);

const rooms = new Map();

function newCode() {
  const free = CODES.filter(c => !rooms.has(c));
  if (free.length) return pick(free);
  let c; do { c = Array.from({length: 4}, () => 'ABCDEFGHJKLMNPRSTUVWXYZ'[rnd(23)]).join(''); } while (rooms.has(c));
  return c;
}
function addPlayer(room, name, bot = false) {
  const used = new Set(room.players.map(p => p.shape));
  const shape = [...Array(SHAPES).keys()].find(s => !used.has(s)) ?? rnd(SHAPES);
  const p = { id: id(), name, shape, bot, hearts: 3, correct: 0 };
  room.players.push(p);
  return p;
}
const alive = room => room.players.filter(p => p.hearts > 0);
const byId = (room, pid) => room.players.find(p => p.id === pid);

/* ---------------- game flow ---------------- */
function setPhase(room, phase, ms) {
  room.phase = phase;
  room.deadline = ms ? Date.now() + ms : null;
  clearTimeout(room.timer);
  if (ms) room.timer = setTimeout(() => onDeadline(room), ms + 150);
  scheduleBots(room);
}

function startGame(room) {
  room.players.forEach(p => { p.hearts = 3; p.correct = 0; });
  room.round = 0; room.used = new Set();
  newRound(room);
}

function newRound(room) {
  room.round++;
  let cat, entry, tries = 0;
  do { cat = pick(Object.keys(PACKS)); entry = pick(PACKS[cat]); } while (room.used.has(entry[0]) && ++tries < 50);
  room.used.add(entry[0]);
  const live = alive(room);
  const imposter = pick(live);
  const crew = live.filter(p => p !== imposter);
  const echo = room.settings.echo && live.length >= 5 ? pick(crew) : null;
  const angles = shuffle(ANGLES);
  const r = room.r = {
    category: cat, word: entry[0], echoWord: entry[1], hint: entry[2],
    imposterId: imposter.id, echoId: echo ? echo.id : null,
    angles: {}, order: shuffle(room.players).map(p => p.id),
    ready: new Set(), votes: {}, caughtId: null, guess: null, guessCorrect: false, deltas: {},
  };
  room.players.forEach((p, i) => { r.angles[p.id] = angles[i % angles.length]; });
  setPhase(room, 'secret', T.secret);
}

function voters(room) { return alive(room); }

function maybeEndVote(room) {
  if (room.phase !== 'vote') return;
  if (voters(room).every(p => room.r.votes[p.id])) endVote(room);
}
function endVote(room) {
  const r = room.r, tally = {};
  Object.values(r.votes).forEach(t => { tally[t] = (tally[t] || 0) + 1; });
  const max = Math.max(0, ...Object.values(tally));
  const top = Object.keys(tally).filter(k => tally[k] === max);
  r.tally = tally;
  r.topId = top.length === 1 ? top[0] : null; // a tie means nobody is voted out
  if (r.topId && r.topId === r.imposterId) { r.caughtId = r.imposterId; setPhase(room, 'guess', T.guess); }
  else resolve(room);
}
function resolve(room) {
  const r = room.r, d = r.deltas;
  for (const [voter, target] of Object.entries(r.votes)) {
    if (voter === r.imposterId) continue;
    if (target === r.imposterId) byId(room, voter) && byId(room, voter).correct++;
    else d[voter] = (d[voter] || 0) - 1;
  }
  const imp = byId(room, r.imposterId);
  if (imp) d[imp.id] = (r.caughtId && !r.guessCorrect) ? -1 : (imp.hearts < 3 ? 1 : 0);
  for (const [pid, n] of Object.entries(d)) { const p = byId(room, pid); if (p) p.hearts = Math.max(0, Math.min(3, p.hearts + n)); }
  setPhase(room, 'result');
}
function next(room) {
  if (room.round >= room.settings.rounds || alive(room).length <= 2) setPhase(room, 'over');
  else newRound(room);
}
function onDeadline(room) {
  if (!rooms.has(room.code)) return;
  if (room.phase === 'secret') setPhase(room, 'talk', T.talk);
  else if (room.phase === 'talk') setPhase(room, 'vote', T.vote);
  else if (room.phase === 'vote') endVote(room);
  else if (room.phase === 'guess') resolve(room);
  push(room);
}

/* bots act with small human-ish delays */
function scheduleBots(room) {
  (room.botTimers || []).forEach(clearTimeout);
  room.botTimers = [];
  const later = (ms, fn) => room.botTimers.push(setTimeout(() => { if (rooms.has(room.code)) { fn(); push(room); } }, ms));
  const r = room.r;
  if (room.phase === 'secret') room.players.filter(p => p.bot).forEach(p => later(800 + rnd(2500), () => { if (room.phase === 'secret') { r.ready.add(p.id); maybeEndSecret(room); } }));
  if (room.phase === 'vote') voters(room).filter(p => p.bot).forEach(p => later(1500 + rnd(5000), () => {
    if (room.phase !== 'vote' || r.votes[p.id]) return;
    const options = voters(room).filter(o => o.id !== p.id);
    const imp = options.find(o => o.id === r.imposterId);
    r.votes[p.id] = (imp && p.id !== r.imposterId && Math.random() < 0.45 ? imp : pick(options)).id;
    maybeEndVote(room);
  }));
  if (room.phase === 'guess') { const imp = byId(room, r.caughtId); if (imp && imp.bot) later(2500 + rnd(2000), () => {
    if (room.phase !== 'guess') return;
    r.guess = Math.random() < 0.3 ? r.word : pick(PACKS[r.category].filter(e => e[0] !== r.word))[0];
    r.guessCorrect = norm(r.guess) === norm(r.word); resolve(room);
  }); }
}
function maybeEndSecret(room) {
  if (room.phase === 'secret' && room.players.every(p => room.r.ready.has(p.id))) setPhase(room, 'talk', T.talk);
}

/* ---------------- per-player view ---------------- */
function view(room, pid) {
  const me = byId(room, pid), r = room.r;
  const v = {
    code: room.code, phase: room.phase, round: room.round, rounds: room.settings.rounds, settings: room.settings,
    deadline: room.deadline, serverNow: Date.now(), hostId: room.hostId, meId: pid,
    players: room.players.map(p => ({ id: p.id, name: p.name, shape: p.shape, bot: p.bot, hearts: p.hearts, online: p.bot || (room.conns.get(p.id) || 0) > 0 })),
  };
  if (!me || room.phase === 'lobby') return v;
  if (['secret','talk','vote','guess'].includes(room.phase)) v.ghost = me.hearts === 0;
  // the card is only sent while it can be read; once talking starts it can't be looked at again
  if (room.phase === 'secret') v.card = me.id === r.imposterId
    ? { imposter: true, category: r.category, hint: r.hint, angle: r.angles[me.id] }
    : { imposter: false, category: r.category, word: me.id === r.echoId ? r.echoWord : r.word, angle: r.angles[me.id] };
  if (room.phase === 'secret') v.ready = [...r.ready];
  if (room.phase === 'talk') v.order = r.order;
  if (room.phase === 'vote') { v.myVote = r.votes[me.id] || null; v.voted = Object.keys(r.votes); v.voters = voters(room).map(p => p.id); }
  if (room.phase === 'guess') v.caughtId = r.caughtId;
  if (room.phase === 'result') Object.assign(v, { reveal: {
    imposterId: r.imposterId, echoId: r.echoId, word: r.word, echoWord: r.echoWord, category: r.category,
    caught: !!r.caughtId, guess: r.guess, guessCorrect: r.guessCorrect, votes: r.votes, tally: r.tally || {}, deltas: r.deltas } });
  if (room.phase === 'over') v.ranking = [...room.players].sort((a, b) => b.hearts - a.hearts || b.correct - a.correct).map(p => ({ id: p.id, hearts: p.hearts, correct: p.correct }));
  return v;
}
function push(room) {
  room.touched = Date.now();
  for (const [res, pid] of room.streams) res.write(`data: ${JSON.stringify(view(room, pid))}\n\n`);
}

/* ---------------- actions ---------------- */
function act(body) {
  const a = body.action;
  if (a === 'create') {
    const name = cleanName(body.name); if (!name) return { error: 'Add your name' };
    const room = { code: newCode(), players: [], settings: { rounds: 5, echo: true }, phase: 'lobby', round: 0, streams: new Map(), conns: new Map(), used: new Set(), touched: Date.now() };
    const p = addPlayer(room, name); room.hostId = p.id;
    rooms.set(room.code, room);
    return { code: room.code, pid: p.id };
  }
  const room = rooms.get(String(body.code || '').toUpperCase());
  if (!room) return { error: 'No room with that code' };
  if (a === 'join') {
    const name = cleanName(body.name); if (!name) return { error: 'Add your name' };
    if (room.phase !== 'lobby') return { error: 'That game has started' };
    if (room.players.length >= MAX_PLAYERS) return { error: 'Room is full' };
    if (room.players.some(p => p.name.toLowerCase() === name.toLowerCase())) return { error: 'Name taken' };
    const p = addPlayer(room, name); push(room); return { code: room.code, pid: p.id };
  }
  const me = byId(room, body.pid);
  if (!me) return { error: 'Not in this room' };
  const host = me.id === room.hostId, r = room.r;
  switch (a) {
    case 'check': return { ok: true };
    case 'addBot':
      if (!host || room.phase !== 'lobby' || room.players.length >= MAX_PLAYERS) break;
      addPlayer(room, BOT_NAMES.find(n => !room.players.some(p => p.name === n)) || 'Bot', true); break;
    case 'kick':
      if (host && room.phase === 'lobby' && body.target !== me.id) room.players = room.players.filter(p => p.id !== body.target); break;
    case 'settings':
      if (!host || room.phase !== 'lobby') break;
      if ([3,5,7].includes(body.rounds)) room.settings.rounds = body.rounds;
      if (typeof body.echo === 'boolean') room.settings.echo = body.echo; break;
    case 'start':
      if (host && (room.phase === 'lobby' || room.phase === 'over') && room.players.length >= 3) startGame(room); break;
    case 'lobby':
      if (host && room.phase === 'over') { room.players.forEach(p => { p.hearts = 3; p.correct = 0; }); setPhase(room, 'lobby'); } break;
    case 'ready':
      if (room.phase === 'secret') { r.ready.add(me.id); maybeEndSecret(room); } break;
    case 'skip':
      if (host && room.phase === 'talk') setPhase(room, 'vote', T.vote); break;
    case 'vote':
      if (room.phase === 'vote' && me.hearts > 0 && body.target !== me.id && voters(room).some(p => p.id === body.target)) { r.votes[me.id] = body.target; maybeEndVote(room); } break;
    case 'guess':
      if (room.phase === 'guess' && me.id === r.caughtId && !r.guess) { r.guess = String(body.word || '').slice(0, 30); r.guessCorrect = norm(r.guess) === norm(r.word); resolve(room); } break;
    case 'next':
      if (host && room.phase === 'result') next(room); break;
    default: return { error: 'Unknown action' };
  }
  push(room);
  return { ok: true };
}

/* ---------------- http ---------------- */
const TYPES = { '.html': 'text/html; charset=utf-8', '.woff2': 'font/woff2', '.js': 'text/javascript' };
http.createServer((req, res) => {
  const url = new URL(req.url, 'http://x');
  if (req.method === 'POST' && url.pathname === '/api') {
    let data = '';
    req.on('data', c => { data += c; if (data.length > 4000) req.destroy(); });
    req.on('end', () => {
      let out; try { out = act(JSON.parse(data || '{}')); } catch (e) { out = { error: 'Bad request' }; }
      res.writeHead(out.error ? 400 : 200, { 'Content-Type': 'application/json' }); res.end(JSON.stringify(out));
    });
    return;
  }
  if (url.pathname === '/events') {
    const room = rooms.get(String(url.searchParams.get('code') || '').toUpperCase());
    const pid = url.searchParams.get('pid');
    if (!room || !byId(room, pid)) { res.writeHead(404); res.end(); return; }
    res.writeHead(200, { 'Content-Type': 'text/event-stream', 'Cache-Control': 'no-cache', Connection: 'keep-alive', 'X-Accel-Buffering': 'no' });
    res.write('retry: 1500\n\n');
    room.streams.set(res, pid); room.conns.set(pid, (room.conns.get(pid) || 0) + 1);
    push(room);
    const ping = setInterval(() => res.write(': ping\n\n'), 20000);
    req.on('close', () => { clearInterval(ping); room.streams.delete(res); room.conns.set(pid, room.conns.get(pid) - 1); push(room); });
    return;
  }
  const file = url.pathname === '/' ? 'index.html' : url.pathname.slice(1);
  const full = path.join(DIR, path.normalize(file));
  if (!full.startsWith(DIR) || !TYPES[path.extname(full)] || full.endsWith('server.js')) { res.writeHead(404); res.end('Not found'); return; }
  fs.readFile(full, (err, buf) => {
    if (err) { res.writeHead(404); res.end('Not found'); return; }
    res.writeHead(200, { 'Content-Type': TYPES[path.extname(full)], 'Cache-Control': 'no-cache' }); res.end(buf);
  });
}).listen(PORT, HOST, () => console.log(`Odd Word Out on http://${HOST}:${PORT}`));

// forget rooms nobody has touched for 6 hours
setInterval(() => { for (const [c, r] of rooms) if (Date.now() - r.touched > 6 * 3600e3 && !r.streams.size) { clearTimeout(r.timer); rooms.delete(c); } }, 600000);
