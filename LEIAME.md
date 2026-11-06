# TRIBYTE — Ideias em outra dimensão

Portfólio de Gustavo de Brito Vieira, Márcio Andrey e Lucas Duarte Costa.
Desenvolvido com HTML, CSS e JavaScript puros, sem framework, instalação ou etapa de build.

**Site publicado:** https://tribyte-portifolio.vercel.app/

## Abrir e editar

Extraia o ZIP e abra `index.html` no navegador. Para editar, abra a pasta no VS Code.
Você também pode usar a extensão Live Server ou executar `python -m http.server 8000`
na pasta do projeto e visitar `http://localhost:8000`.

Arquivos principais:

- `index.html`: conteúdo, estrutura semântica e ilustrações vetoriais.
- `styles.css`: identidade visual, temas, animações e adaptações para celular.
- `script.js`: projetos, filtros, diálogos, menu, tema e formulário de briefing.
- `assets/`: fontes locais e suas licenças SIL Open Font License.

## Personalizar

### Contato comercial

No início de `script.js`, preencha `CONTACT` com seu WhatsApp comercial
(código do país + DDD + número, somente dígitos) e/ou e-mail.
O botão de envio só aparece se um contato válido estiver configurado.

O site não possui servidor de envio nem caixa de entrada. Por padrão, o formulário
valida os campos, mostra o briefing para revisão e permite copiar ou baixar o texto.
Se você configurar WhatsApp ou e-mail, o botão abre o aplicativo de destino com a
mensagem preparada; o visitante confirma o envio no próprio aplicativo.

### Fotos e logo

Os cartões da equipe usam retratos tipográficos originais com as iniciais G, M e L.
Para usar fotos, substitua o conteúdo decorativo de cada `.team-art` por uma imagem
com texto alternativo adequado e ajuste `object-fit: cover` no CSS.

O símbolo triangular e o wordmark são uma proposta visual para esta versão.
Podem ser substituídos pela logo oficial quando ela estiver definida.

### Projetos e textos

O objeto `PROJECTS`, em `script.js`, concentra os textos dos detalhes dos projetos.
Edite também os cartões em `index.html` para manter título, resumo e categoria alinhados.
Ao incluir um novo projeto, atualize as quantidades mostradas nos botões dos filtros.

As interfaces de Smart Class e Gestão Comercial são ilustrações criadas para o
portfólio, identificadas como tal. Elas não são capturas dos sistemas reais.
Não há métricas, depoimentos ou resultados comerciais inventados.

### Cores e fontes

As variáveis de `:root` definem o tema escuro. O seletor
`:root[data-theme="light"]` define o tema claro. A cor principal é `--accent`.
As fontes Space Grotesk e Space Mono estão incluídas localmente; o site não faz
requisições a provedores de fontes. As licenças devem acompanhar a redistribuição.

## Recursos incluídos

- Layout responsivo, menu móvel e navegação por âncoras.
- Modos claro e escuro, com preferência salva no navegador.
- Galeria com filtros e detalhes em diálogos nativos.
- Serviços em acordeões e seleção refletida no briefing.
- Validação do formulário, cópia e download de briefing em TXT.
- Animações de entrada, símbolo flutuante e cursor complementar no computador.
- Preferência de movimento reduzido, foco visível, link de salto e rótulos acessíveis.
- Relógio do estúdio com horário de Brasília.

## Publicar

Hospede o conteúdo desta pasta em um serviço de arquivos estáticos. Não é necessário
instalar dependências nem definir um comando de build. A pasta publicada deve conter
`index.html`, `styles.css`, `script.js` e `assets/` no mesmo nível.

A versão de produção está em https://tribyte-portifolio.vercel.app/.
Ela foi publicada na Vercel a partir dos arquivos deste repositório. A integração
GitHub–Vercel ainda não está configurada; novos commits não entram no ar automaticamente.
