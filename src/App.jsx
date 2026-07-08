import { useState } from "react";
import Navbar from "./componentes/Navbar";
import Hero from "./componentes/Hero";
import Materials from "./componentes/Materials";
import Eco from "./componentes/Eco";
import FeedBack from "./componentes/Testimonials";
import Footer from "./componentes/Footer";
import Login from "./login/Login";
import Registro from "./login/registro";
import Pedido from "./pedido/Pedido";

const USERS_STORAGE_KEY = "af_users";
const CURRENT_USER_STORAGE_KEY = "af_current_user";

function readFromStorage(key, fallbackValue) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallbackValue;
  } catch {
    return fallbackValue;
  }
}

export default function App() {
  const [activeNavId, setActiveNavId] = useState("inicio");
  const [isLoginActive, setIsLoginActive] = useState(false);
  const [isRegisterActive, setIsRegisterActive] = useState(false);
  const [isOrderActive, setIsOrderActive] = useState(false);
  const [users, setUsers] = useState(() => readFromStorage(USERS_STORAGE_KEY, []));
  const [currentUser, setCurrentUser] = useState(() => readFromStorage(CURRENT_USER_STORAGE_KEY, null));

  const saveUsers = (nextUsers) => {
    setUsers(nextUsers);
    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(nextUsers));
  };

  const saveCurrentUser = (user) => {
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

  const closeOrderScreen = () => {
    setIsOrderActive(false);
  };

  const handleLogin = ({ email, password }) => {
    const normalizedEmail = email.trim().toLowerCase();
    const foundUser = users.find(
      (user) => user.email.toLowerCase() === normalizedEmail && user.password === password
    );

    if (!foundUser) {
      return { ok: false, error: "E-mail ou senha inválidos." };
    }

    saveCurrentUser({ name: foundUser.name, email: foundUser.email });
    closeTransientScreens();
    setActiveNavId("inicio");
    return { ok: true };
  };

  const handleRegister = ({ name, email, password }) => {
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
          onClose={() => setIsRegisterActive(false)}
          onRegisterSubmit={handleRegister}
        />
      ) : isLoginActive ? (
        <Login
          onClose={() => setIsLoginActive(false)}
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