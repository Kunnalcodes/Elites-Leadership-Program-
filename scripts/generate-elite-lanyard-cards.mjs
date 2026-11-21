import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

const publicDir = 'e:/threads-elite/public';

const elites = [
  {
    id: 'dhiraj',
    name: 'DHIRAJ',
    credentialId: 'TE-2026-0842',
    rank: '#01 APEX CHAMPION',
    rankLabel: '1ST POSITION // HIGHEST MERIT',
    badgeIcon: '👑',
    xp: '2,980 XP',
    nextLevelTarget: '3,000 XP',
    nextLevelName: 'APEX SENTINEL',
    progressPct: 98,
    tier: 'APEX TIER',
    tierColor: '#FFD700', // Gold
    glowColor: '#8000FF',
    photoSrc: 'e:/threads-elite/public/Dhiraj.png',
    photoCrop: { width: 380, height: 430, fit: 'cover', position: 'top' },
    status: 'LEADER // HIGHEST SCORE',
  },
  {
    id: 'piyush',
    name: 'PIYUSH',
    credentialId: 'TE-2026-0719',
    rank: '#02 PIONEER RUNNER-UP',
    rankLabel: '2ND POSITION // ADVANCING',
    badgeIcon: '⚡',
    xp: '2,750 XP',
    nextLevelTarget: '2,850 XP',
    nextLevelName: 'APEX CANDIDATE',
    progressPct: 94,
    tier: 'PIONEER TIER',
    tierColor: '#BD7AFF', // Violet light
    glowColor: '#8000FF',
    photoSrc: 'e:/threads-elite/public/piyush-raster.png',
    photoCrop: { width: 380, height: 430, fit: 'cover', position: 'center' },
    status: 'ACTIVE // MERIT ADVANCING',
  },
  {
    id: 'kalpana',
    name: 'KALPANA',
    credentialId: 'TE-2026-0654',
    rank: '#03 PIONEER THIRD',
    rankLabel: '3RD POSITION // ACCELERATING',
    badgeIcon: '🌟',
    xp: '2,620 XP',
    nextLevelTarget: '2,700 XP',
    nextLevelName: 'PIONEER ADVANCED',
    progressPct: 92,
    tier: 'PIONEER TIER',
    tierColor: '#8CCF42', // Security green
    glowColor: '#8000FF',
    photoSrc: 'e:/threads-elite/public/Kalpana.png',
    photoCrop: { width: 380, height: 430, fit: 'cover', position: 'top' },
    status: 'ACTIVE // MERIT ACCELERATING',
  },
];

