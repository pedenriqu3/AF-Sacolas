import React, { useState } from "react";
import { useSearchParams } from "react-router-dom";
import "../login.css";
import defaultLogo from "../assets/logo-af.png";

const API_AUTH = "http://localhost:3001/api/auth";

export default function ResetPassword() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token") || "";

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setMessage("");

    if (!token) {
      setError("O link de redefinição está inválido ou incompleto.");
      return;
    }

    if (password !== confirmPassword) {
      setError("As senhas precisam ser iguais.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(`${API_AUTH}/reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
      });
      const data = await res.json();

      if (res.ok && data.ok) {
        setMessage(data.message || "Senha redefinida com sucesso.");
      } else {
        setError(data.error || "Não foi possível redefinir sua senha.");
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

          <h2>Redefinir senha</h2>
          <span>Crie uma nova senha para sua conta.</span>

          <form onSubmit={handleSubmit}>
            <label>NOVA SENHA</label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
            />

            <label>CONFIRMAR NOVA SENHA</label>
            <input
              type="password"
              placeholder="••••••••"
              value={confirmPassword}
              onChange={(event) => setConfirmPassword(event.target.value)}
              required
            />

            <button className="login-btn" type="submit" disabled={loading}>
              {loading ? "SALVANDO..." : "REDEFINIR SENHA"}
            </button>

            {message && <p className="auth-success">{message}</p>}
            {error && <p className="auth-error">{error}</p>}
          </form>
        </div>
      </div>
    </div>
  );
}