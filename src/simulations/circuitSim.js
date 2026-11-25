import { setupHiDPICanvas } from './canvasHelper.js';

export function mountCircuitSimulation(container) {
  const canvas = container.querySelector('#sim-canvas');
  const toggleBtn = container.querySelector('#btn-toggle-switch');
  const voltSlider = container.querySelector('#circuit-volt');
  const voltVal = container.querySelector('#volt-val');
  const ohmSlider = container.querySelector('#circuit-ohm');
  const ohmVal = container.querySelector('#ohm-val');
  const readoutEl = container.querySelector('#circuit-readout');

  const { ctx, width, height } = setupHiDPICanvas(canvas, 900, 380);
  let switchClosed = true;
  let electronOffset = 0;
  let lastReadoutText = '';
  let rafId = null;

  function syncReadout(V, R, I) {
    const P = V * I;
    const text = switchClosed
      ? `Arus (I) = ${I.toFixed(2)} A · Daya (P) = ${P.toFixed(1)} W`
      : 'Arus (I) = 0.00 A (Rangkaian Terbuka)';
    if (text !== lastReadoutText) {
      readoutEl.textContent = text;
      lastReadoutText = text;
      canvas.dataset.currentAmp = I.toFixed(2);
      canvas.dataset.simState = switchClosed ? 'closed' : 'open';
    }
  }

  function toggleSwitch() {
    switchClosed = !switchClosed;
    toggleBtn.textContent = switchClosed ? 'Sakelar: TERTUTUP (ON)' : 'Sakelar: TERBUKA (OFF)';
    toggleBtn.className = switchClosed ? 'doodle-btn green sm' : 'doodle-btn coral sm';
    toggleBtn.setAttribute('aria-pressed', switchClosed ? 'true' : 'false');
  }

  function onVoltInput() {
    voltVal.textContent = voltSlider.value;
  }

  function onOhmInput() {
    ohmVal.textContent = ohmSlider.value;
  }

  toggleBtn.addEventListener('click', toggleSwitch);
  canvas.addEventListener('click', toggleSwitch);
  voltSlider.addEventListener('input', onVoltInput);
  ohmSlider.addEventListener('input', onOhmInput);

  function frame() {
    const V = parseFloat(voltSlider.value);
    const R = parseFloat(ohmSlider.value);
    const I = switchClosed ? V / R : 0;

    syncReadout(V, R, I);
    ctx.clearRect(0, 0, width, height);

    const left = 180;
    const right = 720;
    const top = 85;
    const bottom = 295;

    ctx.strokeStyle = '#292D32';
    ctx.lineWidth = 5;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    ctx.beginPath();
    ctx.moveTo(left, top);
    ctx.lineTo(left, bottom);
    ctx.lineTo(right, bottom);
    ctx.lineTo(right, top);
    ctx.lineTo(500, top);
    ctx.moveTo(390, top);
    ctx.lineTo(left, top);
    ctx.stroke();

    // Switch nodes
    ctx.fillStyle = '#292D32';
    ctx.beginPath();
    ctx.arc(390, top, 6, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(500, top, 6, 0, Math.PI * 2);
    ctx.fill();

    // Switch lever
    ctx.beginPath();
    ctx.moveTo(390, top);
    if (switchClosed) ctx.lineTo(500, top);
    else ctx.lineTo(485, top - 44);
    ctx.strokeStyle = switchClosed ? '#2B7A3D' : '#F28F83';
    ctx.lineWidth = 5;
    ctx.stroke();

    ctx.fillStyle = '#292D32';
    ctx.font = 'bold 14px Fredoka, sans-serif';
    ctx.fillText('Sakelar (Klik untuk ubah)', 372, top - 52);

    // Battery
    ctx.fillStyle = '#FFD66B';
    ctx.strokeStyle = '#292D32';
    ctx.lineWidth = 3;
    ctx.fillRect(left - 28, 152, 56, 72);
    ctx.strokeRect(left - 28, 152, 56, 72);
    ctx.fillStyle = '#292D32';
    ctx.fillText(`+${V}V`, left - 18, 194);

    // Resistor
    ctx.fillStyle = '#A994E8';
    ctx.fillRect(400, bottom - 18, 100, 36);
    ctx.strokeRect(400, bottom - 18, 100, 36);
    ctx.fillStyle = '#292D32';
    ctx.fillText(`Resistor ${R}Ω`, 410, bottom + 5);

    // Bulb glow & body
    const brightness = Math.min(1, I / 0.6);
    if (switchClosed && brightness > 0.02) {
      const grad = ctx.createRadialGradient(right, 188, 10, right, 188, 45 + brightness * 55);
      grad.addColorStop(0, `rgba(255, 214, 107, ${0.4 + brightness * 0.55})`);
      grad.addColorStop(1, 'rgba(255, 214, 107, 0)');
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(right, 188, 45 + brightness * 55, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.beginPath();
    ctx.arc(right, 188, 28, 0, Math.PI * 2);
    ctx.fillStyle = switchClosed ? `rgba(255, 214, 107, ${0.25 + brightness * 0.75})` : '#EFE7D6';
    ctx.fill();
    ctx.lineWidth = 3;
    ctx.strokeStyle = '#292D32';
    ctx.stroke();
    ctx.fillStyle = '#292D32';
    ctx.fillText('Lampu', right + 36, 193);

    // Animated electron particles
    if (switchClosed && I > 0) {
      electronOffset = (electronOffset + I * 8) % 40;
      ctx.fillStyle = '#75B9E7';
      for (let y = top + electronOffset; y < bottom; y += 40) {
        ctx.beginPath(); ctx.arc(left, y, 5, 0, Math.PI * 2); ctx.fill();
      }
      for (let x = left + electronOffset; x < right; x += 40) {
        ctx.beginPath(); ctx.arc(x, bottom, 5, 0, Math.PI * 2); ctx.fill();
      }
      for (let y = bottom - electronOffset; y > top; y -= 40) {
        ctx.beginPath(); ctx.arc(right, y, 5, 0, Math.PI * 2); ctx.fill();
      }
      for (let x = right - electronOffset; x > left; x -= 40) {
        ctx.beginPath(); ctx.arc(x, top, 5, 0, Math.PI * 2); ctx.fill();
      }
    }

    rafId = window.requestAnimationFrame(frame);
  }

  frame();

  return () => {
    if (rafId) window.cancelAnimationFrame(rafId);
    toggleBtn.removeEventListener('click', toggleSwitch);
    canvas.removeEventListener('click', toggleSwitch);
    voltSlider.removeEventListener('input', onVoltInput);
    ohmSlider.removeEventListener('input', onOhmInput);
  };
}
