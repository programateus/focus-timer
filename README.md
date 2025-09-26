# Focus Timer

> [!WARNING]  
> Este projeto ainda está em desenvolvimento

Uma aplicação de timer Pomodoro construída com NestJS e React, usando PostgreSQL e React Query para cache.

## 📋 Pré-requisitos

- [Node.js](https://nodejs.org/) (v22)
- [Docker](https://www.docker.com/) e Docker Compose
- [npm](https://www.npmjs.com/)

## 🚀 Quick Start

### 1. Clone o Repositório

```bash
git clone https://github.com/programateus/focus-timer.git
cd focus-timer
```

### 2. Iniciar Serviços de Infraestrutura

Inicie o PostgreSQL e Redis usando Docker Compose:

```bash
docker-compose up
```

Isso irá iniciar:

- **PostgreSQL** na porta `5432`
- **Redis** na porta `6379`
- **pgAdmin** na porta `5050` (admin@email.com / root)
- **RedisInsight** na porta `5540`

### 3. Configurar API (Backend)

Navegue para o diretório da API e instale as dependências:

```bash
cd api
npm install
```

Crie seu arquivo de ambiente:

```bash
cp .env.example .env
```

Gere o cliente Prisma e execute as migrações:

```bash
npx prisma generate
npx prisma db push
```

Inicie a API em modo de desenvolvimento:

```bash
npm run dev
```

A API estará disponível em `http://localhost:4000` com documentação Swagger em `http://localhost:4000/api`.

### 4. Configurar Frontend (App)

Em um novo terminal, navegue para o diretório da aplicação:

```bash
cd app
npm install
```

Crie seu arquivo de ambiente:

```bash
cp .env.example .env
```

Inicie o servidor de desenvolvimento:

```bash
npm run dev
```

O frontend estará disponível em `http://localhost:5173` (ou outra porta mostrada no terminal).

## 📊 Gerenciamento de Banco de Dados

### Acessar pgAdmin

1. Abra `http://localhost:5050`
2. Faça login com `admin@email.com` / `root`
3. Adicione conexão do servidor:
   - Host: `db`
   - Port: `5432`
   - Username: `postgres`
   - Password: `postgres`

### Acessar RedisInsight

1. Abra `http://localhost:5540`
2. Adicione conexão Redis:
   - Host: `redis`
   - Port: `6379`

## 🛠️ Estrutura do Projeto

```
focus-timer/
├── api/                    # Backend NestJS
│   ├── src/               # Código fonte
│   ├── prisma/            # Schema do banco e migrações
│   ├── generated/         # Cliente Prisma gerado
│   └── package.json
├── app/                   # Aplicação Frontend
│   ├── src/               # Código fonte
│   ├── public/            # Assets estáticos
│   └── package.json
├── .docker/               # Configurações Docker
│   ├── postgres/          # Configuração PostgreSQL
│   ├── redis/             # Configuração Redis
│   └── sql/               # Scripts de inicialização SQL
└── docker-compose.yaml    # Configuração Docker Compose
```

## 🔍 Principais Funcionalidades

- **Funcionalidade do Timer**: Implementada em [`app/src/presentation/hooks/use-countdown.ts`](app/src/presentation/hooks/use-countdown.ts)
- **Documentação da API**: Disponível em `http://localhost:4000/api` quando em execução (WIP)
- **Banco de Dados**: PostgreSQL com Prisma ORM
- **Cache**: Redis para melhor performance (WIP)
- **Segurança de Tipos**: Suporte completo ao TypeScript

## 📝 Variáveis de Ambiente

### API (.env)

Gere a chave privada e pública usando https://cryptotools.net/rsagen, use a opção de key length em 2048

```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/focus_timer"
PORT=4000

JWT_PRIVATE_KEY=
JWT_PUBLIC_KEY=

JWT_ACCESS_TOKEN_EXPIRES_IN=1m
JWT_REFRESH_TOKEN_EXPIRES_IN=7d

REDIS_HOST="localhost"
REDIS_PORT=6379
REDIS_USERNAME="focus-timer"
REDIS_PASSWORD="123456"
```

### Frontend (.env)

```env
VITE_DOMAIN=localhost
VITE_API_URL=http://localhost:4000/
```

## 📄 Licença

Este projeto está licenciado sob a Licença MIT.
