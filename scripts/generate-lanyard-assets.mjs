import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

const publicDir = 'e:/threads-elite/public';

// 1. CARD FRONT (1024 x 1440)
const cardFrontSvg = `
<svg width="1024" height="1440" viewBox="0 0 1024 1440" xmlns="http://www.w3.org/2000/svg">
  <!-- Solid Background -->
  <rect width="1024" height="1440" fill="#08070C" />
  
  <!-- Outer Border Frame -->
  <rect x="24" y="24" width="976" height="1392" rx="48" fill="none" stroke="#38264F" stroke-width="4" />
  <rect x="36" y="36" width="952" height="1368" rx="40" fill="#15111F" />

  <!-- Corner Tech Accents -->
  <path d="M 40 100 L 40 40 L 100 40" fill="none" stroke="#8CCF42" stroke-width="8" stroke-linecap="round" />
  <path d="M 984 100 L 984 40 L 924 40" fill="none" stroke="#8CCF42" stroke-width="8" stroke-linecap="round" />
  <path d="M 40 1340 L 40 1400 L 100 1400" fill="none" stroke="#8CCF42" stroke-width="8" stroke-linecap="round" />
  <path d="M 984 1340 L 984 1400 L 924 1400" fill="none" stroke="#8CCF42" stroke-width="8" stroke-linecap="round" />

  <!-- Top Lanyard Slot Cutout Indicator -->
  <rect x="432" y="58" width="160" height="20" rx="10" fill="#08070C" stroke="#38264F" stroke-width="3" />

  <!-- Header Header Line -->
  <text x="512" y="160" font-family="monospace" font-size="16" font-weight="bold" fill="#8CCF42" text-anchor="middle" letter-spacing="8">
    // THREAD SECURITY AUTHORIZED CREDENTIAL //
  </text>

  <!-- Central Shield Graphic -->
  <g transform="translate(512, 340)">
    <!-- Ambient Shield Glow Circles -->
    <circle cx="0" cy="0" r="140" fill="#8000FF" opacity="0.15" />
    <circle cx="0" cy="0" r="110" fill="#8CCF42" opacity="0.08" />
    
    <!-- Shield Outer Path -->
    <path d="M 0 -110 L 90 -50 L 90 40 C 90 95 0 130 0 130 C 0 130 -90 95 -90 40 L -90 -50 Z" 
          fill="#100D17" stroke="#8000FF" stroke-width="8" />
    
    <!-- Shield Inner Inset Path -->
    <path d="M 0 -90 L 72 -40 L 72 32 C 72 78 0 108 0 108 C 0 108 -72 78 -72 32 L -72 -40 Z" 
          fill="#1D1729" stroke="#BD7AFF" stroke-width="3" />

    <!-- Stylized 'T' Security Core -->
    <path d="M -40 -35 L 40 -35 L 40 -12 L 14 -12 L 14 55 L -14 55 L -14 -12 L -40 -12 Z" fill="#FFFFFF" />
    <circle cx="0" cy="72" r="8" fill="#8CCF42" />
  </g>

  <!-- Wordmark: THREAD ELITE -->
  <text x="512" y="540" font-family="system-ui, sans-serif" font-weight="900" font-size="76" fill="#FFFFFF" text-anchor="middle" letter-spacing="4">
    THREAD <tspan fill="#8000FF">ELITE</tspan>
  </text>
  <text x="512" y="585" font-family="monospace" font-weight="bold" font-size="20" fill="#BD7AFF" text-anchor="middle" letter-spacing="6">
    STUDENT LEADERSHIP PROGRAM
  </text>

  <!-- Divider Line -->
  <line x1="120" y1="630" x2="904" y2="630" stroke="#38264F" stroke-width="2" />
  <circle cx="512" cy="630" r="6" fill="#8CCF42" />

  <!-- Credential Info Box -->
  <rect x="96" y="670" width="832" height="480" rx="24" fill="#08070C" stroke="#292132" stroke-width="2" />

  <!-- Chip Graphic -->
  <rect x="140" y="710" width="90" height="72" rx="10" fill="#1D1729" stroke="#BD7AFF" stroke-width="2" />
  <line x1="140" y1="734" x2="230" y2="734" stroke="#BD7AFF" stroke-width="1.5" />
  <line x1="140" y1="758" x2="230" y2="758" stroke="#BD7AFF" stroke-width="1.5" />
  <line x1="185" y1="710" x2="185" y2="782" stroke="#BD7AFF" stroke-width="1.5" />

  <!-- Status Pill -->
  <rect x="670" y="720" width="216" height="44" rx="22" fill="#15111F" stroke="#8CCF42" stroke-width="2" />
  <circle cx="700" cy="742" r="7" fill="#8CCF42" />
  <text x="790" y="749" font-family="monospace" font-size="14" font-weight="bold" fill="#8CCF42" text-anchor="middle" letter-spacing="2">
    ACTIVE // MERIT
  </text>

  <!-- Member Designation -->
  <text x="140" y="840" font-family="monospace" font-size="16" fill="#898293" letter-spacing="3">
    MEMBER IDENTITY:
  </text>
  <text x="140" y="885" font-family="system-ui, sans-serif" font-weight="800" font-size="36" fill="#FFFFFF" letter-spacing="1">
    VERIFIED ELITE FELLOW
  </text>

  <!-- Identity Grid -->
  <g transform="translate(140, 930)">
    <!-- Column 1 -->
    <text x="0" y="24" font-family="monospace" font-size="14" fill="#898293" letter-spacing="2">CREDENTIAL ID</text>
    <text x="0" y="56" font-family="monospace" font-size="22" font-weight="bold" fill="#8CCF42" letter-spacing="2">TE-2026-0842</text>

    <!-- Column 2 -->
    <text x="360" y="24" font-family="monospace" font-size="14" fill="#898293" letter-spacing="2">PROMOTION LEVEL</text>
    <text x="360" y="56" font-family="monospace" font-size="22" font-weight="bold" fill="#BD7AFF" letter-spacing="2">TIER // APEX</text>

    <!-- Row 2 -->
    <text x="0" y="120" font-family="monospace" font-size="14" fill="#898293" letter-spacing="2">GOVERNANCE LEVEL</text>
    <text x="0" y="150" font-family="monospace" font-size="20" font-weight="bold" fill="#FFFFFF" letter-spacing="1">SEC_LEVEL // 05</text>

    <text x="360" y="120" font-family="monospace" font-size="14" fill="#898293" letter-spacing="2">LEDGER STANDING</text>
    <text x="360" y="150" font-family="monospace" font-size="20" font-weight="bold" fill="#FFFFFF" letter-spacing="1">TOP 1% MERIT</text>
  </g>

  <!-- Barcode Bottom Strip -->
  <g transform="translate(140, 1190)">
    <!-- Procedural Barcode Lines -->
    ${Array.from({ length: 48 })
      .map((_, i) => {
        const x = i * 15.5;
        const w = (i % 3 === 0) ? 6 : (i % 2 === 0) ? 4 : 2;
        return `<rect x="${x}" y="0" width="${w}" height="42" fill="#8000FF" />`;
      })
      .join('\n')}
    <text x="372" y="72" font-family="monospace" font-size="13" fill="#898293" text-anchor="middle" letter-spacing="5">
      AUTH_HASH // 8E39-C440-F211-00AA-LEADERSHIP
    </text>
  </g>

  <!-- Bottom Brand Footnote -->
  <text x="512" y="1370" font-family="monospace" font-size="14" fill="#898293" text-anchor="middle" letter-spacing="3">
    THREAD SECURITY · GOVERNED LEADERSHIP ENVIRONMENT
  </text>
</svg>
`;

