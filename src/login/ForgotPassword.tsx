import React, { useState } from "react";
import "../login.css";
import defaultLogo from "../assets/logo-af.png";

const API_AUTH = "http://localhost:3001/api/auth";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setMessage("");
    setLoading(true);

    try {
      const res = await fetch(`${API_AUTH}/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();

      if (res.ok && data.ok) {
        setMessage(data.message || "Enviamos um link para o seu e-mail.");
      } else {
        setError(data.error || "Não foi possível solicitar a redefinição.");
      }
    } catch {
      setError("Erro ao se comunicar com o servidor.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-left">
          <div className="login-brand">
            <img className="login-logo" src={defaultLogo} alt="Logo AF Sacolas" />
            <h1>AF Sacolas</h1>
          </div>

          <div className="line"></div>
        </div>

        <div className="login-right">
          <a className="auth-back-link" href="#/">
            ← Voltar ao início
          </a>

          <h2>Esqueci minha senha</h2>
          <span>Informe o e-mail cadastrado para receber o link de redefinição.</span>

          <form onSubmit={handleSubmit}>
            <label>E-MAIL CADASTRADO</label>
            <input
              type="email"
              placeholder="nome@exemplo.com"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
            />

            <button className="login-btn" type="submit" disabled={loading}>
              {loading ? "ENVIANDO..." : "ENVIAR LINK"}
            </button>

            {message && <p className="auth-success">{message}</p>}
            {error && <p className="auth-error">{error}</p>}
          </form>
        </div>
      </div>
    </div>
  );
}