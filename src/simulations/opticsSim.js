import { setupHiDPICanvas } from './canvasHelper.js';

export function mountOpticsSimulation(container) {
  const canvas = container.querySelector('#sim-canvas');
  const freq1Slider = container.querySelector('#wave-freq1');
  const freq2Slider = container.querySelector('#wave-freq2');
  const ampSlider = container.querySelector('#wave-amp');
  const freq1Val = container.querySelector('#freq1-val');
  const freq2Val = container.querySelector('#freq2-val');
  const ampVal = container.querySelector('#amp-val');
  const pauseBtn = container.querySelector('#btn-sim-pause');

  const { ctx, width, height } = setupHiDPICanvas(canvas, 900, 380);
  let phase = 0;
  let paused = false;
  let rafId = null;

  function syncLabels() {
    freq1Val.textContent = freq1Slider.value;
    freq2Val.textContent = freq2Slider.value;
    ampVal.textContent = ampSlider.value;
  }

  function onTogglePause() {
    paused = !paused;
    pauseBtn.textContent = paused ? 'Lanjutkan' : 'Jeda';
    canvas.dataset.simState = paused ? 'paused' : 'running';
  }

  freq1Slider.addEventListener('input', syncLabels);
  freq2Slider.addEventListener('input', syncLabels);
  ampSlider.addEventListener('input', syncLabels);
  pauseBtn.addEventListener('click', onTogglePause);
  canvas.dataset.simState = 'running';

  function frame() {
    const f1 = parseFloat(freq1Slider.value);
    const f2 = parseFloat(freq2Slider.value);
    const amp = parseFloat(ampSlider.value);
    if (!paused) phase += 0.06;

    ctx.clearRect(0, 0, width, height);

    ctx.strokeStyle = 'rgba(41, 45, 50, 0.2)';
    ctx.setLineDash([5, 5]);
    ctx.beginPath(); ctx.moveTo(20, 100); ctx.lineTo(540, 100); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(20, 265); ctx.lineTo(540, 265); ctx.stroke();
    ctx.setLineDash([]);

    ctx.fillStyle = '#292D32';
    ctx.font = 'bold 14px Fredoka, sans-serif';
    ctx.fillText('Gelombang 1 (Biru) & Gelombang 2 (Coral)', 24, 28);
    ctx.fillText('Superposisi / Interferensi Resultan (Ungu)', 24, 192);

    ctx.lineWidth = 2.5;
    ctx.strokeStyle = '#75B9E7';
    ctx.beginPath();
    for (let x = 20; x <= 540; x += 4) {
      const y = 100 + Math.sin(x * 0.02 * f1 + phase) * (amp * 0.65);
      if (x === 20) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.stroke();

    ctx.strokeStyle = '#F28F83';
    ctx.beginPath();
    for (let x = 20; x <= 540; x += 4) {
      const y = 100 + Math.sin(x * 0.02 * f2 - phase * 1.2) * (amp * 0.65);
      if (x === 20) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.stroke();

    ctx.strokeStyle = '#A994E8';
    ctx.lineWidth = 3.5;
    ctx.beginPath();
    for (let x = 20; x <= 540; x += 4) {
      const y1 = Math.sin(x * 0.02 * f1 + phase) * (amp * 0.65);
      const y2 = Math.sin(x * 0.02 * f2 - phase * 1.2) * (amp * 0.65);
      const y = 265 + (y1 + y2);
      if (x === 20) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.stroke();

    // Prism dispersion chamber
    ctx.fillStyle = '#232730';
    ctx.fillRect(570, 20, 310, 340);

    ctx.strokeStyle = '#FFFFFF';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(580, 220);
    ctx.lineTo(685, 185);
    ctx.stroke();

    const rainbow = ['#F28F83', '#FFB84D', '#FFD66B', '#91C99A', '#75B9E7', '#A994E8'];
    rainbow.forEach((col, i) => {
      ctx.strokeStyle = col;
      ctx.lineWidth = 3.5;
      ctx.beginPath();
      ctx.moveTo(745, 180 + i * 3);
      ctx.lineTo(875, 150 + i * 26);
      ctx.stroke();
    });

    ctx.beginPath();
    ctx.moveTo(715, 110);
    ctx.lineTo(660, 245);
    ctx.lineTo(770, 245);
    ctx.closePath();
    ctx.fillStyle = 'rgba(117, 185, 231, 0.35)';
    ctx.fill();
    ctx.strokeStyle = '#FFFDF7';
    ctx.lineWidth = 2.5;
    ctx.stroke();

    ctx.fillStyle = '#FFFDF7';
    ctx.fillText('Prisma Dispersi Cahaya', 640, 285);

    rafId = window.requestAnimationFrame(frame);
  }

  frame();

  return () => {
    if (rafId) window.cancelAnimationFrame(rafId);
    freq1Slider.removeEventListener('input', syncLabels);
    freq2Slider.removeEventListener('input', syncLabels);
    ampSlider.removeEventListener('input', syncLabels);
    pauseBtn.removeEventListener('click', onTogglePause);
  };
}
