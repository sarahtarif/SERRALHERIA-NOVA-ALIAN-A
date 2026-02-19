# Sistema de Design - Serralheria

## 🎨 Paleta de Cores

### Cores Primárias

#### Azul Principal (`primary`)
- **Uso**: Botões principais, links, elementos de destaque
- **Valor principal**: `#0056e0` (primary-500)
- **Inspiração**: Profissionalismo, confiança, segurança

```html
<button class="bg-primary-500 hover:bg-primary-600 text-white">
  Solicitar Orçamento
</button>
```

### Cores Secundárias

#### Cinza Técnico (`secondary`)
- **Uso**: Textos secundários, bordas, backgrounds neutros
- **Valor principal**: `#6c757d` (secondary-500)
- **Inspiração**: Modernidade, neutralidade, profissionalismo

```html
<p class="text-secondary-600">Informação secundária</p>
```

### Cor de Destaque

#### Amarelo Industrial (`accent`)
- **Uso**: CTAs importantes, alertas, destaques visuais
- **Valor principal**: `#f59e0b` (accent-500)
- **Inspiração**: Atenção, segurança industrial, energia

```html
<button class="bg-accent-500 hover:bg-accent-600 text-white">
  Ação Importante
</button>
```

### Cores Semânticas

#### Sucesso (`success`)
- **Uso**: Mensagens de sucesso, confirmações
- **Valor**: `#22c55e` (success-500)

#### Erro (`danger`)
- **Uso**: Mensagens de erro, alertas críticos
- **Valor**: `#ef4444` (danger-500)

#### Aviso (`warning`)
- **Uso**: Avisos, atenção necessária
- **Valor**: `#f59e0b` (warning-500)

#### Informação (`info`)
- **Uso**: Mensagens informativas, dicas
- **Valor**: `#3b82f6` (info-500)

### Cores Específicas do Negócio

#### Metal (`metal`)
- **Uso**: Elementos que representam metal, acabamentos
- **Valor principal**: `#8b95a1` (metal-500)

#### Aço (`steel`)
- **Uso**: Elementos que representam aço, estruturas
- **Valor principal**: `#627d98` (steel-500)

---

## 📐 Aplicações Práticas

### Botões

```html
<!-- Botão Primário -->
<button class="bg-primary-500 hover:bg-primary-600 text-white px-6 py-3 rounded-lg shadow-metal transition-all">
  Botão Primário
</button>

<!-- Botão Secundário -->
<button class="bg-secondary-200 hover:bg-secondary-300 text-secondary-800 px-6 py-3 rounded-lg transition-all">
  Botão Secundário
</button>

<!-- Botão de Destaque -->
<button class="bg-accent-500 hover:bg-accent-600 text-white px-6 py-3 rounded-lg shadow-accent transition-all">
  Solicitar Orçamento
</button>

<!-- Botão Outline -->
<button class="border-2 border-primary-500 text-primary-500 hover:bg-primary-500 hover:text-white px-6 py-3 rounded-lg transition-all">
  Botão Outline
</button>
```

### Cards

```html
<div class="bg-white rounded-lg shadow-metal p-6 border border-border-light hover:shadow-metal-lg transition-all">
  <h3 class="text-text-primary text-xl font-bold mb-2">Título do Card</h3>
  <p class="text-text-secondary">Descrição do serviço ou produto</p>
</div>
```

### Navegação

```html
<nav class="bg-gradient-primary text-white shadow-metal-lg">
  <div class="container mx-auto px-4 py-4">
    <a href="#" class="hover:text-accent-300 transition-colors">Home</a>
    <a href="#" class="hover:text-accent-300 transition-colors">Serviços</a>
    <a href="#" class="hover:text-accent-300 transition-colors">Contato</a>
  </div>
</nav>
```

### Alertas

