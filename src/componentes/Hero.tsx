import imagemFundo from '../assets/logoInicio.jpeg';

interface HeroProps {
  onPedidoClick?: () => void;
}

export default function Hero({ onPedidoClick }: HeroProps) {
  return (
    <section className="hero" id="inicio">
      <img src={imagemFundo} alt="Imagem de fundo" className="hero-background" />
      <div className="hero-content">
        <h1>Crie sua sacola única.</h1>
        <p>
          Unimos a precisão da indústria à alma do design sob medida para embalagens.
        </p>

        <div className="buttons">
          <a
            className="primary"
            href="/"
            onClick={(event) => {
              event.preventDefault();
              onPedidoClick?.();
            }}
          >
            Começar Criação
          </a>
          <a
            className="secondary"
            href="/"
            onClick={(event) => {
              event.preventDefault();
              document.getElementById("galeria")?.scrollIntoView({ behavior: "smooth", block: "start" });
            }}
          >
            Ver Galeria
          </a>
        </div>
      </div>
    </section>
  );
}