// 2. CARD BACK (1024 x 1440)
const cardBackSvg = `
<svg width="1024" height="1440" viewBox="0 0 1024 1440" xmlns="http://www.w3.org/2000/svg">
  <!-- Solid Background -->
  <rect width="1024" height="1440" fill="#08070C" />
  
  <!-- Outer Border Frame -->
  <rect x="24" y="24" width="976" height="1392" rx="48" fill="none" stroke="#38264F" stroke-width="4" />
  <rect x="36" y="36" width="952" height="1368" rx="40" fill="#15111F" />

  <!-- Corner Tech Accents -->
  <path d="M 40 100 L 40 40 L 100 40" fill="none" stroke="#8000FF" stroke-width="8" stroke-linecap="round" />
  <path d="M 984 100 L 984 40 L 924 40" fill="none" stroke="#8000FF" stroke-width="8" stroke-linecap="round" />
  <path d="M 40 1340 L 40 1400 L 100 1400" fill="none" stroke="#8000FF" stroke-width="8" stroke-linecap="round" />
  <path d="M 984 1340 L 984 1400 L 924 1400" fill="none" stroke="#8000FF" stroke-width="8" stroke-linecap="round" />

  <!-- Top Slot -->
  <rect x="432" y="58" width="160" height="20" rx="10" fill="#08070C" stroke="#38264F" stroke-width="3" />

  <!-- Organization Header -->
  <g transform="translate(512, 180)">
    <circle cx="-160" cy="-6" r="14" fill="#8CCF42" />
    <text x="0" y="0" font-family="system-ui, sans-serif" font-weight="900" font-size="34" fill="#FFFFFF" text-anchor="middle" letter-spacing="4">
      THREAD SECURITY
    </text>
    <text x="0" y="36" font-family="monospace" font-size="15" fill="#BD7AFF" text-anchor="middle" letter-spacing="4">
      OFFICIAL PARENT GOVERNANCE
    </text>
  </g>

  <!-- Big Magnetic Holographic Strip -->
  <rect x="36" y="270" width="952" height="110" fill="#08070C" />
  <line x1="36" y1="270" x2="988" y2="270" stroke="#8000FF" stroke-width="3" />
  <line x1="36" y1="380" x2="988" y2="380" stroke="#8000FF" stroke-width="3" />
  <text x="512" y="335" font-family="monospace" font-size="18" font-weight="bold" fill="#BD7AFF" text-anchor="middle" letter-spacing="8">
    ◆ ENCRYPTED CREDENTIAL MATRIX ◆
  </text>

  <!-- Four Pillars Showcase -->
  <g transform="translate(140, 460)">
    <text x="0" y="0" font-family="monospace" font-size="16" fill="#8CCF42" letter-spacing="4">
      // CORE LEADERSHIP PILLARS
    </text>

    <!-- Pillar 1: LEARN -->
    <g transform="translate(0, 50)">
      <rect x="0" y="0" width="744" height="88" rx="16" fill="#08070C" stroke="#292132" stroke-width="2" />
      <circle cx="50" cy="44" r="18" fill="#8000FF" />
      <text x="50" y="51" font-family="monospace" font-size="16" font-weight="bold" fill="#FFFFFF" text-anchor="middle">01</text>
      <text x="100" y="52" font-family="system-ui, sans-serif" font-weight="900" font-size="28" fill="#FFFFFF" letter-spacing="2">LEARN</text>
      <text x="240" y="52" font-family="monospace" font-size="15" fill="#898293" letter-spacing="1">— Continuous Technical Mastery</text>
    </g>

    <!-- Pillar 2: EXECUTE -->
    <g transform="translate(0, 160)">
      <rect x="0" y="0" width="744" height="88" rx="16" fill="#08070C" stroke="#292132" stroke-width="2" />
      <circle cx="50" cy="44" r="18" fill="#8000FF" />
      <text x="50" y="51" font-family="monospace" font-size="16" font-weight="bold" fill="#FFFFFF" text-anchor="middle">02</text>
      <text x="100" y="52" font-family="system-ui, sans-serif" font-weight="900" font-size="28" fill="#FFFFFF" letter-spacing="2">EXECUTE</text>
      <text x="280" y="52" font-family="monospace" font-size="15" fill="#898293" letter-spacing="1">— Mission Delivery &amp; Real Work</text>
    </g>

    <!-- Pillar 3: LEAD -->
    <g transform="translate(0, 270)">
      <rect x="0" y="0" width="744" height="88" rx="16" fill="#08070C" stroke="#292132" stroke-width="2" />
      <circle cx="50" cy="44" r="18" fill="#8000FF" />
      <text x="50" y="51" font-family="monospace" font-size="16" font-weight="bold" fill="#FFFFFF" text-anchor="middle">03</text>
      <text x="100" y="52" font-family="system-ui, sans-serif" font-weight="900" font-size="28" fill="#FFFFFF" letter-spacing="2">LEAD</text>
      <text x="210" y="52" font-family="monospace" font-size="15" fill="#898293" letter-spacing="1">— Ownership, Mentorship &amp; Impact</text>
    </g>

    <!-- Pillar 4: GROW -->
    <g transform="translate(0, 380)">
      <rect x="0" y="0" width="744" height="88" rx="16" fill="#08070C" stroke="#292132" stroke-width="2" />
      <circle cx="50" cy="44" r="18" fill="#8000FF" />
      <text x="50" y="51" font-family="monospace" font-size="16" font-weight="bold" fill="#FFFFFF" text-anchor="middle">04</text>
      <text x="100" y="52" font-family="system-ui, sans-serif" font-weight="900" font-size="28" fill="#FFFFFF" letter-spacing="2">GROW</text>
      <text x="230" y="52" font-family="monospace" font-size="15" fill="#898293" letter-spacing="1">— Enduring Professional Legacy</text>
    </g>
  </g>

  <!-- Motto Banner -->
  <rect x="140" y="990" width="744" height="96" rx="20" fill="#1D1729" stroke="#8000FF" stroke-width="2" />
  <text x="512" y="1048" font-family="system-ui, sans-serif" font-weight="900" font-size="30" fill="#FFFFFF" text-anchor="middle" letter-spacing="4">
    ONE LEADER. <tspan fill="#8CCF42">MANY IMPACTS.</tspan>
  </text>

  <!-- Verification URL & Hash -->
  <g transform="translate(512, 1160)">
    <text x="0" y="0" font-family="monospace" font-size="18" font-weight="bold" fill="#BD7AFF" text-anchor="middle" letter-spacing="3">
      VERIFY: https://elite.threadsecurity.in
    </text>
    <text x="0" y="32" font-family="monospace" font-size="13" fill="#898293" text-anchor="middle" letter-spacing="2">
      CRYPTO_PROOF // 0x48FA29C74E08B312E4D517A9B0
    </text>
  </g>

  <!-- Security Seal Warning -->
  <text x="512" y="1370" font-family="monospace" font-size="13" fill="#898293" text-anchor="middle" letter-spacing="2">
    PROPERTY OF THREAD SECURITY · UNAUTHORIZED DUPLICATION PROHIBITED
  </text>
</svg>
`;

