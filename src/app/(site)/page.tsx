import type { Metadata } from 'next';
import { getSiteData } from '@/lib/data';
import { instagramLink, normalizeBrPhone, whatsappLink } from '@/lib/utils';
import Header, { type NavLink } from '@/components/site/Header';
import Hero from '@/components/site/Hero';
import Marquee from '@/components/site/Marquee';
import About from '@/components/site/About';
import StylesSection from '@/components/site/StylesSection';
import Portfolio from '@/components/site/Portfolio';
import Process from '@/components/site/Process';
import Testimonials from '@/components/site/Testimonials';
import FaqSection from '@/components/site/FaqSection';
import QuoteSection from '@/components/site/QuoteSection';
import Footer from '@/components/site/Footer';
import WhatsFloat from '@/components/site/WhatsFloat';
import StickyCta from '@/components/site/StickyCta';
import Effects from '@/components/site/Effects';

// O conteúdo vem do Supabase. A página é regenerada a cada 60s e na hora em que o admin salva.
export const revalidate = 60;

export async function generateMetadata(): Promise<Metadata> {
  const { settings } = await getSiteData();
  const place = settings.cidade ? ` em ${settings.cidade}` : '';
  const title = `${settings.nome} | Tatuagens autorais${place}`;
  const description = `Tatuagens autorais${place} com acabamento profissional, higiene total e atendimento com hora marcada. Veja o portfólio e peça seu orçamento pelo WhatsApp.`;

  return {
    title,
    description,
    openGraph: { title, description, type: 'website', locale: 'pt_BR', siteName: settings.nome },
    twitter: { card: 'summary_large_image', title, description },
  };
}

export default async function HomePage() {
  const { settings, styles, works, testimonials, faqs } = await getSiteData();

  const whatsappUrl = whatsappLink(settings.whatsapp, settings.mensagem_padrao);
  const instagramUrl = instagramLink(settings.instagram);
  const styleNames = styles.map((style) => style.nome);

  // o menu só mostra seções que existem
  const links: NavLink[] = [
    ...(works.length > 0 ? [{ href: '#portfolio', label: 'Portfólio' }] : []),
    ...(styles.length > 0 ? [{ href: '#estilos', label: 'Estilos' }] : []),
    { href: '#sobre', label: 'Sobre' },
    { href: '#processo', label: 'Processo' },
    ...(testimonials.length > 0 ? [{ href: '#depoimentos', label: 'Clientes' }] : []),
    ...(faqs.length > 0 ? [{ href: '#faq', label: 'Dúvidas' }] : []),
  ];

  // dados estruturados para o Google (negócio local)
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'TattooParlor',
    name: settings.nome,
    description: 'Estúdio de tatuagem autoral com hora marcada.',
    telephone: `+${normalizeBrPhone(settings.whatsapp)}`,
    address: {
      '@type': 'PostalAddress',
      streetAddress: settings.endereco,
      addressLocality: settings.cidade,
      addressCountry: 'BR',
    },
    sameAs: [instagramUrl],
  };

  return (
    <>
      <Header
        nome={settings.nome}
        links={links}
        whatsappUrl={whatsappUrl}
        instagramUrl={instagramUrl}
        horario={settings.horario}
      />
      <main>
        <Hero settings={settings} />
        <Marquee items={styleNames} />
        {works.length > 0 && <Portfolio works={works} instagramUrl={instagramUrl} />}
        {styles.length > 0 && <StylesSection styles={styles} />}
        <About settings={settings} />
        <Process />
        {testimonials.length > 0 && <Testimonials items={testimonials} />}
        {faqs.length > 0 && <FaqSection items={faqs} />}
        <QuoteSection settings={settings} estilos={styleNames} />
      </main>
      <Footer nome={settings.nome} whatsappUrl={whatsappUrl} instagramUrl={instagramUrl} />
      <WhatsFloat href={whatsappUrl} />
      <StickyCta />
      <Effects />
      <script
        type="application/ld+json"
        // escapa "<" para o JSON nunca fechar a tag <script>
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c') }}
      />
    </>
  );
}