async function generateCard(elite) {
  console.log(`Generating card for ${elite.name}...`);

  // 1. Prepare cropped & rounded photo
  const photoBuffer = await sharp(elite.photoSrc)
    .resize(elite.photoCrop.width, elite.photoCrop.height, {
      fit: elite.photoCrop.fit,
      position: elite.photoCrop.position,
    })
    .toBuffer();

  const photoBase64 = `data:image/png;base64,${photoBuffer.toString('base64')}`;

  // Progress bar width (max 760px)
  const barWidth = 760;
  const progressFill = Math.round((barWidth * elite.progressPct) / 100);

  // 2. SVG template for the Card Front
  const cardSvg = `
<svg width="1024" height="1440" viewBox="0 0 1024 1440" xmlns="http://www.w3.org/2000/svg">
  <!-- Solid Background -->
  <rect width="1024" height="1440" fill="#08070C" />
  
  <!-- Outer Border Frame -->
  <rect x="24" y="24" width="976" height="1392" rx="44" fill="none" stroke="#38264F" stroke-width="4" />
  <rect x="36" y="36" width="952" height="1368" rx="36" fill="#15111F" />

  <!-- Corner Tech Accents -->
  <path d="M 44 96 L 44 48 L 96 48" fill="none" stroke="${elite.tierColor}" stroke-width="6" stroke-linecap="round" />
  <path d="M 980 96 L 980 48 L 928 48" fill="none" stroke="${elite.tierColor}" stroke-width="6" stroke-linecap="round" />
  <path d="M 44 1344 L 44 1392 L 96 1392" fill="none" stroke="${elite.tierColor}" stroke-width="6" stroke-linecap="round" />
  <path d="M 980 1344 L 980 1392 L 928 1392" fill="none" stroke="${elite.tierColor}" stroke-width="6" stroke-linecap="round" />

  <!-- Top Slot Hole -->
  <rect x="432" y="56" width="160" height="20" rx="10" fill="#08070C" stroke="#38264F" stroke-width="3" />

  <!-- Header Category Line -->
  <text x="512" y="125" font-family="monospace" font-size="14" font-weight="bold" fill="#8CCF42" text-anchor="middle" letter-spacing="6">
    // THREAD SECURITY AUTHORIZED CREDENTIAL //
  </text>

  <!-- Wordmark Header -->
  <text x="512" y="172" font-family="system-ui, sans-serif" font-weight="900" font-size="34" fill="#FFFFFF" text-anchor="middle" letter-spacing="3">
    THREAD <tspan fill="#8000FF">ELITE</tspan>
  </text>
  <text x="512" y="198" font-family="monospace" font-weight="bold" font-size="12" fill="#BD7AFF" text-anchor="middle" letter-spacing="4">
    STUDENT LEADERSHIP PROGRAM
  </text>

  <!-- Divider Line -->
  <line x1="120" y1="222" x2="904" y2="222" stroke="#292132" stroke-width="2" />
  <circle cx="512" cy="222" r="5" fill="${elite.tierColor}" />

  <!-- ── CENTRAL PHOTO DISPLAY (380 x 430) ── -->
  <g transform="translate(322, 245)">
    <!-- Backing Frame & Glow -->
    <rect x="-10" y="-10" width="400" height="450" rx="26" fill="#0A0810" stroke="#8000FF" stroke-width="3" />
    <rect x="-4" y="-4" width="388" height="438" rx="22" fill="#100D17" stroke="${elite.tierColor}" stroke-width="2" />

    <!-- Corner Crosshairs -->
    <path d="M -16 20 L -16 -16 L 20 -16" fill="none" stroke="${elite.tierColor}" stroke-width="4" />
    <path d="M 396 20 L 396 -16 L 360 -16" fill="none" stroke="${elite.tierColor}" stroke-width="4" />
    <path d="M -16 410 L -16 446 L 20 446" fill="none" stroke="${elite.tierColor}" stroke-width="4" />
    <path d="M 396 410 L 396 446 L 360 446" fill="none" stroke="${elite.tierColor}" stroke-width="4" />

    <!-- Masked Image -->
    <clipPath id="photoClip-${elite.id}">
      <rect x="0" y="0" width="380" height="430" rx="18" />
    </clipPath>
    <image x="0" y="0" width="380" height="430" href="${photoBase64}" preserveAspectRatio="xMidYMid slice" clip-path="url(#photoClip-${elite.id})" />

    <!-- Rank Floating Badge Overlay on Photo -->
    <g transform="translate(190, 400)">
      <rect x="-170" y="-22" width="340" height="44" rx="22" fill="#08070C" stroke="${elite.tierColor}" stroke-width="2.5" />
      <text x="0" y="6" font-family="system-ui, sans-serif" font-weight="900" font-size="16" fill="#FFFFFF" text-anchor="middle" letter-spacing="2">
        ${elite.badgeIcon} ${elite.rank}
      </text>
    </g>
  </g>

  <!-- ── ELITE IDENTITY BLOCK ── -->
  <!-- Name Heading -->
  <text x="512" y="745" font-family="system-ui, sans-serif" font-weight="900" font-size="46" fill="#FFFFFF" text-anchor="middle" letter-spacing="2">
    ${elite.name}
  </text>
  <text x="512" y="780" font-family="monospace" font-weight="bold" font-size="14" fill="${elite.tierColor}" text-anchor="middle" letter-spacing="4">
    ${elite.rankLabel}
  </text>

  <!-- ── HEADING TOWARDS NEXT LEVEL (PROGRESSION ENGINE) ── -->
  <g transform="translate(132, 815)">
    <!-- Box Container -->
    <rect x="0" y="0" width="760" height="150" rx="18" fill="#08070C" stroke="#292132" stroke-width="2" />
    
    <!-- Next Level Header -->
    <text x="24" y="32" font-family="monospace" font-size="12" font-weight="bold" fill="#898293" letter-spacing="2">
      TARGETING NEXT LEVEL:
    </text>
    <text x="736" y="32" font-family="monospace" font-size="13" font-weight="bold" fill="#8CCF42" text-anchor="end" letter-spacing="2">
      ${elite.progressPct}% TO PROMOTION
    </text>

    <!-- Target Title & XP -->
    <text x="24" y="68" font-family="system-ui, sans-serif" font-weight="900" font-size="24" fill="#FFFFFF" letter-spacing="1">
      ${elite.nextLevelName}
    </text>
    <text x="736" y="68" font-family="monospace" font-weight="bold" font-size="16" fill="${elite.tierColor}" text-anchor="end">
      ${elite.xp} / ${elite.nextLevelTarget}
    </text>

    <!-- Progress Bar Track -->
    <rect x="24" y="92" width="712" height="18" rx="9" fill="#1D1729" stroke="#38264F" stroke-width="1.5" />
    <!-- Progress Bar Fill -->
    <rect x="24" y="92" width="${Math.round(712 * elite.progressPct / 100)}" height="18" rx="9" fill="${elite.tierColor}" />
    <!-- Indicator Tick -->
    <circle cx="${24 + Math.round(712 * elite.progressPct / 100)}" cy="101" r="7" fill="#FFFFFF" stroke="#08070C" stroke-width="2" />

    <text x="24" y="132" font-family="monospace" font-size="11" fill="#898293">
      VERIFIED VIA XP LEDGER · EVALUATED RUBRICS
    </text>
    <text x="736" y="132" font-family="monospace" font-size="11" font-weight="bold" fill="#BD7AFF" text-anchor="end">
      AUTOMATED PIPELINE
    </text>
  </g>

  <!-- ── CREDENTIAL METRICS GRID ── -->
  <g transform="translate(132, 995)">
    <!-- Card 1: ID -->
    <rect x="0" y="0" width="235" height="96" rx="14" fill="#100D17" stroke="#292132" stroke-width="1.5" />
    <text x="20" y="30" font-family="monospace" font-size="11" fill="#898293" letter-spacing="2">CREDENTIAL ID</text>
    <text x="20" y="65" font-family="monospace" font-size="18" font-weight="bold" fill="#8CCF42">${elite.credentialId}</text>

    <!-- Card 2: Standing -->
    <rect x="262" y="0" width="235" height="96" rx="14" fill="#100D17" stroke="#292132" stroke-width="1.5" />
    <text x="282" y="30" font-family="monospace" font-size="11" fill="#898293" letter-spacing="2">TIER LEVEL</text>
    <text x="282" y="65" font-family="system-ui, sans-serif" font-size="18" font-weight="900" fill="${elite.tierColor}">${elite.tier}</text>

    <!-- Card 3: XP Score -->
    <rect x="525" y="0" width="235" height="96" rx="14" fill="#100D17" stroke="#292132" stroke-width="1.5" />
    <text x="545" y="30" font-family="monospace" font-size="11" fill="#898293" letter-spacing="2">LIFETIME XP</text>
    <text x="545" y="65" font-family="monospace" font-size="20" font-weight="bold" fill="#FFFFFF">${elite.xp}</text>
  </g>

  <!-- Barcode Strip -->
  <g transform="translate(132, 1125)">
    ${Array.from({ length: 44 })
      .map((_, i) => {
        const x = i * 17.2;
        const w = (i % 4 === 0) ? 6 : (i % 2 === 0) ? 4 : 2;
        return `<rect x="${x}" y="0" width="${w}" height="36" fill="#8000FF" />`;
      })
      .join('\n')}
    <text x="380" y="62" font-family="monospace" font-size="12" fill="#898293" text-anchor="middle" letter-spacing="4">
      AUTH_HASH // ${elite.id.toUpperCase()}-${elite.credentialId}-VERIFIED
    </text>
  </g>

  <!-- Bottom Brand Footnote -->
  <text x="512" y="1370" font-family="monospace" font-size="13" fill="#898293" text-anchor="middle" letter-spacing="3">
    THREAD SECURITY · GOVERNED LEADERSHIP ENVIRONMENT
  </text>
</svg>
`;

  const outputPath = path.join(publicDir, `card-front-${elite.id}.png`);
  await sharp(Buffer.from(cardSvg))
    .png({ quality: 100, compressionLevel: 9 })
    .toFile(outputPath);
  console.log(`Saved: ${outputPath}`);

  if (elite.id === 'dhiraj') {
    // Also overwrite default card-front.png with Dhiraj (Rank 1)
    const defaultPath = path.join(publicDir, 'card-front.png');
    await sharp(Buffer.from(cardSvg))
      .png({ quality: 100, compressionLevel: 9 })
      .toFile(defaultPath);
    console.log(`Saved default: ${defaultPath}`);
  }
}

async function main() {
  for (const elite of elites) {
    await generateCard(elite);
  }
  console.log('All elite lanyard cards created successfully!');
}

main().catch(err => {
  console.error('Error generating elite cards:', err);
  process.exit(1);
});
