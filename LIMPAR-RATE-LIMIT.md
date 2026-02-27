# Como Limpar Rate Limit

## Problema
Erro 429 "Too Many Requests" bloqueando acesso às APIs admin.

## Solução Rápida
**Reinicie o servidor de desenvolvimento:**

```bash
# Parar o servidor (Ctrl+C no terminal)
# Depois iniciar novamente:
npm run dev
```

O rate limiter usa memória (Map), então ao reiniciar o servidor, todos os bloqueios são limpos.

## Configuração Atualizada

✅ **Novo limite para `/api/admin`:**
- **100 requisições por minuto** (antes: 30)
- **Bloqueio de 2 minutos** (antes: 5 minutos)

Isso permite desenvolvimento mais fluido sem comprometer segurança.

## Limites por Rota

| Rota | Requisições | Janela | Bloqueio |
|------|-------------|--------|----------|
| `/api/auth/login` | 5 | 15 min | 1 hora |
| `/auth/secure/admin-access` | 5 | 15 min | 1 hora |
| `/sys/mgmt` | 30 | 1 min | 5 min |
| `/api/admin` | **100** | 1 min | 2 min |
| Outras rotas | 100 | 1 min | 1 min |

## Para Produção

Em produção, considere usar Redis/Upstash para:
- Rate limiting distribuído (múltiplas instâncias)
- Persistência entre deploys
- Melhor performance

## Desabilitar Temporariamente (Desenvolvimento)

Se precisar desabilitar completamente durante desenvolvimento, comente o middleware:

```typescript
// server/middleware/rate-limiter.ts
export default defineEventHandler(async (event) => {
  // Desabilitado para desenvolvimento
  return
  
  // ... resto do código
})
```

⚠️ **NUNCA desabilite em produção!**

---

**Data**: 27/02/2026 11:40  
**Arquivo**: `server/middleware/rate-limiter.ts`
