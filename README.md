# 💰 Controle Financeiro

Um aplicativo mobile moderno, intuitivo e poderoso para gerenciar suas finanças pessoais. Registre contas bancárias, categorize receitas e despesas, e acompanhe seus gastos em tempo real com um dashboard visual e intuitivo.

**Status**: ✅ Pronto para Produção | **Versão**: 1.0.0 | **Última atualização**: Julho 2026

---

## 🎯 Sobre o Projeto

O **Controle Financeiro** é um aplicativo desenvolvido com as tecnologias mais modernas do ecossistema React Native. Ele oferece uma solução completa para gerenciar finanças pessoais com sincronização em nuvem, autenticação segura e uma interface intuitiva que segue os padrões de design do iOS.

### Principais Características
- ✅ Dashboard com gráficos e estatísticas em tempo real
- ✅ Gerenciamento completo de contas bancárias
- ✅ Categorias personalizáveis de receita/despesa
- ✅ Registro detalhado de movimentos financeiros
- ✅ Sincronização com servidor (Supabase)
- ✅ Autenticação segura de usuários
- ✅ Persistência local com AsyncStorage
- ✅ Modo claro e escuro automático
- ✅ Otimizado para dispositivos Android e iOS

---

## ✨ Funcionalidades Detalhadas

### 📊 Dashboard Inteligente
- **Saldo Total Consolidado**: Visualize o saldo total de todas as suas contas em um grande card destacado
- **Estatísticas do Mês**: Acompanhe receitas, despesas e saldo mensal com cards coloridos
- **Distribuição por Tipo**: Gráfico de barras mostrando como seu dinheiro está distribuído
- **Preview de Contas**: Acesso rápido às 3 principais contas com saldos atualizados
- **Ações Rápidas**: Botões flutuantes para criar contas e movimentos rapidamente
- **Atualização Automática**: Dados sincronizam quando você volta para a tela

### 🏦 Gerenciamento de Contas
- **Criar Contas**: Cadastre contas bancárias com nome, tipo e saldo inicial
- **Editar Contas**: Atualize informações de contas existentes a qualquer momento
- **Deletar Contas**: Remova contas que não usa mais com confirmação de segurança
- **Tipos Suportados**: 
  - 🏦 Conta Corrente (para transações do dia a dia)
  - 💰 Poupança (para guardar e poupar)
  - 📈 Investimento (para aplicações financeiras)
- **Cálculo Automático**: Saldo atualiza automaticamente com cada movimento
- **Histórico**: Visualize todos os movimentos de cada conta

### 🏷️ Categorias Personalizáveis (Naturezas)
- **Receitas Pré-configuradas**: 
  - 💼 Salário
  - 💻 Freelance
  - 🎁 Bônus
  - 📊 Investimentos
- **Despesas Pré-configuradas**:
  - 🍔 Alimentação
  - 🚗 Transporte
  - 🏥 Saúde
  - 🎮 Entretenimento
  - 🏠 Moradia
  - 📱 Utilidades
- **Personalização Completa**: Crie suas próprias categorias com cores e ícones
- **Organização Automática**: Receitas e despesas separadas automaticamente
- **Filtros Rápidos**: Visualize movimentos por categoria

### 💳 Movimentos Financeiros Detalhados
- **Registrar Lançamentos**: Adicione receitas e despesas com data, descrição, valor e categoria
- **Editar Movimentos**: Corrija lançamentos já registrados a qualquer momento
- **Deletar Movimentos**: Remova movimentos incorretos com confirmação
- **Listagem Ordenada**: Visualize movimentos ordenados por data (mais recentes primeiro)
- **Detalhes Completos**: Veja natureza, conta, valor e data de cada movimento
- **Filtros Avançados**: Filtre por período, categoria, tipo e conta
- **Busca Rápida**: Procure movimentos por descrição

---

## 🛠️ Stack Tecnológico

| Tecnologia | Versão | Descrição |
|-----------|--------|-----------|
| **React Native** | 0.81.5 | Framework para desenvolvimento mobile multiplataforma |
| **Expo** | 54 | Plataforma para build, deploy e gerenciamento de apps |
| **TypeScript** | 5.9 | Linguagem tipada para JavaScript com segurança de tipos |
| **React 19** | 19.1.0 | Biblioteca UI moderna com React Compiler |
| **NativeWind** | 4.2 | Tailwind CSS para React Native com suporte completo |
| **Expo Router** | 6 | Roteamento e navegação com suporte a deep linking |
| **AsyncStorage** | 2.2 | Persistência de dados local no dispositivo |
| **Supabase** | Latest | Backend em tempo real com PostgreSQL e autenticação |
| **Drizzle ORM** | 0.44.7 | ORM type-safe para gerenciar banco de dados |
| **TanStack Query** | 5.90.12 | Gerenciamento de estado e cache de dados |
| **tRPC** | 11.7.2 | RPC type-safe entre cliente e servidor |

