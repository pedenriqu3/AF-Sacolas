import React, { useMemo, useState } from "react";
import { User } from "../types";
import defaultLogo from "../assets/logo-af.png";
import "./pedido.css";

interface BagType {
  value: string;
  label: string;
  description: string;
}

const bagTypes: BagType[] = [
  {
    value: "sacola-de-papel",
    label: "Sacola de papel",
    description: "Modelo versátil para lojas, brindes e eventos.",
  },
  {
    value: "boca-de-palhaco",
    label: "Boca de palhaço",
    description: "Formato com acabamento aberto e visual mais leve.",
  },
  {
    value: "alca-fita",
    label: "Alça fita",
    description: "Acabamento elegante com alças de fita.",
  },
  {
    value: "papel-kraft",
    label: "Papel kraft",
    description: "Visual natural e sustentável para marcas artesanais.",
  },
];

interface ColorOption {
  name: string;
  value: string;
  hex: string;
  transparent?: boolean;
}

const logoColors: ColorOption[] = [
  { name: "Preto", value: "Preto", hex: "#111111" },
  { name: "Branco", value: "Branco", hex: "#f8fafc" },
  { name: "Vermelho", value: "Vermelho", hex: "#dc2626" },
  { name: "Azul", value: "Azul", hex: "#2563eb" },
  { name: "Verde", value: "Verde", hex: "#16a34a" },
  { name: "Amarelo", value: "Amarelo", hex: "#facc15" },
  { name: "Laranja", value: "Laranja", hex: "#f97316" },
  { name: "Rosa", value: "Rosa", hex: "#ec4899" },
  { name: "Roxo", value: "Roxo", hex: "#7c3aed" },
  { name: "Cinza", value: "Cinza", hex: "#6b7280" },
  { name: "Dourado", value: "Dourado", hex: "#d4af37" },
  { name: "Prata", value: "Prata", hex: "#c0c0c0" },
  { name: "Marrom", value: "Marrom", hex: "#8b5e34" },
  { name: "Bege", value: "Bege", hex: "#e7d3b0" },
  { name: "Turquesa", value: "Turquesa", hex: "#14b8a6" },
  { name: "Preto Fosco", value: "Preto Fosco", hex: "#1f2937" },
];

const bagColors: ColorOption[] = [
  { name: "Transparente", value: "Transparente", hex: "transparent", transparent: true },
  ...logoColors,
];

const handleTypes: string[] = ["Nylon", "Gorgurão"];
const handleColors: string[] = ["Preto", "Branco", "Bege", "Verde", "Vermelho", "Azul"];

interface SizeOption {
  value: string;
  label: string;
}

const sizeOptionsByBagType: Record<string, SizeOption[]> = {
  "alca-fita": [
    { value: "27x40", label: "27 x 40" },
    { value: "36x36", label: "36 x 36" },
    { value: "30x45", label: "30 x 45" },
    { value: "40x50", label: "40 x 50" },
  ],
  "boca-de-palhaco": [
    { value: "15x20", label: "15 x 20" },
    { value: "20x30", label: "20 x 30" },
    { value: "25x35", label: "25 x 35" },
    { value: "30x45", label: "30 x 45" },
    { value: "40x50", label: "40 x 50" },
    { value: "50x60", label: "50 x 60" },
  ],
  "sacola-de-papel": [
    { value: "11,5x9,5x4", label: "11,5 x 9,5 x 4" },
    { value: "15x13x5", label: "15 x 13 x 5" },
    { value: "16x16x6", label: "16 x 16 x 6" },
    { value: "16x22x6", label: "16 x 22 x 6" },
    { value: "22x20x8", label: "22 x 20 x 8" },
    { value: "27x22x9", label: "27 x 22 x 9" },
    { value: "35x24x10", label: "35 x 24 x 10" },
    { value: "38x27x12", label: "38 x 27 x 12" },
  ],
  "papel-kraft": [
    { value: "11,5x9,5x4", label: "11,5 x 9,5 x 4" },
    { value: "15x13x5", label: "15 x 13 x 5" },
    { value: "16x16x6", label: "16 x 16 x 6" },
    { value: "16x22x6", label: "16 x 22 x 6" },
    { value: "22x20x8", label: "22 x 20 x 8" },
    { value: "27x22x9", label: "27 x 22 x 9" },
    { value: "35x24x10", label: "35 x 24 x 10" },
    { value: "38x27x12", label: "38 x 27 x 12" },
  ],
};

