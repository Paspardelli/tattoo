// Faixa vermelha rolando com os estilos do tatuador (repetida 2x para o loop ficar contínuo)
export default function Marquee({ items }: { items: string[] }) {
  if (items.length === 0) return null;
  const loop = [...items, ...items];

  return (
    <div className="marquee" aria-hidden="true">
      <div className="marquee__track">
        {loop.map((item, index) => (
          <span key={`${item}-${index}`} style={{ display: 'contents' }}>
            <span>{item}</span>
            <span>&#10022;</span>
          </span>
        ))}
      </div>
    </div>
  );
}
