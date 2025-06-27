# Testes Automatizados

Este arquivo documenta todos os testes automatizados implementados no projeto.

## Testes de Cadastro de Usuário

### Testes Implementados

#### 1. Cadastrar usuário com sucesso
- **Arquivo**: `cypress/e2e/cadastro.cy.js`
- **Descrição**: Testa o cadastro de um usuário normal com dados válidos
- **Cenário**: 
  - Preenche nome, email e senha aleatórios
  - Clica em cadastrar
  - Valida mensagem de sucesso
  - Valida redirecionamento para home

#### 2. Cadastrar usuário admin com sucesso
- **Arquivo**: `cypress/e2e/cadastro.cy.js`
- **Descrição**: Testa o cadastro de um usuário administrador
- **Cenário**:
  - Preenche nome, email e senha aleatórios
  - Marca opção "Cadastrar como administrador"
  - Valida redirecionamento para home
  - Valida presença dos elementos da topbar de admin
  - Valida mensagem de bem-vindo

#### 3. Usuário já cadastrado
- **Arquivo**: `cypress/e2e/cadastro.cy.js`
- **Descrição**: Testa tentativa de cadastro com email já existente
- **Cenário**:
  - Preenche dados de usuário já cadastrado
  - Valida response 400 da API
  - Valida mensagem "Este email já está sendo usado"

#### 4. Validação de campos obrigatórios
- **Arquivo**: `cypress/e2e/cadastro.cy.js`
- **Descrição**: Testa validação quando campos não são preenchidos
- **Cenário**:
  - Clica em cadastrar sem preencher campos
  - Valida response 400 da API com mensagens específicas
  - Valida exibição das mensagens de erro na interface

#### 5. Navegação para tela de login
- **Arquivo**: `cypress/e2e/cadastro.cy.js`
- **Descrição**: Testa navegação entre telas
- **Cenário**:
  - Clica no botão "entrar"
  - Valida redirecionamento para tela de login

### Testes Pendentes de Implementação

#### 6. Tentativa de cadastro com email já em uso (diferente tipo de usuário)
- **Descrição**: Testa tentativa de cadastro com email já existente, mas com tipo de usuário diferente (admin vs normal)
- **Cenário**:
  - Cadastrar usuário normal com email X
  - Tentar cadastrar usuário admin com mesmo email X
  - Validar comportamento do sistema
- **Status**: [ ] Pendente de implementação

## Estrutura dos Testes

### Intercepts Configurados
- `POST https://serverest.dev/usuarios` - Captura requisições de cadastro

### Validações de Response
- Status code 400 para erros de validação
- Mensagens específicas para cada tipo de erro
- Validação da interface do usuário

### Dados Utilizados
- Dados aleatórios via Faker.js para testes de sucesso
- Dados fixos do arquivo `massas.md` para testes específicos

## Execução dos Testes

```bash
# Executar todos os testes
npx cypress run

# Executar testes de cadastro
npx cypress run --spec "cypress/e2e/cadastro.cy.js"

# Executar em modo interativo
npx cypress open
```

---

*Nota: Este arquivo será atualizado conforme novos testes forem implementados.* 