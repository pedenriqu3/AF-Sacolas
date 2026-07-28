import { useState } from "react";
import "../login.css";
import defaultLogo from "../assets/logo-af.png";

export default function Login({ onClose, onRegister, onLogin, logoSrc = defaultLogo }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();
    setError("");

    const result = onLogin?.({ email, password });

    if (result?.ok) {
      return;
    }

    setError(result?.error || "Não foi possível entrar com os dados informados.");
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

          <h2>Bem-vindo!</h2>

          <span>Acesse sua conta.</span>

          <form onSubmit={handleSubmit}>

            <label>E-MAIL</label>
            <input
              type="email"
              placeholder="nome@exemplo.com"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
            />

            <div className="password-header">
              <label>SENHA</label>
              <a href="#">Esqueceu sua senha?</a>
            </div>

            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
            />

            <div className="remember">
              <input type="checkbox" />
              <span>Lembrar de mim</span>
            </div>

            <button className="login-btn" type="submit">
              ENTRAR
            </button>

            {error && <p className="auth-error">{error}</p>}

            <div className="divider">OU</div>

            <button
              type="button"
              className="register-btn"
              onClick={() => onRegister && onRegister()}
            >
              CRIAR NOVA CONTA
            </button>

          </form>

          <p className="copyright">
            © 2023 AF Sacolas.
          </p>

        </div>
      </div>
    </div>
  );
}