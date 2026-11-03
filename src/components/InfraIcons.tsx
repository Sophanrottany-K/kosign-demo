import type { ReactElement } from "react";
import styles from "./HomeInfraRd.module.css";

export const infraIcons: Record<string, ReactElement> = {
  cloud: (
<svg viewBox="0 0 100 100" fill="none">
<circle cx="50" cy="50" r="45" fill="#E6F1F7" />
<path d="M32 58C32 50.82 37.82 45 45 45C45.81 45 46.6 45.07 47.37 45.22C50.23 38.65 56.84 34 64.5 34C74.33 34 82.44 41.52 83.34 51.21C88.24 52.48 92 56.97 92 62.33C92 68.78 86.78 74 80.33 74H41.67C35.22 74 30 68.78 30 62.33C30 59.99 30.69 57.8 31.89 55.98C31.5 53.5 32 58 32 58Z" fill="url(#cloudGrad)" />
<path className={styles.icgArrow} d="M57 60V48M57 48L52 53M57 48L62 53" stroke="#FFFFFF" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
<path d="M22 30L24 34L28 35L24 36L22 40L20 36L16 35L20 34L22 30Z" fill="#329BC2" />
<path d="M78 22L79 24L81 25L79 26L78 28L77 26L75 25L77 24L78 22Z" fill="#329BC2" opacity="0.6" />
<defs>
<linearGradient id="cloudGrad" x1="30" y1="34" x2="92" y2="74" gradientUnits="userSpaceOnUse">
<stop stopColor="#60B6D3" />
<stop offset="1" stopColor="#1376A9" />
</linearGradient>
</defs>
</svg>
  ),
  api: (
<svg viewBox="0 0 100 100" fill="none">
<circle cx="50" cy="50" r="45" fill="#E6F1F7" />
<circle className={styles.icgRing} cx="50" cy="50" r="30" stroke="#329BC2" strokeDasharray="4 4" strokeWidth="1.5" opacity="0.6" />
<circle cx="20" cy="50" r="4" fill="#329BC2" />
<circle cx="50" cy="20" r="4" fill="#329BC2" />
<circle cx="80" cy="50" r="4" fill="#329BC2" />
<circle cx="50" cy="80" r="4" fill="#329BC2" />
<path d="M50 32L72 42V62L50 72L28 62V42L50 32Z" fill="url(#cubeGrad)" />
<path d="M50 32V72M50 32L72 42M50 32L28 42" stroke="#FFFFFF" strokeWidth="1.5" opacity="0.4" />
<rect x="58" y="52" width="26" height="14" rx="7" fill="#0A2A3E" stroke="#FFFFFF" strokeWidth="1.5" />
<text x="71" y="62" fill="#FFFFFF" fontSize="8" fontWeight="bold" textAnchor="middle" fontFamily="sans-serif">API</text>
<defs>
<linearGradient id="cubeGrad" x1="28" y1="32" x2="72" y2="72" gradientUnits="userSpaceOnUse">
<stop stopColor="#60B6D3" />
<stop offset="1" stopColor="#1376A9" />
</linearGradient>
</defs>
</svg>
  ),
  turnkey: (
<svg viewBox="0 0 100 100" fill="none">
<circle cx="50" cy="50" r="45" fill="#E6F1F7" />
<path d="M30 65C38 52 62 52 70 65" stroke="#329BC2" strokeWidth="2" strokeDasharray="3 3" />
<path d="M50 42V65" stroke="#329BC2" strokeWidth="2" strokeDasharray="3 3" />
<circle cx="26" cy="65" r="7" fill="#1376A9" />
<path d="M16 80C16 73 21 72 26 72C31 72 36 73 36 80H16Z" fill="#1376A9" />
<circle cx="74" cy="65" r="7" fill="#1376A9" />
<path d="M64 80C64 73 69 72 74 72C79 72 84 73 84 80H64Z" fill="#1376A9" />
<circle cx="50" cy="42" r="10" fill="url(#leaderGrad)" />
<path d="M35 65C35 55 42 54 50 54C58 54 65 55 65 65H35Z" fill="url(#leaderGrad)" />
<defs>
<linearGradient id="leaderGrad" x1="35" y1="32" x2="65" y2="65" gradientUnits="userSpaceOnUse">
<stop stopColor="#60B6D3" />
<stop offset="1" stopColor="#1376A9" />
</linearGradient>
</defs>
</svg>
  ),
  publicRd: (
<svg viewBox="0 0 100 100" fill="none">
<circle cx="50" cy="50" r="45" fill="#E6F1F7" />
<path d="M26 44L50 32L74 44H26Z" fill="url(#govGrad)" />
<rect x="28" y="46" width="44" height="4" fill="url(#govGrad)" />
<rect x="32" y="52" width="4" height="18" fill="url(#govGrad)" />
<rect x="42" y="52" width="4" height="18" fill="url(#govGrad)" />
<rect x="54" y="52" width="4" height="18" fill="url(#govGrad)" />
<rect x="64" y="52" width="4" height="18" fill="url(#govGrad)" />
<rect x="24" y="72" width="52" height="4" fill="url(#govGrad)" />
<rect x="20" y="77" width="60" height="4" fill="url(#govGrad)" />
<circle cx="70" cy="70" r="12" fill="#0A2A3E" stroke="#FFFFFF" strokeWidth="1.5" />
<path d="M70 63C67.5 63 65.5 65 65.5 67.5C65.5 69 66.5 70.5 67.5 71.5V74.5H72.5V71.5C73.5 70.5 74.5 69 74.5 67.5C74.5 65 72.5 63 70 63ZM68.5 76H71.5V77H68.5V76Z" fill="#FFFFFF" />
<defs>
<linearGradient id="govGrad" x1="20" y1="32" x2="80" y2="80" gradientUnits="userSpaceOnUse">
<stop stopColor="#60B6D3" />
<stop offset="1" stopColor="#1376A9" />
</linearGradient>
</defs>
</svg>
  ),
};
