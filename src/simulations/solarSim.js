import { getCanvasPoint, setupHiDPICanvas } from './canvasHelper.js';

export function mountSolarSimulation(container) {
  const canvas = container.querySelector('#sim-canvas');
  const speedSlider = container.querySelector('#orbit-speed');
  const speedVal = container.querySelector('#orbit-speed-val');
  const orbitLinesCheckbox = container.querySelector('#orbit-lines');
  const planetInfoPill = container.querySelector('#planet-info-pill');
  const pauseBtn = container.querySelector('#btn-sim-pause');

  const { ctx, width, height } = setupHiDPICanvas(canvas, 900, 380);
  const cx = width / 2;
  const cy = height / 2;
  let paused = false;
  let rafId = null;

  const planets = [
    { name: 'Merkurius', dist: 60, r: 6, speed: 0.032, angle: 0.4, color: '#B8B2A6', fact: 'Merkurius: Planet terkecil & tercepat (1 tahun = 88 hari Bumi).' },
    { name: 'Venus', dist: 94, r: 9, speed: 0.022, angle: 1.8, color: '#FFD66B', fact: 'Venus: Planet terpanas karena efek rumah kaca atmosfer CO₂ yang tebal.' },
    { name: 'Bumi', dist: 134, r: 10, speed: 0.016, angle: 3.1, color: '#75B9E7', fact: 'Bumi: Satu-satunya planet yang diketahui memiliki air cair di permukaan.' },
    { name: 'Mars', dist: 174, r: 8, speed: 0.012, angle: 5.0, color: '#F28F83', fact: 'Mars: Memiliki gunung berapi tertinggi di Tata Surya, Olympus Mons.' },
    { name: 'Jupiter', dist: 230, r: 18, speed: 0.007, angle: 2.3, color: '#E8B87D', fact: 'Jupiter: Planet terbesar, massanya lebih dari 2x gabungan seluruh planet lain!' }
  ];

  function onCanvasClick(e) {
    const pt = getCanvasPoint(canvas, e.clientX, e.clientY, width, height);
    for (const p of planets) {
      const px = cx + Math.cos(p.angle) * p.dist * 1.45;
      const py = cy + Math.sin(p.angle) * p.dist * 0.72;
      if (Math.hypot(pt.x - px, pt.y - py) <= p.r + 16) {
        planetInfoPill.textContent = p.fact;
        canvas.dataset.selectedPlanet = p.name;
        break;
      }
    }
  }

  function onSpeedInput() {
    speedVal.textContent = `${speedSlider.value}x`;
  }

  function onTogglePause() {
    paused = !paused;
    pauseBtn.textContent = paused ? 'Lanjutkan' : 'Jeda';
    canvas.dataset.simState = paused ? 'paused' : 'running';
  }

  canvas.addEventListener('click', onCanvasClick);
  speedSlider.addEventListener('input', onSpeedInput);
  pauseBtn.addEventListener('click', onTogglePause);
  canvas.dataset.simState = 'running';

  function frame() {
    const speedMult = paused ? 0 : parseFloat(speedSlider.value);
    const showLines = orbitLinesCheckbox.checked;

    ctx.fillStyle = '#232730';
    ctx.fillRect(0, 0, width, height);

    ctx.fillStyle = '#FFF8E9';
    for (let i = 0; i < 36; i++) {
      ctx.fillRect((i * 197) % width, (i * 89) % height, 2.5, 2.5);
    }

    // Sun
    ctx.beginPath();
    ctx.arc(cx, cy, 26, 0, Math.PI * 2);
    ctx.fillStyle = '#FFD66B';
    ctx.fill();
    ctx.lineWidth = 3;
    ctx.strokeStyle = '#F28F83';
    ctx.stroke();

    for (const p of planets) {
      p.angle += p.speed * speedMult;
      const rx = p.dist * 1.45;
      const ry = p.dist * 0.72;

      if (showLines) {
        ctx.beginPath();
        ctx.ellipse(cx, cy, rx, ry, 0, 0, Math.PI * 2);
        ctx.strokeStyle = 'rgba(255, 248, 233, 0.25)';
        ctx.setLineDash([5, 5]);
        ctx.lineWidth = 1.5;
        ctx.stroke();
        ctx.setLineDash([]);
      }

      const px = cx + Math.cos(p.angle) * rx;
      const py = cy + Math.sin(p.angle) * ry;

      ctx.beginPath();
      ctx.arc(px, py, p.r, 0, Math.PI * 2);
      ctx.fillStyle = p.color;
      ctx.fill();
      ctx.lineWidth = 2.5;
      ctx.strokeStyle = '#FFFDF7';
      ctx.stroke();

      if (showLines) {
        ctx.fillStyle = '#FFFDF7';
        ctx.font = 'bold 13px Fredoka, sans-serif';
        ctx.fillText(p.name, px + p.r + 6, py + 4);
      }
    }

    rafId = window.requestAnimationFrame(frame);
  }

  frame();

  return () => {
    if (rafId) window.cancelAnimationFrame(rafId);
    canvas.removeEventListener('click', onCanvasClick);
    speedSlider.removeEventListener('input', onSpeedInput);
    pauseBtn.removeEventListener('click', onTogglePause);
  };
}
