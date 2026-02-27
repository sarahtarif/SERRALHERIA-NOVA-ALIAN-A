# Aumentar Rate Limit de Email no Supabase

## 🎯 Problema
Erro: "email rate limit exceeded" ao tentar criar contas

## 📋 Solução

### Opção 1: Aumentar Rate Limit (Recomendado)

1. Acesse o Supabase Dashboard: https://supabase.com/dashboard
2. Selecione seu projeto: `lfznsbvruvjnugyzfyiw`
3. Vá em: **Authentication** → **Rate Limits**
4. Ajuste os limites:
   - **Email Sign Up**: Aumente de 3/hora para 10/hora (ou mais)
   - **Email Sign In**: Aumente de 5/hora para 20/hora (ou mais)
   - **Password Reset**: Aumente de 3/hora para 10/hora (ou mais)

### Opção 2: Aguardar Reset Automático

O rate limit reseta automaticamente após 1 hora. Aguarde e tente novamente.

### Opção 3: Desabilitar Confirmação de Email (Apenas para Desenvolvimento)

⚠️ **ATENÇÃO**: Use apenas em desenvolvimento, NUNCA em produção!

1. Acesse: **Authentication** → **Email Auth**
2. Desmarque: **Enable email confirmations**
3. Salve as alterações

Isso permite criar contas sem precisar confirmar o email, mas é menos seguro.

---

## 🔧 Configuração Recomendada para Produção

### Rate Limits Sugeridos

```
Email Sign Up: 10 por hora por IP
Email Sign In: 30 por hora por IP
Password Reset: 5 por hora por IP
Email Change: 5 por hora por IP
```

### Configurações de Email

1. **Enable email confirmations**: ✅ Habilitado
2. **Secure email change**: ✅ Habilitado
3. **Double confirm email changes**: ✅ Habilitado (mais seguro)

---

## 📧 Configurar SMTP Customizado (Opcional)

Para evitar limites do Supabase, você pode usar seu próprio servidor SMTP:

1. Vá em: **Project Settings** → **Auth** → **SMTP Settings**
2. Configure:
   ```
   Host: smtp.gmail.com
   Port: 587
   Username: qualitecinstrumentosdemedicao@gmail.com
   Password: byeqpdyllakkwxkk
   Sender email: noreply@novaalianca.com.br
   Sender name: Serralheria Nova Aliança
   ```
3. Clique em **Save**

Com SMTP customizado, você tem controle total sobre os limites de email.

---

## 🧪 Testar Após Configurar

1. Aguarde 1 hora ou aumente o rate limit
2. Acesse: https://novalianca.vercel.app/cliente/cadastro
3. Tente criar uma nova conta com um email diferente
4. Verifique se funciona sem erro

---

## 🔍 Verificar Rate Limit Atual

1. Acesse: **Authentication** → **Rate Limits**
2. Veja quantas tentativas foram feitas
3. Veja quando o limite será resetado

---

## 💡 Dicas

- Use emails diferentes para cada teste
- Aguarde alguns minutos entre tentativas
- Em produção, usuários reais raramente atingem esse limite
- Configure SMTP customizado para ter mais controle

---

**Status**: ⏳ Aguardando ajuste de rate limit no Supabase  
**Última atualização**: 27 de fevereiro de 2026
