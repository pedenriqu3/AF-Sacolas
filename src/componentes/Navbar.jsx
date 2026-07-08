import { useEffect, useState } from "react";

const links = [
  { id: "inicio", label: "Início" },
  { id: "galeria", label: "Galeria" },
  { id: "sobre", label: "Sobre" },
  { id: "contato", label: "Feedback" },
  { id: "pedido", label: "Pedido" },
  { id: "login", label: "Login" },
];

export default function Navbar({
  activeId = "inicio",
  onActiveChange,
  onNavigate,
  onLoginClick,
  onPedidoClick,
}) {
  const [observedId, setObservedId] = useState(activeId);

  useEffect(() => {
    const sections = links.map(({ id }) => document.getElementById(id)).filter(Boolean);

    if (sections.length === 0) {
      return undefined;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const visibleEntry = entries.find((entry) => entry.isIntersecting);

        if (visibleEntry) {
          setObservedId(visibleEntry.target.id);
          onActiveChange?.(visibleEntry.target.id);
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
  }, [onActiveChange]);

  const activeLinkId = activeId || observedId;

  const handleLinkClick = (e, link) => {
    onActiveChange?.(link.id);

    if (link.id === "pedido") {
      e.preventDefault();
      onPedidoClick?.();
      return;
    }

    if (link.id === "login") {
      e.preventDefault();
      onLoginClick?.();
      return;
    }

    onNavigate?.(link.id);
    if (activeId === "login" || activeId === "pedido") {
      onActiveChange?.(link.id);
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
                ? `active login-pill ${activeLinkId === link.id ? "login-pill--observed" : ""}`
                : link.id !== "inicio" && link.id !== "sobre" && link.id !== "galeria" && activeLinkId === link.id
                  ? "active"
                  : ""
            }
            aria-current={
              link.id !== "inicio" && link.id !== "sobre" && link.id !== "galeria" && activeLinkId === link.id
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