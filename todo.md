# Project TODO - Controle Financeiro

## Fase 1: Estrutura Base e Design
- [x] Gerar logo/ícone do aplicativo
- [x] Atualizar cores do tema (theme.config.js)
- [x] Configurar app.config.ts com nome e branding
- [x] Criar estrutura de navegação com 4 abas

## Fase 2: Módulo de Contas
- [x] Criar contexto de Contas com AsyncStorage
- [x] Implementar tela de listagem de contas
- [x] Implementar formulário de cadastro de conta
- [x] Implementar edição de conta
- [x] Implementar exclusão de conta
- [x] Implementar cálculo de saldo atual

## Fase 3: Módulo de Naturezas
- [x] Criar contexto de Naturezas com AsyncStorage
- [x] Implementar tela de listagem de naturezas
- [x] Implementar formulário de cadastro de natureza
- [x] Implementar edição de natureza
- [x] Implementar exclusão de natureza
- [x] Separar por tipo (receita/despesa)
- [x] Criar naturezas padrão

## Fase 4: Módulo de Movimentos Financeiros
- [x] Criar contexto de Movimentos com AsyncStorage
- [x] Implementar tela de listagem de movimentos
- [x] Implementar formulário de cadastro de movimento
- [x] Implementar edição de movimento
- [x] Implementar exclusão de movimento
- [ ] Implementar filtros (data, natureza, conta, tipo)
- [ ] Implementar atualização de saldos das contas

## Fase 5: Dashboard e Resumos
- [x] Implementar tela de Dashboard
- [x] Exibir saldo total consolidado
- [x] Exibir cards com saldo por conta
- [x] Exibir resumo de receitas vs despesas do mês
- [ ] Implementar gráfico de distribuição por natureza
- [x] Botão flutuante para novo movimento

## Fase 6: Persistência e Sincronização
- [x] Configurar AsyncStorage para dados locais
- [ ] Implementar sincronização com banco de dados
- [ ] Implementar backup/restauração de dados

## Fase 7: Testes e Polimento
- [ ] Testar todos os fluxos de usuário
- [ ] Validar cálculos de saldo
- [ ] Testar filtros e buscas
- [ ] Polir UI/UX
- [ ] Testar em diferentes tamanhos de tela

## Fase 8: Geração do APK
- [ ] Preparar configurações de build
- [ ] Gerar APK para Android
- [ ] Testar APK em dispositivo real
- [ ] Entregar APK ao usuário
