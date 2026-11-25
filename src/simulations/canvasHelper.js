/**
 * Configures an HTML5 Canvas with crisp devicePixelRatio scaling while
 * keeping a fixed logical coordinate space (width x height) for physics math.
 */
export function setupHiDPICanvas(canvas, logicalWidth = 900, logicalHeight = 380) {
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  canvas.width = logicalWidth * dpr;
  canvas.height = logicalHeight * dpr;
  const ctx = canvas.getContext('2d');
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  return { ctx, width: logicalWidth, height: logicalHeight };
}

export function getCanvasPoint(canvas, clientX, clientY, logicalWidth = 900, logicalHeight = 380) {
  const rect = canvas.getBoundingClientRect();
  return {
    x: (clientX - rect.left) * (logicalWidth / rect.width),
    y: (clientY - rect.top) * (logicalHeight / rect.height)
  };
}
