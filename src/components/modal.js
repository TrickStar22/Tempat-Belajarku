/**
 * Native <dialog> modal manager with accessible focus and backdrop close.
 */
function getDialog() {
  return document.getElementById('modal-dialog');
}

export function closeModal() {
  const dialog = getDialog();
  if (!dialog) return;
  if (dialog.open) {
    dialog.close();
  }
  dialog.innerHTML = '';
}

export function openModal(htmlContent, onMount) {
  const dialog = getDialog();
  if (!dialog) return;
  dialog.innerHTML = htmlContent;

  if (!dialog.dataset.boundBackdrop) {
    dialog.addEventListener('click', (e) => {
      if (e.target === dialog) {
        closeModal();
      }
    });
    dialog.dataset.boundBackdrop = '1';
  }

  if (typeof dialog.showModal === 'function') {
    if (!dialog.open) dialog.showModal();
  } else {
    dialog.setAttribute('open', '');
  }

  if (typeof onMount === 'function') {
    onMount(dialog);
  }
}
