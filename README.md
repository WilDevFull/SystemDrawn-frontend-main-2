# SystemDrawn Frontend

Site do projeto **SystemDrawn**, desenvolvido em **React + Vite + TypeScript**, responsável pela interface web e pela integração com a API Backend para gerenciamento de agendamentos de **tatuagem** e **piercing**, além da **simulação de tatuagem com Inteligência Artificial**.

> O projeto começou como aplicativo mobile (React Native + Expo) e foi migrado para web. O app nativo e a configuração do Expo foram removidos.

## Integrantes da Equipe

| Nome | RA |
|------|----|
| Alyson Rafael Reis Arruda de Lima | 00000853753 | **
| Helleson Allan Borges de Sant'Ana | 00000855659 | **
| João Victor Oliveira da Silva | 00000855670 |
| Matheus Soares de Lima | 00000855273 |
| Saíra Aguiar Rocha | 00000851069 |
| Thiago Carvalho de Castro | 00000014830 |
| Wilson Pereira de Lima | 00000855225 | **

> **Observação:** Alyson, Helleson e Wilson não partipam da disciplina de AOS, mas contribuiram com o projeto.

---

# Tecnologias Utilizadas

- React 19
- Vite
- TypeScript
- React Router
- Zustand (estado global e sessão)
- Axios
- Google reCAPTCHA v2 (`react-google-recaptcha`), a caixinha "Não sou um robô" do login e do cadastro
- Lucide React (ícones)
- React Native Web (renderiza as telas de agendamento, perfil e notificações no navegador)

---

# Áreas do Site

| Área | Rotas | Acesso |
|------|-------|--------|
| Pública | `/` | Livre |
| Autenticação | `/login`, `/cadastro`, `/admin-login` | Livre (usuário já logado é redirecionado) |
| Cliente | `/home`, `/piercings`, `/historico`, `/joias`, `/artes`, `/meus-agendamentos`, `/notificacoes`, `/perfil`, `/configuracoes`, `/agendamento-piercing/*`, `/agendamento-tatuagem/*` | Requer login |
| Administrador | `/admin`, `/admin/agenda`, `/admin/aprovacoes` | Requer login de administrador (CPF e senha) |

O login de administrador fica no menu **Login** do cabeçalho ("Sou cliente" / "Sou administrador").

---

# Funcionalidades Implementadas

## Autenticação

