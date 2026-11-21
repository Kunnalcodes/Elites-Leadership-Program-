import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

const publicDir = 'e:/threads-elite/public';

const elites = [
  {
    id: 'dhiraj',
    name: 'DHIRAJ',
    credentialId: 'TE-2026-0842',
    rank: '#01 APEX LEADER',
    rankPill: '🥇 RANK #01 // 2,980 XP (MOST POINTS)',
    xp: '2,980 XP',
    nextLevelTarget: '3,000 XP',
    nextMilestone: 'CATALYST SENTINEL',
    progressPct: 98,
    promotionTier: 'CATALYST',
    badgeColor: '#FFD700', // Gold
    accentColor: '#8000FF',
    photoSrc: 'e:/threads-elite/public/dhiraj.jpg',
    photoPosition: 'top',
    highlight: 'HIGHEST XP SCORE · COHORT LEADER',
  },
  {
    id: 'piyush',
    name: 'PIYUSH',
    credentialId: 'TE-2026-0719',
    rank: '#02 ADVANCED',
    rankPill: '🥈 RANK #02 // 2,750 XP',
    xp: '2,750 XP',
    nextLevelTarget: '2,850 XP',
    nextMilestone: 'CATALYST ADVANCED',
    progressPct: 94,
    promotionTier: 'CATALYST',
    badgeColor: '#BD7AFF', // Violet light
    accentColor: '#8000FF',
    photoSrc: 'e:/threads-elite/public/piyush-raster.png',
    photoPosition: 'center',
    highlight: 'PROMOTED TO CATALYST',
  },
  {
    id: 'kalpana',
    name: 'KALPANA',
    credentialId: 'TE-2026-0654',
    rank: '#03 ADVANCED',
    rankPill: '🥉 RANK #03 // 2,620 XP',
    xp: '2,620 XP',
    nextLevelTarget: '2,700 XP',
    nextMilestone: 'CATALYST ADVANCED',
    progressPct: 92,
    promotionTier: 'CATALYST',
    badgeColor: '#8CCF42', // Security green
    accentColor: '#8000FF',
    photoSrc: 'e:/threads-elite/public/kalpana.jpg',
    photoPosition: 'top',
    highlight: 'PROMOTED TO CATALYST',
  },
];

