# Configuração MCP Supabase - Corrigida
## Nova Aliança

---

## ✅ Status: CORRIGIDO

O MCP Supabase estava conectado ao projeto errado. A configuração foi corrigida com sucesso.

---

## 🔍 Problema Identificado

### Antes da Correção

O MCP Supabase estava configurado para o projeto:
- **Project Ref**: `xrhdsghvgmxwupntgpqn`
- **URL**: `https://xrhdsghvgmxwupntgpqn.supabase.co`

Mas a aplicação estava usando:
- **Project Ref**: `lfznsbvruvjnugyzfyiw`
- **URL**: `https://lfznsbvruvjnugyzfyiw.supabase.co`

### Impacto

- Operações do MCP (migrations, queries) iam para o projeto errado
- Dados não sincronizados entre MCP e aplicação
- Confusão sobre qual banco estava sendo usado

---

## ✅ Solução Aplicada

### Arquivo Corrigido

**Localização**: `C:\Users\Vendas2\.kiro\settings\mcp.json`

```json
{
  "mcpServers": {
    "supabase": {
      "command": "npx",
      "args": [
        "-y",
        "@supabase/mcp-server-supabase",
        "--project-ref",
        "lfznsbvruvjnugyzfyiw"
      ],
      "env": {
        "SUPABASE_ACCESS_TOKEN": "sbp_13b52e1ea52902bb2279ecbaf73f5642d62412a2"
      },
      "disabled": false,
      "autoApprove": [
        "get_project_url",
        "list_migrations",
        "list_tables"
      ]
    }
  }
}
```

---

## 📊 Verificação Pós-Correção

### Projeto Conectado

✅ **URL**: `https://lfznsbvruvjnugyzfyiw.supabase.co`  
✅ **Project Ref**: `lfznsbvruvjnugyzfyiw`  
✅ **Status**: Conectado e funcionando

### Tabelas Disponíveis

| Tabela | RLS | Rows | Descrição |
|--------|-----|------|-----------|
| `profiles` | ✅ | 2 | Perfis de usuários |
| `clients` | ✅ | 2 | Dados de clientes |
| `leads` | ✅ | 0 | Leads do site |
| `requests` | ✅ | 0 | Solicitações de serviço |
| `jobs` | ✅ | 0 | Trabalhos executados |
| `job_items` | ✅ | 0 | Itens dos trabalhos |
| `gallery_items` | ✅ | 10 | Galeria de trabalhos |
| `security_audit_log` | ✅ | 0 | Logs de auditoria |

### Usuários Cadastrados

| Email | Nome | Role | Criado em |
|-------|------|------|-----------|
| qualitecinstrumentosdemedicao@gmail.com | Administrador Nova Aliança | **admin** | 26/02/2026 |
| vendas2@qualitec.ind.br | QUALITEC - INSTRUMENTOS DE MEDICAO | client | 24/02/2026 |

---

## 🎯 Configuração Completa

### Aplicação (.env)

```env
NUXT_PUBLIC_SUPABASE_URL=https://lfznsbvruvjnugyzfyiw.supabase.co
NUXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### MCP Supabase (Global)

```json
{
  "command": "npx",
  "args": ["-y", "@supabase/mcp-server-supabase", "--project-ref", "lfznsbvruvjnugyzfyiw"],
  "env": {
    "SUPABASE_ACCESS_TOKEN": "sbp_13b52e1ea52902bb2279ecbaf73f5642d62412a2"
  }
}
```

### Sincronização

✅ Ambos apontam para o mesmo projeto: `lfznsbvruvjnugyzfyiw`  
✅ MCP pode executar migrations no banco correto  
✅ Aplicação e MCP compartilham os mesmos dados

---

## 🔧 Comandos MCP Disponíveis

### Listar Tabelas
```typescript
await mcp_supabase_list_tables({ schemas: ["public"] })
```

### Executar SQL
```typescript
await mcp_supabase_execute_sql({ 
  query: "SELECT * FROM profiles WHERE role = 'admin'" 
})
```

### Aplicar Migration
```typescript
await mcp_supabase_apply_migration({
  name: "add_new_column",
  query: "ALTER TABLE profiles ADD COLUMN phone TEXT;"
})
```

### Listar Migrations
```typescript
await mcp_supabase_list_migrations()
```

### Obter URL do Projeto
```typescript
await mcp_supabase_get_project_url()
// Retorna: "https://lfznsbvruvjnugyzfyiw.supabase.co"
```

---

## ⚠️ Importante

### Não Confundir Projetos

- **Projeto Correto**: `lfznsbvruvjnugyzfyiw` (Nova Aliança)
- **Projeto Antigo**: `xrhdsghvgmxwupntgpqn` (Não usar)

### Backup do Token

O token de acesso do Supabase está configurado:
```
sbp_13b52e1ea52902bb2279ecbaf73f5642d62412a2
```

Este token permite ao MCP:
- Ler estrutura do banco
- Executar queries
- Aplicar migrations
- Gerenciar tabelas

---

## 📝 Próximos Passos

Agora que o MCP está conectado ao projeto correto, você pode:

1. ✅ Usar MCP para aplicar migrations
2. ✅ Executar queries SQL via MCP
3. ✅ Gerenciar estrutura do banco
4. ✅ Criar tabelas de auditoria
5. ✅ Implementar novas funcionalidades

---

## 🔗 Referências

- **Documentação MCP Supabase**: https://github.com/supabase/mcp-server-supabase
- **Supabase Dashboard**: https://supabase.com/dashboard/project/lfznsbvruvjnugyzfyiw
- **Documentação do Projeto**: `docs/AUTENTICACAO-AUTORIZACAO.md`

---

**Data da Correção**: 26 de fevereiro de 2026  
**Status**: ✅ Funcionando Corretamente