interface QuantityRule {
  label: string;
  mode: "select" | "number";
  start?: number;
  step?: number;
  count?: number;
  min?: number;
}

const quantityRules: Record<string, QuantityRule> = {
  "boca-de-palhaco": { label: "Por cento", mode: "select", start: 100, step: 100, count: 10 },
  "sacola-de-papel": { label: "A partir de 50 unidades", mode: "number", min: 50 },
  "papel-kraft": { label: "A partir de 50 unidades", mode: "number", min: 50 },
  "alca-fita": { label: "A partir de 50 unidades", mode: "select", start: 50, step: 50, count: 10 },
};

interface PricePricing {
  baseQuantity: number;
  sizes: Record<string, number>;
}

const basePricesByBagType: Record<string, PricePricing> = {
  "boca-de-palhaco": {
    baseQuantity: 100,
    sizes: {
      "15x20": 0.8,
      "20x30": 0.9,
      "25x35": 1.1,
      "30x45": 1.3,
      "40x50": 2,
      "50x60": 2.5,
    },
  },
  "alca-fita": {
    baseQuantity: 100,
    sizes: {
      "27x40": 2.3,
      "30x35": 2.5,
      "36x36": 2.6,
      "40x50": 3,
    },
  },
  "sacola-de-papel": {
    baseQuantity: 50,
    sizes: {
      "11,5x9,5x4": 1.5,
      "15x13x5": 1.7,
      "16x16x6": 1.9,
      "16x22x6": 2.2,
      "22x20x8": 2.5,
      "27x22x9": 2.8,
      "35x24x10": 3.1,
      "38x27x12": 3.8,
    },
  },
  "papel-kraft": {
    baseQuantity: 50,
    sizes: {
      "11,5x9,5x4": 1.5,
      "15x13x5": 1.7,
      "16x16x6": 1.9,
      "16x22x6": 2.2,
      "22x20x8": 2.5,
      "27x22x9": 2.8,
      "35x24x10": 3.1,
      "38x27x12": 3.8,
    },
  },
};

const handleExtraByType: Record<string, number> = {
  Nylon: 0,
  Gorgurão: 0.5,
};

const formatCurrency = (value: number) =>
  new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);

interface PedidoProps {
  onClose?: () => void;
  currentUser?: User | null;
  logoSrc?: string;
}

