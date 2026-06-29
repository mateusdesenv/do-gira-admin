# Do Gira Admin

Front-end em React para sistema administrativo inicial de um mini-mercado que também faz lanches.

## Stack

- React
- Vite
- CSS moderno responsivo
- localStorage para persistência inicial

## Como rodar

```bash
npm install
npm run dev
```

Acesse o endereço informado pelo Vite no terminal.

## Funcionalidades

- Login simples sem autenticação real
- Tela inicial de Atendimento
- Cadastro de vendas com seleção de cliente e produtos
- Vendas criadas inicialmente com status aberto
- Tabs de vendas em aberto e vendas finalizadas na tela de Atendimento
- Botão para finalizar venda após confirmação de pagamento
- Exibição das vendas em lista/tabela ou grid/cards
- Dashboard com total de produtos cadastrados
- CRUD de produtos com persistência em localStorage
- Cadastro de clientes com nome, CPF e endereço em localStorage
- Upload de imagem do produto em base64
- Alternância entre visualização em tabela/lista e grid/cards
- Menu lateral com Atendimento, Dashboard, Produtos, Clientes, Lanches e Configurações

## Chaves usadas no localStorage

- `do-gira:isLoggedIn`
- `do-gira:products`
- `do-gira:customers`
- `do-gira:sales`

## Instalação

```bash
npm install
npm run dev
```

Este pacote não inclui `node_modules`, `dist` nem `package-lock.json`. A instalação deve usar o registry público definido no arquivo `.npmrc`.
