import React, { useEffect, useMemo, useState } from "react";
import { User } from "../types";

const FEEDBACKS_STORAGE_KEY = "af_feedbacks";
const API_FEEDBACKS = "http://localhost:3001/api/feedbacks";

interface Feedback {
  id: number;
  name: string;
  role: string;
  rating: number;
  message: string;
  createdAt: string;
}

interface TestimonialsProps {
  currentUser: User | null;
  onRequestLogin?: () => void;
}

function readFeedbacks(): Feedback[] {
  try {
    const raw = localStorage.getItem(FEEDBACKS_STORAGE_KEY);
    return raw ? (JSON.parse(raw) as Feedback[]) : [];
  } catch {
    return [];
  }
}

export default function Testimonials({ currentUser, onRequestLogin }: TestimonialsProps) {
  const [feedbacks, setFeedbacks] = useState<Feedback[]>(() => readFeedbacks());
  const [rating, setRating] = useState<string>("5");
  const [message, setMessage] = useState<string>("");
  const [error, setError] = useState<string>("");

  useEffect(() => {
    const loadFeedbacks = async () => {
      try {
        const res = await fetch(API_FEEDBACKS);
        const data = await res.json();

        if (res.ok && data.ok) {
          setFeedbacks(data.feedbacks || []);
          localStorage.setItem(FEEDBACKS_STORAGE_KEY, JSON.stringify(data.feedbacks || []));
        }
      } catch {
        setFeedbacks(readFeedbacks());
      }
    };

    loadFeedbacks();
  }, []);

  const averageRating = useMemo(() => {
    if (feedbacks.length === 0) {
      return "0.0";
    }

    const total = feedbacks.reduce((acc, item) => acc + item.rating, 0);
    return (total / feedbacks.length).toFixed(1);
  }, [feedbacks]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");

    if (!currentUser) {
      onRequestLogin?.();
      return;
    }

    const trimmedMessage = message.trim();
    if (!trimmedMessage) {
      setError("Escreva sua experiência antes de enviar.");
      return;
    }

    const nextFeedback: Feedback = {
      id: Date.now(),
      name: currentUser.name,
      role: "Cliente cadastrado",
      rating: Number(rating),
      message: trimmedMessage,
      createdAt: new Date().toISOString(),
    };

    try {
      const token = localStorage.getItem("af_token");
      const res = await fetch(API_FEEDBACKS, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ rating: Number(rating), message: trimmedMessage }),
      });

      const data = await res.json();

      if (res.ok && data.ok) {
        const nextFeedbacks = [data.feedback as Feedback, ...feedbacks];
        setFeedbacks(nextFeedbacks);
        localStorage.setItem(FEEDBACKS_STORAGE_KEY, JSON.stringify(nextFeedbacks));
      } else {
        const nextFeedbacks = [nextFeedback, ...feedbacks];
        setFeedbacks(nextFeedbacks);
        localStorage.setItem(FEEDBACKS_STORAGE_KEY, JSON.stringify(nextFeedbacks));
      }
    } catch {
      const nextFeedbacks = [nextFeedback, ...feedbacks];
      setFeedbacks(nextFeedbacks);
      localStorage.setItem(FEEDBACKS_STORAGE_KEY, JSON.stringify(nextFeedbacks));
    }

    setMessage("");
    setRating("5");
  };

  return (
    <section className="testimonials-section container" id="contato">
      <div className="testimonials-layout">
        <div className="testimonials-spotlight card">
          <div className="spotlight-header">
            <div>
              <span className="spotlight-badge">Vozes verificadas</span>
              <h3>O que os clientes estão dizendo</h3>
            </div>
            <div className="spotlight-metrics">
              <strong>{averageRating}/5</strong>
              <span>média geral</span>
            </div>
          </div>

          <form className="feedback-form" onSubmit={handleSubmit}>
            <div className="feedback-form__row">
              <label htmlFor="feedback-rating">Nota</label>
              <select
                id="feedback-rating"
                value={rating}
                onChange={(event) => setRating(event.target.value)}
                disabled={!currentUser}
              >
                <option value="5">5 estrelas</option>
                <option value="4">4 estrelas</option>
                <option value="3">3 estrelas</option>
                <option value="2">2 estrelas</option>
                <option value="1">1 estrela</option>
              </select>
            </div>

            <div className="feedback-form__row">
              <label htmlFor="feedback-message">Seu feedback</label>
              <textarea
                id="feedback-message"
                rows={4}
                placeholder={
                  currentUser
                    ? "Conte como foi sua experiência com a AF Sacolas."
                    : "Faça login para enviar um feedback real."
                }
                value={message}
                onChange={(event) => setMessage(event.target.value)}
                disabled={!currentUser}
              />
            </div>

            <div className="feedback-form__actions">
              <button
                type="button"
                className="feedback-login-btn"
                onClick={() => onRequestLogin?.()}
              >
                {currentUser ? "Trocar conta" : "Entrar para avaliar"}
              </button>
              <button type="submit" className="feedback-submit-btn" disabled={!currentUser}>
                Publicar feedback
              </button>
            </div>

            {error && <p className="auth-error">{error}</p>}
          </form>

          <div className="testimonials-grid">
            {feedbacks.length === 0 && (
              <article className="testimonial testimonial--premium">
                <p className="testimonial-message">
                  Ainda não há feedbacks publicados. Clientes cadastrados podem enviar avaliações reais.
                </p>
              </article>
            )}

            {feedbacks.map((testimonial) => (
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