export default function Pedido({ onClose, logoSrc = defaultLogo }: PedidoProps) {
  const [bagType, setBagType] = useState<string>("sacola-de-papel");
  const [selectedBagColors, setSelectedBagColors] = useState<string[]>(["Branco"]);
  const [selectedLogoColors, setSelectedLogoColors] = useState<string[]>(["Preto"]);
  const [handleType, setHandleType] = useState<string>("Nylon");
  const [handleColor, setHandleColor] = useState<string>("Preto");
  const [size, setSize] = useState<string>("11,5x9,5x4");
  const [quantity, setQuantity] = useState<string>("50");
  const [logoFront, setLogoFront] = useState<boolean>(true);
  const [logoBack, setLogoBack] = useState<boolean>(false);
  const [submitted, setSubmitted] = useState<boolean>(false);

  const selectedBag = useMemo(
    () => bagTypes.find((item) => item.value === bagType),
    [bagType]
  );

  const selectedLogoColorLabels = useMemo(() => selectedLogoColors.join(", "), [selectedLogoColors]);
  const selectedBagColorLabels = useMemo(() => selectedBagColors.join(", "), [selectedBagColors]);

  const sizeOptions = useMemo(
    () => sizeOptionsByBagType[bagType] || sizeOptionsByBagType["sacola-de-papel"],
    [bagType]
  );

  const quantityRule = useMemo(
    () => quantityRules[bagType] || quantityRules["sacola-de-papel"],
    [bagType]
  );

  const quantityOptions = useMemo(
    () =>
      Array.from({ length: quantityRule.count || 0 }, (_, index) => {
        const start = quantityRule.start || 0;
        const step = quantityRule.step || 0;
        const value = start + index * step;

        return {
          value: String(value),
          label: `${value} unidades`,
        };
      }),
    [quantityRule]
  );

  const isTypedQuantity = quantityRule.mode === "number";

  const showHandleOptions = bagType === "sacola-de-papel" || bagType === "papel-kraft";
  const isSingleBagColorMode = bagType === "boca-de-palhaco" || bagType === "alca-fita";

  const numericQuantity = useMemo(() => {
    const parsed = Number.parseInt(quantity, 10);
    return Number.isFinite(parsed) && parsed > 0 ? parsed : 0;
  }, [quantity]);

  const budget = useMemo(() => {
    const bagPricing = basePricesByBagType[bagType] || { baseQuantity: 1, sizes: {} };
    const sizePrice = bagPricing.sizes[size] || 0;
    const baseQuantity = bagPricing.baseQuantity || 1;
    const logoColorsCount = selectedLogoColors.length;
    const unitPriceEstimate = sizePrice;
    const baseBagTotal = numericQuantity * unitPriceEstimate;
    const handleExtraTotal = showHandleOptions ? numericQuantity * (handleExtraByType[handleType] || 0) : 0;
    const logoExtraTotal =
      bagType === "boca-de-palhaco" || bagType === "alca-fita"
        ? logoColorsCount > 1
          ? numericQuantity * 0.7
          : 0
        : logoFront && logoBack
          ? numericQuantity * 0.5
          : 0;
    const finalTotal = baseBagTotal + handleExtraTotal + logoExtraTotal;

    return {
      baseQuantity,
      sizePrice,
      unitPriceEstimate,
      baseBagTotal,
      handleExtraTotal,
      logoExtraTotal,
      finalTotal,
    };
  }, [
    bagType,
    handleType,
    logoBack,
    logoFront,
    numericQuantity,
    selectedLogoColors,
    showHandleOptions,
    size,
  ]);

  const handleBagTypeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const nextBagType = event.target.value;
    const nextQuantityRule = quantityRules[nextBagType] || quantityRules["sacola-de-papel"];
    const nextSizeOptions = sizeOptionsByBagType[nextBagType] || sizeOptionsByBagType["sacola-de-papel"];

    setBagType(nextBagType);
    setSize(nextSizeOptions[0]?.value || "");
    setQuantity(String(nextQuantityRule.start || nextQuantityRule.min || 50));
    if (nextBagType === "boca-de-palhaco" || nextBagType === "alca-fita") {
      setHandleType("Nylon");
      setHandleColor("Preto");
    }
  };

  const toggleLogoColor = (colorValue: string) => {
    setSelectedLogoColors((currentColors) => {
      if (currentColors.includes(colorValue)) {
        const nextColors = currentColors.filter((item) => item !== colorValue);
        return nextColors.length > 0 ? nextColors : currentColors;
      }

      return [...currentColors, colorValue];
    });
  };

  const toggleBagColor = (colorValue: string) => {
    setSelectedBagColors((currentColors) => {
      if (isSingleBagColorMode) {
        return [colorValue];
      }

      if (currentColors.includes(colorValue)) {
        const nextColors = currentColors.filter((item) => item !== colorValue);
        return nextColors.length > 0 ? nextColors : currentColors;
      }

      return [...currentColors, colorValue];
    });
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitted(true);
  };

  return (
    <main className="pedido-page">
      <section className="pedido-shell">
        <section className="pedido-form-panel">
          {onClose && (
            <button className="pedido-close" type="button" onClick={onClose} aria-label="Fechar pedido">
              ✕
            </button>
          )}

          <div className="pedido-form-top">
            <img className="pedido-logo" src={logoSrc || defaultLogo} alt="Logo AF Sacolas" />
            <div className="pedido-form-top__copy">
              <h1>Configure a sacola antes de enviar para produção.</h1>
            </div>
          </div>

          <div className="pedido-form-header">
            <span className="pedido-badge">Novo pedido</span>
            <h2>Detalhes da sacola</h2>
            <p>Preencha os campos abaixo.</p>
          </div>

          <form className="pedido-form" onSubmit={handleSubmit}>
            <div className="pedido-field-group">
              <label htmlFor="bagType">Tipo de sacola</label>
              <select id="bagType" value={bagType} onChange={handleBagTypeChange}>
                {bagTypes.map((item) => (
                  <option key={item.value} value={item.value}>
                    {item.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="pedido-section-card pedido-section-card--wide">
              <div className="pedido-section-heading">
                <h3>Cor da sacola</h3>
                <p>
                  {isSingleBagColorMode
                    ? "Escolha apenas uma cor. Este modelo também permite transparente."
                    : "Escolha uma ou mais cores para personalizar a sacola."}
                </p>
              </div>

              <div className="logo-colors-grid" role="group" aria-label="Cores da sacola">
                {bagColors.map((color) => {
                  const isSelected = selectedBagColors.includes(color.value);

                  return (
                    <button
                      key={color.value}
                      type="button"
                      className={`logo-color-option ${isSelected ? "is-selected" : ""}`}
                      onClick={() => toggleBagColor(color.value)}
                      aria-pressed={isSelected}
                    >
                      <span
                        className={`logo-color-swatch ${color.transparent ? "logo-color-swatch--transparent" : ""}`}
                        style={!color.transparent ? { backgroundColor: color.hex } : undefined}
                        aria-hidden="true"
                      />
                      <span className="logo-color-label">{color.name}</span>
                    </button>
                  );
                })}
              </div>

              <div className="logo-color-chip-list" aria-label="Cores da sacola selecionadas">
                {selectedBagColors.map((color) => (
                  <span key={color} className="logo-color-chip">
                    {color}
                  </span>
                ))}
              </div>
            </div>

            <div className="pedido-section-card pedido-section-card--wide">
              <div className="pedido-section-heading">
                <h3>Cor da logo</h3>
                <p>Escolha uma ou mais cores para a aplicação da sua arte.</p>
              </div>

              <div className="logo-colors-grid" role="group" aria-label="Cores da logo">
                {logoColors.map((color) => {
                  const isSelected = selectedLogoColors.includes(color.value);

                  return (
                    <button
                      key={color.value}
                      type="button"
                      className={`logo-color-option ${isSelected ? "is-selected" : ""}`}
                      onClick={() => toggleLogoColor(color.value)}
                      aria-pressed={isSelected}
                    >
                      <span className="logo-color-swatch" style={{ backgroundColor: color.hex }} aria-hidden="true" />
                      <span className="logo-color-label">{color.name}</span>
                    </button>
                  );
                })}
              </div>

              <div className="logo-color-chip-list" aria-label="Cores selecionadas">
                {selectedLogoColors.map((color) => (
                  <span key={color} className="logo-color-chip">
                    {color}
                  </span>
                ))}
              </div>
            </div>

            <div className="pedido-grid">
              <div className="pedido-field-group">
                <label htmlFor="size">Tamanho da sacola</label>
                <select id="size" value={size} onChange={(event) => setSize(event.target.value)}>
                  {sizeOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="pedido-field-group">
                <label htmlFor="quantity">Quantidade</label>
                {isTypedQuantity ? (
                  <input
                    id="quantity"
                    type="number"
                    min={quantityRule.min}
                    step="1"
                    inputMode="numeric"
                    value={quantity}
                    onChange={(event) => setQuantity(event.target.value)}
                    placeholder="Digite a quantidade"
                  />
                ) : (
                  <select id="quantity" value={quantity} onChange={(event) => setQuantity(event.target.value)}>
                    {quantityOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                )}
              </div>
            </div>

            <div className="pedido-section-card pedido-quantity-note">
              <div className="pedido-section-heading">
                <h3>Condição de venda</h3>
                <p>{quantityRule.label}</p>
              </div>
            </div>

            {showHandleOptions && (
              <div className="pedido-section-card">
                <div className="pedido-section-heading">
                  <h3>Alça da sacola</h3>
                  <p>Disponível para os modelos em papel.</p>
                </div>

                <div className="pedido-grid">
                  <div className="pedido-field-group">
                    <label htmlFor="handleType">Tipo de alça</label>
                    <select id="handleType" value={handleType} onChange={(event) => setHandleType(event.target.value)}>
                      {handleTypes.map((type) => (
                        <option key={type} value={type}>
                          {type}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="pedido-field-group">
                    <label htmlFor="handleColor">Cor da alça</label>
                    <select id="handleColor" value={handleColor} onChange={(event) => setHandleColor(event.target.value)}>
                      {handleColors.map((color) => (
                        <option key={color} value={color}>
                          {color}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            )}

            <div className="pedido-section-card">
              <div className="pedido-section-heading">
                <h3>Aplicação da logo</h3>
                <p>Defina onde a arte vai ser impressa.</p>
              </div>

              <div className="pedido-checkboxes">
                <label className="pedido-check">
                  <input
                    type="checkbox"
                    checked={logoFront}
                    onChange={(event) => setLogoFront(event.target.checked)}
                  />
                  <span>Frente da sacola</span>
                </label>

                <label className="pedido-check">
                  <input type="checkbox" checked={logoBack} onChange={(event) => setLogoBack(event.target.checked)} />
                  <span>Verso da sacola</span>
                </label>
              </div>
            </div>

            <div className="pedido-section-card pedido-budget">
              <div className="pedido-section-heading">
                <h3>Cálculo do orçamento</h3>
                <p>Os valores abaixo seguem a configuração escolhida pelo cliente.</p>
              </div>

              <div className="pedido-budget-table">
                <div>
                  <span>Quantidade base</span>
                  <strong>{budget.baseQuantity} unidades</strong>
                </div>
                <div>
                  <span>Valor do tamanho escolhido</span>
                  <strong>{formatCurrency(budget.sizePrice)}</strong>
                </div>
                <div>
                  <span>Valor por unidade</span>
                  <strong>{formatCurrency(budget.unitPriceEstimate)}</strong>
                </div>
                <div>
                  <span>Base da sacola</span>
                  <strong>{formatCurrency(budget.baseBagTotal)}</strong>
                </div>
                <div>
                  <span>Adicional da alça</span>
                  <strong>{formatCurrency(budget.handleExtraTotal)}</strong>
                </div>
                <div>
                  <span>Adicional da logo</span>
                  <strong>{formatCurrency(budget.logoExtraTotal)}</strong>
                </div>
                <div className="pedido-budget-total">
                  <span>Total estimado</span>
                  <strong>{formatCurrency(budget.finalTotal)}</strong>
                </div>
              </div>

              <p className="pedido-budget-note">
                Boca de palhaço e alça fita usam tabela de 100 unidades. Sacola de papel e papel kraft usam tabela de
                50 unidades.
              </p>
            </div>

            <div className="pedido-section-card pedido-summary">
              <div className="pedido-section-heading">
                <h3>Resumo rápido</h3>
                <p>Confira o que está configurado antes de enviar.</p>
              </div>

              <div className="pedido-summary__grid">
                <div>
                  <span>Tipo</span>
                  <strong>{selectedBag?.label}</strong>
                </div>
                <div>
                  <span>Logo</span>
                  <strong>{selectedLogoColorLabels}</strong>
                </div>
                <div>
                  <span>Cor da sacola</span>
                  <strong>{selectedBagColorLabels}</strong>
                </div>
                <div>
                  <span>Tamanho</span>
                  <strong>{sizeOptions.find((option) => option.value === size)?.label}</strong>
                </div>
                <div>
                  <span>Quantidade</span>
                  <strong>{quantity} unidades</strong>
                </div>
                <div>
                  <span>Aplicação</span>
                  <strong>
                    {logoFront && logoBack
                      ? "Frente e verso"
                      : logoFront
                        ? "Frente"
                        : logoBack
                          ? "Verso"
                          : "Nenhuma"}
                  </strong>
                </div>
                {showHandleOptions && (
                  <>
                    <div>
                      <span>Alça</span>
                      <strong>{handleType}</strong>
                    </div>
                    <div>
                      <span>Cor da alça</span>
                      <strong>{handleColor}</strong>
                    </div>
                  </>
                )}
              </div>

              {submitted && (
                <div className="pedido-success" role="status">
                  Pedido preparado com sucesso. Agora você pode integrar esse formulário ao orçamento ou envio.
                </div>
              )}
            </div>

            <div className="pedido-actions">
              <button className="pedido-secondary" type="button" onClick={onClose}>
                Voltar
              </button>
              <button className="pedido-primary" type="submit">
                Salvar pedido
              </button>
            </div>
          </form>
        </section>
      </section>
    </main>
  );
}
