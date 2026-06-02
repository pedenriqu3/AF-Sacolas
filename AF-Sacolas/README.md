# Sistema de Customização e Pedidos de Sacolas (SaaS)

Um sistema web interativo e responsivo projetado originalmente para a **AF Sacolas**, mas construído com arquitetura escalável para ser comercializado como uma plataforma SaaS (*Software as a Service*) para outras empresas do setor de embalagens e brindes.

O objetivo principal da plataforma é automatizar o processo de venda e orçamento, permitindo que o próprio cliente monte, visualize e pague pelo seu pedido de forma 100% autônoma.

---

## Funcionalidades Principais

### Painel de Customização e Preview (Core)
* **Modelagem do Produto:** Escolha entre modelos de sacola (Boca de Palhaço ou Papel).
* **Seleção de Atributos:** Definição das cores da sacola, cores da logo e tipo de alça (para modelos de papel).
* **Esboço Dinâmico (Preview):** Geração visual em tempo real do esboço da sacola customizada pelo cliente.
* **Orçamento Automatizado:** Cálculo instantâneo do valor do pedido com base nos atributos e quantidades escolhidas.

### Checkout e Agendamento
* **Pagamento Instantâneo:** Geração de QR Code dinâmico para pagamento rápido (ex: Pix / Gateway de pagamento).
* **Fluxo de Produção:** Agendamento automático do pedido no cronograma da empresa após a confirmação do pagamento.

### Área do Cliente
* **Autenticação:** Sistema completo de Login e Cadastro de clientes.
* **Histórico:** Acompanhamento do status dos pedidos e orçamentos salvos.

### Institucional e Social Proof
* **Home Page:** Tela de início moderna apresentando a empresa e os diferenciais do produto.
* **Portfólio:** Galeria dinâmica mostrando trabalhos e encomendas já realizados.
* **Avaliações:** Espaço para depoimentos e notas deixadas por clientes satisfeitos.

---

## Arquitetura do Sistema (Visão SaaS)

O sistema foi planejado para ser **multi-inquilino (Multitenant)** no futuro. Isso significa que as configurações da AF Sacolas (como preços por cor, tipos de alça disponíveis e logo da empresa) ficam separadas das regras de negócio do sistema, facilitando o *rebranding* para novos clientes.

---

## Tecnologias Cogitadas / Utilizadas

*Se você já tiver definido a stack (ex: Go, React, PostgreSQL, Docker), substitua ou complemente esta seção.*

* **Frontend:** HTML5, CSS3, JavaScript (ou React / Vue para gerenciamento de estado do customizador).
* **Backend:** [Inserir Tecnologia, ex: Go / Node.js] — responsável pelas regras de orçamento e integração de pagamentos.
* **Banco de Dados:** [Inserir Banco, ex: PostgreSQL / MySQL] — para persistência de usuários, pedidos e configurações de produtos.
* **Integrações:** API de Gateway de Pagamento para geração de QR Code.

---

## Estrutura do Banco de Dados (Entidades Principais)

Para suportar o fluxo do projeto, o banco conta com as seguintes entidades base:
* **Users / Customers:** Dados cadastrais e credenciais de acesso.
* **Products / Models:** Modelos de sacolas e coeficientes de preço para o orçamento.
* **Orders / Budgets:** Registros dos pedidos, especificações da sacola escolhida, status do pagamento e data de agendamento.
* **Portfólio & Reviews:** Imagens de trabalhos anteriores e depoimentos dos clientes.

## Status do Projeto
- [x] Estrutura inicial do Git configurada!