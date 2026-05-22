import { useState } from "react";
import Navbar from "./componentes/Navbar";
import Hero from "./componentes/Hero";
import Materials from "./componentes/Materials";
import Eco from "./componentes/Eco";
import FeedBack from "./componentes/Testimonials";
import Footer from "./componentes/Footer";
import Login from "./login/login";

export default function App() {
  const [isLoginActive, setIsLoginActive] = useState(false);

  return (
    <>
      <Navbar onLoginClick={() => setIsLoginActive(true)} />
      {isLoginActive ? (
        <Login onClose={() => setIsLoginActive(false)} />
      ) : (
        <>
          <Hero />
          <Materials />
          <Eco />
          <FeedBack />
          <Footer />
        </>
      )}
    </>
  );
}