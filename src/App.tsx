import { useState } from "react";
import Navbar from "./componentes/Navbar";
import Hero from "./componentes/Hero";
import Materials from "./componentes/Materials";
import Eco from "./componentes/Eco";
import FeedBack from "./componentes/Testimonials";
import Footer from "./componentes/Footer";
import Login from "./login/Login";
import Registro from "./login/Registro";
import Pedido from "./pedido/Pedido";
import { User } from "./types";

const USERS_STORAGE_KEY = "af_users";
const CURRENT_USER_STORAGE_KEY = "af_current_user";
const CURRENT_TOKEN_STORAGE_KEY = "af_token";

function readFromStorage<T>(key: string, fallbackValue: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallbackValue;
  } catch {
    return fallbackValue;
  }
}

export default function App() {
  const [activeNavId, setActiveNavId] = useState<string>("inicio");
  const [isLoginActive, setIsLoginActive] = useState<boolean>(false);
  const [isRegisterActive, setIsRegisterActive] = useState<boolean>(false);
  const [isOrderActive, setIsOrderActive] = useState<boolean>(false);

  const [users, setUsers] = useState<User[]>(() => readFromStorage<User[]>(USERS_STORAGE_KEY, []));
  const [currentUser, setCurrentUser] = useState<User | null>(() =>
    readFromStorage<User | null>(CURRENT_USER_STORAGE_KEY, null)
  );

  const saveUsers = (nextUsers: User[]) => {
    setUsers(nextUsers);
    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(nextUsers));
  };

  const saveCurrentUser = (user: User | null, token?: string) => {
    setCurrentUser(user);
    if (user) {
      localStorage.setItem(CURRENT_USER_STORAGE_KEY, JSON.stringify(user));
      if (token) localStorage.setItem(CURRENT_TOKEN_STORAGE_KEY, token);
      return;
    }
    localStorage.removeItem(CURRENT_USER_STORAGE_KEY);
    localStorage.removeItem(CURRENT_TOKEN_STORAGE_KEY);
  };

  const closeTransientScreens = () => {
    setIsLoginActive(false);
    setIsRegisterActive(false);
    setIsOrderActive(false);
  };

  const openLoginScreen = () => {
    setActiveNavId("login");
    closeTransientScreens();
    setIsLoginActive(true);
  };

  const openOrderScreen = () => {
    setActiveNavId("pedido");
    closeTransientScreens();
    setIsOrderActive(true);
  };

  const closeLoginScreen = () => {
    setIsLoginActive(false);
    setActiveNavId("inicio");
  };

  const closeRegisterScreen = () => {
    setIsRegisterActive(false);
    setActiveNavId("inicio");
  };

  const closeOrderScreen = () => {
    setIsOrderActive(false);
    setActiveNavId("inicio");
  };

  const API_AUTH = "http://localhost:3001/api/auth";

  const handleLogin = async ({ email, password }: { email: string; password?: string }) => {
    const normalizedEmail = email.trim().toLowerCase();
    try {
      const res = await fetch(`${API_AUTH}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: normalizedEmail, password }),
      });
      const data = await res.json();
      if (res.ok && data.ok) {
        saveCurrentUser(data.user, data.token);
        closeTransientScreens();
        setActiveNavId("inicio");
        return { ok: true };
      }
      return { ok: false, error: data.error || "E-mail ou senha inválidos." };
    } catch {
      // fallback to local storage auth
      const foundUser = users.find((u) => u.email.toLowerCase() === normalizedEmail && (u as any).password === password);
      if (!foundUser) return { ok: false, error: "E-mail ou senha inválidos." };
      saveCurrentUser({ name: foundUser.name, email: foundUser.email });
      closeTransientScreens();
      setActiveNavId("inicio");
      return { ok: true };
    }
  };

  const handleRegister = async ({ name, email, phone, password }: { name: string; email: string; password?: string; phone?: string }) => {
    const normalizedEmail = email.trim().toLowerCase();
    try {
      const res = await fetch(`${API_AUTH}/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email: normalizedEmail, phone, password }),
      });
      const data = await res.json();
      if (res.ok && data.ok) {
        saveCurrentUser(data.user, data.token);
        closeTransientScreens();
        setActiveNavId("inicio");
        return { ok: true };
      }
      return { ok: false, error: data.error || "Erro ao criar conta." };
    } catch {
      // fallback local register
      const hasUser = users.some((u) => u.email.toLowerCase() === normalizedEmail);
      if (hasUser) return { ok: false, error: "Já existe uma conta cadastrada com este e-mail." };
      const nextUser: any = { id: Date.now(), name: name.trim(), email: normalizedEmail, password };
      const nextUsers = [...users, nextUser];
      saveUsers(nextUsers);
      saveCurrentUser({ name: nextUser.name, email: nextUser.email });
      closeTransientScreens();
      setActiveNavId("inicio");
      return { ok: true };
    }
  };

  return (
    <>
      <Navbar
        activeId={activeNavId}
        onActiveChange={setActiveNavId}
        onNavigate={closeTransientScreens}
        onLoginClick={openLoginScreen}
        onPedidoClick={openOrderScreen}
        onProfileClick={() => setIsRegisterActive(true)}
        currentUser={currentUser}
      />

      {isOrderActive ? (
        <Pedido onClose={closeOrderScreen} />
      ) : isRegisterActive ? (
        <Registro onClose={closeRegisterScreen} onLogin={openLoginScreen} onRegisterSubmit={handleRegister} />
      ) : isLoginActive ? (
        <Login onClose={closeLoginScreen} onLogin={handleLogin} onRegister={() => { setIsLoginActive(false); setIsRegisterActive(true); }} />
      ) : (
        <>
          <Hero onPedidoClick={openOrderScreen} />
          <Materials />
          <Eco />
          <FeedBack currentUser={currentUser} onRequestLogin={openLoginScreen} />
          <Footer />
        </>
      )}
    </>
  );
}