---

## 📦 Instalação e Setup

### Pré-requisitos
- **Node.js** 18+ (recomendado 20+)
- **npm** ou **pnpm** como gerenciador de pacotes
- **Expo CLI**: `npm install -g expo-cli`
- **Git** para clonar o repositório

### Passo 1: Clonar o Repositório
```bash
git clone https://github.com/mobilecosta/finance-app.git
cd finance-app
```

### Passo 2: Instalar Dependências
```bash
# Usando pnpm (recomendado)
pnpm install

# Ou usando npm
npm install
```

### Passo 3: Configurar Variáveis de Ambiente
```bash
# Copie o arquivo de exemplo
cp .env.example .env

# Edite o arquivo .env com suas credenciais do Supabase
# EXPO_PUBLIC_SUPABASE_URL=sua_url_aqui
# EXPO_PUBLIC_SUPABASE_ANON_KEY=sua_chave_aqui
```

### Passo 4: Iniciar o Servidor de Desenvolvimento
```bash
# Usando pnpm
pnpm dev

# Ou usando npm
npm run dev
```

### Passo 5: Abrir o App
- **Web**: Acesse `http://localhost:8081` no navegador
- **iOS**: Escaneie o código QR com a câmera do iPhone (Expo Go instalado)
- **Android**: Escaneie o código QR com o Expo Go

---

## 🚀 Build e Deploy

### Gerar APK para Android

#### Opção 1: Usar Manus Publish (Recomendado)
```bash
# 1. Clique no botão "Publish" na interface do Manus
# 2. Aguarde 5-15 minutos para a compilação
# 3. Clique em "Download APK"
# 4. Instale no seu dispositivo
```

#### Opção 2: Usar EAS Build Cloud
```bash
# 1. Instale o EAS CLI
npm install -g eas-cli

# 2. Faça login
eas login

# 3. Configure o projeto
eas build:configure

# 4. Inicie o build
eas build --platform android --profile preview

# 5. Aguarde o email com o link de download
```

#### Opção 3: Build Local
```bash
# Requer Android SDK, Java e Gradle instalados
eas build --platform android --local --output=./app.apk
```

### Instalar APK em Dispositivo
```bash
# Via ADB (Android Debug Bridge)
adb install app-release.apk

# Ou transferir manualmente para o dispositivo
```

---

## 📁 Estrutura do Projeto

```
finance-app/
├── app/                              # Telas e roteamento
│   ├── (tabs)/                       # Layout com abas
│   │   ├── index.tsx                 # Dashboard
│   │   ├── accounts.tsx              # Gerenciamento de contas
│   │   ├── natures.tsx               # Categorias
│   │   ├── movements.tsx             # Movimentos financeiros
│   │   ├── reports.tsx               # Relatórios (futuro)
│   │   ├── accounts/
│   │   │   ├── create.tsx            # Criar conta
│   │   │   ├── edit.tsx              # Editar conta
│   │   │   └── detail.tsx            # Detalhes da conta
│   │   └── _layout.tsx               # Layout das abas
│   ├── auth/
│   │   └── login.tsx                 # Tela de login
│   ├── _layout.tsx                   # Layout raiz com providers
│   └── oauth/
│       └── callback.tsx              # Callback OAuth
├── lib/                              # Utilitários e contextos
│   ├── contexts/                     # Contextos globais
│   │   ├── AccountContext.tsx        # Estado de contas
│   │   ├── NatureContext.tsx         # Estado de categorias
│   │   └── MovementContext.tsx       # Estado de movimentos
│   ├── _core/                        # Configurações principais
│   │   ├── theme.ts                  # Tema e cores
│   │   ├── auth.ts                   # Autenticação
│   │   └── api.ts                    # Cliente API
│   ├── theme-provider.tsx            # Provider de tema
│   ├── trpc.ts                       # Cliente tRPC
│   └── utils.ts                      # Funções utilitárias
├── components/                       # Componentes reutilizáveis
│   ├── screen-container.tsx          # Wrapper de tela com SafeArea
│   ├── charts/                       # Componentes de gráficos
│   │   ├── PieChart.tsx              # Gráfico de pizza
│   │   └── StatCard.tsx              # Card de estatísticas
│   ├── bootstrap/                    # Componentes Bootstrap
│   └── ui/                           # Componentes UI
├── server/                           # Backend (tRPC + Express)
│   ├── _core/                        # Configurações principais
│   │   ├── index.ts                  # Servidor principal
│   │   ├── trpc.ts                   # Router tRPC
│   │   └── context.ts                # Contexto tRPC
│   ├── routers.ts                    # Routers da API
│   └── db.ts                         # Conexão com banco
├── shared/                           # Código compartilhado
│   ├── types.ts                      # Tipos TypeScript
│   └── const.ts                      # Constantes
├── drizzle/                          # Migrações do banco
├── theme.config.js                   # Configuração de cores
├── app.config.ts                     # Configuração do Expo
├── tailwind.config.js                # Configuração do Tailwind
├── eas.json                          # Configuração do EAS Build
├── package.json                      # Dependências
└── README.md                         # Este arquivo
```

