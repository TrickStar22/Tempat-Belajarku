export function getBrandLogoSVG() {
  return `
    <svg width="36" height="36" viewBox="0 0 48 48" fill="none" stroke="#292D32" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
      <path d="M18 8H30M20 8V18L10 36C8.8 38.2 10.4 41 13 41H35C37.6 41 39.2 38.2 38 36L28 18V8" fill="#FFFDF7"/>
      <path d="M13.5 31H34.5L37.5 36.5C38.2 38 37.1 39.8 35.4 39.8H12.6C10.9 39.8 9.8 38 10.5 36.5L13.5 31Z" fill="#91C99A"/>
      <circle cx="21" cy="25" r="2" fill="#FFD66B"/>
      <circle cx="27" cy="21" r="1.5" fill="#75B9E7"/>
      <path d="M35 6L36.5 9.5L40 11L36.5 12.5L35 16L33.5 12.5L30 11L33.5 9.5L35 6Z" fill="#FFD66B" stroke-width="2"/>
    </svg>
  `;
}

export function getQRISSVG() {
  return `
    <svg viewBox="0 0 120 120" width="165" height="165" fill="none" stroke="#292D32" stroke-width="4" aria-label="Kode QRIS DoodleLab">
      <rect x="10" y="10" width="32" height="32" rx="4" fill="#FFD66B"/>
      <rect x="18" y="18" width="16" height="16" fill="#292D32"/>
      <rect x="78" y="10" width="32" height="32" rx="4" fill="#75B9E7"/>
      <rect x="86" y="18" width="16" height="16" fill="#292D32"/>
      <rect x="10" y="78" width="32" height="32" rx="4" fill="#91C99A"/>
      <rect x="18" y="86" width="16" height="16" fill="#292D32"/>
      <path d="M52 14 H68 M52 28 H64 M14 54 H38 M52 52 H72 V70 H54 Z M84 54 H108 M52 84 H74 M86 82 H106 V106 H86 Z" stroke-linecap="round"/>
    </svg>
  `;
}

