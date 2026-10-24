// Ilustrações em traço (SVG) usadas quando um trabalho ainda não tem foto.
// São strings fixas do nosso código (nunca vêm do banco), por isso é seguro renderizá-las como HTML.

const open = (strokeWidth = '2.4') =>
  `<svg viewBox="0 0 200 200" fill="none" stroke="currentColor" stroke-width="${strokeWidth}" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">`;

export const ARTES: Record<string, string> = {
  adaga:
    open() +
    '<path d="M100 14 L112 128 L100 140 L88 128 Z"/><path d="M100 14 V140"/><path d="M66 140 H134"/><path d="M72 140 Q100 158 128 140"/><path d="M100 152 V184"/><circle cx="100" cy="190" r="6"/><path d="M40 70 q10 -16 24 -6"/><path d="M160 70 q-10 -16 -24 -6"/></svg>',
  olho:
    open() +
    '<path d="M16 100 C50 52 150 52 184 100 C150 148 50 148 16 100 Z"/><circle cx="100" cy="100" r="30"/><circle cx="100" cy="100" r="12" fill="currentColor"/><path d="M100 24 V40 M60 36 l8 12 M140 36 l-8 12 M100 176 V160 M60 164 l8 -12 M140 164 l-8 -12"/></svg>',
  geometrico:
    open() +
    '<circle cx="100" cy="100" r="82"/><path d="M100 22 L168 140 H32 Z"/><path d="M100 178 L32 60 H168 Z"/><circle cx="100" cy="100" r="26"/><circle cx="100" cy="100" r="4" fill="currentColor"/></svg>',
  rosa:
    open() +
    '<path d="M100 120 C60 120 50 80 76 66 C98 56 118 72 108 90 C102 100 88 98 86 88"/><path d="M100 120 C140 120 150 80 124 66 C102 56 82 72 92 90"/><path d="M100 120 V184"/><path d="M100 160 C74 160 62 144 58 130 C80 130 98 142 100 160 Z"/><path d="M100 148 C120 146 134 134 140 120 C122 120 104 130 100 148 Z"/></svg>',
  cobra:
    open() +
    '<path d="M40 40 C100 20 150 50 120 84 C90 118 40 100 52 140 C62 170 130 176 160 150"/><circle cx="40" cy="40" r="10"/><circle cx="37" cy="37" r="2" fill="currentColor"/><path d="M30 46 L18 50 M18 50 l-6 -4 M18 50 l-6 5"/></svg>',
  caveira:
    open() +
    '<path d="M50 112 C32 88 40 28 100 28 C160 28 168 88 150 112 V134 H50 Z"/><circle cx="76" cy="90" r="14"/><circle cx="124" cy="90" r="14"/><path d="M100 104 L92 124 H108 Z"/><path d="M70 134 V156 M88 134 V156 M106 134 V156 M124 134 V156 M130 134 V156"/><path d="M50 156 H150"/></svg>',
  lettering:
    open('1.4') +
    '<text x="100" y="92" text-anchor="middle" font-family="Georgia, serif" font-style="italic" font-size="44" fill="currentColor" stroke="none">Never</text><text x="100" y="140" text-anchor="middle" font-family="Georgia, serif" font-style="italic" font-size="44" fill="currentColor" stroke="none">Fade</text><path d="M30 156 C70 170 130 170 170 156"/></svg>',
};

export const ARTE_OPTIONS = [
  { value: 'adaga', label: 'Adaga' },
  { value: 'olho', label: 'Olho' },
  { value: 'geometrico', label: 'Geométrico' },
  { value: 'rosa', label: 'Rosa' },
  { value: 'cobra', label: 'Serpente' },
  { value: 'caveira', label: 'Caveira' },
  { value: 'lettering', label: 'Lettering' },
];

export function artSvg(key: string): string {
  return ARTES[key] ?? ARTES.adaga;
}
