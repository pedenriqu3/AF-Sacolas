import React, { useState } from "react";
import "../login.css";
import defaultLogo from "../assets/logo-af.png";

interface RegistroProps {
  onClose?: () => void;
  onLogin?: () => void;
  onRegisterSubmit?: (data: { name: string; email: string; phone?: string; password?: string }) => Promise<{ ok: boolean; error?: string }> | { ok: boolean; error?: string } | undefined;
  logoSrc?: string;
}

export default function Registro({ onClose, onLogin, onRegisterSubmit, logoSrc = defaultLogo }: RegistroProps) {
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [phone, setPhone] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("As senhas precisam ser iguais.");
      return;
    }

    setLoading(true);

    try {
      const result = await onRegisterSubmit?.({ name, email, phone, password });

      if (result?.ok) {
        return;
      }

      setError(result?.error || "Não foi possível criar sua conta agora.");
    } catch {
      setError("Erro ao se comunicar com o servidor.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        {/* LADO ESQUERDO */}
        <div className="login-left">
          <div className="login-brand">
            <img className="login-logo" src={logoSrc || defaultLogo} alt="Logo AF Sacolas" />
            <h1>AF Sacolas</h1>
          </div>

          <div className="line"></div>
        </div>

        {/* LADO DIREITO */}
        <div className="login-right">
          {onClose && (
            <button
              onClick={onClose}
              style={{
                alignSelf: "flex-end",
                background: "none",
                border: "none",
                fontSize: "24px",
                cursor: "pointer",
                color: "#0c0069",
              }}
            >
              ✕
            </button>
          )}

          <h2>Crie sua conta</h2>

          <span>Cadastre-se para começar a usar o AF Sacolas.</span>

          <form onSubmit={handleSubmit}>
            <label>NOME COMPLETO</label>
            <input
              type="text"
              placeholder="Seu nome"
              value={name}
              onChange={(event) => setName(event.target.value)}
              required
            />

            <label>E-MAIL</label>
            <input
              type="email"
              placeholder="nome@exemplo.com"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
            />

            <label>CELULAR / WHATSAPP</label>
            <input
              type="tel"
              placeholder="(00) 90000-0000"
              value={phone}
              onChange={(event) => setPhone(event.target.value)}
            />

            <label>SENHA</label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
            />

            <label>CONFIRMAR SENHA</label>
            <input
              type="password"
              placeholder="••••••••"
              value={confirmPassword}
              onChange={(event) => setConfirmPassword(event.target.value)}
              required
            />

            <button className="login-btn" type="submit" disabled={loading}>
              {loading ? "CRIANDO CONTA..." : "CRIAR CONTA"}
            </button>

            {error && <p className="auth-error">{error}</p>}

            <div className="divider">OU</div>

            <button
              type="button"
              className="register-btn"
              onClick={() => onLogin && onLogin()}
            >
              JÁ TENHO CONTA
            </button>

            <p className="copyright">
              © 2023 AF Sacolas.
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
