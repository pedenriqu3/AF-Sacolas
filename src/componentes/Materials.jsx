import fotoPrincipal from '../assets/mayConcept.jpeg'; 
import fotoCima from '../assets/aldenoraFlores.jpeg';
import fotoBaixo from '../assets/arturSmartphone.jpeg';

export default function Materials() {
  return (
    <section className="container materials-section" id="galeria">
      <h2>Galeria e referências</h2>

      <div className="grid">
        <div className="card card-large">
          <img src={fotoPrincipal} width="100%" />
        </div>

        <div className="stacked-cards">
          <div className="card">
            <img src={fotoCima} width="100%" />
          </div>

          <div className="card">
            <img src={fotoBaixo} width="100%" />
          </div>
        </div>
      </div>
    </section>
  );
}