export default function Eco() {
  return (
    <section className="container eco" id="sobre">
      <div className="eco-copy">
        <h2>Compromisso Ético e Sustentável</h2>
        <p>
          Produção com baixo impacto ambiental e materiais recicláveis.
        </p>

        <ul className="eco-list">
          <li>Materiais recicláveis</li>
          <li>Design único</li>
          <li>Descarte zero</li>
        </ul>
      </div>

      <div className="eco-image card">
        <img
          src="https://images.unsplash.com/photo-1492724441997-5dc865305da7"
          width="300"
        />
      </div>
    </section>
  );
}