- Cadastro de usuário
- Login com CPF
- Login de administrador com CPF e senha
- reCAPTCHA v2 ("Não sou um robô") no login do cliente e do administrador e no cadastro (veja [reCAPTCHA no Login e no Cadastro](#recaptcha-no-login-e-no-cadastro))
- Persistência da sessão (`localStorage`)
- Logout

## Agendamento de Tatuagem

- Escolha do local, tamanho, estilo, data e horário
- Resumo do agendamento

> A API de tatuagem ainda não existe: o resumo não grava o agendamento no backend.

## Agendamento de Piercing

- Escolha do tipo de piercing, joia, data e horário
- Confirmação do agendamento via API

## Simulador Tatoo (simulação de tatuagem com IA)

Tela **Simulador Tatoo** (rota `/artes`, requer login; no menu aparece como "Simulador Tatoo"). O cliente mostra a tatuagem que quer de um de dois jeitos, enviando o desenho ou descrevendo em texto, escolhe onde no corpo e vê uma foto realista desse membro já tatuado, gerada por Inteligência Artificial do **Hugging Face**.

### Dois jeitos de criar a simulação

| Jeito | Como escolher | O que vai para a IA |
|-------|---------------|---------------------|
| **Enviar desenho** (padrão) | Chave "Gerar por descrição em texto" desligada | Desenho, membro e estilo (opcional). Usa o **ControlNet** |
| **Descrever em texto** | Chave "Gerar por descrição em texto" ligada | Descrição (de 3 a 300 letras) e membro. Usa o **FLUX.1-schnell** |

Com a chave **ligada**, o botão de enviar imagem fica **desativado** (aparece "Envio de imagem desativado"), o quadro de orientação fica apagado e o campo de estilo some, para os dois jeitos não se misturarem. Ao **desligar**, tudo volta a funcionar, inclusive o desenho que já tinha sido escolhido.

### Como o cliente usa, enviando o desenho

1. **Lê o quadro "Use uma imagem sem fundo".** Ele explica que o ideal é um PNG com fundo transparente ou o desenho sobre um fundo branco liso, sem parede, papel, mesa ou sombras em volta.
2. **Seleciona o desenho.** Clica em **"1. Selecionar desenho da tatuagem"** e escolhe uma imagem do computador ou do celular. Se a imagem parecer ter fundo, aparece um **aviso amarelo** logo abaixo do botão. É só um alerta: o envio continua liberado.
3. **Escolhe o membro do corpo.** São 6 botões: **Braço, Perna, Costas, Peito, Pescoço e Mão** (os mesmos da tela de agendamento). O botão escolhido fica roxo e com um ✓.
4. **Descreve o estilo (opcional).** O campo **Estilo** já vem com `black ink tattoo` (tatuagem em tinta preta). Em inglês o resultado fica melhor. Para uma tatuagem colorida, escreva as cores aqui, por exemplo `colorful watercolor tattoo, red and blue`.
5. **Clica em "4. Gerar simulação em: (membro)".** Enquanto a IA trabalha, o botão mostra "Gerando a simulação (pode levar até 2 minutos)..." e os outros botões ficam travados.
6. **Vê o resultado.** O site mostra lado a lado o **"Seu desenho"** e o **"Resultado da IA em: (membro)"**. Se o resultado ficar fora da tela (como no celular), a página rola sozinha até ele.

### Como o cliente usa, descrevendo em texto

1. **Liga a chave "Gerar por descrição em texto".**
2. **Escreve a descrição** no campo **"1. Descreva a tatuagem que você quer"**, por exemplo `leão com coroa e rosas, traço fino`. O contador mostra quantas letras faltam até o limite de 300. Português funciona, mas em inglês o resultado costuma ser melhor: em "leão com rosa", por exemplo, a IA pode entender "rosa" como a cor e não como a flor.
3. **Escolhe o membro do corpo**, como no outro jeito.
4. **Clica em "3. Gerar simulação em: (membro)".** O botão só libera quando a descrição tem pelo menos 3 letras.
5. **Vê o resultado** "Resultado da IA em: (membro)".

Depois disso, nos dois jeitos, o botão **"Ir para Agendamento"** leva o cliente para agendar a tatuagem.

### O que o site faz por trás

- **Diminui o desenho antes de enviar:** a imagem é reduzida para no máximo 768 px e convertida para JPEG, para o envio ficar leve. Se o desenho tiver fundo transparente, esse fundo vira branco (senão viraria um quadrado preto).
- **Confere se a imagem tem fundo:** olha a borda da imagem (4% de cada lado). Se mais de 20% dessa borda não for branca nem transparente, mostra o aviso amarelo.
- **Envia para o backend:** no jeito com desenho, chama `POST /simulacao` com o desenho (`imagemTatuagemBase64`), o membro (`membro`) e o estilo (`promptText`). No jeito com texto, chama `POST /simulacao/texto` com a descrição (`descricao`) e o membro (`membro`). Toda a parte da IA acontece no backend, e a explicação completa está no README do backend.
- **Espera até 150 segundos:** a simulação pode demorar, então essas chamadas esperam mais que os 15 segundos das outras chamadas da API.
- **Mostra erros claros:** se algo der errado, aparece uma caixa vermelha com a mensagem do backend (por exemplo, "O limite gratuito da IA acabou por hoje") ou um aviso de que a IA demorou demais ou de que o servidor não respondeu.
- **Evita resultados trocados:** se o cliente troca o desenho, o membro ou liga/desliga a chave de texto, o resultado antigo sai da tela, e uma resposta atrasada de um pedido antigo é ignorada.

### Arquivos da funcionalidade

| Arquivo | O que faz |
|---------|-----------|
| `src/pages/user/artes.tsx` | Tela Simulador Tatoo: chave de texto, orientação de imagem sem fundo, aviso de fundo, escolha do desenho ou da descrição, do membro e do estilo, e exibição do resultado |
| `src/services/simulacao.service.ts` | Lista dos 6 membros, limites da descrição (3 a 300 letras) e chamadas `POST /simulacao` e `POST /simulacao/texto` ao backend |
| `src/layouts/UserLayout.tsx` | Menu do cliente, onde a tela aparece como "Simulador Tatoo" |

### Para funcionar

- O **backend** precisa estar rodando (`npm run dev` na pasta do backend) com o token do Hugging Face (`HUGGINGFACE_API_KEY`) no `.env` dele.
- O site precisa apontar para esse backend: configure `VITE_API_URL=http://localhost:3000` (veja [Configurar a URL da API](#configurar-a-url-da-api)). Sem isso, o site usa o backend publicado no Vercel, que só terá a simulação por texto (`POST /simulacao/texto`) depois que o backend novo for publicado.
- A conta gratuita do Hugging Face permite aproximadamente **10 simulações por dia**, somando os dois jeitos. Quando o limite acaba, o site mostra o aviso e é preciso esperar o dia seguinte.

## Meus Agendamentos

- Listagem dos agendamentos
- Reagendamento
- Cancelamento (com confirmação)

## Notificações

- Listagem, marcar como lida (uma ou todas), remover e contador

## Perfil

- Visualização dos dados do usuário e configurações da conta

## Administrador

O administrador entra pelo menu **Login → Sou administrador**, com CPF e senha. O backend confere os dois e só libera quem tem perfil de administrador. Todas as telas abaixo usam os dados reais do backend.

- **Dashboard** (`/admin`): números de hoje (agendamentos, pendentes, confirmados e cancelados) e a divisão entre tatuagem e piercing.
- **Agenda do dia** (`/admin/agenda`): os agendamentos de um dia, em ordem de horário. Os botões **Anterior** e **Próximo** trocam o dia, e **Voltar para hoje** volta para o dia atual.
- **Aprovações** (`/admin/aprovacoes`): os pedidos pendentes. **Aprovar** pede confirmação antes. **Recusar** pergunta um motivo, que é opcional e vai para o cliente.

> Finanças, estoque e metas do Dashboard ainda são simulados, porque não existem no backend. O selo "Agenda real · finanças simuladas" lembra isso na tela.

### Arquivos da funcionalidade

| Arquivo | O que faz |
|---------|-----------|
| `src/pages/admin/login.tsx` | Login do administrador com CPF, senha e reCAPTCHA |
| `src/pages/admin/dashboard.tsx` | Painel com os números do dia |
| `src/pages/admin/agenda.tsx` | Agenda do dia, com troca de dia |
| `src/pages/admin/aprovacoes.tsx` | Aprovar e recusar pedidos |
| `src/pages/admin/appointments.ts` | Nomes dos status e carregamento da agenda |
| `src/services/admin.service.ts` | Chamadas às rotas `/admin` do backend |

### Para funcionar

- O administrador precisa ser criado no backend com `npm run definir-admin` (explicado no README do backend).
- Para testar no seu computador, use `http://localhost:5173`. Se abrir o site por um endereço que o navegador considera de internet (por exemplo, o de uma VPN), o Chrome bloqueia as chamadas para o backend em `localhost`.

## reCAPTCHA no Login e no Cadastro

As telas de login do cliente (`/login`) e do administrador (`/admin-login`) e a tela de cadastro (`/cadastro`) mostram a caixinha **"Não sou um robô"** do Google reCAPTCHA v2, em português. Ela barra robôs que tentam entrar testando vários CPFs ou senhas e robôs que tentam criar contas falsas em massa.

### Como funciona, passo a passo

1. **A pessoa marca a caixinha.** Às vezes o Google também pede um desafio de imagens, como "selecione todas as imagens com faixas de pedestre".
2. **O Google devolve um comprovante** (`recaptchaToken`) e o botão de entrar ou de cadastrar é liberado.
3. **O site envia o comprovante junto com o pedido**: no login, em `POST /auth/login` (com o `cpf`) ou `POST /auth/admin/login` (com o `cpf` e a `senha`), e no cadastro, em `POST /auth/register` (com o `cpf` e o `nomeCompleto`).
4. **O backend confere o comprovante com o Google** usando a chave secreta e só faz o login ou o cadastro se o Google confirmar.
5. **Se o login ou o cadastro der erro, a caixinha é desmarcada**, porque cada comprovante vale uma vez só. Ela também se desmarca sozinha quando o comprovante vence, depois de uns 2 minutos.

> O próprio Google decide quando mostrar o desafio de imagens. Quem parece humano costuma passar só com o clique.

### As duas chaves

As chaves são criadas juntas, em par, no painel do reCAPTCHA (https://www.google.com/recaptcha/admin/create), escolhendo **Desafio (v2)** e depois **Caixa de seleção "Não sou um robô"**. Em **Domínios**, coloque `localhost` para testar no computador e o domínio do site publicado.

| Chave | Onde fica | É secreta? |
|-------|-----------|------------|
| **Chave do site** | `.env` do frontend, na variável `VITE_RECAPTCHA_SITE_KEY` | Não. Ela é pública e aparece no código da página |
| **Chave secreta** | `.env` do backend, na variável `RECAPTCHA_SECRET_KEY` | Sim. Nunca coloque no frontend nem envie para o GitHub |

### Arquivos da funcionalidade

| Arquivo | O que faz |
|---------|-----------|
| `src/pages/auth/login.tsx` | Login do cliente: mostra a caixinha, guarda o comprovante e desmarca a caixinha se o login der erro |
| `src/pages/admin/login.tsx` | Login do administrador, com o mesmo comportamento |
| `src/pages/auth/cadastro.tsx` | Cadastro do cliente, com o mesmo comportamento |
| `src/services/auth.service.ts` | Envia o `recaptchaToken` junto com o login e o cadastro |
| `.env.example` | Modelo do `.env`, com a variável `VITE_RECAPTCHA_SITE_KEY` vazia |

### Para funcionar

- Crie o `.env` com a chave do site (veja [Configurar o reCAPTCHA](#configurar-o-recaptcha)).
- O **backend** precisa estar com a `RECAPTCHA_SECRET_KEY` no `.env` dele (explicado no README do backend), e o site precisa apontar para ele (veja [Configurar a URL da API](#configurar-a-url-da-api)).
- Abra o site por `http://localhost:5173`. Pelo endereço de rede que o Vite também mostra (como `http://192.168.1.2:5173`), a caixinha dá erro, porque esse endereço não está na lista de domínios da chave.

### Erros comuns

| O que aparece | Por quê | Como resolver |
|---------------|---------|---------------|
| `ERROR for site owner: Invalid key type` na caixinha | A chave não é do tipo v2 com caixinha (por exemplo, é uma chave v3) | Criar uma chave **Desafio (v2)** com **Caixa de seleção** e trocar as duas chaves |
| `ERROR for site owner: Invalid domain for site key` na caixinha | O endereço aberto não está na lista de domínios da chave, como o IP da rede `192.168.x.x` | Abrir por `http://localhost:5173` ou adicionar o domínio na chave |
| A caixinha não aparece ou mostra `Invalid site key` | Falta o `.env`, a chave está errada ou o `npm run dev` não foi reiniciado | Conferir o `.env` e reiniciar o `npm run dev` |
| "Não foi possível confirmar que você não é um robô." | O Google recusou o comprovante: ele venceu, já foi usado ou a chave secreta do backend não é o par da chave do site | Marcar a caixinha de novo. Se sempre acontecer, conferir se as duas chaves são do mesmo par |
| "A verificação do reCAPTCHA não está configurada." | Falta a `RECAPTCHA_SECRET_KEY` no backend | Colocar a chave secreta no `.env` do backend, ou na Vercel no site publicado |

### Publicação com reCAPTCHA

1. **Domínio:** no painel do reCAPTCHA, abra a chave e adicione na lista de domínios o endereço do **site (frontend)**, e não o da API. Coloque só o nome, sem `https://` e sem barra, por exemplo `seu-site.vercel.app`. A mudança pode levar até 30 minutos para valer.
2. **Chave do site:** cadastre `VITE_RECAPTCHA_SITE_KEY` nas variáveis de ambiente da hospedagem do frontend (na Vercel, em **Settings → Environment Variables**) e publique de novo. O Vite coloca a chave dentro do site na hora do `npm run build`, então sem um novo deploy ela não entra.
3. **Chave secreta:** cadastre `RECAPTCHA_SECRET_KEY` no backend publicado.
4. **Ordem:** publique primeiro o frontend, que já manda o comprovante, e depois o backend, que passa a exigir. Na ordem contrária, o login e o cadastro ficam bloqueados nesse intervalo.

> Boa prática: usar uma chave só para testes (com `localhost`) e outra só para produção (só com o domínio do site).

---

# Estrutura do Projeto

```text
SYSTEMDRAWN-FRONTEND
├── src
│   ├── assets            # imagens e fontes
│   ├── components        # componentes compartilhados (header, rodapé, ícones, calendário)
│   ├── layouts           # PublicLayout, AuthLayout, UserLayout, AdminLayout
│   ├── lib               # navegação e alertas do navegador
│   ├── pages
│   │   ├── public        # home
│   │   ├── auth          # login, cadastro, splash
│   │   ├── user          # telas do cliente e fluxos de agendamento
│   │   └── admin         # login, aprovações e agenda
│   ├── routes            # rotas, guards de acesso e carregamento lazy das telas
│   ├── services          # chamadas à API (axios)
│   ├── store             # stores Zustand
│   ├── styles            # CSS global
│   ├── utils             # utilitários (datas civis)
│   ├── App.tsx
│   └── main.tsx
├── .env.example          # modelo do .env (chave do site do reCAPTCHA)
├── index.html
├── vite.config.ts
├── tsconfig.json
├── package.json
├── sonar-project.properties
├── LICENSE
└── README.md
```

---

# Execução Local

## Pré-requisitos

- Node.js 20.19 ou superior (exigência do Vite 7)
- npm

## Instalar dependências

```bash
npm install
```

## Configurar a URL da API

O `baseURL` é definido em `src/services/api.ts` e lê a variável `VITE_API_URL`. Se ela não existir, o frontend usa o backend publicado no Vercel.

Para usar o seu backend (local ou Codespace), edite o arquivo `.env.local` da raiz, versionado como exemplo:

1. Descomente a linha `VITE_API_URL` (apague o `#`) e informe a URL, sem `/` no final:

   ```
   VITE_API_URL=http://localhost:3000
   ```

2. Reinicie o `npm run dev`, pois o Vite lê as variáveis só ao iniciar.
3. Confira na aba Network do navegador se as chamadas vão para a nova URL.

> Não commite a linha `VITE_API_URL` descomentada, para não apontar todos para uma URL pessoal.

## Configurar o reCAPTCHA

O login e o cadastro usam a chave do site do reCAPTCHA v2, que fica no arquivo `.env` da raiz:

1. Faça uma cópia do arquivo `.env.example` e dê a ela o nome `.env`.
2. Preencha a linha com a chave do site (veja [As duas chaves](#as-duas-chaves)):

   ```
   VITE_RECAPTCHA_SITE_KEY=sua_chave_do_site
   ```

3. Reinicie o `npm run dev`, pois o Vite lê as variáveis só ao iniciar.

> O `.env` está no `.gitignore` e não vai para o GitHub, então cada pessoa da equipe cria o seu. Coloque ali só a chave do site: a chave secreta fica no `.env` do backend.

## Comandos

| Comando | Descrição |
|---------|-----------|
| `npm run web` (ou `npm run dev`) | Inicia o servidor de desenvolvimento em `http://localhost:5173` |
| `npm run typecheck` | Verifica os tipos com o TypeScript |
| `npm run build` (ou `npm run build:web`) | Verifica os tipos e gera a versão de produção em `dist/` |
| `npm run preview` (ou `npm run preview:web`) | Serve a build de `dist/` para conferência (rode `npm run build` antes) |

O servidor de desenvolvimento escuta em `0.0.0.0`, então também pode ser acessado por outros dispositivos da mesma rede ou pela porta encaminhada do Codespaces.

> O reCAPTCHA só funciona nos endereços cadastrados na chave. Pelo endereço de rede (`http://192.168.x.x:5173`), a caixinha mostra "Invalid domain for site key". Para testar no computador, use `http://localhost:5173`.

## Publicação

A pasta `dist/`, gerada por `npm run build`, contém arquivos estáticos que podem ser publicados em qualquer hospedagem. Como o site usa rotas no navegador (React Router), configure a hospedagem para devolver o `index.html` em qualquer rota.

Para o login e o cadastro funcionarem no site publicado, configure também o reCAPTCHA na hospedagem antes do deploy (veja [Publicação com reCAPTCHA](#publicação-com-recaptcha)).

---

# Observações Técnicas

- Datas de agendamento são tratadas como datas civis (`YYYY-MM-DD`) em `src/utils/civilDate.ts`, sem conversão de fuso horário.
- A sessão (usuário, token e perfil) é guardada no `localStorage` na chave `systemdrawn-auth`. Respostas `401` da API encerram a sessão.
- As chamadas à API esperam no máximo 15 segundos (`src/services/api.ts`). A simulação de tatuagem com IA é a exceção: espera até 150 segundos (`src/services/simulacao.service.ts`).
- As rotas de administrador são protegidas na interface e também no backend, que confere o perfil `admin` dentro do token.
- As telas de agendamento ainda usam componentes do React Native Web. A conversão para HTML/CSS puro é uma etapa futura.
- A anamnese ainda não existe.

---

# Status do Projeto

🚧 Em desenvolvimento.

---

# Licença

ISC
