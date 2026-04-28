# 📊 Mini Stats Capture

Uma extensão Chrome poderosa e intuitiva para capturar e enviar dados de estatísticas de qualquer página web para sua API em tempo real.

---

## ✨ Características

- 🎯 **Captura Automática**: Extrai valores de estatísticas da página atual com um clique
- 🔄 **Sincronização com API**: Envia dados capturados para seu backend automaticamente
- 🌐 **Compatibilidade Universal**: Funciona em qualquer site e página web
- 💾 **Armazenamento Local**: Persiste dados usando Chrome Storage API
- ⚡ **Performance Otimizada**: Execução eficiente sem impacto na velocidade do navegador
- 🔐 **Seguro**: Permissões controladas e execução segura
- 📱 **Suporte Mobile**: Funciona em navegadores mobile que suportam extensões Chrome

---

## 🚀 Como Funciona

### Processo de Captura

1. **Coleta de Dados**: A extensão analisa o conteúdo da página atual
2. **Extração de Valores**: Identifica e extrai as estatísticas displayadas
3. **Envio para API**: Transmite os dados capturados para seu servidor
4. **Confirmação**: Feedback visual do sucesso ou erro da operação

### Estrutura da Extensão

- **Content Script** (`content_script.js`): Executa na página para capturar dados
- **Background Service Worker** (`background.js`): Gerencia comunicação com API
- **Popup Interface** (`popup.html`): Interface amigável para o usuário
- **Manifest v3**: Segurança e compatibilidade com versões modernas do Chrome

---

## 📦 Instalação

### Para Desktop (Chrome, Edge, Brave, etc)

1. Clone o repositório:
```bash
git clone https://github.com/alexkbw/extensaoChoromeLocal.git
cd extensaoChoromeLocal/mini-stats-extension
```

2. Carregue a extensão no navegador:
   - Abra `chrome://extensions/` (ou equivalente no seu navegador)
   - Ative o **Modo de Desenvolvedor** (canto superior direito)
   - Clique em **"Carregar extensão sem empacotamento"**
   - Selecione a pasta `mini-stats-extension`

3. A extensão está pronta para usar! ✅

### 📱 Para Mobile

A extensão também funciona em **navegadores mobile que suportam extensões baseadas em Chromium**:

#### 🦎 **Lemur Browser** (Recomendado)
- [Download Lemur Browser](https://lemurbrowser.com/)
- Um navegador leve e poderoso para Android com suporte completo a extensões Chrome
- Excelente performance mesmo em dispositivos com recursos limitados
- Suporta todas as funcionalidades da extensão Mini Stats Capture

**Como instalar no Lemur Browser:**
1. Baixe o Lemur Browser do [site oficial](https://lemurbrowser.com/)
2. Instale a extensão seguindo os mesmos passos do Desktop
3. Acesse os sites e capture os dados direto do seu celular!

#### Outros Navegadores Mobile Compatíveis:
- **Kiwi Browser** (Android)
- **Yandex Browser** (Android/iOS)
- **Samsung Internet** (com extensões ativadas)
- **Firefox Mobile** (com suporte a extensões)

---

## 🎮 Como Usar

### Desktop
1. **Clique no ícone** da extensão na barra de ferramentas
2. **Abrirá um popup** com a opção de capturar
3. **Clique em "Capturar Estatísticas"**
4. Os dados serão enviados para sua API
5. Veja o resultado no console ou nos logs da API

### Mobile
1. **Abra seu navegador mobile** (ex: Lemur Browser)
2. **Navegue até o site** que deseja capturar dados
3. **Acesse o menu de extensões** do seu navegador
4. **Selecione "Mini Stats Capture"**
5. **Clique para capturar** e os dados serão enviados!

---

## 🔧 Configuração da API

Para que a extensão funcione corretamente, configure o endpoint da API:

### Variáveis de Ambiente

Você precisa definir a URL da API no `background.js` ou `content_script.js`:

```javascript
const API_ENDPOINT = 'https://sua-api.com/api/capture';
```

### Formato de Envio

A extensão envia os dados no formato:

```json
{
  "timestamp": "2026-04-28T11:24:52Z",
  "page_url": "https://exemplo.com",
  "device": "mobile|desktop",
  "stats": {
    "metrica_1": "valor_1",
    "metrica_2": "valor_2"
  }
}
```

---

## 📋 Tecnologias Utilizadas

<div align="center">

| Linguagem | Proporção |
|-----------|-----------|
| **JavaScript** | 77.1% |
| **CSS** | 18.1% |
| **HTML** | 4.8% |

</div>

- **Chrome Manifest v3**: Padrão moderno de extensões
- **Chrome Storage API**: Persistência de dados
- **Vanilla JavaScript**: Sem dependências externas
- **Compatibilidade Cross-Platform**: Desktop e Mobile

---

## 🎯 Casos de Uso

- 📈 Monitorar métricas de websites em tempo real (Desktop e Mobile)
- 🎮 Coletar dados de plataformas de jogos
- 💰 Capturar valores de plataformas financeiras (PragmaticPay, Evol, etc)
- 📱 Análise e tracking em dispositivos mobile
- 📊 Extrair dados de dashboards customizados
- 🔍 Análise e tracking de informações públicas

---

## 📂 Estrutura do Projeto

```
extensaoChoromeLocal/
├── mini-stats-extension/
│   ├── manifest.json          # Configuração da extensão
│   ├── background.js          # Service worker (background)
│   ├── content_script.js      # Script de conteúdo (página)
│   ├── popup.html             # Interface do popup
│   ├── popup.js               # Lógica do popup
│   ├── styles.css             # Estilos da extensão
│   ├── icon.png               # Ícone da extensão
│   └── node_modules/          # Dependências
├── README.md                  # Este arquivo
└── package.json               # Metadados do projeto
```

---

## 🔐 Permissões

A extensão solicita as seguintes permissões:

- **`storage`**: Para armazenar dados localmente
- **`<all_urls>`**: Para acessar e capturar dados de qualquer site

Essas permissões são necessárias para o funcionamento correto da extensão.

---

## 🚀 Versão Atual

- **Versão**: 2.1.0
- **Status**: Em desenvolvimento ativo
- **Suporte**: Desktop e Mobile ✅

---

## 💡 Dicas e Boas Práticas

### Desktop
1. **Debug**: Use `chrome://extensions/` para ver logs de erros
2. **Teste Local**: Teste em sites locais antes de usar em produção
3. **API Endpoint**: Certifique-se de que sua API está acessível e CORS configurado

### Mobile
1. **Lemur Browser**: Ideal para melhor performance e estabilidade
2. **Conexão de Internet**: Certifique-se de ter conexão ativa
3. **Dados Sensíveis**: Não capture informações pessoais ou sensíveis
4. **Bateria**: A captura é leve e não consome muita bateria

---

## 🤝 Contribuindo

Sugestões e melhorias são bem-vindas! Sinta-se livre para:
- Reportar bugs (Desktop ou Mobile)
- Sugerir novas features
- Melhorar a documentação
- Otimizar o código
- Testar em diferentes navegadores mobile

---

## 📄 Licença

Este projeto está disponível sob a licença MIT. Veja o arquivo LICENSE para mais detalhes.

---

## 👨‍💻 Desenvolvedor

**alexkbw** - [Perfil GitHub](https://github.com/alexkbw)

---

## 📞 Suporte

Se encontrar problemas ou tiver dúvidas:
- 📝 Abra uma issue no repositório
- 💬 Deixe um comentário
- 🐛 Descreva o erro com prints se possível
- 📱 Informe qual navegador mobile está usando (ex: Lemur Browser)

---

<div align="center">

**⭐ Se gostou do projeto, não esqueça de deixar uma estrela!**

Desenvolvido com ❤️ usando JavaScript, CSS e HTML

**Compatível com Desktop e Mobile! 📱💻**

</div>