---

## 🎨 Design e UX

### Filosofia de Design
O aplicativo segue rigorosamente as **Apple Human Interface Guidelines (HIG)** para garantir uma experiência nativa, intuitiva e consistente com o ecossistema iOS.

### Características de Design
- **Orientação**: Portrait (9:16) otimizado para uso com uma mão
- **Tema**: Suporte automático a modo claro e escuro
- **Tipografia**: Hierarquia clara com tamanhos e pesos variados
- **Espaçamento**: Consistente com 16px de padding padrão
- **Interações**: Feedback visual imediato em todas as ações

### Paleta de Cores
```
Primária:      #0a7ea4 (Azul)
Fundo:         #ffffff (claro) / #151718 (escuro)
Superfície:    #f5f5f5 (claro) / #1e2022 (escuro)
Texto:         #11181C (claro) / #ECEDEE (escuro)
Receita:       #10B981 (Verde)
Despesa:       #EF4444 (Vermelho)
Investimento:  #F59E0B (Amarelo)
```

---

## 💾 Persistência de Dados

### Arquitetura de Dados
O projeto suporta dois níveis de persistência:

#### 1. **AsyncStorage (Local)**
- Armazenamento rápido no dispositivo
- Sem necessidade de internet
- Ideal para uso offline
- Dados persistem entre sessões

#### 2. **Supabase (Nuvem)**
- Sincronização em tempo real
- Backup automático
- Acesso multi-dispositivo
- Segurança com Row Level Security (RLS)

### Estrutura do Banco de Dados

#### Tabela: `profiles`
```sql
- id (UUID, PK)
- user_id (UUID, FK → auth.users)
- full_name (TEXT)
- avatar_url (TEXT)
- created_at (TIMESTAMP)
- updated_at (TIMESTAMP)
```

#### Tabela: `accounts`
```sql
- id (UUID, PK)
- user_id (UUID, FK)
- nome (TEXT)
- tipo (ENUM: corrente, poupança, investimento)
- saldo_inicial (DECIMAL)
- saldo_atual (DECIMAL)
- created_at (TIMESTAMP)
- updated_at (TIMESTAMP)
```

#### Tabela: `natures`
```sql
- id (UUID, PK)
- user_id (UUID, FK)
- nome (TEXT)
- tipo (ENUM: receita, despesa)
- cor (TEXT)
- icone (TEXT)
- created_at (TIMESTAMP)
- updated_at (TIMESTAMP)
```

#### Tabela: `movements`
```sql
- id (UUID, PK)
- user_id (UUID, FK)
- account_id (UUID, FK → accounts)
- nature_id (UUID, FK → natures)
- data (DATE)
- descricao (TEXT)
- valor (DECIMAL)
- tipo (ENUM: receita, despesa)
- created_at (TIMESTAMP)
- updated_at (TIMESTAMP)
```

### Modelos TypeScript

```typescript
// Conta
interface Account {
  id: string;
  nome: string;
  tipo: "corrente" | "poupança" | "investimento";
  saldoInicial: number;
  saldoAtual: number;
  dataCriacao: string;
}

// Natureza (Categoria)
interface Nature {
  id: string;
  nome: string;
  tipo: "receita" | "despesa";
  cor: string;
  icone: string;
  dataCriacao: string;
}

// Movimento
interface Movement {
  id: string;
  data: string;
  descricao: string;
  naturezaId: string;
  contaId: string;
  valor: number;
  tipo: "receita" | "despesa";
  dataCriacao: string;
  dataAtualizacao: string;
}
```

---

## 🔄 Fluxo de Dados

