const FEATURES = [
  { icon: '⚕', title: 'Biossegurança', text: 'Agulhas e luvas descartáveis, superfícies protegidas e equipamentos esterilizados.' },
  { icon: '✎', title: 'Arte autoral', text: 'Nada de desenho copiado: cada projeto é único e pensado para o seu corpo.' },
  { icon: '◷', title: 'Hora marcada', text: 'Atendimento individual, sem pressa e sem fila, com tempo para fazer bem feito.' },
  { icon: '❤', title: 'Pós-tattoo', text: 'Orientação por escrito e suporte pelo WhatsApp durante toda a cicatrização.' },
];

export default function Features() {
  return (
    <section className="section">
      <div className="container features">
        {FEATURES.map((feature) => (
          <article className="feature reveal" key={feature.title}>
            <div className="feature__icon" aria-hidden="true">
              {feature.icon}
            </div>
            <h3>{feature.title}</h3>
            <p>{feature.text}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
