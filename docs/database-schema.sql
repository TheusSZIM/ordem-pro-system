-- ===================================
-- ORDEM PRO SYSTEM - DATABASE SCHEMA
-- ===================================
-- Execute este script no SQL Editor do Supabase

-- Habilitar extensões necessárias
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Tabela de Usuários
CREATE TABLE IF NOT EXISTS users (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    role VARCHAR(50) DEFAULT 'operator',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de Operadores/Separadores
CREATE TABLE IF NOT EXISTS operators (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    active BOOLEAN DEFAULT true,
    total_orders INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de Ordens
CREATE TABLE IF NOT EXISTS orders (
    id VARCHAR(100) PRIMARY KEY,
    client VARCHAR(255),
    product VARCHAR(255),
    quantity INTEGER DEFAULT 1,
    priority VARCHAR(20) DEFAULT 'medium',
    status VARCHAR(50) DEFAULT 'pending',
    notes TEXT,
    operator_id UUID REFERENCES operators(id),
    separador VARCHAR(255),
    inicio_separacao TIMESTAMP WITH TIME ZONE,
    fim_separacao TIMESTAMP WITH TIME ZONE,
    tempo_total VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de Configurações
CREATE TABLE IF NOT EXISTS settings (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    key VARCHAR(100) UNIQUE NOT NULL,
    value JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de Logs/Auditoria
CREATE TABLE IF NOT EXISTS audit_logs (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES users(id),
    action VARCHAR(100) NOT NULL,
    entity_type VARCHAR(100),
    entity_id VARCHAR(100),
    details JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices para melhor performance
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_orders_operator ON orders(operator_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_user ON audit_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_created_at ON audit_logs(created_at DESC);

-- Função para atualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers para atualizar updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_operators_updated_at BEFORE UPDATE ON operators
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON orders
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_settings_updated_at BEFORE UPDATE ON settings
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Inserir dados de exemplo para operadores
INSERT INTO operators (name) VALUES
    ('Marcos Vieira'),
    ('Ana Costa'),
    ('Rafael Souza'),
    ('Juliana Lima'),
    ('Carlos Mendes'),
    ('Patricia Alves')
ON CONFLICT DO NOTHING;

-- Inserir configurações padrão
INSERT INTO settings (key, value) VALUES
    ('system_name', '"Ordem Pro System"'),
    ('notifications_enabled', 'true'),
    ('auto_refresh_interval', '30000')
ON CONFLICT (key) DO NOTHING;

-- RLS (Row Level Security) - IMPORTANTE para segurança
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE operators ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- Políticas de acesso (ajuste conforme sua necessidade)
-- Por padrão, permite acesso público para leitura (desenvolvimento)
-- Em produção, você deve configurar políticas mais restritivas

CREATE POLICY "Enable read access for all users" ON orders
    FOR SELECT USING (true);

CREATE POLICY "Enable insert for all users" ON orders
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Enable update for all users" ON orders
    FOR UPDATE USING (true);

CREATE POLICY "Enable delete for all users" ON orders
    FOR DELETE USING (true);

-- Políticas similares para outras tabelas
CREATE POLICY "Enable read access for operators" ON operators
    FOR SELECT USING (true);

CREATE POLICY "Enable read access for settings" ON settings
    FOR SELECT USING (true);

-- Comentários nas tabelas
COMMENT ON TABLE orders IS 'Tabela principal de ordens de separação';
COMMENT ON TABLE operators IS 'Operadores/separadores cadastrados no sistema';
COMMENT ON TABLE users IS 'Usuários do sistema';
COMMENT ON TABLE settings IS 'Configurações do sistema';
COMMENT ON TABLE audit_logs IS 'Logs de auditoria para rastreamento';

-- View para estatísticas rápidas
CREATE OR REPLACE VIEW order_statistics AS
SELECT 
    COUNT(*) as total_orders,
    COUNT(*) FILTER (WHERE status = 'pending') as pending_orders,
    COUNT(*) FILTER (WHERE status = 'progress') as progress_orders,
    COUNT(*) FILTER (WHERE status = 'completed') as completed_orders,
    COUNT(*) FILTER (WHERE status = 'cancelled') as cancelled_orders,
    COUNT(*) FILTER (WHERE created_at >= NOW() - INTERVAL '24 hours') as orders_today,
    COUNT(*) FILTER (WHERE created_at >= NOW() - INTERVAL '7 days') as orders_week
FROM orders;

-- View para performance de operadores
CREATE OR REPLACE VIEW operator_performance AS
SELECT 
    o.id,
    o.name,
    COUNT(ord.id) as total_orders,
    COUNT(ord.id) FILTER (WHERE ord.status = 'completed') as completed_orders,
    AVG(EXTRACT(EPOCH FROM (ord.fim_separacao - ord.inicio_separacao))/60) as avg_time_minutes
FROM operators o
LEFT JOIN orders ord ON o.id = ord.operator_id
WHERE o.active = true
GROUP BY o.id, o.name;

COMMENT ON VIEW order_statistics IS 'Estatísticas agregadas de ordens';
COMMENT ON VIEW operator_performance IS 'Performance dos operadores';

-- Script executado com sucesso!
-- Próximos passos:
-- 1. Configure as credenciais no arquivo src/config/supabase.js
-- 2. Ajuste as políticas RLS conforme suas necessidades de segurança
-- 3. Teste a conexão com o frontend
