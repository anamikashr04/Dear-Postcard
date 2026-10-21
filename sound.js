/* Dear Postcard – ambient sound, made live with Web Audio (no audio files).
   Scenes: 'monsoon' (rain + soft flute, thunder on cue), 'village' (flute + crickets). */
(function () {
  var ctx = null, master = null, on = true, scene = null, nodes = [], timers = [];
  try { on = localStorage.getItem('dp-sound') !== 'off'; } catch (e) {}
  function ac() {
    if (!ctx) { var C = window.AudioContext || window.webkitAudioContext; if (!C) return null; ctx = new C(); master = ctx.createGain(); master.gain.value = on ? 1 : 0; master.connect(ctx.destination); }
    if (ctx.state === 'suspended') ctx.resume();
    return ctx;
  }
  function noiseBuf(sec, pink) {
    var n = Math.floor(ctx.sampleRate * sec), b = ctx.createBuffer(1, n, ctx.sampleRate), d = b.getChannelData(0), l = 0;
    for (var i = 0; i < n; i++) { var w = Math.random() * 2 - 1; l = pink ? (l * 0.97 + w * 0.03) * 1 : w; d[i] = pink ? l * 6 : w; }
    return b;
  }
  function stopAll() {
    timers.forEach(clearTimeout); timers = [];
    nodes.forEach(function (n) { try { if (n.gain) { n.gain.setTargetAtTime(0, ctx.currentTime, 0.4); } else n.stop(ctx.currentTime + 1.5); } catch (e) {} });
    nodes = [];
  }
  function rain() {
    var src = ctx.createBufferSource(); src.buffer = noiseBuf(4, false); src.loop = true;
    var hp = ctx.createBiquadFilter(); hp.type = 'highpass'; hp.frequency.value = 900;
    var lp = ctx.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = 6000;
    var g = ctx.createGain(); g.gain.value = 0; g.gain.setTargetAtTime(0.16, ctx.currentTime, 1.0);
    src.connect(hp); hp.connect(lp); lp.connect(g); g.connect(master); src.start();
    var src2 = ctx.createBufferSource(); src2.buffer = noiseBuf(5, true); src2.loop = true;
    var lp2 = ctx.createBiquadFilter(); lp2.type = 'lowpass'; lp2.frequency.value = 500;
    var g2 = ctx.createGain(); g2.gain.value = 0; g2.gain.setTargetAtTime(0.10, ctx.currentTime, 1.0);
    src2.connect(lp2); lp2.connect(g2); g2.connect(master); src2.start();
    nodes.push(src, g, src2, g2);
  }
  function thunder(strength) {
    if (!ctx || scene !== 'monsoon') return;
    var s = strength || 1, t0 = ctx.currentTime;
    var src = ctx.createBufferSource(); src.buffer = noiseBuf(5, true);
    var lp = ctx.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.setValueAtTime(900, t0); lp.frequency.exponentialRampToValueAtTime(90, t0 + 3.5);
    var g = ctx.createGain(); g.gain.setValueAtTime(0.0001, t0); g.gain.exponentialRampToValueAtTime(0.9 * s, t0 + 0.08);
    g.gain.setValueAtTime(0.9 * s, t0 + 0.3); g.gain.exponentialRampToValueAtTime(0.35 * s, t0 + 1.2); g.gain.exponentialRampToValueAtTime(0.0001, t0 + 4.8);
    src.connect(lp); lp.connect(g); g.connect(master); src.start(t0); src.stop(t0 + 5);
    var c = ctx.createBufferSource(); c.buffer = noiseBuf(0.4, false);
    var hp = ctx.createBiquadFilter(); hp.type = 'highpass'; hp.frequency.value = 1500;
    var cg = ctx.createGain(); cg.gain.setValueAtTime(0.25 * s, t0); cg.gain.exponentialRampToValueAtTime(0.0001, t0 + 0.35);
    c.connect(hp); hp.connect(cg); cg.connect(master); c.start(t0);
  }
  /* bansuri-like flute: sine + vibrato + breath, a gentle pentatonic phrase */
  var PHRASES = [[[62, 1], [64, 1], [67, 2], [69, 1], [67, 1], [64, 2], [62, 3]], [[67, 1], [69, 1], [71, 2], [69, 1], [67, 1], [64, 1], [62, 1], [64, 3]], [[74, 2], [71, 1], [69, 1], [67, 2], [64, 1], [67, 3]]];
  function note(m, t, dur, vol) {
    var f = 440 * Math.pow(2, (m - 69) / 12);
    var o = ctx.createOscillator(); o.type = 'sine'; o.frequency.value = f;
    var o2 = ctx.createOscillator(); o2.type = 'triangle'; o2.frequency.value = f * 2;
    var vib = ctx.createOscillator(); vib.frequency.value = 5.2; var vg = ctx.createGain(); vg.gain.value = f * 0.006; vib.connect(vg); vg.connect(o.frequency); vg.connect(o2.frequency);
    var g = ctx.createGain(); g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(vol, t + 0.08); g.gain.setTargetAtTime(vol * 0.8, t + 0.1, 0.3); g.gain.setTargetAtTime(0.0001, t + dur - 0.05, 0.08);
    var g2 = ctx.createGain(); g2.gain.value = 0.12;
    var br = ctx.createBufferSource(); br.buffer = noiseBuf(dur + 0.2, false); var bp = ctx.createBiquadFilter(); bp.type = 'bandpass'; bp.frequency.value = f * 2; bp.Q.value = 3; var bg = ctx.createGain(); bg.gain.value = 0.05;
    o.connect(g); o2.connect(g2); g2.connect(g); br.connect(bp); bp.connect(bg); bg.connect(g); g.connect(master);
    [o, o2, vib, br].forEach(function (n) { n.start(t); n.stop(t + dur + 0.3); });
  }
  function flute(vol, gap) {
    var loop = function () {
      if (!scene) return;
      var p = PHRASES[Math.floor(Math.random() * PHRASES.length)], t = ctx.currentTime + 0.1, beat = 0.42;
      p.forEach(function (n) { note(n[0], t, n[1] * beat, vol); t += n[1] * beat; });
      timers.push(setTimeout(loop, (t - ctx.currentTime) * 1000 + gap));
    };
    timers.push(setTimeout(loop, 1200));
  }
  function crickets() {
    var loop = function () {
      if (!scene) return;
      var t = ctx.currentTime + 0.05, f = 4200 + Math.random() * 900;
      for (var k = 0; k < 3; k++) {
        var o = ctx.createOscillator(); o.frequency.value = f; var g = ctx.createGain();
        var tt = t + k * 0.09; g.gain.setValueAtTime(0.0001, tt); g.gain.exponentialRampToValueAtTime(0.025, tt + 0.01); g.gain.exponentialRampToValueAtTime(0.0001, tt + 0.06);
        o.connect(g); g.connect(master); o.start(tt); o.stop(tt + 0.08);
      }
      timers.push(setTimeout(loop, 500 + Math.random() * 1400));
    };
    loop();
  }
  var SAMPLES = {};
  function sample(url, cb) {
    if (SAMPLES[url]) { if (SAMPLES[url].buf) cb(SAMPLES[url].buf); return; }
    SAMPLES[url] = {}; fetch(url).then(function (r) { return r.arrayBuffer(); }).then(function (a) { return new Promise(function (ok, no) { ctx.decodeAudioData(a, ok, no); }); }).then(function (b) { SAMPLES[url].buf = b; cb(b); }).catch(function () {});
  }
  function playSample(url, vol) { sample(url, function (b) { if (!scene) return; var s = ctx.createBufferSource(), g = ctx.createGain(); g.gain.value = vol; s.buffer = b; s.connect(g); g.connect(master); s.start(); }); }
  function setScene(name) {
    if (name === scene) return;
    if (!ac()) return;
    stopAll(); scene = name || null;
    if (scene === 'monsoon') { rain(); flute(0.05, 7000); }
    if (scene === 'village') { flute(0.07, 3000); crickets(); }
    if (scene === 'fah') { var loopF = function () { if (scene !== 'fah') return; playSample('assets/fahhh.mp3', 0.9); timers.push(setTimeout(loopF, 4500)); }; timers.push(setTimeout(loopF, 300)); }
  }
  function setEnabled(v) {
    on = !!v; try { localStorage.setItem('dp-sound', on ? 'on' : 'off'); } catch (e) {}
    if (ac()) master.gain.setTargetAtTime(on ? 1 : 0, ctx.currentTime, 0.1);
    return on;
  }
  window.DPSound = { unlock: ac, scene: setScene, thunder: thunder, setEnabled: setEnabled, isOn: function () { return on; } };
})();
