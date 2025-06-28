# Automação Ambev Tech

Projeto de automação de testes E2E e API utilizando Cypress com suporte a validação de Swagger.

## 🏗️ Estrutura do Projeto

```
automacao_ambev_tech/
├── cypress/
│   ├── e2e/                    # Testes end-to-end
│   │   ├── auth/
│   │   │   ├── login.cy.js
│   │   │   └── cadastro.cy.js
│   │   ├── features/
│   │   │   ├── produtos.cy.js
│   │   │   └── usuarios.cy.js
│   │   └── workflows/
│   │       └── fluxo-completo.cy.js
│   ├── api/                    # Testes de API
│   │   ├── auth/
│   │   │   ├── login.cy.js
│   │   │   └── cadastro.cy.js
│   │   ├── endpoints/
│   │   │   ├── produtos.cy.js
│   │   │   └── usuarios.cy.js
│   │   └── swagger/
│   │       ├── swagger-validation.cy.js
│   │       └── contract-tests.cy.js
│   ├── fixtures/
│   │   ├── api/
│   │   │   ├── swagger.json
│   │   │   └── test-data.json
│   │   └── e2e/
│   │       └── test-data.json
│   ├── support/
│   │   ├── commands.js
│   │   ├── e2e.js
│   │   ├── api-commands.js
│   │   └── swagger-helper.js
│   └── utils/
│       ├── data-generator.js
│       └── api-validator.js
├── cypress.config.js
└── package.json
```

## 🚀 Como Executar

### Pré-requisitos
- Node.js (versão 14 ou superior)
- npm ou yarn

### Instalação
```bash
npm install
```

### Executar Testes

#### Todos os Testes
```bash
npm run test:all
```

#### Apenas Testes E2E
```bash
npm run test:e2e
```

#### Apenas Testes de API
```bash
npm run test:api
```

#### Apenas Validação de Swagger
```bash
npm run test:swagger
```

#### Modo Interativo
```bash
npm run cypress:open
```

#### Navegadores Específicos
```bash
npm run test:chrome
npm run test:firefox
npm run test:edge
```

## 📋 Tipos de Testes

### 1. Testes E2E (End-to-End)
- Localizados em `cypress/e2e/`
- Testam o fluxo completo da aplicação
- Simulam ações do usuário real
- Capturam screenshots e vídeos automaticamente

### 2. Testes de API
- Localizados em `cypress/api/`
- Testam endpoints diretamente
- Validação de status codes e respostas
- Autenticação e autorização

### 3. Validação de Swagger
- Localizados em `cypress/api/swagger/`
- Validam contratos da API
- Testam conformidade com documentação
- Geração automática de dados de teste

## 🛠️ Comandos Customizados

### Para API
- `cy.apiRequest()` - Requisição HTTP customizada
- `cy.apiLogin()` - Login via API
- `cy.apiCreateUser()` - Criar usuário via API
- `cy.authenticatedRequest()` - Requisição autenticada
- `cy.validateSwaggerSchema()` - Validar resposta contra Swagger

### Para E2E
- Comandos padrão do Cypress
- Screenshots automáticos em falhas
- Tratamento de exceções não capturadas

## 📊 Geração de Dados

O projeto utiliza `@faker-js/faker` para gerar dados de teste dinâmicos:

```javascript
import { DataGenerator } from '../utils/data-generator';

// Gerar usuário válido
const user = DataGenerator.generateValidUser();

// Gerar produto válido
const product = DataGenerator.generateValidProduct();

// Gerar email único
const email = DataGenerator.generateUniqueEmail();
```

## 🔧 Configuração

### Variáveis de Ambiente
- `apiBaseUrl`: URL base da API
- `swaggerUrl`: URL do arquivo Swagger
- `e2eBaseUrl`: URL base para testes E2E

### Configurações do Cypress
- Viewport: 1920x1080
- Screenshots automáticos em falhas
- Vídeos gravados automaticamente
- Tratamento de exceções não capturadas

## 📁 Organização dos Testes

### E2E
- `auth/`: Testes de autenticação
- `features/`: Testes de funcionalidades específicas
- `workflows/`: Testes de fluxos completos

### API
- `auth/`: Testes de autenticação
- `endpoints/`: Testes de endpoints específicos
- `swagger/`: Validação de contratos

## 🎯 Boas Práticas

1. **Separação de Responsabilidades**: E2E e API em pastas separadas
2. **Reutilização de Código**: Comandos customizados para operações comuns
3. **Dados Dinâmicos**: Uso do Faker para dados de teste
4. **Validação de Contratos**: Integração com Swagger
5. **Organização**: Estrutura clara e intuitiva
6. **Documentação**: README detalhado e comentários no código