export function getDoodleSVG(type) {
  const svgs = {
    gravity: `<svg viewBox="0 0 220 110" width="200" height="100" fill="none" stroke="#292D32" stroke-width="2.5" stroke-linecap="round" aria-hidden="true">
      <path d="M25 95 Q110 88 195 95" stroke-width="3"/>
      <path d="M55 92 L55 38 Q30 35 35 18 Q50 5 75 18 Q90 32 55 38" fill="#91C99A"/>
      <circle cx="115" cy="30" r="12" fill="#F28F83"/>
      <path d="M115 18 Q118 11 124 13" stroke="#292D32"/>
      <path d="M115 48 L115 78 M108 71 L115 79 L122 71" stroke="#75B9E7" stroke-width="3"/>
      <circle cx="170" cy="45" r="22" fill="#75B9E7"/>
      <path d="M158 38 Q170 48 182 35" fill="#91C99A"/>
      <circle cx="195" cy="20" r="6" fill="#FFD66B"/>
    </svg>`,
    circuit: `<svg viewBox="0 0 220 110" width="200" height="100" fill="none" stroke="#292D32" stroke-width="2.5" stroke-linecap="round" aria-hidden="true">
      <rect x="35" y="25" width="150" height="60" rx="12" stroke-dasharray="6 4"/>
      <rect x="22" y="40" width="26" height="30" rx="4" fill="#FFD66B"/>
      <line x1="28" y1="35" x2="42" y2="35" stroke-width="3"/>
      <circle cx="185" cy="55" r="16" fill="#FFD66B"/>
      <path d="M179 55 Q185 45 191 55" stroke="#292D32"/>
      <line x1="162" y1="35" x2="155" y2="28"/><line x1="208" y1="35" x2="215" y2="28"/>
      <path d="M95 25 L115 14" stroke="#F28F83" stroke-width="3"/>
      <circle cx="95" cy="25" r="3" fill="#292D32"/><circle cx="122" cy="25" r="3" fill="#292D32"/>
    </svg>`,
    newton: `<svg viewBox="0 0 220 110" width="200" height="100" fill="none" stroke="#292D32" stroke-width="2.5" stroke-linecap="round" aria-hidden="true">
      <path d="M85 65 L110 20 L135 65 Z" fill="#F28F83"/>
      <rect x="92" y="65" width="36" height="14" rx="4" fill="#75B9E7"/>
      <path d="M98 79 L92 98 L110 90 L128 98 L122 79 Z" fill="#FFD66B"/>
      <path d="M55 45 L80 45 M73 39 L81 45 L73 51" stroke="#292D32"/>
      <path d="M165 45 L140 45 M147 39 L139 45 L147 51" stroke="#292D32"/>
    </svg>`,
    quantum: `<svg viewBox="0 0 220 110" width="200" height="100" fill="none" stroke="#292D32" stroke-width="2.5" stroke-linecap="round" aria-hidden="true">
      <path d="M20 55 Q45 20 70 55 T120 55 T170 55 T205 55" stroke="#75B9E7" stroke-width="3"/>
      <circle cx="70" cy="55" r="9" fill="#FFD66B"/>
      <circle cx="120" cy="55" r="9" fill="#F28F83"/>
      <circle cx="170" cy="55" r="9" fill="#A994E8"/>
      <text x="152" y="25" font-family="Fredoka" font-size="13" fill="#292D32" stroke="none">E = h·f</text>
    </svg>`,
    atom: `<svg viewBox="0 0 220 110" width="200" height="100" fill="none" stroke="#292D32" stroke-width="2.5" aria-hidden="true">
      <ellipse cx="110" cy="55" rx="68" ry="22" transform="rotate(-25 110 55)" stroke="#75B9E7"/>
      <ellipse cx="110" cy="55" rx="68" ry="22" transform="rotate(25 110 55)" stroke="#A994E8"/>
      <ellipse cx="110" cy="55" rx="68" ry="22" transform="rotate(90 110 55)" stroke="#91C99A"/>
      <circle cx="106" cy="52" r="7" fill="#F28F83"/>
      <circle cx="115" cy="56" r="7" fill="#FFD66B"/>
      <circle cx="110" cy="61" r="6" fill="#F28F83"/>
      <circle cx="52" cy="30" r="5" fill="#75B9E7"/>
      <circle cx="168" cy="80" r="5" fill="#A994E8"/>
    </svg>`,
    reaction: `<svg viewBox="0 0 220 110" width="200" height="100" fill="none" stroke="#292D32" stroke-width="2.5" stroke-linecap="round" aria-hidden="true">
      <path d="M70 25 H96 M76 25 V45 L58 85 Q55 92 64 92 H102 Q111 92 108 85 L90 45 V25" fill="#FFFDF7"/>
      <path d="M64 70 H102 L107 85 Q109 90 102 90 H64 Q57 90 59 85 Z" fill="#A994E8"/>
      <circle cx="78" cy="55" r="4" fill="#FFD66B"/>
      <circle cx="88" cy="40" r="5" fill="#75B9E7"/>
      <circle cx="82" cy="14" r="6" fill="#91C99A"/>
      <path d="M135 55 H165 M157 47 L166 55 L157 63" stroke-width="3"/>
    </svg>`,
    ph: `<svg viewBox="0 0 220 110" width="200" height="100" fill="none" stroke="#292D32" stroke-width="2.5" aria-hidden="true">
      <rect x="25" y="42" width="170" height="26" rx="8" fill="#FFD66B"/>
      <rect x="25" y="42" width="56" height="26" rx="6" fill="#F28F83"/>
      <rect x="139" y="42" width="56" height="26" rx="6" fill="#75B9E7"/>
      <text x="38" y="60" font-family="Fredoka" font-size="13" fill="#292D32" stroke="none">ASAM</text>
      <text x="95" y="60" font-family="Fredoka" font-size="13" fill="#292D32" stroke="none">pH 7</text>
      <text x="150" y="60" font-family="Fredoka" font-size="13" fill="#292D32" stroke="none">BASA</text>
    </svg>`,
    polymer: `<svg viewBox="0 0 220 110" width="200" height="100" fill="none" stroke="#292D32" stroke-width="2.5" aria-hidden="true">
      <polygon points="55,35 75,24 95,35 95,58 75,69 55,58" fill="#FFD66B"/>
      <line x1="95" y1="46" x2="115" y2="46" stroke-width="3"/>
      <polygon points="115,35 135,24 155,35 155,58 135,69 115,58" fill="#91C99A"/>
      <line x1="155" y1="46" x2="175" y2="46" stroke-width="3"/>
      <circle cx="185" cy="46" r="10" fill="#75B9E7"/>
    </svg>`,
    cell: `<svg viewBox="0 0 220 110" width="200" height="100" fill="none" stroke="#292D32" stroke-width="2.5" aria-hidden="true">
      <path d="M55 22 Q110 10 165 25 Q185 55 162 88 Q110 100 52 85 Q35 55 55 22 Z" fill="#91C99A"/>
      <circle cx="110" cy="55" r="18" fill="#A994E8"/>
      <circle cx="110" cy="55" r="7" fill="#FFD66B"/>
      <ellipse cx="72" cy="45" rx="11" ry="6" transform="rotate(-30 72 45)" fill="#F28F83"/>
      <ellipse cx="148" cy="68" rx="11" ry="6" transform="rotate(25 148 68)" fill="#75B9E7"/>
    </svg>`,
    photosynthesis: `<svg viewBox="0 0 220 110" width="200" height="100" fill="none" stroke="#292D32" stroke-width="2.5" stroke-linecap="round" aria-hidden="true">
      <circle cx="42" cy="30" r="15" fill="#FFD66B"/>
      <path d="M62 35 L85 45 M79 39 L86 45 L78 48" stroke="#FFD66B" stroke-width="3"/>
      <path d="M95 75 Q115 25 175 35 Q165 88 95 75 Z" fill="#91C99A"/>
      <path d="M95 75 Q132 56 175 35" stroke="#292D32"/>
      <text x="148" y="24" font-family="Fredoka" font-size="13" fill="#292D32" stroke="none">O₂</text>
    </svg>`,
    ecosystem: `<svg viewBox="0 0 220 110" width="200" height="100" fill="none" stroke="#292D32" stroke-width="2.5" stroke-linecap="round" aria-hidden="true">
      <circle cx="50" cy="55" r="20" fill="#91C99A"/>
      <path d="M75 55 H100 M93 49 L101 55 L93 61"/>
      <circle cx="125" cy="55" r="18" fill="#FFD66B"/>
      <path d="M148 55 H170 M163 49 L171 55 L163 61"/>
      <circle cx="188" cy="55" r="15" fill="#F28F83"/>
    </svg>`,
    dna: `<svg viewBox="0 0 220 110" width="200" height="100" fill="none" stroke="#292D32" stroke-width="2.5" stroke-linecap="round" aria-hidden="true">
      <path d="M40 30 Q75 80 110 30 T180 30" stroke="#75B9E7" stroke-width="3"/>
      <path d="M40 80 Q75 30 110 80 T180 80" stroke="#F28F83" stroke-width="3"/>
      <line x1="60" y1="46" x2="60" y2="64" stroke="#292D32"/>
      <line x1="90" y1="46" x2="90" y2="64" stroke="#292D32"/>
      <line x1="130" y1="46" x2="130" y2="64" stroke="#292D32"/>
      <line x1="160" y1="46" x2="160" y2="64" stroke="#292D32"/>
    </svg>`,
    solar: `<svg viewBox="0 0 220 110" width="200" height="100" fill="none" stroke="#292D32" stroke-width="2.5" aria-hidden="true">
      <circle cx="110" cy="55" r="18" fill="#FFD66B"/>
      <ellipse cx="110" cy="55" rx="48" ry="18" stroke-dasharray="4 4"/>
      <ellipse cx="110" cy="55" rx="82" ry="30" stroke-dasharray="4 4"/>
      <circle cx="155" cy="48" r="6" fill="#75B9E7"/>
      <circle cx="42" cy="68" r="9" fill="#F28F83"/>
      <ellipse cx="42" cy="68" rx="16" ry="5" transform="rotate(-20 42 68)" stroke="#A994E8"/>
    </svg>`,
    moon: `<svg viewBox="0 0 220 110" width="200" height="100" fill="none" stroke="#292D32" stroke-width="2.5" aria-hidden="true">
      <path d="M65 30 A25 25 0 1 0 65 80 A18 22 0 1 1 65 30 Z" fill="#FFD66B"/>
      <circle cx="145" cy="55" r="24" fill="#FFFDF7"/>
      <circle cx="138" cy="48" r="4" fill="#EFE7D6"/>
      <circle cx="153" cy="60" r="6" fill="#EFE7D6"/>
      <path d="M105 22 L107 27 L112 29 L107 31 L105 36 L103 31 L98 29 L103 27 Z" fill="#A994E8"/>
    </svg>`,
    star: `<svg viewBox="0 0 220 110" width="200" height="100" fill="none" stroke="#292D32" stroke-width="2.5" stroke-linejoin="round" aria-hidden="true">
      <polygon points="110,16 123,43 153,47 131,68 136,97 110,83 84,97 89,68 67,47 97,43" fill="#FFD66B"/>
      <circle cx="55" cy="32" r="5" fill="#A994E8"/>
      <circle cx="168" cy="78" r="6" fill="#75B9E7"/>
    </svg>`,
    blackhole: `<svg viewBox="0 0 220 110" width="200" height="100" fill="none" stroke="#292D32" stroke-width="2.5" aria-hidden="true">
      <ellipse cx="110" cy="55" rx="75" ry="18" transform="rotate(-15 110 55)" fill="#FFD66B"/>
      <circle cx="110" cy="55" r="24" fill="#292D32"/>
      <ellipse cx="110" cy="55" rx="45" ry="11" transform="rotate(-15 110 55)" stroke="#F28F83" stroke-width="2"/>
    </svg>`
  };
  return svgs[type] || svgs.atom;
}