async function generateCard(elite) {
  console.log(`Generating Catalyst card for ${elite.name}...`);

  // 1. Process Headshot: 540 x 580 px with high clarity
  const photoWidth = 540;
  const photoHeight = 580;
  const photoRadius = 24;

  // Create rounded corner mask for the photo
  const maskSvg = `
    <svg width="${photoWidth}" height="${photoHeight}">
      <rect x="0" y="0" width="${photoWidth}" height="${photoHeight}" rx="${photoRadius}" ry="${photoRadius}" fill="#FFFFFF" />
    </svg>
  `;

  // Crop & mask photo
  const croppedPhoto = await sharp(elite.photoSrc)
    .resize(photoWidth, photoHeight, {
      fit: 'cover',
      position: elite.photoPosition,
    })
    .composite([
      {
        input: Buffer.from(maskSvg),
        blend: 'dest-in',
      },
    ])
    .png()
    .toBuffer();

  // 2. Base SVG Card Canvas (1024 x 1440)
  const barWidth = 760;
  const progressFill = Math.round((barWidth * elite.progressPct) / 100);

  const cardSvg = `
<svg width="1024" height="1440" viewBox="0 0 1024 1440" xmlns="http://www.w3.org/2000/svg">
  <!-- Solid Background -->
  <rect width="1024" height="1440" fill="#08070C" />
  
  <!-- Outer Border Frame -->
  <rect x="24" y="24" width="976" height="1392" rx="44" fill="none" stroke="#38264F" stroke-width="4" />
  <rect x="36" y="36" width="952" height="1368" rx="36" fill="#15111F" />

  <!-- Corner Tech Accents -->
  <path d="M 44 96 L 44 48 L 96 48" fill="none" stroke="${elite.badgeColor}" stroke-width="6" stroke-linecap="round" />
  <path d="M 980 96 L 980 48 L 928 48" fill="none" stroke="${elite.badgeColor}" stroke-width="6" stroke-linecap="round" />
  <path d="M 44 1344 L 44 1392 L 96 1392" fill="none" stroke="${elite.badgeColor}" stroke-width="6" stroke-linecap="round" />
  <path d="M 980 1344 L 980 1392 L 928 1392" fill="none" stroke="${elite.badgeColor}" stroke-width="6" stroke-linecap="round" />

  <!-- Top Slot Hole -->
  <rect x="432" y="56" width="160" height="20" rx="10" fill="#08070C" stroke="#38264F" stroke-width="3" />

  <!-- Header Category Line -->
  <text x="512" y="118" font-family="monospace" font-size="13" font-weight="bold" fill="#8CCF42" text-anchor="middle" letter-spacing="6">
    // THREAD SECURITY AUTHORIZED CREDENTIAL //
  </text>

  <!-- Wordmark Header -->
  <text x="512" y="162" font-family="system-ui, sans-serif" font-weight="900" font-size="32" fill="#FFFFFF" text-anchor="middle" letter-spacing="3">
    THREAD <tspan fill="#8000FF">ELITE</tspan>
  </text>
  <text x="512" y="188" font-family="monospace" font-weight="bold" font-size="11" fill="#BD7AFF" text-anchor="middle" letter-spacing="4">
    STUDENT LEADERSHIP PROGRAM
  </text>

  <!-- Divider Line -->
  <line x1="120" y1="210" x2="904" y2="210" stroke="#292132" stroke-width="2" />
  <circle cx="512" cy="210" r="5" fill="${elite.badgeColor}" />

  <!-- ── PHOTO BORDER & CORNER BRACKETS ── -->
  <!-- Photo sits at x=242, y=230, w=540, h=580 -->
  <g transform="translate(242, 230)">
    <!-- Illuminated Outer Glow Border -->
    <rect x="-8" y="-8" width="556" height="596" rx="30" fill="#0A0810" stroke="#8000FF" stroke-width="4" />
    <rect x="-3" y="-3" width="546" height="586" rx="26" fill="#100D17" stroke="${elite.badgeColor}" stroke-width="2.5" />

    <!-- Corner Brackets -->
    <path d="M -16 26 L -16 -16 L 26 -16" fill="none" stroke="${elite.badgeColor}" stroke-width="4" stroke-linecap="round" />
    <path d="M 556 26 L 556 -16 L 514 -16" fill="none" stroke="${elite.badgeColor}" stroke-width="4" stroke-linecap="round" />
    <path d="M -16 554 L -16 596 L 26 596" fill="none" stroke="${elite.badgeColor}" stroke-width="4" stroke-linecap="round" />
    <path d="M 556 554 L 556 596 L 514 596" fill="none" stroke="${elite.badgeColor}" stroke-width="4" stroke-linecap="round" />

    <!-- Rank Floating Banner across bottom of photo -->
    <g transform="translate(270, 550)">
      <rect x="-240" y="-22" width="480" height="44" rx="22" fill="#08070C" stroke="${elite.badgeColor}" stroke-width="2.5" />
      <text x="0" y="6" font-family="system-ui, sans-serif" font-weight="900" font-size="16" fill="#FFFFFF" text-anchor="middle" letter-spacing="1">
        ${elite.rankPill}
      </text>
    </g>
  </g>

  <!-- ── CANDIDATE NAME ── -->
  <text x="512" y="870" font-family="system-ui, sans-serif" font-weight="900" font-size="52" fill="#FFFFFF" text-anchor="middle" letter-spacing="2">
    ${elite.name}
  </text>

  <!-- ── PROMOTION STATUS: PROMOTED TO CATALYST ── -->
  <g transform="translate(512, 915)">
    <rect x="-260" y="-22" width="520" height="44" rx="22" fill="#8000FF" stroke="#BD7AFF" stroke-width="2" />
    <text x="0" y="7" font-family="system-ui, sans-serif" font-weight="900" font-size="18" fill="#FFFFFF" text-anchor="middle" letter-spacing="3">
      PROMOTED TO CATALYST
    </text>
  </g>

  <!-- ── MILESTONE PROGRESSION TRACKER ── -->
  <g transform="translate(132, 960)">
    <rect x="0" y="0" width="760" height="135" rx="18" fill="#08070C" stroke="#292132" stroke-width="2" />
    
    <text x="24" y="30" font-family="monospace" font-size="12" font-weight="bold" fill="#898293" letter-spacing="2">
      PROMOTION TIER // CATALYST
    </text>
    <text x="736" y="30" font-family="monospace" font-size="12" font-weight="bold" fill="#8CCF42" text-anchor="end" letter-spacing="2">
      ${elite.progressPct}% TO NEXT HORIZON
    </text>

    <!-- Target XP -->
    <text x="24" y="62" font-family="system-ui, sans-serif" font-weight="900" font-size="22" fill="#FFFFFF">
      ${elite.nextMilestone}
    </text>
    <text x="736" y="62" font-family="monospace" font-weight="bold" font-size="16" fill="${elite.badgeColor}" text-anchor="end">
      ${elite.xp} / ${elite.nextLevelTarget}
    </text>

    <!-- Progress Track -->
    <rect x="24" y="82" width="712" height="16" rx="8" fill="#1D1729" stroke="#38264F" stroke-width="1.5" />
    <rect x="24" y="82" width="${Math.round(712 * elite.progressPct / 100)}" height="16" rx="8" fill="${elite.badgeColor}" />
    <circle cx="${24 + Math.round(712 * elite.progressPct / 100)}" cy="90" r="6" fill="#FFFFFF" stroke="#08070C" stroke-width="2" />

    <text x="24" y="118" font-family="monospace" font-size="11" fill="#898293">
      EVALUATED MERIT LEDGER · VERIFIED CONTRIBUTIONS
    </text>
    <text x="736" y="118" font-family="monospace" font-size="11" font-weight="bold" fill="#BD7AFF" text-anchor="end">
      OFFICIAL PROMOTION
    </text>
  </g>

  <!-- ── CREDENTIAL METRICS ROW ── -->
  <g transform="translate(132, 1115)">
    <!-- Box 1 -->
    <rect x="0" y="0" width="235" height="85" rx="14" fill="#100D17" stroke="#292132" stroke-width="1.5" />
    <text x="20" y="28" font-family="monospace" font-size="10" fill="#898293" letter-spacing="2">CREDENTIAL ID</text>
    <text x="20" y="60" font-family="monospace" font-size="18" font-weight="bold" fill="#8CCF42">${elite.credentialId}</text>

    <!-- Box 2 -->
    <rect x="262" y="0" width="235" height="85" rx="14" fill="#100D17" stroke="#292132" stroke-width="1.5" />
    <text x="282" y="28" font-family="monospace" font-size="10" fill="#898293" letter-spacing="2">ACTIVE STATUS</text>
    <text x="282" y="60" font-family="system-ui, sans-serif" font-size="16" font-weight="900" fill="#BD7AFF">CATALYST</text>

    <!-- Box 3 -->
    <rect x="525" y="0" width="235" height="85" rx="14" fill="#100D17" stroke="#292132" stroke-width="1.5" />
    <text x="545" y="28" font-family="monospace" font-size="10" fill="#898293" letter-spacing="2">XP BENCHMARK</text>
    <text x="545" y="60" font-family="monospace" font-size="18" font-weight="bold" fill="#FFFFFF">${elite.xp}</text>
  </g>

  <!-- Barcode Strip -->
  <g transform="translate(132, 1225)">
    ${Array.from({ length: 44 })
      .map((_, i) => {
        const x = i * 17.2;
        const w = (i % 4 === 0) ? 6 : (i % 2 === 0) ? 4 : 2;
        return `<rect x="${x}" y="0" width="${w}" height="32" fill="#8000FF" />`;
      })
      .join('\n')}
    <text x="380" y="54" font-family="monospace" font-size="11" fill="#898293" text-anchor="middle" letter-spacing="4">
      AUTH_HASH // CATALYST-${elite.name}-${elite.credentialId}
    </text>
  </g>

  <!-- Bottom Brand Footnote -->
  <text x="512" y="1370" font-family="monospace" font-size="13" fill="#898293" text-anchor="middle" letter-spacing="3">
    THREAD SECURITY · GOVERNED LEADERSHIP ENVIRONMENT
  </text>
</svg>
`;

  // Render SVG base canvas
  const svgBuffer = Buffer.from(cardSvg);

  // Composite the cropped photograph directly at (242, 230)
  const finalCard = await sharp(svgBuffer)
    .composite([
      {
        input: croppedPhoto,
        top: 230,
        left: 242,
      },
    ])
    .png({ quality: 100, compressionLevel: 9 })
    .toBuffer();

  const outputPath = path.join(publicDir, `card-front-${elite.id}.png`);
  fs.writeFileSync(outputPath, finalCard);
  console.log(`Saved: ${outputPath}`);

  if (elite.id === 'dhiraj') {
    const defaultPath = path.join(publicDir, 'card-front.png');
    fs.writeFileSync(defaultPath, finalCard);
    console.log(`Saved default: ${defaultPath}`);
  }
}

async function main() {
  for (const elite of elites) {
    await generateCard(elite);
  }
  console.log('All Catalyst cards created successfully with crystal-clear headshots!');
}

main().catch(err => {
  console.error('Error generating cards:', err);
  process.exit(1);
});
