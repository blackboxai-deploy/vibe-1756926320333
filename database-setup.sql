-- =====================================================
-- SETUP DO BANCO DE DADOS SUPABASE
-- =====================================================
-- Execute estes comandos no SQL Editor do Supabase

-- 1. Criar extensões necessárias
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Tabela de Vagas
CREATE TABLE IF NOT EXISTS vagas (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  titulo VARCHAR(255) NOT NULL,
  descricao TEXT NOT NULL,
  requisitos TEXT NOT NULL,
  responsabilidades TEXT,
  status VARCHAR(20) DEFAULT 'ativa' CHECK (status IN ('ativa', 'inativa')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 3. Tabela de Candidatos  
CREATE TABLE IF NOT EXISTS candidatos (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  nome VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  linkedin_url VARCHAR(500) NOT NULL,
  descricao TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 4. Tabela de Análises
CREATE TABLE IF NOT EXISTS analises (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  vaga_id UUID REFERENCES vagas(id) ON DELETE CASCADE,
  candidato_id UUID REFERENCES candidatos(id) ON DELETE CASCADE,
  score INTEGER NOT NULL CHECK (score >= 0 AND score <= 100),
  resultado VARCHAR(10) NOT NULL CHECK (resultado IN ('APTO', 'NÃO APTO')),
  relatorio_detalhado TEXT NOT NULL,
  linkedin_data JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 5. Índices para performance
CREATE INDEX IF NOT EXISTS idx_vagas_status ON vagas(status);
CREATE INDEX IF NOT EXISTS idx_vagas_created_at ON vagas(created_at);
CREATE INDEX IF NOT EXISTS idx_candidatos_email ON candidatos(email);
CREATE INDEX IF NOT EXISTS idx_candidatos_created_at ON candidatos(created_at);
CREATE INDEX IF NOT EXISTS idx_analises_vaga_id ON analises(vaga_id);
CREATE INDEX IF NOT EXISTS idx_analises_candidato_id ON analises(candidato_id);
CREATE INDEX IF NOT EXISTS idx_analises_resultado ON analises(resultado);
CREATE INDEX IF NOT EXISTS idx_analises_score ON analises(score);
CREATE INDEX IF NOT EXISTS idx_analises_created_at ON analises(created_at);

-- 6. Function para atualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = TIMEZONE('utc'::text, NOW());
    RETURN NEW;
END;
$$ LANGUAGE 'plpgsql';

-- 7. Triggers para updated_at
CREATE TRIGGER update_vagas_updated_at BEFORE UPDATE ON vagas
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_candidatos_updated_at BEFORE UPDATE ON candidatos
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 8. Configuração de RLS (Row Level Security)
ALTER TABLE vagas ENABLE ROW LEVEL SECURITY;
ALTER TABLE candidatos ENABLE ROW LEVEL SECURITY;
ALTER TABLE analises ENABLE ROW LEVEL SECURITY;

-- 9. Políticas de acesso (permite acesso público para este demo)
-- NOTA: Em produção, configure políticas mais restritivas baseadas em autenticação
CREATE POLICY "Allow all operations on vagas" ON vagas FOR ALL USING (true);
CREATE POLICY "Allow all operations on candidatos" ON candidatos FOR ALL USING (true);
CREATE POLICY "Allow all operations on analises" ON analises FOR ALL USING (true);

-- 10. Dados de exemplo para demonstração
INSERT INTO vagas (titulo, descricao, requisitos, responsabilidades) VALUES 
(
  'Desenvolvedor Full Stack Sênior',
  'Vaga para desenvolvedor experiente em uma startup de tecnologia em crescimento. Trabalhamos com metodologias ágeis, ambiente descontraído e foco em inovação. Oferecemos home office flexível, plano de saúde e participação nos lucros.',
  'Mínimo 5 anos de experiência em desenvolvimento web. Conhecimento sólido em React, Node.js, TypeScript e PostgreSQL. Experiência com AWS ou similar. Conhecimento em metodologias ágeis. Inglês intermediário.',
  'Desenvolver e manter aplicações web complexas. Participar do design de arquitetura de software. Mentoria de desenvolvedores júnior. Participação em reuniões de planejamento e retrospectivas.'
),
(
  'Designer UX/UI Pleno', 
  'Buscamos um designer criativo para integrar nosso time de produto. Empresa com foco em experiência do usuário e design centrado no humano. Ambiente colaborativo com designers, desenvolvedores e product managers.',
  'Experiência mínima de 3 anos em UX/UI. Proficiência em Figma, Adobe XD ou Sketch. Conhecimento em prototipagem e testes de usabilidade. Portfolio com casos de sucesso. Conhecimento básico de HTML/CSS é um diferencial.',
  'Criar wireframes, protótipos e interfaces de alta fidelidade. Conduzir pesquisas com usuários. Colaborar com equipes de desenvolvimento na implementação. Manter e evoluir o design system da empresa.'
);

INSERT INTO candidatos (nome, email, linkedin_url, descricao) VALUES 
(
  'Ana Silva Costa',
  'ana.silva@email.com',
  'https://linkedin.com/in/ana-silva-dev',
  'Desenvolvedora Full Stack com 6 anos de experiência. Especialista em React e Node.js. Trabalhei em startups e grandes empresas, sempre focada em código limpo e boas práticas. Apaixonada por tecnologia e sempre buscando novos desafios.'
),
(
  'Carlos Mendes',
  'carlos.mendes@email.com', 
  'https://linkedin.com/in/carlos-mendes-designer',
  'Designer UX/UI com forte background em pesquisa de usuário. 4 anos de experiência em produtos digitais. Focado em criar experiências intuitivas e impactantes. Experiência com metodologias de Design Thinking e prototipagem rápida.'
);

-- 11. Verificar se tudo foi criado corretamente
SELECT 'Tabelas criadas com sucesso!' as status;
SELECT COUNT(*) as total_vagas FROM vagas;
SELECT COUNT(*) as total_candidatos FROM candidatos;
SELECT COUNT(*) as total_analises FROM analises;