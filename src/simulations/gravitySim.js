import { getCanvasPoint, setupHiDPICanvas } from './canvasHelper.js';

export function mountGravitySimulation(container) {
  const canvas = container.querySelector('#sim-canvas');
  const planetSelect = container.querySelector('#grav-planet');
  const bounceSlider = container.querySelector('#grav-bounce');
  const bounceVal = container.querySelector('#bounce-val');
  const dropBtn = container.querySelector('#btn-drop-ball');
  const clearBtn = container.querySelector('#btn-clear-balls');
  const pauseBtn = container.querySelector('#btn-sim-pause');
  const ballCountEl = container.querySelector('#grav-ball-count');

  const { ctx, width, height } = setupHiDPICanvas(canvas, 900, 380);
  const floorY = 330;
  let paused = false;
  let rafId = null;

  let balls = [
    { x: 280, y: 70, vy: 0, r: 22, color: '#F28F83', label: 'A' },
    { x: 560, y: 70, vy: 0, r: 15, color: '#75B9E7', label: 'B' }
  ];

  function updateCountUI() {
    canvas.dataset.ballCount = String(balls.length);
    if (ballCountEl) ballCountEl.textContent = `${balls.length} bola aktif`;
  }

  function spawnBall(x, y) {
    const colors = ['#F28F83', '#75B9E7', '#91C99A', '#FFD66B', '#A994E8'];
    balls.push({
      x: Math.max(40, Math.min(width - 40, x)),
      y: Math.max(36, Math.min(250, y)),
      vy: 0,
      r: 14 + (balls.length % 4) * 3,
      color: colors[balls.length % colors.length],
      label: String(balls.length + 1)
    });
    updateCountUI();
  }

  function onCanvasClick(e) {
    const pt = getCanvasPoint(canvas, e.clientX, e.clientY, width, height);
    spawnBall(pt.x, pt.y);
  }

  function onDropClick() {
    spawnBall(160 + Math.random() * 580, 50);
  }

  function onClearClick() {
    balls = [];
    updateCountUI();
  }

  function onBounceInput() {
    bounceVal.textContent = bounceSlider.value;
  }

  function onTogglePause() {
    paused = !paused;
    pauseBtn.textContent = paused ? 'Lanjutkan' : 'Jeda';
    canvas.dataset.simState = paused ? 'paused' : 'running';
  }

  canvas.addEventListener('click', onCanvasClick);
  dropBtn.addEventListener('click', onDropClick);
  clearBtn.addEventListener('click', onClearClick);
  bounceSlider.addEventListener('input', onBounceInput);
  pauseBtn.addEventListener('click', onTogglePause);

  updateCountUI();
  canvas.dataset.simState = 'running';

  function frame() {
    const g = parseFloat(planetSelect.value);
    const bounce = parseFloat(bounceSlider.value);

    ctx.clearRect(0, 0, width, height);

    // Subtle notebook grid
    ctx.strokeStyle = 'rgba(41, 45, 50, 0.07)';
    ctx.lineWidth = 1;
    for (let x = 0; x < width; x += 30) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }
    for (let y = 0; y < height; y += 30) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }

    // Ground surface
    ctx.fillStyle = '#91C99A';
    ctx.fillRect(0, floorY, width, height - floorY);
    ctx.strokeStyle = '#292D32';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(0, floorY);
    ctx.lineTo(width, floorY);
    ctx.stroke();

    // Header overlay inside canvas
    ctx.fillStyle = '#292D32';
    ctx.font = 'bold 16px Fredoka, sans-serif';
    ctx.fillText(`Gravitasi Aktif (g) = ${g} m/s²  ·  Klik kanvas untuk menjatuhkan bola`, 20, 30);

    for (const b of balls) {
      if (!paused) {
        b.vy += g * 0.045;
        b.y += b.vy;
        if (b.y + b.r >= floorY) {
          b.y = floorY - b.r;
          b.vy = -b.vy * bounce;
          if (Math.abs(b.vy) < 0.6) b.vy = 0;
        }
      }

      ctx.beginPath();
      ctx.arc(b.x, b.y, b.r, 0, Math.PI * 2);
      ctx.fillStyle = b.color;
      ctx.fill();
      ctx.lineWidth = 3;
      ctx.strokeStyle = '#292D32';
      ctx.stroke();

      if (Math.abs(b.vy) > 1.2) {
        ctx.beginPath();
        ctx.moveTo(b.x, b.y);
        ctx.lineTo(b.x, b.y + b.vy * 3.4);
        ctx.strokeStyle = '#292D32';
        ctx.lineWidth = 2;
        ctx.stroke();
      }
    }

    rafId = window.requestAnimationFrame(frame);
  }

  frame();

  return () => {
    if (rafId) window.cancelAnimationFrame(rafId);
    canvas.removeEventListener('click', onCanvasClick);
    dropBtn.removeEventListener('click', onDropClick);
    clearBtn.removeEventListener('click', onClearClick);
    bounceSlider.removeEventListener('input', onBounceInput);
    pauseBtn.removeEventListener('click', onTogglePause);
  };
}
