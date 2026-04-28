# 🎰 Mini Stats Capture - Roulette Analyzer

Uma extensão Chrome/Mobile inteligente que captura números de roleta em tempo real, analisa padrões e gera sugestões de jogada automáticas. Compatível com as principais plataformas de casino online.

---

## ⚠️ INFORMAÇÃO IMPORTANTE

**Esta ferramenta funciona APENAS com as seguintes roletas e plataformas:**

### ✅ ROLETAS SUPORTADAS

| Plataforma | Status | Notas |
|------------|--------|-------|
| **🎰 PragmaticPay** | ✅ Totalmente Suportada | Mini Stats - Layout principal |
| **🎮 Evolution Gaming** | ✅ Totalmente Suportada | Multiple layouts suportados |
| **🏆 CreedRoms** | ✅ Totalmente Suportada | Compatível com integração local |

**⚠️ AVISO:** A ferramenta foi desenvolvida especificamente para essas plataformas. Se você está em outro site de casino, a extensão **NÃO funcionará**. Verifique se está usando uma das roletas listadas acima.

---

## ✨ Características Principais

- 🎯 **Captura em Tempo Real**: Detecta cada novo número sorteado instantaneamente
- 🧠 **Análise Inteligente**: Calcula padrões usando sequência física real da roleta
- 💡 **Sugestões Automáticas**: Recomenda as melhores jogadas baseado em análise estatística
- 📊 **Visualização Live**: Mostra histórico dos últimos 7 números capturados
- 🔄 **Alternância de Direção**: Monitora mudança entre sentido horário e anti-horário
- 💾 **Persistência de Dados**: Mantém histórico da sessão mesmo com reloads
- 🔐 **100% Local**: Sem envio de dados para servidores externos
- 📱 **Suporte Mobile**: Funciona em navegadores mobile com extensões (Lemur Browser)

---

## 🚀 Como Funciona - Explicação Técnica

### 1️⃣ **Captura de Números**

O content script monitora as plataformas suportadas em tempo real:

```javascript
// Detecta números em diferentes layouts:
const SELECTORS = [
  ".mini-statistics-number",           // PragmaticPay Layout
  '[data-testid="single-result"]',     // Evolution Gaming
  '[data-role="recent-number"]'        // Alternativas
];
```

**O que ocorre:**
- Monitora mudanças no DOM a cada novo sorteio
- Captura o número, cor (vermelho/preto/verde) e estado
- Envia para análise imediatamente

### 2️⃣ **Cálculo de Distância**

A ferramenta usa a **sequência física real da roleta**:

```javascript
// Sequência exata de uma roleta física:
[0, 32, 15, 19, 4, 21, 2, 25, 17, 34, 6, 27, 13, 36, 11, 30, 8, 23, 10, 5, 24, 16, 33, 1, 20, 14, 31, 9, 22, 18, 29, 7, 28, 12, 35, 3, 26]
```

**Calcula a distância entre números consecutivos:**
- Sentido **Horário**: para onde a roda gira normalmente
- Sentido **Anti-horário**: quando a roda inverte direção

**Classificação de distâncias:**
- `≤ 12 passos` → Distância Curta (REPETIÇÃO)
- `≤ 24 passos` → Distância Média (INTERMEDIÁRIO)
- `> 24 passos` → Distância Longa (ATRASADO)

### 3️⃣ **Detecção de Estados**

Para cada novo número, o sistema classifica em 3 estados:

| Estado | Distância | Significado | Indicador |
|--------|-----------|-------------|-----------|
| **REPETIÇÃO** (REP) | 12 passos | Número saiu PERTO do anterior | 🔴 |
| **INTERMEDIÁRIO** (INT) | 24 passos | Número saiu numa distância MÉDIA | 🟡 |
| **ATRASADO** (ATR) | 36 passos | Número saiu LONGE do anterior | 🟢 |

### 4️⃣ **Sugestão de Jogada**

A análise combina:

