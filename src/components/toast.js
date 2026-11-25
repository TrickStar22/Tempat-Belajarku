import { escapeHTML } from '../utils/formatters.js';

export function showToast(icon, text, bg = 'var(--warm-yellow)') {
  const container = document.getElementById('toast-container');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = 'doodle-toast';
  toast.style.background = bg;
  toast.setAttribute('role', 'status');
  toast.innerHTML = `<span style="font-size:1.3rem" aria-hidden="true">${icon}</span><span>${escapeHTML(text)}</span>`;
  container.appendChild(toast);

  window.setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(8px)';
    toast.style.transition = 'opacity 0.2s ease, transform 0.2s ease';
    window.setTimeout(() => toast.remove(), 220);
  }, 3200);
}
