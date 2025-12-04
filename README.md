# Alerta Urbano 🏙️

O **Alerta Urbano** é uma plataforma *mobile-first* desenvolvida para conectar cidadãos e instituições públicas. O objetivo é permitir que moradores de Recife/PE reportem problemas urbanos (buracos, iluminação, saneamento) e que gestores das instituições responsáveis (como Compesa, Emlurb, Neoenergia) gerenciem e resolvam essas ocorrências.

## 🚀 Funcionalidades Principais

### Para o Cidadão 👤
* **Geolocalização:** Identificação automática da localização no mapa.
* **Busca de Endereços:** Integração com *Nominatim API* para encontrar locais pelo nome.
* **Criação de Reports:** Envio de denúncias com título, descrição, categoria e **upload de fotos**.
* **Histórico:** Acompanhamento do status das suas ocorrências.
* **Interação:** Sistema de comentários para atualizar ou cobrar soluções.

### Para o Gestor (Instituição) 🛡️
* **Visão Filtrada:** O mapa exibe apenas ocorrências vinculadas à instituição do gestor.
* **Painel de Ação:** Botões exclusivos para alterar o status (*Em Análise* → *Resolvido*).
* **Métricas:** Visualização rápida do total de chamados e resoluções da instituição.

---

## 🛠️ Tecnologias Utilizadas

Este projeto utiliza uma stack moderna focada em performance e experiência do usuário (UX).

### Front-end
* **Framework:** [Next.js 16](https://nextjs.org/) (App Router)
* **Linguagem:** TypeScript
* **Estilização:** [Tailwind CSS v4](https://tailwindcss.com/)
* **Componentes UI:** [shadcn/ui](https://ui.shadcn.com/) + Lucide Icons
* **Mapas:** [React Leaflet](https://react-leaflet.js.org/) + OpenStreetMap
* **Gerenciamento de Estado:** [Zustand](https://github.com/pmndrs/zustand) (Auth) + [TanStack Query](https://tanstack.com/query/latest) (Server State)
* **Feedback Visual:** [Sonner](https://sonner.emilkowal.ski/) (Toasts/Notificações)

### Back-end & Infraestrutura
* **API:** Java Spring Boot
* **Banco de Dados:** PostgreSQL (Supabase)
* **Hospedagem:** Vercel (Front) e Render (Back)

---

## 📊 Status do Projeto

O projeto conta com integração completa Front-end + Back-end.

- [x] **Splash Screen:** Tela de abertura animada.
- [x] **Autenticação:** Login e Cadastro (Cidadão e Gestor).
- [x] **Home (Dashboard):** Mapa interativo com pinos customizados e busca de endereço.
- [x] **Novo Report:** Formulário com captura de coordenadas e upload de imagem.
- [x] **Detalhes da Ocorrência:**
    - [x] Visualização de dados e foto.
    - [x] Chat/Comentários em tempo real.
    - [x] **Gestor:** Alteração de status (Aberto/Em Análise/Resolvido).
- [x] **Perfil de Usuário:**
    - [x] Estatísticas (Reports criados vs. Resolvidos).
    - [x] Tela "Meus Dados" (Visualização de perfil).
    - [x] Histórico de Ocorrências (Filtro por usuário ou instituição).

---

## 💻 Como Rodar o Projeto

### Pré-requisitos
* Node.js 18+ instalado.
* Gerenciador de pacotes (npm, pnpm ou yarn).

### Instalação

1.  **Clone o repositório:**
    ```bash
    git clone <url-do-repositorio>
    cd alerta-urbano-front
    ```

2.  **Instale as dependências:**
    ```bash
    npm install
    # ou
    pnpm install
    ```

3.  **Configuração de Ambiente:**
    Este projeto conecta-se a uma API remota. Certifique-se de que o arquivo `next.config.mjs` esteja configurado para aceitar imagens do domínio do backend.

4.  **Rode o servidor de desenvolvimento:**
    ```bash
    npm run dev
    ```

5.  **Acesse:** Abra `http://localhost:3000` no navegador.
    > **Dica:** Utilize o modo de inspeção do navegador (F12 > Ícone de Celular) para visualizar o layout mobile corretamente.

---

## 🎨 Design System

* **Configuração:** `app/globals.css` (Tailwind v4 Variables)
* **Paleta Principal:**
    * `--brand-dark`: `#0F172A` (Navy - Cabeçalhos e Gestão)
    * `--splash-bg`: `#E3E9F0` (Background Geral)
    * `--primary`: `#1abeb3` (Turquesa - Ações do Cidadão)

---

## 🗺️ Notas sobre o Mapa

Utilizamos **Leaflet** e **Nominatim API** (OpenStreetMap) para renderização e busca de endereços, eliminando a necessidade de chaves de API pagas (Google Maps) nesta fase do projeto. O componente de mapa é carregado via `next/dynamic` para compatibilidade com SSR.

---
Desenvolvido como parte de um projeto acadêmico.

## Equipe

* ** Ailton Santos
* ** Arthur Azevedo
* ** David Mendes
* ** Dayvson da Conceição
* ** Hallason Matias
* ** Julia Muniz
* ** Victor Paraizo
* ** Wilson Pereira

