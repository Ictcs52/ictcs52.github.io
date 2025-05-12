// js/hz-full.js

window.addEventListener('DOMContentLoaded', () => {
  // Lookup table: L★/L⊙ Avg (ค่าจาก Excel)
  const avgLumData = {
    "O5": 845999.98, "O6": 274999.99, "O7": 220000.00, "O8": 150000.00, "O9": 95000.00,
    "B0": 20000.00,  "B1": 4600.00,   "B2": 2600.00,   "B3": 900.00,    "B5": 360.00,
    "B6": 250.00,    "B7": 175.00,    "B8": 100.00,    "B9": 62.00,     "Bave": 1430.94,
    "A0": 22.00,     "A1": 18.00,     "A2": 15.00,     "A3": 12.00,     "A4": 10.00,
    "A5": 9.00,      "A7": 6.70,      "Aave": 13.16,
    "F0": 4.30,      "F2": 3.30,      "F3": 2.80,      "F5": 2.40,      "F6": 2.10,
    "F7": 1.80,      "F8": 1.70,
    "G2": 1.00,      "G5": 0.86,      "G8": 0.68,      "Gave": 0.56,
    "K0": 0.54,      "K1": 0.46,      "K2": 0.38,      "K3": 0.31,      "K4": 0.24,
    "K5": 0.19,      "K7": 0.10,      "Kave": 0.12,
    "M0": 0.07,      "M1": 0.06,      "M2": 0.05,      "M3": 0.05,      "M4": 0.02,
    "M5": 0.03,      "M6": 0.02,      "M7": 0.01,      "M8": 0.01,      "Mave": 0.01
  };

  // Conversion factor
  const AU_TO_M = 1.496e11; // 1 AU = 1.496 × 10^11 meters

  // Store raw radii in AU
  let rawInnerAU = 0;
  let rawOuterAU = 0;

  // DOM refs
  const spectralType = document.getElementById('spectralType');
  const subType      = document.getElementById('subType');
  const lumAvg       = document.getElementById('lumAvg');
  const btnTypeShow  = document.getElementById('btnTypeShow');
  const typeResult   = document.getElementById('typeResult');
  const minR         = document.getElementById('minR');
  const maxR         = document.getElementById('maxR');
  const btnShowMin   = document.getElementById('btnShowMin');
  const btnShowMax   = document.getElementById('btnShowMax');
  const btnShowAll   = document.getElementById('btnShowAll');
  const unitSelect   = document.getElementById('unitSelect');
  const btnUpdate    = document.getElementById('btnUpdate');
  const loDetails    = document.getElementById('loDetails');

  // Canvas setup
  const canvas = document.getElementById('hzCanvas');
  const ctx    = canvas.getContext('2d');
  canvas.width  = canvas.parentElement.clientWidth;
  canvas.height = 300;

  // Layout constants
  const STAR_RADIUS  = 20;
  const MARGIN_LEFT  = STAR_RADIUS + 20;
  const MARGIN_RIGHT = 20;

  // Compute HZ radii (AU)
  function computeHZ(L) {
    const s = Math.sqrt(L);
    return { inner: 0.75 * s, outer: 1.77 * s };
  }

  // Convert and display inputs
  function updateInputs() {
    const unit = unitSelect.value;
    if (unit === 'm') {
      minR.value = (rawInnerAU * AU_TO_M).toExponential(2);
      maxR.value = (rawOuterAU * AU_TO_M).toExponential(2);
    } else {
      minR.value = rawInnerAU.toFixed(2);
      maxR.value = rawOuterAU.toFixed(2);
    }
  }

  // Clear canvas
  function clearCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  }

  // Draw baseline & star
  function drawBase() {
    const y = canvas.height / 2;
    ctx.beginPath(); ctx.moveTo(MARGIN_LEFT, y); ctx.lineTo(canvas.width - MARGIN_RIGHT, y);
    ctx.strokeStyle = '#333'; ctx.lineWidth = 2; ctx.stroke();
    ctx.beginPath(); ctx.arc(MARGIN_LEFT, y, STAR_RADIUS, 0, 2 * Math.PI);
    ctx.fillStyle = '#FFD700'; ctx.fill(); ctx.strokeStyle = '#FFA500'; ctx.lineWidth = 2; ctx.stroke();
    return y;
  }

  // Draw shading half-ring
  function drawHZ(y, pxMin, pxMax) {
    ctx.beginPath(); ctx.moveTo(MARGIN_LEFT + pxMin, y);
    ctx.arc(MARGIN_LEFT, y, pxMin, 0, Math.PI, true);
    ctx.lineTo(MARGIN_LEFT + pxMax, y);
    ctx.arc(MARGIN_LEFT, y, pxMax, Math.PI, 0, false);
    ctx.closePath(); ctx.fillStyle = 'rgba(144,238,144,0.5)'; ctx.fill();
  }

  // Draw boundary arc
  function drawHalfArc(y, px, color) {
    ctx.beginPath(); ctx.arc(MARGIN_LEFT, y, px, Math.PI/2, -Math.PI/2, true);
    ctx.strokeStyle = color; ctx.lineWidth = 2; ctx.stroke();
  }

  // Draw marker + labels
  function drawMarkerWithLabel(y, px, color, degLabel, distAU) {
    const r = 8;
    const cx = MARGIN_LEFT + px;
    ctx.beginPath(); ctx.arc(cx, y, r, Math.PI*1.25, Math.PI*1.75);
    ctx.strokeStyle = color; ctx.lineWidth = 2; ctx.stroke();
    ctx.fillStyle = '#007bff'; ctx.font = '14px Arial';
    const twDeg = ctx.measureText(degLabel).width; ctx.fillText(degLabel, cx - twDeg/2 + 20, y - r - 16);
    const unit = unitSelect.value;
    const dist = unit === 'm' ? distAU * AU_TO_M : distAU;
    const text = unit === 'm' ? dist.toExponential(2) + ' m' : dist.toFixed(2) + ' AU';
    const tw = ctx.measureText(text).width;
    let dx = cx - tw/2 - 40;
    if (dx < MARGIN_LEFT) dx = MARGIN_LEFT;
    if (dx + tw > canvas.width - MARGIN_RIGHT) dx = canvas.width - MARGIN_RIGHT - tw;
    ctx.fillText(text, dx, y + r + 40);
  }

  // Render functions
  function showInner() {
    clearCanvas(); const y = drawBase(); const scale = (canvas.width - MARGIN_LEFT - MARGIN_RIGHT) / rawOuterAU;
    const px = rawInnerAU * scale; drawHalfArc(y, px, '#006400'); drawMarkerWithLabel(y, px, '#006400', '100°', rawInnerAU);
  }
  function showOuter() {
    clearCanvas(); const y = drawBase(); const scale = (canvas.width - MARGIN_LEFT - MARGIN_RIGHT) / rawOuterAU;
    const px = rawOuterAU * scale; drawHalfArc(y, px, '#228B22'); drawMarkerWithLabel(y, px, '#228B22', '0°', rawOuterAU);
  }
  function showAll() {
    clearCanvas(); const y = drawBase(); const scale = (canvas.width - MARGIN_LEFT - MARGIN_RIGHT) / rawOuterAU;
    const pxMin = rawInnerAU * scale; const pxMax = rawOuterAU * scale;
    drawHZ(y, pxMin, pxMax); 
    drawHalfArc(y, pxMin, '#fff'); 
    drawHalfArc(y, pxMax, '#fff');
    drawMarkerWithLabel(y, pxMin, '#006400', '100°', rawInnerAU); 
    drawMarkerWithLabel(y, pxMax, '#228B22', '0°', rawOuterAU);
    // update details panel
    const unit = unitSelect.value;
    const dMin = unit === 'm' ? rawInnerAU * AU_TO_M : rawInnerAU;
    const dMax = unit === 'm' ? rawOuterAU * AU_TO_M : rawOuterAU;
    const w = dMax - dMin;
    loDetails.innerHTML = `
      <div><strong>Inner (100 °C):</strong> ${unit==='m'? dMin.toExponential(2): dMin.toFixed(2)} ${unit==='m'?'m':'AU'}</div>
      <div><strong>Outer (0 °C):</strong> ${unit==='m'? dMax.toExponential(2): dMax.toFixed(2)} ${unit==='m'?'m':'AU'}</div>
      <div><strong>Width:</strong> ${unit==='m'? w.toExponential(2): w.toFixed(2)} ${unit==='m'?'m':'AU'}</div>
    `;
  }

  // Event handlers
  btnTypeShow.addEventListener('click', () => {
    const key = spectralType.value + subType.value; const avg = avgLumData[key] || 0;
    lumAvg.value = avg ? avg.toFixed(2) : '–'; const { inner, outer } = computeHZ(avg);
    rawInnerAU = inner; rawOuterAU = outer; updateInputs();
    // update typeResult panel for student feedback
    typeResult.innerHTML = `
      <div><strong>L★/L⊙ Avg:</strong> ${avg ? avg.toFixed(2) : '–'}</div>
      <div><strong>rₘᵢₙ (100 °C):</strong> ${inner.toFixed(2)} AU</div>
      <div><strong>rₒᵤₜ (0 °C):</strong> ${outer.toFixed(2)} AU</div>
    `;
  });
  btnShowMin.addEventListener('click', showInner);
  btnShowMax.addEventListener('click', showOuter);
  btnShowAll.addEventListener('click', showAll);
  unitSelect.addEventListener('change', updateInputs);
  btnUpdate.addEventListener('click', showAll);

  // Reset on filters change
  [spectralType, subType].forEach(el => el.addEventListener('change', () => {
    lumAvg.value='–'; minR.value=''; maxR.value=''; typeResult.innerHTML=''; loDetails.innerHTML=''; clearCanvas();
  }));
});
