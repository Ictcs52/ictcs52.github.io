const canvas   = document.getElementById('hzCanvas');
const ctx      = canvas.getContext('2d');
const lumRange = document.getElementById('lumRange');
const lumValue = document.getElementById('lumValue');
const rhInner  = document.getElementById('rhInner');
const rhCenter = document.getElementById('rhCenter');
const rhOuter  = document.getElementById('rhOuter');

// คำนวณ HZ ตามสูตร
function computeHZ(L) {
  const sq = Math.sqrt(L);
  return {
    inner: 0.75 * sq,
    center: 1.00 * sq,
    outer: 1.77 * sq
  };
}

// วาดดาว + วงแหวน HZ 3 ชั้น
function drawHZ(L) {
  const { inner, center, outer } = computeHZ(L);

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  const centerX = 100;
  const centerY = canvas.height / 2;
  const scale   = 60;   // แปลง AU → px
  const starR   = 20;   // px

  // วาด outer zone
  ctx.beginPath();
  ctx.arc(centerX, centerY, outer * scale, 0, 2 * Math.PI);
  ctx.fillStyle   = 'rgba(100,200,100,0.3)';
  ctx.fill();
  ctx.strokeStyle = '#228B22';
  ctx.lineWidth   = 2;
  ctx.stroke();

  // วาด center ring (เส้นประ)
  ctx.beginPath();
  ctx.arc(centerX, centerY, center * scale, 0, 2 * Math.PI);
  ctx.setLineDash([5, 5]);
  ctx.strokeStyle = '#006400';
  ctx.lineWidth   = 2;
  ctx.stroke();
  ctx.setLineDash([]);

  // วาด inner zone ตัดวงกลมตรงกลาง
  ctx.globalCompositeOperation = 'destination-out';
  ctx.beginPath();
  ctx.arc(centerX, centerY, inner * scale, 0, 2 * Math.PI);
  ctx.fill();
  ctx.globalCompositeOperation = 'source-over';

  // วาดขอบ inner
  ctx.beginPath();
  ctx.arc(centerX, centerY, inner * scale, 0, 2 * Math.PI);
  ctx.strokeStyle = '#006400';
  ctx.lineWidth   = 2;
  ctx.stroke();

  // วาดดาวตรงกลาง
  ctx.beginPath();
  ctx.arc(centerX, centerY, starR, 0, 2 * Math.PI);
  ctx.fillStyle   = '#FFD700';
  ctx.fill();
  ctx.strokeStyle = '#FFA500';
  ctx.lineWidth   = 2;
  ctx.stroke();
}

// อัปเดตค่าเมื่อ slider เปลี่ยน
lumRange.addEventListener('input', () => {
  const L = parseFloat(lumRange.value);
  const { inner, center, outer } = computeHZ(L);

  lumValue.textContent  = L.toFixed(2);
  rhInner.textContent   = inner.toFixed(2);
  rhCenter.textContent  = center.toFixed(2);
  rhOuter.textContent   = outer.toFixed(2);

  drawHZ(L);
});

// เริ่มต้นด้วย L★/L⊙ = 1
drawHZ(1);
