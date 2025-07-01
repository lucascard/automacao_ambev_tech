# Cenários de Teste

Este arquivo lista todos os cenários de teste implementados no projeto, organizados por arquivo.

## Testes E2E

### cypress/e2e/cadastro.cy.js
**Describe:** `Cadastro de usuário`

- `Cadastrar usuário comum com sucesso`
- `Cadastrar usuário admin com sucesso`
- `Cadastrar usuário com email já cadastrado`
- `Deve exibir mensagens de erro para campos obrigatórios`
- `Cadastrar usuário com email inválido - Sem o @`
- `Cadastrar usuário com email inválido - Sem texto depois do @`
- `Cadastrar usuário com email inválido - Email sendo texto@texto`
- `Ir para a tela de login`

### cypress/e2e/login.cy.js
**Describe:** `Login`

- `Login com sucesso - usuário comum`
- `Login com sucesso - usuário admin`
- `Login com credenciais inválidas`
- `Campos obrigatórios`
- `Email inválido`
- `Ir para a tela de cadastro`

## Testes de API

### cypress/api/usuarios.cy.js
**Describe:** `API - Usuários`

#### `Listar usuários`
- `deve listar todos os usuários`
- `deve permitir buscar usuário por query string`

#### `Cadastrar usuários`
- `Cadastrar usuário admin com sucesso`
- `Cadastrar usuário comum com sucesso`
- `Campos obrigatórios`
- `Email inválido`
- `Email já cadastrado`

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

**Total de Cenários:** 40 cenários de teste
- **E2E:** 14 cenários
- **API:** 26 cenários

*Nota: Este arquivo será atualizado conforme novos cenários forem implementados.* 