import QRCode from 'qrcode';

export function crc16Ccitt(input) {
  let crc = 0xffff;
  for (let i = 0; i < input.length; i += 1) {
    crc ^= input.charCodeAt(i) << 8;
    for (let j = 0; j < 8; j += 1) {
      if ((crc & 0x8000) !== 0) {
        crc = ((crc << 1) ^ 0x1021) & 0xffff;
      } else {
        crc = (crc << 1) & 0xffff;
      }
    }
  }
  return crc.toString(16).toUpperCase().padStart(4, '0');
}

function tlv(tag, value) {
  const str = String(value);
  const len = String(str.length).padStart(2, '0');
  return `${tag}${len}${str}`;
}

export function buildQRISPayload({ invoiceId = 'INV-DL-000001', total = 0, merchantName = 'DOODLELAB PRO' } = {}) {
  const cleanAmount = String(Math.max(0, Math.round(Number(total || 0))));
  const cleanInv = String(invoiceId || 'INV-DL-000001').replace(/[^a-zA-Z0-9_\-]/g, '').slice(0, 25) || 'INV-DL';
  const cleanMerchant = String(merchantName || 'DOODLELAB PRO').toUpperCase().slice(0, 25);

  const merchantAccount26 =
    tlv('00', 'ID.CO.QRIS.WWW') +
    tlv('01', '936009140000012345') +
    tlv('02', 'ID1026000012345') +
    tlv('03', 'UMI');

  const merchantNational51 =
    tlv('00', 'ID.CO.QRIS.WWW') +
    tlv('02', 'ID1026000012345') +
    tlv('03', 'UMI');

  const additional62 = tlv('01', cleanInv);

  const bodyWithoutCrc =
    tlv('00', '01') +
    tlv('01', '12') +
    tlv('26', merchantAccount26) +
    tlv('51', merchantNational51) +
    tlv('52', '8299') +
    tlv('53', '360') +
    tlv('54', cleanAmount) +
    tlv('58', 'ID') +
    tlv('59', cleanMerchant) +
    tlv('60', 'JAKARTA') +
    tlv('62', additional62) +
    '6304';

  return bodyWithoutCrc + crc16Ccitt(bodyWithoutCrc);
}

export function generateQRCodeSVG(payload, options = {}) {
  const margin = Number.isInteger(options.margin) ? options.margin : 3;
  const size = Number(options.size || 210);
  const darkColor = options.darkColor || '#111827';
  const lightColor = options.lightColor || '#FFFFFF';

  const qr = QRCode.create(String(payload || 'DOODLELAB'), {
    errorCorrectionLevel: 'M'
  });

  const moduleCount = qr.modules.size;
  const totalDim = moduleCount + margin * 2;
  const parts = [];

  for (let row = 0; row < moduleCount; row += 1) {
    for (let col = 0; col < moduleCount; col += 1) {
      if (qr.modules.get(row, col)) {
        parts.push(`M${col + margin},${row + margin}h1v1h-1z`);
      }
    }
  }

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${totalDim} ${totalDim}" width="${size}" height="${size}" role="img" aria-label="Kode QRIS Pembayaran DoodleLab" style="display:block; width:100%; height:auto; max-width:${size}px; margin:0 auto;">
    <rect width="${totalDim}" height="${totalDim}" fill="${lightColor}"/>
    <path d="${parts.join('')}" fill="${darkColor}" shape-rendering="crispEdges"/>
  </svg>`;
}
