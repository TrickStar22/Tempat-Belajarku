import { getQRISSVG } from '../assets/illustrations.js';
import { PRICING_PLANS } from '../data/curriculum.js';
import { calculateCheckoutTotals } from '../state/store.js';
import { escapeHTML, formatCountdown, formatRupiah } from '../utils/formatters.js';
import { buildQRISPayload } from '../utils/qris.js';

export function renderPremiumView(root, ctx) {
  const {
    state,
    checkoutState,
    onSelectPlan,
    onSelectPayment,
    onApplyPromo,
    onCreateOrder,
    onBackToSelect,
    onCopyVA,
    onCopyQRIS,
    onSimulatePaymentSuccess,
    onViewReceipt,
    onExploreProMateri,
    onRequireLogin
  } = ctx;

  // STEP 2: Awaiting payment (hanya untuk pengguna yang sudah login)
  if (!state.isGuest && checkoutState.step === 'awaiting' && checkoutState.activeOrder) {
    const ord = checkoutState.activeOrder;
    const isQRIS = checkoutState.paymentCategory === 'qris';
    const isVA = checkoutState.paymentCategory === 'va';
    const qrisPayload = isQRIS ? buildQRISPayload({ invoiceId: ord.invoiceId, total: ord.total }) : '';

    root.innerHTML = `
      <div style="max-width:640px; margin:0 auto;">
        <div style="margin-bottom:0.85rem;">
          <button type="button" class="doodle-btn cream sm" id="checkout-back-btn">Ubah Paket / Metode</button>
        </div>

        <section class="doodle-card" style="text-align:center;">
          <div class="meta-row" style="justify-content:center; margin-bottom:0.5rem;">
            <span>Menunggu Pembayaran</span>
            <span class="meta-sep" aria-hidden="true">·</span>
            <span class="tabular-nums">Sisa Waktu: <b id="pay-countdown" class="mono-metric">${formatCountdown(checkoutState.secondsLeft)}</b></span>
          </div>
          <h1 style="font-size:2rem; margin-bottom:0.25rem;">Selesaikan Pembayaran</h1>
          <p class="ui-font" style="color:var(--ink-muted); margin-bottom:1rem;">No. Invoice: ${ord.invoiceId} · ${ord.method}</p>

          <div style="background:var(--bg-cream); border:2.5px solid var(--ink-black); border-radius:16px; padding:1.25rem; margin-bottom:1.25rem;">
            <div style="font-size:0.92rem; font-weight:700;">Total yang Harus Dibayar</div>
            <div style="font-size:2.2rem; font-family:var(--font-display); font-weight:700; color:#1F6B33;" class="tabular-nums" data-testid="awaiting-total">
              ${formatRupiah(ord.total)}
            </div>

            ${isQRIS
              ? `
                <div class="qris-card" data-testid="qris-card">
                  <div class="qris-header">
                    <span class="qris-brand-tag">QRIS</span>
                    <span class="qris-std-label">Standar Pembayaran Nasional</span>
                  </div>
                  <div class="qris-nmid">NMID: ID1026000012345 · DOODLELAB PRO</div>
                  <div class="qris-matrix-box" id="qris-svg-wrap">
                    ${getQRISSVG(ord)}
                  </div>
                  <div class="qris-footer tabular-nums">
                    <span>${escapeHTML(ord.invoiceId)}</span>
                    <b>${formatRupiah(ord.total)}</b>
                  </div>
                </div>
                <div style="display:flex; gap:0.55rem; justify-content:center; flex-wrap:wrap; margin-bottom:0.7rem;">
                  <button type="button" class="doodle-btn blue sm" id="btn-download-qris">Unduh QRIS</button>
                  <button type="button" class="doodle-btn paper sm" id="btn-copy-qris">Salin Kode QRIS</button>
                </div>
                <p style="font-size:0.86rem; color:var(--ink-muted); font-weight:700;">Scan kode QRIS di atas menggunakan GoPay, OVO, DANA, ShopeePay, atau mobile banking.</p>
              `
              : isVA
                ? `
                  <div style="margin-top:0.9rem; padding:0.9rem; background:#FFFDF7; border:2.5px dashed var(--ink-black); border-radius:12px;">
                    <div style="font-size:0.84rem; font-weight:700;">Nomor Virtual Account (${checkoutState.paymentSubMethod}):</div>
                    <div class="mono-metric tabular-nums" style="font-size:1.5rem; letter-spacing:1px; margin:0.4rem 0;">${ord.vaNumber}</div>
                    <button type="button" class="doodle-btn blue sm" id="copy-va-btn">Salin Nomor VA</button>
                  </div>
                `
                : `
                  <div style="margin-top:0.9rem; padding:0.9rem; background:#FFFDF7; border:2.5px dashed var(--ink-black); border-radius:12px;">
                    <div style="font-size:0.92rem; font-weight:700;">Pembayaran Instan via ${checkoutState.paymentSubMethod}</div>
                    <p style="font-size:0.85rem; color:var(--ink-muted); margin-top:0.25rem;">Permintaan pembayaran siap dikonfirmasi. Klik tombol di bawah untuk menyelesaikan transaksi simulasi.</p>
                  </div>
                `
            }
          </div>

          <button type="button" class="doodle-btn green" style="width:100%; font-size:1.05rem;" id="btn-confirm-payment">
            Konfirmasi &amp; Simulasikan Pembayaran Berhasil
          </button>
        </section>
      </div>
    `;

    root.querySelector('#checkout-back-btn')?.addEventListener('click', onBackToSelect);
    root.querySelector('#copy-va-btn')?.addEventListener('click', () => onCopyVA(ord.vaNumber));
    root.querySelector('#btn-copy-qris')?.addEventListener('click', () => onCopyQRIS?.(qrisPayload));
    root.querySelector('#btn-download-qris')?.addEventListener('click', () => {
      const svgMarkup = root.querySelector('#qris-svg-wrap svg')?.outerHTML;
      if (!svgMarkup) return;
      const blob = new Blob([svgMarkup], { type: 'image/svg+xml;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `QRIS-${ord.invoiceId}.svg`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    });
    root.querySelector('#btn-confirm-payment')?.addEventListener('click', onSimulatePaymentSuccess);
    return;
  }

  // STEP 3: Digital Receipt (hanya untuk pengguna yang sudah login)
  if (!state.isGuest && checkoutState.step === 'receipt' && checkoutState.activeOrder) {
    const ord = checkoutState.activeOrder;
    root.innerHTML = `
      <div style="max-width:600px; margin:0 auto;">
        <section class="doodle-card" style="background:#FFFDF7;" data-testid="digital-receipt">
          <div style="text-align:center; border-bottom:2.5px dashed var(--ink-black); padding-bottom:1rem; margin-bottom:1rem;">
            <span class="pro-badge" style="margin-bottom:0.45rem;">TRANSAKSI BERHASIL</span>
            <h1 style="font-size:2rem;">Struk Digital DoodleLab PRO</h1>
            <p class="tabular-nums" style="font-size:0.86rem; color:var(--ink-muted); font-weight:700;">${ord.invoiceId} · ${ord.paidAt || ord.tanggal}</p>
          </div>

          <div style="display:flex; flex-direction:column; gap:0.6rem; font-size:0.95rem; margin-bottom:1.35rem;" class="tabular-nums">
            <div style="display:flex; justify-content:space-between;"><span>Nama Ilmuwan</span><b>${escapeHTML(state.namaAlias)}</b></div>
            <div style="display:flex; justify-content:space-between;"><span>Paket Langganan</span><b>${ord.planName}</b></div>
            <div style="display:flex; justify-content:space-between;"><span>Metode Bayar</span><b>${ord.method}</b></div>
            <div style="display:flex; justify-content:space-between;"><span>Subtotal</span><span>${formatRupiah(ord.subtotal)}</span></div>
            <div style="display:flex; justify-content:space-between; color:#1F6B33;"><span>Diskon Promo</span><span>- ${formatRupiah(ord.discount)}</span></div>
            <div style="display:flex; justify-content:space-between;"><span>Biaya Layanan</span><span>${formatRupiah(ord.adminFee)}</span></div>
            <div style="display:flex; justify-content:space-between; font-size:1.2rem; border-top:2px solid var(--ink-black); padding-top:0.6rem;">
              <b>Total Dibayar</b><b>${formatRupiah(ord.total)}</b>
            </div>
          </div>

          <div class="no-print" style="display:flex; gap:0.75rem; flex-wrap:wrap;">
            <button type="button" class="doodle-btn cream" style="flex:1;" id="receipt-back-btn">Kembali ke Halaman PRO</button>
            <button type="button" class="doodle-btn paper" id="receipt-print-btn">Cetak Struk</button>
            <button type="button" class="doodle-btn green" style="flex:1;" id="receipt-materi-btn">Eksplorasi Materi PRO</button>
          </div>
        </section>
      </div>
    `;

    root.querySelector('#receipt-back-btn')?.addEventListener('click', onBackToSelect);
    root.querySelector('#receipt-print-btn')?.addEventListener('click', () => window.print());
    root.querySelector('#receipt-materi-btn')?.addEventListener('click', onExploreProMateri);
    return;
  }

  // STEP 1: Plan Selection & Checkout Summary
  const { plan, subtotal, discount, adminFee, total } = calculateCheckoutTotals(
    checkoutState.selectedPlanId,
    checkoutState.appliedPromo ? checkoutState.appliedPromo.code : ''
  );

  root.innerHTML = `
    <div class="section-header">
      <h1 class="section-title">DoodleLab PRO · Paket Belajar Premium</h1>
      ${state.isPro ? '<span class="pro-badge">Status: PRO AKTIF</span>' : '<span class="meta-row">Status Saat Ini: Paket Gratis</span>'}
    </div>

    ${state.isGuest
      ? `
        <section class="doodle-card" data-testid="pro-login-required-banner" style="background:linear-gradient(135deg, #E8F4FD 0%, #FFF7D6 100%); margin-bottom:1.5rem; display:flex; flex-wrap:wrap; align-items:center; justify-content:space-between; gap:1rem;">
          <div>
            <div class="meta-row" style="color:var(--ink-black); margin-bottom:0.2rem;">
              <span>🔒 Login Diperlukan</span>
              <span class="meta-sep" aria-hidden="true">·</span>
              <span>Mode Tamu Lokal</span>
            </div>
            <h2 style="font-size:1.45rem; margin-bottom:0.2rem;">Masuk Akun Terlebih Dahulu untuk Upgrade PRO</h2>
            <p style="font-size:0.92rem; font-weight:700; color:var(--ink-muted); max-width:64ch;">
              Status langganan DoodleLab PRO dan riwayat transaksi tersimpan ke akun Google/Firebase milikmu agar aman di semua perangkat.
            </p>
          </div>
          <button type="button" class="doodle-btn blue" id="btn-pro-login-gate">Masuk / Daftar Sekarang</button>
        </section>
      `
      : ''
    }

    <div class="grid-3" style="margin-bottom:1.75rem;">
      ${PRICING_PLANS.map((p) => {
        const isSel = checkoutState.selectedPlanId === p.id;
        return `
          <article class="plan-card ${isSel ? 'selected' : ''}">
            <div>
              <div style="margin-bottom:0.55rem;">
                <span class="cat-accent" style="background:${p.color};">${p.badge}</span>
              </div>
              <h2 style="font-size:1.55rem; margin-bottom:0.25rem;">${p.nama}</h2>
              <div class="tabular-nums" style="font-family:var(--font-display); font-size:1.95rem; font-weight:700; margin-bottom:0.75rem;">
                ${formatRupiah(p.harga)} <span style="font-size:0.95rem; font-family:var(--font-body); color:var(--ink-muted);">${p.periode}</span>
              </div>
              <ul style="list-style:none; font-size:0.92rem; display:flex; flex-direction:column; gap:0.45rem; margin-bottom:1.1rem;">
                ${p.fitur.map((f) => `<li>✓ ${f}</li>`).join('')}
              </ul>
            </div>
            <button type="button" class="doodle-btn sm ${isSel ? 'green' : 'cream'}" style="width:100%;" data-select-plan="${p.id}" aria-pressed="${isSel}">
              ${isSel ? 'Paket Dipilih' : `Pilih ${p.nama}`}
            </button>
          </article>
        `;
      }).join('')}
    </div>

    <div class="grid-2">
      <section class="doodle-card">
        <h2 style="font-size:1.65rem; margin-bottom:0.85rem;">Pilih Metode Pembayaran</h2>

        <div style="margin-bottom:1rem;">
          <div class="field-label">1. QRIS Instan (Semua Bank &amp; E-Wallet)</div>
          <button type="button" class="pay-method-btn ${checkoutState.paymentSubMethod === 'QRIS Instan' ? 'active' : ''}"
            data-pay-cat="qris" data-pay-sub="QRIS Instan">
            <span>QRIS (Scan &amp; Bayar Otomatis)</span><span>Instan</span>
          </button>

          <div class="field-label" style="margin-top:0.75rem;">2. Virtual Account Bank</div>
          <div style="display:grid; grid-template-columns:1fr 1fr; gap:0.5rem;">
            ${['BCA Virtual Account', 'Mandiri Virtual Account', 'BNI Virtual Account', 'BRI Virtual Account'].map((bank) => `
              <button type="button" class="pay-method-btn ${checkoutState.paymentSubMethod === bank ? 'active' : ''}" style="margin-bottom:0;"
                data-pay-cat="va" data-pay-sub="${bank}">
                <span>${bank.split(' ')[0]} VA</span>
              </button>
            `).join('')}
          </div>

          <div class="field-label" style="margin-top:0.75rem;">3. Dompet Digital (E-Wallet)</div>
          <div style="display:grid; grid-template-columns:1fr 1fr; gap:0.5rem;">
            ${['GoPay', 'OVO', 'DANA', 'ShopeePay'].map((ew) => `
              <button type="button" class="pay-method-btn ${checkoutState.paymentSubMethod === ew ? 'active' : ''}" style="margin-bottom:0;"
                data-pay-cat="ewallet" data-pay-sub="${ew}">
                <span>${ew}</span>
              </button>
            `).join('')}
          </div>
        </div>

        <div style="border-top:2px dashed var(--ink-black); padding-top:0.9rem;">
          <label class="field-label" for="promo-code-input">Kode Promo (Tersedia: DOODLE50 atau SAINSJUARA)</label>
          <div style="display:flex; gap:0.5rem;">
            <input id="promo-code-input" class="doodle-input" type="text" placeholder="Masukkan kode promo..." value="${escapeHTML(checkoutState.promoInput)}" />
            <button type="button" class="doodle-btn blue sm" id="btn-apply-promo">Gunakan</button>
          </div>
        </div>
      </section>

      <div style="display:flex; flex-direction:column; gap:1.25rem;">
        <section class="doodle-card alt-border" style="background:#FFFDF5;">
          <h2 style="font-size:1.65rem; margin-bottom:0.85rem;">Ringkasan Pembayaran</h2>
          <div style="display:flex; flex-direction:column; gap:0.55rem; font-size:0.96rem; margin-bottom:1.15rem;" class="tabular-nums">
            <div style="display:flex; justify-content:space-between;"><span>Paket Dipilih</span><b>${plan.nama}</b></div>
            <div style="display:flex; justify-content:space-between;"><span>Metode Bayar</span><b>${checkoutState.paymentSubMethod}</b></div>
            <div style="display:flex; justify-content:space-between;"><span>Harga Paket</span><span>${formatRupiah(subtotal)}</span></div>
            <div style="display:flex; justify-content:space-between; color:#1F6B33;">
              <span>Diskon ${checkoutState.appliedPromo ? `(${checkoutState.appliedPromo.code})` : ''}</span>
              <span data-testid="checkout-discount">- ${formatRupiah(discount)}</span>
            </div>
            <div style="display:flex; justify-content:space-between;"><span>Biaya Layanan</span><span>${formatRupiah(adminFee)}</span></div>
            <div style="display:flex; justify-content:space-between; font-size:1.25rem; border-top:2.5px solid var(--ink-black); padding-top:0.65rem;">
              <b>Total Bayar</b><b style="color:#1F6B33;" data-testid="checkout-total">${formatRupiah(total)}</b>
            </div>
          </div>

          <button type="button" class="doodle-btn ${state.isGuest ? 'blue' : 'green'}" style="width:100%; font-size:1.05rem;" id="btn-create-order">
            ${state.isGuest
              ? `Masuk Akun untuk Upgrade PRO (${formatRupiah(total)})`
              : `Lanjut ke Pembayaran (${formatRupiah(total)})`
            }
          </button>
          ${state.isGuest
            ? '<p style="font-size:0.82rem; color:var(--ink-muted); font-weight:700; margin-top:0.55rem; text-align:center;">Anda perlu login terlebih dahulu sebelum melanjutkan pembayaran.</p>'
            : ''
          }
        </section>

        ${!state.isGuest && state.transactions && state.transactions.length > 0
          ? `
            <section class="doodle-card">
              <h3 style="font-size:1.4rem; margin-bottom:0.65rem;">Riwayat Transaksi Akun</h3>
              ${state.transactions.map((tx, i) => `
                <div style="display:flex; justify-content:space-between; align-items:center; padding:0.6rem 0.8rem; border:2px solid var(--ink-black); border-radius:12px; margin-bottom:0.5rem; background:var(--bg-cream); font-size:0.86rem;" class="tabular-nums">
                  <div>
                    <b>${escapeHTML(tx.planName)}</b><br />
                    <span style="color:var(--ink-muted);">${tx.invoiceId} · ${formatRupiah(tx.total)}</span>
                  </div>
                  <button type="button" class="doodle-btn sm" data-tx-receipt="${i}">Lihat Struk</button>
                </div>
              `).join('')}
            </section>
          `
          : ''
        }
      </div>
    </div>
  `;

  root.querySelector('#btn-pro-login-gate')?.addEventListener('click', () => onRequireLogin?.());
  root.querySelectorAll('[data-select-plan]').forEach((btn) => {
    btn.addEventListener('click', () => onSelectPlan(btn.dataset.selectPlan));
  });
  root.querySelectorAll('[data-pay-cat]').forEach((btn) => {
    btn.addEventListener('click', () => onSelectPayment(btn.dataset.payCat, btn.dataset.paySub));
  });
  root.querySelector('#btn-apply-promo')?.addEventListener('click', () => {
    const val = root.querySelector('#promo-code-input')?.value || '';
    onApplyPromo(val);
  });
  root.querySelector('#btn-create-order')?.addEventListener('click', onCreateOrder);
  root.querySelectorAll('[data-tx-receipt]').forEach((btn) => {
    btn.addEventListener('click', () => onViewReceipt(Number(btn.dataset.txReceipt)));
  });
}
