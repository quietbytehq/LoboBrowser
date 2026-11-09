"use strict";
// Centre line of the gold ring, traced from the logo (512 px space), lower-left to top-right.
const ARC = [[105.5, 383.6], [108.6, 384.0], [111.8, 384.3], [114.9, 384.8], [118.0, 385.1], [121.2, 385.4], [124.3, 385.6], [127.5, 385.8], [130.6, 386.0], [133.8, 386.0], [136.9, 385.8], [140.1, 385.6], [143.2, 385.5], [146.4, 385.2], [149.5, 384.8], [152.6, 384.5], [155.8, 384.4], [158.9, 384.2], [162.1, 384.0], [165.2, 383.9], [168.4, 383.8], [171.5, 383.6], [174.7, 383.3], [177.8, 382.9], [180.9, 382.4], [184.0, 381.9], [187.1, 381.3], [190.2, 380.7], [193.3, 380.0], [196.4, 379.3], [199.5, 378.7], [202.6, 378.0], [205.6, 377.3], [208.7, 376.7], [211.8, 376.1], [215.0, 375.9], [218.1, 376.1], [221.3, 376.4], [224.4, 376.7], [227.5, 377.1], [230.7, 377.4], [233.8, 377.1], [236.9, 376.5], [240.0, 375.8], [243.0, 374.8], [245.8, 373.4], [248.3, 371.5], [250.6, 369.3], [252.8, 367.1], [255.0, 364.9], [257.3, 362.7], [259.9, 360.9], [262.8, 359.6], [265.8, 358.6], [268.8, 357.6], [271.8, 356.7], [274.8, 355.8], [277.8, 354.9], [280.8, 353.9], [283.8, 352.9], [286.7, 351.6], [289.6, 350.3], [292.4, 348.9], [295.3, 347.6], [298.1, 346.2], [300.9, 344.7], [303.7, 343.3], [306.5, 341.8], [309.2, 340.3], [312.0, 338.8], [314.8, 337.2], [317.5, 335.7], [320.2, 334.1], [322.9, 332.5], [325.6, 330.8], [328.3, 329.2], [331.0, 327.5], [333.6, 325.7], [336.2, 323.9], [338.7, 322.0], [341.3, 320.2], [343.8, 318.3], [346.1, 316.1], [348.2, 313.8], [350.5, 311.6], [353.3, 310.1], [356.2, 308.8], [359.2, 308.0], [362.3, 307.6], [365.5, 307.6], [368.6, 307.0], [371.5, 305.9], [374.4, 304.5], [377.1, 303.0], [379.8, 301.3], [382.4, 299.5], [384.9, 297.6], [387.3, 295.6], [389.7, 293.6], [392.2, 291.5], [394.6, 289.5], [396.9, 287.4], [399.3, 285.3], [401.7, 283.2], [404.0, 281.1], [406.4, 279.0], [408.7, 276.9], [410.9, 274.7], [413.2, 272.5], [415.4, 270.2], [417.6, 267.9], [419.7, 265.6], [421.8, 263.2], [423.8, 260.8], [425.9, 258.4], [427.9, 256.0], [429.8, 253.5], [431.8, 251.1], [433.7, 248.6], [435.6, 246.1], [437.5, 243.5], [439.4, 241.0], [441.2, 238.4], [443.0, 235.8], [444.8, 233.2], [446.4, 230.5], [447.8, 227.7], [449.1, 224.8], [450.1, 221.8], [450.3, 218.7], [449.7, 215.6], [448.9, 212.5], [448.2, 209.4], [447.7, 206.3], [447.4, 203.2], [447.6, 200.1], [448.5, 197.0], [449.6, 194.1], [450.7, 191.1], [451.7, 188.1], [452.5, 185.1], [453.2, 182.0], [453.8, 178.9], [454.2, 175.8], [454.6, 172.6], [454.7, 169.5], [454.7, 166.3], [454.6, 163.2], [454.4, 160.0], [454.0, 156.9], [453.6, 153.8], [453.1, 150.7], [452.7, 147.5], [452.5, 144.4], [452.6, 141.2], [452.8, 138.1], [453.0, 134.9], [453.1, 131.8], [453.3, 128.6], [453.0, 125.5]];
const S = 300/512, OX = 330, OY = 90;           // logo is drawn at 300 px, top-left (330, 90)
const pts = ARC.map(([x,y]) => [OX + x*S, OY + y*S]);
const $ = id => document.getElementById(id);
const fx = $('fx').getContext('2d');
const loop = location.search.includes('loop');
const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
const clamp = v => Math.max(0, Math.min(1, v));
const ease = t => 1 - Math.pow(1 - t, 3);                     // ease-out
const inout = t => t < .5 ? 4*t*t*t : 1 - Math.pow(-2*t + 2, 3)/2;
const span = (t, a, b) => clamp((t - a) / (b - a));

