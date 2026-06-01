import { useEffect, useState } from "react";

export default function Navbar({ onLoginClick }) {
  const links = [
    { id: "inicio", label: "Início" },
    { id: "materiais", label: "Customizador" },
    { id: "galeria", label: "Galeria" },
    { id: "sobre", label: "Sobre" },
    { id: "contato", label: "Contato" },
    { id: "login", label: "Login" },
  ];
  const [activeId, setActiveId] = useState("inicio");

  useEffect(() => {
    const sections = links.map(({ id }) => document.getElementById(id)).filter(Boolean);

    if (sections.length === 0) {
      return undefined;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const visibleEntry = entries.find((entry) => entry.isIntersecting);

        if (visibleEntry) {
          setActiveId(visibleEntry.target.id);
        }
      },
      {
        root: null,
        threshold: 0.45,
        rootMargin: "-12% 0px -55% 0px",
      }
    );

    sections.forEach((section) => observer.observe(section));

    return () => observer.disconnect();
  }, []);

  const handleLinkClick = (e, link) => {
    if (link.id === "login") {
      e.preventDefault();
      onLoginClick?.();
    }
  };

  return (
    <header className="navbar">
      <h2>AF Sacolas</h2>
      <div className="nav-links">
        {links.map((link) => (
          <a
            key={link.id}
            href={`#${link.id}`}
            onClick={(e) => handleLinkClick(e, link)}
            className={
              link.id === "login"
                ? `active login-pill ${activeId === link.id ? "login-pill--observed" : ""}`
                : link.id !== "inicio" && link.id !== "sobre" && link.id !== "galeria" && activeId === link.id
                  ? "active"
                  : ""
            }
            aria-current={
              link.id !== "inicio" && link.id !== "sobre" && link.id !== "galeria" && activeId === link.id
                ? "page"
                : undefined
            }
          >
            {link.label}
          </a>
        ))}
      </div>
    </header>
  );
}