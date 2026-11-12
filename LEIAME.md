# TRIBYTE — portfólio

Portfólio da equipe formada por Gustavo de Brito Vieira, Márcio Andrey e Lucas Duarte Costa. Os três estudam Desenvolvimento de Sistemas no SENAI. O site é feito com HTML, CSS e JavaScript puros, sem etapa de build.

- **Site:** https://portifolio-tribyte.vercel.app/
- **Repositório:** https://github.com/GustavobritoTDS/Portifolio-empresa
- **Hospedagem:** projeto `portifolio-tribyte` na Vercel, conectado à branch `main`.

## Executar localmente

Na pasta do projeto, execute `python -m http.server 8000` e abra `http://localhost:8000`. Também é possível usar a extensão Live Server do VS Code.

## Estrutura

- `index.html`: conteúdo, navegação, cartões, diálogos e metadados.
- `styles.css`: estilos consolidados, temas claro/escuro, responsividade e animações.
- `script.js`: conteúdo dos projetos, filtros, diálogos, tema e formulário.
- `site-init.js` e `intro.js`: preferência de tema e abertura 3D da marca.
- `reactbits-effects.js`, `tribyte-reinvention.js` e `tribyte-referencias.js`: interações específicas da página.
- `assets/`: fotos WebP, imagens dos projetos, logo SVG, fontes WOFF2 e licenças.
- `docs/decisoes-do-portfolio.md`: critérios usados para apresentar o estágio real de cada trabalho.

## Projetos apresentados

- **SENAI Smart Class:** projeto acadêmico em equipe. As telas do portfólio são capturas do painel. Sem o Arduino conectado, as leituras exibidas são simuladas.
- **Painel comercial:** conceito de interface com valores fictícios; não representa cliente ou sistema em produção.
- **Vio Finanças:** projeto pessoal de Márcio Andrey, ainda sem demonstração pública.
- **Portfólio TRIBYTE:** site atual da equipe.

A área de referências externas contém ilustrações locais com valores fictícios, identificadas como exemplos. Os links levam às páginas oficiais do Metabase e do Grafana.

## Contato

Os botões abrem o WhatsApp com uma mensagem inicial editável. O visitante revisa e confirma o envio no próprio aplicativo. Não há envio automático pelo site nem endereço de e-mail apresentado como contato. O número usado nos links fica no começo de `script.js` e nos links de contato de `index.html`.

## Fontes e licenças

Space Grotesk e Space Mono são servidas localmente em WOFF2. Os arquivos de licença OFL acompanham as fontes. A abertura 3D usa GSAP local somente quando a introdução é exibida; se a abertura for pulada, a biblioteca não é carregada.

## Publicação e segurança

O envio de alterações para `main` inicia o deploy contínuo da Vercel. O `vercel.json` define cabeçalhos de segurança e uma CSP que autoriza scripts, estilos, imagens e fontes locais, além do hash necessário ao bloco JSON-LD de metadados.

`robots.txt` e `sitemap.xml` apontam para o endereço público do portfólio.