// 3. STRAP BAND (256 x 1024 seamless vertical repeat)
const bandSvg = `
<svg width="256" height="1024" viewBox="0 0 256 1024" xmlns="http://www.w3.org/2000/svg">
  <!-- Dark Obsidian/Purple Fabric Background -->
  <rect width="256" height="1024" fill="#0D0A14" />

  <!-- Edge Stitch Lines -->
  <line x1="16" y1="0" x2="16" y2="1024" stroke="#8000FF" stroke-width="4" stroke-dasharray="16,8" />
  <line x1="240" y1="0" x2="240" y2="1024" stroke="#8000FF" stroke-width="4" stroke-dasharray="16,8" />
  
  <line x1="26" y1="0" x2="26" y2="1024" stroke="#38264F" stroke-width="2" />
  <line x1="230" y1="0" x2="230" y2="1024" stroke="#38264F" stroke-width="2" />

  <!-- Repeating Vertical Brand Motif (4 cycles of 256px each) -->
  ${[0, 256, 512, 768].map(y => `
    <g transform="translate(128, ${y + 128}) rotate(-90)">
      <text x="0" y="-12" font-family="system-ui, sans-serif" font-weight="900" font-size="24" fill="#FFFFFF" text-anchor="middle" letter-spacing="4">
        THREAD <tspan fill="#8000FF">ELITE</tspan>
      </text>
      <text x="0" y="18" font-family="monospace" font-weight="bold" font-size="12" fill="#8CCF42" text-anchor="middle" letter-spacing="3">
        ◆ STUDENT LEADERSHIP ◆
      </text>
    </g>
    <circle cx="128" cy="${y + 256}" r="6" fill="#BD7AFF" />
  `).join('\n')}
</svg>
`;

async function main() {
  console.log('Rendering card-front.png...');
  await sharp(Buffer.from(cardFrontSvg))
    .png({ quality: 100, compressionLevel: 9 })
    .toFile(path.join(publicDir, 'card-front.png'));

  console.log('Rendering card-back.png...');
  await sharp(Buffer.from(cardBackSvg))
    .png({ quality: 100, compressionLevel: 9 })
    .toFile(path.join(publicDir, 'card-back.png'));

  console.log('Rendering band.png...');
  await sharp(Buffer.from(bandSvg))
    .png({ quality: 100, compressionLevel: 9 })
    .toFile(path.join(publicDir, 'band.png'));

  console.log('All 3 Lanyard assets generated successfully in public/');
}

main().catch(err => {
  console.error('Error generating assets:', err);
  process.exit(1);
});
