import { mountCircuitSimulation } from '../simulations/circuitSim.js';
import { mountGravitySimulation } from '../simulations/gravitySim.js';
import { mountOpticsSimulation } from '../simulations/opticsSim.js';
import { mountSolarSimulation } from '../simulations/solarSim.js';

export function renderSimulasiView(root, ctx) {
  const { state, activeSimId, onSelectSim, onMarkSimTried } = ctx;

  const tabs = [
    { id: 'gravity', label: 'Gravity Simulator' },
    { id: 'solar', label: 'Solar System Simulator' },
    { id: 'circuit', label: 'Electric Circuit Simulator' },
    { id: 'optics', label: state.isPro ? 'Wave & Optics Lab (PRO)' : 'Wave & Optics Lab (Terkunci PRO)' }
  ];

  let simBody = '';
  if (activeSimId === 'gravity') {
    simBody = `
      <section class="doodle-card">
        <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:0.5rem; margin-bottom:0.75rem;">
          <h2 style="font-size:1.75rem;">Gravity &amp; Free-Fall Simulator</h2>
          <span class="cat-accent cat-Fisika">Fisika · Gravitasi</span>
        </div>
        <p style="margin-bottom:0.85rem;">Klik di mana saja di dalam kanvas untuk menjatuhkan bola eksperimen, atau ubah percepatan gravitasi planet untuk membandingkan kecepatan jatuhnya.</p>

        <div class="sim-canvas-wrapper">
          <canvas id="sim-canvas" class="sim-canvas" data-testid="sim-canvas" aria-label="Kanvas simulasi gravitasi jatuh bebas"></canvas>
        </div>

        <div class="sim-telemetry tabular-nums">
          <span id="grav-ball-count">2 bola aktif</span>
          <button type="button" class="doodle-btn paper sm" id="btn-sim-pause">Jeda</button>
        </div>

        <div class="sim-controls">
          <div class="control-group">
            <label for="grav-planet">Lingkungan Gravitasi:</label>
            <select id="grav-planet" class="doodle-select">
              <option value="1.62">Bulan (1.62 m/s²)</option>
              <option value="3.72">Mars (3.72 m/s²)</option>
              <option value="9.81" selected>Bumi (9.81 m/s²)</option>
              <option value="24.79">Jupiter (24.79 m/s²)</option>
            </select>
          </div>
          <div class="control-group">
            <label for="grav-bounce">Elastisitas Pantulan: <span id="bounce-val" class="tabular-nums">0.75</span></label>
            <input type="range" id="grav-bounce" min="0.2" max="0.95" step="0.05" value="0.75" />
          </div>
          <button type="button" class="doodle-btn green sm" id="btn-drop-ball">Jatuhkan Bola</button>
          <button type="button" class="doodle-btn coral sm" id="btn-clear-balls">Bersihkan Kanvas</button>
        </div>

        <div class="formula-note">
          <b>Konsep Ilmiah:</b> Benda yang jatuh bebas mengalami percepatan konstan (<span class="math-expr">g</span>). Semakin besar nilai <span class="math-expr">g</span> (seperti di Jupiter), semakin cepat pertambahan kecepatan vertikal benda (<span class="math-expr">v = g · t</span>) dan semakin keras pantulannya.
        </div>
      </section>
    `;
  } else if (activeSimId === 'solar') {
    simBody = `
      <section class="doodle-card">
        <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:0.5rem; margin-bottom:0.75rem;">
          <h2 style="font-size:1.75rem;">Solar System Orbit Simulator</h2>
          <span class="cat-accent cat-Astronomi">Astronomi · Tata Surya</span>
        </div>
        <p style="margin-bottom:0.85rem;">Amati bagaimana planet-planet mengorbit Matahari. Klik pada salah satu planet di kanvas untuk melihat fakta ilmiahnya.</p>

        <div class="sim-canvas-wrapper">
          <canvas id="sim-canvas" class="sim-canvas" data-testid="sim-canvas" aria-label="Kanvas simulasi orbit tata surya"></canvas>
        </div>

        <div class="sim-telemetry">
          <span id="planet-info-pill">Klik planet pada kanvas untuk melihat fakta detail</span>
          <button type="button" class="doodle-btn paper sm" id="btn-sim-pause">Jeda</button>
        </div>

        <div class="sim-controls">
          <div class="control-group">
            <label for="orbit-speed">Kecepatan Orbit: <span id="orbit-speed-val" class="tabular-nums">1x</span></label>
            <input type="range" id="orbit-speed" min="0" max="3" step="0.2" value="1" />
          </div>
          <label for="orbit-lines" style="font-family:var(--font-ui); font-size:0.9rem; display:flex; align-items:center; gap:0.5rem; cursor:pointer; min-height:44px;">
            <input type="checkbox" id="orbit-lines" checked style="width:18px; height:18px;" />
            Tampilkan Garis Orbit &amp; Nama
          </label>
        </div>

        <div class="formula-note">
          <b>Konsep Ilmiah:</b> Sesuai Hukum III Kepler, planet yang berada lebih dekat dengan Matahari (seperti Merkurius) memiliki lintasan lebih pendek dan bergerak jauh lebih cepat dibandingkan planet luar (seperti Jupiter).
        </div>
      </section>
    `;
  } else if (activeSimId === 'circuit') {
    simBody = `
      <section class="doodle-card">
        <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:0.5rem; margin-bottom:0.75rem;">
          <h2 style="font-size:1.75rem;">Electric Circuit &amp; Ohm's Law Simulator</h2>
          <span class="cat-accent cat-Fisika">Fisika · Listrik Dinamis</span>
        </div>
        <p style="margin-bottom:0.85rem;">Klik kanvas atau tombol sakelar untuk menyambung rangkaian, lalu atur tegangan baterai dan hambatan lampu.</p>

        <div class="sim-canvas-wrapper">
          <canvas id="sim-canvas" class="sim-canvas" data-testid="sim-canvas" aria-label="Kanvas simulasi rangkaian listrik hukum Ohm"></canvas>
        </div>

        <div class="sim-telemetry tabular-nums">
          <span id="circuit-readout" class="mono-metric" data-testid="circuit-readout">Arus (I) = 0.30 A · Daya (P) = 2.7 W</span>
        </div>

        <div class="sim-controls">
          <button type="button" class="doodle-btn green sm" id="btn-toggle-switch" aria-pressed="true">Sakelar: TERTUTUP (ON)</button>
          <div class="control-group">
            <label for="circuit-volt">Tegangan Baterai (<span class="math-expr">V</span>): <span id="volt-val" class="tabular-nums">9</span> V</label>
            <input type="range" id="circuit-volt" min="1.5" max="12" step="1.5" value="9" />
          </div>
          <div class="control-group">
            <label for="circuit-ohm">Hambatan Resistor (<span class="math-expr">R</span>): <span id="ohm-val" class="tabular-nums">30</span> Ω</label>
            <input type="range" id="circuit-ohm" min="10" max="100" step="10" value="30" />
          </div>
        </div>

        <div class="formula-note">
          <b>Konsep Ilmiah:</b> Saat sakelar ditutup, beda potensial baterai mendorong elektron mengalir. Berdasarkan Hukum Ohm (<span class="math-expr">I = V / R</span>), memperbesar tegangan membuat lampu menyala lebih terang, sedangkan memperbesar hambatan meredupkan nyala lampu.
        </div>
      </section>
    `;
  } else if (activeSimId === 'optics') {
    simBody = `
      <section class="doodle-card" style="background:linear-gradient(180deg,#FFFDF7,#FFF8E1);">
        <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:0.5rem; margin-bottom:0.75rem;">
          <h2 style="font-size:1.75rem;">Wave Interference &amp; Prism Optics Lab</h2>
          <span class="pro-badge">Simulasi PRO</span>
        </div>
        <p style="margin-bottom:0.85rem;">Eksperimen superposisi dua gelombang transversal dan dispersi cahaya putih melewati prisma segitiga.</p>

        <div class="sim-canvas-wrapper">
          <canvas id="sim-canvas" class="sim-canvas" data-testid="sim-canvas" aria-label="Kanvas simulasi gelombang dan prisma optik"></canvas>
        </div>

        <div class="sim-telemetry">
          <span>Mode: Superposisi Gelombang &amp; Dispersi Prisma</span>
          <button type="button" class="doodle-btn paper sm" id="btn-sim-pause">Jeda</button>
        </div>

        <div class="sim-controls">
          <div class="control-group">
            <label for="wave-freq1">Frekuensi Gelombang 1: <span id="freq1-val" class="tabular-nums">2</span> Hz</label>
            <input type="range" id="wave-freq1" min="1" max="5" step="0.5" value="2" />
          </div>
          <div class="control-group">
            <label for="wave-freq2">Frekuensi Gelombang 2: <span id="freq2-val" class="tabular-nums">3</span> Hz</label>
            <input type="range" id="wave-freq2" min="1" max="5" step="0.5" value="3" />
          </div>
          <div class="control-group">
            <label for="wave-amp">Amplitudo: <span id="amp-val" class="tabular-nums">35</span> px</label>
            <input type="range" id="wave-amp" min="15" max="55" step="5" value="35" />
          </div>
        </div>

        <div class="formula-note">
          <b>Konsep Ilmiah:</b> Prinsip Superposisi menyatakan ketika dua gelombang bertemu di titik yang sama, simpangan resultannya adalah penjumlahan aljabar dari masing-masing gelombang (interferensi konstruktif dan destruktif).
        </div>
      </section>
    `;
  }

  root.innerHTML = `
    <div class="section-header">
      <h1 class="section-title">Laboratorium Simulasi Sains</h1>
      <div class="segmented-bar" role="group" aria-label="Pilih simulator sains">
        ${tabs.map((t) => `
          <button
            type="button"
            class="seg-btn ${activeSimId === t.id ? 'active' : ''}"
            data-sim-tab="${t.id}"
            aria-pressed="${activeSimId === t.id ? 'true' : 'false'}"
          >${t.label}</button>
        `).join('')}
      </div>
    </div>
    ${simBody}
  `;

  root.querySelectorAll('[data-sim-tab]').forEach((btn) => {
    btn.addEventListener('click', () => onSelectSim(btn.dataset.simTab));
  });

  onMarkSimTried(activeSimId);

  if (activeSimId === 'gravity') return mountGravitySimulation(root);
  if (activeSimId === 'solar') return mountSolarSimulation(root);
  if (activeSimId === 'circuit') return mountCircuitSimulation(root);
  if (activeSimId === 'optics') return mountOpticsSimulation(root);
  return null;
}
