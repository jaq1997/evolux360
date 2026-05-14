# Evolux360

Evolux360 é um sistema de gestão completo (ERP/CRM) projetado para centralizar canais de venda, simplificar processos e gerenciar estoque, vendas e financeiro em uma única plataforma.

## Funcionalidades

- **Dashboard Inteligente**: Visualização de KPIs como Receita Total, Ticket Médio e volume de pedidos.
- **Kanban de Vendas**: Controle de fluxo de pedidos com drag-and-drop.
- **CRM Integrado**: Gestão de clientes com histórico de compras e análise de inatividade.
- **Controle de Estoque**: Gestão de SKUs, fornecedores e alertas de estoque baixo.
- **Módulo Financeiro**: Fluxo de caixa, categorização de transações e relatórios.
- **Integração Supabase**: Backend as a Service para autenticação, banco de dados e storage.

## Tecnologias Utilizadas

- **Frontend**: React, TypeScript, Vite, Tailwind CSS.
- **UI Components**: Shadcn UI, Lucide React.
- **Backend/Banco de Dados**: Supabase (PostgreSQL, Auth, Storage).
- **Gráficos**: Recharts.
- **Formulários**: React Hook Form + Zod.

## Como Iniciar

1. Clone o repositório.
2. Instale as dependências: `npm install`.
3. Configure as variáveis de ambiente no arquivo `.env` (URL e Key do Supabase).
4. Execute o servidor de desenvolvimento: `npm run dev`.

## Estrutura do Banco de Dados

As migrações do banco de dados estão localizadas em `/supabase/migrations`. O sistema utiliza triggers para automação de estoque e políticas de RLS para segurança.
