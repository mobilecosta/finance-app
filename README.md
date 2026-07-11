# 💰 Controle Financeiro

Um aplicativo mobile moderno e intuitivo para gerenciar suas finanças pessoais. Registre contas, categorize despesas e receitas, e acompanhe seus gastos em tempo real.

## ✨ Funcionalidades

### 📊 Dashboard
- **Saldo Total Consolidado**: Visualize o saldo total de todas as suas contas em um único lugar
- **Cards por Conta**: Acompanhe o saldo de cada conta (corrente, poupança, investimento)
- **Resumo Mensal**: Veja o total de receitas e despesas do mês atual
- **Últimos Movimentos**: Acesso rápido aos últimos lançamentos registrados

### 🏦 Gerenciamento de Contas
- **Criar Contas**: Cadastre contas bancárias com saldo inicial
- **Editar Contas**: Atualize informações de contas existentes
- **Deletar Contas**: Remova contas que não usa mais
- **Tipos Suportados**: Corrente, Poupança, Investimento

### 🏷️ Categorias (Naturezas)
- **Receitas Pré-configuradas**: Salário, Freelance
- **Despesas Pré-configuradas**: Alimentação, Transporte, Saúde
- **Personalização**: Crie suas próprias categorias com cores e ícones
- **Organização**: Separe receitas de despesas automaticamente

### 💳 Movimentos Financeiros
- **Registrar Lançamentos**: Adicione receitas e despesas com data, descrição e valor
- **Editar Movimentos**: Corrija lançamentos já registrados
- **Deletar Movimentos**: Remova movimentos incorretos
- **Listagem Ordenada**: Visualize movimentos ordenados por data (mais recentes primeiro)
- **Detalhes Completos**: Veja natureza, conta e valor de cada movimento

## 🛠️ Tecnologias

| Tecnologia | Versão | Descrição |
|-----------|--------|-----------|
| **React Native** | 0.81.5 | Framework para desenvolvimento mobile |
| **Expo** | 54 | Plataforma para build e deploy |
| **TypeScript** | 5.9 | Linguagem tipada para JavaScript |
| **React 19** | 19.1.0 | Biblioteca UI |
| **NativeWind** | 4.2 | Tailwind CSS para React Native |
| **AsyncStorage** | 2.2 | Persistência de dados local |
| **Expo Router** | 6 | Navegação e roteamento |

## 📦 Instalação

### Pré-requisitos
- Node.js 18+ instalado
- npm ou pnpm como gerenciador de pacotes
- Expo CLI: `npm install -g expo-cli`

### Passos

1. **Clone o repositório**
```bash
git clone https://github.com/mobilecosta/finance-app.git
cd finance-app
```

2. **Instale as dependências**
```bash
pnpm install
# ou
npm install
```

3. **Inicie o servidor de desenvolvimento**
```bash
pnpm dev
# ou
npm run dev
```

4. **Abra o app**
- **Web**: Acesse `http://localhost:8081` no navegador
- **iOS**: Escaneie o código QR com a câmera do iPhone (Expo Go instalado)
- **Android**: Escaneie o código QR com o Expo Go

## 🚀 Build e Deploy

### Gerar APK para Android

1. **Prepare o build**
```bash
eas build --platform android
```

2. **Ou use o Manus Publish**
- Clique no botão "Publish" na interface do Manus
- O sistema compilará e gerará o APK automaticamente

### Instalar APK em dispositivo
```bash
adb install app-release.apk
```

## 📁 Estrutura do Projeto

```
finance-app/
├── app/
│   ├── (tabs)/
│   │   ├── index.tsx           # Dashboard
│   │   ├── accounts.tsx        # Gerenciamento de contas
│   │   ├── natures.tsx         # Categorias
│   │   ├── movements.tsx       # Movimentos financeiros
│   │   └── _layout.tsx         # Layout das abas
│   ├── _layout.tsx             # Layout raiz com providers
│   └── oauth/
├── lib/
│   ├── contexts/
│   │   ├── AccountContext.tsx  # Contexto de contas
│   │   ├── NatureContext.tsx   # Contexto de categorias
│   │   └── MovementContext.tsx # Contexto de movimentos
│   └── ...
├── components/
│   ├── screen-container.tsx    # Wrapper de tela com SafeArea
│   └── ...
├── theme.config.js             # Configuração de cores
├── app.config.ts               # Configuração do Expo
└── package.json
```

## 🎨 Design

O aplicativo segue as **Apple Human Interface Guidelines (HIG)** para garantir uma experiência nativa e intuitiva:

- **Orientação**: Portrait (9:16)
- **Uso**: Otimizado para uma mão
- **Tema**: Suporte a modo claro e escuro
- **Cores Principais**:
  - Primária: `#0a7ea4` (Azul)
  - Receita: `#10B981` (Verde)
  - Despesa: `#EF4444` (Vermelho)

## 💾 Persistência de Dados

Os dados são armazenados localmente no dispositivo usando **AsyncStorage**:

- **Contas**: Salvas com ID único, nome, tipo e saldo
- **Naturezas**: Armazenadas com cor, ícone e tipo
- **Movimentos**: Persistidos com data, descrição, valor e referências

### Estrutura de Dados

**Conta**
```typescript
{
  id: string;
  nome: string;
  tipo: "corrente" | "poupança" | "investimento";
  saldoInicial: number;
  saldoAtual: number;
  dataCriacao: string;
}
```

**Natureza**
```typescript
{
  id: string;
  nome: string;
  tipo: "receita" | "despesa";
  cor: string;
  icone: string;
  dataCriacao: string;
}
```

**Movimento**
```typescript
{
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

## 🔄 Fluxo de Dados

1. **Contextos Globais**: Gerenciam estado com React Context API
2. **AsyncStorage**: Persiste dados no dispositivo
3. **Hooks Customizados**: `useAccounts()`, `useNatures()`, `useMovements()`
4. **Telas**: Consomem dados dos contextos e atualizam em tempo real

## 📱 Telas Principais

### Dashboard
Visão geral das finanças com saldo total, resumo mensal e últimos movimentos.

### Contas
Lista de contas com opções para adicionar, editar e deletar. Cada conta mostra seu saldo atual.

### Naturezas
Categorias de receita e despesa com cores e ícones personalizáveis. Inclui categorias padrão pré-configuradas.

### Movimentos
Registro completo de todas as transações financeiras com filtros e busca por data.

## 🚧 Roadmap Futuro

- [ ] Gráficos de receitas vs despesas
- [ ] Filtros avançados por período e categoria
- [ ] Exportação de relatórios (PDF/CSV)
- [ ] Sincronização com servidor
- [ ] Autenticação de usuário
- [ ] Backup automático na nuvem
- [ ] Notificações de despesas
- [ ] Metas financeiras

## 🐛 Troubleshooting

### Problema: Dados não aparecem após reiniciar
**Solução**: Os dados são salvos em AsyncStorage. Verifique se o dispositivo tem espaço disponível.

### Problema: Erro ao adicionar movimento
**Solução**: Certifique-se de que tem uma conta e uma natureza cadastradas antes de criar movimentos.

### Problema: App não inicia
**Solução**: Execute `pnpm install` novamente e limpe o cache com `expo start --clear`.

## 📝 Licença

Este projeto é privado e propriedade de mobilecosta.

## 👨‍💻 Autor

Desenvolvido com ❤️ usando React Native e Expo.

## 📞 Suporte

Para dúvidas ou problemas, abra uma issue no repositório GitHub.

---

**Versão**: 1.0.0  
**Última atualização**: Julho 2026  
**Status**: ✅ Pronto para produção