function at(p) {                                             // point at fraction p along the ring
  const f = p * (pts.length - 1), i = Math.floor(f), k = f - i;
  const [x1,y1] = pts[i], [x2,y2] = pts[Math.min(i+1, pts.length-1)];
  return [x1 + (x2-x1)*k, y1 + (y2-y1)*k];
}

function frame(t) {                                           // t in milliseconds
  const bg = ease(span(t, 0, 400));
  $('s').style.opacity = bg;
  const g = ease(span(t, 200, 1000));
  $('glow').style.opacity = g * (0.85 + 0.15*Math.sin(t/600));
  $('glow').style.transform = `scale(${0.7 + 0.3*g})`;
  const l = ease(span(t, 150, 850));
  $('logo').style.opacity = l;
  $('logo').style.transform = `scale(${0.88 + 0.12*l})`;
  const w = ease(span(t, 1100, 1600)), tg = ease(span(t, 1400, 1900));
  $('word').style.opacity = w; $('word').style.transform = `translateY(${12*(1-w)}px)`;
  $('tag').style.opacity = tg; $('tag').style.transform = `translateY(${8*(1-tg)}px)`;
  $('bar').style.transform = `scaleX(${inout(span(t, 1500, 2600))})`;

  // golden glint: one trip along the ring, with a fading trail
  fx.clearRect(0, 0, 960, 600);
  const q = span(t, 700, 2100);
  if (q > 0 && q < 1) {
    const p = inout(q), fade = Math.sin(Math.PI * q);
    for (let j = 14; j >= 0; j--) {
      const pp = p - j*0.012; if (pp < 0) continue;
      const [x, y] = at(pp), r = 24 - j*1.1, alpha = fade * (1 - j/15);
      const grd = fx.createRadialGradient(x, y, 0, x, y, r);
      grd.addColorStop(0, `rgba(255,255,245,${alpha})`);
      grd.addColorStop(0.15, `rgba(255,240,190,${alpha})`);
      grd.addColorStop(0.45, `rgba(255,190,70,${alpha*0.55})`);
      grd.addColorStop(1, 'rgba(255,170,40,0)');
      fx.fillStyle = grd; fx.beginPath(); fx.arc(x, y, r, 0, 7); fx.fill();
    }
  }

  // a short star sparkle on the globe's highlight as the glint ends
  const k = span(t, 1950, 2500);
  if (k > 0 && k < 1) {
    const a = Math.sin(Math.PI * k), x = OX + 152*S, y = OY + 118*S, len = 10 + 26*a;
    fx.save(); fx.translate(x, y); fx.rotate(k * 0.6);
    const sg = fx.createRadialGradient(0, 0, 0, 0, 0, len);
    sg.addColorStop(0, `rgba(255,255,255,${a})`); sg.addColorStop(1, 'rgba(160,210,255,0)');
    fx.fillStyle = sg;
    for (let r = 0; r < 4; r++) { fx.rotate(Math.PI/2); fx.beginPath(); fx.moveTo(0, -2.2); fx.lineTo(len, 0); fx.lineTo(0, 2.2); fx.fill(); }
    fx.beginPath(); fx.arc(0, 0, 5*a, 0, 7); fx.fill(); fx.restore();
  }
}

const TOTAL = 2600, PAUSE = 1400;
if (reduce) frame(TOTAL);                                       // reduce-motion: final frame only
else {
  const t0 = performance.now();
  (function tick(now) {
    let t = now - t0;
    if (loop) t = t % (TOTAL + PAUSE);
    frame(Math.min(t, TOTAL));
    if (loop || t < TOTAL) requestAnimationFrame(tick);
  })(t0);
}
