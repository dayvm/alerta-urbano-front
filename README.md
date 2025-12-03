# Alerta Urbano 🏙️

Projeto mobile-first desenvolvido para permitir que cidadãos reportem problemas urbanos (buracos, iluminação, lixo, etc.) em Recife/PE.

## 1. Tecnologias Utilizadas

* **Framework:** [Next.js 16](https://nextjs.org/) (App Router)
* **Estilização:** [Tailwind CSS v4](https://tailwindcss.com/)
* **Componentes UI:** [shadcn/ui](https://ui.shadcn.com/)
* **Mapas:** [React Leaflet](https://react-leaflet.js.org/) (OpenStreetMap)
* **Ícones:** Lucide React

## 2. Status do Projeto

O projeto está em fase de desenvolvimento de Front-end (MVP Visual). As seguintes telas já foram implementadas:

- [x] **Splash Screen:** Tela de abertura com temporizador de redirecionamento.
- [x] **Login:** Interface de login com suporte visual a autenticação social.
- [x] **Cadastro:** Formulário de registro de novos usuários.
- [x] **Home (Dashboard):** Tela principal com mapa interativo (Leaflet) e listagem de reports.
- [ ] **Novo Report:** Formulário para criar uma nova denúncia (Próximo passo).

## 3. Como Rodar o Projeto

### Pré-requisitos
* Node.js 18+ instalado.
* Gerenciador de pacotes (npm, pnpm ou yarn).

### Instalação

1.  Clone o repositório:
    ```bash
    git clone <url-do-repositorio>
    ```

2.  Instale as dependências:
    ```bash
    npm install
    # ou
    pnpm install
    ```

3.  Rode o servidor de desenvolvimento:
    ```bash
    npm run dev
    ```

4.  Acesse `http://localhost:3000` no seu navegador (de preferência em modo de inspeção mobile).

## 4. Estrutura de Temas (Tailwind v4)

Este projeto utiliza a **versão 4 do Tailwind CSS**.
As variáveis de cor e configurações de tema não estão em `tailwind.config.ts`, mas sim diretamente no arquivo CSS global.

* **Arquivo de Configuração:** `app/globals.css`
* **Cores Principais:**
    * `--splash-bg`: `#E3E9F0` (Fundo Cinza-Azulado)
    * `--brand-dark`: `#0F172A` (Azul Escuro/Navy)

## 5. Notas sobre o Mapa

Utilizamos **Leaflet** em vez de Google Maps para evitar custos e necessidade de chaves de API nesta fase.
O componente de mapa é carregado via `next/dynamic` (`ssr: false`) para evitar erros de renderização no servidor (o objeto `window` não existe no servidor).

---
Desenvolvido como parte de um projeto acadêmico.