1. **Sequência de Estados** - Os últimos 4 padrões observados
2. **Direção Atual** - Se está girando horário ou anti-horário
3. **Histórico de Saídas** - Quais números tendem a sair juntos
4. **Números Relacionados** - Aqueles próximos no padrão matemático

**Exemplo de Sugestão:**
```
Status: TENDÊNCIA ATR (Atrasado)
Número Central: 13
Sugestão: Aposte nos números próximos a 13
├─ Números Relacionados: 36, 24, 3
├─ Vizinhos Diretos: 11, 5, 23, 10
└─ Confiança: 78%
```

---

## 📦 Instalação

### 🖥️ Para Desktop (Windows, Mac, Linux)

#### Chrome, Edge, Brave, Opera (Qualquer Chromium-based)

1. Clone o repositório:
```bash
git clone https://github.com/alexkbw/extensaoChoromeLocal.git
cd extensaoChoromeLocal/mini-stats-extension
```

2. Carregue a extensão:
   - Abra `chrome://extensions/` (ou `edge://extensions/` no Edge)
   - Ative o **"Modo de Desenvolvedor"** (canto superior direito)
   - Clique em **"Carregar extensão sem empacotamento"**
   - Selecione a pasta `mini-stats-extension`

3. ✅ Extensão instalada! Comece a usar!

### 📱 Para Mobile

#### 🦎 Lemur Browser (Recomendado para Android)

**Por que Lemur Browser?**
- Suporta extensões Chrome nativas
- Performance excelente mesmo em celulares básicos
- Compatível com Mini Stats Capture
- Muito leve e rápido

**Instalação:**

