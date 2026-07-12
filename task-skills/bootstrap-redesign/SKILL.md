# Task Skill: Redesign finance app com Bootstrap

## Objective
Migrar a estilização do aplicativo de controle financeiro de NativeWind/Tailwind-first para `react-native-bootstrap-styles` (Bootstrap 5 para React Native), mantendo NativeWind coexistindo. Redesenhar a interface das 5 abas principais (Início, Movimentos, Categorias, Contas, Relatórios) e das telas auxiliares (login, callback) para uma experiência mais polished e consistente.

## Constraints
- Manter NativeWind instalado e funcional; não remover tailwind.config.js nem global.css.
- Não alterar lógica de negócio, contextos, hooks de dados, auth nem Supabase.
- Preservar identidade visual: primário `#0a7ea4`, receita `#10B981`, despesa `#EF4444`.
- Manter responsividade mobile-first, portrait.
- `pnpm check` e `pnpm test` devem continuar passando.

## Steps

### Step 1: Setup da biblioteca Bootstrap
> ACCEPT: `react-native-bootstrap-styles` instalado via pnpm; arquivo de tema Bootstrap criado em `lib/bootstrap-theme.ts` (ou `.js`) com as cores primária, success, danger, warning, info, light, dark mapeadas; helper `useBootstrapStyles()` criado e importável; app continua compilando (`pnpm check` passa).

### Step 2: Componentes base Bootstrap
> ACCEPT: Pelo menos estes componentes reutilizáveis criados em `components/bootstrap/`:
- `BButton.tsx` (variantes: primary, success, danger, warning, outline, link; tamanhos sm/lg; ícone opcional)
- `BCard.tsx` (header, body, footer, shadow, border)
- `BBadge.tsx` (variantes)
- `BFormGroup.tsx` (label + input)
- `BModal.tsx` (header, body, footer, abre/fecha)
- `BListGroup.tsx` / `BListGroupItem.tsx`
- `BContainer.tsx`, `BRow.tsx`, `BCol.tsx` (simplificados para RN)
- `BAlert.tsx`
> Cada um usa `react-native-bootstrap-styles` como fonte primária e pode combinar classes NativeWind quando necessário.

### Step 3: Refatorar tela de login
> ACCEPT: `app/auth/login.tsx` usa componentes Bootstrap, mantém fluxo de auth Supabase, visual refinado com card centralizado, logo, botões de login social se houver, e estados de loading/erro.

### Step 4: Refatorar layout de abas
> ACCEPT: `app/(tabs)/_layout.tsx` estilizado com Bootstrap (tab bar customizada ou sobreposta) sem quebrar navegação; ícones mantidos; estados ativo/inativo usam tema Bootstrap.

### Step 5: Refatorar Dashboard (Início)
> ACCEPT: `app/(tabs)/index.tsx` usa cards, badges, grid e gráfico mantido; texto e valores formatados; layout responsivo; melhor hierarquia visual.

### Step 6: Refatorar Movimentos
> ACCEPT: `app/(tabs)/movements.tsx` usa list group, badges, botões Bootstrap, modal Bootstrap, formulário Bootstrap; filtros visuais por tipo/receita/despesa mantidos ou adicionados (botões toggle); loading e empty states refinados.

### Step 7: Refatorar Contas
> ACCEPT: `app/(tabs)/accounts.tsx` usa cards/list group, badges de tipo, modal/form Bootstrap; saldo em destaque.

### Step 8: Refatorar Naturezas
> ACCEPT: `app/(tabs)/natures.tsx` usa cards/list group com cor/ícone, modal/form Bootstrap, seleção de cor e ícone melhorada.

### Step 9: Refatorar Relatórios
> ACCEPT: `app/(tabs)/reports.tsx` usa cards, tabela estilizada com Bootstrap, resumo consolidado, detalhamento por conta, histórico de movimentos.

### Step 10: Telas auxiliares e polimento
> ACCEPT: `app/oauth/callback.tsx` e `app/dev/theme-lab.tsx` (se existir) ajustados para Bootstrap; verificação de contraste, espaçamentos, safe areas e dark mode.

### Step 11: Verificação final
> ACCEPT: `pnpm check` passa, `pnpm test` passa, app inicia em modo web (`pnpm dev:metro`) sem crash visual nas 5 abas; screenshots/prints das telas principais anexados na resposta.

## Verification
- Run `pnpm check` and `pnpm test` before marking done.
- Open `http://localhost:8081` (web) to visually inspect all tabs.
- Confirm Bootstrap components render and NativeWind still works where used.

## Report
On completion, summarize:
- What Bootstrap theme/settings were created.
- Which components were added.
- Which screens were redesigned.
- Any limitations or follow-ups.
- Provide paths to key files.
