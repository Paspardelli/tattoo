export default function Footer({
  nome,
  whatsappUrl,
  instagramUrl,
}: {
  nome: string;
  whatsappUrl: string;
  instagramUrl: string;
}) {
  return (
    <footer className="footer">
      <div className="container footer__inner">
        <div>
          <a href="#inicio" className="logo">
            <span className="logo__mark">&#10022;</span>
            <span className="logo__text">{nome}</span>
          </a>
          <p className="footer__text">Tatuagem autoral com técnica, higiene e respeito pela sua história.</p>
        </div>
        <nav className="footer__links" aria-label="Rodapé">
          <a href="#sobre">Sobre</a>
          <a href="#portfolio">Portfólio</a>
          <a href="#faq">Dúvidas</a>
          <a href="#orcamento">Orçamento</a>
        </nav>
        <div className="footer__social">
          <a href={instagramUrl} target="_blank" rel="noopener noreferrer">
            Instagram
          </a>
          <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">
            WhatsApp
          </a>
        </div>
      </div>
      <div className="container footer__bottom">
        <small>
          &copy; {new Date().getFullYear()} {nome}. Todos os direitos reservados. Proibido para menores de 18 anos.
        </small>
      </div>
    </footer>
  );
}
