const testimonials = [
  {
    id: 1,
    name: "Marina",
    role: "Cliente verificada",
    rating: 5,
    message:
      "Qualidade impecável, atendimento preciso e uma apresentação que realmente passa sensação de luxo.",
  },
  {
    id: 2,
    name: "Ricardo",
    role: "Pedido corporativo",
    rating: 5,
    message:
      "O acabamento das sacolas elevou a percepção da nossa marca. Recebemos elogios de todos os clientes.",
  },
  {
    id: 3,
    name: "Beatriz",
    role: "Projeto sob medida",
    rating: 5,
    message:
      "Consegui registrar meu feedback com facilidade depois do login e a experiência foi muito elegante.",
  },
];

export default function Testimonials() {

  return (
    <section className="testimonials-section container">
      <div className="testimonials-layout">
        <div className="testimonials-spotlight card">
          <div className="spotlight-header">
            <div>
              <span className="spotlight-badge">Vozes verificadas</span>
              <h3>O que os clientes estão dizendo</h3>
            </div>
            <div className="spotlight-metrics">
              <strong>4.9/5</strong>
              <span>média geral</span>
            </div>
          </div>

          <div className="testimonials-grid">
            {testimonials.map((testimonial) => (
              <article className="testimonial testimonial--premium" key={testimonial.id}>
                <div className="testimonial-top">
                  <div>
                    <h4>{testimonial.name}</h4>
                    <p>{testimonial.role}</p>
                  </div>
                  <div className="testimonial-rating" aria-label={`Avaliação ${testimonial.rating} de 5`}>
                    {'★'.repeat(testimonial.rating)}{'☆'.repeat(5 - testimonial.rating)}
                  </div>
                </div>
                <p className="testimonial-message">“{testimonial.message}”</p>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
