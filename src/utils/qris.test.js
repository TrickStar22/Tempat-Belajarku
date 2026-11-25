import test from 'node:test';
import assert from 'node:assert/strict';
import { buildQRISPayload, crc16Ccitt, generateQRCodeSVG } from './qris.js';

test('buildQRISPayload creates valid EMVCo QRIS string with CRC16 checksum and invoice amount', () => {
  const payload = buildQRISPayload({ invoiceId: 'INV-DL-987654', total: 102000 });
  assert.ok(payload.startsWith('000201010212'));
  assert.ok(payload.includes('5303360'));
  assert.ok(payload.includes('5406102000'));
  assert.ok(payload.includes('INV-DL-987654'));

  const body = payload.slice(0, -4);
  const crc = payload.slice(-4);
  assert.equal(crc, crc16Ccitt(body));
});

test('generateQRCodeSVG renders a crisp scannable SVG with quiet zone and dark path modules', () => {
  const payload = buildQRISPayload({ invoiceId: 'INV-DL-123456', total: 29000 });
  const svg = generateQRCodeSVG(payload);
  assert.match(svg, /^<svg[^>]*viewBox="0 0 \d+ \d+"/);
  assert.match(svg, /fill="#FFFFFF"/);
  assert.match(svg, /shape-rendering="crispEdges"/);
  assert.match(svg, /<path d="M\d+,\d+h1v1h-1z/);
});
