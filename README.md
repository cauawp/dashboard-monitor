# 📊 Dashboard de Monitoramento em Tempo Real

Este projeto é uma solução completa de monitoramento de eventos de usuários em tempo real. Inclui backend, frontend, integração com OpenAI API, WebSocket, autenticação JWT, gráficos interativos e muito mais — construído como parte de um teste técnico.

---

## ✅ Funcionalidades

### Backend (Node.js + TypeScript + Express)

- 📥 Recebimento de eventos via Webhook (`POST /webhook/event`)
- 📊 Endpoints REST para consulta de dados brutos e agregados
- 🧠 Geração de insights via **OpenAI API**
- 📡 Emissão em tempo real com **WebSocket**
- 🔐 Autenticação via JWT

### Frontend (Next.js + TypeScript + TailwindCSS + Shadcn)

- 🔐 Login protegido com JWT (via cookie HTTPOnly)
- 📈 Gráficos com Chart.js e ApexCharts
- ⚡ Feed em tempo real atualizado via WebSocket
- 🧠 Card dinâmico com insight (OpenAI)
- 🎛️ Filtros por tipo de evento e intervalo de tempo
- 🕒 Indicador de última atualização e status de conexão

---

## 🧱 Justificativas Técnicas

### Banco de Dados: MongoDB

Optou-se por **MongoDB** pela flexibilidade no armazenamento de dados semi-estruturados, como os campos dinâmicos em `metadata`. A capacidade de usar agregações complexas com performance sólida o torna ideal para este cenário, em que diversos filtros e dashboards são necessários.

### Cache: `node-cache` ao invés de Redis

Para caching leve de agregações, foi usado **`node-cache`**. Não foi adotado Redis por não haver necessidade de persistência, replicação ou alta concorrência. A escolha visa manter o projeto prático, simples e dentro do escopo proposto.

---

## 🚀 Como Rodar o Projeto

### ✅ Pré-requisitos

- Node.js 18+
- Docker + Docker Compose (opcional)
- Instância MongoDB (local ou na nuvem)

---

## 🧪 Executando o Projeto

### 🔁 Usando Docker (Recomendado)

1. Crie um arquivo `.env` na raiz do repositório:

```env
MONGODB_URI=mongodb://mongodb:27017/dashboard
PORT=3001
JWT_SECRET=supersecret
OPENAI_API_KEY=sua-chave-openai
NEXT_PUBLIC_API_URL=http://localhost:3001/
```

2. Execute os containers:

```bash
docker-compose up --build
```

#### 📦 Estrutura Docker

docker-compose.yml

```yaml
version: "3.8"

services:
  backend:
    build:
      context: ./apps/backend
    ports:
      - "3001:3001"
    volumes:
      - ./apps/backend:/app
      - /app/node_modules
    env_file: .env
    depends_on:
      - mongodb

  frontend:
    build:
      context: ./apps/frontend/dashboard-monitor
    ports:
      - "3000:3000"
    volumes:
      - ./apps/frontend:/app
      - /app/node_modules
    env_file: .env
    command: sh -c "npm install && npm run dev"

  mongodb:
    image: mongo
    ports:
      - "27017:27017"
    volumes:
      - mongo-data:/data/db

volumes:
  mongo-data:
```

---

### 💻 Rodando Localmente (Sem Docker)

#### 1. Configure a conexão MongoDB (ex: MongoDB Atlas):

```env
MONGODB_URI=mongodb+srv://<user>:<password>@cluster0.mongodb.net/dashboard
PORT=3001
JWT_SECRET=supersecret
OPENAI_API_KEY=sua-chave-openai
NEXT_PUBLIC_API_URL=http://localhost:3001/
```

#### 2. Rode o Backend:

```bash
cd apps/backend
npm install
npm run build
npm run start
```

#### 3. Rode o Frontend:

```bash
cd apps/frontend/dashboard-monitor
npm install
npm run build
npm start
```

---

## 📡 Webhook

### Endpoint

```
POST /webhook/event
```

### Exemplo de Payload

