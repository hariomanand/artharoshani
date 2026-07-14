// ArthaRoshni — custom SVG icon set. Every icon is hand-drawn (24×24 grid,
// stroke = currentColor) so the whole site shares one visual language.
// Usage: icon('flask') or icon('flask', 20, 'my-class').

const I = {
  /* ---- navigation ---- */
  courses: `<path d="M12 6.4C10 4.8 7.3 4 4 4v14.2c3.3 0 6 .8 8 2.4 2-1.6 4.7-2.4 8-2.4V4c-3.3 0-6 .8-8 2.4Z"/><path d="M12 6.4v14.2"/>`,
  certifications: `<circle cx="12" cy="9" r="5.4"/><path d="m8.8 13.4-1.9 7 5.1-2.7 5.1 2.7-1.9-7"/><path d="m10.2 8.9 1.3 1.4 2.5-2.7"/>`,
  labs: `<path d="M9.6 3h4.8M10.6 3v5.3L5.4 17.6A2.1 2.1 0 0 0 7.3 21h9.4a2.1 2.1 0 0 0 1.9-3.4l-5.2-9.3V3"/><path d="M7.4 14.6h9.2"/><circle cx="10.5" cy="17.5" r=".6" fill="currentColor" stroke="none"/><circle cx="13.6" cy="18.4" r=".6" fill="currentColor" stroke="none"/>`,
  practice: `<circle cx="12" cy="12" r="8.6"/><circle cx="12" cy="12" r="4.6"/><circle cx="12" cy="12" r="1.2" fill="currentColor" stroke="none"/>`,
  blogs: `<rect x="3.5" y="4.5" width="17" height="15.5" rx="2.2"/><path d="M7.3 9h5.4M7.3 12.4h9.4M7.3 15.8h9.4"/><path d="M16.7 9h.01"/>`,
  about: `<circle cx="12" cy="12" r="8.8"/><path d="M12 11.2v5.4"/><circle cx="12" cy="7.9" r="1.1" fill="currentColor" stroke="none"/>`,
  search: `<circle cx="11" cy="11" r="6.8"/><path d="m16.2 16.2 4.6 4.6"/>`,
  user: `<circle cx="12" cy="8.2" r="3.9"/><path d="M4.4 20.6c.5-3.9 3.6-6 7.6-6s7.1 2.1 7.6 6"/>`,
  menu: `<path d="M4 7h16M4 12h16M4 17h16"/>`,
  close: `<path d="m6 6 12 12M18 6 6 18"/>`,
  chevron: `<path d="m6.5 9.5 5.5 5.5 5.5-5.5"/>`,
  arrow: `<path d="M4 12h15m-5.5-5.5L19 12l-5.5 5.5"/>`,
  back: `<path d="M20 12H5m5.5 5.5L5 12l5.5-5.5"/>`,

  /* ---- classes ---- */
  class10: `<rect x="4.2" y="3.6" width="15.6" height="16.8" rx="2.4"/><path d="M4.2 7.8h15.6"/><text x="12" y="16.6" text-anchor="middle" font-size="8" font-weight="800" fill="currentColor" stroke="none" font-family="inherit">10</text>`,
  class11: `<rect x="4.2" y="3.6" width="15.6" height="16.8" rx="2.4"/><path d="M4.2 7.8h15.6"/><text x="12" y="16.6" text-anchor="middle" font-size="8" font-weight="800" fill="currentColor" stroke="none" font-family="inherit">11</text>`,
  class12: `<rect x="4.2" y="3.6" width="15.6" height="16.8" rx="2.4"/><path d="M4.2 7.8h15.6"/><text x="12" y="16.6" text-anchor="middle" font-size="8" font-weight="800" fill="currentColor" stroke="none" font-family="inherit">12</text>`,
  grid: `<rect x="4" y="4" width="7" height="7" rx="1.6"/><rect x="13" y="4" width="7" height="7" rx="1.6"/><rect x="4" y="13" width="7" height="7" rx="1.6"/><rect x="13" y="13" width="7" height="7" rx="1.6"/>`,
  gradcap: `<path d="m2.6 9.2 9.4-5 9.4 5-9.4 5-9.4-5Z"/><path d="M6.6 11.6V16c0 1.5 2.4 3 5.4 3s5.4-1.5 5.4-3v-4.4"/><path d="M21.4 9.2v5.2"/>`,

  /* ---- labs / tools ---- */
  scatter: `<path d="M4.5 4v15.5H20"/><circle cx="9" cy="14.6" r="1.2"/><circle cx="12" cy="11.6" r="1.2"/><circle cx="15.4" cy="12.8" r="1.2"/><circle cx="17.4" cy="7.6" r="1.2"/><path d="m6.8 16.6 11.4-9.2" stroke-dasharray="2.4 2.2"/>`,
  code: `<path d="m9 8-4.2 4L9 16M15 8l4.2 4L15 16"/>`,
  sliders: `<path d="M4.5 8h15M4.5 16h15"/><circle cx="10" cy="8" r="2.3"/><circle cx="15" cy="16" r="2.3"/>`,
  chat: `<path d="M20.8 11.6a8.3 8.3 0 0 1-8.3 8.2H3.8l2.1-3a8.3 8.3 0 1 1 14.9-5.2Z"/><path d="M8.4 11.9c1.2-1.4 2.4 1.4 3.6 0s2.4 1.4 3.6 0"/>`,
  brain: `<path d="M9.4 4.2a2.9 2.9 0 0 0-2.9 2.9 3.2 3.2 0 0 0-2 3c0 .8.3 1.6.8 2.1a3.4 3.4 0 0 0-.4 2.7 3 3 0 0 0 3.1 2.3 3.1 3.1 0 0 0 4 1.9V5.4a2.9 2.9 0 0 0-2.6-1.2ZM14.6 4.2a2.9 2.9 0 0 1 2.9 2.9 3.2 3.2 0 0 1 2 3c0 .8-.3 1.6-.8 2.1a3.4 3.4 0 0 1 .4 2.7 3 3 0 0 1-3.1 2.3 3.1 3.1 0 0 1-4 1.9V5.4a2.9 2.9 0 0 1 2.6-1.2Z"/>`,
  candles: `<path d="M7 3.8v3m0 6.4v3M12 5.6v2.6m0 7.4v2.6M17 3.8v3.4m0 7.6v2.4"/><rect x="5.4" y="6.8" width="3.2" height="6.4" rx=".8"/><rect x="10.4" y="8.2" width="3.2" height="7.2" rx=".8"/><rect x="15.4" y="7.2" width="3.2" height="7.6" rx=".8"/>`,
  pin: `<path d="M12 21c4.6-4 7-7.7 7-11a7 7 0 1 0-14 0c0 3.3 2.4 7 7 11Z"/><circle cx="12" cy="9.8" r="2.4"/>`,
  compass: `<circle cx="12" cy="12" r="8.8"/><path d="m15.6 8.4-2 5.2-5.2 2 2-5.2 5.2-2Z"/><circle cx="12" cy="12" r=".9" fill="currentColor" stroke="none"/>`,

  /* ---- economy / careers ---- */
  trendUp: `<path d="M3.5 17.5 9 12l3.6 3.6 7.9-8.6"/><path d="M15.2 7h5.3v5.3"/>`,
  bars: `<path d="M5.2 20V13.4M10 20V8.6M14.8 20V11M19.6 20V5.4"/>`,
  bank: `<path d="M3.6 9.4 12 4.2l8.4 5.2H3.6Z"/><path d="M5.6 9.4v7.2M10 9.4v7.2M14 9.4v7.2M18.4 9.4v7.2"/><path d="M4 19.8h16M3 16.6h18" stroke-width="0"/><path d="M3.6 20h16.8M5 16.9h14"/>`,
  scale: `<path d="M12 4.4v15.2M5.4 6.8h13.2"/><path d="m5.4 6.8-2.4 6a3.1 3.1 0 0 0 4.8 0l-2.4-6ZM18.6 6.8l-2.4 6a3.1 3.1 0 0 0 4.8 0l-2.4-6Z"/><path d="M8.4 19.6h7.2"/>`,
  pen: `<path d="m14.2 4.8 5 5L8.4 20.6H3.4v-5L14.2 4.8Z"/><path d="m12 7 5 5"/>`,
  rupee: `<path d="M6.8 4.2h10.4M6.8 8.6h10.4M9.4 4.2c6 0 6 8.4 0 8.4H6.8l8.6 7.6"/>`,
  calc: `<rect x="4.8" y="3.4" width="14.4" height="17.2" rx="2.4"/><path d="M8.2 7.4h7.6"/><path d="M8.4 12h.01M12 12h.01M15.6 12h.01M8.4 15h.01M12 15h.01M15.6 15h.01M8.4 18h.01M12 18h.01M15.6 18h.01"/>`,
  checkSquare: `<rect x="4" y="4" width="16" height="16" rx="3"/><path d="m8.4 12.4 2.6 2.7 5-5.6"/>`,
  offline: `<path d="M7 18.6a4.6 4.6 0 0 1 .5-9.1A5.6 5.6 0 0 1 18.2 11a3.9 3.9 0 0 1 .8 7.4"/><path d="M12 12.4v6.4m-3-3 3 3 3-3"/>`,
  file: `<path d="M6.2 3.2h7.6l4.4 4.4v13.2H6.2V3.2Z"/><path d="M13.8 3.2v4.4h4.4"/><path d="M9 12h6M9 15.4h6"/>`,
  heart: `<path d="M12 20.4S4.2 15.5 4.2 9.9A4.3 4.3 0 0 1 12 7.4a4.3 4.3 0 0 1 7.8 2.5c0 5.6-7.8 10.5-7.8 10.5Z"/>`,
  phone: `<rect x="6.8" y="3" width="10.4" height="18" rx="2.6"/><path d="M10.8 17.6h2.4"/>`,
  download: `<path d="M12 3.8v10.4m-4.4-4L12 14.6l4.4-4.4"/><path d="M4.6 16.8v2.2a2 2 0 0 0 2 2h10.8a2 2 0 0 0 2-2v-2.2"/>`,
  star: `<path d="m12 3.6 2.6 5.3 5.8.9-4.2 4.1 1 5.8-5.2-2.7-5.2 2.7 1-5.8-4.2-4.1 5.8-.9L12 3.6Z"/>`,
  play: `<path d="M8.2 5.4v13.2L18.6 12 8.2 5.4Z"/>`,
  sparkle: `<path d="M12 3.4 13.9 10l6.7 2-6.7 2L12 20.6 10.1 14l-6.7-2 6.7-2L12 3.4Z"/>`,
  bookmark: `<path d="M6.4 3.6h11.2v17L12 16.4l-5.6 4.2v-17Z"/>`,

  /* ---- blueprint / india ---- */
  factory: `<path d="M3.6 20.4V9.6l5.2 3.2V9.6l5.2 3.2V5.4A1.6 1.6 0 0 1 15.6 3.8h3a1.6 1.6 0 0 1 1.6 1.6v15h-16.6Z"/><path d="M7 16.6h2.2M12 16.6h2.2M16.8 16.6h.01"/>`,
  chip: `<rect x="7" y="7" width="10" height="10" rx="2"/><path d="M10 3.4V7M14 3.4V7M10 17v3.6M14 17v3.6M3.4 10H7M3.4 14H7M17 10h3.6M17 14h3.6"/><path d="M10.4 10.4h3.2v3.2h-3.2z"/>`,
  users: `<circle cx="9" cy="8.6" r="3.5"/><path d="M2.6 20c.4-3.4 3-5.4 6.4-5.4s6 2 6.4 5.4"/><path d="M15.8 5.5a3.5 3.5 0 0 1 .2 6.5M18.4 14.9c1.9.9 3 2.5 3 4.7"/>`,
  leaf: `<path d="M5 19C5 9.4 12 4.2 20 4.2c0 9-4.4 14.8-12 14.8H5Z"/><path d="M5 19c2-5.4 5.4-8.9 10-10.9"/>`,
  globe: `<circle cx="12" cy="12" r="8.8"/><path d="M3.2 12h17.6M12 3.2c-4.6 4.9-4.6 12.7 0 17.6 4.6-4.9 4.6-12.7 0-17.6Z"/>`,
  gears: `<circle cx="12" cy="12" r="3.2"/><path d="M12 4.4v2.2M12 17.4v2.2M4.4 12h2.2M17.4 12h2.2M6.6 6.6l1.6 1.6M15.8 15.8l1.6 1.6M17.4 6.6l-1.6 1.6M8.2 15.8l-1.6 1.6"/>`,
  pillar: `<path d="M4.8 8.6 12 4.2l7.2 4.4"/><path d="M6.6 9.4v7M12 9.4v7M17.4 9.4v7"/><path d="M4.2 19.8h15.6M5 16.9h14"/>`,
  road: `<path d="M6.4 20.5 10 3.5M17.6 20.5 14 3.5"/><path d="M12 5.2v2.4M12 10.6V13M12 16.4v2.4"/>`,
  wheat: `<path d="M12 21V9.4"/><path d="M12 12.6c-3 0-4.6-1.6-4.6-4.2 3 0 4.6 1.6 4.6 4.2ZM12 12.6c3 0 4.6-1.6 4.6-4.2-3 0-4.6 1.6-4.6 4.2ZM12 17c-3 0-4.6-1.6-4.6-4.2 3 0 4.6 1.6 4.6 4.2ZM12 17c3 0 4.6-1.6 4.6-4.2-3 0-4.6 1.6-4.6 4.2Z"/><path d="M12 9.4c-1.4-1-1.4-3.4 0-5.4 1.4 2 1.4 4.4 0 5.4Z"/>`,
  chain: `<path d="M9.8 14.2 14.2 9.8"/><path d="M8 12 5.8 14.2a3.4 3.4 0 0 0 4.8 4.8L12.8 16.8M16 12l2.2-2.2a3.4 3.4 0 0 0-4.8-4.8L11.2 7.2"/>`,
  handshake: `<path d="m3 8.4 4.2-1.8 5 1.6 4.6-1.6L21 8.4v6.8l-2.4 1.2-4.4 3.2a1.8 1.8 0 0 1-2.4 0L7.4 16.4 5 15.2 3 14V8.4Z"/><path d="m12.2 8.2-3.4 3a1.4 1.4 0 0 0 1.9 2.1l1.7-1.5 4 3.4"/>`,
  flag: `<path d="M5.4 21V3.6"/><path d="M5.4 4.6c4.4-2 8.8 2 13.2 0v9c-4.4 2-8.8-2-13.2 0"/>`,
  indiaMini: `<path d="M9.7 2.6 11.9 4l2.1-.8 1.4 1.8 3.2.8-.9 2.6 2.3 1.4-1.7 2.1.5 2-2.4.7-1.3 2.5-1.7 4.5-1.9 1.8-1.6-2.6-1.5-3.5-2.6-1.7.7-2.2-2.3-1L5 9.9 3.4 8.5l2.2-1.7-.3-2.4 2.6.4 1.8-2.2Z"/>`,
  medal: `<path d="m7.4 3.6 2 4.8M16.6 3.6l-2 4.8M9 3.6H6l2.2 5.2M15 3.6h3l-2.2 5.2"/><circle cx="12" cy="14.4" r="5.6"/><path d="m12 11.6.9 1.8 2 .3-1.4 1.4.3 2-1.8-1-1.8 1 .3-2-1.4-1.4 2-.3.9-1.8Z"/>`,
};

export function icon(name, size = 20, cls = '') {
  const body = I[name] || I.sparkle;
  return `<svg class="svgi ${cls}" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${body}</svg>`;
}

export const hasIcon = name => !!I[name];
