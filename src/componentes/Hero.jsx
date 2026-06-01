import imagemFundo from '../assets/logoInicio.jpeg';

export default function Hero() {
  return (
    <section className="hero" id="inicio">
      <img src={imagemFundo} alt="Imagem de fundo" className="hero-background" />
      <div className="hero-content">
        <h1>Crie sua sacola única com maestria artesanal.</h1>
        <p>
          Unimos a precisão da indústria à alma do design sob medida para embalagens.
        </p>

        <div className="buttons">
          <a className="primary" href="#materiais">Começar Criação</a>
          <a className="secondary" href="#galeria">Ver Galeria</a>
        </div>
      </div>
    </section>
  );
}