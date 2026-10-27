// Silhueta mostrada enquanto o tatuador ainda não enviou a foto (painel → Configurações).
export default function PortraitPlaceholder() {
  return (
    <div className="portrait__ph" aria-hidden="true">
      <svg viewBox="0 0 300 360" fill="currentColor" stroke="none">
        <path d="M18 360 C18 272 78 244 150 244 C222 244 282 272 282 360 Z" />
        <rect x="126" y="196" width="48" height="56" rx="14" />
        <ellipse cx="150" cy="130" rx="52" ry="62" />
        <path d="M100 138 C104 196 196 196 200 138 C196 176 104 176 100 138 Z" />
        <path d="M98 112 C98 62 202 62 202 112 C190 88 110 88 98 112 Z" />
        <g fill="none" stroke="#e5e5e5" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" opacity=".85">
          <path d="M62 300 L74 262 L86 300 L74 312 Z" />
          <path d="M74 262 V318" />
          <path d="M238 292 C226 276 244 262 238 248 C256 264 250 284 238 292 Z" />
          <path d="M150 262 V330 M126 276 C138 286 162 286 174 276" />
        </g>
      </svg>
    </div>
  );
}
