const canvas = document.getElementById('hzCanvas');
const ctx = canvas.getContext('2d');

const spectralTypeTop = document.getElementById('spectralTypeTop');
const subTypeTop = document.getElementById('subTypeTop');
const lumInputTop = document.getElementById('lumInputTop');
const btnShowTop = document.getElementById('btnShowTop');

const chkInner = document.getElementById('chkInner');
const chkCenter = document.getElementById('chkCenter');
const chkOuter = document.getElementById('chkOuter');
const unitSelect = document.getElementById('unitSelect');
const btnUpdate = document.getElementById('btnUpdate');

let currentL = parseFloat(lumInputTop.value);

// Conversion
const AU_IN_M = 1.496e11;

// Compute zones
function computeHZ(L) {
  const sq = Math.sqrt(L);
  return {
    inner: 0.75 * sq,
    center: 1.00 * sq,
    outer: 1.77 * sq
  };
}

// Draw zones
function drawZones() {
  const { inner, center, outer } = computeHZ(currentL);
  const showInner = chkInner.checked;
  const showCenter = chkCenter.checked;
  const showOuter = chkOuter.checked;
  const unit = unitSelect.value;

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  const cx = 150, cy = canvas.height/2;
  const scale = 100; // pixels per AU base

  // Helper: radius in px
  function rad(au) { return au * scale; }

  // Outer
  if (showOuter) {
    ctx.beginPath();
    ctx.arc(cx, cy, rad(outer), 0, 2*Math.PI);
    ctx.fillStyle = 'rgba(100,200,100,0.3)';
    ctx.fill();
    ctx.strokeStyle = '#228B22';
    ctx.lineWidth = 2;
    ctx.stroke();
  }
  // Center
  if (showCenter) {
    ctx.beginPath();
    ctx.arc(cx, cy, rad(center), 0, 2*Math.PI);
    ctx.setLineDash([5,5]);
    ctx.strokeStyle = '#006400';
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.setLineDash([]);
  }
  // Inner
  if (showInner) {
    // cut-out
    ctx.globalCompositeOperation = 'destination-out';
    ctx.beginPath();
    ctx.arc(cx, cy, rad(inner), 0, 2*Math.PI);
    ctx.fill();
    ctx.globalCompositeOperation = 'source-over';
    // stroke boundary
    ctx.beginPath();
    ctx.arc(cx, cy, rad(inner), 0, 2*Math.PI);
    ctx.strokeStyle = '#006400';
    ctx.lineWidth = 2;
    ctx.stroke();
  }
  // Star
  ctx.beginPath();
  ctx.arc(cx, cy, 20, 0, 2*Math.PI);
  ctx.fillStyle = '#FFD700';
  ctx.fill();
  ctx.strokeStyle = '#FFA500';
  ctx.lineWidth = 2;
  ctx.stroke();

  // Legend text
  ctx.fillStyle = '#000';
  ctx.font = '16px Arial';
  let unitLabel = unit === 'm' ? 'm' : 'AU';
  let conv = unit === 'm' ? AU_IN_M : 1;
  ctx.fillText(`Inner: ${(inner*conv).toFixed(2)} ${unitLabel}`, 400, 50);
  ctx.fillText(`Center: ${(center*conv).toFixed(2)} ${unitLabel}`, 400, 80);
  ctx.fillText(`Outer: ${(outer*conv).toFixed(2)} ${unitLabel}`, 400, 110);
}

// Event handlers
btnShowTop.addEventListener('click', () => {
  const Lval = parseFloat(lumInputTop.value);
  if (!isNaN(Lval) && Lval>0) currentL = Lval;
  drawZones();
});
btnUpdate.addEventListener('click', drawZones);

// Initial draw
drawZones();
