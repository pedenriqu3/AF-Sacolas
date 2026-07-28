import React, { useEffect, useState } from "react";
import { User } from "../types";

interface LinkItem {
  id: string;
  label: string;
}

const links: LinkItem[] = [
  { id: "inicio", label: "Início" },
  { id: "galeria", label: "Galeria" },
  { id: "sobre", label: "Sobre" },
  { id: "contato", label: "Feedback" },
  { id: "pedido", label: "Pedido" },
  { id: "login", label: "Login" },
];

interface NavbarProps {
  activeId?: string;
  currentUser?: User | null;
  onActiveChange?: (id: string) => void;
  onNavigate?: (id: string) => void;
  onLoginClick?: () => void;
  onPedidoClick?: () => void;
  onProfileClick?: () => void;
}

export default function Navbar({
  activeId = "inicio",
  currentUser,
  onActiveChange,
  onNavigate,
  onLoginClick,
  onPedidoClick,
  onProfileClick,
}: NavbarProps) {
  const [observedId, setObservedId] = useState<string>(activeId);

  useEffect(() => {
    const sections = links
      .map(({ id }) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null);

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

  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, link: LinkItem) => {
    onActiveChange?.(link.id);

    if (link.id === "pedido") {
      e.preventDefault();
      onPedidoClick?.();
      return;
    }

    if (link.id === "login") {
      e.preventDefault();
      if (currentUser) {
        onProfileClick?.();
      } else {
        onLoginClick?.();
      }
      return;
    }

    onNavigate?.(link.id);
    if (activeId === "login" || activeId === "pedido") {
      onActiveChange?.(link.id);
    }
  };

  const getFirstName = (fullName: string) => fullName.trim().split(" ")[0] || fullName;

  return (
    <header className="navbar">
      <h2>AF Sacolas</h2>
      <div className="nav-links">
        {links.map((link) => {
          if (link.id === "login" && currentUser) {
            return (
              <button
                key="user-profile"
                type="button"
                className="user-avatar-btn"
                onClick={() => onProfileClick?.()}
                title="Minha Conta & Pedidos"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "8px",
                  background: "#0c0069",
                  color: "white",
                  border: "none",
                  padding: "8px 16px",
                  borderRadius: "999px",
                  fontWeight: 700,
                  fontSize: "14px",
                  cursor: "pointer",
                  transition: "transform 0.2s, background-color 0.2s",
                }}
              >
                <span style={{ fontSize: "16px" }}>👤</span>
                <span>{getFirstName(currentUser.name)}</span>
              </button>
            );
          }

          return (
            <a
              key={link.id}
              href={`#${link.id}`}
              onClick={(e) => handleLinkClick(e, link)}
              className={
                link.id === "login"
                  ? `login-pill ${activeLinkId === link.id ? "active login-pill--observed" : ""}`
                  : activeLinkId === link.id
                    ? "active"
                    : ""
              }
              aria-current={activeLinkId === link.id ? "page" : undefined}
            >
              {link.label}
            </a>
          );
        })}
      </div>
    </header>
  );
}
