inclusion: always
---
# Problemas conhecidos e lições aprendidas

## 1. fsWrite / fsAppend não persistem em arquivos .vue neste projeto

**Sintoma:** As ferramentas `fsWrite` e `fsAppend` retornam sucesso mas o arquivo no disco fica com 0 bytes ou com conteúdo antigo. O HMR do Vite atualiza mas o browser continua servindo a versão antiga.

**Causa:** Problema de permissão ou lock de arquivo no Windows quando o servidor de dev (`npm run dev`) está rodando e o arquivo está aberto no editor.

**Solução obrigatória:** Usar `[System.IO.File]::WriteAllText()` via PowerShell para escrever arquivos `.vue` grandes, ou `node script.cjs` para manipulações complexas. Verificar sempre com `(Get-Item "arquivo").Length` se o arquivo tem tamanho > 0 após escrita.

**Verificação:** Sempre rodar após qualquer escrita:
```powershell
(Get-Item "app\components\NomeDoArquivo.vue").Length
# deve ser > 0
```

---

## 2. PowerShell corrompe template literals JavaScript/TypeScript

**Sintoma:** Ao usar here-strings (`@"..."@`) do PowerShell para escrever código JS/TS, os backticks (`` ` ``) são interpretados como escape do PowerShell e removidos. Template literals como `` `https://wa.me/${id}` `` viram `https://wa.me/${id}` sem as aspas, causando erro de parse no Vue compiler: `Invalid regular expression flag`.

**Causa:** No PowerShell, o backtick é o caractere de escape. Dentro de strings PowerShell, `` ` `` seguido de `$` ou `{` é interpretado como escape, não como parte do código JS.

**Solução obrigatória:** Nunca usar PowerShell here-strings para escrever código com template literals. Usar um dos seguintes:
1. `fsWrite` / `fsAppend` (quando funcionam)
2. Arquivo `.cjs` temporário com Node.js para manipulação de strings
3. Substituição cirúrgica com `strReplace` em trechos pequenos
4. Evitar template literals no código — usar concatenação de string (`'url/' + id`) quando o código for gerado via PowerShell

**Detecção:** Após escrita via PowerShell, verificar linhas com `${` sem backtick adjacente:
```powershell
$lines = Get-Content "arquivo.vue"
$lines | Where-Object { $_ -match '\$\{' -and $_ -notmatch '`' }
```

---

## 3. Prop `role` conflita com atributo HTML nativo no Vue

**Sintoma:** Passar `:role="valor"` como prop para um componente Vue causa warning `Extraneous non-props attributes (role) were passed to component` e o valor não é recebido corretamente.

**Causa:** `role` é um atributo HTML nativo (ARIA). O Vue tenta herdar o atributo no elemento raiz em vez de passá-lo como prop, especialmente quando o componente tem múltiplos nós raiz (fragment).

**Solução:** Nunca nomear props de componentes Vue com nomes de atributos HTML nativos reservados: `role`, `class`, `style`, `id`, `tabindex`, etc. Usar nomes descritivos como `adminRole`, `userRole`, `permissao`.

---

## 4. `useState` do Nuxt pode não hidratar corretamente em composables com `useRouter`

**Sintoma:** `adminRole` retorna `null` no componente filho mesmo após o middleware ter carregado o role corretamente.

**Causa:** Composables que chamam `useRouter()` fora do contexto de setup de componente podem criar instâncias separadas do estado, quebrando o singleton esperado.

**Solução:** Buscar o role diretamente no `onMounted` do componente via `supabase.auth.getUser()` + query na tabela `admins`, sem depender de composables de auth compartilhados para dados críticos de permissão.

## 5. Git push vai para `master` mas o Vercel escuta `main`

**Sintoma:** Após `git push origin master`, o GitHub mostra "master had recent pushes" e pede um Pull Request. O Vercel não faz deploy porque a branch padrão do repositório é `main`.

**Causa:** O repositório local tem branch `master` mas o GitHub/Vercel usa `main` como branch padrão.

**Solução obrigatória:** Sempre fazer push com mapeamento explícito para `main`:
```powershell
git push origin master:main 2>&1
```

**Nunca usar apenas** `git push origin master` — isso cria divergência e exige PR manual.
