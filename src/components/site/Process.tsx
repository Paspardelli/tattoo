const STEPS = [
  { title: 'Conversa e ideia', text: 'Você me manda referências, local do corpo e tamanho. Eu tiro as dúvidas e passo o valor.' },
  { title: 'Desenho exclusivo', text: 'Crio a arte do zero e ajustamos juntos até ficar exatamente como você imaginou.' },
  { title: 'Agendamento', text: 'Reserva do horário com sinal. Você recebe todas as orientações para o dia da sessão.' },
  { title: 'Sessão e cuidados', text: 'Tatuagem em ambiente 100% higienizado e guia completo de cicatrização depois.' },
];

export default function Process() {
  return (
    <section className="section section--alt" id="processo">
      <div className="container">
        <header className="section__head reveal">
          <p className="eyebrow">Como funciona</p>
          <h2 className="section__title">
            Do primeiro contato à <span className="text-accent">tatuagem pronta</span>
          </h2>
        </header>

        <ol className="steps">
          {STEPS.map((step, index) => (
            <li className="step reveal" key={step.title}>
              <span className="step__num">{String(index + 1).padStart(2, '0')}</span>
              <h3>{step.title}</h3>
              <p>{step.text}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
