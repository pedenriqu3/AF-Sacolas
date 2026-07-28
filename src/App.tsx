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

const USERS_STORAGE_KEY = "af_users";
const CURRENT_USER_STORAGE_KEY = "af_current_user";

export interface User {
  id?: number;
  name: string;
  email: string;
  phone?: string;
  password?: string;
}

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

  const saveCurrentUser = (user: User | null) => {
    setCurrentUser(user);

    if (user) {
      localStorage.setItem(CURRENT_USER_STORAGE_KEY, JSON.stringify(user));
      return;
    }

    localStorage.removeItem(CURRENT_USER_STORAGE_KEY);
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

  const API_URL = "http://localhost:3001/api/auth";

  const handleLogin = async ({ email, password }: { email: string; password?: string }) => {
    try {
      const response = await fetch(`${API_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok || !data.ok) {
        return { ok: false, error: data.error || "E-mail ou senha inválidos." };
      }

      if (data.token) {
        localStorage.setItem("af_token", data.token);
      }

      saveCurrentUser(data.user);
      closeTransientScreens();
      setActiveNavId("inicio");
      return { ok: true };
    } catch {
      const normalizedEmail = email.trim().toLowerCase();
      const foundUser = users.find(
        (user) => user.email.toLowerCase() === normalizedEmail && user.password === password
      );

      if (!foundUser) {
        return { ok: false, error: "Não foi possível conectar ao servidor." };
      }

      saveCurrentUser({ name: foundUser.name, email: foundUser.email });
      closeTransientScreens();
      setActiveNavId("inicio");
      return { ok: true };
    }
  };

  const handleRegister = async ({ name, email, phone, password }: { name: string; email: string; phone?: string; password?: string }) => {
    try {
      const response = await fetch(`${API_URL}/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, phone, password }),
      });

      const data = await response.json();

      if (!response.ok || !data.ok) {
        return { ok: false, error: data.error || "Não foi possível criar sua conta agora." };
      }

      if (data.token) {
        localStorage.setItem("af_token", data.token);
      }

      saveCurrentUser(data.user);
      closeTransientScreens();
      setActiveNavId("inicio");
      return { ok: true };
    } catch {
      const normalizedEmail = email.trim().toLowerCase();
      const hasUser = users.some((user) => user.email.toLowerCase() === normalizedEmail);

      if (hasUser) {
        return { ok: false, error: "Já existe uma conta cadastrada com este e-mail." };
      }

      const nextUser = {
        id: Date.now(),
        name: name.trim(),
        email: normalizedEmail,
        password,
      };

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
      />
      {isOrderActive ? (
        <Pedido onClose={closeOrderScreen} />
      ) : isRegisterActive ? (
        <Registro
          onClose={closeRegisterScreen}
          onLogin={openLoginScreen}
          onRegisterSubmit={handleRegister}
        />
      ) : isLoginActive ? (
        <Login
          onClose={closeLoginScreen}
          onLogin={handleLogin}
          onRegister={() => {
            setIsLoginActive(false);
            setIsRegisterActive(true);
          }}
        />
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
