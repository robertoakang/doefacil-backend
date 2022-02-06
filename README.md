# doe.fácil-backend

O doe.fácil é uma aplicação destinada a facilitar o processo de doações à ONGS, instituições de caridade e semelhantes.
Esse repositório contém o back-end da aplicação desenvolvida em [Node.js](https://nodejs.org/), plataforma back-end que compila, otimizada e interpreta o código pela máquina virtual V8.

## Tecnologias

-   Node.js >= 14
-   NPM/Yarn
-   SQLite

## Como rodar a aplicação?

Para rodar a aplicação é preciso ter instalado em sua máquina algum gerenciador de dependências como [npm](https://nodejs.org/en/) ou [yarn](https://yarnpkg.com). Após isso, rodar os seguintes comandos:

```bash
npm install
# ou
yarn install
```

Uma vez instaladas, deverá ser configurado o `.env` da aplicação baseando-se no arquivo `.env.sample`:

```bash
cp .env.sample .env
```

Configurado e intalado, basta rodar a aplicação:

```bash
npm run dev
# ou
yarn dev
```

## Observações

Caso deseje testar o fluxo completo, é necessário que faça o clone da aplicação front-end disponível no [Github](https://github.com/robertoakang/doefacil-frontend)