1. [Baixe o Lemur Browser](https://lemurbrowser.com/) na Play Store
2. Abra o Lemur Browser
3. Navegue para `chrome://extensions/`
4. Ative "Modo de Desenvolvedor"
5. Carregue a extensão como em desktop
6. Acesse a plataforma de casino suportada
7. Use a extensão direto do seu celular!

#### Outros Navegadores Mobile Compatíveis:
- **Kiwi Browser** (Android) - Suporte a extensões completo
- **Yandex Browser** (Android/iOS) - Integração nativa
- **Samsung Internet** (Samsung Galaxy) - Com extensões ativadas
- **Firefox Mobile** (Android) - Com suporte a extensões

---

## 🎮 Como Usar

### ✅ PRÉ-REQUISITOS OBRIGATÓRIOS

Antes de usar, **VERIFIQUE** se você está em uma das plataformas suportadas:

- ✅ Você está no site de **PragmaticPay**? 
- ✅ Você está no site de **Evolution Gaming**?
- ✅ Você está no site de **CreedRoms**?

**Se NÃO está em nenhuma dessas, a extensão NÃO funcionará!**

### Passo a Passo

1. **Acesse a plataforma suportada**
   - Exemplo: pragmaticpay.com, evolutiongaming.com, ou creedrooms.com

2. **Abra a roleta em tempo real**
   - Qualquer das roletas disponíveis na plataforma

3. **Clique no ícone da extensão** na barra de ferramentas
   - Você verá um popup com a interface

4. **Clique em "Iniciar"** para começar o monitoramento
   - A extensão agora captura cada número que sai

5. **Observe os padrões**
   - Cada número será analisado
   - Estados serão classificados (REP, INT, ATR)
   - Sugestões aparecerão automaticamente

6. **Receba sugestões de jogada**
   - A extensão mostra os números mais prováveis
   - Use as recomendações para apostar

7. **Clique em "Parar"** para pausar o monitoramento

### 📊 Entendendo a Interface

```
┌─────────────────────────────────────┐
│   MINI STATS CAPTURE - RUNNING      │
├─────────────────────────────────────┤
│                                     │
│  Últimos Números (7):               │
│  [13][18][28][7][35][3][26]         │
│   ↑ Atual (Vermelho)                │
│                                     │
│  Estados Detectados:                │
│  [REP] [INT] [ATR] [INT] ...        │
│                                     │
│  SUGESTÃO DE JOGADA:                │
│  ├─ Tipo: TENDÊNCIA ATRASADO        │
│  ├─ Número Central: 13              │
│  └─ Números: 11 5 23 10 24          │
│                                     │
│  [Parar]                            │
└─────────────────────────────────────┘
```

---

## 🧮 Exemplos de Análise

### Cenário 1: Repetição Detectada

```
Sequência: 7 → 28 → 12 → 35
Estados:        [REP]   [INT]  [ATR]

Análise:
- Após 7, saiu 28 (PRÓXIMO = REP)
- Após 28, saiu 12 (DISTÂNCIA = INT)
- Após 12, saiu 35 (DISTÂNCIA = ATR)

Sugestão: TENDÊNCIA A CONTINUAR ATRASADO
Próximos números prováveis: próximos a 35
```

### Cenário 2: Padrão de Inversão

```
Sequência: Horário → Anti-horário → Horário

Análise:
- Direção muda alternadamente
- Estados também se alternam

Sugestão: MONITORAR MUDANÇA DE DIREÇÃO
Aposte em números na direção oposta à anterior
```

---

## 🔧 Configuração Avançada

### Ajustar Thresholds (Arquivo: background.js)

```javascript
// Altere os valores de distância (em passos):
let sessionOrdemAtraso = [12, 24, 36];
//                        │   │    └─ Limite para ATRASADO
//                        │   └────── Limite para INTERMEDIÁRIO
//                        └────────── Limite para REPETIÇÃO
```

### Modificar Sequência da Roleta

Se estiver usando uma roleta diferente, atualize:

```javascript
const sequenciaRoleta = [0, 32, 15, 19, 4, 21, ...];
// Coloque aqui a sequência exata da sua roleta
```

---

## 📊 Dados Técnicos

### Composição do Código

| Linguagem | Proporção |
|-----------|-----------|
| **JavaScript** | 77.1% |
| **CSS** | 18.1% |
| **HTML** | 4.8% |

### Arquivos Principais

```
mini-stats-extension/
├── manifest.json          # Config extensão (Manifest v3)
├── background.js          # Lógica de análise (Service Worker)
├── content_script.js      # Captura de números (Injeta na página)
├── popup.html             # Interface do usuário
├── popup.js               # Lógica da interface
├── styles.css             # Estilos visuais
└── icon.png               # Ícone da extensão
```

---

## 🎯 Plataformas Suportadas - Detalhes

### 1. PragmaticPay 🎰

- **Site**: pragmaticpay.com
- **Selector Usado**: `.mini-statistics-number`
- **Suporte**: ✅ COMPLETO
- **Nota**: Detecta cores (Vermelho/Preto/Verde)

**Como acessar:**
1. Vá para pragmaticpay.com
2. Faça login em sua conta
3. Acesse a seção de Roleta em Tempo Real
4. Ative a extensão

### 2. Evolution Gaming 🎮

- **Site**: evolutiongaming.com (e integrações)
- **Selectors Usados**: 
  - `[data-testid="single-result"]`
  - `[data-role="recent-number"]`
- **Suporte**: ✅ COMPLETO
- **Nota**: Suporta múltiplos layouts

**Como acessar:**
1. Vá para um casino com Evolution Gaming
2. Acesse Roulette ao vivo
3. Ative a extensão
4. Comece o monitoramento

### 3. CreedRoms 🏆

- **Site**: creedrooms.com (e espelhos)
- **Selectors**: Dinamicamente detectados
- **Suporte**: ✅ COMPLETO
- **Nota**: Compatível com layout local

**Como acessar:**
1. Acesse creedrooms.com
2. Entre na seção de Roleta
3. Ative a extensão
4. Monitore em tempo real

---

## ⚠️ AVISOS IMPORTANTES

### ❌ Quando a Ferramenta NÃO Funciona

- ❌ Em roletas que não estão na lista suportada
- ❌ Se os elementos HTML foram modificados pelo site
- ❌ Em sites que bloqueiam extensões (usar desktop/mobile com suporte)
- ❌ Com JavaScript desativado
- ❌ Em modo de navegação privada (configure permissões)

### ✅ Responsabilidade do Usuário

- ⚖️ Use a ferramenta apenas em plataformas legais em seu país
- 💰 A responsabilidade sobre apostas é exclusiva do usuário
- 🚫 Não use em sites não autorizados
- 📋 Respeite os termos de serviço de cada plataforma

### 📊 Limitações Técnicas

- A análise é baseada em padrões históricos, não é garantia
- Resultados variam conforme tamanho do histórico
- Primeira captura sem sugestão (precisa de referência anterior)

---

## 🐛 Troubleshooting

### "Nada encontrado" - Extensão não detecta números

**Solução:**
1. Verifique se está em **PragmaticPay**, **Evolution Gaming** ou **CreedRoms**
2. Abra a roleta em tempo real (ao vivo)
3. Recarregue a página (F5)
4. Clique novamente em "Iniciar"

### Status fica "Pronto" sem capturar

**Solução:**
1. A página pode estar carregando - aguarde 3 segundos
2. Verifique se os números são visíveis na tela
3. Abra o DevTools (F12) → Console para erros
4. Tente em outra aba/janela da mesma plataforma

### Não funciona no Mobile

**Solução:**
1. Use **Lemur Browser** (recomendado)
2. Ative extensões nas configurações do navegador
3. Recarregue a página no Lemur Browser
4. Tente novamente

---

## 📱 Suporte - Desktop vs Mobile

<div align="center">

| Recurso | Desktop | Mobile |
|---------|---------|--------|
| Captura em Tempo Real | ✅ | ✅ |
| Análise de Padrões | ✅ | ✅ |
| Sugestões Automáticas | ✅ | ✅ |
| Persistência de Dados | ✅ | ✅ |
| Performance | Excelente | Ótimo (Lemur) |

</div>

---

## 🚀 Versão Atual

- **Versão**: 2.1.0
- **Status**: ✅ Estável e em desenvolvimento
- **Compatibilidade**: Chrome, Edge, Brave, Firefox, Lemur Browser
- **Plataformas Suportadas**: PragmaticPay, Evolution Gaming, CreedRoms

---

## 💡 Dicas Profissionais

### Para Melhor Performance

1. **Use em Desktop quando possível** - Performance superior
2. **Em Mobile, use Lemur Browser** - Melhor compatibilidade
3. **Deixe rodando por mais tempo** - Padrões ficam mais precisos
4. **Valide sugestões manualmente** - Use como auxílio, não certeza

### Para Análise Mais Precisa

1. **Colete pelo menos 10-15 números** antes de confiar em padrões
2. **Observe as mudanças de direção** (horário ↔ anti-horário)
3. **Combine com análise visual** da roleta
4. **Não confie 100%** em sugestões automáticas
5. **Sempre aposte com responsabilidade**

---

## 🤝 Contribuindo

Você pode ajudar a melhorar a ferramenta:

- 🐛 Reportar bugs e problemas
- 💡 Sugerir novas plataformas a adicionar
- 📝 Melhorar documentação
- 🔧 Otimizar código
- ✅ Testar em novas versões do Chrome/navegadores

---

## 📄 Licença

MIT License - Veja LICENSE para detalhes

---

## 👨‍💻 Desenvolvedor

**alexkbw** - [GitHub](https://github.com/alexkbw)

---

## 📞 Suporte

- 📝 Abra uma issue no repositório
- 💬 Descreva o problema com detalhes
- 📱 Informe qual plataforma está usando (PragmaticPay/Evolution/CreedRoms)
- 🖥️ Mencione seu navegador e sistema operacional

---

<div align="center">

### ⭐ Gostou? Deixe uma estrela no repositório!

**Desenvolvido com ❤️ para análise de padrões de roleta**

**⚠️ Use responsavelmente!**

### Plataformas Suportadas:
🎰 **PragmaticPay** | 🎮 **Evolution Gaming** | 🏆 **CreedRoms**

</div>