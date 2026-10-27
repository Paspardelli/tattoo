import type { Settings } from '@/lib/types';
import { instagramHandle } from '@/lib/utils';
import QuoteForm from './QuoteForm';

export default function QuoteSection({ settings, estilos }: { settings: Settings; estilos: string[] }) {
  const handle = instagramHandle(settings.instagram);

  return (
    <section className="section section--cta" id="orcamento">
      <div className="container quote-box">
        <div className="quote-box__text reveal">
          <p className="eyebrow">Orçamento grátis</p>
          <h2 className="section__title">
            Vamos tirar a sua ideia do <span className="text-accent">papel?</span>
          </h2>
          <p>
            Preencha o formulário. Ele monta a mensagem pronta e abre o meu WhatsApp, onde continuamos a conversa e eu te
            passo valor e datas.
          </p>

          <ul className="contact-list">
            {settings.horario && (
              <li>
                <span>Horário</span>
                <strong>{settings.horario}</strong>
              </li>
            )}
            {settings.endereco && (
              <li>
                <span>Endereço</span>
                <strong>{settings.endereco}</strong>
              </li>
            )}
            {handle && (
              <li>
                <span>Instagram</span>
                <strong>{handle}</strong>
              </li>
            )}
          </ul>
        </div>

        <QuoteForm estilos={estilos} whatsapp={settings.whatsapp} />
      </div>
    </section>
  );
}