## 📈 Relatórios

Os testes geram automaticamente:
- Screenshots em caso de falha
- Vídeos da execução
- Logs detalhados
- Relatórios de cobertura (se configurado)

## 🤝 Contribuição

1. Siga a estrutura de pastas estabelecida
2. Use os comandos customizados disponíveis
3. Mantenha os testes organizados por funcionalidade
4. Documente novos comandos ou helpers
5. Execute todos os testes antes de fazer commit

## Configuração

- **Base URL**: https://front.serverest.dev/login
- **Framework**: Cypress
- **Linguagem**: JavaScript
- **Geração de dados**: @faker-js/faker

## Dependências

```bash
# Dependências de desenvolvimento
cypress: ^14.5.0
@faker-js/faker: ^9.8.0
```

## Testes implementados

### Cadastro de usuário
- Validação de campos obrigatórios
- Verificação de mensagens de erro
- Navegação para tela de login
- Cadastro de usuário com sucesso
- Cadastro de usuário admin com sucesso

## Funcionalidades da aplicação

### 1. Usuário Administrador

#### 1.1 Navegação na Topbar
- **Home**: Página inicial do sistema
- **Cadastrar usuários**: Formulário para criar novos usuários
- **Listar usuários**: Visualização de todos os usuários cadastrados
- **Cadastrar produtos**: Formulário para adicionar novos produtos
- **Listar produtos**: Visualização de todos os produtos cadastrados
- **Relatórios**: Acesso a relatórios e estatísticas do sistema

#### 1.2 Interface do usuário
- **Bem-vindo**: Exibe "Bem vindo (Nome do usuário)" na interface
- **Cards de funcionalidades**: Apresenta cards visuais para cada funcionalidade do CRUD
- **Acesso completo**: Permissões totais para gerenciar usuários, produtos e visualizar relatórios

### 2. Usuário Não Administrador

#### 2.1 Navegação na Topbar
- **Home**: Página inicial do sistema
- **Lista de compras**: Visualização dos produtos disponíveis para compra
- **Carrinho**: Gerenciamento dos itens selecionados para compra

#### 2.2 Interface do usuário
- **Produtos disponíveis**: Visualização de todos os produtos cadastrados no sistema
- **Adicionar à lista**: Opção para adicionar produtos à lista de compras
- **Funcionalidades limitadas**: Acesso restrito apenas às funcionalidades de compra

## Geração de dados com Faker

O projeto utiliza a biblioteca **@faker-js/faker** para gerar dados aleatórios nos testes, garantindo:

- **Dados únicos**: Cada execução de teste usa dados diferentes
- **Realismo**: Dados que simulam informações reais de usuários
- **Flexibilidade**: Fácil geração de emails, nomes, senhas e outros dados

### Exemplo de uso do Faker:

```javascript
import { faker } from '@faker-js/faker';

// Gerar dados para teste
const userData = {
  nome: faker.person.fullName(),
  email: faker.internet.email(),
  senha: faker.internet.password()
};
```

## Melhorias sugeridas

### 1. Padronização de idioma
**Deixar como língua padrão o português ou inglês**

Exemplo de inconsistência atual:
- Mensagem de erro ao não preencher a senha no cadastro: "Password é obrigatório"

**Recomendações:**
- Padronizar todas as mensagens em português brasileiro
- Ou padronizar todas as mensagens em inglês
- Manter consistência em toda a aplicação

### 2. Melhorias de acessibilidade
- Adicionar atributos `aria-label` nos campos de formulário
- Implementar navegação por teclado
- Adicionar contraste adequado nas mensagens de erro

### 3. Melhorias de UX
- Adicionar validação em tempo real nos campos
- Implementar feedback visual mais claro para erros
- Adicionar tooltips explicativos nos campos obrigatórios

### 4. Melhorias de teste
- Adicionar testes para diferentes cenários de cadastro
- Implementar testes de regressão visual
- Adicionar testes de performance
- Criar testes para validação de formato de email
- Implementar testes para senha forte/fraca

### 5. Melhorias técnicas
- Implementar Page Object Model
- Adicionar relatórios de teste mais detalhados
- Configurar CI/CD pipeline
- Adicionar testes em diferentes navegadores
- Implementar testes de API

### 6. Documentação
- Criar documentação técnica detalhada
- Adicionar exemplos de uso
- Documentar padrões de teste utilizados

## Licença

Este projeto está sob a licença MIT. 