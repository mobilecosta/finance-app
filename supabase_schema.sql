-- Habilitar a extensão para UUIDs se necessário
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Tabela de Usuários (Integrada com Supabase Auth)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  name TEXT,
  email TEXT,
  role TEXT DEFAULT 'user' CHECK (role IN ('user', 'admin')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de Contas
CREATE TABLE IF NOT EXISTS public.accounts (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL,
  nome TEXT NOT NULL,
  tipo TEXT NOT NULL CHECK (tipo IN ('corrente', 'poupança', 'investimento')),
  saldo_inicial NUMERIC(15, 2) DEFAULT 0,
  saldo_atual NUMERIC(15, 2) DEFAULT 0,
  data_criacao TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de Naturezas (Categorias)
CREATE TABLE IF NOT EXISTS public.natures (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL,
  nome TEXT NOT NULL,
  tipo TEXT NOT NULL CHECK (tipo IN ('receita', 'despesa')),
  cor TEXT,
  icone TEXT,
  data_criacao TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de Movimentos Financeiros
CREATE TABLE IF NOT EXISTS public.movements (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL,
  data TIMESTAMP WITH TIME ZONE NOT NULL,
  descricao TEXT,
  natureza_id UUID REFERENCES public.natures ON DELETE SET NULL,
  conta_id UUID REFERENCES public.accounts ON DELETE CASCADE,
  valor NUMERIC(15, 2) NOT NULL,
  tipo TEXT NOT NULL CHECK (tipo IN ('receita', 'despesa')),
  data_criacao TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  data_atualizacao TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Habilitar Row Level Security (RLS)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.natures ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.movements ENABLE ROW LEVEL SECURITY;

-- Políticas de Acesso (O usuário só vê seus próprios dados)
CREATE POLICY "Users can view own profile" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can manage own accounts" ON public.accounts FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own natures" ON public.natures FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own movements" ON public.movements FOR ALL USING (auth.uid() = user_id);

-- Inserir Naturezas Padrão para novos usuários (Opcional via Trigger ou manualmente)
-- Aqui estão os comandos para você rodar manualmente se quiser popular inicialmente:
/*
INSERT INTO public.natures (user_id, nome, tipo, cor, icone) VALUES 
('ID_DO_USUARIO', 'Salário', 'receita', '#10B981', '💰'),
('ID_DO_USUARIO', 'Freelance', 'receita', '#10B981', '💼'),
('ID_DO_USUARIO', 'Alimentação', 'despesa', '#EF4444', '🍔'),
('ID_DO_USUARIO', 'Transporte', 'despesa', '#EF4444', '🚗'),
('ID_DO_USUARIO', 'Saúde', 'despesa', '#EF4444', '🏥');
*/
