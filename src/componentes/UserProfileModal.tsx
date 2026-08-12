import React, { useEffect, useState } from "react";
import { User } from "../types";
import "./userProfile.css";

interface OrderItem {
  id: number;
  bagType: string;
  bagColors: string;
  logoColors: string;
  handleType: string;
  handleColor: string;
  size: string;
  quantity: number;
  totalAmount: number;
  status: string;
  shippingAddr?: string;
  createdAt: string;
}

interface UserProfileModalProps {
  user: User;
  onClose: () => void;
  onUpdateUser: (user: User) => void;
  onLogout: () => void;
}

export default function UserProfileModal({
  user,
  onClose,
  onUpdateUser,
  onLogout,
}: UserProfileModalProps) {
  const [activeTab, setActiveTab] = useState<"profile" | "orders">("profile");

  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);
  const [phone, setPhone] = useState(user.phone || "");
  const [zipCode, setZipCode] = useState(user.zipCode || "");
  const [street, setStreet] = useState(user.street || "");
  const [number, setNumber] = useState(user.number || "");
  const [complement, setComplement] = useState(user.complement || "");
  const [neighborhood, setNeighborhood] = useState(user.neighborhood || "");
  const [city, setCity] = useState(user.city || "");
  const [state, setState] = useState(user.state || "");

  const [savingProfile, setSavingProfile] = useState(false);
  const [profileMessage, setProfileMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Pedidos
  const [orders, setOrders] = useState<OrderItem[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(false);

  useEffect(() => {
    setName(user.name);
    setEmail(user.email);
    setPhone(user.phone || "");
    setZipCode(user.zipCode || "");
    setStreet(user.street || "");
    setNumber(user.number || "");
    setComplement(user.complement || "");
    setNeighborhood(user.neighborhood || "");
    setCity(user.city || "");
    setState(user.state || "");
  }, [user]);

  // Buscar pedidos do usuário ao abrir aba de pedidos
  useEffect(() => {
    if (activeTab === "orders") {
      fetchOrders();
    }
  }, [activeTab]);

  const fetchOrders = async () => {
    setLoadingOrders(true);
    try {
      const token = localStorage.getItem("af_token");
      const res = await fetch("http://localhost:3001/api/orders", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      if (res.ok && data.ok) {
        setOrders(data.orders || []);
      }
    } catch {
      // Ignorar caso esteja offline
    } finally {
      setLoadingOrders(false);
    }
  };

  // Autopreencher endereço via CEP (ViaCEP API)
  const handleCepBlur = async () => {
    const cleanCep = zipCode.replace(/\D/g, "");
    if (cleanCep.length === 8) {
      try {
        const res = await fetch(`https://viacep.com.br/ws/${cleanCep}/json/`);
        const data = await res.json();
        if (!data.erro) {
          setStreet(data.logradouro || "");
          setNeighborhood(data.bairro || "");
          setCity(data.localidade || "");
          setState(data.uf || "");
        }
      } catch {
        // Ignorar falha de busca de CEP
      }
    }
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingProfile(true);
    setProfileMessage(null);

    const token = localStorage.getItem("af_token");

    try {
      const res = await fetch("http://localhost:3001/api/user/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name,
          email,
          phone,
          zipCode,
          street,
          number,
          complement,
          neighborhood,
          city,
          state,
        }),
      });

      const data = await res.json();

      if (res.ok && data.ok) {
        onUpdateUser(data.user);
        setProfileMessage({ type: "success", text: "Dados atualizados com sucesso!" });
      } else {
        setProfileMessage({ type: "error", text: data.error || "Erro ao salvar seus dados." });
      }
    } catch {
      // Fallback se estiver offline
      const updated = {
        ...user,
        name: name.trim(),
        email: email.trim().toLowerCase(),
        phone: phone.trim(),
        zipCode,
        street,
        number,
        complement,
        neighborhood,
        city,
        state,
      };
      onUpdateUser(updated);
      setProfileMessage({ type: "success", text: "Dados salvos localmente!" });
    } finally {
      setSavingProfile(false);
    }
  };

  const getInitials = (name: string) => {
    const parts = name.trim().split(" ");
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    }
    return (name[0] || "U").toUpperCase();
  };

  const formatCurrency = (val: number) =>
    new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(val);

  const formatDate = (isoStr: string) => {
    try {
      return new Date(isoStr).toLocaleDateString("pt-BR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return isoStr;
    }
  };

  return (
    <div className="profile-overlay" onClick={onClose}>
      <div className="profile-card" onClick={(e) => e.stopPropagation()}>
        {/* Cabeçalho */}
        <div className="profile-header">
          <div className="profile-header__title">
            <div className="profile-avatar-icon">{getInitials(user.name)}</div>
            <div>
              <h2>{user.name}</h2>
              <p>{user.email}</p>
            </div>
          </div>
          <button className="profile-close-btn" onClick={onClose} aria-label="Fechar perfil">
            ✕
          </button>
        </div>

        {/* Abas */}
        <div className="profile-tabs">
          <button
            className={`profile-tab-btn ${activeTab === "profile" ? "active" : ""}`}
            onClick={() => setActiveTab("profile")}
          >
            Dados & Endereço
          </button>
          <button
            className={`profile-tab-btn ${activeTab === "orders" ? "active" : ""}`}
            onClick={() => setActiveTab("orders")}
          >
            Meus Pedidos
          </button>
        </div>

        {/* Conteúdo */}
        <div className="profile-body">
          {activeTab === "profile" ? (
            <>
              <div className="profile-info-grid">
                <div className="info-item">
                  <label>Nome Completo</label>
                  <span>{name}</span>
                </div>
                <div className="info-item">
                  <label>E-mail</label>
                  <span>{email}</span>
                </div>
                <div className="info-item">
                  <label>Celular / WhatsApp</label>
                  <span>{phone || "Não informado"}</span>
                </div>
              </div>

              <h3 className="address-section-title">Editar cadastro</h3>
              <form onSubmit={handleSaveProfile} className="address-form">
                <div className="address-field col-3">
                  <label htmlFor="name">Nome completo</label>
                  <input
                    id="name"
                    type="text"
                    placeholder="Seu nome"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>

                <div className="address-field col-3">
                  <label htmlFor="email">E-mail</label>
                  <input
                    id="email"
                    type="email"
                    placeholder="voce@exemplo.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>

                <div className="address-field col-2">
                  <label htmlFor="phone">Celular / WhatsApp</label>
                  <input
                    id="phone"
                    type="text"
                    placeholder="(00) 00000-0000"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                  />
                </div>

                <div className="address-field col-6">
                  <h3 className="address-section-title" style={{ marginBottom: 0 }}>
                    Endereço de entrega
                  </h3>
                </div>

                <div className="address-field col-2">
                  <label htmlFor="zipCode">CEP</label>
                  <input
                    id="zipCode"
                    type="text"
                    placeholder="00000-000"
                    value={zipCode}
                    onChange={(e) => setZipCode(e.target.value)}
                    onBlur={handleCepBlur}
                  />
                </div>

                <div className="address-field col-4">
                  <label htmlFor="street">Logradouro / Rua</label>
                  <input
                    id="street"
                    type="text"
                    placeholder="Rua, Avenida, etc."
                    value={street}
                    onChange={(e) => setStreet(e.target.value)}
                  />
                </div>

                <div className="address-field col-2">
                  <label htmlFor="number">Número</label>
                  <input
                    id="number"
                    type="text"
                    placeholder="123"
                    value={number}
                    onChange={(e) => setNumber(e.target.value)}
                  />
                </div>

                <div className="address-field col-4">
                  <label htmlFor="complement">Complemento</label>
                  <input
                    id="complement"
                    type="text"
                    placeholder="Apto, Bloco, Sala..."
                    value={complement}
                    onChange={(e) => setComplement(e.target.value)}
                  />
                </div>

                <div className="address-field col-2">
                  <label htmlFor="neighborhood">Bairro</label>
                  <input
                    id="neighborhood"
                    type="text"
                    placeholder="Seu bairro"
                    value={neighborhood}
                    onChange={(e) => setNeighborhood(e.target.value)}
                  />
                </div>

                <div className="address-field col-3">
                  <label htmlFor="city">Cidade</label>
                  <input
                    id="city"
                    type="text"
                    placeholder="Sua cidade"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                  />
                </div>

                <div className="address-field col-1">
                  <label htmlFor="state">UF</label>
                  <input
                    id="state"
                    type="text"
                    placeholder="SP"
                    maxLength={2}
                    value={state}
                    onChange={(e) => setState(e.target.value.toUpperCase())}
                  />
                </div>

                <div className="address-field col-6">
                  <button type="submit" className="profile-submit-btn" disabled={savingProfile}>
                    {savingProfile ? "Salvando..." : "Salvar alterações"}
                  </button>

                  {profileMessage && (
                    <p style={{ marginTop: "8px", fontSize: "13px", color: profileMessage.type === "success" ? "#16a34a" : "#dc2626" }}>
                      {profileMessage.text}
                    </p>
                  )}
                </div>
              </form>
            </>
          ) : (
            <div className="orders-list">
              {loadingOrders ? (
                <p>Carregando histórico de pedidos...</p>
              ) : orders.length === 0 ? (
                <p style={{ color: "#64748b" }}>Você ainda não realizou nenhum pedido.</p>
              ) : (
                orders.map((item) => (
                  <article key={item.id} className="order-card">
                    <div className="order-header">
                      <div>
                        <span className="order-id">Pedido #{item.id}</span>
                        <div className="order-date">{formatDate(item.createdAt)}</div>
                      </div>
                      <span className="order-status-badge">{item.status}</span>
                    </div>

                    <div className="order-details-grid">
                      <div><strong>Tipo:</strong> {item.bagType}</div>
                      <div><strong>Tamanho:</strong> {item.size}</div>
                      <div><strong>Quantidade:</strong> {item.quantity} un.</div>
                      <div><strong>Cores da Sacola:</strong> {item.bagColors}</div>
                      <div><strong>Cores da Logo:</strong> {item.logoColors}</div>
                      <div><strong>Alça:</strong> {item.handleType} ({item.handleColor})</div>
                    </div>

                    {item.shippingAddr && (
                      <div style={{ marginTop: "8px", fontSize: "12px", color: "#64748b" }}>
                        <strong>Entrega em:</strong> {item.shippingAddr}
                      </div>
                    )}

                    <div className="order-total-row">
                      <span>Valor Total:</span>
                      <span className="order-total-price">{formatCurrency(item.totalAmount)}</span>
                    </div>
                  </article>
                ))
              )}
            </div>
          )}
        </div>

        {/* Rodapé com Logout */}
        <div className="logout-btn-wrapper">
          <button className="logout-btn" onClick={onLogout}>
            Sair da Conta
          </button>
        </div>
      </div>
    </div>
  );
}
