/* Dear Postcard – AR animations
   Each printed card/sticker is one image target (order = order in targets.mind).
   Animations are drawn on a transparent canvas laid exactly over the print,
   in the same pixel coordinates as the design files. */
(function () {
  var TARGETS = [
    { file: 'moon.png',             w: 397, h: 559, m: 40,  anim: 'moon', fx: { water: { x0: 0, x1: 397, y0: 412, y1: 559, mx: 186, col: '255,236,180' }, glitter: { n: 40, cols: ['#FFF4D2', '#FFFFFF', '#C9D6FF'] } } },
    { file: 'csmt.png',             w: 559, h: 397, m: 40,  anim: 'csmt', fx: { glitter: { n: 30, cols: ['#FFFFFF', '#FFE27A', '#FF7AA2'] } } },
    { file: 'diwali.png',           w: 559, h: 397, m: 40,  anim: 'diwali', fx: { glitter: { n: 60, cols: ['#FFD23F', '#FFFFFF', '#FF9F1C', '#FF7AA2'] } } },
    { file: 'christmas.png',        w: 559, h: 397, m: 220, anim: 'christmas', fx: { glitter: { n: 45, cols: ['#FFFFFF', '#FFE9A8', '#BFE3FF'] } } },
    { file: 'newyear.png',          w: 559, h: 397, m: 40,  anim: 'newyear', fx: { glitter: { n: 55, cols: ['#FFD23F', '#FFFFFF', '#5CE1D8'] } } },
    { file: 'torii-portrait.png',   w: 397, h: 559, m: 20,  anim: 'sakura', fx: { water: { x0: 40, x1: 340, y0: 428, y1: 528, mx: 245, col: '255,200,225' }, glitter: { n: 50, cols: ['#FFFFFF', '#FFD9E8', '#FFC2DA'] } } },
    { file: 'torii-landscape.png',  w: 559, h: 397, m: 20,  anim: 'sakura', fx: { water: { x0: 0, x1: 559, y0: 296, y1: 397, mx: 452, col: '255,210,190' }, glitter: { n: 50, cols: ['#FFFFFF', '#FFD9E8', '#FFC2DA'] } } },
    { file: 'sticker-mumbai.png',   w: 284, h: 284, m: 70,  anim: 'stickerMumbai', fx: { glitter: { n: 26, cols: ['#FFFFFF', '#FFE27A', '#FF7AA2'] } } },
    { file: 'sticker-navi.png',     w: 284, h: 284, m: 70,  anim: 'stickerNavi', fx: { glitter: { n: 26, cols: ['#FFFFFF', '#FFE27A', '#8FDCCB'] } } },
    { file: 'sticker-cat.png',      w: 284, h: 284, m: 80,  anim: 'cat', fx: { glitter: { n: 30, cols: ['#FFFFFF', '#FFC2DA', '#FFE27A'] } } },
    { file: 'sticker-fah.png',      w: 284, h: 284, m: 90,  anim: 'fah', fx: { glitter: { n: 24, cols: ['#FFFFFF', '#FFE27A'] } } },
    { file: 'marine.png',           w: 559, h: 397, m: 40,  anim: 'marine', fx: { water: { x0: 0, x1: 559, y0: 253, y1: 312, mx: 300, col: '255,200,130' }, glitter: { n: 40, cols: ['#FFF3DC', '#FFD66B', '#FFFFFF'] } } },
    { file: 'csmt-hindi.png',       w: 559, h: 397, m: 40,  anim: 'csmtHindi', fx: { glitter: { n: 30, cols: ['#FFFFFF', '#FFE27A', '#FF7AA2'] } } },
    { file: 'sticker-designer.png', w: 284, h: 284, m: 70,  anim: 'stickerDesigner', fx: { glitter: { n: 28, cols: ['#FFFFFF', '#FFC93C', '#5CE1D8', '#FF7AA2'] } } },
    { file: 'winter.png',           w: 559, h: 397, m: 40,  anim: 'winter', fx: { water: { x0: 0, x1: 559, y0: 232, y1: 262, mx: 300, col: '255,255,255' }, glitter: { n: 30, cols: ['#FFFFFF', '#E9F6FB', '#BDE4F4'] } } },
    { file: 'bookmark-sakura.png',  w: 189, h: 567, m: 30,  anim: 'sakura', fx: { water: { x0: 0, x1: 189, y0: 452, y1: 540, mx: 120, col: '255,200,225' }, glitter: { n: 34, cols: ['#FFFFFF', '#FFD9E8', '#FFC2DA'] } } },
    { file: 'bookmark-village.png', w: 189, h: 567, m: 30,  anim: 'vid', cfg: 'BM', sound: 'village' },
    { file: 'village-life.png',     w: 397, h: 559, m: 30,  anim: 'vid', cfg: 'A', sound: 'village' },
    { file: 'monsoon.png',          w: 397, h: 559, m: 30,  anim: 'vid', cfg: 'M', sound: 'monsoon' },
    { file: 'village-hut.png',      w: 397, h: 559, m: 30,  anim: 'vid', cfg: 'B', sound: 'village' }
  ];

  var INK = '#1D1D1B';
  function rnd(a, b) { return a + Math.random() * (b - a); }
  function rr(ctx, x, y, w, h, r) {
    ctx.beginPath(); ctx.moveTo(x + r, y); ctx.arcTo(x + w, y, x + w, y + h, r); ctx.arcTo(x + w, y + h, x, y + h, r);
    ctx.arcTo(x, y + h, x, y, r); ctx.arcTo(x, y, x + w, y, r); ctx.closePath();
  }
  var NOLINE = false;
  function shape(ctx, fill, lw) { ctx.fillStyle = fill; ctx.fill(); if (lw && !NOLINE) { ctx.lineWidth = lw; ctx.strokeStyle = INK; ctx.stroke(); } }
  function circle(ctx, x, y, r, fill, lw) { ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); shape(ctx, fill, lw); }
  function star4(ctx, x, y, r, col, a) {
    ctx.save(); ctx.globalAlpha = a; ctx.fillStyle = col; ctx.beginPath();
    ctx.moveTo(x, y - r); ctx.lineTo(x + r * 0.22, y - r * 0.22); ctx.lineTo(x + r, y); ctx.lineTo(x + r * 0.22, y + r * 0.22);
    ctx.lineTo(x, y + r); ctx.lineTo(x - r * 0.22, y + r * 0.22); ctx.lineTo(x - r, y); ctx.lineTo(x - r * 0.22, y - r * 0.22);
    ctx.closePath(); ctx.fill(); ctx.restore();
  }
  function petal(ctx, x, y, rot, s, col) {
    ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.scale(s, s); ctx.fillStyle = col; ctx.beginPath();
    ctx.moveTo(0, -5); ctx.bezierCurveTo(4, -4, 4, 3, 0, 5); ctx.bezierCurveTo(-4, 3, -4, -4, 0, -5); ctx.fill(); ctx.restore();
  }
  function shootingStar(ctx, x, y, len, p) {
    var a = p < 0.15 ? p / 0.15 : (p > 0.75 ? (1 - p) / 0.25 : 1);
    var hx = x - len * p, hy = y + len * 0.55 * p;
    var g = ctx.createLinearGradient(hx, hy, hx + 70, hy - 38);
    g.addColorStop(0, 'rgba(255,255,255,' + a + ')'); g.addColorStop(1, 'rgba(255,255,255,0)');
    ctx.strokeStyle = g; ctx.lineWidth = 1.6; ctx.lineCap = 'round';
    ctx.beginPath(); ctx.moveTo(hx, hy); ctx.lineTo(hx + 70, hy - 38); ctx.stroke();
    circle(ctx, hx, hy, 1.8, 'rgba(255,255,255,' + a + ')');
  }

  /* ---------- vehicle sprites (same drawing as the printed card) ---------- */
  function taxi(ctx, x, y, s, wheelT) {
    ctx.save(); ctx.translate(x, y); ctx.scale(s, s); ctx.translate(-32, -379);
    ctx.lineJoin = 'round';
    ctx.beginPath(); ctx.moveTo(62, 346); ctx.lineTo(76, 322); ctx.lineTo(130, 322); ctx.lineTo(146, 346); ctx.closePath(); shape(ctx, '#FFC300', 2.5);
    ctx.beginPath(); ctx.moveTo(80, 343); ctx.lineTo(88, 327); ctx.lineTo(102, 327); ctx.lineTo(102, 343); ctx.closePath();
    ctx.moveTo(107, 343); ctx.lineTo(107, 327); ctx.lineTo(126, 327); ctx.lineTo(136, 343); ctx.closePath(); shape(ctx, '#BDE4F4', 2.5);
    rr(ctx, 94, 313, 22, 9, 2); shape(ctx, '#FFC300', 2.5);
    rr(ctx, 38, 344, 128, 22, 9); shape(ctx, INK, 2.5);
    ctx.fillStyle = '#FFC300'; ctx.fillRect(56, 350, 96, 3);
    circle(ctx, 160, 351, 3.5, '#FFF1A8', 2);
    [68, 136].forEach(function (cx) {
      circle(ctx, cx, 368, 11, INK, 2.5); circle(ctx, cx, 368, 4, '#CFCFCF', 2);
      ctx.strokeStyle = '#CFCFCF'; ctx.lineWidth = 2; ctx.beginPath();
      ctx.moveTo(cx, 368); ctx.lineTo(cx + 8 * Math.cos(wheelT), 368 + 8 * Math.sin(wheelT)); ctx.stroke();
    });
    ctx.restore();
  }
  function bus(ctx, x, y, s, wheelT) {
    ctx.save(); ctx.translate(x, y); ctx.scale(s, s); ctx.translate(-356, -360); ctx.lineJoin = 'round';
    rr(ctx, 362, 266, 164, 80, 9); shape(ctx, '#E63B2E', 2.5);
    ctx.fillStyle = '#BDE4F4'; ctx.fillRect(374, 274, 144, 20); ctx.lineWidth = 2.5; ctx.strokeStyle = INK; ctx.strokeRect(374, 274, 144, 20);
    ctx.fillStyle = '#FFF3DC'; ctx.fillRect(362, 298, 164, 5);
    ctx.fillStyle = '#BDE4F4'; ctx.fillRect(388, 307, 130, 18); ctx.strokeRect(388, 307, 130, 18);
    ctx.fillRect(366, 306, 16, 26); ctx.strokeRect(366, 306, 16, 26);
    ctx.lineWidth = 1.6; ctx.beginPath();
    for (var i = 392; i <= 500; i += 18) { ctx.moveTo(i, 274); ctx.lineTo(i, 294); }
    for (var j = 406; j <= 496; j += 18) { ctx.moveTo(j, 307); ctx.lineTo(j, 325); }
    ctx.stroke();
    circle(ctx, 366, 338, 3, '#FFF1A8', 2);
    [398, 492].forEach(function (cx) {
      circle(ctx, cx, 348, 12, INK, 2.5); circle(ctx, cx, 348, 4.5, '#CFCFCF', 2);
      ctx.strokeStyle = '#CFCFCF'; ctx.lineWidth = 2; ctx.beginPath();
      ctx.moveTo(cx, 348); ctx.lineTo(cx + 9 * Math.cos(-wheelT), 348 + 9 * Math.sin(-wheelT)); ctx.stroke();
    });
    ctx.restore();
  }
  function bubble(ctx, x, y, text, p, col) {
    var s = p < 0.2 ? p / 0.2 * 1.1 : (p < 0.3 ? 1.1 - (p - 0.2) : 1);
    var a = p > 0.85 ? (1 - p) / 0.15 : 1;
    ctx.save(); ctx.globalAlpha = Math.max(0, a); ctx.translate(x, y); ctx.scale(s, s);
    ctx.font = '800 18px "Baloo 2", system-ui, sans-serif'; var w = ctx.measureText(text).width + 22;
    rr(ctx, -w / 2, -17, w, 30, 15); shape(ctx, col || '#FFFFFF', 2.5);
    ctx.fillStyle = INK; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText(text, 0, -1);
    ctx.restore();
  }

  /* ---------------- animations ---------------- */
  var ANIMS = {};

  ANIMS.moon = {
    init: function (st) {
      st.glints = []; for (var i = 0; i < 46; i++) st.glints.push({ x: rnd(125, 255), y: rnd(414, 500), w: rnd(8, 26), ph: rnd(0, 6.28), sp: rnd(1.5, 3.5) });
      st.stars = [[70, 96], [248, 66], [40, 300], [150, 40], [230, 120], [30, 180], [110, 260]];
      st.leaves = []; for (var j = 0; j < 4; j++) st.leaves.push({ ph: j * 2.4 });
    },
    draw: function (ctx, t, st) {
      st.glints.forEach(function (g) {
        var a = 0.5 + 0.5 * Math.sin(t * g.sp + g.ph); var fade = 1 - (g.y - 414) / 100;
        ctx.globalAlpha = a * fade * 0.9; ctx.fillStyle = '#FFF0BE';
        ctx.fillRect(g.x - g.w / 2 + Math.sin(t * 0.8 + g.ph) * 4, g.y, g.w, 1.8);
      });
      ctx.globalAlpha = 1;
      st.stars.forEach(function (s, i) { star4(ctx, s[0], s[1], 4 + 3 * Math.abs(Math.sin(t * 1.3 + i)), '#FFFFFF', 0.4 + 0.6 * Math.abs(Math.sin(t * 1.3 + i))); });
      st.leaves.forEach(function (l) {
        var p = ((t + l.ph) % 9.6) / 9.6; var x = 380 - p * 260 + Math.sin(p * 12) * 18; var y = 60 + p * 380;
        ctx.save(); ctx.translate(x, y); ctx.rotate(Math.sin(p * 10) * 0.8 + 2.6); ctx.globalAlpha = p > 0.85 ? (1 - p) / 0.15 : 1;
        ctx.fillStyle = '#163A45'; ctx.beginPath(); ctx.ellipse(0, 0, 16, 3.4, 0, 0, Math.PI * 2); ctx.fill(); ctx.restore();
      });
    }
  };

  /* ---- CSMT dabbawala: waves, walks off, comes back ---- */
  function dabbaPlate(st) {
    if (st.plate) return st.plate.complete && st.plate.naturalWidth ? st.plate : null;
    st.plate = new Image(); st.plate.src = 'assets/csmt-plate.png'; return null;
  }
  function dabbawala(ctx, x, y, walk, wave, t) {
    var bob = walk ? Math.abs(Math.sin(t * 9)) * -2 : 0, sw = walk ? Math.sin(t * 9) * 5 : 0, tb = walk ? Math.sin(t * 18) * 1.2 : Math.sin(t * 3) * 0.6;
    ctx.save(); ctx.translate(x, y + bob); ctx.lineJoin = 'round'; ctx.lineCap = 'round';
    /* legs */
    [[-10, -sw], [9, sw]].forEach(function (l) { ctx.beginPath(); ctx.moveTo(l[0], -18); ctx.lineTo(l[0] + l[1], 0); ctx.strokeStyle = INK; ctx.lineWidth = 10; ctx.stroke(); ctx.strokeStyle = '#FFFDF5'; ctx.lineWidth = 6; ctx.stroke(); });
    /* arms hold the crate (one waves) */
    ctx.strokeStyle = '#C98058'; ctx.lineWidth = 5;
    ctx.beginPath(); ctx.moveTo(-8, -48); ctx.lineTo(-30, -80 + tb); ctx.stroke();
    if (wave) { var a = Math.sin(t * 10) * 0.5; ctx.beginPath(); ctx.moveTo(8, -48); ctx.lineTo(24, -58); ctx.lineTo(24 + Math.sin(a) * 14, -58 - Math.cos(a) * 14); ctx.stroke(); circle(ctx, 24 + Math.sin(a) * 16, -58 - Math.cos(a) * 16, 3.5, '#C98058', 1.5); }
    else { ctx.beginPath(); ctx.moveTo(8, -48); ctx.lineTo(30, -80 + tb); ctx.stroke(); }
    /* kurta */
    ctx.beginPath(); ctx.moveTo(-12, -50); ctx.lineTo(12, -50); ctx.lineTo(17, -18); ctx.lineTo(-17, -18); ctx.closePath(); shape(ctx, '#FFFDF5', 2.5);
    /* head, Gandhi cap, face */
    circle(ctx, 0, -61, 11, '#C98058', 2.5);
    ctx.beginPath(); ctx.moveTo(-11, -67); ctx.lineTo(11, -67); ctx.lineTo(8, -75); ctx.lineTo(-8, -75); ctx.closePath(); shape(ctx, '#FFFDF5', 2.5);
    circle(ctx, 6, -58, 3.2, '#B56A45', 1.5);
    ctx.fillStyle = INK; ctx.beginPath(); ctx.arc(-4, -63, 1.6, 0, 6.28); ctx.arc(4, -63, 1.6, 0, 6.28); ctx.fill();
    ctx.beginPath(); ctx.moveTo(-6, -54); ctx.quadraticCurveTo(0, -50, 6, -54); ctx.lineWidth = 2; ctx.strokeStyle = INK; ctx.stroke();
    /* wooden crate of steel tiffin carriers on his head */
    ctx.save(); ctx.translate(0, tb); if (wave) ctx.rotate(-0.04);
    rr(ctx, -42, -86, 84, 10, 2); shape(ctx, '#A0663A', 2.5);
    for (var i = 0; i < 5; i++) {
      var dx = -39 + i * 16, dy = -112 + Math.sin(t * 6 + i) * (walk ? 0.8 : 0.3);
      ctx.strokeStyle = INK; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(dx + 2, dy + 2); ctx.quadraticCurveTo(dx + 6.5, dy - 7, dx + 11, dy + 2); ctx.stroke();
      for (var k2 = 0; k2 < 3; k2++) { rr(ctx, dx, dy + 2 + k2 * 8, 13, 8, 1.5); shape(ctx, '#D9DEE5', 2.5); ctx.fillStyle = '#FFFFFF'; ctx.fillRect(dx + 2, dy + 3.5 + k2 * 8, 2.4, 5); }
      ctx.lineWidth = 1.8; ctx.beginPath(); ctx.moveTo(dx - 1.5, dy + 2); ctx.lineTo(dx - 1.5, dy + 20); ctx.moveTo(dx + 14.5, dy + 2); ctx.lineTo(dx + 14.5, dy + 20); ctx.stroke();
    }
    ctx.restore();
    ctx.restore();
  }
  function dabbaScene(ctx, t, st, w) {
    var p = dabbaPlate(st); if (!p) return;
    ctx.drawImage(p, 222, 196, 96, 126);
    var T = t % 16, x, walk = true, wave = false;
    if (T < 3) { x = 270; walk = false; wave = T > 0.6; }
    else if (T < 9) x = 270 + (T - 3) / 6 * (w + 60 - 270);
    else if (T < 10) return;
    else x = -50 + (T - 10) / 6 * 320;
    dabbawala(ctx, x, 316, walk, wave, t);
  }
  ANIMS.csmt = {
    init: function (st) { st.birds = [[418, 306], [446, 308], [478, 306]]; },
    draw: function (ctx, t, st, w) {
      dabbaScene(ctx, t, st, w);
      /* smiling sun pulses its rays */
      ctx.save(); ctx.translate(404, 40); ctx.rotate(t * 0.4); ctx.strokeStyle = '#FF7AA2'; ctx.lineWidth = 3; ctx.lineCap = 'round';
      for (var r = 0; r < 10; r++) { var a = r / 10 * Math.PI * 2, L = 34 + 5 * Math.sin(t * 3 + r); ctx.beginPath(); ctx.moveTo(Math.cos(a) * 28, Math.sin(a) * 28); ctx.lineTo(Math.cos(a) * L, Math.sin(a) * L); ctx.stroke(); }
      ctx.restore();
      var T = t % 9;
      /* taxi zooms right in the near lane, bus rolls left in the same lane later */
      if (T < 4.5) { var p = T / 4.5; taxi(ctx, -150 + p * (w + 300), 397, 0.62, T * 14); bubble(ctx, -95 + p * (w + 300), 340, 'PAWP PAWP!', (T % 1.5) / 1.5, '#FFC93C'); }
      else { var q = (T - 4.5) / 4.5; bus(ctx, w + 30 - q * (w + 260), 396, 0.5, T * 10); }
      /* pigeons take off */
      var bp = Math.min(1, Math.max(0, (T - 1) / 3.5));
      st.birds.forEach(function (b, i) {
        var x = b[0] + bp * (60 + i * 30), y = b[1] - bp * (180 + i * 25), f = Math.sin(t * 18 + i) * 5;
        ctx.globalAlpha = bp > 0.85 ? (1 - bp) / 0.15 : (bp > 0 ? 1 : 0);
        ctx.strokeStyle = INK; ctx.lineWidth = 2.2; ctx.beginPath(); ctx.moveTo(x - 9, y - f); ctx.quadraticCurveTo(x - 4, y - 4, x, y); ctx.quadraticCurveTo(x + 4, y - 4, x + 9, y - f); ctx.stroke();
      });
      ctx.globalAlpha = 1;
    }
  };

  ANIMS.diwali = {
    init: function (st) { st.bursts = []; st.next = 0; st.flames = [[196, 336], [364, 336], [232, 358], [328, 358]]; },
    draw: function (ctx, t, st, w) {
      var cols = ['#FFD23F', '#FF7AA2', '#5CE1D8', '#FF9F1C', '#FFFFFF', '#B78CFF'];
      if (t > st.next) {
        var bx = rnd(50, w - 50), by = rnd(50, 150), c = cols[Math.floor(rnd(0, cols.length))], parts = [];
        for (var i = 0; i < 36; i++) { var a = i / 36 * Math.PI * 2, sp = rnd(50, 90); parts.push({ vx: Math.cos(a) * sp, vy: Math.sin(a) * sp }); }
        st.bursts.push({ x: bx, y: by, t0: t, c: c, parts: parts }); st.next = t + rnd(0.5, 0.9);
      }
      st.bursts = st.bursts.filter(function (b) { return t - b.t0 < 2.2; });
      st.bursts.forEach(function (b) {
        var dt = t - b.t0;
        if (dt < 0.45) {
          var ry = 397 - (397 - b.y) * (dt / 0.45);
          ctx.strokeStyle = 'rgba(255,230,160,0.9)'; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(b.x, ry + 18); ctx.lineTo(b.x, ry); ctx.stroke();
          return;
        }
        var e = dt - 0.45, a = Math.max(0, 1 - e / 1.7);
        ctx.fillStyle = b.c; ctx.globalAlpha = a;
        b.parts.forEach(function (p) {
          var x = b.x + p.vx * e, y = b.y + p.vy * e + 30 * e * e;
          ctx.beginPath(); ctx.arc(x, y, 2.2, 0, Math.PI * 2); ctx.fill();
          ctx.globalAlpha = a * 0.35; ctx.beginPath(); ctx.arc(x - p.vx * 0.04, y - p.vy * 0.04, 1.4, 0, Math.PI * 2); ctx.fill(); ctx.globalAlpha = a;
        });
        if (e < 0.15) { ctx.globalAlpha = 1 - e / 0.15; circle(ctx, b.x, b.y, 22 * (e / 0.15) + 4, '#FFF8E0'); }
        ctx.globalAlpha = 1;
      });
      /* diya flames wiggle */
      st.flames.forEach(function (f, i) {
        var s = 1 + 0.18 * Math.sin(t * 11 + i * 2), sw = Math.sin(t * 7 + i) * 2.2;
        var g = ctx.createRadialGradient(f[0], f[1], 0, f[0], f[1], 22); g.addColorStop(0, 'rgba(255,200,80,0.55)'); g.addColorStop(1, 'rgba(255,200,80,0)');
        ctx.fillStyle = g; ctx.beginPath(); ctx.arc(f[0], f[1], 22, 0, Math.PI * 2); ctx.fill();
        ctx.save(); ctx.translate(f[0], f[1] + 8); ctx.scale(s, s);
        ctx.beginPath(); ctx.moveTo(0, -20); ctx.bezierCurveTo(sw - 6, -10, -6, -2, 0, 0); ctx.bezierCurveTo(6, -2, sw + 6, -10, 0, -20); shape(ctx, '#FFD23F', 2);
        ctx.beginPath(); ctx.moveTo(0, -12); ctx.bezierCurveTo(sw - 2, -7, -2, -2, 0, -1); ctx.bezierCurveTo(2, -2, sw + 2, -7, 0, -12); shape(ctx, '#FF6B35');
        ctx.restore();
      });
      /* sparkler sparks */
      for (var k = 0; k < 10; k++) {
        var a2 = rnd(0, 6.28), l = rnd(6, 20);
        ctx.strokeStyle = k % 2 ? '#FFD23F' : '#FFFFFF'; ctx.lineWidth = 1.4; ctx.beginPath();
        ctx.moveTo(147 + Math.cos(a2) * 4, 246 + Math.sin(a2) * 4); ctx.lineTo(147 + Math.cos(a2) * l, 246 + Math.sin(a2) * l); ctx.stroke();
      }
    }
  };

  function reindeer(ctx, x, y, t, i, nose) {
    var g = Math.sin(t * 10 + i) * 6;
    ctx.save(); ctx.translate(x, y); ctx.strokeStyle = '#5A3A1E'; ctx.lineWidth = 2.6; ctx.lineCap = 'round';
    ctx.beginPath(); ctx.moveTo(-8, 4); ctx.lineTo(-12 - g * 0.6, 14); ctx.moveTo(8, 4); ctx.lineTo(12 + g * 0.6, 13); ctx.stroke();
    ctx.fillStyle = '#9A6436'; ctx.beginPath(); ctx.ellipse(0, 0, 14, 7, 0, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.moveTo(-10, -2); ctx.lineTo(-16, -10); ctx.lineWidth = 5; ctx.strokeStyle = '#9A6436'; ctx.stroke();
    circle(ctx, -18, -12, 5, '#9A6436');
    ctx.strokeStyle = '#5A3A1E'; ctx.lineWidth = 1.8; ctx.beginPath();
    ctx.moveTo(-17, -16); ctx.lineTo(-14, -26); ctx.lineTo(-10, -28); ctx.moveTo(-15, -22); ctx.lineTo(-20, -27); ctx.stroke();
    circle(ctx, -23, -11, nose ? 2.6 : 1.6, nose ? '#FF3B3B' : '#3A2410');
    ctx.restore();
  }
  function sleigh(ctx, x, y, t) {
    ctx.save(); ctx.translate(x, y);
    ctx.strokeStyle = '#E7C36A'; ctx.lineWidth = 2.4; ctx.beginPath(); ctx.moveTo(-26, 16); ctx.lineTo(26, 16); ctx.quadraticCurveTo(36, 16, 34, 6); ctx.moveTo(-26, 16); ctx.quadraticCurveTo(-34, 14, -30, 6); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(-24, 12); ctx.lineTo(24, 12); ctx.lineTo(30, -6); ctx.lineTo(10, -2); ctx.lineTo(-20, -2); ctx.closePath(); shape(ctx, '#D62828', 1.5);
    circle(ctx, 4, -12, 9, '#D62828'); circle(ctx, 4, -24, 6, '#F2C29B');
    ctx.fillStyle = '#FFFFFF'; ctx.beginPath(); ctx.ellipse(1, -19, 6, 5, 0, 0, Math.PI); ctx.fill();
    ctx.beginPath(); ctx.moveTo(-2, -28); ctx.lineTo(12, -30); ctx.lineTo(16, -36); ctx.closePath(); shape(ctx, '#D62828'); circle(ctx, 16, -37, 2.4, '#FFFFFF');
    ctx.fillStyle = '#7A4B2E'; rr(ctx, 14, -16, 12, 12, 3); ctx.fill();
    ctx.restore();
  }
  ANIMS.christmas = {
    init: function (st, w, h) { st.flakes = []; for (var i = 0; i < 110; i++) st.flakes.push({ x: rnd(0, w), y: rnd(-h, h), r: rnd(1, 3), s: rnd(18, 42), ph: rnd(0, 6.28) }); },
    draw: function (ctx, t, st, w, h, m) {
      var T = t % 11;
      /* Santa from top-right (outside the card) to the left, then gone */
      if (T > 2.5 && T < 9.5) {
        var p = (T - 2.5) / 7, x = w + m - 20 - p * (w + 2 * m + 60), y = -m + 70 + p * 130 + Math.sin(t * 3) * 5;
        ctx.globalAlpha = p > 0.85 ? (1 - p) / 0.15 : 1;
        for (var k = 0; k < 14; k++) star4(ctx, x + 40 + k * 9, y + 6 - k * 1.5 + Math.sin(t * 9 + k) * 2, 2 + (k % 3), '#FFE9A8', Math.max(0, 0.8 - k * 0.055));
        ctx.strokeStyle = '#C9A050'; ctx.lineWidth = 1.2; ctx.beginPath(); ctx.moveTo(x - 20, y); ctx.lineTo(x - 110, y + 2); ctx.stroke();
        sleigh(ctx, x, y, t); reindeer(ctx, x - 52, y + 2, t, 0); reindeer(ctx, x - 82, y, t, 1); reindeer(ctx, x - 112, y - 2, t, 2, true);
        ctx.globalAlpha = 1;
      }
      /* snow, kept inside the card */
      ctx.save(); ctx.beginPath(); ctx.rect(0, 0, w, h); ctx.clip();
      st.flakes.forEach(function (f) {
        var y = ((f.y + t * f.s) % (h + 20)) - 10; var x = f.x + Math.sin(t + f.ph) * 8;
        circle(ctx, x, y, f.r, 'rgba(255,255,255,0.92)');
      });
      ctx.restore();
      /* snowman winks twice */
      if ((T > 1.0 && T < 1.25) || (T > 1.6 && T < 1.85)) {
        circle(ctx, 222, 191, 4.6, '#FFFFFF');
        ctx.strokeStyle = '#111111'; ctx.lineWidth = 2.6; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(217.5, 191); ctx.quadraticCurveTo(222, 195, 226.5, 191); ctx.stroke();
      }
    }
  };

  ANIMS.newyear = {
    init: function (st, w) { st.conf = []; for (var i = 0; i < 70; i++) st.conf.push({ x: rnd(0, w), y: rnd(-400, 0), s: rnd(40, 90), r: rnd(0, 6), vr: rnd(-4, 4), c: ['#FFC93C', '#5CE1D8', '#FFF3DC', '#6A4C9C', '#E2502E'][i % 5] }); },
    draw: function (ctx, t, st, w, h) {
      var T = t % 7;
      st.conf.forEach(function (c) {
        var y = ((c.y + t * c.s) % (h + 420)) - 20;
        ctx.save(); ctx.translate(c.x + Math.sin(t * 2 + c.r) * 10, y); ctx.rotate(c.r + t * c.vr); ctx.fillStyle = c.c; ctx.fillRect(-4, -2, 8, 4); ctx.restore();
      });
      for (var k = 0; k < 3; k++) { var a = t * 4 + k * 2.09; star4(ctx, 92 + Math.cos(a) * 30, 252 + Math.sin(a) * 10, 6, '#FFD23F', 1); }
      if (T < 2.2) bubble(ctx, 78, 160, 'WHOOPS!', T / 2.2, '#FFF3DC');
      ctx.save(); ctx.translate(168, 344); ctx.rotate(Math.sin(t * 5) * 0.25); ctx.strokeStyle = '#FFF3DC'; ctx.lineWidth = 2.4; ctx.beginPath();
      ctx.moveTo(-34, -6); ctx.lineTo(-44, -14); ctx.moveTo(34, -6); ctx.lineTo(44, -14); ctx.stroke(); ctx.restore();
    }
  };

  ANIMS.sakura = {
    init: function (st, w, h) {
      st.petals = []; for (var i = 0; i < 55; i++) st.petals.push({ x: rnd(-20, w + 20), y: rnd(-h, h), s: rnd(14, 34), sz: rnd(0.7, 1.4), r: rnd(0, 6), vr: rnd(-2, 2), ph: rnd(0, 6), c: ['#FFC2DA', '#F7A8C8', '#FFD9E8', '#F27BAE'][i % 4] });
      st.next = 0.6; st.stars = [];
    },
    draw: function (ctx, t, st, w, h) {
      if (t > st.next) { st.stars.push({ x: rnd(w * 0.35, w), y: rnd(10, h * 0.3), t0: t, len: rnd(120, 200) }); st.next = t + rnd(1.8, 3.2); }
      st.stars = st.stars.filter(function (s) { return t - s.t0 < 1.1; });
      st.stars.forEach(function (s) { shootingStar(ctx, s.x, s.y, s.len, (t - s.t0) / 1.1); });
      ctx.save(); ctx.beginPath(); ctx.rect(0, 0, w, h); ctx.clip();
      st.petals.forEach(function (p) {
        var y = ((p.y + t * p.s) % (h + 30)) - 15; var x = p.x + Math.sin(t * 0.9 + p.ph) * 18 - (t * 6 % 40);
        petal(ctx, x, y, p.r + t * p.vr, p.sz, p.c);
      });
      ctx.restore();
    }
  };

  function sparkles(ctx, t, pts) { pts.forEach(function (s, i) { var a = Math.abs(Math.sin(t * 2 + i * 1.3)); star4(ctx, s[0], s[1], 4 + 5 * a, i % 2 ? '#FFFFFF' : '#FFE27A', 0.3 + 0.7 * a); }); }
  ANIMS.stickerMumbai = {
    init: function () {},
    draw: function (ctx, t) {
      sparkles(ctx, t, [[20, 40], [262, 30], [-20, 160], [300, 150], [40, 290], [250, 280], [142, -30]]);
      /* taxi speed lines + honk */
      ctx.strokeStyle = INK; ctx.lineWidth = 2.4; ctx.lineCap = 'round';
      for (var i = 0; i < 3; i++) { var o = (t * 60 + i * 14) % 42; ctx.globalAlpha = 1 - o / 42; ctx.beginPath(); ctx.moveTo(146 - o, 148 + i * 9); ctx.lineTo(128 - o, 148 + i * 9); ctx.stroke(); }
      ctx.globalAlpha = 1;
      var T = t % 3; if (T < 1.5) bubble(ctx, 236, 112, 'PAWP!', T / 1.5, '#FFC93C');
    }
  };
  ANIMS.stickerDesigner = {
    init: function () {},
    draw: function (ctx, t) {
      sparkles(ctx, t, [[24, 40], [262, 34], [-16, 150], [300, 140], [40, 286], [252, 282], [142, -28]]);
      /* pen-tool curve: handles swing, live curve follows */
      var a = Math.sin(t * 1.6) * 14, b = Math.cos(t * 1.3) * 14;
      var h1 = [92 + a, 48 - b * 0.6], h2 = [182 - b, 44 + a * 0.6];
      ctx.lineCap = 'round';
      ctx.strokeStyle = '#FFC93C'; ctx.lineWidth = 3; ctx.setLineDash([7, 6]); ctx.lineDashOffset = -t * 30;
      ctx.beginPath(); ctx.moveTo(58, 96); ctx.bezierCurveTo(h1[0], h1[1] + 30, h2[0], h2[1] + 40, 226, 70); ctx.stroke(); ctx.setLineDash([]);
      ctx.strokeStyle = '#5CE1D8'; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(58, 96); ctx.lineTo(h1[0], h1[1]); ctx.moveTo(226, 70); ctx.lineTo(h2[0], h2[1]); ctx.stroke();
      circle(ctx, h1[0], h1[1], 5, '#5CE1D8', 2); circle(ctx, h2[0], h2[1], 5, '#5CE1D8', 2);
      /* cursor clicks */
      var c = (t % 1.4) / 1.4; ctx.globalAlpha = 1 - c; ctx.strokeStyle = '#FFF3DC'; ctx.lineWidth = 2.5;
      ctx.beginPath(); ctx.arc(50, 178, 4 + c * 20, 0, Math.PI * 2); ctx.stroke(); ctx.globalAlpha = 1;
      /* pencil scribbles a squiggle */
      var p = (t % 2.5) / 2.5, n = Math.floor(p * 40);
      ctx.strokeStyle = '#FF7AA2'; ctx.lineWidth = 3; ctx.beginPath();
      for (var i = 0; i <= n; i++) { var x = 200 + i * 0.9, y = 224 + Math.sin(i * 0.6) * 5; if (i) ctx.lineTo(x, y); else ctx.moveTo(x, y); }
      ctx.globalAlpha = p > 0.85 ? (1 - p) / 0.15 : 1; ctx.stroke(); ctx.globalAlpha = 1;
      /* paint drops pop out of the swatches */
      ['#FF7AA2', '#FFC93C', '#5CE1D8', '#F47B54'].forEach(function (col, k) {
        var q = ((t * 0.7 + k * 0.25) % 1); ctx.globalAlpha = 1 - q;
        circle(ctx, 112 + k * 20 + Math.sin(q * 6 + k) * 6, 220 - q * 34, 3 + q * 3, col, 1.5);
      });
      ctx.globalAlpha = 1;
    }
  };
  ANIMS.winter = {
    init: function (st) { st.fl = []; for (var i = 0; i < 60; i++) st.fl.push([rnd(5, 554), rnd(0, 1), rnd(0.1, 0.22), rnd(0, 6.28), rnd(200, 330), rnd(4, 7)]); },
    draw: function (ctx, t, st, w) {
      var i, k;
      /* scorching sun: heat glow pulses, rays spin, sweat drips */
      glowDot(ctx, 492, 64, 120 + 10 * Math.sin(t * 2), '255,120,40', 0.35);
      ctx.save(); ctx.translate(492, 64); ctx.rotate(t * 0.5);
      for (i = 0; i < 12; i++) { var ra = i / 12 * Math.PI * 2, L = 66 + 8 * Math.sin(t * 4 + i); ctx.beginPath(); ctx.moveTo(Math.cos(ra - 0.05) * 58, Math.sin(ra - 0.05) * 58); ctx.lineTo(Math.cos(ra) * L, Math.sin(ra) * L); ctx.lineTo(Math.cos(ra + 0.05) * 58, Math.sin(ra + 0.05) * 58); ctx.closePath(); ctx.globalAlpha = 0.7; shape(ctx, '#FF6B2C', 0); }
      ctx.restore(); ctx.globalAlpha = 1;
      for (k = 0; k < 3; k++) { var q = ((t * 0.6 + k / 3) % 1), sx = [460, 526, 500][k], sy = 48 + q * 40; ctx.globalAlpha = 1 - q; ctx.beginPath(); ctx.moveTo(sx, sy - 5); ctx.quadraticCurveTo(sx + 4, sy + 1, sx, sy + 3); ctx.quadraticCurveTo(sx - 4, sy + 1, sx, sy - 5); shape(ctx, '#7FD3F0', 1.4); }
      ctx.globalAlpha = 1;
      /* heat waves rising off the road and from under the sun */
      ctx.strokeStyle = 'rgba(255,107,44,0.75)'; ctx.lineWidth = 2.4; ctx.lineCap = 'round';
      [[440, 140], [470, 150], [520, 146], [60, 340], [330, 342], [520, 344]].forEach(function (h, n) {
        var p = ((t * 0.5 + n * 0.17) % 1), y0 = h[1] - p * 40; ctx.globalAlpha = Math.sin(p * Math.PI);
        ctx.beginPath(); ctx.moveTo(h[0], y0); for (var s = 1; s <= 4; s++) ctx.quadraticCurveTo(h[0] + (s % 2 ? 6 : -6), y0 - s * 6 + 3, h[0], y0 - s * 6); ctx.stroke();
      });
      ctx.globalAlpha = 1;
      /* lots of snow... melting into drops on the way down */
      st.fl.forEach(function (f) {
        var p = (f[1] + t * f[2]) % 1, y = -10 + p * 340, x = f[0] + Math.sin(t * 1.5 + f[3]) * 8, melt = Math.max(0, Math.min(1, (y - (f[4] - 40)) / 40));
        if (y > f[4] + 14) return;
        if (melt < 0.6) { ctx.globalAlpha = 1 - melt; star4(ctx, x, y, f[5], '#FFFFFF', 1); }
        else { ctx.globalAlpha = 1 - (melt - 0.6) / 0.4 * 0.7; ctx.beginPath(); ctx.moveTo(x, y - 5); ctx.quadraticCurveTo(x + 4, y + 1, x, y + 3); ctx.quadraticCurveTo(x - 4, y + 1, x, y - 5); shape(ctx, '#7FD3F0', 1.4); }
      });
      ctx.globalAlpha = 1;
      /* shivering: the man and the cat */
      var j = Math.sin(t * 40) * 1.6;
      ctx.strokeStyle = INK; ctx.lineWidth = 2.2;
      [[194 + j, 196, -1], [280 - j, 196, 1], [114 + j, 214, -1], [182 - j, 212, 1]].forEach(function (s) {
        ctx.beginPath(); ctx.moveTo(s[0], s[1]); ctx.quadraticCurveTo(s[0] + 6 * s[2], s[1] + 6, s[0], s[1] + 12); ctx.quadraticCurveTo(s[0] - 6 * s[2], s[1] + 18, s[0], s[1] + 24); ctx.stroke();
      });
      /* chai steam: his glass, the kettle, the tapri glasses */
      [[238, 252], [458, 244], [480, 254], [512, 254]].forEach(function (c0, n) {
        for (var c = 0; c < 3; c++) { var r = ((t * 0.5 + c / 3 + n * 0.21) % 1), y0 = c0[1] - r * 28; ctx.globalAlpha = (1 - r) * 0.9; ctx.strokeStyle = '#FFFFFF'; ctx.lineWidth = 2.4; ctx.beginPath(); ctx.moveTo(c0[0] + Math.sin(t * 3 + c) * 3, y0); ctx.quadraticCurveTo(c0[0] + 6 * Math.sin(t * 2 + c + 1), y0 - 6, c0[0], y0 - 12); ctx.stroke(); }
      });
      ctx.globalAlpha = 1;
      /* brrr / meowrrr */
      var T = t % 5;
      if (T < 1.6) bubble(ctx, 180, 290, 'brrr...', T / 1.6, '#BDE4F4');
      else if (T > 2.5 && T < 4.1) bubble(ctx, 100, 180, 'meowrrr...', (T - 2.5) / 1.6, '#FFC2DA');
    }
  };
  /* Hindi CSMT card: same scene, but taxi and bus pass BEHIND the Hindi label */
  ANIMS.csmtHindi = {
    init: function (st) { ANIMS.csmt.init(st); },
    draw: function (ctx, t, st, w, h, m) {
      ANIMS.csmt.draw(ctx, t, st, w, h, m);
      if (!st.fg) { st.fg = new Image(); st.fg.onerror = function () { st.fg.src = 'targets-images/csmt-hindi.png'; }; st.fg.src = 'targets/csmt-hindi.png'; }
      if (st.fg.complete && st.fg.naturalWidth) { var k = st.fg.naturalWidth / w; ctx.drawImage(st.fg, 170 * k, 318 * k, 194 * k, 79 * k, 170, 318, 194, 79); }
    }
  };
  ANIMS.bmMoon = {
    init: function (st, w, h) { st.tw = []; while (st.tw.length < 22) { var sx = rnd(8, w - 8), sy = rnd(8, 280); if (Math.hypot(sx - 92, sy - 140) > 62) st.tw.push([sx, sy, rnd(0, 6.28), rnd(1, 2.6)]); } st.next = 0.8; st.stars = []; },
    draw: function (ctx, t, st, w, h) {
      glowDot(ctx, 92, 140, 95 + 6 * Math.sin(t * 1.2), '200,220,255', 0.25);
      st.tw.forEach(function (s) { var a = Math.abs(Math.sin(t * s[3] + s[2])); star4(ctx, s[0], s[1], 2 + 4 * a, '#FFFFFF', 0.2 + 0.8 * a); });
      if (t > st.next) { st.stars.push({ x: rnd(w * 0.5, w + 20), y: rnd(10, 120), t0: t, len: rnd(90, 140) }); st.next = t + rnd(2.2, 3.6); }
      st.stars = st.stars.filter(function (s) { return t - s.t0 < 1.1; });
      st.stars.forEach(function (s) { shootingStar(ctx, s.x, s.y, s.len, (t - s.t0) / 1.1); });
    }
  };
  /* Night-village bookmark: clouds drift, grass sways, kids walk up the path, fire + lamps flicker */
  var VPATH = [[68.2, 74.9, 71.5, 232.1], [70.3, 78.1, 74.2, 242.7], [72.5, 81.6, 77.0, 253.3], [74.8, 85.3, 80.1, 263.9], [77.3, 89.1, 83.2, 274.5], [79.7, 93.1, 86.4, 285.0], [82.2, 97.1, 89.6, 295.6], [84.6, 101.1, 92.8, 306.2], [86.9, 105.1, 96.0, 316.8], [89.0, 108.9, 99.0, 327.4], [91.0, 112.6, 101.8, 338.0], [92.7, 116.2, 104.4, 348.6], [94.2, 119.4, 106.8, 359.2], [95.3, 122.4, 108.9, 369.7], [96.1, 125.2, 110.6, 380.3], [96.6, 127.5, 112.1, 390.9], [96.7, 129.6, 113.1, 401.5], [96.4, 131.2, 113.8, 412.1], [95.7, 132.6, 114.1, 422.7], [94.6, 133.5, 114.1, 433.3], [93.2, 134.1, 113.6, 443.8], [91.3, 134.3, 112.8, 454.4], [89.1, 134.2, 111.6, 465.0], [86.5, 133.8, 110.2, 475.6], [83.7, 133.0, 108.4, 486.2], [80.6, 132.1, 106.3, 496.8], [77.2, 130.9, 104.0, 507.4], [73.6, 129.5, 101.6, 517.9], [69.9, 128.0, 99.0, 528.5], [66.1, 126.5, 96.3, 539.1], [62.3, 124.9, 93.6, 549.7], [58.4, 123.3, 90.8, 560.3], [54.6, 121.8, 88.2, 570.9], [50.8, 120.3, 85.6, 581.5]];
  function vPath(y) { for (var i = 1; i < VPATH.length; i++) if (VPATH[i][3] >= y) { var a = VPATH[i - 1], b = VPATH[i], k = (y - a[3]) / (b[3] - a[3]); return [a[0] + (b[0] - a[0]) * k, a[1] + (b[1] - a[1]) * k, a[2] + (b[2] - a[2]) * k]; } var l = VPATH[VPATH.length - 1]; return [l[0], l[1], l[2]]; }
  function kid(ctx, x, y, s, col, t, ph) {
    var sw = Math.sin(t * 9 + ph) * 1.6 * s;
    ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
    ctx.fillStyle = 'rgba(20,20,40,0.35)'; ctx.beginPath(); ctx.ellipse(0.5, 0.3, 3.6, 1.1, 0, 0, 6.28); ctx.fill();
    ctx.strokeStyle = '#2A1E18'; ctx.lineWidth = 1.2; ctx.lineCap = 'round';
    ctx.beginPath(); ctx.moveTo(-1, -4); ctx.lineTo(-1.6 + sw * 0.5, 0); ctx.moveTo(1, -4); ctx.lineTo(1.6 - sw * 0.5, 0); ctx.stroke();
    ctx.fillStyle = col; rr(ctx, -2.5, -10.5, 5, 7, 1.2); ctx.fill();
    ctx.strokeStyle = '#7A4C34'; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(-2.4, -9); ctx.lineTo(-3.2 - sw * 0.4, -5.5); ctx.moveTo(2.4, -9); ctx.lineTo(3.2 + sw * 0.4, -5.5); ctx.stroke();
    ctx.fillStyle = '#7A4C34'; ctx.beginPath(); ctx.arc(0, -12.6, 2.1, 0, 6.28); ctx.fill();
    ctx.fillStyle = '#1A1212'; ctx.beginPath(); ctx.arc(0, -13, 2.1, Math.PI, 0); ctx.fill();
    ctx.restore();
  }
  ANIMS.bmVillage = {
    init: function (st, w, h) {
      st.blades = []; for (var i = 0; i < 160; i++) { var y = rnd(290, 565), p = vPath(y); st.blades.push([rnd(-4, p[0] - 2), y, rnd(0, 6.28), 2 + (y - 230) * 0.05, ['#6CC24A', '#4FA43A', '#8AD866'][i % 3]]); }
      st.ff = []; for (var j = 0; j < 22; j++) st.ff.push([rnd(0, w), rnd(230, 540), rnd(0, 6.28)]);
      st.plate = new Image(); st.plate.src = 'assets/village-plate.png';
    },
    draw: function (ctx, t, st, w, h) {
      /* moon glow + drifting clouds */
      glowDot(ctx, 147, 48, 46 + 4 * Math.sin(t * 1.3), '220,232,255', 0.35);
      ctx.save(); ctx.beginPath(); ctx.rect(0, 0, w, h); ctx.clip();
      for (var c = 0; c < 3; c++) {
        var cx = ((t * (5 + c * 2) + c * 90) % (w + 120)) - 60, cy = 100 + c * 22;
        ctx.globalAlpha = 0.28; ctx.fillStyle = '#9FB4D8';
        ctx.beginPath(); ctx.ellipse(cx, cy, 34, 7, 0, 0, 6.28); ctx.ellipse(cx + 14, cy - 5, 18, 7, 0, 0, 6.28); ctx.ellipse(cx - 16, cy - 3, 14, 6, 0, 0, 6.28); ctx.fill();
      }
      ctx.restore(); ctx.globalAlpha = 1;
      /* grass sways in the breeze */
      ctx.lineCap = 'round';
      st.blades.forEach(function (b) { var sw = Math.sin(t * 1.8 + b[2] + b[0] * 0.05) * b[3] * 0.45; ctx.strokeStyle = b[4]; ctx.globalAlpha = 0.85; ctx.lineWidth = 0.6 + b[3] * 0.08; ctx.beginPath(); ctx.moveTo(b[0], b[1]); ctx.quadraticCurveTo(b[0] + sw * 0.3, b[1] - b[3] * 0.6, b[0] + sw, b[1] - b[3]); ctx.stroke(); });
      ctx.globalAlpha = 1;
      /* lamps + fire flicker */
      [[127, 230], [167, 252], [180, 304], [189, 412], [130, 408]].forEach(function (l, i) { glowDot(ctx, l[0], l[1], 16 + 3 * Math.sin(t * 7 + i * 2), '255,170,70', 0.28 + 0.12 * Math.sin(t * 11 + i)); });
      glowDot(ctx, 147, 340, 34 + 6 * Math.sin(t * 9), '255,140,50', 0.45 + 0.15 * Math.sin(t * 13));
      for (var f = 0; f < 3; f++) { var fh = 9 + 4 * Math.sin(t * 12 + f * 2); ctx.fillStyle = f === 2 ? '#FFF1B0' : (f ? '#FFB840' : '#FF7A2A'); ctx.beginPath(); var fx = 144 + f * 2.5; ctx.moveTo(fx - 3, 341); ctx.quadraticCurveTo(fx - 3 + Math.sin(t * 10 + f) * 2, 341 - fh * 0.6, fx + Math.sin(t * 14 + f) * 1.5, 341 - fh); ctx.quadraticCurveTo(fx + 3, 341 - fh * 0.5, fx + 3, 341); ctx.fill(); }
      for (var s = 0; s < 6; s++) { var q = ((t * 0.7 + s / 6) % 1); ctx.globalAlpha = 1 - q; ctx.fillStyle = '#FFD070'; ctx.fillRect(146 + Math.sin(t * 3 + s * 2) * 6, 336 - q * 40, 1.2, 1.2); }
      ctx.globalAlpha = 1;
      /* children walk up the path towards the huts */
      if (st.plate.complete && st.plate.naturalWidth) {
        ctx.drawImage(st.plate, 60, 440, 90, 86);
        var cols = ['#E8467C', '#FFC93C', '#18A6A0', '#F47B54'];
        for (var k = 0; k < 4; k++) {
          var p = ((t / 16) + k * 0.035) % 1, y = 525 - p * 230, pp = vPath(y), s2 = 0.45 + (y - 290) / 235 * 0.85;
          var x = pp[2] + (k - 1.5) * 5 * s2;
          ctx.globalAlpha = p > 0.9 ? (1 - p) / 0.1 : (p < 0.04 ? p / 0.04 : 1);
          kid(ctx, x, y + (k % 2) * 4 * s2, Math.max(0.35, s2), cols[k], t, k);
        }
        var dp = ((t / 16) + 0.16) % 1, dy = 525 - dp * 230, dpp = vPath(dy), ds = Math.max(0.35, 0.45 + (dy - 290) / 235 * 0.85);
        ctx.globalAlpha = dp > 0.9 ? (1 - dp) / 0.1 : (dp < 0.04 ? dp / 0.04 : 1);
        ctx.fillStyle = '#D8B080'; ctx.beginPath(); ctx.ellipse(dpp[2] - 14 * ds, dy - 3 * ds, 4.5 * ds, 2.6 * ds, 0, 0, 6.28); ctx.ellipse(dpp[2] - 10 * ds, dy - 6 * ds + Math.abs(Math.sin(t * 12)) * -1.5 * ds, 2.6 * ds, 2.2 * ds, 0, 0, 6.28); ctx.fill();
        ctx.globalAlpha = 1;
      }
      /* fireflies */
      st.ff.forEach(function (f) { var a = 0.4 + 0.6 * Math.abs(Math.sin(t * 2 + f[2])); glowDot(ctx, f[0] + Math.sin(t * 0.7 + f[2]) * 8, f[1] + Math.cos(t * 0.5 + f[2]) * 6, 4, '255,240,150', 0.6 * a); });
    }
  };
  /* ---- layered scenes: a clean plate + sprites that move ---- */
  var IMGS = {};
  function img(src) { var im = IMGS[src]; if (!im) { im = IMGS[src] = new Image(); im.src = src; } return im.complete && im.naturalWidth ? im : null; }
  function spr(ctx, src, m, dx, dy, rot, sx, sy, ox, oy) {
    var im = img(src); if (!im) return;
    ctx.save(); var px = m[0] + (ox === undefined ? m[2] / 2 : ox), py = m[1] + (oy === undefined ? m[3] : oy);
    ctx.translate(px + (dx || 0), py + (dy || 0)); ctx.rotate(rot || 0); ctx.scale(sx || 1, sy || 1);
    ctx.drawImage(im, m[0] - px, m[1] - py, m[2], m[3]); ctx.restore();
  }
  var VLM = {"train": [186.0, 123.0, 200.0, 42.5], "kid": [206.5, 417.0, 35.0, 50.5], "hoop": [184.0, 443.5, 24.5, 26.5], "hen1": [249.0, 472.0, 27.0, 24.0], "hen2": [287.0, 498.0, 27.0, 24.0], "chicks": [267.0, 523.0, 21.0, 16.0]};
  ANIMS.village = {
    plate: true,
    init: function (st, w, h) { st.tw = []; for (var i = 0; i < 40; i++) st.tw.push([rnd(0, w), rnd(0, 140), rnd(0, 6.28), rnd(1, 3)]); st.next = 1; st.stars = []; st.ff = []; for (var j = 0; j < 18; j++) st.ff.push([rnd(0, w), rnd(200, 540), rnd(0, 6.28)]); },
    draw: function (ctx, t, st, w, h) {
      var plate = img('assets/vlife-plate.jpg'); if (!plate) return;
      ctx.drawImage(plate, 0, 0, w, h);
      /* sky: twinkles, shooting star, moon glow */
      glowDot(ctx, 335, 58, 50 + 5 * Math.sin(t * 1.2), '230,236,255', 0.3);
      st.tw.forEach(function (s) { var a = Math.abs(Math.sin(t * s[3] + s[2])); star4(ctx, s[0], s[1], 1.5 + 3 * a, '#FFFFFF', 0.15 + 0.85 * a); });
      if (t > st.next) { st.stars.push({ x: rnd(w * 0.4, w), y: rnd(10, 70), t0: t, len: rnd(80, 130) }); st.next = t + rnd(3, 5); }
      st.stars = st.stars.filter(function (s) { return t - s.t0 < 1.1; }); st.stars.forEach(function (s) { shootingStar(ctx, s.x, s.y, s.len, (t - s.t0) / 1.1); });
      /* the night train crosses the fields */
      var tp = (t % 22) / 22, tx = -420 + tp * 640;
      ctx.save(); ctx.beginPath(); ctx.rect(60, 100, w - 60, 70); ctx.clip();
      spr(ctx, 'assets/vl-train.png', VLM.train, tx, 0);
      for (var k = 0; k < 4; k++) { var q = ((t * 0.8 + k / 4) % 1); ctx.globalAlpha = (1 - q) * 0.7; ctx.fillStyle = '#E6EAF5'; ctx.beginPath(); ctx.arc(VLM.train[0] + 24 + tx + q * 20, 140 - q * 26, 3 + q * 7, 0, 6.28); ctx.fill(); }
      ctx.restore(); ctx.globalAlpha = 1;
      /* warm lights flicker: windows, wall lamp, dinner lamp, chulha, diyas */
      [[180, 284, 34], [288, 284, 34], [256, 268, 22], [150, 388, 20], [28, 462, 30]].forEach(function (l, i) { glowDot(ctx, l[0], l[1], l[2] + 3 * Math.sin(t * 6 + i), '255,170,70', 0.22 + 0.12 * Math.sin(t * 9 + i * 2)); });
      for (var f = 0; f < 3; f++) { var fh = 11 + 5 * Math.sin(t * 12 + f * 2); ctx.fillStyle = f === 2 ? '#FFF1B0' : (f ? '#FFB840' : '#FF7A2A'); ctx.beginPath(); var fx = 25 + f * 2.5; ctx.moveTo(fx - 4, 474); ctx.quadraticCurveTo(fx - 4 + Math.sin(t * 10 + f) * 2, 474 - fh * 0.6, fx + Math.sin(t * 14 + f) * 1.5, 474 - fh); ctx.quadraticCurveTo(fx + 4, 474 - fh * 0.5, fx + 4, 474); ctx.fill(); }
      for (var sm = 0; sm < 4; sm++) { var q2 = ((t * 0.35 + sm / 4) % 1); ctx.globalAlpha = (1 - q2) * 0.35; ctx.fillStyle = '#D8DCE6'; ctx.beginPath(); ctx.arc(30 + Math.sin(t + sm) * 6 + q2 * 10, 444 - q2 * 60, 4 + q2 * 10, 0, 6.28); ctx.fill(); }
      ctx.globalAlpha = 1;
      for (var dy = 0; dy < 6; dy++) { var a = dy / 6 * Math.PI * 2 + 0.3, x = 126 + Math.cos(a) * 38, y = 505 + Math.sin(a) * 17 - 2; glowDot(ctx, x, y, 7 + 2 * Math.sin(t * 10 + dy), '255,200,90', 0.55 + 0.3 * Math.sin(t * 13 + dy)); ctx.fillStyle = '#FFF1B0'; ctx.beginPath(); ctx.ellipse(x, y - 1, 1.2, 2.2 + 0.6 * Math.sin(t * 15 + dy), 0, 0, 6.28); ctx.fill(); }
      /* boy runs back and forth rolling his hoop */
      var run = Math.sin(t * 0.55), dir = Math.cos(t * 0.55) >= 0 ? 1 : -1, kx = run * 70, bob = -Math.abs(Math.sin(t * 9)) * 2.5;
      var hoopX = kx + (dir > 0 ? 58 : 0);
      spr(ctx, 'assets/vl-hoop.png', VLM.hoop, hoopX, 0, t * 4 * dir, 1, 1, VLM.hoop[2] / 2, VLM.hoop[3] / 2 + 2);
      spr(ctx, 'assets/vl-kid.png', VLM.kid, kx, bob, Math.sin(t * 9) * 0.05, dir > 0 ? -1 : 1, 1);
      /* hens peck, chicks hop */
      spr(ctx, 'assets/vl-hen1.png', VLM.hen1, Math.sin(t * 0.4) * 10, 0, Math.max(0, Math.sin(t * 3)) * 0.35, 1, 1, VLM.hen1[2] * 0.7, VLM.hen1[3]);
      spr(ctx, 'assets/vl-hen2.png', VLM.hen2, Math.cos(t * 0.3) * 8, 0, Math.max(0, Math.sin(t * 2.4 + 1)) * 0.35, 1, 1, VLM.hen2[2] * 0.7, VLM.hen2[3]);
      spr(ctx, 'assets/vl-chicks.png', VLM.chicks, Math.sin(t * 0.8) * 6, -Math.abs(Math.sin(t * 6)) * 2.5);
      /* fireflies */
      st.ff.forEach(function (f) { var a = 0.4 + 0.6 * Math.abs(Math.sin(t * 2 + f[2])); glowDot(ctx, f[0] + Math.sin(t * 0.7 + f[2]) * 10, f[1] + Math.cos(t * 0.5 + f[2]) * 8, 5, '255,240,150', 0.55 * a); });
    }
  };
  var MSM = {"bolt": [30.5, 0.0, 239.0, 207.5], "marm": [185.5, 371.5, 32.5, 22.5], "kh0": [308.0, 409.0, 8.0, 13.5], "kh1": [336.0, 413.0, 8.0, 13.5], "kh2": [364.0, 409.0, 8.0, 13.5], "dogtail": [264.0, 502.0, 18.0, 16.0]};
  var STREAM = [[8, 300], [40, 312], [72, 340], [96, 380], [104, 414], [86, 452], [82, 492], [100, 528], [116, 562]];
  ANIMS.monsoon = {
    plate: true,
    init: function (st, w, h) {
      st.drops = []; for (var i = 0; i < 170; i++) st.drops.push([rnd(-40, w + 40), rnd(0, h), rnd(300, 420), rnd(10, 18)]);
      st.spl = []; st.lastFlash = -1;
    },
    draw: function (ctx, t, st, w, h) {
      var plate = img('assets/monsoon-plate.jpg'); if (!plate) return;
      ctx.drawImage(plate, 0, 0, w, h);
      /* lightning every ~8 s: two flashes, thunder follows */
      var cyc = Math.floor(t / 8), T = t % 8, flash = (T > 1 && T < 1.12) ? 1 : (T > 1.22 && T < 1.4 ? 0.7 : 0);
      if (flash) {
        ctx.fillStyle = 'rgba(214,204,255,' + (0.35 * flash) + ')'; ctx.fillRect(0, 0, w, 290);
        spr(ctx, 'assets/ms-bolt.png', MSM.bolt, 0, 0);
        ctx.fillStyle = 'rgba(214,204,255,' + (0.12 * flash) + ')'; ctx.fillRect(0, 290, w, h - 290);
      }
      if (T > 1.5 && st.lastFlash !== cyc) { st.lastFlash = cyc; if (window.DPSound) window.DPSound.thunder(0.7 + Math.random() * 0.3); }
      /* TV flickers */
      var tvc = ['#6FC8E8', '#8FE0F8', '#5FA8D8', '#A8E8FF'][Math.floor(t * 6) % 4];
      ctx.fillStyle = tvc; ctx.fillRect(262, 326, 32, 25);
      ctx.fillStyle = 'rgba(255,255,255,0.35)'; for (var l = 0; l < 5; l++) ctx.fillRect(262, 326 + ((t * 40 + l * 5) % 25), 32, 0.8);
      ctx.fillStyle = 'rgba(40,60,90,0.5)'; ctx.beginPath(); ctx.arc(278 + Math.sin(t * 2) * 6, 340, 4, 0, 6.28); ctx.fill(); ctx.fillRect(272 + Math.sin(t * 2) * 6, 343, 12, 6);
      glowDot(ctx, 278, 338, 34, '150,220,255', 0.18 + 0.1 * Math.sin(t * 17));
      /* lantern + chulha fire */
      glowDot(ctx, 200, 286, 26 + 3 * Math.sin(t * 7), '255,180,80', 0.3 + 0.1 * Math.sin(t * 11));
      glowDot(ctx, 182, 404, 26 + 4 * Math.sin(t * 9), '255,140,50', 0.4 + 0.15 * Math.sin(t * 13));
      for (var f = 0; f < 3; f++) { var fh = 10 + 4 * Math.sin(t * 12 + f * 2); ctx.fillStyle = f === 2 ? '#FFF1B0' : (f ? '#FFB840' : '#FF7A2A'); ctx.beginPath(); var fx = 179 + f * 2.5; ctx.moveTo(fx - 4, 412); ctx.quadraticCurveTo(fx - 4 + Math.sin(t * 10 + f) * 2, 412 - fh * 0.6, fx + Math.sin(t * 14 + f) * 1.5, 412 - fh); ctx.quadraticCurveTo(fx + 4, 412 - fh * 0.5, fx + 4, 412); ctx.fill(); }
      /* steam curling up from the pot */
      for (var s = 0; s < 6; s++) { var q = ((t * 0.3 + s / 6) % 1); ctx.globalAlpha = (1 - q) * 0.45; ctx.fillStyle = '#F2F2F6'; ctx.beginPath(); ctx.arc(182 + Math.sin(t * 1.5 + s * 1.7 + q * 4) * (4 + q * 14), 376 - q * 90, 3 + q * 9, 0, 6.28); ctx.fill(); }
      ctx.globalAlpha = 1;
      /* mother stirs, kids nod while they eat, dog wags */
      spr(ctx, 'assets/ms-marm.png', MSM.marm, 0, 0, Math.sin(t * 3) * 0.22, 1, 1, 216 - MSM.marm[0], 392 - MSM.marm[1]);
      ['kh0', 'kh1', 'kh2'].forEach(function (k, i) { var nod = Math.sin(t * 2.4 + i * 1.3); spr(ctx, 'assets/ms-' + k + '.png', MSM[k], 0, Math.max(0, nod) * 0.8, nod * 0.2); });
      spr(ctx, 'assets/ms-dogtail.png', MSM.dogtail, 0, 0, Math.sin(t * 9) * 0.45, 1, 1, 2, 14);
      /* water: spout from the roof, the stream flows, puddles ripple */
      ctx.strokeStyle = 'rgba(210,225,250,0.75)'; ctx.lineWidth = 2; ctx.setLineDash([6, 5]); ctx.lineDashOffset = -t * 120;
      ctx.beginPath(); ctx.moveTo(138, 260); ctx.quadraticCurveTo(140, 330, 138, 440); ctx.stroke(); ctx.setLineDash([]);
      for (var k2 = 0; k2 < 14; k2++) { var p = ((t * 0.18 + k2 / 14) % 1), n = p * (STREAM.length - 1), j = Math.floor(n), fr = n - j, a = STREAM[j], b = STREAM[Math.min(j + 1, STREAM.length - 1)];
        var x = a[0] + (b[0] - a[0]) * fr + ((k2 % 3) - 1) * 12, y = a[1] + (b[1] - a[1]) * fr; ctx.globalAlpha = Math.sin(p * Math.PI) * 0.8; ctx.strokeStyle = '#DCE6F8'; ctx.lineWidth = 1.2; ctx.beginPath(); ctx.moveTo(x - 6, y); ctx.quadraticCurveTo(x, y - 2, x + 6, y); ctx.stroke(); }
      ctx.globalAlpha = 1;
      [[200, 480, 26], [320, 500, 30], [250, 540, 40], [170, 530, 16], [138, 446, 12]].forEach(function (pd, i) { for (var r = 0; r < 2; r++) { var q3 = ((t * 0.9 + r * 0.5 + i * 0.23) % 1); ctx.globalAlpha = (1 - q3) * 0.6; ctx.strokeStyle = '#DCE6F8'; ctx.lineWidth = 0.8; ctx.beginPath(); ctx.ellipse(pd[0] + Math.sin(i * 7 + r) * pd[2] * 0.4, pd[1], 2 + q3 * 10, 0.6 + q3 * 2.5, 0, 0, 6.28); ctx.stroke(); } });
      ctx.globalAlpha = 1;
      /* heavy rain, slanted by the wind (not inside the house) */
      ctx.strokeStyle = 'rgba(205,214,245,0.55)'; ctx.lineWidth = 1; ctx.beginPath();
      st.drops.forEach(function (d) { var y = (d[1] + t * d[2]) % (h + 40) - 20, x = d[0] - (y * 0.28); if (x > 128 && y > 256 && y < 446) return; ctx.moveTo(x, y); ctx.lineTo(x - d[3] * 0.28, y + d[3]); });
      ctx.stroke();
      for (var sp = 0; sp < 10; sp++) { var q4 = ((t * 1.7 + sp * 0.13) % 1), sx = (sp * 97 + Math.floor(t * 1.7 + sp * 0.13) * 53) % w, sy = 460 + (sp * 37) % 95; if (sx > 120 && sy < 446) continue; ctx.globalAlpha = 1 - q4; ctx.strokeStyle = '#DCE6F8'; ctx.beginPath(); ctx.arc(sx, sy, 1 + q4 * 3, Math.PI, 0); ctx.stroke(); }
      ctx.globalAlpha = 1;
    }
  };
  /* ---- painted night-village scenes (2 postcards + 2 bookmarks) ---- */
  var NV = {"NA_card": {"plate": "assets/na_card-plate.jpg", "sp": [{"src": "assets/na_card-clouds.png", "m": [19.0, 172.5, 332.5, 60.5], "k": "cloud"}, {"src": "assets/na_card-train.png", "m": [30.0, 247.0, 258.0, 9.5], "k": "train"}, {"src": "assets/na_card-palmR.png", "m": [326.0, 257.0, 60.5, 36.5], "k": "palm"}, {"src": "assets/na_card-treeL.png", "m": [0.0, 0.0, 113.0, 98.5], "k": "tree"}], "lamps": [[115, 336, 13.0], [162, 410, 30.0], [100, 397, 15.0], [240, 397, 15.0], [296, 392, 13.0], [96, 452, 23.0], [300, 458, 23.0]], "moon": [318, 62], "ff": [0, 260, 397, 545], "grass": [0, 430, 397, 559], "band": [0, 236, 397, 262]}, "NB_card": {"plate": "assets/nb_card-plate.jpg", "sp": [{"src": "assets/nb_card-clouds.png", "m": [0.0, 136.0, 397.0, 132.5], "k": "cloud"}, {"src": "assets/nb_card-train.png", "m": [160.0, 302.0, 232.0, 9.0], "k": "train"}, {"src": "assets/nb_card-palmL.png", "m": [0.0, 272.0, 72.0, 50.5], "k": "palm"}, {"src": "assets/nb_card-cow.png", "m": [292.5, 516.0, 62.5, 33.5], "k": "cow"}], "lamps": [[67.5, 416.9, 30.0], [135.1, 408.6, 14.4], [215.2, 407.2, 13.2], [95.1, 394.8, 24.0], [338.0, 444.5, 27.6]], "moon": [300, 84], "ff": [0, 310, 397, 550], "grass": [0, 500, 397, 559], "band": [0, 292, 397, 316]}, "NA_bm": {"plate": "assets/na_bm-plate.jpg", "sp": [{"src": "assets/na_bm-clouds.png", "m": [0.0, 180.5, 181.5, 118.0], "k": "cloud"}, {"src": "assets/na_bm-train.png", "m": [0.0, 319.0, 173.0, 9.0], "k": "train"}, {"src": "assets/na_bm-palmR.png", "m": [115.0, 339.5, 50.0, 30.0], "k": "palm"}, {"src": "assets/na_bm-treeL.png", "m": [0.0, 0.0, 77.0, 87.0], "k": "tree"}], "lamps": [[40.5, 411.2, 9.1], [73.4, 463.0, 21.0], [30.0, 453.9, 10.5], [128.0, 453.9, 10.5], [167.2, 450.4, 9.1], [27.2, 492.4, 16.1], [170.0, 496.6, 16.1]], "moon": [132, 96], "ff": [0, 330, 189, 560], "grass": [0, 470, 189, 567], "band": [0, 308, 189, 334]}, "NB_bm": {"plate": "assets/nb_bm-plate.jpg", "sp": [{"src": "assets/nb_bm-clouds.png", "m": [0.0, 170.5, 189.0, 125.5], "k": "cloud"}, {"src": "assets/nb_bm-train.png", "m": [10.0, 341.0, 163.0, 9.0], "k": "train"}, {"src": "assets/nb_bm-palmL.png", "m": [133.5, 287.5, 55.5, 35.0], "k": "palm"}], "lamps": [[59.8, 469.2, 25.0], [106.3, 463.5, 12.0], [161.4, 462.5, 11.0], [78.8, 454.0, 20.0], [246.0, 488.2, 23.0]], "moon": [130, 90], "ff": [0, 350, 189, 560], "grass": [0, 500, 189, 567], "band": [0, 332, 189, 356]}};
  ANIMS.nv = {
    plate: true,
    init: function (st, w, h) {},
    draw: function (ctx, t, st, w, h, m, T) {
      var c = NV[T.cfg]; if (!c) return;
      var plate = img(c.plate); if (!plate) return;
      ctx.save(); ctx.beginPath(); ctx.rect(0, 0, w, h); ctx.clip();
      ctx.drawImage(plate, 0, 0, w, h);
      if (!st.ff) {
        st.ff = []; for (var i = 0; i < 28; i++) st.ff.push({ x: rnd(c.ff[0], c.ff[2]), y: rnd(c.ff[1], c.ff[3]), a: rnd(0, 6.28), sp: rnd(6, 14), ph: rnd(0, 6.28), f: rnd(0.6, 1.6) });
        st.bl = []; for (var j = 0; j < 140; j++) { var gy = rnd(c.grass[1], c.grass[3]); st.bl.push([rnd(c.grass[0], c.grass[2]), gy, rnd(0, 6.28), 3 + (gy - c.grass[1]) / (c.grass[3] - c.grass[1] + 1) * 7, ['#1E4A2E', '#2E6238', '#3E7A44', '#24502E'][j % 4]]); }
        st.tw = []; for (var k = 0; k < 30; k++) st.tw.push([rnd(0, w), rnd(0, c.band[1] - 30), rnd(0, 6.28), rnd(1, 3)]);
        st.next = 2; st.stars = [];
      }
      /* sky: moon breathes, stars twinkle, an occasional shooting star */
      glowDot(ctx, c.moon[0], c.moon[1], 44 + 5 * Math.sin(t * 1.1), '220,232,255', 0.28);
      st.tw.forEach(function (s) { var a = Math.abs(Math.sin(t * s[3] + s[2])); star4(ctx, s[0], s[1], 1.4 + 2.6 * a, '#FFFFFF', 0.15 + 0.8 * a); });
      if (t > st.next) { st.stars.push({ x: rnd(w * 0.4, w), y: rnd(10, c.band[1] * 0.4), t0: t, len: rnd(70, 120) }); st.next = t + rnd(4, 7); }
      st.stars = st.stars.filter(function (s) { return t - s.t0 < 1.1; }); st.stars.forEach(function (s) { shootingStar(ctx, s.x, s.y, s.len, (t - s.t0) / 1.1); });
      c.sp.forEach(function (s) {
        var M = s.m;
        if (s.k === 'cloud') spr(ctx, s.src, M, Math.sin(t * 0.12) * 22, 0);
        else if (s.k === 'train') {
          var p = (t % 20) / 20, dx = -(M[0] + M[2]) + p * (w + M[2]);
          ctx.save(); ctx.beginPath(); ctx.rect(c.band[0], c.band[1], c.band[2] - c.band[0], c.band[3] - c.band[1]); ctx.clip(); spr(ctx, s.src, M, dx, 0); ctx.restore();
        }
        else if (s.k === 'palm') spr(ctx, s.src, M, 0, 0, Math.sin(t * 1.3) * 0.05 + Math.sin(t * 0.47) * 0.03, 1, 1, M[2] / 2, M[3] * 0.3);
        else if (s.k === 'tree') spr(ctx, s.src, M, Math.sin(t * 0.9) * 1.5, Math.sin(t * 1.1) * 1, Math.sin(t * 0.8) * 0.012, 1, 1, 0, 0);
        else if (s.k === 'cow') spr(ctx, s.src, M, Math.sin(t * 0.25) * 4, Math.max(0, Math.sin(t * 0.9)) * 1.5);
      });
      /* lanterns + windows flicker */
      c.lamps.forEach(function (l, i) { glowDot(ctx, l[0], l[1], l[2] + 2 * Math.sin(t * 7 + i), '255,170,70', 0.16 + 0.1 * Math.sin(t * 11 + i * 2)); });
      /* grass sways */
      ctx.lineCap = 'round';
      st.bl.forEach(function (b) { var sw = Math.sin(t * 1.6 + b[2] + b[0] * 0.04) * b[3] * 0.4; ctx.strokeStyle = b[4]; ctx.globalAlpha = 0.8; ctx.lineWidth = 0.6 + b[3] * 0.06; ctx.beginPath(); ctx.moveTo(b[0], b[1]); ctx.quadraticCurveTo(b[0] + sw * 0.3, b[1] - b[3] * 0.6, b[0] + sw, b[1] - b[3]); ctx.stroke(); });
      ctx.globalAlpha = 1;
      /* fireflies wander and blink */
      st.ff.forEach(function (f) {
        f.a += Math.sin(t * 0.7 + f.ph) * 0.04; f.x += Math.cos(f.a) * f.sp * 0.016; f.y += Math.sin(f.a) * f.sp * 0.012;
        if (f.x < c.ff[0] || f.x > c.ff[2]) f.a = Math.PI - f.a; if (f.y < c.ff[1] || f.y > c.ff[3]) f.a = -f.a;
        var b = Math.max(0, Math.sin(t * f.f * 2.2 + f.ph)); b = b * b;
        glowDot(ctx, f.x, f.y, 7, '255,236,120', 0.75 * b); ctx.fillStyle = 'rgba(255,250,200,' + b + ')'; ctx.beginPath(); ctx.arc(f.x, f.y, 0.9, 0, 6.28); ctx.fill();
      });
      ctx.restore();
    }
  };
  /* ---- village videos (her own): the video plays exactly over the printed frame, fireflies on top ---- */
  var VIDCFG = {"M": {"v": "assets/monsoon.mp4", "crop": [0, 0, 618, 870], "storm": true}, "A": {"v": "assets/village-a.mp4", "crop": [19.5, 19.5, 681, 960], "ff": [0, 250, 397, 545]}, "B": {"v": "assets/village-b.mp4", "crop": [19.5, 219.5, 681, 960], "ff": [0, 300, 397, 545]}, "BM": {"v": "assets/village-b.mp4", "crop": [74.7, 24.7, 410.6, 1230.6], "ff": [0, 330, 189, 560]}}, VIDS = {};
  function vid(src) {
    var v = VIDS[src];
    if (!v) { v = VIDS[src] = document.createElement('video'); v.src = (v.canPlayType('video/mp4; codecs="avc1.42E01E"') ? src : src.replace('.mp4', '.webm')); v.muted = true; v.loop = true; v.playsInline = true; v.setAttribute('playsinline', ''); v.setAttribute('muted', ''); v.preload = 'auto'; }
    if (v.paused) { var p = v.play(); if (p && p.catch) p.catch(function () {}); }
    return v.readyState >= 2 ? v : null;
  }
  ANIMS.vid = {
    plate: true,
    init: function () {},
    draw: function (ctx, t, st, w, h, m, T) {
      var c = VIDCFG[T.cfg]; if (!c) return;
      var v = vid(c.v);
      ctx.save(); ctx.beginPath(); ctx.rect(0, 0, w, h); ctx.clip();
      if (v) ctx.drawImage(v, c.crop[0], c.crop[1], c.crop[2], c.crop[3], 0, 0, w, h);
      if (c.storm) {
        if (!st.drops) { st.drops = []; for (var q = 0; q < 150; q++) st.drops.push([rnd(-40, w + 40), rnd(0, h), rnd(320, 440), rnd(10, 18)]); st.lastFlash = -1; }
        var cyc = Math.floor(t / 8), T8 = t % 8, fl = (T8 > 1 && T8 < 1.1) ? 1 : (T8 > 1.2 && T8 < 1.36 ? 0.6 : 0);
        if (fl) { ctx.fillStyle = 'rgba(220,214,255,' + (0.38 * fl) + ')'; ctx.fillRect(0, 0, w, h); }
        if (T8 > 1.5 && st.lastFlash !== cyc) { st.lastFlash = cyc; if (window.DPSound) window.DPSound.thunder(0.7 + Math.random() * 0.3); }
        ctx.strokeStyle = 'rgba(210,222,250,0.5)'; ctx.lineWidth = 1; ctx.beginPath();
        st.drops.forEach(function (d) { var y = (d[1] + t * d[2]) % (h + 40) - 20, x = d[0] - y * 0.12; ctx.moveTo(x, y); ctx.lineTo(x - d[3] * 0.12, y + d[3]); });
        ctx.stroke(); ctx.restore(); return;
      }
      if (!st.ff) { st.ff = []; for (var i = 0; i < 30; i++) st.ff.push({ x: rnd(c.ff[0], c.ff[2]), y: rnd(c.ff[1], c.ff[3]), a: rnd(0, 6.28), sp: rnd(6, 14), ph: rnd(0, 6.28), f: rnd(0.6, 1.6) }); }
      st.ff.forEach(function (f) {
        f.a += Math.sin(t * 0.7 + f.ph) * 0.04; f.x += Math.cos(f.a) * f.sp * 0.016; f.y += Math.sin(f.a) * f.sp * 0.012;
        if (f.x < c.ff[0] || f.x > c.ff[2]) f.a = Math.PI - f.a; if (f.y < c.ff[1] || f.y > c.ff[3]) f.a = -f.a;
        var b = Math.max(0, Math.sin(t * f.f * 2.2 + f.ph)); b = b * b;
        glowDot(ctx, f.x, f.y, 7, '255,236,120', 0.8 * b); ctx.fillStyle = 'rgba(255,250,200,' + b + ')'; ctx.beginPath(); ctx.arc(f.x, f.y, 0.9, 0, 6.28); ctx.fill();
      });
      ctx.restore();
    }
  };
  ANIMS.stickerNavi = {
    init: function () {},
    draw: function (ctx, t) {
      sparkles(ctx, t, [[22, 36], [262, 30], [-18, 150], [302, 160], [250, 290], [142, -30]]);
      for (var i = 0; i < 4; i++) {
        var p = ((t * 0.8 + i * 0.25) % 1); var x = 124 + p * 40, y = 232 - p * 30;
        ctx.globalAlpha = 1 - p; circle(ctx, x, y, 4 + p * 10, '#CFCFCF', 1.5);
      }
      ctx.globalAlpha = 1;
    }
  };

  ANIMS.cat = {
    init: function (st) {
      st.L = new Image(); st.L.src = './assets/cat-hand-left.png';
      st.R = new Image(); st.R.src = './assets/cat-hand-right.png';
      st.hearts = []; for (var i = 0; i < 6; i++) st.hearts.push({ x: i % 2 ? rnd(220, 300) : rnd(-20, 60), ph: i * 0.6 });
    },
    draw: function (ctx, t, st) {
      var T = t % 2.6, tap = T < 1.5 ? Math.abs(Math.sin(T / 1.5 * Math.PI * 3)) : 0, d = tap * 6;
      /* blush pulse */
      ctx.globalAlpha = 0.18 + 0.18 * Math.sin(t * 4);
      ctx.fillStyle = '#FF7A9A'; ctx.beginPath(); ctx.ellipse(52, 144, 22, 10, 0, 0, Math.PI * 2); ctx.ellipse(192, 138, 22, 10, 0, 0, Math.PI * 2); ctx.fill();
      ctx.globalAlpha = 1;
      if (st.L.complete && st.L.naturalWidth) ctx.drawImage(st.L, 83.9 + d, 175.4 - d * 0.3, 69.9, 80);
      if (st.R.complete && st.R.naturalWidth) ctx.drawImage(st.R, 151.2 - d, 171.5 - d * 0.3, 68.6, 83.9);
      /* "pretty please?" */
      var p = Math.min(1, t / 0.6), s = p < 1 ? 0.6 + 0.5 * p : 1 + 0.04 * Math.sin(t * 3);
      ctx.save(); ctx.translate(142, -38); ctx.rotate(-0.06); ctx.scale(s, s);
      ctx.font = '700 40px Caveat, "Comic Sans MS", cursive'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
      ctx.lineWidth = 7; ctx.strokeStyle = '#FFFFFF'; ctx.strokeText('pretty please?', 0, 0); ctx.fillStyle = '#E8467C'; ctx.fillText('pretty please?', 0, 0);
      ctx.restore();
      st.hearts.forEach(function (h) {
        var q = ((t * 0.5 + h.ph) % 1); var y = 260 - q * 260;
        ctx.save(); ctx.globalAlpha = q > 0.8 ? (1 - q) / 0.2 : 1; ctx.translate(h.x, y); ctx.scale(0.9, 0.9);
        ctx.fillStyle = '#FF5C8A'; ctx.beginPath(); ctx.moveTo(0, 6); ctx.bezierCurveTo(-12, -4, -6, -14, 0, -6); ctx.bezierCurveTo(6, -14, 12, -4, 0, 6); ctx.fill(); ctx.restore();
      });
    }
  };

  ANIMS.fah = {
    init: function () {},
    onFound: function () {
      try { var u = new SpeechSynthesisUtterance('Faaaaaaaaah'); u.rate = 0.55; u.pitch = 0.7; speechSynthesis.cancel(); speechSynthesis.speak(u); } catch (e) {}
    },
    draw: function (ctx, t) {
      var T = t % 4.6, n = Math.max(1, Math.min(26, Math.floor((T - 0.15) * 9))), txt = 'FA' + new Array(n + 1).join('H');
      var intensity = Math.min(1, n / 26), sx = (Math.random() - 0.5) * 4 * intensity, sy = (Math.random() - 0.5) * 4 * intensity;
      var fs = 46; ctx.font = '800 ' + fs + 'px "Baloo 2", system-ui, sans-serif';
      var tw = ctx.measureText(txt).width; if (tw > 400) { fs = fs * 400 / tw; ctx.font = '800 ' + fs + 'px "Baloo 2", system-ui, sans-serif'; tw = ctx.measureText(txt).width; }
      var bw = tw + 30, bh = fs + 22, cx = 142 + sx, cy = -46 + sy;
      if (T < 0.15) return;
      ctx.lineJoin = 'round';
      ctx.beginPath(); ctx.moveTo(cx - 40, cy + bh / 2 - 4); ctx.lineTo(118, 116); ctx.lineTo(cx - 6, cy + bh / 2 - 4); ctx.closePath(); shape(ctx, '#FFFFFF', 3);
      rr(ctx, cx - bw / 2, cy - bh / 2, bw, bh, bh / 2); shape(ctx, '#FFFFFF', 3);
      ctx.fillStyle = '#FFFFFF'; ctx.fillRect(cx - 38, cy + bh / 2 - 8, 30, 7);
      ctx.fillStyle = INK; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText(txt, cx, cy + 2);
      ctx.strokeStyle = INK; ctx.lineWidth = 2.4; ctx.lineCap = 'round';
      for (var k = 0; k < 3; k++) {
        var r = 10 + k * 7 + (t * 30 % 7);
        ctx.globalAlpha = intensity * (1 - k * 0.3);
        ctx.beginPath(); ctx.arc(102, 129, r + 20, Math.PI * 0.85, Math.PI * 1.15); ctx.stroke();
        ctx.beginPath(); ctx.arc(102, 129, r + 20, -Math.PI * 0.15, Math.PI * 0.15); ctx.stroke();
      }
      ctx.globalAlpha = 1;
    }
  };


  /* ---- Marine Drive: sunset -> night cycle ---- */
  var MD = { cyc: 24 };
  function mdNight(t) { var T = t % MD.cyc; if (T < 4) return 0; if (T < 10) { var p = (T - 4) / 6; return p * p * (3 - 2 * p); } if (T < 20) return 1; var q = (T - 20) / 4; return 1 - q * q * (3 - 2 * q); }
  function mdPrep(st) {
    if (st.mdReady || st.mdLoading) return; st.mdLoading = true;
    var srcs = ['targets/marine.png', 'targets-images/marine.png'], k = 0, img = new Image();
    img.onload = function () {
      try {
        var c = document.createElement('canvas'); c.width = 559; c.height = 397; var x = c.getContext('2d'); x.drawImage(img, 0, 0, 559, 397);
        var d = x.getImageData(0, 0, 559, 397).data;
        var m = document.createElement('canvas'); m.width = 559; m.height = 397; var mx = m.getContext('2d'), md = mx.createImageData(559, 397);
        for (var y = 15; y < 95; y++) for (var xx = 15; xx < 430; xx++) {
          var i = (y * 559 + xx) * 4, r = d[i] / 255, g = d[i + 1] / 255, b = d[i + 2] / 255, mxv = Math.max(r, g, b), mnv = Math.min(r, g, b);
          var lum = 0.3 * r + 0.59 * g + 0.11 * b, sat = mxv ? (mxv - mnv) / mxv : 0;
          var a = Math.max(0, Math.min(1, (lum - 0.8) / 0.1)) * (sat < 0.22 ? 1 : 0);
          md.data[i] = md.data[i + 1] = md.data[i + 2] = 255; md.data[i + 3] = a * 255;
        }
        mx.putImageData(md, 0, 0); st.mdMask = m;
        var win = [];
        for (var yy = 198; yy < 246; yy += 3) for (var x2 = 238; x2 < 557; x2 += 3) {
          if ((x2 > 104 && x2 < 115) || (x2 > 464 && x2 < 475)) continue;
          var j = (yy * 559 + x2) * 4, l = (0.3 * d[j] + 0.59 * d[j + 1] + 0.11 * d[j + 2]) / 255;
          if (l < 0.33 && Math.random() < 0.55) win.push([x2 + rnd(-0.6, 0.6), yy + rnd(-0.6, 0.6), rnd(0, 6.28), rnd(0.6, 2.2), Math.random() < 0.8 ? '255,214,120' : '255,245,225']);
        }
        st.mdWin = win;
      } catch (e) { st.mdWin = null; }
      st.mdReady = true;
    };
    img.onerror = function () { k++; if (k < srcs.length) img.src = srcs[k]; else st.mdReady = true; };
    img.src = srcs[0];
  }
  function mdOverlay(ctx, t, st, w, h) {
    mdPrep(st);
    var n = mdNight(t); if (n <= 0) return;
    var c = st.mdOv || (st.mdOv = document.createElement('canvas')); c.width = w; c.height = h; var x = c.getContext('2d');
    var g = x.createLinearGradient(0, 0, 0, h);
    g.addColorStop(0, 'rgba(6,9,34,' + 0.86 * n + ')'); g.addColorStop(0.5, 'rgba(18,20,62,' + 0.74 * n + ')');
    g.addColorStop(0.62, 'rgba(30,22,70,' + 0.62 * n + ')'); g.addColorStop(0.64, 'rgba(10,14,46,' + 0.62 * n + ')'); g.addColorStop(1, 'rgba(6,8,24,' + 0.6 * n + ')');
    x.fillStyle = g; x.fillRect(0, 0, w, h);
    if (st.mdMask) { x.globalCompositeOperation = 'destination-out'; x.drawImage(st.mdMask, 0, 0); x.globalCompositeOperation = 'source-over'; }
    ctx.drawImage(c, 0, 0);
  }
  function mdLights(ctx, t, st, w) {
    var n = mdNight(t); if (n <= 0.02) return;
    ctx.save(); ctx.globalCompositeOperation = 'lighter';
    /* stars */
    if (!st.mdStars) { st.mdStars = []; for (var s = 0; s < 46; s++) st.mdStars.push([rnd(0, w), rnd(4, 175), rnd(0, 6.28), rnd(0.6, 1.6)]); }
    st.mdStars.forEach(function (s) { var a = n * (0.35 + 0.65 * Math.abs(Math.sin(t * s[3] + s[2]))); ctx.fillStyle = 'rgba(255,250,235,' + a + ')'; ctx.beginPath(); ctx.arc(s[0], s[1], 0.9, 0, 6.28); ctx.fill(); });
    /* building windows twinkle */
    var win = st.mdWin; if (win === undefined && !st.mdReady) win = null;
    if (!win) { if (!st.mdFake) { st.mdFake = []; for (var f = 0; f < 120; f++) st.mdFake.push([rnd(240, 556), rnd(214, 246), rnd(0, 6.28), rnd(0.6, 2.2), '255,214,120']); } win = st.mdFake; }
    win.forEach(function (p, i) {
      var on = 0.5 + 0.5 * Math.sin(t * p[3] + p[2]); on = on > 0.25 ? 0.55 + 0.45 * on : 0.15;
      var a = Math.max(0, Math.min(1, n * 1.6 - (i % 7) * 0.08)) * on;
      ctx.fillStyle = 'rgba(' + p[4] + ',' + a + ')'; ctx.fillRect(p[0] - 1, p[1] - 1, 2.1, 2.1);
    });
    /* Queen's Necklace: promenade street lights + far shore */
    for (var x = 200; x < w; x += 4.2) {
      var tw = 0.7 + 0.3 * Math.sin(t * 4 + x * 0.7), a2 = n * tw;
      glowDotM(ctx, x, 251, 8, '255,190,90', 0.8 * a2);
      ctx.fillStyle = 'rgba(255,236,170,' + a2 + ')'; ctx.beginPath(); ctx.arc(x, 251, 1.1, 0, 6.28); ctx.fill();
      if ((x | 0) % 3 === 0) { var rl = 10 + 8 * Math.abs(Math.sin(t * 1.3 + x)); var gr = ctx.createLinearGradient(0, 253, 0, 253 + rl); gr.addColorStop(0, 'rgba(255,190,90,' + 0.4 * a2 + ')'); gr.addColorStop(1, 'rgba(255,190,90,0)'); ctx.fillStyle = gr; ctx.fillRect(x - 0.7 + Math.sin(t * 3 + x) * 0.6, 253, 1.4, rl); }
    }
    for (var x3 = 2; x3 < 238; x3 += 5) { var a3 = n * (0.5 + 0.4 * Math.sin(t * 3 + x3)); glowDotM(ctx, x3, 246, 3.5, '255,190,90', 0.4 * a3); ctx.fillStyle = 'rgba(255,230,160,' + a3 + ')'; ctx.fillRect(x3 - 0.6, 245.4, 1.2, 1.2); }
    /* lamp posts glow */
    [[124, 196], [484, 196]].forEach(function (l, i) { glowDotM(ctx, l[0], l[1], 34 + 4 * Math.sin(t * 2 + i), '255,200,110', 0.55 * n); glowDotM(ctx, l[0], l[1], 8, '255,245,220', 0.9 * n); });
    ctx.restore();
  }
  ANIMS.marine = {
    init: function (st) { st.birds = [[240, 110], [270, 100], [300, 92], [330, 104]]; },
    draw: function (ctx, t, st, w) {
      var nn = mdNight(t);
      glowDotM(ctx, 300, 247, 70 + 8 * Math.sin(t * 1.5), '255,170,90', 0.35 * (1 - nn));
      mdLights(ctx, t, st, w);
      var p = (t % 26) / 26, sx = -60 + p * (w + 120), sy = 248.5 + Math.sin(t * 2) * 0.6;
      ctx.save(); ctx.translate(sx, sy); ctx.scale(0.45, 0.45); ctx.lineJoin = 'round';
      ctx.beginPath(); ctx.moveTo(-40, -2); ctx.lineTo(40, -2); ctx.lineTo(32, 8); ctx.lineTo(-34, 8); ctx.closePath(); shape(ctx, '#2B2140', 2);
      rr(ctx, -24, -14, 34, 12, 2); shape(ctx, '#FFF3DC', 2);
      rr(ctx, 14, -24, 7, 12, 1); shape(ctx, '#E2502E', 2);
      ctx.fillStyle = '#FFD66B'; for (var i = 0; i < 5; i++) ctx.fillRect(-20 + i * 6, -10, 3, 3);
      if (nn > 0.1) { glowDotM(ctx, -6, -8, 30, '255,210,120', 0.5 * nn); glowDotM(ctx, 17, -26, 8, '255,80,60', nn * (0.5 + 0.5 * Math.sin(t * 5))); }
      for (var k = 0; k < 3; k++) { var q = ((t * 0.5 + k / 3) % 1); ctx.globalAlpha = 1 - q; circle(ctx, 17 + q * 16, -26 - q * 20, 3 + q * 6, '#D8DCE6'); }
      ctx.globalAlpha = 1; ctx.restore();
      [237, 247].forEach(function (cx, i) {
        for (var k = 0; k < 3; k++) {
          var q = ((t * 0.45 + k / 3 + i * 0.17) % 1); ctx.globalAlpha = (1 - q) * 0.9;
          ctx.strokeStyle = '#FFF3DC'; ctx.lineWidth = 2; ctx.lineCap = 'round'; ctx.beginPath();
          var y0 = 325 - q * 34; ctx.moveTo(cx + Math.sin(t * 3 + k) * 3, y0); ctx.quadraticCurveTo(cx + 6 * Math.sin(t * 2 + k + 1), y0 - 6, cx, y0 - 12); ctx.stroke();
        }
      });
      ctx.globalAlpha = 1;
      ctx.globalAlpha = 1 - nn;
      st.birds.forEach(function (b, i) {
        var x = ((b[0] + t * (18 + i * 3)) % (w + 80)) - 40, y = b[1] + Math.sin(t * 1.5 + i) * 6, f = Math.sin(t * 9 + i) * 5;
        ctx.strokeStyle = INK; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(x - 8, y - f); ctx.quadraticCurveTo(x - 4, y - 3, x, y); ctx.quadraticCurveTo(x + 4, y - 3, x + 8, y - f); ctx.stroke();
      });
      ctx.globalAlpha = 1;
      var hb = Math.sin(t * 3) * 0.04; ctx.save(); ctx.translate(306, 300); ctx.rotate(hb); ctx.translate(-306, -300); ctx.restore();
    }
  };
  function glowDotM(ctx, x, y, r, rgb, a) { var g = ctx.createRadialGradient(x, y, 0, x, y, r); g.addColorStop(0, 'rgba(' + rgb + ',' + a + ')'); g.addColorStop(1, 'rgba(' + rgb + ',0)'); ctx.fillStyle = g; ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.fill(); }

  /* ---------- shared effects: glitter + moving water ---------- */
  function water(ctx, t, st, o) {
    if (!st._w) { st._w = []; for (var i = 0; i < 110; i++) st._w.push({ x: rnd(o.x0, o.x1), d: Math.random(), len: rnd(8, 26), ph: rnd(0, 6.28), sp: rnd(4, 12) * (i % 2 ? 1 : -1) }); }
    var H = o.y1 - o.y0, W = o.x1 - o.x0;
    ctx.save(); ctx.beginPath(); ctx.rect(o.x0, o.y0, W, H); ctx.clip(); ctx.lineCap = 'round';
    st._w.forEach(function (r) {
      var k = Math.pow(r.d, 1.5), y = o.y0 + 3 + k * (H - 6) + Math.sin(t * 1.2 + r.ph) * 1.5 * (0.4 + k);
      var x = o.x0 + ((r.x - o.x0 + t * r.sp * (0.5 + k)) % W + W) % W, sc = 0.45 + k * 0.9;
      var a = Math.max(0, Math.sin(t * 1.8 + r.ph)) * (0.25 + 0.35 * (1 - k));
      ctx.strokeStyle = 'rgba(' + o.col + ',' + a.toFixed(3) + ')'; ctx.lineWidth = 1.1 * sc;
      ctx.beginPath(); ctx.moveTo(x - r.len * sc / 2, y); ctx.quadraticCurveTo(x, y - 1.6 * sc, x + r.len * sc / 2, y); ctx.stroke();
    });
    for (var j = 0; j < 46; j++) {
      var p = j / 46, y2 = o.y0 + 2 + p * (H - 4), wd = 6 + p * 46;
      var x2 = o.mx + Math.sin(t * 1.6 + j * 0.9) * wd * 0.45 + Math.sin(t * 0.7 + j) * 4;
      var a2 = (1 - p) * (0.35 + 0.65 * Math.pow(Math.abs(Math.sin(t * 3.2 + j * 1.7)), 2));
      ctx.fillStyle = 'rgba(' + o.col + ',' + (a2 * 0.85).toFixed(3) + ')';
      ctx.fillRect(x2 - wd * 0.25, y2, wd * (0.25 + 0.25 * Math.abs(Math.sin(j * 2.3 + t))), 1.4 + p);
      if (j % 7 === 0) star4(ctx, x2, y2, 2 + 3 * Math.abs(Math.sin(t * 4 + j)), '#FFFFFF', a2);
    }
    ctx.restore();
  }
  function glitter(ctx, t, st, w, h, m, o) {
    if (!st._g) { st._g = []; for (var i = 0; i < o.n; i++) st._g.push({ x: rnd(-m * 0.5, w + m * 0.5), y: rnd(-m * 0.5, h + m * 0.5), ph: rnd(0, 6.28), sp: rnd(1.5, 4), s: rnd(1.5, 4.5), vy: rnd(-8, -2), c: o.cols[i % o.cols.length] }); }
    var span = h + m;
    st._g.forEach(function (g) {
      var a = Math.pow(Math.abs(Math.sin(t * g.sp + g.ph)), 4);
      if (a < 0.03) return;
      var y = ((g.y + t * g.vy + m * 0.5) % span + span) % span - m * 0.5, x = g.x + Math.sin(t * 0.8 + g.ph) * 6;
      star4(ctx, x, y, g.s * (0.6 + a * 1.6), g.c, a);
      if (a > 0.6) { ctx.globalAlpha = a * 0.35; circle(ctx, x, y, g.s * 2.2, g.c); ctx.globalAlpha = 1; }
    });
  }

  /* ---------- extra effects per card ---------- */
  function glowDot(ctx, x, y, r, rgb, a) {
    var g = ctx.createRadialGradient(x, y, 0, x, y, r); g.addColorStop(0, 'rgba(' + rgb + ',' + a + ')'); g.addColorStop(1, 'rgba(' + rgb + ',0)');
    ctx.fillStyle = g; ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.fill();
  }
  function fireflies(ctx, t, st, n, box, rgb) {
    if (!st._ff) { st._ff = []; for (var i = 0; i < n; i++) st._ff.push({ x: rnd(box[0], box[2]), y: rnd(box[1], box[3]), ph: rnd(0, 6.28), r: rnd(10, 30) }); }
    st._ff.forEach(function (f) {
      var x = f.x + Math.sin(t * 0.6 + f.ph) * f.r, y = f.y + Math.cos(t * 0.5 + f.ph * 1.3) * f.r * 0.6, a = 0.4 + 0.6 * Math.abs(Math.sin(t * 2 + f.ph));
      glowDot(ctx, x, y, 7, rgb, a * 0.6); circle(ctx, x, y, 1.4, 'rgba(' + rgb + ',' + a + ')');
    });
  }
  function cloud(ctx, x, y, s) {
    ctx.save(); ctx.translate(x, y); ctx.scale(s, s); ctx.beginPath();
    ctx.moveTo(-34, 10); ctx.bezierCurveTo(-40, -4, -22, -12, -14, -6); ctx.bezierCurveTo(-10, -22, 14, -22, 16, -6); ctx.bezierCurveTo(30, -10, 40, 4, 32, 10); ctx.closePath();
    shape(ctx, '#FFF3DC', 2.4); ctx.restore();
  }
  function balloon(ctx, x, y, col, sw) {
    ctx.strokeStyle = INK; ctx.lineWidth = 1.4; ctx.beginPath(); ctx.moveTo(x, y + 16); ctx.quadraticCurveTo(x + sw, y + 30, x, y + 44); ctx.stroke();
    ctx.beginPath(); ctx.ellipse(x, y, 11, 14, 0, 0, Math.PI * 2); shape(ctx, col, 2.2);
    ctx.fillStyle = 'rgba(255,255,255,0.6)'; ctx.beginPath(); ctx.ellipse(x - 4, y - 5, 2.5, 4, -0.4, 0, Math.PI * 2); ctx.fill();
  }
  function ring(ctx, t, cx, cy, r, n, cols) {
    for (var i = 0; i < n; i++) { var a = t * 0.9 + i * Math.PI * 2 / n; star4(ctx, cx + Math.cos(a) * r, cy + Math.sin(a) * r, 4 + 2 * Math.sin(t * 4 + i), cols[i % cols.length], 0.9); }
  }
  var EXTRA = {
    marine: function (ctx, t, st, w, h) { mdOverlay(ctx, t, st, w, h); },
    moon: function (ctx, t, st) {
      fireflies(ctx, t, st, 14, [230, 80, 397, 470], '255,240,170');
      ctx.globalAlpha = 0.5; var cx = ((t * 6) % 520) - 120; ctx.fillStyle = '#5A72B6'; ctx.beginPath(); ctx.ellipse(cx, 300, 60, 6, 0, 0, Math.PI * 2); ctx.fill(); ctx.globalAlpha = 1;
    },
    csmtHindi: function (ctx, t, st, w) { EXTRA.csmt(ctx, t, st, w); },
    csmt: function (ctx, t, st, w) {
      ctx.globalAlpha = 0.9;
      cloud(ctx, ((t * 10) % (w + 160)) - 80, 70, 0.8);
      cloud(ctx, w + 80 - ((t * 7 + 300) % (w + 160)), 112, 0.6);
      ctx.globalAlpha = 1;
    },
    diwali: function (ctx, t, st, w) {
      [[70, 80], [490, 72]].forEach(function (l, i) { glowDot(ctx, l[0], l[1], 38, '255,190,90', 0.35 + 0.25 * Math.sin(t * 3 + i)); });
      for (var i = 0; i < 5; i++) {
        var p = ((t * 0.12 + i * 0.2) % 1), x = 120 + i * 85 + Math.sin(t + i) * 12, y = 330 - p * 360;
        ctx.globalAlpha = p > 0.85 ? (1 - p) / 0.15 : Math.min(1, p * 5);
        glowDot(ctx, x, y, 20, '255,170,60', 0.6);
        ctx.beginPath(); ctx.moveTo(x - 7, y - 9); ctx.lineTo(x + 7, y - 9); ctx.lineTo(x + 5, y + 9); ctx.lineTo(x - 5, y + 9); ctx.closePath(); shape(ctx, '#FFB347', 1.6);
        ctx.globalAlpha = 1;
      }
      for (var k = 0; k < 14; k++) { var q = ((t * 0.2 + k * 0.071) % 1); petal(ctx, (k * 41) % w, -10 + q * 420, t * 2 + k, 1.2, k % 2 ? '#FF9F1C' : '#FFD23F'); }
    },
    christmas: function (ctx, t) {
      [[366, 158], [396, 208], [356, 214], [410, 268], [348, 270], [382, 250], [404, 200]].forEach(function (b, i) { glowDot(ctx, b[0], b[1], 14, i % 2 ? '255,212,59' : '255,90,90', 0.3 + 0.5 * Math.abs(Math.sin(t * 3 + i * 1.3))); });
      glowDot(ctx, 380, 106, 30, '255,230,120', 0.45 + 0.3 * Math.sin(t * 2.5));
      glowDot(ctx, 66, 263, 22, '255,212,59', 0.3 + 0.2 * Math.sin(t * 4));
      for (var i = 0; i < 4; i++) { var p = ((t * 0.3 + i * 0.25) % 1); ctx.globalAlpha = (1 - p) * 0.7; circle(ctx, 108 + p * 14 + Math.sin(p * 6) * 4, 228 - p * 60, 4 + p * 8, '#D8DCE6'); }
      ctx.globalAlpha = 1;
    },
    newyear: function (ctx, t, st, w, h) {
      var cols = ['#FFC93C', '#5CE1D8', '#FFF3DC', '#6A4C9C', '#E2502E'];
      for (var i = 0; i < 6; i++) { var p = ((t * 0.13 + i * 0.17) % 1); balloon(ctx, 40 + i * 95, h + 30 - p * (h + 120), cols[i % 5], Math.sin(t * 2 + i) * 6); }
      var T = t % 3;
      if (T < 1.2) [[60, 70], [500, 60]].forEach(function (c, i) { for (var k = 0; k < 16; k++) { var a = k / 16 * Math.PI * 2, r = T * 40; ctx.globalAlpha = 1 - T / 1.2; circle(ctx, c[0] + Math.cos(a) * r, c[1] + Math.sin(a) * r, 2.2, cols[(k + i) % 5]); } });
      ctx.globalAlpha = 1;
    },
    sakura: function (ctx, t, st, w, h) {
      fireflies(ctx, t, st, 12, [20, h * 0.45, w - 20, h * 0.8], '255,220,240');
    },
    stickerMumbai: function (ctx, t) {
      ring(ctx, t, 142, 136, 140, 10, ['#FFC93C', '#FF7AA2', '#FFFFFF']);
      var T = t % 4; if (T < 1) for (var k = 0; k < 18; k++) { var a = k / 18 * Math.PI * 2, r = 120 + T * 60; ctx.globalAlpha = 1 - T; ctx.save(); ctx.translate(142 + Math.cos(a) * r, 136 + Math.sin(a) * r); ctx.rotate(a + T * 6); ctx.fillStyle = ['#FFC93C', '#5CE1D8', '#FF7AA2'][k % 3]; ctx.fillRect(-4, -2, 8, 4); ctx.restore(); }
      ctx.globalAlpha = 1;
    },
    stickerNavi: function (ctx, t) {
      ring(ctx, -t, 142, 136, 140, 10, ['#8FDCCB', '#FFC93C', '#FFFFFF']);
      ctx.save(); ctx.translate(142, 40); ctx.rotate(t * 0.8); ctx.strokeStyle = 'rgba(255,243,220,0.8)'; ctx.lineWidth = 2; ctx.setLineDash([4, 6]); ctx.beginPath(); ctx.ellipse(0, 0, 70, 70, 0, 0, Math.PI * 2); ctx.stroke(); ctx.restore();
    },
    cat: function (ctx, t) {
      for (var i = 0; i < 6; i++) { var a = t * 0.7 + i * 1.05; star4(ctx, 142 + Math.cos(a) * 150, 140 + Math.sin(a) * 140, 5, i % 2 ? '#FFC2DA' : '#FFFFFF', 0.8); }
    },
    fah: function (ctx, t) {
      var T = t % 4.6;
      if (T > 1.5) for (var i = 0; i < 3; i++) { var x = 200 + i * 22, y = 40 - i * 8 + Math.sin(t * 20 + i) * 3; ctx.save(); ctx.translate(x, y); ctx.rotate(0.3); ctx.fillStyle = '#E63B2E'; ctx.font = '800 26px "Baloo 2", system-ui, sans-serif'; ctx.fillText('!', 0, 0); ctx.restore(); }
      for (var k = 0; k < 2; k++) { var p = ((t * 0.9 + k * 0.5) % 1); ctx.globalAlpha = 1 - p; ctx.fillStyle = '#7FC4FF'; ctx.beginPath(); ctx.ellipse(70 - k * 4, 70 + p * 30, 3.5, 5.5, 0, 0, Math.PI * 2); ctx.fill(); } ctx.globalAlpha = 1;
    }
  };
  function popIn(ctx, t, T) {
    if (t > 1.4) return; var p = t / 1.4, a = 1 - p, e = 6 + p * 30;
    ctx.save(); ctx.strokeStyle = 'rgba(255,255,255,' + a + ')'; ctx.lineWidth = 4 * a + 1; ctx.shadowColor = 'rgba(255,220,140,' + a + ')'; ctx.shadowBlur = 18;
    if (T.w === T.h) { ctx.beginPath(); ctx.arc(T.w / 2, T.h / 2, T.w * 0.48 + e, 0, Math.PI * 2); ctx.stroke(); }
    else { rr(ctx, -e, -e, T.w + 2 * e, T.h + 2 * e, 10); ctx.stroke(); }
    ctx.restore();
  }
  function drawAll(ctx, t, st, T) {
    if (ANIMS[T.anim].plate) {
      ANIMS[T.anim].draw(ctx, t, st, T.w, T.h, T.m, T);
      if (T.fx && T.fx.water) water(ctx, t, st, T.fx.water);
    } else {
      if (T.fx && T.fx.water) water(ctx, t, st, T.fx.water);
      if (EXTRA[T.anim]) EXTRA[T.anim](ctx, t, st, T.w, T.h, T.m);
      ANIMS[T.anim].draw(ctx, t, st, T.w, T.h, T.m);
    }
    if (T.fx && T.fx.glitter) glitter(ctx, t, st, T.w, T.h, T.m, T.fx.glitter);
    popIn(ctx, t, T);
  }

  /* ---------------- A-Frame wiring: one site, two modes (flat overlay / 3D pop-up window) ---------------- */
  var MODE = 'flat';
  try { var saved = localStorage.getItem('dp-mode'); if (saved === '3d' || saved === 'flat') MODE = saved; } catch (e) {}
  function setMode(m) { MODE = m === '3d' ? '3d' : 'flat'; try { localStorage.setItem('dp-mode', MODE); } catch (e) {} return MODE; }
  var FRAME = { moon: '#C9A65E', csmt: '#E2502E', csmtHindi: '#E2502E', diwali: '#FFC93C', christmas: '#D62828', newyear: '#6A4C9C', sakura: '#3A1F2E', stickerMumbai: '#FFC93C', stickerNavi: '#2FA84F', cat: '#FF9FBF', fah: '#FFFFFF', marine: '#FF8A5B', stickerDesigner: '#6A4C9C', winter: '#5BB6C9', bmMoon: '#C9A65E', bmVillage: '#7A5A3A', village: '#8A6038', nv: '#2A3A5A', vid: '#2A3A5A', monsoon: '#B44A2E' };
  function easeOutBack(x) { var c1 = 1.70158, c3 = c1 + 1; return 1 + c3 * Math.pow(x - 1, 3) + c1 * Math.pow(x - 1, 2); }
  function clamp01(x) { return Math.max(0, Math.min(1, x)); }
  if (window.AFRAME) {
    AFRAME.registerComponent('dp-anim', {
      schema: { index: { type: 'int' } },
      init: function () {
        var T = TARGETS[this.data.index], THREE = AFRAME.THREE, self = this;
        this.T = T; this.A = ANIMS[T.anim]; this.st = {};
        var fw = T.w + 2 * T.m, fh = T.h + 2 * T.m, H = T.h / T.w, sticker = T.w === T.h, col = FRAME[T.anim] || '#FFFFFF';
        this.S = Math.min(2, 1600 / Math.max(fw, fh));
        var c = document.createElement('canvas'); c.width = Math.round(fw * this.S); c.height = Math.round(fh * this.S);
        this.ctx = c.getContext('2d');
        this.tex = new THREE.CanvasTexture(c); if ('colorSpace' in this.tex) this.tex.colorSpace = THREE.SRGBColorSpace;
        var holder = new THREE.Group();

        /* FLAT mode: animation drawn right on top of the printed card */
        var flat = new THREE.Mesh(new THREE.PlaneGeometry(fw / T.w, fh / T.w), new THREE.MeshBasicMaterial({ map: this.tex, transparent: true, depthWrite: false }));
        flat.visible = false; holder.add(flat);

        /* 3D mode: base rises, the card swings up like a window */
        var root = new THREE.Group(); root.visible = false; holder.add(root);
        var frameMat = new THREE.MeshLambertMaterial({ color: col });
        var darkMat = new THREE.MeshLambertMaterial({ color: new THREE.Color(col).multiplyScalar(0.55) });
        var base = new THREE.Mesh(new THREE.BoxGeometry(sticker ? 0.8 : 1.08, 0.2, 0.06), darkMat);
        base.position.set(0, -H / 2 + 0.1, 0.03); root.add(base);
        var shadow = new THREE.Mesh(new THREE.PlaneGeometry(1.1, H * 0.6), new THREE.MeshBasicMaterial({ color: 0x000000, transparent: true, opacity: 0.25, depthWrite: false }));
        shadow.position.set(0, -H / 2 + H * 0.3, 0.001); root.add(shadow);
        var hinge = new THREE.Group(); hinge.position.set(0, -H / 2 + 0.1, 0.06); root.add(hinge);
        var win = new THREE.Group(); win.position.set(0, H / 2, 0); hinge.add(win);
        var imgMat = new THREE.MeshBasicMaterial({ transparent: true, side: THREE.DoubleSide });
        var loader = new THREE.TextureLoader();
        function setTex(tx) { if ('colorSpace' in tx) tx.colorSpace = THREE.SRGBColorSpace; imgMat.map = tx; imgMat.needsUpdate = true; }
        loader.load('./targets/' + T.file, setTex, undefined, function () { loader.load('./targets-images/' + T.file, setTex); });
        var img = new THREE.Mesh(new THREE.PlaneGeometry(1, H), imgMat); img.position.z = 0.02; win.add(img);
        if (sticker) {
          for (var k = 1; k <= 4; k++) { var sm = new THREE.MeshBasicMaterial({ transparent: true, color: 0x777777, side: THREE.DoubleSide }); (function (m) { loader.load('./targets/' + T.file, function (tx) { m.map = tx; m.needsUpdate = true; }, undefined, function () { loader.load('./targets-images/' + T.file, function (tx) { m.map = tx; m.needsUpdate = true; }); }); })(sm); var sl = new THREE.Mesh(new THREE.PlaneGeometry(1, H), sm); sl.position.z = 0.02 - k * 0.006; win.add(sl); }
        } else {
          var back = new THREE.Mesh(new THREE.BoxGeometry(1.06, H + 0.06, 0.03), darkMat); win.add(back);
          var bw = 0.035, d = 0.07;
          [[0, H / 2 + bw / 2, 1 + 2 * bw, bw], [0, -H / 2 - bw / 2, 1 + 2 * bw, bw], [-0.5 - bw / 2, 0, bw, H], [0.5 + bw / 2, 0, bw, H]].forEach(function (f) {
            var bar = new THREE.Mesh(new THREE.BoxGeometry(f[2], f[3], d), frameMat); bar.position.set(f[0], f[1], 0.02 + d / 2 - 0.01); win.add(bar);
          });
        }
        var anim = new THREE.Mesh(new THREE.PlaneGeometry(fw / T.w, fh / T.w), new THREE.MeshBasicMaterial({ map: this.tex, transparent: true, depthWrite: false, side: THREE.DoubleSide }));
        anim.position.z = sticker ? 0.05 : 0.07; win.add(anim);

        this.flat = flat; this.root = root; this.base = base; this.hinge = hinge; this.win = win; this.shadow = shadow; this.mode = null;
        this.el.setObject3D('mesh', holder);
        this.A.init(this.st, T.w, T.h);
        var target = this.el.parentNode;
        target.addEventListener('targetFound', function () { self.active = true; self.t0 = performance.now(); self.mode = MODE; if (window.DPSound) window.DPSound.scene(T.sound || null); if (self.A.onFound) self.A.onFound(); var h = document.getElementById('hint'); if (h) h.hidden = true; });
        target.addEventListener('targetLost', function () { self.active = false; if (window.DPSound) window.DPSound.scene(null); flat.visible = false; root.visible = false; var h = document.getElementById('hint'); if (h) h.hidden = false; });
      },
      tick: function () {
        if (!this.active) return;
        if (this.mode !== MODE) { this.mode = MODE; this.t0 = performance.now(); }
        var T = this.T, ctx = this.ctx, t = (performance.now() - this.t0) / 1000;
        ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
        if (MODE === 'flat') {
          this.root.visible = false; this.flat.visible = true;
          ctx.setTransform(this.S, 0, 0, this.S, T.m * this.S, T.m * this.S); drawAll(ctx, t, this.st, T);
        } else {
          this.flat.visible = false; this.root.visible = true;
          var pb = clamp01(t / 0.5), pw = clamp01((t - 0.35) / 1.05);
          this.base.scale.set(1, 1, Math.max(0.02, easeOutBack(pb)));
          this.base.position.z = 0.03 * Math.max(0.02, easeOutBack(pb));
          this.hinge.rotation.x = 1.15 * easeOutBack(pw) + (pw >= 1 ? Math.sin(t * 1.1) * 0.04 : 0);
          var sc = 0.55 + 0.45 * easeOutBack(pw); this.win.scale.set(sc, sc, sc);
          this.win.rotation.y = pw >= 1 ? Math.sin(t * 0.7) * 0.06 : 0;
          this.shadow.material.opacity = 0.25 * pw;
          if (t > 0.9) { ctx.setTransform(this.S, 0, 0, this.S, T.m * this.S, T.m * this.S); drawAll(ctx, t - 0.9, this.st, T); }
        }
        this.tex.needsUpdate = true;
      }
    });
  }

  function buildScene(holder) {
    var ents = TARGETS.map(function (T, i) {
      return '<a-entity mindar-image-target="targetIndex: ' + i + '"><a-entity dp-anim="index: ' + i + '" position="0 0 0.002"></a-entity></a-entity>';
    }).join('');
    holder.innerHTML = '<a-scene mindar-image="imageTargetSrc: ./targets.mind; maxTrack: 1; filterMinCF: 0.0001; filterBeta: 0.001" color-space="sRGB" renderer="colorManagement: true; alpha: true" vr-mode-ui="enabled: false" device-orientation-permission-ui="enabled: false" embedded style="position:absolute;top:0;left:0;width:100%;height:100%">' +
      '<a-camera position="0 0 0" look-controls="enabled: false"></a-camera><a-entity light="type: ambient; intensity: 0.9"></a-entity><a-entity light="type: directional; intensity: 0.8" position="0.5 1 1"></a-entity>' + ents + '</a-scene>';
  }

  window.DPAR = { TARGETS: TARGETS, ANIMS: ANIMS, drawAll: drawAll, buildScene: buildScene, setMode: setMode, getMode: function () { return MODE; } };
})();