```json
{
  "userId": "user_123",
  "type": "purchase",
  "value": 99.9,
  "timestamp": "2025-07-31T12:34:56Z",
  "metadata": {
    "product": "Widget Pro",
    "campaign": "summer-sale"
  }
}
```

#### Disparar manualmente:

```bash
curl -X POST http://localhost:3001/webhook/event \
-H "Content-Type: application/json" \
-d '{ "userId": "user_123", "type": "purchase", "value": 99.90, "timestamp": "2025-07-31T12:34:56Z", "metadata": { "product": "Widget Pro", "campaign": "summer-sale" } }'
```

---

## 🤖 Insight com OpenAI

### Endpoint

```
POST /insight
```

### Resposta Exemplo

```json
{
  "insight": "Nas últimas 24h: 120 eventos, 45 compras, ticket médio R$98.45. Top 3 usuários: user_123, user_456, user_789."
}
```

---

## 📊 Visualizações no Dashboard

- 📈 Gráfico de linha: volume de eventos por tempo
- 🍰 Gráfico de pizza/barra: eventos por tipo
- 🏆 Ranking: top usuários por valor/frequência
- 🔄 Feed em tempo real: WebSocket
- 🧠 Card de Insight (OpenAI)
- ⏱️ Última atualização
- 🔍 Filtros: data e tipo de evento
- 🛡️ Login com autenticação JWT
- 📶 Status da conexão WebSocket

---

## 🧪 Testes Automatizados

- **Handler de webhook** e **Geração de Insight** com Jest

```bash
cd apps/backend
npm run test
```

---

## 🧾 Estrutura do Projeto

```
📦 dashboard-monitor
├── apps
│   ├── backend
│   │   ├── src
│   │   │   ├── controllers
│   │   │   ├── routes
│   │   │   ├── services
│   │   │   ├── models
│   │   │   └── websocket
│   │   └── Dockerfile / .env
│   └── frontend
│       ├── dashboard-monitor
│       │   ├── components / lib / app / hooks
│       │   └── Dockerfile / .env
├── docker-compose.yml
└── README.md
```

---

## 📌 Considerações Finais

- ✅ Projeto 100% funcional e alinhado com os requisitos do teste técnico
- 💡 Soluções práticas priorizadas (ex: uso de `node-cache` ao invés de Redis)
- 🧑‍💻 Código com ESLint, Prettier e tipagem rigorosa em TypeScript
- 🧱 Estrutura modular para fácil manutenção e expansão
- 🎨 UI/UX com Radix UI e Shadcn

---

## 👨‍💻 Autor

Cauã Wilian Pereira

---

## 📈 Futuras Melhorias

Apesar da solução atual estar 100% funcional e atender aos requisitos do teste técnico, há várias oportunidades de evolução que poderiam ser implementadas em uma continuação do projeto:

- 🔁 **Fila assíncrona para Webhooks**
  Utilizar uma fila como **BullMQ** ou **RabbitMQ** para processar webhooks de forma resiliente e escalável, garantindo retry/backoff e rastreabilidade dos eventos recebidos.

- 🧠 **Agendamento automático de insights**
  Implementar geração automática de insights diários utilizando **cron jobs**, armazenando os relatórios em histórico para comparação e análise.

- 💾 **Persistência de cache com Redis**
  Caso o volume de dados aumente, substituir `node-cache` por **Redis**, permitindo cache distribuído com maior controle de expiração e performance.

- 📄 **Histórico completo de eventos**
  Adicionar paginação, busca e exportação dos eventos para **CSV ou PDF**, permitindo auditoria mais robusta.

- 🔐 **Gestão de usuários e permissões**
  Criar sistema de múltiplos usuários com níveis de acesso (ex: admin, viewer) e logs de autenticação.

- 🔍 **Logs e observabilidade**
  Integrar ferramentas como **Winston**, **Logtail** ou **Grafana/Loki** para melhor monitoramento e debugging.

- 🧪 **Cobertura de testes**
  Expandir os testes automatizados para incluir casos de borda, validações de schema e testes end-to-end com **Playwright**.