```html
<!-- Sucesso -->
<div class="bg-success-50 border-l-4 border-success-500 text-success-800 p-4 rounded">
  <p class="font-bold">Sucesso!</p>
  <p>Operação realizada com sucesso.</p>
</div>

<!-- Erro -->
<div class="bg-danger-50 border-l-4 border-danger-500 text-danger-800 p-4 rounded">
  <p class="font-bold">Erro!</p>
  <p>Ocorreu um erro na operação.</p>
</div>

<!-- Aviso -->
<div class="bg-warning-50 border-l-4 border-warning-500 text-warning-800 p-4 rounded">
  <p class="font-bold">Atenção!</p>
  <p>Verifique as informações antes de continuar.</p>
</div>

<!-- Info -->
<div class="bg-info-50 border-l-4 border-info-500 text-info-800 p-4 rounded">
  <p class="font-bold">Informação</p>
  <p>Dados importantes sobre o serviço.</p>
</div>
```

### Backgrounds

```html
<!-- Background com gradiente primário -->
<section class="bg-gradient-primary text-white py-20">
  <h1 class="text-4xl font-bold">Serralheria Profissional</h1>
</section>

<!-- Background metálico -->
<section class="bg-gradient-metal text-white py-20">
  <h2 class="text-3xl font-bold">Qualidade em Metal</h2>
</section>

<!-- Background neutro -->
<section class="bg-surface py-20">
  <h2 class="text-text-primary text-3xl font-bold">Nossos Serviços</h2>
</section>
```

---

## 🎯 Diretrizes de Uso

### Hierarquia Visual

1. **Primário (Azul)**: Ações principais, navegação, elementos de marca
2. **Destaque (Amarelo)**: CTAs importantes, ofertas, elementos que precisam atenção
3. **Secundário (Cinza)**: Textos, bordas, elementos de suporte
4. **Semântico**: Feedback do sistema (sucesso, erro, aviso, info)

### Contraste e Acessibilidade

- Sempre use cores com contraste adequado (WCAG AA mínimo)
- Texto escuro em fundos claros: `text-text-primary` em `bg-white`
- Texto claro em fundos escuros: `text-white` em `bg-primary-500`
- Evite usar apenas cor para transmitir informação

### Combinações Recomendadas

#### Profissional e Confiável
```html
<div class="bg-primary-500 text-white">
  <!-- Conteúdo -->
</div>
```

#### Moderno e Técnico
```html
<div class="bg-gradient-steel text-white">
  <!-- Conteúdo -->
</div>
```

#### Destaque e Ação
```html
<button class="bg-accent-500 text-white shadow-accent">
  Solicitar Orçamento
</button>
```

#### Neutro e Limpo
```html
<div class="bg-surface border border-border-light">
  <!-- Conteúdo -->
</div>
```

---

## 🔧 Sombras Personalizadas

- `shadow-metal`: Sombra padrão com aspecto metálico
- `shadow-metal-lg`: Sombra grande para elementos elevados
- `shadow-steel`: Sombra com tom azulado (aço)
- `shadow-accent`: Sombra com brilho amarelo para destaque

---

## 🌈 Gradientes

- `bg-gradient-primary`: Gradiente azul (principal)
- `bg-gradient-metal`: Gradiente cinza metálico
- `bg-gradient-steel`: Gradiente azul aço
- `bg-gradient-accent`: Gradiente amarelo (destaque)

---

## 📱 Responsividade

Todas as cores funcionam perfeitamente com os breakpoints do Tailwind:

```html
<div class="bg-primary-500 md:bg-primary-600 lg:bg-primary-700">
  <!-- Cores diferentes por tamanho de tela -->
</div>
```

---

## ✅ Checklist de Implementação

- [ ] Cores primárias aplicadas em elementos principais
- [ ] Cor de destaque usada em CTAs importantes
- [ ] Cores semânticas aplicadas em feedbacks
- [ ] Contraste adequado em todos os elementos
- [ ] Sombras aplicadas para profundidade
- [ ] Gradientes usados em seções de destaque
- [ ] Hover states definidos para interatividade
- [ ] Cores responsivas quando necessário
