# Cenários de Teste

Este arquivo lista todos os cenários de teste implementados no projeto, organizados por arquivo.

## Testes E2E

### cypress/e2e/cadastro.cy.js
**Describe:** `Cadastro de usuário`

- `Cadastrar usuário comum com sucesso`
- `Cadastrar usuário admin com sucesso`
- `Cadastrar usuário com email já cadastrado`
- `Deve exibir mensagens de erro para campos obrigatórios`
- `Campo email deve ser do tipo email`
- `Botão entrar redireciona para a tela de login`
- `Não deve cadastrar duas vezes ao clicar rapidamente` *(pendente)*

### cypress/e2e/login.cy.js
**Describe:** `Login`

- `Login com sucesso - usuário comum`
- `Login com sucesso - usuário admin`
- `Login com credenciais inválidas`
- `Deve retornar erro ao não preencher os campos obrigatórios`
- `Campo email deve ser do tipo email`
- `Botão Cadastre-se redireciona para a tela de cadastro`

### cypress/e2e/produtos.cy.js
**Describe:** `Produtos`

- `Adicionar um produto a lista de compra e depois ao carrinho`
- `Limpar a lista de compra`
- `Pesquisar por um produto`

## Testes de API

### cypress/api/usuarios.cy.js
**Describe:** `API - Usuários`

#### `Listar usuários`
- `deve listar todos os usuários`
- `deve permitir buscar usuário por query string`

#### `Cadastrar usuários`
- `Cadastrar usuário admin com sucesso`
- `Cadastrar usuário comum com sucesso`
- `Deve retornar erro ao não preencher os campos obrigatórios`
- `Deve retornar erro ao informar email inválido`
- `Deve retornar erro ao tentar cadastrar usuário com email já cadastrado`

#### `Buscar usuário por ID`
- `deve buscar usuário existente com sucesso`
- `deve retornar erro para ID inexistente`
- `deve retornar erro para ID inválido`
- `deve retornar todos os usuários quando ID está vazio`
- `deve retornar erro para ID com caracteres especiais`
- `deve buscar usuário admin e verificar propriedades`

#### `Excluir usuário por ID`
- `deve excluir usuário comum com sucesso`
- `deve excluir usuário admin com sucesso`
- `deve retornar erro para ID inexistente`
- `deve retornar erro para ID vazio`

#### `Editar usuário por ID`
- `deve editar usuário existente com sucesso`
- `deve editar apenas o nome do usuário`
- `deve editar apenas o email do usuário`
- `deve editar apenas o status de administrador`
- `deve cadastrar novo usuário quando ID não existe`
- `deve retornar erro para email já existente`
- `deve retornar erro ao tentar editar usuário sem campos obrigatórios`

### cypress/api/produtos.cy.js
**Describe:** `API - Produtos`

- `deve listar todos os produtos`
- `deve buscar produto por ID`
- `deve buscar produto por nome`
- `deve buscar produto por preço`
- `deve buscar produto por descrição`
- `deve buscar produto por quantidade`
- `deve buscar produto com múltiplos filtros combinados`
- `deve retornar lista vazia ao buscar produto inexistente`

### cypress/api/login.cy.js
**Describe:** `API - Autenticação`

- `deve logar com sucesso`
- `deve retornar erro com credenciais inválidas`
- `campos obrigatórios`

---

**Total de Cenários:** 51 cenários de teste
- **E2E:** 17 cenários (16 ativos + 1 pendente)
- **API:** 34 cenários

## Funcionalidades Testadas

### E2E - Interface do Usuário
- **Cadastro de Usuários:** Validação de formulários, criação de usuários comuns e administradores, tratamento de erros
- **Login:** Autenticação de usuários, validação de credenciais, redirecionamentos
- **Produtos:** Gerenciamento de lista de compras, pesquisa de produtos, navegação entre páginas

### API - Endpoints
- **Usuários:** CRUD completo (Create, Read, Update, Delete), validações de campos, tratamento de erros
- **Produtos:** Consultas com filtros, busca por diferentes critérios, validação de respostas
- **Autenticação:** Login via API, validação de tokens, tratamento de credenciais inválidas

*Nota: Este arquivo será atualizado conforme novos cenários forem implementados.* 