```
┌─────────────────────────────────────────────────┐
│           Telas (React Components)              │
└────────────────┬────────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────────┐
│        Contextos Globais (Context API)          │
│  - AccountContext                               │
│  - NatureContext                                │
│  - MovementContext                              │
└────────────────┬────────────────────────────────┘
                 │
        ┌────────┴────────┐
        ▼                 ▼
┌──────────────────┐  ┌──────────────────┐
│  AsyncStorage    │  │  Supabase API    │
│  (Local)         │  │  (Cloud)         │
└──────────────────┘  └──────────────────┘
```

---

## 📱 Telas Principais

### 1. Dashboard
- Visão geral das finanças
- Saldo total consolidado
- Estatísticas do mês (receitas, despesas, saldo)
- Gráfico de distribuição por tipo de conta
- Preview de contas
- Ações rápidas

### 2. Contas
- Lista de todas as contas
- Criar nova conta
- Editar conta existente
- Deletar conta
- Visualizar detalhes e histórico

### 3. Naturezas (Categorias)
- Lista de categorias
- Criar nova categoria
- Editar categoria
- Deletar categoria
- Categorias pré-configuradas

### 4. Movimentos
- Lista de todas as transações
- Criar novo movimento
- Editar movimento
- Deletar movimento
- Filtros por período, categoria e conta

### 5. Relatórios (Futuro)
- Gráficos de receitas vs despesas
- Análise por categoria
- Exportação de dados

---

## 🧪 Testes

### Executar Testes
```bash
# Testes unitários
pnpm test

# Testes com coverage
pnpm test:coverage

# Modo watch
pnpm test:watch
```

### Estrutura de Testes
```
tests/
├── auth.logout.test.ts
└── ...
```

---

## 🚧 Roadmap Futuro

### Curto Prazo (v1.1)
- [ ] Gráficos avançados (pizza, barras, linhas)
- [ ] Filtros por período e categoria
- [ ] Busca de movimentos
- [ ] Exportação em PDF/CSV
- [ ] Notificações de despesas

### Médio Prazo (v1.2)
- [ ] Metas financeiras
- [ ] Orçamentos por categoria
- [ ] Alertas de limite de gastos
- [ ] Sincronização com bancos (API)
- [ ] Recorrência de movimentos

### Longo Prazo (v2.0)
- [ ] Investimentos e análise de rentabilidade
- [ ] Planejamento financeiro
- [ ] Integração com serviços de pagamento
- [ ] App para iOS (App Store)
- [ ] Versão web completa

---

## 🐛 Troubleshooting

### Problema: Dados não aparecem após reiniciar
**Solução**: Os dados são salvos em AsyncStorage. Verifique se o dispositivo tem espaço disponível.
```bash
# Limpe o cache do Expo
expo start --clear
```

### Problema: Erro ao adicionar movimento
**Solução**: Certifique-se de que tem uma conta e uma natureza cadastradas antes de criar movimentos.

### Problema: App não inicia
**Solução**: Reinstale as dependências e limpe o cache.
```bash
pnpm install
expo start --clear
```

### Problema: Erro de conexão com Supabase
**Solução**: Verifique as variáveis de ambiente no arquivo `.env`.
```bash
# Certifique-se de que as chaves estão corretas
cat .env
```

### Problema: APK não instala no dispositivo
**Solução**: 
1. Ative "Instalar de fontes desconhecidas" em Configurações → Segurança
2. Desinstale versões anteriores: `adb uninstall com.app.financeapp`
3. Tente instalar novamente

---

## 📝 Contribuindo

Contribuições são bem-vindas! Para contribuir:

1. Faça um fork do repositório
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

---

## 📄 Licença

Este projeto é privado e propriedade de **mobilecosta**. Todos os direitos reservados.

---

## 👨‍💻 Autor

Desenvolvido com ❤️ usando React Native, Expo e TypeScript.

**Desenvolvedor**: mobilecosta  
**GitHub**: https://github.com/mobilecosta  
**Repositório**: https://github.com/mobilecosta/finance-app

---

## 📞 Suporte e Contato

Para dúvidas, sugestões ou problemas:

1. **Abra uma Issue** no repositório GitHub
2. **Consulte a documentação** em `GERAR_APK.md`
3. **Verifique o Troubleshooting** acima

---

## 🙏 Agradecimentos

- [Expo](https://expo.dev) - Plataforma de desenvolvimento
- [React Native](https://reactnative.dev) - Framework mobile
- [Supabase](https://supabase.com) - Backend e banco de dados
- [NativeWind](https://www.nativewind.dev) - Tailwind para React Native
- [Apple HIG](https://developer.apple.com/design/human-interface-guidelines) - Diretrizes de design

---

**Versão**: 1.0.0  
**Última atualização**: Julho 2026  
**Status**: ✅ Pronto para Produção  
**Mantido por**: mobilecosta
